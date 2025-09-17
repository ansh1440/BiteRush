package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.entity.OrderEntity;
import in.anshmore.biterushapi.io.OrderRequest;
import in.anshmore.biterushapi.io.OrderResponse;
import in.anshmore.biterushapi.repository.CartRespository;
import in.anshmore.biterushapi.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService{

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CartRespository cartRespository;



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
                } catch (Exception e) {
                    System.out.println("Cart clearing failed: " + e.getMessage());
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
