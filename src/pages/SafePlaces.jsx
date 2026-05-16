import { useNavigate } from "react-router-dom";

const SafePlaces = () => {
  const navigate = useNavigate();

  const places = [
    {
      title: "Nearby Police Stations",
      description: "Find police stations near your current location.",
      icon: "🚓",
      query: "police station near me",
      color: "rose",
    },
    {
      title: "Nearby Hospitals",
      description: "Find hospitals and emergency medical help nearby.",
      icon: "🏥",
      query: "hospital near me",
      color: "purple",
    },
    {
      title: "Nearby Pharmacies",
      description: "Find pharmacies and medical stores close to you.",
      icon: "💊",
      query: "pharmacy near me",
      color: "indigo",
    },
    {
      title: "Safe Public Places",
      description: "Find crowded and safer public places nearby.",
      icon: "🏬",
      query: "safe public places near me",
      color: "pink",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 bg-white/80 text-rose-600 px-5 py-2 rounded-xl font-semibold shadow hover:bg-white"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Nearby Safe Places
          </h1>
          <p className="text-gray-600 mt-2">
            Quickly find nearby emergency support locations using Google Maps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.map((place) => (
            <div
              key={place.title}
              className="bg-white/75 backdrop-blur-lg rounded-3xl shadow-xl p-7 border border-white/40 hover:scale-105 transition"
            >
              <div className="text-5xl">{place.icon}</div>

              <h2 className="text-xl font-bold text-gray-900 mt-5">
                {place.title}
              </h2>

              <p className="text-gray-500 mt-2 text-sm">{place.description}</p>

              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  place.query,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-5 bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-xl font-semibold transition"
              >
                Open in Maps
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SafePlaces;
