import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { currentUser } = useAuth();

  const [profileData, setProfileData] = useState(null);

  const [storyForm, setStoryForm] = useState({
    incidentTitle: "",
    location: "",
    incidentStory: "",
    appHelp: "",
  });

  const [stories, setStories] = useState([]);
  const [savingStory, setSavingStory] = useState(false);
  const [storyMessage, setStoryMessage] = useState("");

  const isLoggedIn = Boolean(currentUser?.uid);

  const getUserDisplayName = () => {
    return (
      profileData?.name ||
      profileData?.fullName ||
      currentUser?.displayName ||
      currentUser?.email?.split("@")[0] ||
      "NariKavach User"
    );
  };

  const getUserProfileImage = () => {
    const name = getUserDisplayName();

    return (
      profileData?.photoURL ||
      profileData?.profileImage ||
      currentUser?.photoURL ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name,
      )}&background=e11d48&color=ffffff&bold=true`
    );
  };

  const fetchUserProfile = async () => {
    if (!currentUser?.uid) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfileData(userSnap.data());
      }
    } catch (error) {
      console.log("FETCH USER PROFILE ERROR:", error.message);
    }
  };

  const fetchStories = async () => {
    try {
      const storiesQuery = query(
        collection(db, "landingStories"),
        orderBy("createdAt", "desc"),
        limit(3),
      );

      const snapshot = await getDocs(storiesQuery);

      const recentStories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStories(recentStories);
    } catch (error) {
      console.log("FETCH STORIES ERROR:", error.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [currentUser]);

  const handleStoryChange = (e) => {
    setStoryForm({
      ...storyForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setStoryMessage("Please login first to publish your story.");
      return;
    }

    setSavingStory(true);
    setStoryMessage("");

    try {
      await addDoc(collection(db, "landingStories"), {
        userId: currentUser.uid,
        name: getUserDisplayName(),
        email: currentUser.email || "",
        profileImage: getUserProfileImage(),
        incidentTitle: storyForm.incidentTitle.trim(),
        location: storyForm.location.trim(),
        incidentStory: storyForm.incidentStory.trim(),
        appHelp: storyForm.appHelp.trim(),
        createdAt: serverTimestamp(),
      });

      setStoryForm({
        incidentTitle: "",
        location: "",
        incidentStory: "",
        appHelp: "",
      });

      setStoryMessage("Your story has been published successfully.");
      fetchStories();
    } catch (error) {
      console.log("SAVE STORY ERROR:", error.message);
      setStoryMessage("Unable to save story. Please try again.");
    } finally {
      setSavingStory(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 text-gray-900 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-xl border-b border-white/50">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold text-rose-600">
            NariKavach
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
            <a href="#features" className="hover:text-rose-600">
              Features
            </a>
            <a href="#safety" className="hover:text-rose-600">
              Safety
            </a>
            <a href="#stories" className="hover:text-rose-600">
              Stories
            </a>
            <a href="#creator" className="hover:text-rose-600">
              Creator
            </a>
          </div>

          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-rose-600 font-semibold hover:bg-white/60 transition"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-full bg-rose-600 text-white font-semibold shadow-lg shadow-rose-300 hover:bg-rose-700 transition"
                >
                  Signup
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-5 py-2 rounded-full bg-rose-600 text-white font-semibold shadow-lg shadow-rose-300 hover:bg-rose-700 transition"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex mb-5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-rose-600 font-bold text-sm">
              AI-Powered Women Safety Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Safety, Freedom &{" "}
              <span className="text-rose-600">Independence</span> for Every
              Woman
            </h1>

            <p className="mt-6 text-lg text-gray-700 leading-relaxed max-w-xl">
              NariKavach is built for women who study, work, travel, live
              independently, and move through the world with courage. Stay
              connected with SOS alerts, trusted contacts, live location, nearby
              danger detection, and AI-powered safety guidance.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/signup"
                    className="px-8 py-4 rounded-full bg-rose-600 text-white font-bold text-center shadow-xl shadow-rose-300 hover:bg-rose-700 transition"
                  >
                    Start Your Safety Journey
                  </Link>

                  <Link
                    to="/login"
                    className="px-8 py-4 rounded-full bg-white/70 backdrop-blur-md border border-white/70 text-rose-600 font-bold text-center hover:bg-white transition"
                  >
                    Login to Dashboard
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 rounded-full bg-rose-600 text-white font-bold text-center shadow-xl shadow-rose-300 hover:bg-rose-700 transition"
                >
                  Open Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-rose-300 rounded-full blur-3xl opacity-40" />
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-40" />

            <div className="relative bg-white/50 backdrop-blur-xl rounded-[2rem] p-4 border border-white/70 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80"
                alt="Independent professional woman"
                className="w-full h-[520px] object-cover rounded-[1.5rem]"
              />

              <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-white/80">
                <h3 className="font-bold text-rose-600 text-lg">
                  For Women Who Move Independently
                </h3>
                <p className="text-sm text-gray-700 mt-1">
                  Travel, work, study, and live with smarter digital safety
                  support by your side.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl font-extrabold">
              More Than an Emergency Button
            </h2>
            <p className="mt-4 text-gray-700">
              NariKavach combines prevention, awareness, emergency response,
              trusted support, and AI guidance into one safety-first platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Prevent Risk Before It Grows",
                desc: "Stay aware of unsafe nearby areas before travelling alone, especially during late hours or unfamiliar routes.",
                icon: "🌆",
              },
              {
                title: "Instant Emergency Support",
                desc: "Send SOS alerts with live location so trusted contacts can quickly understand where you are and respond.",
                icon: "🚨",
              },
              {
                title: "Calm AI Safety Guidance",
                desc: "Get practical steps from the AI assistant when you feel unsafe, confused, followed, or stuck in a risky situation.",
                icon: "🤖",
              },
              {
                title: "Trusted People, One Tap Away",
                desc: "Connect with your safety circle through call, SMS, and WhatsApp actions when immediate support is needed.",
                icon: "👥",
              },
              {
                title: "Community Incident Awareness",
                desc: "Learn from nearby reports and shared experiences so women can stay informed and protect each other.",
                icon: "🛡️",
              },
              {
                title: "Your Safety Records",
                desc: "Keep SOS history and safety actions organized so important emergency details are never lost.",
                icon: "📌",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-xl rounded-3xl p-7 border border-white/70 shadow-lg hover:-translate-y-2 transition"
              >
                <div className="text-4xl mb-5">{feature.icon}</div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Life Safety Images Section */}
      <section id="safety" className="py-20 px-5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
              alt="Independent woman"
              className="rounded-3xl h-72 w-full object-cover shadow-xl"
            />

            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
              alt="Confident woman"
              className="rounded-3xl h-72 w-full object-cover shadow-xl mt-10"
            />

            <img
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80"
              alt="Smiling woman"
              className="rounded-3xl h-72 w-full object-cover shadow-xl"
            />

            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
              alt="Woman safety"
              className="rounded-3xl h-72 w-full object-cover shadow-xl mt-10"
            />
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-10 border border-white/70 shadow-xl">
            <h2 className="text-4xl font-extrabold leading-tight">
              Every Woman Deserves To Feel Safe Everywhere
            </h2>

            <p className="mt-6 text-gray-700 leading-relaxed text-lg">
              Whether travelling alone at night, commuting to work, attending
              college, living independently, or moving through unfamiliar areas,
              women should never have to choose between freedom and safety.
            </p>

            <p className="mt-5 text-gray-700 leading-relaxed">
              NariKavach supports women through prevention, quick response,
              trusted contacts, community awareness, and AI-powered safety
              guidance.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-rose-50 rounded-2xl p-5">
                <h3 className="text-3xl font-extrabold text-rose-600">24/7</h3>
                <p className="text-gray-700 mt-1">Emergency readiness</p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-5">
                <h3 className="text-3xl font-extrabold text-purple-600">AI</h3>
                <p className="text-gray-700 mt-1">Smart safety assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="stories" className="py-20 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-extrabold">
              Write Your Own Safety Story
            </h2>
            <p className="mt-4 text-gray-700">
              Share your incident, location, experience, and how NariKavach
              helped you or could have helped you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/65 backdrop-blur-xl rounded-[2rem] p-8 border border-white/70 shadow-xl">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-4 mb-6 bg-white/70 rounded-3xl p-4 border border-white/80">
                    <img
                      src={getUserProfileImage()}
                      alt={getUserDisplayName()}
                      className="w-14 h-14 rounded-full object-cover border-2 border-rose-200"
                    />

                    <div>
                      <h3 className="font-bold text-gray-900">
                        Publishing as {getUserDisplayName()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleStorySubmit} className="space-y-5">
                    <input
                      type="text"
                      name="incidentTitle"
                      placeholder="Incident title"
                      value={storyForm.incidentTitle}
                      onChange={handleStoryChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />

                    <input
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={storyForm.location}
                      onChange={handleStoryChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />

                    <textarea
                      name="incidentStory"
                      placeholder="Write what happened..."
                      value={storyForm.incidentStory}
                      onChange={handleStoryChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                    />

                    <textarea
                      name="appHelp"
                      placeholder="How did NariKavach help?"
                      value={storyForm.appHelp}
                      onChange={handleStoryChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                    />

                    <button
                      type="submit"
                      disabled={savingStory}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-rose-200 disabled:opacity-60"
                    >
                      {savingStory ? "Publishing..." : "Publish My Story"}
                    </button>

                    {storyMessage && (
                      <p className="text-center text-sm font-semibold text-rose-600">
                        {storyMessage}
                      </p>
                    )}
                  </form>
                </>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    Login to Share Your Story
                  </h3>

                  <p className="text-gray-600 mt-3">
                    Your name and profile will be automatically added from your
                    account.
                  </p>

                  <Link
                    to="/login"
                    className="inline-block mt-6 px-8 py-3 rounded-full bg-rose-600 text-white font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition"
                  >
                    Login to Share
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white/65 backdrop-blur-xl rounded-[2rem] p-8 border border-white/70 shadow-xl">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6">
                Recent Published Stories
              </h3>

              {stories.length === 0 ? (
                <p className="text-gray-600">
                  No stories yet. Be the first to share your experience.
                </p>
              ) : (
                <div className="space-y-5">
                  {stories.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/75 rounded-3xl p-5 border border-white/80 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              item.name || "User",
                            )}&background=e11d48&color=ffffff&bold=true`
                          }
                          alt={item.name || "User"}
                          className="w-14 h-14 rounded-full object-cover border-2 border-rose-200"
                        />

                        <div>
                          <h4 className="font-bold text-gray-900">
                            {item.name || "NariKavach User"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.location}
                          </p>
                        </div>
                      </div>

                      <h4 className="font-bold text-rose-600 mt-4">
                        {item.incidentTitle}
                      </h4>

                      <p className="text-gray-700 mt-3 leading-relaxed">
                        {item.incidentStory}
                      </p>

                      <div className="mt-4 bg-rose-50 rounded-2xl p-4">
                        <p className="text-sm font-bold text-rose-600">
                          How NariKavach helped:
                        </p>
                        <p className="text-gray-700 text-sm mt-1">
                          {item.appHelp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section id="creator" className="py-20 px-5">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-rose-600 to-purple-600 rounded-[2rem] p-10 md:p-14 text-white shadow-2xl">
          <div className="text-center">
            <p className="uppercase tracking-[0.3em] text-white/70 text-sm font-bold">
              Note From The Creator
            </p>

            <h2 className="mt-4 text-4xl font-extrabold">
              Created by Tanishka Shahdev
            </h2>

            <p className="mt-6 text-white/90 leading-relaxed max-w-3xl mx-auto">
              NariKavach is my initiative to build a meaningful technology
              solution for women safety. I created this platform with the vision
              of combining AI, real-time location support, community awareness,
              and emergency response tools into one reliable digital companion.
            </p>

            <div className="mt-8 flex justify-center gap-5">
              <a
                href="mailto:tanishkashahdev5@gmail.com"
                className="w-13 h-13 rounded-full bg-white text-rose-600 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition"
                title="Email"
              >
                ✉️
              </a>

              <a
                href="https://github.com/tanishka143-lang"
                target="_blank"
                rel="noreferrer"
                className="w-13 h-13 rounded-full bg-white text-rose-600 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition"
                title="GitHub"
              >
                💻
              </a>

              <a
                href="https://www.linkedin.com/in/tanishka-shahdev-b2602028b/"
                target="_blank"
                rel="noreferrer"
                className="w-13 h-13 rounded-full bg-white text-rose-600 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition"
                title="LinkedIn"
              >
                🔗
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-5 py-8 border-t border-white/50 bg-white/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-700">
            © {new Date().getFullYear()} NariKavach. All rights reserved.
          </p>

          <p className="text-gray-600 text-sm">
            AI-powered women safety platform
          </p>
        </div>
      </footer>
    </main>
  );
}

export default Home;
