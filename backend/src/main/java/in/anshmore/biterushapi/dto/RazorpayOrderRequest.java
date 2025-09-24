package in.anshmore.biterushapi.dto;

import lombok.Data;

@Data
public class RazorpayOrderRequest {
    private Double amount;
    private String currency = "INR";
}