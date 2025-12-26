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
        <div className="mx-auto max-w-full">
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

        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9">
          {profilesWithRatings.map((profile) => (
            <Link
              key={profile.id}
              href={`/profile/${profile.id}`}
              className="group bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 m-3"
            >
              {/* Image */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-200">
                <Image
                  src={getPrimaryPhoto(profile.photos)}
                  alt={profile.full_name || 'Model'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {profile.is_verified && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white px-1 py-0.5 rounded text-[9px] flex items-center">
                    <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                    Verified
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-1.5">
                <h3 className="font-semibold text-gray-800 text-[12px] truncate">
                  {profile.full_name || 'Model'}
                </h3>
                <p className="text-[10px] text-gray-600 mt-0.5 truncate flex items-center">
                  <MapPin className="w-3 h-3 mr-0.5" />
                  {profile.model_details?.location_city || 'Unknown'}
                </p>
                {profile.rating && (
                  <div className="flex items-center text-[10px] text-gray-600 mt-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-0.5" />
                    <span className="font-semibold">{profile.rating || '0.0'}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

