import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../service/authService";
import { sendOTP, verifyOTP } from "../../service/otpService";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleSendOTP = async () => {
    if (!data.email || !data.name || !data.password) {
      toast.error("Please fill all fields first");
      return;
    }
    
    try {
      await sendOTP(data.email, data.name);
      toast.success("OTP sent to your email");
      setIsOtpSent(true);
      setShowOtpField(true);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!isOtpSent) {
      // First time - send OTP
      handleSendOTP();
      return;
    }
    
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    
    try {
      // Verify OTP first
      await verifyOTP(data.email, otp);
      
      // Then register
      const response = await registerUser(data);
      if (response.status === 201) {
        toast.success("Registration completed. Please login.");
        navigate("/login");
      } else {
        toast.error("Unable to register. Please try again");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Invalid OTP. Please try again");
      } else {
        toast.error("Unable to register. Please try again");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Sign Up {showOtpField ? "- Verify OTP" : ""}
              </h5>
              <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="Jhon Doe"
                    name="name"
                    onChange={onChangeHandler}
                    value={data.name}
                    disabled={isOtpSent}
                    required
                  />
                  <label htmlFor="floatingName">Full Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    name="email"
                    onChange={onChangeHandler}
                    value={data.email}
                    disabled={isOtpSent}
                    required
                  />
                  <label htmlFor="floatingInput">Email</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    onChange={onChangeHandler}
                    value={data.password}
                    disabled={isOtpSent}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                
                {showOtpField && (
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingOTP"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength="6"
                      required
                    />
                    <label htmlFor="floatingOTP">Enter OTP</label>
                  </div>
                )}

                <div className="d-grid">
                  <button
                    className="btn btn-outline-primary btn-login text-uppercase"
                    type="submit"
                  >
                    {!isOtpSent ? "Send OTP" : "Sign up"}
                  </button>
                  {isOtpSent && (
                    <button
                      className="btn btn-outline-secondary btn-login text-uppercase mt-2"
                      type="button"
                      onClick={() => {
                        setIsOtpSent(false);
                        setShowOtpField(false);
                        setOtp("");
                      }}
                    >
                      Back
                    </button>
                  )}
                </div>
                <div className="mt-4">
                  Already have an account? <Link to="/login">Sign In</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
