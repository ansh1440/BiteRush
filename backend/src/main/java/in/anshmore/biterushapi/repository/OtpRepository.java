package in.anshmore.biterushapi.repository;

import in.anshmore.biterushapi.entity.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity, Long> {
    Optional<OtpEntity> findByEmailAndOtp(String email, String otp);
    void deleteByEmail(String email);
}