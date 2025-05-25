
import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";

interface ChatBoxProps {
  chatHistory: { role: string; content: string }[];
}

const ChatBox = ({ chatHistory }: ChatBoxProps) => {
  const chatboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div
      ref={chatboxRef}
      className="h-[450px] overflow-y-auto p-4 space-y-4 bg-gray-900/50 backdrop-blur-sm"
    >
      {chatHistory.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-gray-700 p-3 animate-pulse">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
            </div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        </div>
      ) : (
        chatHistory.map((chat, index) => (
          <ChatMessage key={index} role={chat.role} content={chat.content} isLast={index === chatHistory.length - 1} />
        ))
      )}
    </div>
  );
};

export default ChatBox;
