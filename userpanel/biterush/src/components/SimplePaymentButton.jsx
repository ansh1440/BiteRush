import React, { useState } from "react";
import { orderService } from "../service/orderService";
import { toast } from 'react-toastify';

const SimplePaymentButton = ({ orderAmount, orderDetails, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first');
      }

      // Create order with payment
      const orderResponse = await orderService.createOrder(orderDetails, token);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Payment successful! Order placed.");
      onPaymentSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-button-container">
      <button 
        className="btn btn-primary btn-lg w-100"
        onClick={handlePayment}
        disabled={isProcessing}
        style={{ 
          backgroundColor: '#0070ba', 
          borderColor: '#0070ba',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {isProcessing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Processing Payment...
          </>
        ) : (
          <>Pay ₹{orderAmount}</>
        )}
      </button>
      <div className="text-center mt-2">
        <small className="text-muted">Secure Payment Processing</small>
      </div>
    </div>
  );
};

export default SimplePaymentButton;