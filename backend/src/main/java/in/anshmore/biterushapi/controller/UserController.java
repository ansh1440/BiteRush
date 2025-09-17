package in.anshmore.biterushapi.controller;

import in.anshmore.biterushapi.io.OtpRequest;
import in.anshmore.biterushapi.io.UserRequest;
import in.anshmore.biterushapi.io.UserResponse;
import in.anshmore.biterushapi.service.OtpService;
import in.anshmore.biterushapi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final OtpService otpService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request) {
        return userService.registerUser(request);
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestBody OtpRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        if (isValid) {
            userService.verifyEmail(request.getEmail());
            return ResponseEntity.ok("Email verified successfully");
        }
        return ResponseEntity.badRequest().body("Invalid or expired OTP");
    }
}
