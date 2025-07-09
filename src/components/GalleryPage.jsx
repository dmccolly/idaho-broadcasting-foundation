import React from 'react';

const videos = [
  {
    id: '1040039534',
    title: "Marty Holtman's Santa Express"
  },
  {
    id: '982877483',
    title: 'Dee Sarton Interview'
  },
  {
    id: '982872224',
    title: 'Marcia Franklin Interview'
  },
  {
    id: '982856307',
    title: 'Don Nelson Interview'
  },
  {
    id: '982690679',
    title: 'Kevin Miller Interview'
  },
  {
    id: '967979349',
    title: 'Marty Holtman Interview'
  }
];

const GalleryPage = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-6 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Video Gallery</h1>
          <p className="text-gray-600">
            In our ongoing effort to visually preserve Idaho's broadcasting history,
            we have collected interviews and specials highlighting the people and
            stories that shaped the industry.
          </p>
        </div>
        <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="space-y-2">
              <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                <iframe
                  src={`https://player.vimeo.com/video/${video.id}?badge=0&autopause=0&player_id=0&app_id=58479`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title={video.title}
                ></iframe>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">{video.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default GalleryPage;
