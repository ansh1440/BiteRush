package in.anshmore.biterushapi.controller;

import in.anshmore.biterushapi.dto.AuthenticationRequest;
import in.anshmore.biterushapi.dto.AuthenticationResponse;
import in.anshmore.biterushapi.dto.OtpRequest;
import in.anshmore.biterushapi.service.AppUserDetailsService;
import in.anshmore.biterushapi.service.OtpService;
import in.anshmore.biterushapi.service.UserService;
import in.anshmore.biterushapi.util.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;
    private final UserService userService;

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
        return new AuthenticationResponse(request.getEmail(), jwtToken);
    }
    
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email, @RequestParam(required = false) String name) {
        otpService.sendOtp(email, name);
        return ResponseEntity.ok("OTP sent to email");
    }
    
    @PostMapping("/verify-otp")
    // amazonq-ignore-next-line
    public ResponseEntity<String> verifyOtp(@RequestBody OtpRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        if (isValid) {
            try {
                userService.verifyEmail(request.getEmail());
            } catch (RuntimeException e) {
                // User doesn't exist yet - that's okay for registration flow
                log.debug("User not found during OTP verification: {}", request.getEmail());
            }
            return ResponseEntity.ok("OTP verified successfully");
        }
        return ResponseEntity.badRequest().body("Invalid or expired OTP");
    }
}
