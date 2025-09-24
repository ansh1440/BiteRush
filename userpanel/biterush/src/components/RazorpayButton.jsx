import React, { useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

const RazorpayButton = ({ orderAmount, orderDetails, onPaymentSuccess }) => {

  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {

    setIsProcessing(true);
    
    const res = await loadRazorpay();
    if (!res) {
      toast.error('Razorpay SDK failed to load');
      setIsProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first');
      }

      // Create Razorpay order via backend

      const orderResponse = await axios.post('http://localhost:8080/api/orders/razorpay/create', {
        amount: parseFloat(orderAmount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });


      const { orderId, key, amount, currency } = orderResponse.data;

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        order_id: orderId,
        name: 'BiteRush',
        description: 'Food Order Payment',
        handler: async function (response) {
          try {
            // Verify payment and create order
            await axios.post('http://localhost:8080/api/orders/razorpay/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderDetails: orderDetails
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success("Payment successful! Order placed.");
            onPaymentSuccess();
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        prefill: {
          email: orderDetails.email,
          contact: orderDetails.phoneNumber.replace(/[^0-9]/g, '').substring(0, 10)
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
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
          backgroundColor: '#3399cc', 
          borderColor: '#3399cc',
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
        <small className="text-muted">Secure Payment with Razorpay</small>
      </div>
    </div>
  );
};

export default RazorpayButton;