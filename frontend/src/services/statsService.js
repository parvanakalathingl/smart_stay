import axios from 'axios';

const API_URL = 'http://localhost:5000/api/stats';

export const getOwnerStats = async () => {
    const res = await axios.get(`${API_URL}/owner`);
    return res.data;
};

export const getAdminStats = async () => {
    const res = await axios.get(`${API_URL}/admin`);
    return res.data;
};
