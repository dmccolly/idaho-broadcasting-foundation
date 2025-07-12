export const metadata = {
  title: 'The Back Corner - Idaho Broadcasting Foundation',
  description: 'Behind-the-scenes stories, technical insights, and professional broadcasting tools.',
}

import VoxProPlayer from '@/components/broadcasting/voxpro-player'
import KeyAssignments from '@/components/broadcasting/key-assignments'

export default function BackCorner() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">The Back Corner - Updated</h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Welcome to The Back Corner, where we share behind-the-scenes stories, technical insights, 
              and community highlights from our broadcasting studio. This is your normal article space 
              where you can add any content - blog posts, news updates, photo galleries, or documentation.
            </p>
          </div>
        </div>
      </section>

      {/* VoxPro Media Player Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <VoxProPlayer />
            <KeyAssignments />
          </div>
        </div>
      </section>

      {/* Latest Stories Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Latest Stories</h2>
          
          <div className="space-y-12">
            {/* Article 1 */}
            <article className="border-b border-gray-200 pb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Behind the Microphone: A Day in the Life
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Ever wondered what happens when the "ON AIR" light goes off? Join us for an exclusive 
                look behind the scenes of our daily broadcasting operations, from early morning prep 
                to late-night sign-off.
              </p>
              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <span className="flex items-center">
                  📅 June 28, 2025
                </span>
                <span className="flex items-center">
                  👤 Radio Team
                </span>
              </div>
            </article>

            {/* Article 2 */}
            <article className="border-b border-gray-200 pb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Technical Spotlight: VoxPro Broadcasting System
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our state-of-the-art VoxPro media control system enables seamless live broadcasting 
                with professional-grade audio management. The compact interface you see on this page 
                represents just a fraction of the system's capabilities.
              </p>
              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <span className="flex items-center">
                  📅 June 27, 2025
                </span>
                <span className="flex items-center">
                  👤 Engineering Team
                </span>
              </div>
            </article>

            {/* Article 3 */}
            <article className="border-b border-gray-200 pb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Community Voices: Listener Stories
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                From heartwarming thank-you messages to exciting contest wins, discover the amazing 
                stories from our listening community. These are the moments that make broadcasting 
                truly special.
              </p>
              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <span className="flex items-center">
                  📅 June 26, 2025
                </span>
                <span className="flex items-center">
                  👤 Community Team
                </span>
              </div>
            </article>
          </div>

          {/* Add Content Section */}
          <div className="mt-16 bg-blue-50 rounded-lg p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              📝 Add Your Content Here
            </h4>
            <p className="text-gray-700 leading-relaxed">
              This space functions like any other article page on your site. Replace this content 
              with your actual articles, news, or any other containers you need.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

