import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(username, password) {
    const response = await axios.post(`${API_URL}/login`, {
        username,
        password
    });
    return response.data.token;
}
