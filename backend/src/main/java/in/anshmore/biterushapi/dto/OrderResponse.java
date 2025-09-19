package in.anshmore.biterushapi.dto;


import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private Long userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private double amount;
    private String paymentStatus;
    private String orderStatus;
    private List<OrderItem> orderedItems;
    private String razorpayPaymentId;
}
