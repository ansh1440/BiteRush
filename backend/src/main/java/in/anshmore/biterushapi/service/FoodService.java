package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.io.FoodRequest;
import in.anshmore.biterushapi.io.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {

    String uploadFile(MultipartFile file);

    FoodResponse addFood(FoodRequest request, MultipartFile file);

    List<FoodResponse> readFoods();

    FoodResponse readFood(String id);

    boolean deleteFile(String filename);

    void deleteFood(String id);

    FoodResponse updateFood(String id, FoodRequest request, MultipartFile file);
}
