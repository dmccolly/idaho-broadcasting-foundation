export const metadata = {
  title: 'Idaho Broadcasting Foundation - Supporting Excellence in Broadcasting',
  description: 'Supporting broadcasting excellence across Idaho through education, resources, and community engagement.',
}

import Hero from '@/components/hero-home'
import FeaturesBlocks from '@/components/features-blocks'
import VoxProPlayer from '@/components/broadcasting/voxpro-player'
import KeyAssignments from '@/components/broadcasting/key-assignments'
import Stats from '@/components/stats'
import Cta from '@/components/cta'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesBlocks />
      
      {/* Broadcasting Tools Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Broadcasting Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access our state-of-the-art VoxPro media control system and explore our extensive library of broadcasting content.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <VoxProPlayer />
            <KeyAssignments />
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Broadcasting Events */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Broadcasting Events</h3>
              <p className="text-gray-600 mb-4">
                Join our conferences, workshops, and seminars designed for broadcasting professionals.
              </p>
              <a
                href="/events"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View Events →
              </a>
            </div>

            {/* The Back Corner */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">The Back Corner</h3>
              <p className="text-gray-600 mb-4">
                Explore our interactive broadcasting tools and resources.
              </p>
              <a
                href="/back-corner"
                className="inline-flex items-center text-red-600 hover:text-red-800 font-medium"
              >
                Explore Tools →
              </a>
            </div>

            {/* News & Updates */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">News & Updates</h3>
              <p className="text-gray-600 mb-4">
                Stay informed with the latest broadcasting news and foundation updates.
              </p>
              <a
                href="/news"
                className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
              >
                Read News →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Stats />
      <Cta />
    </>
  )
}

