import React, { useEffect, useState, useCallback, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./MyOrders.css";
import { fetchUserOrders } from "../../service/orderService";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  // Wrap fetchOrders in useCallback to satisfy ESLint dependencies
  const fetchOrders = useCallback(async () => {
    if (!token) return;
    const response = await fetchUserOrders(token);
    setData(response);
  }, [token]);

  // Fetch orders once on mount or when token changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrders, 30000); // 30s
    return () => clearInterval(interval);
  }, [fetchOrders]);

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table className="table table-responsive">
            <tbody>
              {data.map((order, index) => (
                <tr key={index}>
                  <td>
                    <img src={assets.delivery} alt="" height={48} width={48} />
                  </td>
                  <td>
                    {order.orderedItems?.map((item, itemIndex) => (
                      <span key={itemIndex}>
                        {item.name} x {item.quantity}
                        {itemIndex !== order.orderedItems.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </td>
                  <td>&#x20B9;{order.amount.toFixed(2)}</td>
                  <td>Items: {order.orderedItems?.length || 0}</td>
                  <td className="fw-bold text-capitalize">&#x25cf;{order.orderStatus}</td>
                  <td>
                    <button className="btn btn-sm btn-warning" onClick={fetchOrders}>
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
