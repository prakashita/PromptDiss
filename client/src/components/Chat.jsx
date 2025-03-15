import React, { useState } from "react";
import { Send, User, Bot } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  return (
    <div className="flex flex-col w-full h-full bg-black text-white">
      {/* Chat Header */}
      <div className="bg-gray-900 p-7.5"></div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 border-l-1 border-gray-700">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              msg.sender === "user" ? "justify-end" : ""
            }`}
          >
            {msg.sender === "bot" && (
              <Bot size={20} className="text-blue-400" />
            )}
            <div
              className={`p-3 rounded-lg max-w-[75%] ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <User size={20} className="text-blue-400" />
            )}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="border-t border-l border-gray-700 flex p-3 bg-gray-900">
        <input
          type="text"
          className="flex-1 p-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          onClick={sendMessage}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
