package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.io.UserRequest;
import in.anshmore.biterushapi.io.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    String findByUserId();
    
    void verifyEmail(String email);
}
