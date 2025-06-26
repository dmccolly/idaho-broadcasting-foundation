// src/components/RadioPage.jsx

import React, { useState } from 'react';
import './RadioPage.css'; // Assuming you'll create a CSS file for styling

const stationData = [
  {
    id: 'kawo',
    name: 'KAWO - 104.3 FM',
    synopsis: 'KAWO, "Wow Country 104.3," has been a cornerstone of country music in the Treasure Valley since its inception. Known for its vibrant community engagement and popular morning shows, KAWO continues to be a leading voice in Idaho radio.',
    history: `
      <p><strong>Early Days:</strong> KAWO began broadcasting in [Year] with a focus on delivering the latest country hits and local news. Its initial programming aimed to capture the growing country music audience in the region.</p>
      <p><strong>Growth and Popularity:</strong> Throughout the [Decade]s, KAWO solidified its position, becoming synonymous with country music in Idaho. Its live broadcasts from local events and strong on-air personalities contributed significantly to its popularity.</p>
      <p><strong>Modern Era:</strong> Today, KAWO maintains its commitment to country music, integrating digital platforms while preserving its traditional radio presence. It continues to host popular events and remains a beloved station for its loyal listeners.</p>
      <p><strong>Key Personalities:</strong> [List of notable DJs/personalities]</p>
      <p><strong>Legacy:</strong> KAWO's legacy is built on its consistent delivery of quality country programming and its deep connection to the Idaho community.</p>
    `
  },
  {
    id: 'kcix',
    name: 'KCIX - 105.9 FM',
    synopsis: 'KCIX, "Mix 105.9," offers a diverse blend of adult contemporary hits, making it a popular choice for a wide demographic. Its commitment to local events and community service has made it a staple in Idaho broadcasting.',
    history: `
      <p><strong>Inception:</strong> KCIX launched in [Year], aiming to fill a niche for adult contemporary music. Its initial format quickly gained traction among listeners seeking a mix of popular and classic hits.</p>
      <p><strong>Evolution:</strong> Over the years, KCIX adapted its playlist to reflect changing musical tastes while maintaining its core adult contemporary identity. It became known for its smooth transitions and engaging hosts.</p>
      <p><strong>Community Focus:</strong> KCIX has always emphasized local involvement, sponsoring numerous community events and charity drives. This dedication has fostered a strong bond with its audience.</p>
      <p><strong>Programming Highlights:</strong> [Details on specific shows or segments]</p>
      <p><strong>Impact:</strong> KCIX's impact lies in its ability to provide a comforting and familiar soundscape for its listeners, alongside its active role in community betterment.</p>
    `
  },
  {
    id: 'kthi',
    name: 'KTHI - 107.1 FM',
    synopsis: 'KTHI, "107.1 K-Hits," specializes in classic hits from the 70s, 80s, and 90s, bringing a nostalgic experience to its listeners. It’s celebrated for its timeless playlist and engaging throwback segments.',
    history: `
      <p><strong>Founding:</strong> KTHI began broadcasting in [Year], carving out a niche by focusing exclusively on classic hits. This format immediately resonated with listeners looking to relive their favorite musical eras.</p>
      <p><strong>Golden Era:</strong> The station quickly became a go-to for nostalgic music, featuring themed weekends and special programming dedicated to specific decades. Its DJs often shared anecdotes about the music and artists.</p>
      <p><strong>Current Status:</strong> KTHI continues to thrive by curating a playlist that appeals to multiple generations. It remains a popular choice for those who appreciate the enduring appeal of classic pop and rock.</p>
      <p><strong>Notable Shows:</strong> [Examples of popular classic hit shows]</p>
      <p><strong>Cultural Significance:</strong> KTHI plays a significant role in preserving and celebrating the musical heritage of past decades, offering a unique listening experience in the Idaho market.</p>
    `
  },
  {
    id: 'kqxr',
    name: 'KQXR - 100.3 FM',
    synopsis: 'KQXR, "100.3 The X," is Idaho\'s premier rock station, delivering hard-hitting rock music and supporting local bands. Known for its edgy personality and commitment to the rock scene, it’s a favorite among rock enthusiasts.',
    history: `
      <p><strong>Establishment:</strong> KQXR hit the airwaves in [Year], quickly establishing itself as the voice of rock music in Idaho. Its aggressive programming and rebellious spirit set it apart from other stations.</p>
      <p><strong>Rise to Prominence:</strong> "The X" became a cultural touchstone for rock fans, hosting major concerts, band interviews, and promoting the local music scene. Its morning show gained a reputation for its irreverent humor.</p>
      <p><strong>Enduring Legacy:</strong> Today, KQXR continues its tradition of playing the best in rock, from classic anthems to new releases. It remains a vital platform for both established and emerging rock artists.</p>
      <p><strong>Signature Events:</strong> [Concerts, festivals, or annual events hosted by KQXR]</p>
      <p><strong>Influence:</strong> KQXR has profoundly influenced the rock music landscape in Idaho, fostering a vibrant community of musicians and fans.</p>
    `
  },
  {
    id: 'kido',
    name: 'KIDO - 580 AM / 107.5 FM',
    synopsis: 'KIDO is a prominent news/talk radio station, providing comprehensive coverage of local, state, and national issues. With a strong lineup of talk show hosts, KIDO is a key source for news and political commentary in Idaho.',
    history: `
      <p><strong>Historical Roots:</strong> KIDO has a long and storied history in Idaho broadcasting, dating back to [Year]. It initially served as a general entertainment station before evolving into its current news/talk format.</p>
      <p><strong>Transition to News/Talk:</strong> In the [Decade]s, KIDO shifted its focus to news and talk programming, responding to a growing demand for in-depth discussions on current events and public affairs.</p>
      <p><strong>Modern Era:</strong> KIDO now features a mix of local talk shows, syndicated programs, and live news updates. It plays a crucial role in informing public discourse and engaging listeners on critical issues.</p>
      <p><strong>Key Programs:</strong> [Names of popular talk shows or news segments]</p>
      <p><strong>Role in Community:</strong> KIDO serves as a vital forum for public opinion and debate, contributing significantly to the civic life of Idaho.</p>
    `
  },
  {
    id: 'kfxd',
    name: 'KFXD - 630 AM',
    synopsis: 'KFXD, "The Fan," is Idaho\'s leading sports talk radio station, offering live game broadcasts, expert analysis, and passionate discussions on local and national sports. It’s the go-to station for sports fans.',
    history: `
      <p><strong>Launch:</strong> KFXD began its journey in [Year] with a clear mission: to be the voice of sports in Idaho. It quickly gained a following among avid sports enthusiasts.</p>
      <p><strong>Building a Reputation:</strong> The station became known for its comprehensive coverage of high school, collegiate, and professional sports. Its live play-by-play broadcasts and insightful commentary set it apart.</p>
      <p><strong>Current Status:</strong> KFXD continues to deliver unparalleled sports content, featuring popular local sports personalities and exclusive interviews with athletes and coaches. It remains an essential resource for Idaho sports fans.</p>
      <p><strong>Coverage Highlights:</strong> [Specific teams or events KFXD is known for covering]</p>
      <p><strong>Fan Engagement:</strong> KFXD fosters a strong sense of community among sports fans, providing a platform for discussion and shared passion.</p>
    `
  },
  {
    id: 'kbsu',
    name: 'KBSU - 90.3 FM',
    synopsis: 'KBSU is Boise State Public Radio, an NPR member station providing in-depth news, cultural programming, and classical music. It is a vital source of unbiased information and enriching content for the community.',
    history: `
      <p><strong>Origins:</strong> KBSU, operated by Boise State University, first went on air in [Year] with a commitment to public service broadcasting. It quickly became an affiliate of NPR, bringing national and international news to Idaho.</p>
      <p><strong>Program Expansion:</strong> Over the decades, KBSU expanded its programming to include a wide range of cultural shows, classical music, and local public affairs discussions, enriching the intellectual life of the region.</p>
      <p><strong>Educational Role:</strong> As a university-affiliated station, KBSU also plays an educational role, often featuring programs produced by students and faculty, and serving as a learning laboratory for aspiring broadcasters.</p>
      <p><strong>Awards and Recognition:</strong> [Any notable awards or achievements]</p>
      <p><strong>Community Impact:</strong> KBSU's impact is profound, providing a trusted source of news and a platform for diverse voices and artistic expression, contributing significantly to the cultural fabric of Idaho.</p>
    `
  },
  {
    id: 'kgem',
    name: 'KGEM - 1140 AM',
    synopsis: 'KGEM is a heritage station in Idaho, known for its diverse programming that has evolved over decades. It has played various roles in the local media landscape, from music to talk, adapting to the changing needs of its audience.',
    history: `
      <p><strong>Founding and Early Years:</strong> KGEM has a rich history dating back to [Year], making it one of Idaho's oldest stations. It initially broadcast [original format, e.g., popular music, local news].</p>
      <p><strong>Format Changes:</strong> Throughout its existence, KGEM has undergone several format changes, reflecting shifts in listener preferences and market demands. It has been a home for [mention various formats, e.g., country, easy listening, religious programming].</p>
      <p><strong>Resilience:</strong> Despite changes in the broadcasting landscape, KGEM has demonstrated remarkable resilience, continuing to serve the community in various capacities. Its long history is a testament to its adaptability.</p>
      <p><strong>Notable Moments:</strong> [Any significant historical events or broadcasts associated with KGEM]</p>
      <p><strong>Enduring Presence:</strong> KGEM remains a part of Idaho's radio heritage, symbolizing the enduring power of local broadcasting and its ability to connect with generations of listeners.</p>
    `
  },
  {
    id: 'kboi',
    name: 'KBOI - 670 AM / 93.1 FM',
    synopsis: 'KBOI is a long-standing news and talk radio station, serving the Boise area with comprehensive news coverage, insightful commentary, and popular syndicated programs. It is a key source for local and national discussions.',
    history: `
      <p><strong>Establishment:</strong> KBOI has been a fixture in Idaho radio since [Year], initially establishing itself as a dominant force in [original format, e.g., general entertainment, news].</p>
      <p><strong>Transition to News/Talk:</strong> Similar to other heritage AM stations, KBOI transitioned to a news and talk format, capitalizing on its strong signal and established listener base to deliver timely information and engaging discussions.</p>
      <p><strong>Market Leader:</strong> KBOI has consistently been a market leader in news and talk, attracting a wide audience interested in current events, politics, and local issues. Its hosts are often influential figures in the community.</p>
      <p><strong>Key Features:</strong> [Examples of news segments, call-in shows, or syndicated programs]</p>
      <p><strong>Influence and Reach:</strong> KBOI's influence extends across the Treasure Valley and beyond, making it a critical platform for public discourse and a trusted source of information for many Idahoans.</p>
    `
  }
];

const StationCard = ({ station }) => {
  const [showFullHistory, setShowFullHistory] = useState(false);

  return (
    <div className="station-card">
      <h3 className="station-name">{station.name}</h3>
      <p className="station-synopsis">{station.synopsis}</p>
      <button
        className="read-more-button"
        onClick={() => setShowFullHistory(!showFullHistory)}
      >
        {showFullHistory ? 'Hide Full History' : 'Read Full History'}
      </button>
      {showFullHistory && (
        <div className="full-history" dangerouslySetInnerHTML={{ __html: station.history }} />
      )}
    </div>
  );
};

const RadioPage = () => {
  return (
    <div className="radio-page-container">
      <div className="header-graphic">
        <h1 className="header-title">Idaho Radio History - an adventure in evolution!</h1>
        {/* Placeholder for radio equipment graphics - in a real scenario, this would be a background image or an actual image tag */}
        <div className="radio-equipment-placeholder"></div>
      </div>

      <div className="station-cards-grid">
        {stationData.map(station => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
};

export default RadioPage;
