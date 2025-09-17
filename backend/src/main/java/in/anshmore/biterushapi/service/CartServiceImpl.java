package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.entity.CartEntity;
import in.anshmore.biterushapi.io.CartRequest;
import in.anshmore.biterushapi.io.CartResponse;
import in.anshmore.biterushapi.repository.CartRespository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService{

    private final CartRespository cartRespository;
    private final UserService userService;
    @Override
    public CartResponse addToCart(CartRequest request) {
        String loggedInUserId = userService.findByUserId();
        Long userId = Long.parseLong(loggedInUserId);
        Optional<CartEntity> cartOptional = cartRespository.findByUserIdWithItems(userId);
        CartEntity cart = cartOptional.orElseGet(() -> new CartEntity(userId, new HashMap<>()));
        Map<String, Integer> cartItems = cart.getItems();
        cartItems.put(request.getFoodId(), cartItems.getOrDefault(request.getFoodId(), 0) + 1);
        cart.setItems(cartItems);
        cart = cartRespository.save(cart);
        return convertToResponse(cart);
    }

    @Override
    public CartResponse getCart() {
        String loggedInUserId = userService.findByUserId();
        Long userId = Long.parseLong(loggedInUserId);
        CartEntity entity = cartRespository.findByUserIdWithItems(userId)
                .orElse(new CartEntity(userId, new HashMap<>()));
        return convertToResponse(entity);
    }

    @Override
    @Transactional
    public void clearCart() {
        String loggedInUserId = userService.findByUserId();
        cartRespository.deleteByUserId(Long.parseLong(loggedInUserId));
    }

    @Override
    public CartResponse removeFromCart(CartRequest cartRequest) {
        String loggedInUserId = userService.findByUserId();
        Long userId = Long.parseLong(loggedInUserId);
        CartEntity entity = cartRespository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart is not found"));
        Map<String, Integer> cartItems = entity.getItems();
        if (cartItems.containsKey(cartRequest.getFoodId())) {
            int currentQty = cartItems.get(cartRequest.getFoodId());
            if (currentQty > 0) {
                cartItems.put(cartRequest.getFoodId(), currentQty - 1);
            } else {
                cartItems.remove(cartRequest.getFoodId());
            }
            entity = cartRespository.save(entity);
        }
        return convertToResponse(entity);
    }

    private CartResponse convertToResponse(CartEntity cartEntity) {
        return CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems())
                .build();
    }
}
