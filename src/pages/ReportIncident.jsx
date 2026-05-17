import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createIncidentReport } from "../services/incidentService";

const ReportIncident = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    threatLevel: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await createIncidentReport(currentUser, formData);

      setMessage("Incident report submitted successfully.");

      setFormData({
        title: "",
        description: "",
        category: "",
        threatLevel: "",
        location: "",
      });
    } catch (error) {
      console.log("INCIDENT REPORT ERROR:", error.message);
      setMessage("Failed to submit incident report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 bg-white/80 text-rose-600 px-5 py-2 rounded-xl font-semibold shadow hover:bg-white"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white/75 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/40">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Report Unsafe Incident
          </h1>

          <p className="text-gray-600 mt-2">
            Help improve community safety by reporting unsafe situations.
          </p>
          {message && (
            <p className="mt-5 bg-rose-50 text-rose-600 p-3 rounded-xl font-semibold">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              type="text"
              name="title"
              placeholder="Incident Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            />

            <textarea
              name="description"
              placeholder="Describe what happened"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            >
              <option value="">Select Category</option>
              <option value="Harassment">Harassment</option>
              <option value="Stalking">Stalking</option>
              <option value="Suspicious Activity">Suspicious Activity</option>
              <option value="Unsafe Road">Unsafe Road</option>
              <option value="Unsafe Transport">Unsafe Transport</option>
              <option value="Dark/Isolated Area">Dark/Isolated Area</option>
            </select>

            <select
              name="threatLevel"
              value={formData.threatLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            >
              <option value="">Select Threat Level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <input
              type="text"
              name="location"
              placeholder="Location / Area Name"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            />

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
