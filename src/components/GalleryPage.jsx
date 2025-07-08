import React from 'react';

const videos = [
  {
    title: 'Dee Sarton',
    subtitle: 'Former KTVB-TV, Channel 7 anchor/reporter',
    description:
      "Talks about starting out as a young reporter in Boise in the late '70s, and working with legendary Channel 7 news director Sal Celeski.",
    src: 'https://player.vimeo.com/video/982877483?badge=0&autopause=0&player_id=0&app_id=58479',
  },
  {
    title: 'Marcia Franklin',
    subtitle: 'Idaho Public Television producer/Dialogue host',
    description:
      'Discusses her most memorable Sun Valley Writers\' Conference interviews, including her 2016 sit-down with Game of Thrones creators David Benioff and D.B. Weiss.',
    src: 'https://player.vimeo.com/video/982872224?badge=0&autopause=0&player_id=0&app_id=58479',
  },
  {
    title: 'Don Nelson',
    subtitle: 'KIVI-TV, Channel 6 anchor/reporter',
    description:
      "Explains how Brink Chipman came up with the now-legendary '6 On Your Side' consumer watchdog branding during his tenure as news director.",
    src: 'https://player.vimeo.com/video/982856307?badge=0&autopause=0&player_id=0&app_id=58479',
  },
  {
    title: 'Kevin Miller',
    subtitle: 'KIDO radio talk show host',
    description:
      "Tells us how 'Miller\'s Mission,' his annual on-air fundraising effort to help support the Boise Rescue Mission, came about.",
    src: 'https://player.vimeo.com/video/982690679?badge=0&autopause=0&player_id=0&app_id=58479',
  },
  {
    title: 'Marty Holtman',
    subtitle: 'KBOI radio deejay and KBOI-TV/KBCI-TV weatherman',
    description:
      "Reminisces about his days as late-night horror-movie-show host 'Claude Gloom' and the hugely popular show 'The Unknown.'",
    src: 'https://player.vimeo.com/video/967979349?badge=0&autopause=0&player_id=0&app_id=58479',
  },
  {
    title: "Marty Holtman's Santa Express",
    subtitle: null,
    description:
      'Follow along in an adventure to the North Pole as our beloved Marty Holtman goes on a journey to deliver letters for Santa from the children of Idaho. This Emmy-winning holiday classic has been digitally remastered from original tapes discovered in our archives.',
    src: 'https://player.vimeo.com/video/1040039534?badge=0&autopause=0&player_id=0&app_id=58479',
  },
];

const GalleryPage = () => (
  <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
    <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Video Gallery</h1>
    <div className="grid gap-8 md:grid-cols-2">
      {videos.map((vid, idx) => (
        <div key={idx} className="space-y-2 bg-white p-4 shadow-sm rounded-lg">
          <div className="aspect-video bg-gray-200">
            <iframe
              src={vid.src}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              frameBorder="0"
              title={vid.title}
            ></iframe>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">{vid.title}</h2>
            {vid.subtitle && <p className="text-sm text-blue-600">{vid.subtitle}</p>}
            <p className="text-sm text-gray-700">{vid.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default GalleryPage;
