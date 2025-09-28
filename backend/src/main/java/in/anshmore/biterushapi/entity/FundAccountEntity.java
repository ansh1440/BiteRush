package in.anshmore.biterushapi.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fund_accounts")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FundAccountEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long restaurantId;  // Which restaurant this account belongs to
    
    @Column(nullable = false)
    private String accountHolderName;
    
    @Column(nullable = false)
    private String accountNumber;
    
    @Column(nullable = false)
    private String ifscCode;
    
    @Column(nullable = false)
    private String bankName;
    
    @Column(nullable = false)
    @Builder.Default
    private Double availableBalance = 0.0;
    
    @Column(nullable = false)
    @Builder.Default
    private Double totalEarnings = 0.0;
    
    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}