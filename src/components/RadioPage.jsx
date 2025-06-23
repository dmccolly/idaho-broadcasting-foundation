import { useState } from 'react'

const RadioPage = () => {
  const [selectedStation, setSelectedStation] = useState(null)

  const stations = [
    {
      id: 'kidq',
      name: 'KIDQ (currently KAWO)',
      currentBrand: 'Wow Country 104.3',
      summary: `Long before it was "Wow Country 104.3," the station at 104.3 FM was a trailblazer for Boise rock fans. Signing on as KIDQ "Q-104," it was the market's very first Album-Oriented Rock station, a haven for listeners who wanted more than just Top 40 hits. But the rock era didn't last forever. Over the years, this frequency has been a chameleon, changing its identity to suit the times. It spent years as the adult contemporary "K-Lite 104" and later became the go-to for golden oldies as "Kool 104.3". Finally, in 2006, it found its current calling in country music, eventually rebranding to the familiar "Wow Country 104.3" we know today. It's a great example of how a station can reinvent itself time and time again.`,
      fullContent: `[Full detailed report content would go here - extracted from the document]`
    },
    {
      id: 'kcix',
      name: 'KCIX',
      currentBrand: 'Mix 106',
      summary: `For generations of Boise commuters, "Mix 106" was synonymous with morning radio, thanks to the incredible chemistry of "Mike and Kate". For over a decade, Mike Kasper and Kate McGwire were the heart and soul of KCIX, turning the station into a Hot AC powerhouse and a local institution. Their friendly banter and relatable humor built a fiercely loyal audience. The station, which started as "K-106" back in 1985, truly found its groove with the "Mix" brand and the beloved morning duo. However, their story also shows how vital on-air talent is. When the team split, the station faced a long period of change, trying to recapture that morning magic that had once defined it so perfectly.`,
      fullContent: `[Full detailed report content would go here - extracted from the document]`
    },
    {
      id: 'kthi',
      name: 'KTHI',
      currentBrand: '107.1 Hank FM',
      summary: `For 22 years, KTHI was a familiar friend to Boise listeners as "107.1 K-Hits". It was the reliable spot on the dial for the classic hits of the 70s and 80s, a dependable soundtrack of rock and pop favorites. But in the world of radio, nothing is forever. In a move that surprised its loyal audience in 2024, the station abruptly flipped formats. After playing a final, fitting R.E.M. song, K-Hits was gone, replaced by the twang of "107.1 Hank FM". This dramatic change transformed the station into a classic country outlet, jumping into a competitive field and starting a brand new chapter. It's a perfect story of how corporate strategy can instantly change the sound of a city.`,
      fullContent: `[Full detailed report content would go here - extracted from the document]`
    },
    {
      id: 'kqxr',
      name: 'KQXR',
      currentBrand: '100.3 The X',
      summary: `If you're a rock fan in the Treasure Valley, you know "100.3 The X". For nearly three decades, KQXR has been the undisputed champion of all things rock, blasting its powerful signal across the region. The station has evolved with the times, starting as an alternative rock outlet in the 90s and morphing into the active rock powerhouse it is today. But "The X" is more than just a playlist; it's a cultural force. It has been a launchpad for local bands, the host of the legendary "X-Fest," and the home of a loyal community of listeners known as the "X Army". With a stable lineup of local DJs who are true fans of the music, KQXR has built a legacy of authenticity that keeps it at the top of its game.`,
      fullContent: `[Full detailed report content would go here - extracted from the document]`
    },
    {
      id: 'kido',
      name: 'KIDO',
      currentBrand: 'News/Talk',
      summary: `KIDO's story is basically the story of radio in Idaho. Its roots go all the way back to a physics classroom at Boise High School in the 1920s, making it the state's very first station. For decades, it was a pioneering force, bringing the first national network affiliation to Idaho and growing into a local media empire. But to stay on top, you have to be smart. In 2002, the station made a legendary move, swapping frequencies with its rival KFXD to land on a much more powerful AM signal. This strategic swap cemented its future as the conservative news/talk powerhouse it is today, blending its incredible history with modern political influence and a deep connection to the community.`,
      fullContent: `[Full detailed report content would go here - extracted from the document]`
    },
    {
      id: 'kfxd',
      name: 'KFXD',
      currentBrand: 'Power 105.5',
      summary: `The station at 630 AM has one of the most fascinating and tangled histories in Boise. For the first 80 years of its life, this was the home of the legendary KIDO. But in 2002, a major frequency swap changed everything. The KIDO brand moved to a stronger signal, and 630 AM became KFXD. Since then, this frequency has been a bit of a chameleon, trying on different hats to see what fits. It's been a classic country station, an all-talk station, and a sports talk hub known as "The Fan". Today, it has a totally new identity as "Power 105.5," using an FM translator to bring hip-hop and R&B to the Treasure Valley, proving that even the oldest stations can find new life.`,
      fullContent: `[Full detailed report content would go here - extracted from the document]`
    },
    {
      id: 'kbsu',
      name: 'KBSU',
      currentBrand: 'Boise State Public Radio',
      summary: `From a tiny, student-run club broadcasting only to the Boise State campus, KBSU has grown into Idaho's most essential non-commercial media organization. Its journey is a fantastic story of evolution. In the 1980s, it transformed from a freeform college station into a professional public radio service, becoming the region's home for NPR. Today, Boise State Public Radio operates as a dual service, with one station dedicated to award-winning news and another to classical music, jazz, and other unique cultural programs. It provides a thoughtful, in-depth alternative to commercial radio, serving communities across the entire state with programming you simply can't find anywhere else on the dial. It's a true Idaho gem.`,
      fullContent: `[Full detailed report content would go here - extracted from the document]`
    },
    {
      id: 'kgem',
      name: 'KGEM',
      currentBrand: 'Salt & Light Catholic Radio',
      summary: `KGEM is a station of two completely different eras. For over 60 years, it was a familiar commercial voice in Boise, a place on the AM dial for music and entertainment. In the early 60s, it was known for its creative and humorous promotions as "Fun Central," with memorable on-air personalities. But in 2009, the station underwent a profound transformation. It was sold to a non-profit organization and became "Salt & Light Catholic Radio". Overnight, its mission changed from commercial entertainment to religious teaching and evangelization. Today, it serves the Treasure Valley's Catholic community with syndicated religious programming, a perfect example of how a station's identity can be completely reborn.`,
      fullContent: `[Full detailed report content would go here - extracted from the document]`
    },
    {
      id: 'kboi',
      name: 'KBOI',
      currentBrand: 'News/Talk/Sports',
      summary: `With a booming 50,000-watt signal that can be heard for hundreds of miles, KBOI is a true giant of Idaho broadcasting. For over 75 years, it has been a trusted source for news, talk, and sports. The station began its life as KDSH in 1947 before becoming the KBOI that generations of listeners grew up with. It was the home of legendary personalities like Paul J. Schneider, who anchored the morning show for over 40 years and was the iconic "Voice of the Boise State Broncos". While its music format has long since given way to news and talk, KBOI's core identity has never changed: it's a powerful, influential station deeply connected to its community and the official home for Bronco Nation.`,
      fullContent: `[Full detailed report content would go here - extracted from the document]`
    }
  ]

  const openModal = (station) => {
    setSelectedStation(station)
  }

  const closeModal = () => {
    setSelectedStation(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with ReelLit Image and Text Overlay */}
      <div className="relative">
        <img 
          src="/ReelLit.png" 
          alt="Vintage Broadcasting Equipment - Reel-to-Reel Tape Machines and VU Meters" 
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 text-shadow-lg">
            Idaho Radio History
          </h1>
          <p className="text-xl md:text-2xl font-light italic text-shadow-md">
            an adventure in evolution!
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="relative">
        {/* Vintage Microphone - Left Side */}
        <div className="absolute left-4 top-20 hidden lg:block opacity-20 hover:opacity-40 transition-opacity">
          <img 
            src="/vintage-microphone.png" 
            alt="Vintage Radio Microphone" 
            className="w-20 h-20 object-contain"
          />
        </div>
        
        {/* Digital Waves - Right Side */}
        <div className="absolute right-4 top-40 hidden lg:block opacity-30 hover:opacity-50 transition-opacity">
          <img 
            src="/digital-waves.png" 
            alt="Modern Radio Waves" 
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Stations Grid */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stations.map((station, index) => (
              <div key={station.id} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
                {/* Subtle background graphic for each card */}
                {index % 3 === 0 && (
                  <div className="absolute top-2 right-2 opacity-10">
                    <img src="/vintage-microphone.png" alt="" className="w-8 h-8 object-contain" />
                  </div>
                )}
                {index % 3 === 1 && (
                  <div className="absolute top-2 right-2 opacity-10">
                    <img src="/digital-waves.png" alt="" className="w-8 h-8 object-contain" />
                  </div>
                )}
                {index % 3 === 2 && (
                  <div className="absolute top-2 right-2 opacity-10">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                )}
                
                <div className="mb-4 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{station.name}</h3>
                    {station.id === 'kbsu' && (
                      <img 
                        src="/KBSUOld.webp" 
                        alt="KBSU Old Logo" 
                        className="w-12 h-8 object-contain"
                      />
                    )}
                    {station.id === 'kidq' && (
                      <img 
                        src="/Q104StarClean.png" 
                        alt="Q104 The Rock of Idaho Logo" 
                        className="w-16 h-12 object-contain"
                      />
                    )}
                  </div>
                  <p className="text-sm text-blue-600 font-medium">{station.currentBrand}</p>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-6 relative z-10">
                  {station.summary}
                </p>
                
                <button
                  onClick={() => openModal(station)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors relative z-10"
                >
                  Read Full History
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedStation.name}</h2>
                <p className="text-blue-600 font-medium">{selectedStation.currentBrand}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose max-w-none">
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-700 leading-relaxed">{selectedStation.summary}</p>
                </div>
                
                <div className="text-gray-700">
                  <h3 className="text-lg font-semibold mb-3">Complete Station History</h3>
                  
                  {selectedStation.id === 'kbsu' ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-4">
                        <img 
                          src="/BSUStudio.webp" 
                          alt="BSU Radio Studio - Historic Broadcasting Setup" 
                          className="w-64 h-auto object-cover rounded-lg shadow-md float-left mr-4 mb-2"
                        />
                        <p className="text-gray-700 leading-relaxed">
                          KBSU's story begins in the early days of Boise State University, when ambitious students and faculty 
                          recognized the power of radio to connect with their community. What started as a small campus station 
                          broadcasting from modest facilities has evolved into one of Idaho's most respected public radio networks.
                        </p>
                      </div>
                      
                      <div className="clear-both">
                        <img 
                          src="/BSUNPR.png" 
                          alt="Boise State Public Radio Current Logo" 
                          className="w-48 h-auto object-contain rounded-lg shadow-md float-right ml-4 mb-2"
                        />
                        <p className="text-gray-700 leading-relaxed">
                          The transformation from college radio to professional public broadcasting represents decades of growth, 
                          community support, and dedication to quality journalism and cultural programming. Today's Boise State 
                          Public Radio serves communities across Idaho with award-winning news coverage, classical music, jazz, 
                          and unique cultural programs that you simply can't find anywhere else on the dial.
                        </p>
                      </div>
                      
                      <div className="clear-both pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          From its humble beginnings as a student-run operation to its current status as Idaho's premier 
                          non-commercial broadcaster, KBSU represents the best of public radio's mission: to inform, educate, 
                          and inspire communities through thoughtful, in-depth programming that serves the public interest.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">
                      [Full detailed historical report will be displayed here when integrated with the complete document content]
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RadioPage

