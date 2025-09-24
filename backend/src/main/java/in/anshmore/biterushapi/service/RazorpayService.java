package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.dto.RazorpayOrderRequest;
import in.anshmore.biterushapi.dto.RazorpayOrderResponse;

public interface RazorpayService {
    RazorpayOrderResponse createOrder(RazorpayOrderRequest request) throws Exception;
    boolean verifyPayment(String orderId, String paymentId, String signature);
}