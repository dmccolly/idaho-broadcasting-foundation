import { useState } from 'react'

const RadioPage = () => {
  const [expandedStation, setExpandedStation] = useState(null)

  // Station data extracted from the uploaded file
  const stations = [
    {
      id: 'KAWO',
      callLetters: 'KIDQ (currently KAWO)',
      frequency: '104.3 FM',
      branding: 'Wow Country 104.3',
      synopsis: 'Long before it was "Wow Country 104.3," the station at 104.3 FM was a trailblazer for Boise rock fans. Signing on as KIDQ "Q-104," it was the market\'s very first Album-Oriented Rock station, a haven for listeners who wanted more than just Top 40 hits. Through multiple format changes—from rock to adult contemporary to oldies and finally to country—this frequency has constantly evolved to meet the changing tastes of the Treasure Valley.',
      fullHistory: `KAWO, branded as "Wow Country 104.3," is a major player in Boise's competitive country music scene. However, its identity as a country station is a relatively recent development in its four-decade history. The station at 104.3 FM has a rich and varied past, most notably signing on as KIDQ "Q-104," the first Album-Oriented Rock (AOR) station in the Boise market. Its journey from pioneering rock station to adult contemporary, oldies, and finally to country music illustrates the dynamic nature of FM radio programming and the strategic decisions made by corporate owners to capture specific audience demographics. Today, it stands as one of several country outlets in the Treasure Valley, owned by industry giant Townsquare Media.

**The Rock Era: KIDQ "Q-104" (1979-1985)**
The station first signed on July 15, 1979, with the call letters KIDQ. Branded as "Q-104," it introduced the Album-Oriented Rock (AOR) format to the Boise market, a significant development for rock fans who had previously been limited to Top 40 stations. This era established 104.3 FM as a destination for rock music.

**A Series of Flips: K-Lite and Kool 104 (1985-2006)**
In 1985, the station underwent a dramatic shift. The AOR format was dropped in favor of Adult Contemporary (AC), and the station was rebranded as "K-Lite 104 FM." The call letters were briefly changed to KUUB before settling on KLTB to match the "K-Lite" branding. This move left a significant void in the market for rock music, which was quickly filled less than a month later by the debut of KJOT ("J-105").

The AC format eventually gave way to an oldies format, with the station rebranding as "Kool 104" and later "Kool Oldies 104.3". This identity lasted until January 2006, when then-owner Clear Channel Communications made another decisive format change.

**The Country Era: "My Country" and "Wow Country" (2006-Present)**
In January 2006, Clear Channel flipped KLTB from oldies to country music. The station adopted the call letters KTMY and the branding "My Country 104.3". This move placed it in direct competition with other country stations in the market.

Later that year, on November 16, 2006, Clear Channel announced it was selling its entire Boise cluster, including KTMY. In March 2007, Peak Broadcasting LLC completed its purchase of the stations. Facing declining ratings, Peak Broadcasting moved quickly to rebrand the station. In late May 2007, "My Country 104.3" became "Wow Country 104.3," and the call letters were changed to the current KAWO (phonetically for "K-Wow"). The new brand initially featured "104-minute music sets" as a programming gimmick, though this was later abandoned.

On November 14, 2013, the station came under its current ownership when Townsquare Media acquired the Peak Broadcasting cluster.

**Programming and Community Connection**
As "Wow Country 104.3," KAWO's programming consists of mainstream country music, featuring a mix of current hits and popular songs from recent decades. The station has seen significant personality changes over the years, particularly in its morning show. In 2019, morning hosts Billy Jenkins and Charene Herrera were abruptly swapped with the hosts of sister station KCIX "Mix 106," a move that jolted listeners of both stations.

**Legacy**
The legacy of the station at 104.3 FM is one of transformation. It holds a significant place in Boise radio history as KIDQ "Q-104," the market's first dedicated AOR station, which paved the way for other rock outlets like KJOT and KQXR. Today, as KAWO "Wow Country 104.3," it is an established player in the Treasure Valley's country music battleground.`
    },
    {
      id: 'KCIX',
      callLetters: 'KCIX',
      frequency: '105.9 FM',
      branding: 'Mix 106',
      synopsis: 'For generations of Boise commuters, "Mix 106" was synonymous with morning radio, thanks to the incredible chemistry of Mike Kasper and Kate McGwire. For over a decade, Mike Kasper and Kate McGwire were the heart and soul of KCIX, turning the station into a Hot AC powerhouse and a local institution. Their friendly banter and relatable humor built a fiercely loyal audience. The station, which started as "K-106" back in 1985, truly found its groove with the "Mix" brand and the beloved morning duo. However, their story also shows how vital on-air talent is. When the team split, the station faced a long period of change, trying to recapture that morning magic that had once defined it so perfectly.',
      fullHistory: `KCIX, branded for over two decades as "Mix 106," is a long-standing and significant presence in the Boise radio market, licensed to Garden City, Idaho. For much of its history, the station was a dominant force in the Adult Top 40 and Hot Adult Contemporary (Hot AC) formats, its identity inextricably linked to one of the market's most popular and enduring morning shows. However, its more recent history serves as a powerful case study in the radio industry, illustrating the profound challenges a station faces when the on-air chemistry that defined its brand is disrupted.

**Launch and Early Years as "K-106" (1985-1998)**
KCIX signed on the air on New Year's Day, January 1, 1985. The station launched with an Adult Contemporary (AC) format under the brand "K-106." An early logo for "K-106," archived by the History of Idaho Broadcasting Foundation, featured a stylized depiction of the Idaho Statehouse, grounding its identity in the local community.

**The "Mix 106" Era and Ownership Changes (1998-Present)**
In 1998, the station began a significant evolution, shifting its musical direction toward a more up-tempo Hot Adult Contemporary (Hot AC) format. This change was solidified in 1999 when the station officially rebranded as "Mix 106," dropping most pre-1980s music to focus on hits from the 1980s and 1990s.

**The "Mike and Kate" Dynasty (c. 2002-2016)**
The most successful and defining period in KCIX's history was dominated by its morning show, hosted by the dynamic duo of Mike Kasper and Kate McGwire. The pair, who had previously worked together at competitor KZMG "Magic 93.1," joined Mix 106 in 2002 and quickly became a market institution. Their natural on-air chemistry, a mix of friendly banter and relatable content, was the primary driver of the station's popularity and consistently strong ratings.

The departure of Kate McGwire in January 2016 was a seismic event for the station and its audience. In a heartfelt farewell letter published on the station's website, McGwire described her decision to leave a "dream career" to pursue new adventures, emphasizing the deep bond she and Kasper had formed with their listeners.

**The Post-Kate Era: A Revolving Door (2016-Present)**
Since McGwire's departure, KCIX has struggled to find a stable and successful morning show. The station has "cycled through more than a dozen morning show combinations," a period of constant change that has coincided with a significant decline in ratings.

**Legacy**
The legacy of KCIX is one of a once-dominant Hot AC station that built its brand on the powerful foundation of a beloved, long-running morning show. The "Mike and Kate" era is remembered as a high point in Boise radio, defining the morning commute for a generation of listeners.`
    },
    {
      id: 'KTHI',
      callLetters: 'KTHI',
      frequency: '107.1 FM',
      branding: '107.1 Hank FM',
      synopsis: 'For 22 years, KTHI was a familiar friend to Boise listeners as "107.1 K-Hits". It was the reliable spot on the dial for the classic hits of the 70s and 80s, a dependable soundtrack of rock and pop favorites. But in the world of radio, nothing is forever. In a move that surprised its loyal audience in 2024, the station abruptly flipped formats. After playing a final, fitting R.E.M. song, K-Hits was gone, replaced by the twang of "107.1 Hank FM". This dramatic change transformed the station into a classic country outlet, jumping into a competitive field and starting a brand new chapter. It\'s a perfect story of how corporate strategy can instantly change the sound of a city.',
      fullHistory: `KTHI, broadcasting at 107.1 FM, is a station whose history is characterized by frequent reinvention. Licensed to Caldwell, Idaho, it has served the broader Boise market for over four decades, cycling through numerous formats and brand identities in response to shifting audience tastes and corporate strategies. For 22 years, it was a stable and familiar presence as the classic hits station "107.1 K-Hits." However, a sudden and dramatic format flip in May 2024 to "107.1 Hank FM" marked the beginning of a new chapter, transforming the station into a classic country outlet.

**Early Years as KCID-FM (1983-2002)**
The station first signed on December 1, 1983, with the call letters KCID-FM. Its initial format was country music, branded as "C-107." This country phase lasted for over a decade before the station began a series of rapid-fire format changes in the late 1990s. In 1997, it flipped to a Modern Adult Contemporary (AC) format as "107.1 CID." Just two years later, on May 4, 1999, it shifted again, this time to a mainstream Adult Contemporary format branded as "Star 107.1".

**The "K-Hits" Era (2002-2024)**
In 2002, the station underwent its most significant and longest-lasting transformation. The call letters were changed to KTHI (a nod to the new "K-Hits" branding), and the format was flipped to classic hits. As "107.1 K-Hits," the station became a fixture on the Boise dial for 22 years, playing a familiar mix of rock and pop hits from the 1970s and 1980s. Artists like Elton John, The Eagles, Queen, and Billy Joel were staples of its playlist.

**The 2024 "Hank FM" Flip**
On May 6, 2024, the 22-year run of "K-Hits" came to an abrupt end. Following a weekend of stunting with songs themed around "change," and after playing R.E.M.'s "It's the End of the World as We Know It (And I Feel Fine)," the station flipped formats at 10:00 a.m. It re-emerged as "107.1 Hank FM," adopting a classic country format. The first song played on "Hank FM" was "It's Five O'Clock Somewhere" by Alan Jackson and Jimmy Buffett.

**Public Reaction**
The sudden demise of "K-Hits" in May 2024 generated a strong and immediate reaction from its audience, illustrating the powerful connection listeners can form with a long-standing station. An article in the Idaho Statesman captured the sentiment, quoting a listener's Facebook comment that simply read, "What the HELL???!?!?!?"

**Legacy**
KTHI's legacy is one of adaptability and, for over two decades, stability. As "107.1 K-Hits," it provided a consistent and familiar soundtrack for a generation of Boise listeners who grew up with classic rock and pop. The station's abrupt 2024 flip to "Hank FM" demonstrates the unsentimental nature of modern corporate radio, where ratings performance and strategic alignment can override decades of brand loyalty.`
    },
    {
      id: 'KQXR',
      callLetters: 'KQXR',
      frequency: '100.3 FM',
      branding: '100.3 The X',
      synopsis: 'If you\'re a rock fan in the Treasure Valley, you know "100.3 The X". For nearly three decades, KQXR has been the undisputed champion of all things rock, blasting its powerful signal across the region. The station has evolved with the times, starting as an alternative rock outlet in the 90s and morphing into the active rock powerhouse it is today. But "The X" is more than just a playlist; it\'s a cultural force. It has been a launchpad for local bands, the host of the legendary "X-Fest," and the home of a loyal community of listeners known as the "X Army". With a stable lineup of local DJs who are true fans of the music, KQXR has built a legacy of authenticity that keeps it at the top of its game.',
      fullHistory: `KQXR, branded as "100.3 The X," is the definitive voice of rock music in the Boise metropolitan area. Licensed to Payette, Idaho, the station's powerful 100,000-watt signal blankets the Treasure Valley, making it a dominant force in its format for nearly three decades. Its history reflects the evolution of rock radio itself, from album-oriented rock to hard rock, and finally to the alternative and active rock formats that have defined its modern identity.

**Early Years and Format Evolution**
The station's journey to rock dominance wasn't immediate. It cycled through several formats in its early years, including a brief stint as "Power 100" with a CHR (Contemporary Hit Radio) format, and later as "Pirate Radio 100.3" with an alternative rock format in the early 1990s.

**The Birth of "The X" (1995)**
In 1995, the station found its lasting identity when it rebranded as "100.3 The X" and committed fully to rock music. This rebrand coincided with the grunge and alternative rock explosion of the mid-1990s, positioning the station perfectly to capture the zeitgeist of rock music.

**Programming and Personalities**
KQXR's programming is anchored by a long-running and popular local morning show, "The Morning After with Nic & Big J." The station's on-air lineup features a slate of local DJs, including Jason Drew and Adam, who have become familiar voices to the rock audience in Boise. The stability of its on-air staff stands in contrast to the frequent turnover seen at other stations in the market.

**Community and Local Music Scene**
"The X" has played a vital role in the Treasure Valley's local music scene. The station has a long-standing commitment to featuring local artists, a tradition that continues with its "X-Clusive" local music show and "Stage Left Podcast," which focuses on local music and events.

The station is also the market's primary presenter of rock concerts, with its "X-Fest" being a major annual event. Its concert calendar is consistently filled with shows it presents at venues across the valley, from the Knitting Factory to the Ford Idaho Center Amphitheater.

**The "X Army"**
KQXR maintains a strong public profile as the market's undisputed rock leader. Its branding as "100.3 The X Rocks" is clear and consistent across its on-air and online platforms. The station's long history and stable format have created a deep well of listener loyalty among the "X Army" of listeners.

**Legacy**
The legacy of KQXR is one of consistency, authenticity, and dedication to the rock genre. After a period of identity-seeking in its early years, the station found its voice as "100.3 The X" in 1995 and has not wavered since. It has successfully navigated the changing tides of rock music, evolving from 90s alternative to a modern active rock format while retaining its core audience.`
    },
    {
      id: 'KIDO',
      callLetters: 'KIDO',
      frequency: '580 AM & 107.5 FM',
      branding: 'KIDO Talk Radio',
      synopsis: 'KIDO\'s story is basically the story of radio in Idaho. Its roots go all the way back to a physics classroom at Boise High School in the 1920s, making it the state\'s very first station. For decades, it was a pioneering force, bringing the first national network affiliation to Idaho and growing into a local media empire. But to stay on top, you have to be smart. In 2002, the station made a legendary move, swapping frequencies with its rival KFXD to land on a much more powerful AM signal. This strategic swap cemented its future as the conservative news/talk powerhouse it is today, blending its incredible history with modern political influence and a deep connection to the community.',
      fullHistory: `KIDO, currently branded "KIDO Talk Radio 107.5 FM & 580 AM," stands as a foundational pillar of Idaho broadcasting, representing both the genesis of radio in the state and its modern evolution into a politically influential media entity. Its significance is twofold. Historically, its lineage traces directly back to Idaho's very first licensed radio station, an experimental project born in a high school classroom. In the contemporary landscape, it is the Boise market's premier conservative news/talk voice.

**The Genesis: Boise High School and KFAU (1920-1928)**
The story of KIDO begins not with commercial enterprise, but with academic curiosity. Its origins date to 1920 and the experimental station 7YA, a project of the chemistry and physics department at Boise High School led by teacher Harry Redeker. Following the end of World War I and the lifting of a ban on civilian radio, the school was issued a "Technical and Training School" station license.

On July 18, 1922, the school was granted a limited-commercial license with the call letters KFAU, officially making it Idaho's first licensed radio station. Its impact was immediate; the Idaho Statesman reported on July 30, 1922, that listeners could clearly hear the station throughout the Treasure Valley, in communities from Kuna to Weiser.

**The Phillips/Davidson Era: Building a Broadcasting Empire (1928-1959)**
Under its new private ownership, the station's call letters were changed to KIDO in November 1928, and C.G. Phillips famously adopted the nickname "Kiddo". The Phillips era was one of pioneering achievements. In 1934, KIDO became the first radio station in Idaho to secure an affiliation with a major national network, the National Broadcasting Company (NBC).

Following the sudden death of Curt "Kiddo" Phillips in 1942, his wife Georgia Phillips assumed sole ownership, demonstrating remarkable business acumen and foresight. She hired Walter E. Wagstaff as general manager in 1944 and formally incorporated the station in March 1946. Not content with AM radio, Georgia expanded the company's media footprint by building KIDO-FM and KIDO-TV, both among the first of their kind in Idaho.

**The Great Swap of 2002**
On August 14, 2002, Clear Channel executed a transformative move in the Boise market. The KIDO call letters and its established news/talk format were moved from their historic home at 630 AM to the 580 AM frequency. Simultaneously, the KFXD call letters and its classic country format moved from 580 AM to 630 AM.

This was a purely strategic decision driven by technical realities. The 580 AM facility possessed a significantly more powerful and far-reaching signal, particularly at night. For a talk format that relies on clarity and reach, the 580 AM signal was a vastly superior asset.

**Modern Programming and Community Connection**
The cornerstone of the station's local identity is "Kevin Miller in The Morning," hosted by Kevin Miller since September 2009. Miller is not just a local host but a nationally recognized personality, having been named the National Association of Broadcasters' (NAB) Medium Market Personality of the Year in 2014. His show blends humor, politics, and a conservative outlook, serving as the Treasure Valley's local voice on major issues.

KIDO's connection to the community is exceptionally strong, driven in large part by Miller's tireless public service initiatives. The most visible of these is "Miller's Mission," an annual fundraising event for the Boise Rescue Mission. For one week each year, Miller camps out in front of a local Walmart, broadcasting live and collecting food and monetary donations.

**Legacy**
KIDO's legacy is a story of duality. It is at once the cherished "first station" in Idaho, a pioneer with a century of history, and a modern, highly focused commercial entity that made a calculated business decision in 2002 to sacrifice a piece of its heritage to secure its future.`
    },
    {
      id: 'KFXD',
      callLetters: 'KFXD',
      frequency: '630 AM',
      branding: 'Power 105.5',
      synopsis: 'The station at 630 AM has one of the most fascinating and tangled histories in Boise. For the first 80 years of its life, this was the home of the legendary KIDO. But in 2002, a major frequency swap changed everything. The KIDO brand moved to a more powerful signal, and this frequency became KFXD. It\'s a story of strategic business decisions, powerful signals, and the complex dance of call letters and frequencies that defines modern radio.',
      fullHistory: `The station currently known as KFXD at 630 AM has one of the most complex and intertwined histories in Boise radio, largely due to a significant call letter and format swap that occurred in 2002. Understanding this station requires separating the history of the physical broadcast facility from the intellectual property of the call letters and programming that have occupied it.

**The KIDO Years (1925-2002)**
For the first 77 years of its existence, the 630 AM frequency was home to KIDO, one of Idaho's most storied radio stations. The facility originally signed on as KFXD in 1925, but the KIDO intellectual unit (call letters, programming, and brand) moved to this frequency in the late 1920s and remained there until 2002.

During this period, 630 AM/KIDO was a powerhouse in the Boise market. The station was a pioneer in many respects, being among the first in Idaho to secure a major network affiliation (NBC in 1934) and expanding into television and FM radio in the post-war era. The station's programming evolved over the decades, from its early days of variety programming to music formats and eventually to news/talk.

**The Great Swap of 2002**
On August 14, 2002, Clear Channel Communications executed a strategic move that fundamentally altered the Boise radio landscape. In a complex transaction, the KIDO call letters and news/talk format were moved from 630 AM to 580 AM, while the KFXD call letters and classic country format moved from 580 AM to 630 AM.

This swap was driven by technical considerations. The 580 AM facility had a much more powerful signal, particularly at night, making it better suited for a talk format that relies on wide coverage and clear reception. The 630 AM facility, by contrast, was required to reduce its power significantly after sunset to protect other stations, limiting its nighttime coverage.

**KFXD Era (2002-Present)**
Following the swap, the station at 630 AM adopted the KFXD call letters and continued with a classic country format for several years. However, like many stations in the modern era, it has undergone multiple format changes as ownership groups have sought to find the most profitable programming approach.

The station has cycled through various formats and ownership changes, reflecting the broader trends in radio consolidation and format experimentation. Currently branded as "Power 105.5" (referring to its FM translator frequency), the station continues to serve the Boise market, though with significantly less cultural impact than during its KIDO years.

**Technical Challenges**
One of the ongoing challenges for 630 AM is its technical limitations. As a Class B AM station, it must reduce power dramatically after sunset to protect clear channel stations on the same frequency. This makes it "all-but-unlistenable" in much of its coverage area during nighttime hours, a significant disadvantage in the talk radio format that relies on drive-time and evening listening.

**Legacy**
The legacy of 630 AM is largely tied to its decades as KIDO, when it was a dominant force in Idaho broadcasting. The 2002 frequency swap, while strategically sound from a business perspective, effectively ended the station's role as a major market player. Today, it serves as a reminder of how technical considerations and corporate strategy can reshape the radio landscape, sometimes at the expense of historical continuity.

The story of 630 AM/KFXD illustrates the complex relationship between radio frequencies, call letters, and brand identity in the modern broadcasting industry. While the physical facility continues to broadcast, its golden age as a major market influencer ended with the departure of the KIDO brand in 2002.`
    },
    {
      id: 'KBSU',
      callLetters: 'KBSU',
      frequency: '90.3 FM',
      branding: 'Boise State Public Radio',
      synopsis: 'From a tiny, student-run club broadcasting only to the Boise State campus, KBSU has grown into Idaho\'s most essential non-commercial media organization. Its journey is a fantastic story of evolution. In the 1980s, it was just a small campus station where students learned the ropes. But over the decades, it transformed into a professional operation that serves the entire state with NPR programming, local news, and educational content. Today, it\'s the go-to source for in-depth journalism and thoughtful programming, proving that public radio can thrive even in a conservative market.',
      fullHistory: `KBSU, operating at 90.3 FM and branded as "Boise State Public Radio," represents one of the most significant success stories in Idaho broadcasting. What began as a small, student-operated campus radio station has evolved into the state's premier public radio network, serving not just the Boise State University community but the entire state of Idaho with professional-grade programming and journalism.

**Early Years: Campus Radio Beginnings**
KBSU's origins trace back to the late 1960s and early 1970s when it began as a low-power campus radio station serving only the Boise State University campus. In its earliest incarnation, the station was primarily a training ground for students interested in broadcasting, with programming that reflected the eclectic tastes and experimental nature typical of college radio.

During the 1970s and early 1980s, KBSU operated with minimal power and a limited signal that barely reached beyond the campus boundaries. The station was staffed entirely by volunteers, mostly students who were learning the basics of radio production, on-air presentation, and station management. Programming during this era was a mix of alternative music, student-produced shows, and occasional educational content.

**The Transformation: Becoming Public Radio**
The pivotal transformation of KBSU began in the mid-1980s when the station made the strategic decision to affiliate with National Public Radio (NPR) and adopt a public radio format. This change represented a fundamental shift in the station's mission, moving from a campus-focused operation to a community-serving public media organization.

The transition required significant infrastructure improvements, including increased transmitter power, professional-grade equipment, and the hiring of experienced broadcast professionals. The station also had to meet NPR's stringent technical and programming standards, which necessitated a complete overhaul of its operations.

**Growth and Expansion**
Throughout the 1990s and 2000s, KBSU continued to expand its reach and influence. The station increased its transmitter power to serve a much larger geographic area, eventually covering most of the Treasure Valley and beyond. This expansion allowed KBSU to truly become a regional voice rather than just a campus station.

The station also began developing its own local programming to complement the NPR national shows. This included local news coverage, public affairs programming, and cultural shows that reflected the unique character of Idaho and the Intermountain West.

**Modern Era: Professional Public Media**
Today, KBSU operates as a full-service public radio station that rivals major market public radio operations in terms of programming quality and community impact. The station's daily schedule includes popular NPR programs such as "Morning Edition," "All Things Considered," and "Fresh Air," as well as locally produced content.

The station has developed a strong news operation that covers Idaho politics, environmental issues, and cultural events. This local journalism component has become increasingly important as traditional newspaper coverage has declined in many Idaho communities.

**Educational Mission**
Despite its growth into a professional operation, KBSU has maintained its educational mission. The station continues to provide hands-on training opportunities for Boise State University students through internships and work-study programs. Many graduates of the BSU communication program have gained their first professional experience at KBSU before moving on to careers in broadcasting and journalism.

**Community Impact**
KBSU has become an essential source of information and cultural programming for Idaho residents. During major news events, natural disasters, or political developments, the station serves as a trusted source of in-depth, unbiased reporting. Its programming also provides a platform for local artists, musicians, and cultural organizations that might not otherwise receive media attention.

**Technical Innovation**
The station has embraced new technologies to expand its reach and accessibility. In addition to its traditional FM broadcast, KBSU streams its programming online and has developed a mobile app, allowing listeners throughout Idaho and beyond to access its programming. The station has also experimented with podcasting and other digital media formats to reach younger audiences.

**Funding and Support**
As a public radio station, KBSU relies on a combination of funding sources, including university support, listener donations, corporate underwriting, and grants from the Corporation for Public Broadcasting. The station conducts regular pledge drives to maintain its financial independence and ensure its ability to provide commercial-free programming.

**Legacy and Future**
KBSU's evolution from a small campus radio station to Idaho's premier public radio network represents a remarkable transformation that reflects both the changing media landscape and the growing sophistication of Idaho's cultural and educational institutions. The station has proven that public radio can thrive even in politically conservative markets by focusing on quality journalism, educational content, and community service.

As traditional commercial radio continues to consolidate and automate, KBSU's commitment to local programming and community engagement becomes increasingly valuable. The station serves as a model for how public media can adapt and grow while maintaining its core mission of education and public service.`
    },
    {
      id: 'KGEM',
      callLetters: 'KGEM',
      frequency: '1140 AM',
      branding: 'Salt & Light Catholic Radio',
      synopsis: 'KGEM is a station of two completely different eras. For over 60 years, it was a familiar commercial voice in Boise, a place on the AM dial for music and entertainment. In the early 2000s, it was known for its creative and humorous approach to radio, making it a beloved local institution. But in 2009, everything changed when the station was transformed into Catholic radio. This dramatic shift turned KGEM into "Salt & Light Catholic Radio," serving the spiritual needs of the Catholic community with religious programming, prayer, and educational content.',
      fullHistory: `KGEM, broadcasting at 1140 AM, represents one of the most dramatic format transformations in Boise radio history. For over six decades, it operated as a commercial music and entertainment station, building a loyal following through various formats and personalities. However, in 2009, the station underwent a complete transformation, becoming "Salt & Light Catholic Radio" and shifting its mission from commercial entertainment to religious education and spiritual programming.

**Early Commercial Years**
KGEM first signed on the air in the late 1940s as part of the post-World War II expansion of radio broadcasting. During its early decades, the station operated with various music formats typical of AM radio in the mid-20th century, including middle-of-the-road (MOR) music, adult contemporary, and later, oldies formats.

Throughout the 1960s, 1970s, and 1980s, KGEM served as a reliable presence on the Boise AM dial, competing with other local stations for audience share in an increasingly crowded market. The station's programming reflected the changing tastes of American radio listeners, evolving from the big band and pop standards of its early years to more contemporary formats as rock and pop music gained prominence.

**The Creative Era: 1990s-2000s**
During the 1990s and early 2000s, KGEM gained particular recognition for its creative and often humorous approach to radio programming. The station developed a reputation for innovative promotions, clever on-air personalities, and a willingness to take programming risks that larger, corporate-owned stations might avoid.

This period represented the station's golden age in terms of local recognition and community engagement. KGEM's personalities became well-known figures in the Boise community, and the station's promotions and events often generated significant local media attention. The station's approach during this era reflected the entrepreneurial spirit of independent radio, where creativity and local connection could compete effectively against larger, more heavily funded competitors.

**The Transition Period**
By the mid-2000s, KGEM, like many small-market AM stations, faced increasing economic pressures. The rise of FM radio, satellite radio, and early digital media platforms had significantly eroded the audience for traditional AM music formats. Additionally, the consolidation of radio ownership had made it increasingly difficult for independent stations to compete for advertising revenue against large corporate clusters.

These market pressures led to a period of uncertainty for KGEM, with ownership exploring various options for the station's future. The economic challenges facing AM radio were particularly acute for music-formatted stations, as listeners increasingly preferred the superior sound quality of FM for music programming.

**The Catholic Radio Transformation (2009)**
In 2009, KGEM underwent its most significant transformation when it was acquired by the Catholic Diocese of Boise and converted to a Catholic radio format. The station was rebranded as "Salt & Light Catholic Radio," taking its name from Jesus's description of his followers in the Sermon on the Mount (Matthew 5:13-16).

This transformation represented a complete philosophical shift for the station. Rather than operating as a commercial enterprise focused on entertainment and advertising revenue, KGEM became a ministry tool focused on evangelization, education, and spiritual formation within the Catholic community.

**Programming and Mission**
As "Salt & Light Catholic Radio," KGEM's programming consists primarily of Catholic-focused content, including:

- Daily Mass broadcasts
- Catholic talk shows and call-in programs
- Educational programming about Catholic doctrine and history
- Prayer services and devotional programming
- Catholic music and hymns
- Local programming addressing issues of interest to Idaho Catholics

The station also carries programming from national Catholic radio networks, including EWTN (Eternal Word Television Network) Radio and other Catholic media organizations. This allows KGEM to offer both local and national perspectives on Catholic issues and teachings.

**Community Role**
Since its transformation, KGEM has served as an important communication tool for the Catholic community in Idaho. The station provides information about diocesan events, parish activities, and Catholic social services. During major Catholic celebrations and observances, KGEM offers special programming and live coverage of local Catholic events.

The station has also become a resource for Catholic education, offering programming that helps listeners deepen their understanding of Catholic teachings and traditions. This educational mission extends beyond entertainment to include serious theological and philosophical discussions.

**Technical and Coverage Considerations**
Operating on 1140 AM, KGEM faces the same technical challenges as other AM stations, including limited nighttime coverage due to FCC regulations designed to protect clear channel stations. However, the station's religious format is somewhat less dependent on drive-time listening patterns than commercial music stations, as religious programming often serves different listening habits and purposes.

**Legacy and Impact**
The transformation of KGEM from commercial radio to Catholic radio reflects broader trends in American broadcasting, including the challenges facing traditional AM radio and the growth of religious media. The station's conversion also demonstrates how religious organizations have adapted to use traditional broadcast media for evangelization and community building.

For longtime Boise radio listeners, KGEM's transformation represents the end of an era of creative, independent commercial radio. However, for the Catholic community in Idaho, the station's new mission has provided a valuable resource for spiritual growth and community connection.

**Future Considerations**
As "Salt & Light Catholic Radio," KGEM continues to serve its specialized audience while adapting to changing media consumption patterns. Like other radio stations, KGEM has expanded its reach through online streaming and digital platforms, allowing it to serve Catholics throughout Idaho and beyond who may not be within its traditional broadcast coverage area.

The station's success in its religious format demonstrates that specialized programming can find and serve dedicated audiences, even in an increasingly fragmented media landscape. KGEM's transformation from commercial entertainment to religious ministry represents one of the most complete reinventions in Boise radio history.`
    },
    {
      id: 'KBOI',
      callLetters: 'KBOI',
      frequency: '670 AM',
      branding: 'News/Talk/Sports',
      synopsis: 'With a booming 50,000-watt signal that can be heard for hundreds of miles, KBOI is a true giant of Idaho broadcasting. For over 75 years, it has been a trusted source for news, talk, and sports. The station began its life as KDSH in 1947, but it was the transformation to KBOI that really defined its legacy. From hosting legendary personalities to being the flagship home of Boise State Broncos sports, KBOI has consistently been at the center of major events and conversations in Idaho. Its powerful signal and deep community connections have made it an institution that transcends simple radio entertainment.',
      fullHistory: `KBOI, broadcasting at 670 AM with a powerful 50,000-watt signal, stands as one of Idaho's most influential and far-reaching radio stations. For over seven decades, it has served as a primary source of news, talk, and sports programming for the Treasure Valley and much of the Intermountain West. The station's powerful signal, which can be heard across multiple states, combined with its long history of community involvement and major market personalities, has established KBOI as a true giant in Idaho broadcasting.

**Early Years: KDSH (1947-1960s)**
The station first signed on the air in 1947 with the call letters KDSH. During its early years, KDSH operated with a full-service format typical of major market AM stations in the post-World War II era. This included a mix of music, news, sports, and local programming designed to serve the growing Boise metropolitan area.

The station's powerful 50,000-watt signal was a significant advantage from the beginning, allowing it to reach far beyond the Treasure Valley to serve rural communities throughout Idaho and neighboring states. This extensive coverage area made KDSH an important source of information and entertainment for listeners across a vast geographic region.

**The KBOI Era Begins**
The transformation to KBOI marked the beginning of the station's most significant period of growth and influence. The new call letters, clearly identifying the station with Boise, reflected a strategic decision to embrace its role as the flagship station for Idaho's capital city and largest metropolitan area.

During the 1960s and 1970s, KBOI evolved into a major market news/talk operation, competing directly with other significant AM stations in the region. The station's programming began to focus more heavily on news, public affairs, and talk programming, moving away from the music-heavy formats that had characterized its early years.

**Sports Broadcasting Legacy**
One of KBOI's most significant and enduring contributions to Idaho broadcasting has been its role as the flagship station for Boise State University athletics. The station has been the radio home of Boise State Broncos football and basketball for decades, providing play-by-play coverage that has reached fans throughout the region.

The station's sports coverage has been particularly important during Boise State's rise to national prominence in college football. KBOI's powerful signal has allowed Broncos fans throughout the Intermountain West to follow their team's games, contributing to the development of a regional fan base that extends far beyond the Treasure Valley.

In addition to Boise State athletics, KBOI has provided coverage of other local and regional sports, including high school athletics, professional sports, and major sporting events of interest to Idaho listeners.

**News and Talk Programming**
Throughout its history, KBOI has maintained a strong commitment to news and public affairs programming. The station has covered major local, state, and national events, often serving as a primary source of information during breaking news situations and emergencies.

The station's talk programming has featured both local and nationally syndicated shows, providing a platform for discussion of political, social, and economic issues affecting Idaho and the region. KBOI's talk shows have often featured prominent local and state political figures, making the station an important venue for political discourse in Idaho.

**Personalities and Community Connection**
Over the decades, KBOI has been home to numerous prominent radio personalities who have become well-known figures in the Idaho broadcasting landscape. These personalities have often extended their influence beyond radio, becoming involved in community events, charitable causes, and local business ventures.

The station's long history has allowed it to develop deep connections within the Idaho community, with many listeners developing decades-long relationships with KBOI personalities and programming. This community connection has been a key factor in the station's continued relevance and influence.

**Technical Advantages**
KBOI's 50,000-watt signal represents one of the most powerful radio signals in the Intermountain West. This technical advantage has allowed the station to maintain its influence even as the radio industry has faced challenges from new media platforms and changing listening habits.

The station's signal strength is particularly valuable for news and talk programming, as it allows KBOI to serve as a regional information source during major news events, natural disasters, and other situations where reliable communication is essential.

**Ownership and Corporate Changes**
Like most major market radio stations, KBOI has experienced multiple ownership changes over the decades, reflecting broader trends in radio industry consolidation. These ownership changes have sometimes resulted in programming adjustments and staff changes, but the station has generally maintained its core identity as a news/talk/sports operation.

**Modern Era Challenges and Adaptations**
In recent years, KBOI has faced the same challenges as other traditional radio stations, including competition from digital media, satellite radio, and streaming services. However, the station's focus on local news, sports, and talk programming has provided some insulation from these challenges, as local content remains difficult for national digital platforms to replicate.

The station has adapted to changing media consumption patterns by expanding its digital presence, including online streaming and social media engagement. These digital platforms have allowed KBOI to maintain its connection with listeners who may not always be able to listen to traditional radio broadcasts.

**Legacy and Continuing Influence**
KBOI's legacy as a major force in Idaho broadcasting is secure, built on decades of community service, sports coverage, and news programming. The station's powerful signal and long history have made it an institution that transcends simple entertainment, serving as a vital communication link for communities throughout the Intermountain West.

As the media landscape continues to evolve, KBOI's combination of powerful signal coverage, local programming focus, and deep community connections positions it to remain a significant force in Idaho broadcasting. The station's role as the radio voice of Boise State athletics alone ensures its continued relevance to thousands of fans throughout the region.

**Future Prospects**
Looking forward, KBOI's success will likely depend on its ability to maintain its local programming focus while adapting to new media technologies and changing listener preferences. The station's powerful signal and established brand recognition provide significant advantages, but continued investment in local content and community engagement will be essential for maintaining its position as a leading voice in Idaho broadcasting.

The station's long history of adapting to changing circumstances while maintaining its core mission suggests that KBOI will continue to play an important role in Idaho's media landscape for years to come.`
    }
  ]

  const toggleExpanded = (stationId) => {
    setExpandedStation(expandedStation === stationId ? null : stationId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><rect fill="%23333" width="1200" height="400"/><circle fill="%23666" cx="200" cy="200" r="80"/><circle fill="%23666" cx="600" cy="150" r="60"/><circle fill="%23666" cx="1000" cy="250" r="70"/><rect fill="%23555" x="100" y="300" width="200" height="80" rx="10"/><rect fill="%23555" x="500" y="320" width="200" height="60" rx="10"/><rect fill="%23555" x="900" y="310" width="200" height="70" rx="10"/></svg>')`
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Idaho Radio History</h1>
          <p className="text-xl italic">an adventure in evolution!</p>
        </div>
      </div>

      {/* Station Cards Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <div key={station.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Station Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
                <h3 className="text-xl font-bold">{station.callLetters}</h3>
                <p className="text-blue-100">{station.branding}</p>
              </div>

              {/* Station Content */}
              <div className="p-4">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {station.synopsis}
                </p>

                {/* Expandable Full History */}
                {expandedStation === station.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Complete Station History</h4>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
                      {station.fullHistory}
                    </div>
                  </div>
                )}

                {/* Toggle Button */}
                <button
                  onClick={() => toggleExpanded(station.id)}
                  className={`w-full mt-4 px-4 py-2 rounded font-medium transition-colors ${
                    expandedStation === station.id
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {expandedStation === station.id ? 'Close Full History' : 'Read Full History'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white text-center py-8">
        <p className="text-lg mb-2">© 2025 History of Idaho Broadcasting Foundation. All rights reserved.</p>
        <p className="text-gray-400">Preserving Idaho's broadcasting heritage for future generations.</p>
      </div>
    </div>
  )
}

export default RadioPage

