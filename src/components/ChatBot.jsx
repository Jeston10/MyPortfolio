import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const FAQS = [
  {
    question: "How do I view project details?",
    answer: "Click the 'Details' button on any project card to see more information about that project.",
  },
  {
    question: "How can I leave a comment?",
    answer: "Scroll to the Contact section and use the comment form. You can also upload a profile photo!",
  },
  {
    question: "Why don't I see my project?",
    answer: "Projects are loaded from the database. If you just added one, try refreshing the page.",
  },
  {
    question: "How do I contact you?",
    answer: "Use the contact form at the bottom of the page or connect via the social links provided.",
  },
  {
    question: "Is my data safe?",
    answer: "Your comments are public, but no sensitive data is collected or stored.",
  },
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#6366f1] to-[#a855f7] p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chatbot" : "Open chatbot"}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[90vw] bg-[#18122B] rounded-2xl shadow-2xl border border-[#6366f1]/30 animate-fadeIn flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#6366f1]/20 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-t-2xl">
            <span className="font-semibold text-white text-lg">Need Help?</span>
            <button onClick={() => setOpen(false)} aria-label="Close chatbot">
              <X className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {!selected ? (
              <>
                <div className="text-gray-300 mb-2 text-sm">How can I help you?</div>
                {FAQS.map((faq, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-[#6366f1]/20 text-white transition-all mb-1"
                    onClick={() => setSelected(idx)}
                  >
                    {faq.question}
                  </button>
                ))}
              </>
            ) : (
              <>
                <div className="text-indigo-300 font-medium mb-2">{FAQS[selected].question}</div>
                <div className="text-gray-200 mb-4">{FAQS[selected].answer}</div>
                <button
                  className="px-4 py-2 rounded-lg bg-[#6366f1]/80 text-white hover:bg-[#a855f7]/80 transition-all"
                  onClick={() => setSelected(null)}
                >
                  Back to questions
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 