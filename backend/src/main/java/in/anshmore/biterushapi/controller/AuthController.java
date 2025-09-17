package in.anshmore.biterushapi.controller;

import in.anshmore.biterushapi.io.AuthenticationRequest;
import in.anshmore.biterushapi.io.AuthenticationResponse;
import in.anshmore.biterushapi.io.OtpRequest;
import in.anshmore.biterushapi.service.AppUserDetailsService;
import in.anshmore.biterushapi.service.OtpService;
import in.anshmore.biterushapi.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

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
        return ResponseEntity.ok(isValid ? "OTP verified successfully" : "Invalid or expired OTP");
    }
}
