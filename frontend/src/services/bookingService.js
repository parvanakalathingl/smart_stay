import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bookings';

export const createBooking = async (bookingData) => {
    const res = await axios.post(API_URL, bookingData);
    return res.data;
};

export const getUserBookings = async () => {
    const res = await axios.get(`${API_URL}/user`);
    return res.data;
};

export const getOwnerBookings = async () => {
    const res = await axios.get(`${API_URL}/owner`);
    return res.data;
};

export const getAllBookings = async () => {
    const res = await axios.get(`${API_URL}/admin`);
    return res.data;
};

export const updateBookingStatus = async (id, status) => {
    const res = await axios.patch(`${API_URL}/${id}/status`, { status });
    return res.data;
};
