"use client";

import React, { useState, useRef, useEffect } from "react";

interface WhatsAppChatProps {
  phoneNumber?: string;
  websiteUrl?: string;
  companyName?: string;
}

const WhatsAppChat = ({
  phoneNumber = "+9867724223",
  websiteUrl = "https://novaaglobal.com/",
  companyName = "Novaa Global Properties",
}: WhatsAppChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Show typing indicator after 500ms
      const typingTimer = setTimeout(() => {
        setShowTypingIndicator(true);
      }, 500);

      // Hide typing indicator and show message after 1.5s total
      const messageTimer = setTimeout(() => {
        setShowTypingIndicator(false);
        setShowMessage(true);
        if (chatInputRef.current) {
          chatInputRef.current.focus();
        }
      }, 1500);

      return () => {
        clearTimeout(typingTimer);
        clearTimeout(messageTimer);
      };
    } else {
      // Reset when closed
      setShowMessage(false);
      setShowTypingIndicator(false);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(
        `${message}\n\nHi, I am contacting you through your website ${websiteUrl}`
      );
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");
      setMessage("");
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <>
      {/* WhatsApp Chat Widget */}
      <div className={`whatsapp-chat-container ${isOpen ? "show" : "hide"}`}>
        {/* Header */}
        <div className="whatsapp-chat-header">
          <div className="header-content">
            <div className="whatsapp-chat-avatar">
              <img
                src="/advantage-section-images/logo.png"
                alt="Avatar"
                className="avatar-img"
              />
            </div>
            <div className="header-info">
              <h4 className="company-name">{companyName}</h4>
              <span className="status-text">Online</span>
            </div>
          </div>
          <button
            className="close-chat"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Chat Body */}
        <div className="whatsapp-chat-body">
          <div className="message-container">
            {/* Typing Indicator */}
            {showTypingIndicator && (
              <div className="typing-indicator-wrapper">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {/* Received Message */}
            {showMessage && (
              <div className="received-message">
                <div className="message-bubble">
                  <p className="message-text">
                    Hi there! 👋
                    <br />
                    <br />
                    How can I help you today?
                  </p>
                  <span className="message-time">Just now</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          <div className="input-wrapper">
            <textarea
              ref={chatInputRef}
              placeholder="Type a message..."
              maxLength={500}
              rows={1}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              className="chat-input"
            />
            <button
              onClick={handleSendMessage}
              className={`send-button ${isTyping ? "active" : ""}`}
              aria-label="Send message"
              disabled={!message.trim()}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Button */}
      {!isOpen && (
        <button
          className="whatsapp-float-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open WhatsApp chat"
        >
          <div className="button-content">
            <svg
              className="whatsapp-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                fill="currentColor"
              />
            </svg>
            <span className="button-text">Chat with Us</span>
          </div>
          {/* <span className="pulse-ring" />
          <span className="pulse-ring-2" /> */}
        </button>
      )}

      <style jsx>{`
        .whatsapp-chat-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 380px;
          height: 500px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(0, 0, 0, 0.05);
          z-index: 999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-origin: bottom right;
        }

        .whatsapp-chat-container.show {
          opacity: 1;
          transform: scale(1) translateY(0);
          visibility: visible;
        }

        .whatsapp-chat-container.hide {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
          visibility: hidden;
          pointer-events: none;
        }

        .whatsapp-chat-header {
          background: linear-gradient(135deg, #128c7e 0%, #075e54 100%);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
        }

        .whatsapp-chat-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .header-info {
          flex: 1;
        }

        .company-name {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 2px 0;
          line-height: 1.3;
        }

        .status-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-text::before {
          content: "";
          width: 6px;
          height: 6px;
          background: #00e676;
          border-radius: 50%;
          display: inline-block;
        }

        .close-chat {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .close-chat:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }

        .whatsapp-chat-body {
          flex: 1;
          background: #e5ddd5;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23d5cec5' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23ddd5cc'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='769' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E");
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .message-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .typing-indicator-wrapper {
          display: flex;
          justify-content: flex-start;
          animation: slideIn 0.3s ease-out;
        }

        .typing-indicator {
          background: #fff;
          padding: 16px 20px;
          border-radius: 8px 8px 8px 0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          position: relative;
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-indicator::before {
          content: "";
          position: absolute;
          left: -8px;
          bottom: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0 12px 12px;
          border-color: transparent transparent #fff transparent;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #90949c;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .received-message {
          display: flex;
          justify-content: flex-start;
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-bubble {
          background: #fff;
          padding: 10px 14px;
          border-radius: 8px 8px 8px 0;
          max-width: 75%;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .message-bubble::before {
          content: "";
          position: absolute;
          left: -8px;
          bottom: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0 12px 12px;
          border-color: transparent transparent #fff transparent;
        }

        .message-text {
          color: #303030;
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 4px 0;
          word-wrap: break-word;
        }

        .message-time {
          color: #667781;
          font-size: 11px;
          display: block;
          text-align: right;
        }

        .chat-input-container {
          background: #f0f2f5;
          padding: 12px 16px;
          border-top: 1px solid #e9edef;
        }

        .input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: #fff;
          border-radius: 24px;
          padding: 8px 12px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .chat-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 15px;
          line-height: 1.5;
          resize: none;
          max-height: 100px;
          min-height: 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #3b4a54;
        }

        .chat-input::placeholder {
          color: #8696a0;
        }

        .send-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #25d366;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
          opacity: 0.5;
        }

        .send-button.active {
          opacity: 1;
          transform: scale(1);
        }

        .send-button:not(.active) {
          background: #d1d7db;
          cursor: not-allowed;
        }

        .send-button.active:hover {
          background: #20ba5a;
          transform: scale(1.05);
        }

        .send-button:active {
          transform: scale(0.95);
        }

        .whatsapp-float-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          height: 56px;
          padding: 0 24px;
          border-radius: 28px;
          background: linear-gradient(135deg, #25d366 0%, #20ba5a 100%);
          border: none;
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.35);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 998;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          color: #fff;
          gap: 10px;
        }

        .whatsapp-float-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(37, 211, 102, 0.45);
        }

        .whatsapp-float-button:active {
          transform: translateY(0);
        }

        .button-content {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .whatsapp-icon {
          flex-shrink: 0;
        }

        .button-text {
          font-size: 15px;
          font-weight: 600;
          white-space: nowrap;
          letter-spacing: 0.3px;
        }

        @media (max-width: 768px) {
          .whatsapp-chat-container {
            width: calc(100vw - 32px);
            height: calc(100vh - 180px);
            right: 16px;
            bottom: 100px;
            max-width: 420px;
          }

          .whatsapp-float-button {
            height: 52px;
            padding: 0 20px;
            right: 20px;
            bottom: 20px;
          }

          .button-text {
            font-size: 14px;
          }

          .whatsapp-icon {
            width: 22px;
            height: 22px;
          }
        }

        @media (max-width: 480px) {
          .whatsapp-chat-container {
            width: calc(100vw - 24px);
            right: 12px;
            bottom: 90px;
            border-radius: 12px;
          }

          .whatsapp-float-button {
            height: 48px;
            padding: 0 18px;
            right: 16px;
            bottom: 16px;
          }

          .button-text {
            font-size: 13px;
          }

          .whatsapp-icon {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsAppChat;