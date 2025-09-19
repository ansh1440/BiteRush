package in.anshmore.biterushapi.repository;

import in.anshmore.biterushapi.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface CartRespository extends JpaRepository<CartEntity, Long> {

    @Query("SELECT c FROM CartEntity c LEFT JOIN FETCH c.items WHERE c.userId = :userId")
    Optional<CartEntity> findByUserIdWithItems(@Param("userId") Long userId);
    
    // Keep original methods for backward compatibility
    Optional<CartEntity> findByUserId(Long userId);

    void deleteByUserId(Long userId);
    
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM cart_items WHERE cart_id = :cartId AND food_id = :foodId", nativeQuery = true)
    void deleteCartItem(@Param("cartId") Long cartId, @Param("foodId") String foodId);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE cart_items SET quantity = :quantity WHERE cart_id = :cartId AND food_id = :foodId", nativeQuery = true)
    void updateCartItemQuantity(@Param("cartId") Long cartId, @Param("foodId") String foodId, @Param("quantity") Integer quantity);
}
