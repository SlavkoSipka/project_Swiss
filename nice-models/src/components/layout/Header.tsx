'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, User, Heart, MessageSquare } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-pink-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-pink-300 transition">
            <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
              NICE MODELS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="hover:text-pink-300 transition font-medium">
              Search
            </Link>
            <Link href="/new-girls" className="hover:text-pink-300 transition font-medium">
              New Girls
            </Link>
            <Link href="/escorts" className="hover:text-pink-300 transition font-medium">
              Escorts
            </Link>
            <Link href="/trans" className="hover:text-pink-300 transition font-medium">
              Trans
            </Link>
            <Link href="/city-tours" className="hover:text-pink-300 transition font-medium">
              City Tours
            </Link>
            <Link href="/jobs" className="hover:text-pink-300 transition font-medium">
              Jobs
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 hover:bg-purple-700 rounded-full transition">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-purple-700 rounded-full transition">
              <MessageSquare className="w-5 h-5" />
            </button>
            <Link 
              href="/login" 
              className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-full transition font-medium"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-purple-700 rounded-lg transition"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in">
            <Link href="/search" className="block py-2 hover:text-pink-300 transition">
              Search
            </Link>
            <Link href="/new-girls" className="block py-2 hover:text-pink-300 transition">
              New Girls
            </Link>
            <Link href="/escorts" className="block py-2 hover:text-pink-300 transition">
              Escorts
            </Link>
            <Link href="/trans" className="block py-2 hover:text-pink-300 transition">
              Trans
            </Link>
            <Link href="/city-tours" className="block py-2 hover:text-pink-300 transition">
              City Tours
            </Link>
            <Link href="/jobs" className="block py-2 hover:text-pink-300 transition">
              Jobs
            </Link>
            <div className="pt-4 border-t border-purple-700">
              <Link 
                href="/login" 
                className="flex items-center justify-center space-x-2 bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-full transition"
              >
                <User className="w-4 h-4" />
                <span>Login / Register</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

