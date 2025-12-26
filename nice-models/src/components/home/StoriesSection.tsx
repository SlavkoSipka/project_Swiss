'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getAllProfiles, getPrimaryPhoto, type Profile } from '@/lib/api/profiles'

export default function StoriesSection() {
  const [stories, setStories] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStories() {
      setLoading(true)
      // Get recent profiles (as stories - in real app, you'd have a stories table)
      const result = await getAllProfiles(1, 15)
      setStories(result.profiles)
      setLoading(false)
    }
    fetchStories()
  }, [])

  const defaultImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop'

  const formatTimeAgo = (date: Date) => {
    const now = Date.now()
    const diff = now - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) {
      return `${seconds} seconds ago`
    } else if (minutes < 60) {
      return `${minutes} minutes ago`
    } else if (hours < 24) {
      return `${hours} hours ago`
    } else {
      return `${Math.floor(hours / 24)} days ago`
    }
  }

  if (loading) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Stories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Stories</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {stories.map((profile) => {
          const photoUrl = profile.photos && profile.photos.length > 0 
            ? getPrimaryPhoto(profile.photos) 
            : defaultImage
          
          const createdAt = profile.created_at ? new Date(profile.created_at) : new Date()
          const timeText = formatTimeAgo(createdAt)

          return (
            <Link
              key={profile.id}
              href={`/profile/${profile.id}`}
              className="flex-shrink-0 flex flex-col items-center group"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500 group-hover:border-pink-600 transition">
                <Image
                  src={photoUrl}
                  alt={profile.full_name || 'Story'}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center max-w-[64px] truncate font-medium">
                {profile.full_name || profile.username || 'Model'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{timeText}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
