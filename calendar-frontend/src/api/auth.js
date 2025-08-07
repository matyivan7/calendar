import axios from 'axios';

const API_URL = "http://localhost:8080/api";

export async function loginUser(username, password) {
    const response = await axios.post(`${API_URL}/login`,
        {username, password},
        {
            headers: {'Content-Type': 'application/json'}
        });
    const { token } = response.data;
    localStorage.setItem('jwt_token', token);
    return response.data;
}

export async function registerUser(username, password) {
    const response = await axios.post(`${API_URL}/register`,
        {username, password},
        {
            withCredentials: true,
            headers: {'Content-Type': 'application/json'}
        });
    return response.data;
}

export async function getAllAppointments() {
    const token = localStorage.getItem('jwt_token');

    const response = await axios.get(`${API_URL}/appointments/all`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data;
}

export async function createAppointment(request) {
    const token = localStorage.getItem('jwt_token');

    const response = await axios.post(`${API_URL}/appointments/new`,
        request,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

    return response.data;
}

export async function updateAppointment(request) {
    const token = localStorage.getItem('jwt_token');

    const response = await axios.post(`${API_URL}/appointments/update`,
        request,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

    return response.data
}
