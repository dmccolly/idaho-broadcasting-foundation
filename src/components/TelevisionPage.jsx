import React from 'react';

const videos = [
  {
    id: '1040039534',
    title: "Marty Holtman's Santa Express",
    desc:
      "Follow along in an adventure to the North Pole as our beloved Marty Holtman goes on a journey to deliver letters for Santa from the children of Idaho. This Emmy-winning holiday classic has been digitally remastered from original video tapes discovered in our archives.",
  },
  {
    id: '982877483',
    title: 'Dee Sarton',
    desc:
      "Former KTVB-TV, Channel 7 anchor/reporter. Talks about starting out as a young reporter in Boise in the late '70s, and working with legendary Channel 7 news director Sal Celeski.",
  },
  {
    id: '982872224',
    title: 'Marcia Franklin',
    desc:
      "Idaho Public Television producer/Dialogue host. Discusses her most memorable Sun Valley Writers' Conference interviews, including her 2016 sit-down with Game of Thrones creators David Benioff and D.B. Weiss.",
  },
  {
    id: '982856307',
    title: 'Don Nelson',
    desc:
      'KIVI-TV, Channel 6 anchor/reporter. Explains how Brink Chipman came up with the now-legendary "6 On Your Side" consumer watchdog branding during his tenure as news director.',
  },
  {
    id: '982690679',
    title: 'Kevin Miller',
    desc:
      'KIDO radio talk show host. Tells us how "Miller\'s Mission," his annual on-air fundraising effort to help support the Boise Rescue Mission, came about.',
  },
  {
    id: '967979349',
    title: 'Marty Holtman',
    desc:
      'KBOI radio deejay and KBOI-TV/KBCI-TV weatherman. Reminisces about his days as late-night horror-movie-show host "Claude Gloom" and the hugely popular show "The Unknown."',
  },
];

const TelevisionPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
    <h2 className="text-3xl font-bold text-center">Television Video Gallery</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((v) => (
        <div key={v.id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={`https://player.vimeo.com/video/${v.id}`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              title={v.title}
            ></iframe>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{v.title}</h3>
            <p className="text-sm text-gray-600">{v.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TelevisionPage;
