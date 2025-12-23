import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, CheckCircle } from 'lucide-react'
import { getSimilarProfiles, getPrimaryPhoto, getModelRating } from '@/lib/api/profiles'

interface SimilarProfilesProps {
  currentProfileId: string
  city: string
}

export default async function SimilarProfiles({ currentProfileId, city }: SimilarProfilesProps) {
  // Fetch similar profiles from Supabase
  const profilesData = await getSimilarProfiles(currentProfileId, city, 4)
  
  // Get ratings
  const profiles = await Promise.all(
    profilesData.map(async (profile) => {
      const rating = await getModelRating(profile.id)
      return {
        ...profile,
        rating: rating.rating,
        reviewCount: rating.count,
      }
    })
  )

  if (profiles.length === 0) {
    return null
  }

  // Mock fallback data if no profiles found
  const mockProfiles = [
    {
      id: '2',
      name: 'Laura',
      age: 28,
      city: 'Basel',
      price: 300,
      rating: 5.0,
      reviews: 89,
      verified: true,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop',
    },
    {
      id: '3',
      name: 'Sofia',
      age: 26,
      city: 'Basel',
      price: 280,
      rating: 4.8,
      reviews: 156,
      verified: true,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
    },
    {
      id: '4',
      name: 'Emma',
      age: 24,
      city: 'Basel',
      price: 220,
      rating: 4.9,
      reviews: 203,
      verified: false,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop',
    },
    {
      id: '5',
      name: 'Isabella',
      age: 27,
      city: 'Basel',
      price: 350,
      rating: 4.9,
      reviews: 178,
      verified: true,
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
    },
  ]

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold mb-8">
        Similar Models in <span className="text-pink-600">{city}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(profiles.length > 0 ? profiles : mockProfiles).map((profile) => (
          <Link
            key={profile.id}
            href={`/profile/${profile.id}`}
            className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
          >
            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-gray-200">
              <Image
                src={'image' in profile ? profile.image : getPrimaryPhoto(profile.photos)}
                alt={'name' in profile ? profile.name : profile.full_name || 'Model'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {('verified' in profile ? profile.verified : profile.is_verified) && (
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
                    {'name' in profile ? profile.name : profile.full_name || 'Model'}, {'age' in profile ? profile.age : profile.model_details?.age || '?'}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {'city' in profile ? profile.city : profile.model_details?.location_city || 'Unknown'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-pink-600">
                    ${'price' in profile ? profile.price : profile.model_details?.price_per_hour || 0}
                  </div>
                  <div className="text-xs text-gray-500">per hour</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-semibold">
                  {'rating' in profile ? profile.rating : (profile as any).rating || '0.0'}
                </span>
                <span className="ml-1">
                  ({'reviews' in profile ? profile.reviews : (profile as any).reviewCount || 0})
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

