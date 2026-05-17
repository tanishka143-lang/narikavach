import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signupUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signupUser(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
      );

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log("SIGNUP ERROR:", error.code, error.message);
      setError(error.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white/70 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/50">
        {/* Left Image Section */}
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80"
            alt="Independent woman"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute bottom-10 left-10 right-10 text-white">
            <h2 className="text-4xl font-extrabold leading-tight">
              Your Safety.
              <br />
              Your Freedom.
            </h2>

            <p className="mt-4 text-white/90 leading-relaxed text-lg">
              Join thousands of women using AI-powered protection, emergency
              response, trusted contacts, and real-time safety awareness.
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-rose-600">
                NariKavach
              </h1>

              <p className="text-gray-600 mt-3">Create your safety account</p>
            </div>

            {error && (
              <div className="bg-red-100 text-red-600 text-sm p-3 rounded-xl mt-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="mt-8 space-y-5">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white/80"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white/80"
                required
              />

              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white/80"
                required
              />

              <input
                name="password"
                type="password"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white/80"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold transition duration-300 shadow-lg shadow-rose-200 disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-rose-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Signup;
