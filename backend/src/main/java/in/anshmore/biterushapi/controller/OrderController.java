package in.anshmore.biterushapi.controller;

import in.anshmore.biterushapi.dto.*;
import in.anshmore.biterushapi.service.OrderServiceImpl;
import in.anshmore.biterushapi.service.RazorpayService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderServiceImpl orderService;
    private final RazorpayService razorpayService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }

    @PostMapping("/razorpay/create")
    public RazorpayOrderResponse createRazorpayOrder(@RequestBody RazorpayOrderRequest request) throws Exception {
        log.info("Received Razorpay order creation request for amount: {}", request.getAmount());
        RazorpayOrderResponse response = razorpayService.createOrder(request);
        log.info("Razorpay order created with ID: {}", response.getOrderId());
        return response;
    }

    @PostMapping("/razorpay/verify")
    public OrderResponse verifyPaymentAndCreateOrder(@RequestBody PaymentVerificationRequest request) {
        log.info("Received payment verification request for order: {}, payment: {}", 
                request.getRazorpayOrderId(), request.getRazorpayPaymentId());
        
        boolean isValid = razorpayService.verifyPayment(
            request.getRazorpayOrderId(),
            request.getRazorpayPaymentId(),
            request.getRazorpaySignature()
        );
        
        if (!isValid) {
            log.error("Payment verification failed for order: {}", request.getRazorpayOrderId());
            throw new RuntimeException("Payment verification failed");
        }
        
        log.info("Payment verified successfully, creating order");
        request.getOrderDetails().setRazorpayPaymentId(request.getRazorpayPaymentId());
        request.getOrderDetails().setPaymentStatus("PAID");
        OrderResponse response = orderService.createOrder(request.getOrderDetails());
        log.info("Order created successfully with ID: {}", response.getId());
        return response;
    }



    @GetMapping
    public List<OrderResponse> getOrders() {
        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId) {
        orderService.removeOrder(orderId);
    }

    //admin panel
    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers() {
        return orderService.getOrdersOfAllUsers();
    }

    //admin panel
    @PatchMapping("/status/{orderId}")
    @ResponseStatus(HttpStatus.OK)
    public void updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        orderService.updateOrderStatus(orderId, status);
    }
}
