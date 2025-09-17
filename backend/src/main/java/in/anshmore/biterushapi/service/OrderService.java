package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.io.OrderRequest;
import in.anshmore.biterushapi.io.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request);

    List<OrderResponse> getUserOrders();

    void removeOrder(String orderId);

    List<OrderResponse> getOrdersOfAllUsers();

    void updateOrderStatus(String orderId, String status);

}
