"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function KrishiChatPage() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    {
      sender: "bot",
      text:
        "👋 Namaste! I'm **Krishi AI Advisor** 🤖 — your smart agri guide powered by **AWS Bedrock + SageMaker**.\nAsk me anything about crops, irrigation, or soil health 🌱",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8090/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Couldn't reach the server. Please retry." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center min-h-screen bg-gradient-to-b from-green-100 via-emerald-50 to-amber-100 py-10">
      <h1 className="text-4xl font-bold text-green-900 mb-2 drop-shadow-sm">
        🌾 Krishi AI Advisor
      </h1>
      <p className="text-sm text-gray-600 mb-6 italic">
        ⚙️ Powered by AWS Bedrock + SageMaker | Built by <b>VinCloudOps</b>
      </p>

      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-6 w-[90%] md:w-[650px] h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-green-200 self-end ml-auto text-right"
                  : "bg-emerald-50 text-left"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {loading && <p className="text-sm text-gray-400 italic">🤖 Typing...</p>}
          <div ref={chatEndRef}></div>
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about irrigation, soil, or crops..."
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-600"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
