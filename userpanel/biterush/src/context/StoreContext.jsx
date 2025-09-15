import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/foodService";
import axios from "axios";
import {
  addToCart,
  getCartData,
  removeQtyFromCart,
} from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");

  const increaseQty = async (foodId) => {
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

  const removeFromCart = (foodId) => {
    setQuantities((prevQuantities) => {
      const updatedQuantitites = { ...prevQuantities };
      delete updatedQuantitites[foodId];
      return updatedQuantitites;
    });
  };

  const loadCartData = async (token) => {
    const items = await getCartData(token);
    setQuantities(items);
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
  };

  useEffect(() => {
    async function loadData() {
      const data = await fetchFoodList();
      setFoodList(data);
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
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
