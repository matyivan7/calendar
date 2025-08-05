import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await registerUser(username, password);
            navigate('/login');
        } catch (err) {
            setError('A regisztráció sikertelen. Próbáld újra!');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, []);

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', marginTop: '10%' }}>
            <h2>Regisztráció</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Felhasználónév</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Jelszó</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Regisztráció</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}
