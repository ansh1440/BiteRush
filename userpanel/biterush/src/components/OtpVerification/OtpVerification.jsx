import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyOTP, sendOTP } from "../../service/otpService";
import { registerUser } from "../../service/authService";
import "./OtpVerification.css";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = location.state || {};
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userData) {
      navigate("/register");
      return;
    }
  }, [userData, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^[0-9]*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(userData.email, otpString);
      const response = await registerUser(userData);
      
      if (response.status === 201) {
        toast.success("Registration completed successfully!");
        navigate("/login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Invalid OTP. Please try again.");
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOTP(userData.email, userData.name);
      toast.success("OTP resent to your email");
      setCountdown(300);
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  if (!userData) return null;

  return (
    <div className="otp-verification-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center">
                  <h4 className="card-title mb-4">Email Verification</h4>
                  <p className="text-muted mb-4">
                    We have sent a verification code to<br/>
                    <strong className="text-orange">{userData.email}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp}>
                  <div className="mb-4">
                    <label className="form-label text-center d-block mb-3">Enter Verification Code</label>
                    <div className="otp-field mb-4">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="number"
                          className="otp-box"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          data-index={index}
                          maxLength="1"
                          min="0"
                          max="9"
                          required
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-muted mb-2">
                      <small>Code expires in: <span className="text-danger fw-bold">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span></small>
                    </p>
                    {countdown === 0 ? (
                      <button 
                        type="button" 
                        className="btn btn-link p-0" 
                        onClick={handleResendOTP}
                      >
                        Resend Code
                      </button>
                    ) : (
                      <small className="text-muted">Didn't receive code? Check your spam folder</small>
                    )}
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-orange btn-lg"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Verifying...
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </button>
                    
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => navigate("/register")}
                    >
                      Back to Registration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;