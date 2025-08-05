import axios from 'axios';

const API_URL = "http://localhost:8080/api";

export async function loginUser(username, password) {
    const response = await axios.post(`${API_URL}/login`, {
        username,
        password
    });
    return response.data;
}

export async function registerUser(username, password) {
    const response = await axios.post(`${API_URL}/register`, {
        username,
        password
    });
    return response.data;
}
