import { useNavigate } from "react-router-dom";

const Helpline = () => {
  const navigate = useNavigate();

  const helplines = [
    {
      title: "Women Helpline",
      number: "1091",
      description: "Emergency support for women in distress.",
      icon: "👩‍🦰",
    },
    {
      title: "Police Emergency",
      number: "100",
      description: "Contact police in urgent danger situations.",
      icon: "🚓",
    },
    {
      title: "National Emergency",
      number: "112",
      description: "Single emergency response number in India.",
      icon: "🚨",
    },
    {
      title: "Ambulance",
      number: "108",
      description: "Medical emergency and ambulance service.",
      icon: "🚑",
    },
    {
      title: "Child Helpline",
      number: "1098",
      description: "Emergency help for children in need.",
      icon: "🧒",
    },
    {
      title: "Cyber Crime",
      number: "1930",
      description: "Report online fraud and cybercrime incidents.",
      icon: "💻",
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
            Emergency Helplines
          </h1>
          <p className="text-gray-600 mt-2">
            Quick access to important safety and emergency numbers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helplines.map((item) => (
            <div
              key={item.number}
              className="bg-white/75 backdrop-blur-lg rounded-3xl shadow-xl p-7 border border-white/40"
            >
              <div className="text-5xl">{item.icon}</div>

              <h2 className="text-2xl font-bold text-gray-900 mt-5">
                {item.title}
              </h2>

              <p className="text-gray-500 mt-2">{item.description}</p>

              <p className="text-3xl font-extrabold text-rose-600 mt-5">
                {item.number}
              </p>

              <a
                href={`tel:${item.number}`}
                className="inline-block mt-5 bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-xl font-semibold transition"
              >
                Call Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Helpline;
