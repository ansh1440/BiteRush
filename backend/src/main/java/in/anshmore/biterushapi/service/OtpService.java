package in.anshmore.biterushapi.service;

public interface OtpService {
    void sendOtp(String email);
    void sendOtp(String email, String userName);
    boolean verifyOtp(String email, String otp);
}