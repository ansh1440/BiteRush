package in.anshmore.biterushapi.repository;

import in.anshmore.biterushapi.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    
    @Query("SELECT DISTINCT o FROM OrderEntity o LEFT JOIN FETCH o.orderedItems WHERE o.userId = :userId")
    List<OrderEntity> findByUserIdWithItems(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT o FROM OrderEntity o LEFT JOIN FETCH o.orderedItems")
    List<OrderEntity> findAllWithItems();
    
    // Keep original methods for backward compatibility
    List<OrderEntity> findByUserId(Long userId);

    Optional<OrderEntity> findByRazorpayPaymentId(String razorpayPaymentId);
}
