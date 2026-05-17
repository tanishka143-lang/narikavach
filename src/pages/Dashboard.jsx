import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";

import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { createSosAlert } from "../services/sosService";
import { getCurrentLocation } from "../services/locationService";
import { getTrustedContacts } from "../services/contactService";
import { db } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [sosLoading, setSosLoading] = useState(false);
  const [sosMessage, setSosMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [unsafeAreaWarning, setUnsafeAreaWarning] = useState("");
  const [latestSosLocation, setLatestSosLocation] = useState(null);

  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const getEmergencyMessage = () => {
    if (!latestSosLocation) return "";

    return `🚨 EMERGENCY ALERT!

I am in danger and need immediate help.

My live location:
https://www.google.com/maps?q=${latestSosLocation.latitude},${latestSosLocation.longitude}

User: ${currentUser?.email}

Please contact me or emergency services immediately.`;
  };

  const checkUnsafeArea = async () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const querySnapshot = await getDocs(collection(db, "incidentReports"));

        const incidents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const nearbyIncident = incidents.find((incident) => {
          if (!incident.latitude || !incident.longitude) return false;

          const distance = getDistanceInKm(
            userLat,
            userLng,
            Number(incident.latitude),
            Number(incident.longitude),
          );

          return distance <= 1;
        });

        if (nearbyIncident) {
          const message =
            "⚠️ Warning: This area may be unsafe. Someone reported an incident near your current location.";

          setUnsafeAreaWarning(message);

          if ("Notification" in window) {
            const permission = await Notification.requestPermission();

            if (permission === "granted") {
              new Notification("NariKavach Safety Alert", {
                body: message,
              });
            }
          }
        }
      },
      () => {
        console.log("Location permission denied.");
      },
    );
  };

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

          setLatestSosLocation(location);

          await createSosAlert(currentUser, location);

          setSosMessage(
            "SOS alert created. Now notify your trusted contacts below.",
          );
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

  const handleGetLocation = async () => {
    setLocationError("");

    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      setLocationError(error);
    }
  };

  useEffect(() => {
    fetchContacts();
    checkUnsafeArea();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
      <nav className="bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-rose-600">
              NariKavach
            </h1>
            <p className="text-sm text-gray-600">
              AI-powered women safety dashboard
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link
              to="/"
              className="px-4 py-2 rounded-full bg-white/70 text-rose-600 font-semibold hover:bg-white transition"
            >
              Home
            </Link>
            <button
              onClick={() => navigate("/profile")}
              className="flex-1 sm:flex-none bg-white text-rose-600 px-4 sm:px-5 py-2 rounded-xl font-medium shadow-md hover:bg-rose-50 transition"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white px-4 sm:px-5 py-2 rounded-xl font-medium shadow-md transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {unsafeAreaWarning && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded-2xl font-semibold shadow">
            {unsafeAreaWarning}
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-5 sm:p-8 border border-white/40">
            <p className="text-sm font-semibold text-rose-600">Safety Status</p>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
              Welcome Back 👋
            </h2>

            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              Your emergency assistance dashboard is active and ready.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

              <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
                <p className="text-sm text-gray-500">Trusted Contacts</p>
                <p className="font-semibold text-purple-700">
                  {contacts.length} Added
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl shadow-2xl p-5 sm:p-8 text-white flex flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-red-100">
                Emergency Action
              </p>

              <h3 className="text-2xl sm:text-3xl font-extrabold mt-3">
                SOS Alert
              </h3>

              <p className="text-red-100 mt-3">
                Use this only when you need immediate help.
              </p>
            </div>

            <button
              onClick={handleSosAlert}
              disabled={sosLoading}
              className="mt-8 bg-white text-red-600 hover:bg-red-50 py-4 rounded-2xl text-lg sm:text-xl font-extrabold shadow-lg transition hover:scale-105 disabled:opacity-60"
            >
              {sosLoading ? "Sending SOS..." : "🚨 Trigger SOS"}
            </button>

            {sosMessage && (
              <p className="mt-4 text-red-100 font-semibold">{sosMessage}</p>
            )}

            {latestSosLocation && contacts.length > 0 && (
              <div className="mt-5 bg-white/20 rounded-2xl p-4 space-y-3">
                <p className="font-bold text-white">Notify Trusted Contacts</p>

                {contacts.map((contact) => {
                  const emergencyMessage = encodeURIComponent(
                    getEmergencyMessage(),
                  );

                  return (
                    <div
                      key={contact.id}
                      className="bg-white/20 rounded-xl p-3"
                    >
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-sm text-red-100">
                        {contact.relation} • {contact.phone}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <a
                          href={`https://wa.me/91${contact.phone}?text=${emergencyMessage}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white text-center px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          Send WhatsApp
                        </a>

                        <a
                          href={`sms:${contact.phone}?body=${emergencyMessage}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-center px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          Send SMS
                        </a>

                        <a
                          href={`tel:${contact.phone}`}
                          className="bg-white text-red-600 text-center px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          Call
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {latestSosLocation && contacts.length === 0 && (
              <p className="mt-4 text-red-100 font-semibold">
                No trusted contacts added. Add contacts first to notify them.
              </p>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 sm:p-6 shadow-lg border border-white/40 hover:scale-105 transition">
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
              <div className="mt-4 text-sm text-gray-600 space-y-1 break-words">
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

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 sm:p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">🤖</div>
            <h3 className="font-bold text-gray-900 mt-4">AI Safety Check</h3>
            <p className="text-sm text-gray-500 mt-2">
              Receive AI-powered emergency safety assistance and guidance.
            </p>

            <button
              onClick={() => navigate("/assistant")}
              className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold"
            >
              Open Assistant
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 sm:p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">📞</div>
            <h3 className="font-bold text-gray-900 mt-4">Helpline</h3>
            <p className="text-sm text-gray-500 mt-2">
              Instant access to emergency and women safety helpline numbers.
            </p>

            <button
              onClick={() => navigate("/helpline")}
              className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl font-semibold"
            >
              View Helplines
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 sm:p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">🛡️</div>
            <h3 className="font-bold text-gray-900 mt-4">Safe Places</h3>
            <p className="text-sm text-gray-500 mt-2">
              Find nearby police stations, hospitals, and safer public places.
            </p>

            <button
              onClick={() => navigate("/safe-places")}
              className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold"
            >
              Explore Places
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 sm:p-6 shadow-lg border border-white/40 hover:scale-105 transition">
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

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 sm:p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">🌐</div>
            <h3 className="font-bold text-gray-900 mt-4">Community Feed</h3>
            <p className="text-sm text-gray-500 mt-2">
              View unsafe incidents reported by other users in the community.
            </p>

            <button
              onClick={() => navigate("/community-feed")}
              className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-semibold transition"
            >
              View Feed
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 sm:p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">👥</div>
            <h3 className="font-bold text-gray-900 mt-4">Trusted Contacts</h3>
            <p className="text-sm text-gray-500 mt-2">
              Add and manage people who can help during emergencies.
            </p>

            <button
              onClick={() => navigate("/trusted-contacts")}
              className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold transition"
            >
              Manage Contacts
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 sm:p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">🚨</div>
            <h3 className="font-bold text-gray-900 mt-4">SOS History</h3>
            <p className="text-sm text-gray-500 mt-2">
              Check your recently triggered emergency alerts and locations.
            </p>

            <button
              onClick={() => navigate("/sos-history")}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition"
            >
              View History
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
