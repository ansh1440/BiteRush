package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.dto.UserRequest;
import in.anshmore.biterushapi.dto.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    String findByUserId();
    
    void verifyEmail(String email);
}
