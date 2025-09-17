export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://via.placeholder.com/300x300?text=Food+Image';
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // Handle different path formats
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `http://localhost:8080${cleanPath}`;
};