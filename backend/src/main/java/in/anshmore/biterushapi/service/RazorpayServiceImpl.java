package in.anshmore.biterushapi.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import in.anshmore.biterushapi.dto.RazorpayOrderRequest;
import in.anshmore.biterushapi.dto.RazorpayOrderResponse;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RazorpayServiceImpl implements RazorpayService {

    @Value("${razorpay.key.id:rzp_test_RLMejdhgVcMFHT}")
    private String keyId;

    @Value("${razorpay.key.secret:3p1KPkO5lPPlAq7IPo8XlJNd}")
    private String keySecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    @Override
    public RazorpayOrderResponse createOrder(RazorpayOrderRequest request) throws Exception {
        log.info("Creating Razorpay order for amount: {}", request.getAmount());
        
        RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", Math.round(request.getAmount() * 100));
        orderRequest.put("currency", currency);
        
        log.info("Razorpay order request: {}", orderRequest.toString());
        
        Order order = razorpayClient.orders.create(orderRequest);
        
        String orderId = order.get("id").toString();
        String currency = order.get("currency").toString();
        Integer amount = Integer.valueOf(order.get("amount").toString());
        
        log.info("Razorpay order created successfully: {}", orderId);
        
        RazorpayOrderResponse response = new RazorpayOrderResponse();
        response.setOrderId(orderId);
        response.setCurrency(currency);
        response.setAmount(amount);
        response.setKey(keyId);
        
        return response;
    }

    @Override
    public boolean verifyPayment(String orderId, String paymentId, String signature) {
        log.info("Verifying payment - OrderId: {}, PaymentId: {}", orderId, paymentId);
        
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);
            
            boolean isValid = Utils.verifyPaymentSignature(attributes, keySecret);
            log.info("Payment verification result: {}", isValid);
            
            return isValid;
        } catch (Exception e) {
            log.error("Payment verification failed", e);
            return false;
        }
    }
}