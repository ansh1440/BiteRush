package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.entity.FundAccountEntity;
import in.anshmore.biterushapi.repository.FundAccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FundAccountServiceImpl implements FundAccountService {

    @Autowired
    private FundAccountRepository fundAccountRepository;

    @Override
    public FundAccountEntity createRestaurantAccount(Long restaurantId, String accountHolderName, 
                                                   String accountNumber, String ifscCode, String bankName) {
        // Check if account already exists
        if (fundAccountRepository.findByRestaurantId(restaurantId).isPresent()) {
            log.info("Fund account already exists for restaurant {}", restaurantId);
            return fundAccountRepository.findByRestaurantId(restaurantId).get();
        }
        
        FundAccountEntity account = FundAccountEntity.builder()
                .restaurantId(restaurantId)
                .accountHolderName(accountHolderName)
                .accountNumber(accountNumber)
                .ifscCode(ifscCode)
                .bankName(bankName)
                .availableBalance(0.0)
                .totalEarnings(0.0)
                .isActive(true)
                .build();
        
        FundAccountEntity saved = fundAccountRepository.save(account);
        log.info("Fund account created for restaurant {} with account {}", restaurantId, accountNumber);
        return saved;
    }

    @Override
    public void updateEarnings(Long restaurantId, Double amount) {
        try {
            FundAccountEntity account = fundAccountRepository.findByRestaurantId(restaurantId)
                    .orElseThrow(() -> new RuntimeException("Fund account not found for restaurant: " + restaurantId));
            
            Double newBalance = Math.round((account.getAvailableBalance() + amount) * 100.0) / 100.0;
            Double newTotalEarnings = Math.round((account.getTotalEarnings() + amount) * 100.0) / 100.0;
            
            account.setAvailableBalance(newBalance);
            account.setTotalEarnings(newTotalEarnings);
            
            fundAccountRepository.save(account);
            log.info("Updated earnings for restaurant {} - Added: {}, New Balance: {}, Total Earnings: {}", 
                    restaurantId, amount, newBalance, newTotalEarnings);
        } catch (Exception e) {
            log.error("Failed to update earnings for restaurant {}: {}", restaurantId, e.getMessage());
            // For demo purposes, continue without failing the order
        }
    }
}