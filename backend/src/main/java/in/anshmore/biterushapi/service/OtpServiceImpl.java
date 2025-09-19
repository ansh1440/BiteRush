package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.entity.OtpEntity;
import in.anshmore.biterushapi.entity.UserEntity;
import in.anshmore.biterushapi.repository.OtpRepository;
import in.anshmore.biterushapi.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@AllArgsConstructor
@Slf4j
public class OtpServiceImpl implements OtpService {
    
    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    
    @Override
    @Transactional
    public void sendOtp(String email) {
        sendOtp(email, null);
    }
    
    @Override
    @Transactional
    public void sendOtp(String email, String userName) {
        otpRepository.deleteByEmail(email);
        
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        OtpEntity otpEntity = OtpEntity.builder()
                .email(email)
                .otp(otp)
                .build();
        otpRepository.save(otpEntity);
        
        // Send email asynchronously - don't wait for completion
        try {
            sendEmailAsync(email, otp, userName);
        } catch (Exception e) {
            // Log error but don't fail the OTP generation
            log.warn("Email sending failed, but OTP saved: {}", e.getMessage());
        }
    }
    
    @Async
    public void sendEmailAsync(String email, String otp, String userName) {
        try {
            Thread.sleep(100); // Small delay to ensure transaction commits
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(email);
            helper.setSubject("BiteRush - Email Verification");
            String displayName = userName != null ? userName : getUsernameFromEmail(email);
            helper.setText(createHtmlContent(otp, displayName), true);
            
            mailSender.send(message);
            log.info("Email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", email, e.getMessage());
        }
    }
    
    private String getUsernameFromEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    log.debug("Found user: {} for email: {}", user.getName(), email);
                    return user.getName();
                })
                .orElseGet(() -> {
                    log.debug("User not found for email: {}", email);
                    return "User";
                });
    }
    
    private String createHtmlContent(String otp, String name) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>BiteRush - Email Verification</title>" +
                "</head>" +
                "<body style='margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;'>" +
                "<div style='max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>" +
                "<div style='background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 40px 20px; text-align: center; color: white;'>" +
                "<h1 style='margin: 0; font-size: 32px; font-weight: bold;'>🍔 BiteRush 🍕</h1>" +
                "<p style='margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;'>Welcome to delicious food delivery!</p>" +
                "</div>" +
                "<div style='padding: 40px 30px;'>" +
                "<h2 style='color: #333; margin: 0 0 20px 0; font-size: 24px;'>Hi " + name + "!</h2>" +
                "<p style='color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;'>" +
                "Thank you for signing up with <strong style='color: #ff6b35;'>BiteRush!</strong> We're excited to have you on board." +
                "</p>" +
                "<p style='color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;'>" +
                "To complete your registration, please verify your email using the OTP below:" +
                "</p>" +
                "<div style='border: 2px dashed #ff6b35; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0;'>" +
                "<p style='color: #333; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;'>Your Verification Code</p>" +
                "<div style='font-size: 36px; font-weight: bold; color: #ff6b35; letter-spacing: 8px; margin: 10px 0;'>" + otp + "</div>" +
                "</div>" +
                "<div style='background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;'>" +
                "<p style='margin: 0; color: #856404; font-size: 14px;'>" +
                "<strong>⚠️ Important:</strong> This OTP is valid for 5 minutes only." +
                "</p>" +
                "</div>" +
                "<p style='color: #666; font-size: 16px; line-height: 1.5; margin: 30px 0 0 0;'>" +
                "Enjoy delicious food at your fingertips!" +
                "</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
    
    @Override
    @Transactional
    public boolean verifyOtp(String email, String otp) {
        log.info("Starting OTP verification for email: {}", email);
        
        return otpRepository.findByEmailAndOtp(email, otp)
                .map(otpEntity -> {
                    log.debug("OTP found in database for email: {}", email);
                    if (otpEntity.getExpiresAt().isAfter(LocalDateTime.now())) {
                        log.debug("OTP is valid (not expired) for email: {}", email);
                        
                        // Update user verification status
                        var userOptional = userRepository.findByEmail(email);
                        if (userOptional.isPresent()) {
                            UserEntity user = userOptional.get();
                            log.debug("Updating email verification status for user: {}", user.getEmail());
                            user.setEmailVerified(true);
                            userRepository.save(user);
                            log.info("Email verification completed for user: {}", user.getEmail());
                        } else {
                            log.error("User not found for email: {}", email);
                        }
                        
                        otpRepository.deleteByEmail(email);
                        log.debug("OTP deleted from database for email: {}", email);
                        log.info("OTP verification successful for email: {}", email);
                        return true;
                    } else {
                        log.warn("OTP expired for email: {}", email);
                        return false;
                    }
                }).orElse(false);
    }
}