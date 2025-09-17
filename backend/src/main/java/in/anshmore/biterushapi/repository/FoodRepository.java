package in.anshmore.biterushapi.repository;

import in.anshmore.biterushapi.entity.FoodEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends JpaRepository<FoodEntity, Long> {
}
