import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");

    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);

      localStorage.setItem("profileImage", reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 bg-white/80 text-rose-600 px-5 py-2 rounded-xl font-semibold shadow hover:bg-white"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/40 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-rose-200 shadow-lg bg-gray-100">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    👩
                  </div>
                )}
              </div>

              <label className="mt-5 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl cursor-pointer font-semibold transition">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  hidden
                />
              </label>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-gray-900">
                User Profile
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your personal safety account details.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-5">
                <div className="bg-rose-50 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800 break-all mt-1">
                    {currentUser?.email}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="font-semibold text-green-600 mt-1">
                    Active & Protected
                  </p>
                </div>

                <div className="bg-pink-50 rounded-2xl p-5 sm:col-span-2">
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-semibold text-gray-800 break-all mt-1">
                    {currentUser?.uid}
                  </p>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-semibold text-indigo-600 mt-1">User</p>
                </div>

                <div className="bg-yellow-50 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Protection Mode</p>
                  <p className="font-semibold text-yellow-700 mt-1">Enabled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
