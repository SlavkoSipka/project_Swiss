'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getAllProfiles, getPrimaryPhoto, type Profile } from '@/lib/api/profiles'

export default function RightSidebar() {
  const [availableChats, setAvailableChats] = useState<Profile[]>([])
  const [statusMessages, setStatusMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      // Get some profiles for chat (in real app, you'd filter by online status)
      const result = await getAllProfiles(1, 10)
      setAvailableChats(result.profiles.slice(0, 1))
      
      // Mock status messages (in real app, you'd have a status_messages table)
      const statusData = result.profiles.slice(0, 6).map((profile, index) => ({
        id: profile.id,
        name: profile.full_name || profile.username || 'Model',
        time: index === 0 ? '37 minutes ago' : 
              index === 1 ? '37 minutes ago' :
              index === 2 ? '44 minutes ago' :
              index === 3 ? '44 minutes ago' :
              index === 4 ? '44 minutes ago' :
              'an hour ago',
        message: profile.model_details?.bio || `Status message from ${profile.full_name || 'Model'}`
      }))
      setStatusMessages(statusData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const defaultImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop'

  return (
    <aside className="w-full lg:w-64 space-y-4">
      {/* Available for 1:1 Chat */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-bold text-gray-800 mb-3">Available for 1:1 Chat</h3>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            {availableChats.map((profile) => {
              const photoUrl = profile.photos && profile.photos.length > 0 
                ? getPrimaryPhoto(profile.photos) 
                : defaultImage
              
              return (
                <Link
                  key={profile.id}
                  href={`/profile/${profile.id}`}
                  className="flex items-center gap-3 p-2 hover:bg-pink-50 rounded-lg transition group"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={photoUrl}
                      alt={profile.full_name || 'Chat'}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate group-hover:text-pink-600">
                      {profile.full_name || profile.username || 'Model'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {profile.model_details?.location_city || 'Unknown'}
                    </p>
                  </div>
                </Link>
              )
            })}
            <Link
              href="/chats"
              className="block mt-3 text-center px-4 py-2 bg-pink-500 text-white rounded text-xs font-semibold hover:bg-pink-600 transition"
            >
              View All Chats
            </Link>
          </>
        )}
      </div>

      {/* Latest status messages */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-bold text-gray-800 mb-3">Latest status messages</h3>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {statusMessages.map((status) => (
                <div key={status.id} className="bg-pink-50 rounded p-2">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-xs text-gray-800">{status.name}</p>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-2">{status.time}</p>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-2">{status.message}</p>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="mt-3 flex items-center justify-center gap-1">
              <button className="px-2 py-1 bg-pink-500 text-white rounded text-xs">1</button>
              <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">2</button>
              <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">3</button>
              <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">→</button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
