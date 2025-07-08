import React from 'react';

const videos = [
  { title: "Marty Holtman's Santa Express", url: 'https://player.vimeo.com/video/1040039534' },
  { title: 'Dee Sarton Interview', url: 'https://player.vimeo.com/video/982877483' },
  { title: 'Marcia Franklin Interview', url: 'https://player.vimeo.com/video/982872224' },
  { title: 'Don Nelson Interview', url: 'https://player.vimeo.com/video/982856307' },
  { title: 'Kevin Miller Interview', url: 'https://player.vimeo.com/video/982690679' },
  { title: 'Marty Holtman Interview', url: 'https://player.vimeo.com/video/967979349' },
];

const GalleryPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Video Gallery</h1>
      <p className="text-center text-gray-600 mb-10">
        Interviews and features from our broadcasting archives
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, idx) => (
          <div key={idx} className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow">
            <iframe
              src={video.url}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              title={video.title}
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
