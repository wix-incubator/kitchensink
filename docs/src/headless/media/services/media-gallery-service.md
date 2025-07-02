# Media Gallery Service

## Overview

The MediaGalleryService is a headless service that manages media gallery functionality including image navigation, selection, and display state management. It provides reactive state management for media collections with support for cycling through images, selecting specific items, and managing the current display state.

This service is designed to work with image galleries, carousels, lightboxes, and similar media display components. It uses Wix's signals system for reactive updates and provides a clean API for managing media collections and user interactions.

## Exports

### `MediaItem`
**Type**: `interface`

Interface defining the structure of media items in the gallery.
- `image?`: string | null - URL or path to the image
- `altText?`: string | null - Alternative text for accessibility

### `MediaGalleryServiceAPI`
**Type**: `interface`

Complete API interface for the media gallery service including signals for state management and methods for navigation and media management.

### `MediaGalleryServiceDefinition`
**Type**: `ServiceDefinition<MediaGalleryServiceAPI>`

Service definition that identifies and types the media gallery service within Wix's service manager system.

### `MediaGalleryService`
**Type**: `ServiceImplementation<MediaGalleryServiceAPI>`

Main service implementation providing all media gallery functionality including navigation, selection, and media management.

## Usage Examples

### Basic Media Gallery Setup
```tsx
import { useService } from '@wix/services-manager-react';
import { MediaGalleryServiceDefinition } from './headless/media/services/media-gallery-service';

function MediaGallery({ images }) {
  const galleryService = useService(MediaGalleryServiceDefinition);
  
  const selectedIndex = galleryService.selectedMediaIndex.use();
  const mediaToDisplay = galleryService.mediaToDisplay.use();
  const totalMedia = galleryService.totalMedia.use();
  
  useEffect(() => {
    galleryService.setMediaToDisplay(images);
  }, [images]);
  
  const currentImage = mediaToDisplay[selectedIndex];
  
  return (
    <div className="media-gallery">
      <div className="main-image">
        {currentImage && (
          <img
            src={currentImage.image}
            alt={currentImage.altText || 'Gallery image'}
            className="w-full h-96 object-cover"
          />
        )}
      </div>
      
      <div className="gallery-controls">
        <button
          onClick={() => galleryService.previousMedia()}
          disabled={totalMedia <= 1}
        >
          Previous
        </button>
        
        <span>{selectedIndex + 1} of {totalMedia}</span>
        
        <button
          onClick={() => galleryService.nextMedia()}
          disabled={totalMedia <= 1}
        >
          Next
        </button>
      </div>
      
      <div className="thumbnail-strip">
        {mediaToDisplay.map((item, index) => (
          <button
            key={index}
            onClick={() => galleryService.setSelectedMediaIndex(index)}
            className={`thumbnail ${index === selectedIndex ? 'active' : ''}`}
          >
            <img
              src={item.image}
              alt={item.altText || `Thumbnail ${index + 1}`}
              className="w-16 h-16 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Product Image Gallery
```tsx
function ProductImageGallery({ product }) {
  const galleryService = useService(MediaGalleryServiceDefinition);
  
  const selectedIndex = galleryService.selectedMediaIndex.use();
  const mediaToDisplay = galleryService.mediaToDisplay.use();
  
  useEffect(() => {
    const mediaItems = product.media?.items?.map(item => ({
      image: item.image?.url,
      altText: item.image?.altText || product.name
    })) || [];
    
    galleryService.setMediaToDisplay(mediaItems);
  }, [product]);
  
  const currentImage = mediaToDisplay[selectedIndex];
  
  return (
    <div className="product-gallery">
      <div className="main-viewer">
        {currentImage ? (
          <img
            src={currentImage.image}
            alt={currentImage.altText}
            className="w-full h-[500px] object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
            <span>No image available</span>
          </div>
        )}
        
        {/* Navigation arrows */}
        <button
          onClick={() => galleryService.previousMedia()}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2"
        >
          ←
        </button>
        <button
          onClick={() => galleryService.nextMedia()}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2"
        >
          →
        </button>
      </div>
      
      <div className="thumbnails mt-4 flex gap-2 overflow-x-auto">
        {mediaToDisplay.map((item, index) => (
          <button
            key={index}
            onClick={() => galleryService.setSelectedMediaIndex(index)}
            className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
              index === selectedIndex ? 'border-blue-500' : 'border-gray-300'
            }`}
          >
            <img
              src={item.image}
              alt={item.altText}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Lightbox Gallery
```tsx
function LightboxGallery({ images, isOpen, onClose }) {
  const galleryService = useService(MediaGalleryServiceDefinition);
  
  const selectedIndex = galleryService.selectedMediaIndex.use();
  const mediaToDisplay = galleryService.mediaToDisplay.use();
  const totalMedia = galleryService.totalMedia.use();
  
  useEffect(() => {
    if (isOpen && images) {
      galleryService.setMediaToDisplay(images);
    }
  }, [isOpen, images]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          galleryService.previousMedia();
          break;
        case 'ArrowRight':
          galleryService.nextMedia();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const currentImage = mediaToDisplay[selectedIndex];
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        ×
      </button>
      
      <div className="max-w-5xl max-h-[90vh] relative">
        {currentImage && (
          <img
            src={currentImage.image}
            alt={currentImage.altText}
            className="max-w-full max-h-full object-contain"
          />
        )}
        
        {totalMedia > 1 && (
          <>
            <button
              onClick={() => galleryService.previousMedia()}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70"
            >
              ← Previous
            </button>
            <button
              onClick={() => galleryService.nextMedia()}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70"
            >
              Next →
            </button>
          </>
        )}
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
          {selectedIndex + 1} / {totalMedia}
        </div>
      </div>
    </div>
  );
}
```

### Carousel Implementation
```tsx
function MediaCarousel({ autoPlay = false, interval = 3000 }) {
  const galleryService = useService(MediaGalleryServiceDefinition);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  const selectedIndex = galleryService.selectedMediaIndex.use();
  const mediaToDisplay = galleryService.mediaToDisplay.use();
  const totalMedia = galleryService.totalMedia.use();
  
  useEffect(() => {
    if (!isPlaying || totalMedia <= 1) return;
    
    const timer = setInterval(() => {
      galleryService.nextMedia();
    }, interval);
    
    return () => clearInterval(timer);
  }, [isPlaying, totalMedia, interval]);
  
  const currentImage = mediaToDisplay[selectedIndex];
  
  return (
    <div className="carousel relative">
      <div className="carousel-viewport h-64 overflow-hidden rounded-lg">
        {currentImage && (
          <img
            src={currentImage.image}
            alt={currentImage.altText}
            className="w-full h-full object-cover transition-all duration-500"
          />
        )}
      </div>
      
      <div className="carousel-controls absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-white/80 rounded-full p-2"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="flex gap-2">
          {mediaToDisplay.map((_, index) => (
            <button
              key={index}
              onClick={() => galleryService.setSelectedMediaIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === selectedIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Grid Gallery with Modal
```tsx
function GridGallery({ images }) {
  const galleryService = useService(MediaGalleryServiceDefinition);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleImageClick = (index) => {
    galleryService.setSelectedMediaIndex(index);
    setIsModalOpen(true);
  };
  
  useEffect(() => {
    galleryService.setMediaToDisplay(images);
  }, [images]);
  
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className="aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
          >
            <img
              src={image.image}
              alt={image.altText}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      
      <LightboxGallery
        images={images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
```
