import React from 'react';

const images = [
  { src: '/assets/gallery/image1.jpg', alt: 'Image 1' },
  { src: '/assets/gallery/image2.jpg', alt: 'Image 2' },
  { src: '/assets/gallery/image3.jpg', alt: 'Image 3' },
  // Add more images as needed
];

const GalleryPage = () => {
  return (
    <div className="gallery-page container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img.src}
            alt={img.alt}
            className="w-full h-auto rounded shadow-md hover:shadow-lg transition-shadow duration-200"
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
