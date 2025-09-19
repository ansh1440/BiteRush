package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.dto.OrderRequest;
import in.anshmore.biterushapi.dto.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request);

    List<OrderResponse> getUserOrders();

    void removeOrder(String orderId);

    List<OrderResponse> getOrdersOfAllUsers();

    void updateOrderStatus(String orderId, String status);

}
