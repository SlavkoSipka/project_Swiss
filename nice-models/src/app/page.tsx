'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getAllProfiles, getPrimaryPhoto, type Profile } from '@/lib/api/profiles'
import AreasSidebar from '@/components/home/AreasSidebar'
import StoriesSection from '@/components/home/StoriesSection'
import FilterBar from '@/components/home/FilterBar'
import RightSidebar from '@/components/home/RightSidebar'
import { Video } from 'lucide-react'

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<any>({})
  const pageSize = 24

  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true)
      const result = await getAllProfiles(page, pageSize)
      setProfiles(result.profiles)
      setTotal(result.total)
      setLoading(false)
    }

    fetchProfiles()
  }, [page, filters])

  // Default image for profiles without photos
  const defaultImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop'

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/30 to-white">
      {/* Main Content Container */}
      <div className="mx-auto px-4 py-6 max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Areas */}
          <div className="lg:col-span-2">
            <AreasSidebar />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-7">
            {/* Stories Section */}
            <StoriesSection />

            {/* Filter Bar */}
            <FilterBar onFilterChange={setFilters} />

            {/* Results Header */}
            <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-soft border border-gray-100">
              <p className="text-sm text-gray-700">
                Showing <span className="font-bold text-pink-600">{profiles.length}</span> of{' '}
                <span className="font-bold text-gray-900">{total}</span> results
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 shadow-lg"></div>
                <p className="mt-6 text-gray-600 font-medium">Loading profiles...</p>
              </div>
            )}

            {/* Profiles Grid */}
            {!loading && (
              <>
                {profiles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-600">No profiles found.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 mb-4">
                      {profiles.map((profile) => {
                        let photoUrl = profile.photos && profile.photos.length > 0 
                          ? getPrimaryPhoto(profile.photos) 
                          : defaultImage
                        
                        // Use default image if this image previously failed to load
                        if (failedImages.has(profile.id)) {
                          photoUrl = defaultImage
                        }

                        // Get short description (slogan or bio excerpt)
                        const shortDesc = profile.model_details?.bio 
                          ? profile.model_details.bio.length > 40 
                            ? profile.model_details.bio.substring(0, 40) + '...'
                            : profile.model_details.bio
                          : null
                        
                        return (
                          <Link
                            key={profile.id}
                            href={`/profile/${profile.id}`}
                            className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 m-2 border border-gray-100 card-hover"
                          >
                            {/* Image Container */}
                            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-200">
                              <img
                                src={photoUrl}
                                alt={profile.full_name || profile.username || 'Model'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  // Fallback to default image if loading fails
                                  const target = e.target as HTMLImageElement
                                  if (target.src !== defaultImage) {
                                    target.src = defaultImage
                                  }
                                  setFailedImages(prev => new Set(prev).add(profile.id))
                                }}
                              />
                              
                              {/* NEW Badge */}
                              {profile.created_at && (() => {
                                const createdAt = new Date(profile.created_at)
                                const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
                                if (daysSinceCreation < 7) {
                                  return (
                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg animate-pulse-glow">
                                      NEW
                                    </div>
                                  )
                                }
                                return null
                              })()}

                              {/* Video/Chat Icon - bottom right (always visible like on image) */}
                              <div className="absolute bottom-2 right-2">
                                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-1.5 shadow-lg group-hover:scale-110 transition-transform">
                                  <Video className="w-3 h-3 text-white" />
                                </div>
                              </div>
                            </div>

                            {/* Profile Info */}
                            <div className="p-2.5 bg-gradient-to-b from-white to-gray-50">
                              <h3 className="font-bold text-gray-900 text-[13px] truncate group-hover:text-pink-600 transition-colors">
                                {profile.full_name || profile.username || 'Model'}
                              </h3>
                              <p className="text-[11px] text-gray-600 mt-1 truncate flex items-center">
                                <span className="w-1 h-1 bg-pink-500 rounded-full mr-1.5"></span>
                                {profile.model_details?.location_city || 'Unknown'}
                              </p>
                              {shortDesc && (
                                <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                                  {shortDesc}
                                </p>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white shadow-soft"
                        >
                          ←
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-soft ${
                                page === pageNum
                                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-glow scale-110'
                                  : 'border-2 border-gray-200 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}

                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white shadow-soft"
                        >
                          →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
