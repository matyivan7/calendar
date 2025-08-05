import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
            <h1>Home oldal – Be vagy jelentkezve!</h1>
            <button onClick={handleLogout}>Kijelentkezés</button>
        </div>
    );
}
