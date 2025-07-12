import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fezvpmiazbwyzopqprfh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlenZwbWlhemJ3eXpvcHFwcmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODU5NjcsImV4cCI6MjA2NjM2MTk2N30.LCkcftRJUx2qXyD7KjupT_Os-ZV3y2WpaNAZY7rXaFg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is available
export const isSupabaseAvailable = Boolean(supabaseUrl && supabaseAnonKey)

// Types for our broadcasting data
export interface MediaFile {
  id: number
  title: string
  author: string
  date: string
  description: string
  file_type: 'mpeg' | 'mp4' | 'pdf'
  file_url?: string
  key_assignment: number
}

export interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  calendar_url?: string
  map_url?: string
}

export interface Article {
  id: number
  title: string
  content: string
  author: string
  date: string
  excerpt: string
}

// Mock data for development/fallback
export const mockMediaFiles: MediaFile[] = [
  {
    id: 1,
    title: "KJOT/Variety Rock 105.1 Intro/Demo May 10, 2014",
    author: "dm",
    date: "May 10, 2014",
    description: "Not all ideas are created equal - and this was one of them. Okay for a while, but eventually succumbed to the fact that NOBODY would call it Variety Rock. J105 was like a tardigrade; you couldn't kill the thing. Well, I guess JACK could, but it took a while. dm",
    file_type: "mpeg",
    key_assignment: 1
  },
  {
    id: 2,
    title: "Nielsen-Tron The Memo January 18, 2018",
    author: "dm",
    date: "January 18, 2018",
    description: "Once, before the Great Enlightenment, I wrote your typical \"here's what the numbers look like\" memo to staff. But I eventually gave it up in favor of stories. And spin. And the occasional all-in-good-fun whack at a competitor.",
    file_type: "pdf",
    key_assignment: 2
  },
  {
    id: 3,
    title: "Whamco, 5x, NBC/Source Network @1982",
    author: "Stephen B & The Hawk",
    date: "January 1, 1982",
    description: "The pseudo-conglomerate Whamco \"advertised\" in the early '80s, locally on Q104 (AOR). Before there was Billy Mays or Temu, Whamco - conceived by morning team Stephen B and the Hawk from Denver's KBPI - pitched anything as long as it was environmentally irresponsible and unsafe for children.",
    file_type: "mpeg",
    key_assignment: 3
  },
  {
    id: 4,
    title: "KBCI - The X/Gallery Giveaway 1999",
    author: "dm",
    date: "January 1, 1999",
    description: "\"So, what'd I win?\" Most of the time it's the fun and the game, not the prize, except for maybe this one time when 100,3 The X's Byl Carrico, parrot-lover Doug Hardy and first-time program director Jacent Jackson put their heads together and. Well, This. dm",
    file_type: "mp4",
    key_assignment: 4
  },
  {
    id: 5,
    title: "Radio/Television - Sales Promotion Compilation, 2012 - Journal/Scripps",
    author: "Journal/Scripps Team",
    date: "January 1, 2012",
    description: "Broadcast history would've been measured with a second hand if it weren't for revenue. Commercial, promotional; it comes in lots of flavors but it DOESN'T have to be boring. Or the same as the thing we did last month or last year.",
    file_type: "mp4",
    key_assignment: 5
  }
]

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Idaho Broadcasting Conference 2025",
    date: "Friday, August 15, 2025",
    time: "9:00 AM",
    location: "Boise Convention Center",
    description: "Annual conference bringing together broadcasting professionals from across Idaho. Join us for workshops, networking, and the latest industry insights."
  },
  {
    id: 2,
    title: "Radio Production Workshop",
    date: "Sunday, September 21, 2025",
    time: "2:00 PM",
    location: "Idaho State University Media Center",
    description: "Hands-on workshop covering modern radio production techniques, digital editing, and broadcast technology for both beginners and experienced professionals."
  },
  {
    id: 3,
    title: "Digital Broadcasting Seminar",
    date: "Friday, October 10, 2025",
    time: "10:00 AM",
    location: "University of Idaho",
    description: "Explore the future of digital broadcasting, streaming technologies, and emerging trends in the media landscape."
  }
]

// Database functions with fallback to mock data
export async function getMediaFiles(): Promise<MediaFile[]> {
  try {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .order('key_assignment')
    
    if (error) {
      console.warn('Supabase error, using mock data:', error)
      return mockMediaFiles
    }
    
    return data || mockMediaFiles
  } catch (error) {
    console.warn('Supabase connection failed, using mock data:', error)
    return mockMediaFiles
  }
}

export async function getEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date')
    
    if (error) {
      console.warn('Supabase error, using mock data:', error)
      return mockEvents
    }
    
    return data || mockEvents
  } catch (error) {
    console.warn('Supabase connection failed, using mock data:', error)
    return mockEvents
  }
}

export async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) {
      console.warn('Supabase error, using mock data')
      return []
    }
    
    return data || []
  } catch (error) {
    console.warn('Supabase connection failed, using mock data')
    return []
  }
}

