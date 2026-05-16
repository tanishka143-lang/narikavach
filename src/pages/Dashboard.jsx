import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { createSosAlert } from "../services/sosService";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [sosLoading, setSosLoading] = useState(false);
  const [sosMessage, setSosMessage] = useState("");

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
      {/* Navbar */}
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

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-medium shadow-md transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero Section */}
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

          {/* SOS Card */}
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

        {/* Quick Actions */}
        <section className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">📍</div>
            <h3 className="font-bold text-gray-900 mt-4">Live Location</h3>
            <p className="text-sm text-gray-500 mt-2">
              Share your current location in emergencies.
            </p>
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
              Analyze suspicious situations using AI.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/40 hover:scale-105 transition">
            <div className="text-4xl">📞</div>
            <h3 className="font-bold text-gray-900 mt-4">Helpline</h3>
            <p className="text-sm text-gray-500 mt-2">
              Quick access to women safety helplines.
            </p>
          </div>
        </section>

        {/* Lower Panels */}
        <section className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Emergency Contacts */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/40">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Trusted Contacts
              </h3>

              <button className="text-rose-600 font-semibold hover:underline">
                Add Contact
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between bg-rose-50 p-4 rounded-2xl">
                <div>
                  <p className="font-semibold text-gray-800">Mother</p>
                  <p className="text-sm text-gray-500">Not added yet</p>
                </div>
                <span className="text-2xl">👩</span>
              </div>

              <div className="flex items-center justify-between bg-purple-50 p-4 rounded-2xl">
                <div>
                  <p className="font-semibold text-gray-800">Friend</p>
                  <p className="text-sm text-gray-500">Not added yet</p>
                </div>
                <span className="text-2xl">🧑‍🤝‍🧑</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/40">
            <h3 className="text-2xl font-bold text-gray-900">
              Recent Safety Activity
            </h3>

            <div className="mt-6 space-y-4">
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                <p className="font-semibold text-green-700">Account secured</p>
                <p className="text-sm text-gray-500">
                  Authentication and protected routes are active.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p className="font-semibold text-blue-700">
                  Dashboard initialized
                </p>
                <p className="text-sm text-gray-500">
                  Safety modules are ready for feature integration.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                <p className="font-semibold text-yellow-700">
                  SOS backend pending
                </p>
                <p className="text-sm text-gray-500">
                  Next step: connect SOS button to Firestore.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
