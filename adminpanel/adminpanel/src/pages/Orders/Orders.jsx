import React, { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "../../services/orderService";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = () => {
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetchAllOrders();
      setData(response);
    } catch (error) {
      toast.error("Unable to display the orders. Please try again.");
    }
  };

  const updateStatus = async (event, orderId) => {
    const success = await updateOrderStatus(orderId, event.target.value);
    if (success) await fetchOrders();
  };

  // Fetch orders once on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrders, 30000); // 30000ms = 30 seconds
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table className="table table-responsive">
            <tbody>
              {data.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <img
                        src={assets.biterush}
                        alt="Order"
                        height={32}
                        width={32}
                      />
                    </td>
                    <td>
                      <div>
                        {order.orderedItems.map((item, itemIndex) => {
                          if (itemIndex === order.orderedItems.length - 1) {
                            return (
                              <span key={itemIndex}>
                                {item.name + " x " + item.quantity}
                              </span>
                            );
                          } else {
                            return (
                              <span key={itemIndex}>
                                {item.name + " x " + item.quantity + ", "}
                              </span>
                            );
                          }
                        })}
                      </div>
                      <div>
                        {order.userAddress === "123 Main St"
                          ? "502 5th Floor, Sunshine Plaza, Kailash Lassi Lane, near Dadar Railway Station, Dadar East, Dadar, Mumbai, Maharashtra 400014"
                          : order.userAddress}
                      </div>
                    </td>
                    <td>&#x20B9;{order.amount.toFixed(2)}</td>
                    <td>Items: {order.orderedItems.length}</td>
                    <td>
                      <select
                        className="form-select"
                        style={{ minWidth: "150px", fontSize: "14px" }}
                        onChange={(event) => updateStatus(event, order.id)}
                        value={order.orderStatus}
                      >
                        <option value="Food Preparing">Food Preparing</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
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

export default Orders;
