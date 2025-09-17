package in.anshmore.biterushapi.entity;

import in.anshmore.biterushapi.io.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 500)
    private String userAddress;
    
    @Column(nullable = false)
    private String phoneNumber;
    
    @Column(nullable = false)
    private String email;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "order_items", joinColumns = @JoinColumn(name = "order_id"))
    private List<OrderItem> orderedItems;
    
    @Column(nullable = false)
    private double amount;
    
    @Column(nullable = false)
    @Builder.Default
    private String paymentStatus = "PENDING";
    
    @Column(nullable = false)
    @Builder.Default
    private String orderStatus = "Placed";
    
    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;

}
