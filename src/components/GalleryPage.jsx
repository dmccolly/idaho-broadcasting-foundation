import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

// TODO: Replace with your actual media files
// Expected file structure:
// public/assets/gallery/
//   ├── image1.jpg
//   ├── image2.jpg  
//   ├── video1.mp4
//   ├── video1-poster.jpg (optional)
//   └── ...
const mediaItems = [
  { 
    type: 'image',
    src: '/assets/gallery/image1.jpg',
    alt: 'Mountain landscape',
    title: 'Alpine Vista'
  },
  { 
    type: 'video',
    src: '/assets/gallery/video1.mp4',
    poster: '/assets/gallery/video1-poster.jpg', // Optional: creates better UX
    alt: 'Nature video',
    title: 'Forest Walk'
  },
  { 
    type: 'image',
    src: '/assets/gallery/image2.jpg',
    alt: 'City architecture',
    title: 'Urban Lines'
  },
  { 
    type: 'image',
    src: '/assets/gallery/image3.jpg',
    alt: 'Ocean scene',
    title: 'Coastal Serenity'
  },
  { 
    type: 'video',
    src: '/assets/gallery/video2.mp4',
    poster: '/assets/gallery/video2-poster.jpg',
    alt: 'Abstract motion',
    title: 'Flow State'
  },
  { 
    type: 'image',
    src: '/assets/gallery/image4.jpg',
    alt: 'Minimalist design',
    title: 'Clean Space'
  },
  { 
    type: 'image',
    src: '/assets/gallery/image5.jpg',
    alt: 'Abstract art',
    title: 'Color Study'
  },
  { 
    type: 'video',
    src: '/assets/gallery/video3.mp4',
    poster: '/assets/gallery/video3-poster.jpg',
    alt: 'Technology showcase',
    title: 'Digital Flow'
  }
  // Add more items as needed...
];

const GalleryPage = () => {
  // State management for lightbox functionality
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Lightbox handlers
  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedMedia(mediaItems[index]);
    setIsPlaying(false);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
    setIsPlaying(false);
  };

  const nextMedia = () => {
    const newIndex = (currentIndex + 1) % mediaItems.length;
    setCurrentIndex(newIndex);
    setSelectedMedia(mediaItems[newIndex]);
    setIsPlaying(false);
  };

  const prevMedia = () => {
    const newIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    setCurrentIndex(newIndex);
    setSelectedMedia(mediaItems[newIndex]);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Keyboard navigation (optional enhancement)
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedMedia) return;
      
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevMedia();
          break;
        case 'ArrowRight':
          nextMedia();
          break;
        case ' ':
          if (selectedMedia.type === 'video') {
            e.preventDefault();
            togglePlay();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedMedia]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean, Minimal Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-slate-800 tracking-wide">Gallery</h1>
              <div className="w-12 h-0.5 bg-blue-500 mt-2"></div>
            </div>
            <div className="text-sm text-slate-500 font-light">
              {mediaItems.length} items
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Gallery Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaItems.map((item, idx) => (
            <div
              key={idx}
              className="group cursor-pointer"
              onClick={() => openLightbox(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
            >
              <div className="relative overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                
                {/* Media Preview Container */}
                <div className="relative">
                  {item.type === 'image' ? (
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative">
                      {/* Video Poster/Thumbnail */}
                      <img
                        src={item.poster || item.src}
                        alt={item.alt}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Video Play Indicator */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                          <Play className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="text-slate-700 font-medium text-sm tracking-wide">{item.title}</h3>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'video' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            
            {/* Modal Header */}
            <div className="absolute -top-16 left-0 right-0 flex items-center justify-between text-white z-10">
              <div>
                <h2 className="text-lg font-light">{selectedMedia.title}</h2>
                <p className="text-sm text-gray-300">{currentIndex + 1} of {mediaItems.length}</p>
              </div>
              <button
                onClick={closeLightbox}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevMedia}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 z-10"
              aria-label="Previous media"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextMedia}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 z-10"
              aria-label="Next media"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Media Display */}
            <div className="relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              ) : (
                <div className="relative">
                  <video
                    src={selectedMedia.src}
                    poster={selectedMedia.poster}
                    controls={isPlaying}
                    className="w-full h-auto max-h-[80vh] object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    preload="metadata"
                  />
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <button
                        onClick={togglePlay}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 transition-colors"
                        aria-label="Play video"
                      >
                        <Play className="w-8 h-8 fill-current" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Media Type Indicator */}
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                <span className={`w-2 h-2 rounded-full ${
                  selectedMedia.type === 'video' ? 'bg-blue-400' : 'bg-gray-400'
                }`}></span>
                <span className="capitalize">{selectedMedia.type}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
