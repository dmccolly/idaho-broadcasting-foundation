import React from 'react'

const featured = {
  id: '1040039534',
  title: "Marty Holtman's Santa Express",
  description:
    "Follow along as Marty Holtman journeys to the North Pole to deliver letters for Santa. This Emmy-winning holiday classic was remastered from tapes in our archives.",
}

const interviews = [
  {
    id: '982877483',
    title: 'Dee Sarton',
    subtitle: 'Former KTVB-TV, Channel 7 anchor/reporter',
    description:
      "Talks about starting as a young reporter in Boise in the late '70s and working with news director Sal Celeski.",
    credit: 'Photos courtesy: KTVB News Group',
  },
  {
    id: '982872224',
    title: 'Marcia Franklin',
    subtitle: 'Idaho Public Television producer/Dialogue host',
    description:
      'Discusses her memorable Sun Valley Writers\' Conference interviews including a 2016 chat with Game of Thrones creators.',
    credit: 'Photos courtesy: Idaho Public Television',
  },
  {
    id: '982856307',
    title: 'Don Nelson',
    subtitle: 'KIVI-TV, Channel 6 anchor/reporter',
    description:
      'Explains how Brink Chipman devised the legendary “6 On Your Side” consumer watchdog branding.',
    credit: 'Photos courtesy: KIVI, Channel 6',
  },
  {
    id: '982690679',
    title: 'Kevin Miller',
    subtitle: 'KIDO radio talk show host',
    description:
      'Shares how “Miller\'s Mission,” his annual fundraiser for the Boise Rescue Mission, came about.',
    credit: 'Photos courtesy: Boise Rescue Mission',
  },
  {
    id: '967979349',
    title: 'Marty Holtman',
    subtitle: 'KBOI radio deejay and KBOI-TV/KBCI-TV weatherman',
    description:
      'Reminisces about hosting horror movies as “Claude Gloom” and the popularity of “The Unknown.”',
    credit: 'Photos courtesy: KBOI, Channel 2',
  },
]

const GalleryPage = () => (
  <div className="mx-auto max-w-5xl px-4 py-8 space-y-12">
    <section className="space-y-4">
      <div className="aspect-video bg-gray-100 rounded overflow-hidden">
        <iframe
          src={`https://player.vimeo.com/video/${featured.id}`}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          title={featured.title}
        ></iframe>
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{featured.title}</h2>
        <p className="text-sm text-gray-600">{featured.description}</p>
      </div>
    </section>

    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {interviews.map((video) => (
        <div key={video.id} className="space-y-2">
          <div className="aspect-video bg-gray-100 rounded overflow-hidden">
            <iframe
              src={`https://player.vimeo.com/video/${video.id}`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              title={`${video.title} Interview`}
            ></iframe>
          </div>
          <h3 className="font-semibold">{video.title}</h3>
          {video.subtitle && (
            <p className="text-sm text-blue-600">{video.subtitle}</p>
          )}
          <p className="text-sm text-gray-600">{video.description}</p>
          {video.credit && (
            <p className="text-xs text-gray-500">{video.credit}</p>
          )}
        </div>
      ))}
    </div>
  </div>
)

export default GalleryPage
