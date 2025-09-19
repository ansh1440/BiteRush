package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.entity.CartEntity;
import in.anshmore.biterushapi.dto.CartRequest;
import in.anshmore.biterushapi.dto.CartResponse;
import in.anshmore.biterushapi.repository.CartRespository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService{

    private final CartRespository cartRespository;
    private final UserService userService;
    private final EntityManager entityManager;
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
    @Transactional
    public CartResponse removeFromCart(CartRequest cartRequest) {
        String loggedInUserId = userService.findByUserId();
        Long userId = Long.parseLong(loggedInUserId);
        CartEntity entity = cartRespository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart is not found"));
        Map<String, Integer> cartItems = entity.getItems();
        if (cartItems.containsKey(cartRequest.getFoodId())) {
            int currentQty = cartItems.get(cartRequest.getFoodId());
            if (currentQty > 1) {
                // Decrease quantity using direct SQL
                cartRespository.updateCartItemQuantity(entity.getId(), cartRequest.getFoodId(), currentQty - 1);
            } else {
                // Delete item using direct SQL
                cartRespository.deleteCartItem(entity.getId(), cartRequest.getFoodId());
            }
            // Clear EntityManager cache to force refresh
            entityManager.clear();
            
            // Refresh entity from database
            entity = cartRespository.findByUserIdWithItems(userId).orElse(entity);
        }
        return convertToResponse(entity);
    }

    @Override
    @Transactional
    public CartResponse deleteFromCart(CartRequest cartRequest) {
        String loggedInUserId = userService.findByUserId();
        Long userId = Long.parseLong(loggedInUserId);
        CartEntity entity = cartRespository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart is not found"));
        
        // Always delete the item completely, regardless of quantity
        cartRespository.deleteCartItem(entity.getId(), cartRequest.getFoodId());
        
        // Clear EntityManager cache to force refresh
        entityManager.clear();
        
        // Refresh entity from database
        entity = cartRespository.findByUserIdWithItems(userId).orElse(entity);
        return convertToResponse(entity);
    }

    private CartResponse convertToResponse(CartEntity cartEntity) {
        // Remove any items with zero quantity
        cartEntity.getItems().entrySet().removeIf(entry -> entry.getValue() <= 0);
        return CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems())
                .build();
    }
}
