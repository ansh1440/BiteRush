package in.anshmore.biterushapi.repository;

import in.anshmore.biterushapi.entity.FundAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FundAccountRepository extends JpaRepository<FundAccountEntity, Long> {
    Optional<FundAccountEntity> findByRestaurantId(Long restaurantId);
}