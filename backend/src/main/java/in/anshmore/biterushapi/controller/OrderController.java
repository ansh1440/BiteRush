package in.anshmore.biterushapi.controller;

import in.anshmore.biterushapi.io.OrderRequest;
import in.anshmore.biterushapi.io.OrderResponse;
import in.anshmore.biterushapi.service.OrderServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderServiceImpl orderService; // 🔹 use Impl for PayPal method

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrder(request);
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
