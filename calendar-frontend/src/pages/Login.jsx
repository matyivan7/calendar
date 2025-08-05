import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useEffect } from 'react';
import { FaGem } from 'react-icons/fa';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = await loginUser(username, password);
            localStorage.setItem('token', token);
            navigate('/home');
        } catch (err) {
            setError('Hibás felhasználónév vagy jelszó!');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4">
                        <FaGem className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-light text-gray-900 mb-2">Nail Studio</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <h2 className="text-2xl font-light text-gray-900 text-center mb-8">Bejelentkezés</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Felhasználónév
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Adja meg felhasználónevét"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jelszó
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Adja meg jelszavát"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                        >
                            Bejelentkezés
                        </button>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                <div className="text-center mt-6">
                    <p className="text-gray-500 text-sm">
                        © 2025 Nail Studio. Minden jog fenntartva.
                    </p>
                </div>
            </div>
        </div>
    );
}
