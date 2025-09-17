import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

// 🔹 Consolidated order service object
export const orderService = {
  // Fetch user orders
  fetchUserOrders: async (token) => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while fetching the orders", error);
      throw error;
    }
  },

  // Create a new order
  createOrder: async (orderData, token) => {
    try {
      const response = await axios.post(`${API_URL}/create`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while creating the order", error);
      throw error;
    }
  },

  // Capture PayPal payment
  capturePayment: async (orderID, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/capture`,
        { orderID }, // Send the orderID in the request body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error occurred while capturing the payment", error);
      throw error;
    }
  },

  // Delete an order
  deleteOrder: async (orderId, token) => {
    try {
      await axios.delete(`${API_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error occurred while deleting the order", error);
      throw error;
    }
  },
};