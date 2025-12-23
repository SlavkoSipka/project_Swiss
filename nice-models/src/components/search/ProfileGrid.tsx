'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, CheckCircle, Heart, MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { searchProfiles, getPrimaryPhoto, getModelRating, type Profile } from '@/lib/api/profiles'

export default function ProfileGrid() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true)
      const result = await searchProfiles({}, 1, 12)
      
      // Get ratings for each profile
      const profilesWithRatings = await Promise.all(
        result.profiles.map(async (profile) => {
          const rating = await getModelRating(profile.id)
          return {
            ...profile,
            rating: rating.rating,
            reviewCount: rating.count,
          }
        })
      )
      
      setProfiles(profilesWithRatings as any)
      setTotal(result.total)
      setLoading(false)
    }

    fetchProfiles()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <p className="mt-4 text-gray-600">Loading profiles...</p>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No profiles found.</p>
        <p className="mt-2 text-gray-500">Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{profiles.length}</span> of <span className="font-semibold">{total}</span> results
        </p>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
          <option>Most Recent</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Top Rated</option>
          <option>Most Reviewed</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-80 overflow-hidden bg-gray-200">
              <Image
                src={getPrimaryPhoto(profile.photos)}
                alt={profile.full_name || 'Model'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                <div className="space-y-2">
                  {profile.is_verified && (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                <button className="bg-white/90 hover:bg-white p-2 rounded-full transition">
                  <Heart className="w-5 h-5 text-pink-500" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <button className="flex-1 bg-white text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </button>
                  <Link
                    href={`/profile/${profile.id}`}
                    className="flex-1 bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition text-center"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <Link
                    href={`/profile/${profile.id}`}
                    className="text-xl font-bold text-gray-800 hover:text-pink-600 transition"
                  >
                    {profile.full_name || 'Model'}, {profile.model_details?.age || '?'}
                  </Link>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profile.model_details?.location_city || 'Unknown'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-pink-600">
                    ${profile.model_details?.price_per_hour || 0}
                  </div>
                  <div className="text-xs text-gray-500">per hour</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-semibold">{(profile as any).rating || '0.0'}</span>
                <span className="ml-1">({(profile as any).reviewCount || 0})</span>
              </div>

              {/* Services Tags */}
              <div className="flex flex-wrap gap-2">
                {profile.model_details?.services?.slice(0, 3).map((service) => (
                  <span
                    key={service}
                    className="px-2 py-1 bg-pink-50 text-pink-600 text-xs rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Previous
          </button>
          <button className="px-4 py-2 bg-pink-500 text-white rounded-lg">1</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">2</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">3</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}

