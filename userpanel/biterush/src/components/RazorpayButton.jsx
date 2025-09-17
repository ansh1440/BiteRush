import React, { useState } from "react";
import { orderService } from "../service/orderService";
import { toast } from 'react-toastify';

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

      const options = {
        key: 'rzp_test_y1gUp0bdv168FC',
        amount: Math.round(parseFloat(orderAmount) * 100),
        currency: 'INR',
        name: 'BiteRush',
        description: 'Food Order Payment',
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay using ' + 'UPI/Cards/Netbanking',
                instruments: [
                  {
                    method: 'card'
                  },
                  {
                    method: 'upi'
                  }
                ]
              }
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        handler: async function (response) {
          try {
            if (!token) {
              throw new Error('Authentication token missing');
            }
            
            const orderData = {
              ...orderDetails,
              razorpayPaymentId: response.razorpay_payment_id || 'test_payment_' + Date.now(),
              paymentStatus: "PAID"
            };
            
            console.log('Creating order with token:', token.substring(0, 20) + '...');
            await orderService.createOrder(orderData, token);
            toast.success("Payment successful! Order placed.");
            onPaymentSuccess();
          } catch (error) {
            console.error('Order creation error:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
              toast.error("Authentication failed. Please login again.");
            } else {
              toast.error("Payment successful but order creation failed. Please contact support.");
            }
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