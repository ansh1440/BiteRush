import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { orderService } from "../service/orderService"; 
import { toast } from 'react-toastify';

const PayPalButtonWrapper = ({ orderAmount, orderDetails, onPaymentSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialOptions = {
    "client-id": "ARHgF0SNqTKdua0JXkIj56lsBeNbnf2htgMnwJ7flCh_UboeF8ucDzN7nTDXiRns6sBGsi93UncoCswI",
    currency: "USD",
    intent: "capture",
  };

  const createOrder = async (data, actions) => {
    setIsLoading(true);
    setError(null);
    try {
      // Convert INR to USD and ensure minimum amount
      let usdAmount = (parseFloat(orderAmount) / 83).toFixed(2);
      if (parseFloat(usdAmount) < 1.00) {
        usdAmount = "1.00"; // PayPal minimum
      }
      
      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: usdAmount
          }
        }]
      });
    } catch (err) {
      console.error('PayPal order creation error:', err);
      setError("Failed to create PayPal order. Please try again.");
      toast.error("Failed to create order.");
      setIsLoading(false);
      throw err;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      
      // Create order in backend after successful PayPal payment
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const orderData = {
        ...orderDetails,
        paypalOrderId: data.orderID,
        paymentStatus: "PAID"
      };
      
      await orderService.createOrder(orderData, token);
      toast.success("Payment successful!");
      onPaymentSuccess();
    } catch (err) {
      console.error('PayPal capture error:', err);
      setError("Failed to process payment. Please contact support.");
      toast.error("Payment processing failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (err) => {
    console.error('PayPal error:', err);
    setError("An error occurred with the PayPal payment. Please try again.");
    toast.error("PayPal error occurred.");
    setIsLoading(false);
  };

  return (
    <div className="paypal-button-container" style={{ width: "100%", minHeight: "150px" }}>
      {error && (
        <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>
          {error}
        </div>
      )}

      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          disabled={isLoading}
        />
      </PayPalScriptProvider>
      
      {isLoading && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          Processing...
        </div>
      )}
    </div>
  );
};

export default PayPalButtonWrapper;