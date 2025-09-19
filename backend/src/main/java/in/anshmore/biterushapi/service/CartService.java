package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.dto.CartRequest;
import in.anshmore.biterushapi.dto.CartResponse;

public interface CartService {

    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();

    CartResponse removeFromCart(CartRequest cartRequest);
    
    CartResponse deleteFromCart(CartRequest cartRequest);
}
