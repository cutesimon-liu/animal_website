import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa'; // Assuming react-icons is installed

// Fallback icons if not using react-icons or if icons are missing
const RobotIcon = () => <span role="img" aria-label="robot">🤖</span>;
const CloseIcon = () => <span role="img" aria-label="close">✖️</span>;
const SendIcon = () => <span role="img" aria-label="send">➤</span>;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: '你好！我是這個網站的 AI 導覽員。你可以問我關於動物、宇宙的問題，或者想了解網站有哪些遊戲！' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // Prepare history for API
            // Filter out the initial welcome message if it's the very first one and is from AI
            const historyMessages = messages.filter((msg, index) => !(index === 0 && msg.role === 'ai'));

            const history = historyMessages.slice(-10).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                message: msg.text
            }));

            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage, history }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: '抱歉，我現在有點累，請稍後再試試。 (Error: ' + (data.error || 'Unknown') + ')' }]);
            }
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'ai', text: '連線發生錯誤，請檢查網路連線。' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {!isOpen && (
                <button className="chatbot-toggle" onClick={toggleChat} aria-label="Open Chat">
                    <FaRobot size={28} />
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <span>網站小助手</span>
                        <button className="chatbot-close" onClick={toggleChat} aria-label="Close Chat">
                            <FaTimes />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        ))}
                        {isLoading && <div className="typing-indicator">AI 正在思考中...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="input-area" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="chatbot-input"
                            placeholder="輸入問題..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
