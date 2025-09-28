package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.entity.FundAccountEntity;

public interface FundAccountService {
    FundAccountEntity createRestaurantAccount(Long restaurantId, String accountHolderName, 
                                            String accountNumber, String ifscCode, String bankName);
    void updateEarnings(Long restaurantId, Double amount);
}