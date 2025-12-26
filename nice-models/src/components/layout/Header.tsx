'use client'

import Link from 'next/link'
import { ChevronDown, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import LanguageSelector from './LanguageSelector'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    
    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkAuth = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    } catch (error) {
      console.error('Error checking auth:', error)
      setIsLoggedIn(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Pink Header Bar */}
      <div className="bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 text-white shadow-large">
        <div className="mx-auto px-4 py-5 max-w-full">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <Link href="/" className="flex flex-col group">
              <span className="text-4xl md:text-5xl font-bold text-white group-hover:scale-105 transition-transform">
                nicemodels.com
              </span>
              <span className="text-sm md:text-base text-pink-100 uppercase tracking-widest font-semibold">
                DAS EROTIKPORTAL
              </span>
            </Link>

            {/* Center - Navigation Links */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link
                href="/new-girls"
                className="px-4 py-2 hover:bg-white/20 backdrop-blur-sm transition-all text-sm font-semibold whitespace-nowrap rounded-xl hover:scale-105 shadow-soft"
              >
                New Girls
              </Link>
              <Link
                href="/girls"
                className="px-4 py-2 hover:bg-white/20 backdrop-blur-sm transition-all text-sm font-semibold whitespace-nowrap rounded-xl hover:scale-105 shadow-soft"
              >
                Girls
              </Link>
              <Link
                href="/trans"
                className="px-4 py-2 hover:bg-white/20 backdrop-blur-sm transition-all text-sm font-semibold whitespace-nowrap rounded-xl hover:scale-105 shadow-soft"
              >
                Trans
              </Link>
              <Link
                href="/escort"
                className="px-4 py-2 hover:bg-white/20 backdrop-blur-sm transition-all text-sm font-semibold whitespace-nowrap rounded-xl hover:scale-105 shadow-soft"
              >
                Escort
              </Link>
              <Link
                href="/search"
                className="px-4 py-2 hover:bg-white/20 backdrop-blur-sm transition-all text-sm font-semibold whitespace-nowrap rounded-xl hover:scale-105 shadow-soft"
              >
                Search
              </Link>
              <Link
                href="/clubs"
                className="px-4 py-2 hover:bg-white/20 backdrop-blur-sm transition-all text-sm font-semibold whitespace-nowrap rounded-xl hover:scale-105 shadow-soft"
              >
                All clubs
              </Link>
              <Link
                href="/comments"
                className="px-4 py-2 hover:bg-white/20 backdrop-blur-sm transition-all text-sm font-semibold whitespace-nowrap rounded-xl hover:scale-105 shadow-soft"
              >
                Comments
              </Link>
              <Link
                href="/videos"
                className="px-4 py-2 hover:bg-white/20 backdrop-blur-sm transition-all text-sm font-semibold whitespace-nowrap rounded-xl hover:scale-105 shadow-soft"
              >
                Videos
              </Link>
              <Link
                href="/cam"
                className="px-4 py-2 hover:bg-white/20 backdrop-blur-sm transition-all text-sm font-semibold whitespace-nowrap rounded-xl hover:scale-105 shadow-soft"
              >
                nicemodels CAM
              </Link>
              
              {/* More Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className="flex items-center gap-1 px-4 py-2 hover:bg-white/20 backdrop-blur-sm transition-all text-sm font-semibold whitespace-nowrap rounded-xl hover:scale-105 shadow-soft"
                >
                  More
                  <ChevronDown className="w-4 h-4" />
                </button>

                {moreMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-md text-gray-800 shadow-large rounded-2xl overflow-hidden border border-gray-200 animate-scale-in">
                    <Link
                      href="/jobs"
                      className="block px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all font-medium"
                      onClick={() => setMoreMenuOpen(false)}
                    >
                      Jobs
                    </Link>
                    <Link
                      href="/rent"
                      className="block px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all font-medium"
                      onClick={() => setMoreMenuOpen(false)}
                    >
                      Rent
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all font-medium"
                      onClick={() => setMoreMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Right - Login/Register/My Profile Buttons & Language */}
            <div className="flex items-center gap-3">
              {!loading && (
                <>
                  {isLoggedIn ? (
                    /* My Profile Button - when logged in */
                    <Link
                      href="/dashboard"
                      className="hidden md:flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all whitespace-nowrap shadow-lg hover:scale-105 border-2 border-white/20"
                    >
                      <User className="w-4 h-4" />
                      MY PROFILE
                    </Link>
                  ) : (
                    <>
                      {/* Login Button */}
                      <Link
                        href="/login"
                        className="hidden md:flex items-center justify-center px-5 py-2.5 bg-white text-pink-600 text-sm font-bold rounded-xl hover:bg-pink-50 transition-all whitespace-nowrap shadow-lg hover:scale-105 border-2 border-white/20"
                      >
                        LOG IN
                      </Link>
                      
                      {/* Register Button */}
                      <Link
                        href="/register"
                        className="hidden md:flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all whitespace-nowrap shadow-lg hover:scale-105 border-2 border-white/20"
                      >
                        REGISTER
                      </Link>
                    </>
                  )}
                </>
              )}

              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md">
        <div className="mx-auto px-4 max-w-full">
          <div className="flex items-center justify-between py-3 overflow-x-auto scrollbar-hide gap-2">
            <Link href="/new-girls" className="px-3 py-2 text-sm font-semibold whitespace-nowrap hover:bg-white/20 rounded-lg transition-all">New Girls</Link>
            <Link href="/girls" className="px-3 py-2 text-sm font-semibold whitespace-nowrap hover:bg-white/20 rounded-lg transition-all">Girls</Link>
            <Link href="/trans" className="px-3 py-2 text-sm font-semibold whitespace-nowrap hover:bg-white/20 rounded-lg transition-all">Trans</Link>
            <Link href="/escort" className="px-3 py-2 text-sm font-semibold whitespace-nowrap hover:bg-white/20 rounded-lg transition-all">Escort</Link>
            <Link href="/search" className="px-3 py-2 text-sm font-semibold whitespace-nowrap hover:bg-white/20 rounded-lg transition-all">Search</Link>
            
            {/* Mobile Login/Register/My Profile Buttons */}
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              {!loading && (
                <>
                  {isLoggedIn ? (
                    <Link
                      href="/dashboard"
                      className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-lg hover:bg-white/30 transition-all whitespace-nowrap shadow-md border border-white/30 flex items-center gap-1"
                    >
                      <User className="w-3 h-3" />
                      MY PROFILE
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="px-3 py-1.5 bg-white text-pink-600 text-xs font-bold rounded-lg hover:bg-pink-50 transition-all whitespace-nowrap shadow-md"
                      >
                        LOG IN
                      </Link>
                      <Link
                        href="/register"
                        className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-lg hover:bg-white/30 transition-all whitespace-nowrap shadow-md border border-white/30"
                      >
                        REGISTER
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
