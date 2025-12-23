import Link from 'next/link'
import { MapPin, Star, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { getFeaturedProfiles, getPrimaryPhoto, getModelRating } from '@/lib/api/profiles'

export default async function FeaturedProfiles() {
  // Fetch real data from Supabase
  const profiles = await getFeaturedProfiles(4)

  // Get ratings for each profile
  const profilesWithRatings = await Promise.all(
    profiles.map(async (profile) => {
      const rating = await getModelRating(profile.id)
      return {
        ...profile,
        rating: rating.rating,
        reviewCount: rating.count,
      }
    })
  )

  // If no profiles found, show placeholder
  if (profiles.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured <span className="text-pink-600">Models</span>
          </h2>
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl">No featured profiles yet.</p>
            <p className="mt-2">Check back soon for new models!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">
            Featured <span className="text-pink-600">Models</span>
          </h2>
          <Link
            href="/search"
            className="text-pink-600 hover:text-pink-700 font-semibold flex items-center"
          >
            View All
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profilesWithRatings.map((profile) => (
            <Link
              key={profile.id}
              href={`/profile/${profile.id}`}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <Image
                  src={getPrimaryPhoto(profile.photos)}
                  alt={profile.full_name || 'Model'}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {profile.is_verified && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition">
                      {profile.full_name || 'Model'}, {profile.model_details?.age || '?'}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.model_details?.location_city || 'Unknown'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-pink-600">
                      ${profile.model_details?.price_per_hour || 0}
                    </div>
                    <div className="text-xs text-gray-500">per hour</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-semibold">{profile.rating || '0.0'}</span>
                  <span className="ml-1">({profile.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

