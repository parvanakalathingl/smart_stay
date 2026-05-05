import axios from 'axios';

const API_URL = 'http://localhost:5000/api/listings';

export const createListing = async (formData) => {
    const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const getOwnerListings = async () => {
    const res = await axios.get(`${API_URL}/owner`);
    return res.data;
};

export const getListingById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

export const deleteListing = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};

export const verifyListing = async (id, status) => {
    const res = await axios.patch(`${API_URL}/${id}/verify`, { status });
    return res.data;
};

export const getPendingListings = async () => {
    const res = await axios.get(`${API_URL}/admin/pending`);
    return res.data;
};
