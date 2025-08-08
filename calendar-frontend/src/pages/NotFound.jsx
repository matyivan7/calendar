import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGem, FaHome, FaArrowLeft, FaSearch } from 'react-icons/fa';

const NotFoundPage = () => {
    const [floatingEmojis, setFloatingEmojis] = useState([]);
    const [currentMessage, setCurrentMessage] = useState(0);
    const navigate = useNavigate();

    const funnyMessages = [
        "Oops! Ez a köröm nincs a helyén! 💅",
        "404 - Ez a manikűr nem található! 🤷‍♀️",
    ];

    useEffect(() => {
        const emojis = ['💅', '✨', '💖', '🌸', '💎'];
        const newFloatingEmojis = [];

        for (let i = 0; i < 8; i++) {
            newFloatingEmojis.push({
                id: i,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                left: Math.random() * 100,
                delay: Math.random() * 3,
                duration: 3 + Math.random() * 2
            });
        }
        setFloatingEmojis(newFloatingEmojis);

        // Rotate funny messages
        const messageInterval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % funnyMessages.length);
        }, 3000);

        return () => clearInterval(messageInterval);
    }, []);

    const handleGoHome = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/calendar');
        } else {
            navigate('/login');
        }
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center px-4 relative overflow-hidden">
            {floatingEmojis.map((item) => (
                <div
                    key={item.id}
                    className="absolute text-2xl opacity-20 pointer-events-none animate-bounce"
                    style={{
                        left: `${item.left}%`,
                        animationDelay: `${item.delay}s`,
                        animationDuration: `${item.duration}s`,
                        top: `${20 + Math.random() * 60}%`
                    }}
                >
                    {item.emoji}
                </div>
            ))}

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4 animate-pulse">
                        <FaGem className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-light text-gray-900 mb-2">Nail Studio</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">

                    <div className="mb-6">
                        <h2 className="text-8xl font-light text-transparent bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text mb-2">
                            404
                        </h2>
                        <div className="text-6xl mb-4">🤔</div>
                    </div>

                    <div className="mb-8 h-12 flex items-center justify-center">
                        <p
                            key={currentMessage}
                            className="text-lg font-medium text-gray-700 animate-fade-in"
                        >
                            {funnyMessages[currentMessage]}
                        </p>
                    </div>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Úgy néz ki, hogy egy nem létező oldalra tévedt!
                        Ne izguljon, még a legjobb manikűrösök is elvétik néha a célpontot.
                        Térjünk vissza a szép körmökhöz! 💖
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoHome}
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                        >
                            <FaHome className="w-4 h-4" />
                            Vissza a főoldalra
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={handleGoBack}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                Vissza
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-gray-500 text-sm">
                        © 2025 Nail Studio. Minden jog fenntartva.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;