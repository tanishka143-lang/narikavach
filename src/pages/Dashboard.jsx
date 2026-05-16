import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
      {/* Navbar */}
      <div className="backdrop-blur-md bg-white/60 border-b border-white/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-rose-600 tracking-tight">
              NariKavach
            </h1>

            <p className="text-sm text-gray-600">
              AI-Powered Women Safety Platform
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-medium shadow-md transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/40">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-800">
                Welcome Back 👋
              </h2>

              <p className="text-gray-600 mt-3 text-lg">
                Your personal safety dashboard is active and secured.
              </p>

              <div className="mt-6 space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span>{" "}
                  {currentUser?.email}
                </p>

                <p className="text-gray-700">
                  <span className="font-semibold">User ID:</span>{" "}
                  {currentUser?.uid}
                </p>
              </div>
            </div>

            {/* Emergency Button */}
            <div className="flex items-center">
              <button className="bg-red-500 hover:bg-red-600 text-white text-xl font-bold px-10 py-6 rounded-2xl shadow-2xl transition duration-300 hover:scale-105">
                🚨 SOS ALERT
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {/* Card 1 */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/40 hover:scale-105 transition duration-300">
            <div className="text-5xl">🆘</div>

            <h3 className="text-2xl font-bold text-rose-600 mt-5">
              Emergency SOS
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Trigger emergency alerts instantly and notify trusted contacts in
              dangerous situations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/40 hover:scale-105 transition duration-300">
            <div className="text-5xl">📍</div>

            <h3 className="text-2xl font-bold text-purple-600 mt-5">
              Live Location
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Share real-time location tracking with emergency contacts during
              unsafe situations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/40 hover:scale-105 transition duration-300">
            <div className="text-5xl">🤖</div>

            <h3 className="text-2xl font-bold text-indigo-600 mt-5">
              AI Threat Detection
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              AI-powered analysis helps detect suspicious activity and unsafe
              patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
