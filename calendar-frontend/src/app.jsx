import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return null;
}