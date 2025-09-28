package in.anshmore.biterushapi.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "refunds")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RefundEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long orderId;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String razorpayPaymentId;
    
    @Column(nullable = false)
    private Double refundAmount;
    
    @Column(nullable = false)
    private String refundReason;
    
    @Column(nullable = false)
    @Builder.Default
    private String refundStatus = "PENDING"; // PENDING, PROCESSED, FAILED
    
    @Column(name = "razorpay_refund_id")
    private String razorpayRefundId;
    
    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime processedAt;
}