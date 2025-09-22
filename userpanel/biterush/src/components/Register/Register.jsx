import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendOTP } from "../../service/otpService";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleCaptchaExpired = () => {
    setCaptchaVerified(false);
    toast.warning("CAPTCHA expired. Please solve it again.");
  };

  const handleCaptchaError = () => {
    setCaptchaVerified(false);
    toast.error("CAPTCHA error. Please try again.");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Validation
    if (!data.name || !data.email || !data.password) {
      toast.error("Please fill all fields");
      return;
    }
    if (data.name.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(data.name)) {
      toast.error("Name should only contain letters and spaces");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!captchaVerified) {
      toast.error("Please complete CAPTCHA verification");
      return;
    }
    
    setLoading(true);
    try {
      await sendOTP(data.email, data.name);
      toast.success("Verification code sent to your email");
      navigate("/verify-otp", { state: { userData: data } });
    } catch (error) {
      console.log('Registration error:', error.response); // Debug log
      const errorMessage = error.response?.data || error.response?.data?.message || error.message || "";
      if (errorMessage.includes("already registered") || errorMessage.includes("already verified")) {
        toast.error("This email is already registered. Please sign in instead");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("Unable to send verification code. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Sign Up
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
                    required
                  />
                  <label htmlFor="floatingInput">Email</label>
                </div>
                <div className="form-floating mb-3 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    onChange={onChangeHandler}
                    value={data.password}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                  <button
                    type="button"
                    className="position-absolute top-50 end-0 translate-middle-y me-2"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      border: 'none', 
                      background: 'none', 
                      zIndex: 10,
                      color: '#6c757d',
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>

                <div className="mb-3 d-flex justify-content-center">
                  <ReCAPTCHA
                    sitekey="6Lfq0tErAAAAAPI9X0ZbPyIySX9a42PHEkVdplxk"
                    onChange={handleCaptchaChange}
                    onExpired={handleCaptchaExpired}
                    onErrored={handleCaptchaError}
                  />
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-outline-primary btn-login text-uppercase"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Sending...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
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