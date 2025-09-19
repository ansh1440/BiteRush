import React, { useContext } from "react";
import Menubar from "./components/Menubar/Menubar";
import Footer from "./components/Footer/Footer";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import ExploreFood from "./pages/ExploreFood/ExploreFood";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import OtpVerification from "./components/OtpVerification/OtpVerification";
import { ToastContainer } from "react-toastify";
import MyOrders from "./pages/MyOrders/MyOrders";

import SimpleFooter from "./components/Footer/SimpleFooter";
import { StoreContext } from "./context/StoreContext";
import "./utils/axiosConfig";

const App = () => {
  const { token } = useContext(StoreContext);
  const location = useLocation();
  const hideFooterPaths = ['/login', '/register', '/verify-otp'];
  
  return (
    <div>
      <Menubar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/explore" element={<ExploreFood />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={token ? <PlaceOrder /> : <Login />} />
        <Route path="/login" element={token ? <Home /> : <Login />} />
        <Route path="/register" element={token ? <Home /> : <Register />} />
        <Route path="/verify-otp" element={token ? <Home /> : <OtpVerification />} />
        <Route path="/myorders" element={token ? <MyOrders /> : <Login />} />

      </Routes>
      {!hideFooterPaths.includes(location.pathname) && <SimpleFooter />}
    </div>
  );
};

export default App;
