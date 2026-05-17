import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { createSosAlert, getUserSosAlerts } from "../services/sosService";
import { getCurrentLocation } from "../services/locationService";
import {
  addTrustedContact,
  getTrustedContacts,
} from "../services/contactService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [sosLoading, setSosLoading] = useState(false);
  const [sosMessage, setSosMessage] = useState("");

  const [contacts, setContacts] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    relation: "",
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  const [sosAlerts, setSosAlerts] = useState([]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchContacts = async () => {
    if (!currentUser) return;

    const data = await getTrustedContacts(currentUser.uid);
    setContacts(data);
  };

  const fetchSosAlerts = async () => {
    if (!currentUser) return;

    const data = await getUserSosAlerts(currentUser.uid);
    setSosAlerts(data);
  };

  const handleSosAlert = () => {
    setSosLoading(true);
    setSosMessage("");

    if (!navigator.geolocation) {
      setSosLoading(false);
      setSosMessage("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          await createSosAlert(currentUser, location);

          setSosMessage("SOS alert created successfully!");
          fetchSosAlerts();
        } catch (error) {
          console.log("SOS ERROR:", error.message);
          setSosMessage("Failed to create SOS alert.");
        } finally {
          setSosLoading(false);
        }
      },
      (error) => {
        console.log("LOCATION ERROR:", error.message);
        setSosLoading(false);
        setSosMessage("Location permission denied.");
      },
    );
  };

  const handleAddContact = async (e) => {
    e.preventDefault();

    await addTrustedContact(
      currentUser.uid,
      contactForm.name,
      contactForm.phone,
      contactForm.relation,
    );

    setContactForm({
      name: "",
      phone: "",
      relation: "",
    });

    fetchContacts();
  };

  const handleGetLocation = async () => {
    setLocationError("");

    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      setLocationError(error);
    }
  };

  const handleCopyEmergencyMessage = async (sosAlert) => {
    const message = `🚨 EMERGENCY ALERT!

I need help immediately.

My current location:
https://www.google.com/maps?q=${sosAlert.latitude},${sosAlert.longitude}

User: ${currentUser?.email}

Please contact me or emergency services as soon as possible.`;

    try {
      await navigator.clipboard.writeText(message);
      window.alert("Emergency message copied!");
    } catch (error) {
      console.log("COPY ERROR:", error.message);
      window.alert("Failed to copy emergency message.");
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchSosAlerts();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
      <nav className="bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-rose-600">
              NariKavach
            </h1>
            <p className="text-sm text-gray-600">
              AI-powered women safety dashboard
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="bg-white text-rose-600 px-5 py-2 rounded-xl font-medium shadow-md hover:bg-rose-50 transition"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-medium shadow-md transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/40">
            <p className="text-sm font-semibold text-rose-600">Safety Status</p>

            <h2 className="text-4xl font-bold text-gray-900 mt-3">
              Welcome Back 👋
            </h2>

            <p className="text-gray-600 mt-3 text-lg">
              Your emergency assistance dashboard is active and ready.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-semibold text-gray-800 break-all">
                  {currentUser?.email}
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <p className="text-sm text-gray-500">Protection Mode</p>
                <p className="font-semibold text-green-600">Active & Secured</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl shadow-2xl p-8 text-white flex flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-red-100">
                Emergency Action
              </p>

              <h3 className="text-3xl font-extrabold mt-3">SOS Alert</h3>

              <p className="text-red-100 mt-3">
                Use this only when you need immediate help.
              </p>
            </div>

            <button
              onClick={handleSosAlert}
              disabled={sosLoading}
              className="mt-8 bg-white text-red-600 hover:bg-red-50 py-4 rounded-2xl text-xl font-extrabold shadow-lg transition hover:scale-105 disabled:opacity-60"
            >
              {sosLoading ? "Sending SOS..." : "🚨 Trigger SOS"}
            </button>

            {sosMessage && (
              <p className="mt-4 text-red-100 font-semibold">{sosMessage}</p>
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-6 gap-6 mt-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">📍</div>

            <h3 className="font-bold text-gray-900 mt-4">Live Location</h3>

            <p className="text-sm text-gray-500 mt-2">
              View your current location and open it in Google Maps.
            </p>

            <button
              onClick={handleGetLocation}
              className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold transition"
            >
              Get Location
            </button>

            {currentLocation && (
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>Lat: {currentLocation.latitude}</p>
                <p>Lng: {currentLocation.longitude}</p>

                <a
                  href={`https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-purple-600 font-semibold hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            )}

            {locationError && (
              <p className="mt-3 text-sm text-red-500">{locationError}</p>
            )}
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">👥</div>

            <h3 className="font-bold text-gray-900 mt-4">Trusted Contacts</h3>

            <p className="text-sm text-gray-500 mt-2">
              Manage people who receive safety alerts.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">🤖</div>

            <h3 className="font-bold text-gray-900 mt-4">AI Safety Check</h3>

            <p className="text-sm text-gray-500 mt-2">
              Receive AI-powered emergency safety assistance and guidance.
            </p>

            <button
              onClick={() => navigate("/assistant")}
              className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold"
            >
              Open Assistant
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">📞</div>

            <h3 className="font-bold text-gray-900 mt-4">Helpline</h3>

            <p className="text-sm text-gray-500 mt-2">
              Instant access to emergency and women safety helpline numbers.
            </p>

            <button
              onClick={() => navigate("/helpline")}
              className="mt-4 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl font-semibold"
            >
              View Helplines
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">🛡️</div>

            <h3 className="font-bold text-gray-900 mt-4">Safe Places</h3>

            <p className="text-sm text-gray-500 mt-2">
              Find nearby police stations, hospitals, and safer public places.
            </p>

            <button
              onClick={() => navigate("/safe-places")}
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold"
            >
              Explore Places
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">⚠️</div>

            <h3 className="font-bold text-gray-900 mt-4">Report Incident</h3>

            <p className="text-sm text-gray-500 mt-2">
              Report unsafe places, suspicious activity, or harassment
              incidents.
            </p>

            <button
              onClick={() => navigate("/report-incident")}
              className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition"
            >
              Report Now
            </button>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/40">
            <h3 className="text-2xl font-bold text-gray-900">
              Trusted Contacts
            </h3>

            <form onSubmit={handleAddContact} className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Contact Name"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              />

              <input
                type="text"
                placeholder="Relation e.g. Mother, Friend"
                value={contactForm.relation}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    relation: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              />

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Add Trusted Contact
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {contacts.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No trusted contacts added yet.
                </p>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex justify-between items-center bg-rose-50 p-4 rounded-2xl"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {contact.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {contact.relation} • {contact.phone}
                      </p>
                    </div>

                    <div className="flex gap-3 items-center">
                      <a
                        href={`tel:${contact.phone}`}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-semibold"
                      >
                        📞 Call
                      </a>

                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/40">
            <h3 className="text-2xl font-bold text-gray-900">
              Recent SOS Alerts
            </h3>

            <div className="mt-6 space-y-4">
              {sosAlerts.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No SOS alerts triggered yet.
                </p>
              ) : (
                sosAlerts.map((sosAlert) => (
                  <div
                    key={sosAlert.id}
                    className="bg-red-50 p-4 rounded-2xl border border-red-100"
                  >
                    <p className="font-semibold text-red-700">
                      🚨 SOS {sosAlert.status}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Lat: {sosAlert.latitude}
                    </p>

                    <p className="text-sm text-gray-600">
                      Lng: {sosAlert.longitude}
                    </p>

                    <a
                      href={`https://www.google.com/maps?q=${sosAlert.latitude},${sosAlert.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-2 text-red-600 font-semibold hover:underline"
                    >
                      View Location on Google Maps
                    </a>

                    <button
                      onClick={() => handleCopyEmergencyMessage(sosAlert)}
                      className="block mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                      Copy Emergency Message
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
