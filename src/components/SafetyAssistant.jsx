import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveChatMessage, getChatMessages } from "../services/chatService";

const SafetyAssistant = () => {
  const { currentUser } = useAuth();

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi, I’m your NariKavach Safety Assistant. Tell me what’s happening, and I’ll guide you.",
    },
  ]);

  const [input, setInput] = useState("");

  const quickPrompts = [
    "I feel unsafe",
    "Someone is following me",
    "I am alone at night",
    "I need emergency help",
  ];

  const fetchChatHistory = async () => {
    if (!currentUser) return;

    const savedMessages = await getChatMessages(currentUser.uid);

    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  };

  const getSafetyResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    if (message.includes("follow") || message.includes("following")) {
      return "If you feel someone is following you, move toward a crowded or well-lit area, avoid isolated routes, call a trusted contact, and keep your SOS button ready.";
    }

    if (message.includes("unsafe") || message.includes("scared")) {
      return "I understand. Stay calm, move to a safer public place if possible, share your location with someone trusted, and use SOS if you feel immediate danger.";
    }

    if (message.includes("alone") || message.includes("night")) {
      return "If you are alone at night, stay on well-lit roads, avoid shortcuts, keep your phone ready, and share your live location with a trusted contact.";
    }

    if (message.includes("emergency") || message.includes("help")) {
      return "If this is an emergency, trigger SOS immediately, call local emergency services, and send your location to trusted contacts.";
    }

    return "I’m here to help. Tell me if you feel unsafe, followed, alone, or need emergency guidance.";
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      sender: "user",
      text,
    };

    const aiMessage = {
      sender: "ai",
      text: getSafetyResponse(text),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);

    if (currentUser) {
      await saveChatMessage(currentUser.uid, userMessage);
      await saveChatMessage(currentUser.uid, aiMessage);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    await sendMessage(input);
    setInput("");
  };

  const handleQuickPrompt = async (prompt) => {
    await sendMessage(prompt);
  };

  useEffect(() => {
    fetchChatHistory();
  }, [currentUser]);

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/40">
      <h3 className="text-2xl font-bold text-gray-900">AI Safety Assistant</h3>

      <p className="text-sm text-gray-500 mt-2">
        Get quick safety guidance based on your situation.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mt-5">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleQuickPrompt(prompt)}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-xl text-sm font-semibold text-left transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-5 h-72 overflow-y-auto space-y-4 pr-2">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`p-4 rounded-2xl text-sm ${
              message.sender === "ai"
                ? "bg-purple-50 text-gray-700"
                : "bg-rose-500 text-white ml-auto"
            } max-w-[85%]`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="mt-5 flex gap-3">
        <input
          type="text"
          placeholder="Type your situation..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default SafetyAssistant;
