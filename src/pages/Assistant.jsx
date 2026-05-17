import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Assistant = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chat, setChat] = useState([
    {
      role: "assistant",
      text: "Hello 👋 I am your AI Safety Assistant. How can I help you today?",
    },
  ]);

  const quickPrompts = [
    "I feel unsafe",
    "Someone is following me",
    "Emergency safety tips",
    "What should I do during harassment?",
  ];

  const handleSend = async (customMessage = null) => {
    const finalMessage = customMessage || message;

    if (!finalMessage.trim()) return;

    const updatedChat = [...chat, { role: "user", text: finalMessage }];

    setChat(updatedChat);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
You are NariKavach AI Safety Assistant.

You help women with:
- safety guidance
- emergency support
- emotional reassurance
- harassment response
- nearby safety advice
- self protection guidance

Important:
- If the user says they are in immediate danger, tell them to move to a safe public place, call local emergency services, and contact trusted contacts.
- Keep replies calm, short, practical, and supportive.
- Do not give harmful or risky advice.

User message:
${finalMessage}
                    `,
                  },
                ],
              },
            ],
          }),
        },
      );

      const data = await response.json();

      console.log("GEMINI RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data?.error?.message || "Gemini API request failed.");
      }

      const aiReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I am here with you. Please move toward a safe public place and contact someone you trust immediately.";

      setChat([...updatedChat, { role: "assistant", text: aiReply }]);
    } catch (error) {
      console.log("GEMINI ERROR:", error.message);

      setChat([
        ...updatedChat,
        {
          role: "assistant",
          text: `AI error: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 px-4 sm:px-6 py-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 bg-white/80 text-rose-600 px-5 py-2 rounded-xl font-semibold shadow hover:bg-white"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            AI Safety Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Get real-time AI-powered emergency safety assistance and guidance.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/40 overflow-hidden">
          <div className="p-5 flex flex-wrap gap-3 border-b border-white/40">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold transition disabled:opacity-60"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="h-[500px] overflow-y-auto px-5 py-4 space-y-4 bg-white/30">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl shadow whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-rose-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl shadow text-gray-600">
                  AI is typing...
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-white/40 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleSend();
                }
              }}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-90 text-white px-6 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
