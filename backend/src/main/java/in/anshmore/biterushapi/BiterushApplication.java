package in.anshmore.biterushapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BiterushApplication {

	public static void main(String[] args) {
		SpringApplication.run(BiterushApplication.class, args);
	}

}
