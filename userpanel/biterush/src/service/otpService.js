import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const sendOTP = async (email, username) => {
    try {
        const response = await axios.post(`${API_URL}/send-otp?email=${email}&username=${encodeURIComponent(username)}`);
        return response.data;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

export const verifyOTP = async (email, otp) => {
    try {
        const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
        return response.data;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};