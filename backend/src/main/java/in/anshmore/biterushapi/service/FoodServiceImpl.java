package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.entity.FoodEntity;
import in.anshmore.biterushapi.io.FoodRequest;
import in.anshmore.biterushapi.io.FoodResponse;
import in.anshmore.biterushapi.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService{

    @Autowired
    private FoodRepository foodRepository;

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Override
    public String uploadFile(MultipartFile file) {
        String filenameExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
        String filename = UUID.randomUUID().toString()+"."+filenameExtension;
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            return "/uploads/" + filename;
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while uploading the file");
        }
    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
        FoodEntity newFoodEntity = convertToEntity(request);
        String imageUrl = uploadFile(file);
        newFoodEntity.setImageUrl(imageUrl);
        newFoodEntity = foodRepository.save(newFoodEntity);
        return convertToResponse(newFoodEntity);
    }

    @Override
    public List<FoodResponse> readFoods() {
        List<FoodEntity> databaseEntries = foodRepository.findAll();
        return databaseEntries.stream().map(object -> convertToResponse(object)).collect(Collectors.toList());
    }

    @Override
    public FoodResponse readFood(String id) {
        FoodEntity existingFood = foodRepository.findById(Long.parseLong(id)).orElseThrow(() -> new RuntimeException("Food not found for the id:"+id));
        return convertToResponse(existingFood);
    }

    @Override
    public boolean deleteFile(String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            Files.deleteIfExists(filePath);
            return true;
        } catch (IOException ex) {
            return false;
        }
    }

    @Override
    public void deleteFood(String id) {
        FoodResponse response = readFood(id);
        String imageUrl = response.getImageUrl();
        if (imageUrl != null && imageUrl.startsWith("/uploads/")) {
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/")+1);
            deleteFile(filename);
        }
        foodRepository.deleteById(response.getId());
    }

    private FoodEntity convertToEntity(FoodRequest request) {
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .build();

    }

    @Override
    public FoodResponse updateFood(String id, FoodRequest request, MultipartFile file) {
        FoodEntity existingFood = foodRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new RuntimeException("Food not found"));
        
        // Update basic fields
        existingFood.setName(request.getName());
        existingFood.setDescription(request.getDescription());
        existingFood.setPrice(request.getPrice());
        existingFood.setCategory(request.getCategory());
        
        // Update image only if new file is provided
        if (file != null && !file.isEmpty()) {
            String imageUrl = uploadFile(file);
            existingFood.setImageUrl(imageUrl);
        }
        
        FoodEntity updatedFood = foodRepository.save(existingFood);
        return convertToResponse(updatedFood);
    }

    private FoodResponse convertToResponse(FoodEntity entity) {
        return FoodResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .price(entity.getPrice())
                .imageUrl(entity.getImageUrl())
                .build();
    }
}
