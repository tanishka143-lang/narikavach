import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const CommunityFeed = () => {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyWarning, setNearbyWarning] = useState("");
  const [locationStatus, setLocationStatus] = useState("");

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

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    const q = query(
      collection(db, "incidentReports"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setIncidents(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching incidents:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (incidents.length === 0) return;

    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported by your browser.");
      return;
    }

    setLocationStatus("Checking your nearby safety status...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

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
            "⚠️ Warning: This area may be unsafe. Someone reported an incident within 1 km of your current location.";

          setNearbyWarning(message);
          setLocationStatus("");

          if ("Notification" in window) {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification("NariKavach Safety Alert", {
                  body: message,
                });
              }
            });
          }
        } else {
          setNearbyWarning("");
          setLocationStatus("No reported unsafe incident found near you.");
        }
      },
      () => {
        setLocationStatus(
          "Location permission denied. Nearby safety alerts need location access.",
        );
      },
    );
  }, [incidents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-pink-200 px-4 sm:px-6 py-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 bg-white text-rose-600 px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-rose-50 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl p-5 sm:p-6 mb-6 border border-white/50">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-800">
            Community Incident Feed
          </h1>

          <p className="text-gray-700 mt-2">
            View unsafe incidents reported by the community and get alerts if
            your current location is near a reported unsafe place.
          </p>

          {nearbyWarning && (
            <div className="mt-5 bg-red-100 border border-red-300 text-red-700 p-4 rounded-2xl font-semibold">
              {nearbyWarning}
            </div>
          )}

          {!nearbyWarning && locationStatus && (
            <div className="mt-5 bg-white/60 border border-white/70 text-gray-700 p-4 rounded-2xl font-semibold">
              {locationStatus}
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-purple-700 font-semibold">
            Loading incidents...
          </p>
        ) : incidents.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 text-center shadow-lg">
            <p className="text-gray-700">No incidents reported yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="bg-white/50 backdrop-blur-xl rounded-3xl shadow-lg p-5 sm:p-6 border border-white/60"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-rose-700">
                      {incident.incidentType || "Unsafe Incident"}
                    </h2>

                    <p className="text-gray-700 mt-2">
                      {incident.description || "No description provided."}
                    </p>
                  </div>

                  {incident.severity && (
                    <span className="px-4 py-1 rounded-full bg-rose-200 text-rose-800 text-sm font-semibold">
                      {incident.severity}
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-700 break-words">
                  {incident.location && (
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {incident.location}
                    </p>
                  )}

                  {incident.createdAt && (
                    <p>
                      <span className="font-semibold">Reported on:</span>{" "}
                      {incident.createdAt.toDate
                        ? incident.createdAt.toDate().toLocaleString()
                        : "Date not available"}
                    </p>
                  )}

                  {incident.latitude && incident.longitude && (
                    <p>
                      <span className="font-semibold">Coordinates:</span>{" "}
                      {incident.latitude}, {incident.longitude}
                    </p>
                  )}
                </div>

                {incident.latitude && incident.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 w-full sm:w-auto text-center px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold shadow-md hover:scale-105 transition"
                  >
                    Open in Google Maps
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
