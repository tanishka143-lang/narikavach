import SafetyAssistant from "../components/SafetyAssistant";
import { useNavigate } from "react-router-dom";

const Assistant = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 bg-white/80 text-rose-600 px-5 py-2 rounded-xl font-semibold shadow hover:bg-white"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            AI Safety Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Get quick safety guidance based on your current situation.
          </p>
        </div>

        <SafetyAssistant />
      </div>
    </div>
  );
};

export default Assistant;
