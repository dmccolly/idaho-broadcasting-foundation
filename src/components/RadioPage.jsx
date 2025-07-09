// src/components/RadioPage.jsx

import React, { useState } from 'react';
import './RadioPage.css';

// IMPORTANT: Ensure these images are uploaded to src/assets/images/
import wowCountryLogo from '../assets/images/wow-country-104-3-logo.png';
import q104Logo from '../assets/images/q104-logo.png';
import radioConsoleDark from '../assets/images/RadioCOnsoleDark.png';

const stationData = [
  {
    id: 'kidq',
    name: 'KIDQ (now KAWO) – 104.3 FM',
    synopsis: (
      <>
        <img src={q104Logo} alt="Q104 Logo" className="station-logo" />
        Long before "Wow Country 104.3," this frequency debuted as Boise's first album rock outlet, Q‑104. Over the decades it morphed from rock to adult contemporary to oldies before settling on country in 2006.
      </>
    ),
    history: `
      <p><strong>1979:</strong> Launched as KIDQ "Q‑104," introducing Boise's first album‑oriented rock format.</p>
      <p><strong>Mid‑1980s:</strong> The rock era ended as the station flipped to adult contemporary "K‑Lite" and later to oldies as "Kool 104," a format that lasted nearly two decades.</p>
      <p><strong>2006:</strong> Clear Channel moved the station to country, first as "My Country" and soon rebranded it as "Wow Country 104.3." Townsquare Media owns the station today, one of several country outlets in the market.</p>
    `
  },
  {
    id: 'kcix',
    name: 'KCIX - 105.9 FM',
    synopsis: `For generations of Boise commuters, “Mix 106” was defined by the friendly banter of Mike and Kate. Their long‑running morning show helped KCIX dominate the Hot AC format for years.`,
    history: `
      <p><strong>1985:</strong> Signed on as "K‑106" with an adult contemporary format.</p>
      <p><strong>1999:</strong> Rebranded to "Mix 106" and soon became a powerhouse thanks to the “Mike and Kate” morning show.</p>
      <p><strong>2016:</strong> Kate McGwire’s departure marked the start of a revolving door of hosts, and ratings have struggled since.</p>
    `
  },
  {
    id: 'kthi',
    name: 'KTHI - 107.1 FM',
    synopsis: `For 22 years "107.1 K‑Hits" was Boise’s home for classic hits. In 2024 the familiar playlist vanished overnight as the station flipped to "Hank FM" classic country.`,
    history: `
      <p><strong>2002:</strong> Adopted the KTHI call sign and "K‑Hits" branding, becoming a staple for 70s and 80s classics.</p>
      <p><strong>May 2024:</strong> After weeks of rumours, the station abruptly dropped K‑Hits and relaunched as "107.1 Hank FM" playing classic country.</p>
      <p>The surprise flip left longtime listeners reeling as Lotus Communications sought to capture a slice of the lucrative country audience.</p>
    `
  },
  {
    id: 'kqxr',
    name: 'KQXR - 100.3 FM',
    synopsis: `"100.3 The X" has ruled Boise's rock scene since the mid‑90s, championing local bands and hosting the legendary X‑Fest each summer.`,
    history: `
      <p><strong>1978:</strong> Signed on (then at 100.1 FM) and went through several formats before adopting a hard‑rock identity.</p>
      <p><strong>1995:</strong> Rebranded as "The X" with an alternative rock format that evolved into active rock by 2010.</p>
      <p>With long‑time hosts Nic & Big J and deep involvement in the concert scene, KQXR remains the valley’s definitive rock outlet.</p>
    `
  },
  {
    id: 'kido',
    name: 'KIDO - 580 AM / 107.5 FM',
    synopsis: `KIDO’s lineage stretches back to Boise’s very first station in the 1920s. After a famous frequency swap in 2002, it cemented itself as the city’s conservative talk powerhouse.`,
    history: `
      <p><strong>1922:</strong> Began as high‑school project KFAU, soon becoming KIDO.</p>
      <p><strong>2002:</strong> Swapped frequencies with 630 AM to gain a stronger 580 AM signal, ensuring the future of its talk format.</p>
      <p>Now owned by Townsquare Media, KIDO features local host Kevin Miller alongside national conservative voices.</p>
    `
  },
  {
    id: 'kfxd',
    name: 'KFXD - 630 AM',
    synopsis: `At 630 AM, this facility carried the KIDO call for 80 years. After the 2002 frequency swap it has bounced through country, talk, sports and today airs rhythmic hits as “Power 105.5.”`,
    history: `
      <p><strong>1920s‑2002:</strong> Home of the original KIDO until Clear Channel moved that brand to 580 AM.</p>
      <p><strong>2002‑2020:</strong> Operated under various formats—including classic country and sports talk "The Fan"—before flipping to a hip‑hop focused format in 2020.</p>
      <p>The AM signal drops to a mere 37 watts at night, so most listeners hear it on 105.5 FM via translator.</p>
    `
  },
  {
    id: 'kbsu',
    name: 'KBSU - 90.3 FM',
    synopsis: `From humble campus club to statewide network, Boise State Public Radio now reaches more than a million Idahoans with NPR news and classical music.`,
    history: `
      <p><strong>1957:</strong> Began as a low‑power student station at Boise Junior College.</p>
      <p><strong>1988:</strong> Joined NPR and boosted power to 19,000 watts from Deer Point, delivering a clear public radio signal to Boise.</p>
      <p>Today KBSU and sister station KBSX operate a network of transmitters across Idaho, providing award‑winning news and cultural programming.</p>
    `
  },
  {
    id: 'kgem',
    name: 'KGEM - 1140 AM',
    synopsis: `KGEM spent six decades as a commercial station before a 2009 sale turned it into Salt & Light Catholic Radio, dedicated to faith‑based programming.`,
    history: `
      <p><strong>1947:</strong> Signed on and became a familiar AM voice in Boise for music and entertainment.</p>
      <p><strong>2009:</strong> Purchased by Salt & Light Radio and converted to a non‑commercial Catholic format.</p>
      <p>Today KGEM airs EWTN programming and serves the Treasure Valley’s Catholic community.</p>
    `
  },
  {
    id: 'kboi',
    name: 'KBOI - 670 AM / 93.1 FM',
    synopsis: `With a booming 50,000‑watt signal, KBOI has delivered news and talk across Idaho since the 1940s and remains the flagship for Boise State sports.`,
    history: `
      <p><strong>1947:</strong> Signed on as KDSH and soon joined CBS Radio.</p>
      <p><strong>1955:</strong> Became KBOI, later increasing power to 50 kW and dominating the market with a full‑service format.</p>
      <p>By the 1980s it had evolved into today’s news/talk powerhouse and continues as one of Idaho’s most influential stations.</p>
    `
  }
];

const StationCard = ({ station }) => {
  const [showFullHistory, setShowFullHistory] = useState(false);

  return (
    <div className="station-card">
      <h3 className="station-name">{station.name}</h3>
      <div className="station-synopsis">{station.synopsis}</div>
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
        <img src={radioConsoleDark} alt="Radio Console" className="header-image" />
        <div className="header-text-container">
          <h1 className="header-title-overlay">Radio History</h1>
          <p className="header-subtitle-overlay">an adventure in evolution</p>
        </div>
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
