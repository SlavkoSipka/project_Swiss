'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { User, Edit, Eye, Heart, MessageSquare, Settings, LogOut, Upload, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    views: 0,
    favorites: 0,
    messages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const supabase = createClient()
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profileData)

      // Get stats if model
      if (profileData?.role === 'model') {
        // Views
        const { count: viewsCount } = await supabase
          .from('profile_views')
          .select('*', { count: 'exact', head: true })
          .eq('model_id', user.id)
        
        // Favorites
        const { count: favCount } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .eq('model_id', user.id)
        
        // Messages
        const { count: msgCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('is_read', false)

        setStats({
          views: viewsCount || 0,
          favorites: favCount || 0,
          messages: msgCount || 0,
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50/30 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 shadow-lg"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/30 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-large p-8 mb-8 border border-gray-100 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-pink-100">
                {profile?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome, {profile?.username || 'User'}!
                </h1>
                <p className="text-gray-600 mt-1 font-medium">
                  {profile?.role === 'model' ? 'Model Account' : 
                   profile?.role === 'company' ? 'Company Account' : 
                   'Member Account'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats for Models */}
        {profile?.role === 'model' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-large p-6 border border-blue-200 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-semibold mb-2">Profile Views</p>
                  <p className="text-4xl font-bold text-blue-900">{stats.views}</p>
                </div>
                <div className="bg-blue-500 rounded-xl p-3 shadow-lg">
                  <Eye className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl shadow-large p-6 border border-pink-200 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-700 text-sm font-semibold mb-2">Favorites</p>
                  <p className="text-4xl font-bold text-pink-900">{stats.favorites}</p>
                </div>
                <div className="bg-pink-500 rounded-xl p-3 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-large p-6 border border-purple-200 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 text-sm font-semibold mb-2">Unread Messages</p>
                  <p className="text-4xl font-bold text-purple-900">{stats.messages}</p>
                </div>
                <div className="bg-purple-500 rounded-xl p-3 shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-large p-8 border border-gray-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile?.role === 'model' && (
              <>
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-4 p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 rounded-2xl hover:border-pink-400 hover:shadow-lg transition-all group card-hover"
                >
                  <div className="bg-pink-500 rounded-xl p-3 shadow-md group-hover:scale-110 transition-transform">
                    <Edit className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Edit Profile</h3>
                    <p className="text-sm text-gray-600 mt-1">Update your information and services</p>
                  </div>
                </Link>

                <Link
                  href="/photos/upload"
                  className="flex items-center gap-4 p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl hover:border-purple-400 hover:shadow-lg transition-all group card-hover"
                >
                  <div className="bg-purple-500 rounded-xl p-3 shadow-md group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Upload Photos</h3>
                    <p className="text-sm text-gray-600 mt-1">Add new photos to your gallery</p>
                  </div>
                </Link>

                <Link
                  href={`/profile/${user?.id}`}
                  className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all group card-hover"
                >
                  <div className="bg-blue-500 rounded-xl p-3 shadow-md group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">View Public Profile</h3>
                    <p className="text-sm text-gray-600 mt-1">See how others see your profile</p>
                  </div>
                </Link>

                <Link
                  href="/analytics"
                  className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl hover:border-green-400 hover:shadow-lg transition-all group card-hover"
                >
                  <div className="bg-green-500 rounded-xl p-3 shadow-md group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-600 mt-1">View detailed statistics</p>
                  </div>
                </Link>
              </>
            )}

            <Link
              href="/messages"
              className="flex items-center gap-4 p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 rounded-2xl hover:border-pink-400 hover:shadow-lg transition-all group card-hover"
            >
              <div className="bg-pink-500 rounded-xl p-3 shadow-md group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600 mt-1">Check your inbox</p>
              </div>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl hover:border-gray-400 hover:shadow-lg transition-all group card-hover"
            >
              <div className="bg-gray-600 rounded-xl p-3 shadow-md group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600 mt-1">Manage your account settings</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        {profile?.role === 'model' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-large p-8 mt-8 border border-gray-100">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Recent Activity
            </h2>
            <div className="text-center text-gray-500 py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <p className="text-lg font-medium">No recent activity yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

