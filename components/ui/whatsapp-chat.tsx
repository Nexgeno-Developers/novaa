"use client";

import React, { useState } from "react";

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
  const [showMenu, setShowMenu] = useState(false);

  const handleChatIconClick = () => {
    setShowMenu(!showMenu);
  };

  const handleTalkToUs = () => {
    window.location.href = `tel:${phoneNumber}`;
    setShowMenu(false);
  };

  const handleChatWithUs = () => {
    // Direct WhatsApp link with default message
    const defaultMessage = encodeURIComponent(
      `Hi, I am contacting you through your website ${websiteUrl}`
    );
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${defaultMessage}`;
    window.open(whatsappUrl, "_blank");
    setShowMenu(false);
  };

  return (
    <>
      {/* WhatsApp Chat Widget - COMMENTED OUT FOR NOW */}
      {/* <div className={`whatsapp-chat-container ${isOpen ? "show" : "hide"}`}>
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

        <div className="whatsapp-chat-body">
          <div className="message-container">
            {showTypingIndicator && (
              <div className="typing-indicator-wrapper">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

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
      </div> */}

      {/* Options Menu */}
      <div className={`options-menu ${showMenu ? "show" : "hide"}`}>
        <button className="menu-option" onClick={handleTalkToUs}>
          <div className="option-icon phone-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="option-text" style={{ color: "#592720" }}>Talk to our Experts</span>
        </button>

        <button className="menu-option whatsapp-option" onClick={handleChatWithUs}>
          <div className="option-icon whatsapp-icon-option">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="option-text">Chat on Whatsapp</span>
        </button>
      </div>

      {/* Chat Icon Button */}
      <button
        className={`chat-float-button ${showMenu ? 'close-mode' : ''}`}
        onClick={handleChatIconClick}
        aria-label={showMenu ? "Close menu" : "Open chat options"}
      >
        {showMenu ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="#F5F5F5"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              stroke="#F5F5F5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        )}
      </button>

      <style jsx>{`
        /* Commented out chat container styles - keeping for future use */
        /* .whatsapp-chat-container {
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
        } */

        /* Options Menu */
        .options-menu {
          position: fixed;
          bottom: 100px;
          right: 24px;
          border-radius: 16px;
          padding: 12px;
          z-index: 998;
          min-width: 280px;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-origin: bottom right;
        }

        .options-menu.show {
          opacity: 1;
          transform: scale(1) translateY(0);
          visibility: visible;
        }

        .options-menu.hide {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
          visibility: hidden;
          pointer-events: none;
        }

        .menu-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 8px 12px;
          border: none;
          background: #E5E4E2;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .menu-option:last-of-type {
          margin-bottom: 0;
        }

        .menu-option:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .menu-option:active {
          transform: translateY(0);
        }

        .option-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .phone-icon {
          // background: #9F8170;
          color: #592720;
        }

        .whatsapp-icon-option {
          // background: linear-gradient(135deg, #25d366 0%, #20ba5a 100%);
          color: #22CD63;
        }

        .option-text {
          font-size: 18px;
          font-weight: 600;
          color: #22CD63;
          text-align: left;
          flex: 1;
        }


        /* Chat Float Button */
        .chat-float-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #d4af37;
          border: none;
          box-shadow: 0 8px 24px rgba(1, 41, 43, 0.35);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 997;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          color: #F5F5F5;
        }

        .chat-float-button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 12px 32px rgba(1, 41, 43, 0.45);
        }

        .chat-float-button:active {
          transform: translateY(0) scale(1);
        }

        .chat-float-button.close-mode {
          background: #d4af37;
          box-shadow: 0 8px 24px rgba(212, 165, 116, 0.35);
          transform: rotate(90deg);
        }

        .chat-float-button.close-mode:hover {
          transform: rotate(90deg) translateY(-2px) scale(1.05);
          box-shadow: 0 12px 32px rgba(212, 165, 116, 0.45);
        }

        @media (max-width: 768px) {
          .options-menu {
            right: 16px;
            bottom: 90px;
            min-width: calc(100vw - 32px);
            max-width: 320px;
          }

          .chat-float-button {
            width: 56px;
            height: 56px;
            right: 20px;
            bottom: 20px;
          }

          .chat-float-button svg {
            width: 24px;
            height: 24px;
          }
        }

        @media (max-width: 480px) {
          .options-menu {
            right: 12px;
            bottom: 80px;
            min-width: calc(100vw - 24px);
          }

          .chat-float-button {
            width: 52px;
            height: 52px;
            right: 16px;
            bottom: 16px;
          }

          .chat-float-button svg {
            width: 22px;
            height: 22px;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsAppChat;