import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getUserSosAlerts } from "../services/sosService";

const SosHistory = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [sosAlerts, setSosAlerts] = useState([]);

  const fetchSosAlerts = async () => {
    if (!currentUser) return;

    const data = await getUserSosAlerts(currentUser.uid);
    setSosAlerts(data);
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
    fetchSosAlerts();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 px-4 sm:px-6 py-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 bg-white text-rose-600 px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-rose-50 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-5 sm:p-8 border border-white/40">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            SOS History
          </h1>

          <p className="text-gray-600 mt-2">
            View your recently triggered emergency alerts and locations.
          </p>

          <div className="mt-8 space-y-4">
            {sosAlerts.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No SOS alerts triggered yet.
              </p>
            ) : (
              sosAlerts.map((sosAlert) => (
                <div
                  key={sosAlert.id}
                  className="bg-red-50 p-4 rounded-2xl border border-red-100 break-words"
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
                    className="block mt-3 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                  >
                    Copy Emergency Message
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SosHistory;
