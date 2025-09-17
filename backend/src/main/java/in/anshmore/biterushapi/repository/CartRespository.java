package in.anshmore.biterushapi.repository;

import in.anshmore.biterushapi.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRespository extends JpaRepository<CartEntity, Long> {

    @Query("SELECT c FROM CartEntity c LEFT JOIN FETCH c.items WHERE c.userId = :userId")
    Optional<CartEntity> findByUserIdWithItems(@Param("userId") Long userId);
    
    // Keep original methods for backward compatibility
    Optional<CartEntity> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}
