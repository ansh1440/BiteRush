package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.entity.OrderEntity;
import in.anshmore.biterushapi.dto.OrderRequest;
import in.anshmore.biterushapi.dto.OrderResponse;
import in.anshmore.biterushapi.repository.CartRespository;
import in.anshmore.biterushapi.repository.OrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService{

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CartRespository cartRespository;
    
    @Autowired
    private RefundService refundService;
    
    @Autowired
    private FundAccountService fundAccountService;



    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        try {
            OrderEntity newOrder = convertToEntity(request);
            try {
                String loggedInUserId = userService.findByUserId();
                newOrder.setUserId(Long.parseLong(loggedInUserId));
            } catch (Exception e) {
                // For demo: use default user ID if no user is logged in
                newOrder.setUserId(1L);
            }

            newOrder = orderRepository.save(newOrder);
            
            // Clear cart if payment is completed (from Razorpay)
            if ("PAID".equals(newOrder.getPaymentStatus())) {
                try {
                    cartRespository.deleteByUserId(newOrder.getUserId());
                    
                    // Update restaurant earnings (85% of order amount, 15% platform commission)
                    Long restaurantId = 1L;
                    Double restaurantShare = Math.round(newOrder.getAmount() * 0.85 * 100.0) / 100.0;
                    
                    // Create account if not exists, then update earnings
                    fundAccountService.createRestaurantAccount(restaurantId, 
                        "BiteRush Restaurant", "1234567890", "SBIN0001234", "State Bank of India");
                    
                    // Update earnings
                    fundAccountService.updateEarnings(restaurantId, restaurantShare);
                    log.info("Updated restaurant {} earnings with amount {}", restaurantId, restaurantShare);
                    
                } catch (Exception e) {
                    log.warn("Cart clearing failed: {}", e.getMessage());
                }
            }

            return convertToResponse(newOrder);
        } catch (Exception e) {
            throw new RuntimeException("Order creation failed: " + e.getMessage(), e);
        }
    }



    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
        List<OrderEntity> list = orderRepository.findByUserIdWithItems(Long.parseLong(loggedInUserId));
        return list.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
        orderRepository.deleteById(Long.parseLong(orderId));
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        List<OrderEntity> list = orderRepository.findAllWithItems();
        return list.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        OrderEntity entity = orderRepository.findById(Long.parseLong(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found"));
        entity.setOrderStatus(status);
        orderRepository.save(entity);
    }
    
    @Override
    public void cancelOrder(String orderId) {
        OrderEntity entity = orderRepository.findById(Long.parseLong(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Check if order can be cancelled
        if (!"Placed".equals(entity.getOrderStatus()) && !"Preparing".equals(entity.getOrderStatus())) {
            throw new RuntimeException("Order cannot be cancelled at this stage");
        }
        
        if (!"PAID".equals(entity.getPaymentStatus())) {
            throw new RuntimeException("Only paid orders can be cancelled");
        }
        
        // Update order status to cancelled
        entity.setOrderStatus("Cancelled");
        entity.setIsRefunded(true);
        orderRepository.save(entity);
        
        // Create refund record
        refundService.initiateRefund(Long.parseLong(orderId), "Order cancelled by customer");
        
        // Reverse restaurant earnings (deduct the amount that was added)
        Long restaurantId = 1L; // Same restaurant ID used during order creation
        Double restaurantShare = Math.round(entity.getAmount() * 0.85 * 100.0) / 100.0; // Same calculation as when order was placed
        fundAccountService.updateEarnings(restaurantId, -restaurantShare); // Negative amount to deduct
        
        log.info("Order {} cancelled successfully. Refund will be processed. Restaurant earnings reversed.", orderId);
    }

    private OrderResponse convertToResponse(OrderEntity newOrder) {
        return OrderResponse.builder()
                .id(newOrder.getId())
                .amount(newOrder.getAmount())
                .userAddress(newOrder.getUserAddress())
                .userId(newOrder.getUserId())
                .paymentStatus(newOrder.getPaymentStatus())
                .orderStatus(newOrder.getOrderStatus())
                .email(newOrder.getEmail())
                .phoneNumber(newOrder.getPhoneNumber())
                .orderedItems(newOrder.getOrderedItems())
                .razorpayPaymentId(newOrder.getRazorpayPaymentId())
                .build();
    }

    private OrderEntity convertToEntity(OrderRequest request) {
        return OrderEntity.builder()
                .userAddress(request.getUserAddress())
                .amount(request.getAmount())
                .orderedItems(request.getOrderedItems())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .orderStatus(request.getOrderStatus())
                .paymentStatus(request.getPaymentStatus())
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .build();
    }
}
