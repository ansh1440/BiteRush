import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/cartUtils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../service/orderService";
import { clearCartItems } from "../../service/cartService";
import RazorpayButton from "../../components/RazorpayButton";


const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const cartItems = foodList.filter((food) => quantities[food.id] > 0);

  const { subtotal, deliveryFee, platformFee, totalGST, total } = calculateCartTotals(
    cartItems,
    quantities
  );

  const clearCart = async () => {
    try {
      await clearCartItems(token, setQuantities);
    } catch (error) {
      toast.error("Error while clearing the cart.");
    }
  };

  const handlePaymentSuccess = async () => {
    await clearCart();
    navigate("/myorders");
  };

  // 🔹 Check if the form is valid
  const isFormValid = () => {
    return (
      data.firstName &&
      data.lastName &&
      data.email &&
      data.phoneNumber &&
      data.address &&
      data.state &&
      data.city &&
      data.zip
    );
  };

  return (
    <div className="container mt-4">
      <main>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto"
            src={assets.logo}
            alt="Logo"
            width="98"
            height="98"
          />
        </div>
        <div className="row g-5">
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">
                {cartItems.length}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between lh-sm"
                >
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-body-secondary">
                      Qty: {quantities[item.id]}
                    </small>
                  </div>
                  <span className="text-body-secondary">
                    &#8377;{item.price * quantities[item.id]}
                  </span>
                </li>
              ))}
              {deliveryFee > 0 && (
                <li className="list-group-item d-flex justify-content-between">
                  <div><span>Delivery Fee</span></div>
                  <span className="text-body-secondary">&#8377;{deliveryFee.toFixed(2)}</span>
                </li>
              )}
              {subtotal >= 399 && deliveryFee === 0 && (
                <li className="list-group-item d-flex justify-content-between text-success">
                  <div><span>Delivery Fee</span></div>
                  <span className="text-body-secondary"><s>&#8377;29.00</s> FREE</span>
                </li>
              )}
              {platformFee > 0 && (
                <li className="list-group-item d-flex justify-content-between">
                  <div><span>Platform Fee</span></div>
                  <span className="text-body-secondary">&#8377;{platformFee.toFixed(2)}</span>
                </li>
              )}
              <li className="list-group-item d-flex justify-content-between">
                <div><span>GST & Restaurant Charges</span></div>
                <span className="text-body-secondary">&#8377;{totalGST.toFixed(2)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (INR)</span>
                <strong>&#8377;{total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>

          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation">
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">First name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder="John"
                    required
                    name="firstName"
                    onChange={onChangeHandler}
                    value={data.firstName}
                  />
                </div>

                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder="Doe"
                    required
                    name="lastName"
                    value={data.lastName}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">@</span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      required
                      name="email"
                      value={data.email}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    placeholder="9876543210"
                    required
                    name="phoneNumber"
                    value={data.phoneNumber}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="1234 Main St"
                    required
                    name="address"
                    value={data.address}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-md-5">
                  <label htmlFor="state" className="form-label">State</label>
                  <select
                    className="form-select"
                    id="state"
                    required
                    name="state"
                    value={data.state}
                    onChange={onChangeHandler}
                  >
                    <option value="">Choose...</option>
                    <option>Karnataka</option>
                    <option>Maharashtra</option>
                    <option>Tamil Nadu</option>
                    <option>Delhi</option>
                    <option>Gujarat</option>
                    <option>Rajasthan</option>
                    <option>Uttar Pradesh</option>
                    <option>West Bengal</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label htmlFor="city" className="form-label">City</label>
                  <select
                    className="form-select"
                    id="city"
                    required
                    name="city"
                    value={data.city}
                    onChange={onChangeHandler}
                  >
                    <option value="">Choose...</option>
                    <option>Bangalore</option>
                    <option>Mumbai</option>
                    <option>Chennai</option>
                    <option>Delhi</option>
                    <option>Hyderabad</option>
                    <option>Pune</option>
                    <option>Kolkata</option>
                    <option>Ahmedabad</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">Pincode</label>
                  <input
                    type="number"
                    className="form-control"
                    id="zip"
                    placeholder="560001"
                    required
                    name="zip"
                    value={data.zip}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <hr className="my-4" />
            </form>

            {cartItems.length > 0 && isFormValid() ? (
              <div className="mt-4">
                <h5>Complete Payment</h5>
                <RazorpayButton
                  orderAmount={total.toFixed(2)}
                  orderDetails={{
                    userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}`,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    orderedItems: cartItems.map((item) => ({
                      foodId: item.id.toString(),
                      quantity: quantities[item.id],
                      price: item.price * quantities[item.id],
                      category: item.category,
                      imageUrl: item.imageUrl,
                      description: item.description,
                      name: item.name,
                    })),
                    amount: total.toFixed(2),
                    orderStatus: "Preparing",
                  }}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </div>
            ) : (
              <div className="mt-4 text-muted">
                Please fill out the billing address to proceed with payment.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceOrder;
