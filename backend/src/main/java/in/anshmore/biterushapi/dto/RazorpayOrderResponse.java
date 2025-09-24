package in.anshmore.biterushapi.dto;

import lombok.Data;

@Data
public class RazorpayOrderResponse {
    private String orderId;
    private String currency;
    private Integer amount;
    private String key;
}