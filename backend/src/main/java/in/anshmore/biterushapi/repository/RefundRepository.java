package in.anshmore.biterushapi.repository;

import in.anshmore.biterushapi.entity.RefundEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<RefundEntity, Long> {
    Optional<RefundEntity> findByOrderId(Long orderId);
    List<RefundEntity> findByUserId(Long userId);
}