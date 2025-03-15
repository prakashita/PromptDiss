import React, { useState } from "react";
import { Send, User, Bot } from "lucide-react";

const Stats = () => {
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
      {/* Stats Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center gap-2 shadow-md">
        <Bot size={24} className="text-blue-400" />
        <h2 className="text-lg font-semibold">Stats Assistant</h2>
      </div>

      

      
    </div>
  );
};

export default Stats;
