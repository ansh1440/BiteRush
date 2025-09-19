import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/foodService";
import axios from "axios";
import {
  addToCart,
  getCartData,
  removeQtyFromCart,
  deleteFromCart,
} from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const increaseQty = async (foodId) => {
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }
    setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
    try {
      await addToCart(foodId, token);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 1) - 1 }));
    }
  };

  const decreaseQty = async (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0,
    }));
    try {
      await removeQtyFromCart(foodId, token);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
    }
  };

  const removeFromCart = async (foodId) => {
    if (!token) {
      alert('Please login to remove items from cart');
      return;
    }
    // Optimistically remove from UI
    setQuantities((prevQuantities) => {
      const updatedQuantitites = { ...prevQuantities };
      delete updatedQuantitites[foodId];
      return updatedQuantitites;
    });
    try {
      await deleteFromCart(foodId, token);
    } catch (error) {
      console.error('Failed to delete from cart:', error);
      // Reload cart data on error
      await loadCartData(token);
    }
  };

  const loadCartData = async (token) => {
    try {
      const items = await getCartData(token);
      setQuantities(items || {});
    } catch (error) {
      console.error('Failed to load cart data:', error);
      setQuantities({});
    }
  };

  const contextValue = {
    foodList,
    increaseQty,
    decreaseQty,
    quantities,
    removeFromCart,
    token,
    setToken,
    setQuantities,
    loadCartData,
    loading,
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchFoodList();
        setFoodList(data || []);
        if (localStorage.getItem("token")) {
          setToken(localStorage.getItem("token"));
          await loadCartData(localStorage.getItem("token"));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setFoodList([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
