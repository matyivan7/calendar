import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';

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

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', marginTop: '10%' }}>
            <h2>Bejelentkezés</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Felhasználónév</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Jelszó</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Bejelentkezés</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}
