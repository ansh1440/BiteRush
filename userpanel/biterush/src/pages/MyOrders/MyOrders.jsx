import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import "./MyOrders.css";
import { orderService } from "../../service/orderService";
import { toast } from 'react-toastify';

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await orderService.fetchUserOrders(token);
    setData(response);
  };

  const cancelOrder = async (orderId, orderStatus) => {
    if (orderStatus !== 'Placed' && orderStatus !== 'Preparing') {
      toast.error('Order cannot be cancelled at this stage');
      return;
    }
    
    if (window.confirm('Are you sure you want to cancel this order? Refund will be processed within 24 hours.')) {
      try {
        await axios.post(`http://localhost:8080/api/orders/${orderId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Order cancelled successfully! Refund will be processed.');
        fetchOrders(); // Refresh orders
      } catch (error) {
        toast.error('Failed to cancel order. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        fetchOrders();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="container" style={{minHeight: '70vh'}}>
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table className="table table-responsive">
            <tbody>
              {data.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <img
                        src={assets.delivery}
                        alt=""
                        height={48}
                        width={48}
                      />
                    </td>
                    <td>
                      {order.orderedItems && order.orderedItems.map((item, itemIndex) => {
                        if (itemIndex === order.orderedItems.length - 1) {
                          return <span key={itemIndex}>{item.name + " x " + item.quantity}</span>;
                        } else {
                          return <span key={itemIndex}>{item.name + " x " + item.quantity + ", "}</span>;
                        }
                      })}
                    </td>
                    <td>&#x20B9;{order.amount.toFixed(2)}</td>
                    <td>Items: {order.orderedItems ? order.orderedItems.length : 0}</td>
                    <td className="fw-bold text-capitalize">
                      &#x25cf;{order.orderStatus}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={fetchOrders}
                          title="Refresh"
                        >
                          <i className="bi bi-arrow-clockwise"></i>
                        </button>
                        {/* Show cancel button for Placed and Preparing orders */}
                        {(order.orderStatus === 'Placed' || order.orderStatus === 'placed' || order.orderStatus === 'Preparing') && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => cancelOrder(order.id, order.orderStatus)}
                            title="Cancel Order"
                          >
                            <i className="bi bi-x-circle"></i> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
