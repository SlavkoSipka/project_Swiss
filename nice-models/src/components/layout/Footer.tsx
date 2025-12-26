import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white mt-20 border-t border-gray-800">
      <div className="mx-auto px-4 py-16 max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Nice<span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Models</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The leading escort portal in Switzerland. Find verified models, escorts, and companions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-lg hover:shadow-glow">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-lg hover:shadow-glow">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-lg hover:shadow-glow">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/search" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  Search Models
                </Link>
              </li>
              <li>
                <Link href="/new-girls" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  New Girls
                </Link>
              </li>
              <li>
                <Link href="/city-tours" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  City Tours
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Categories</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/escorts" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  Escorts
                </Link>
              </li>
              <li>
                <Link href="/trans" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  Trans
                </Link>
              </li>
              <li>
                <Link href="/couples" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  Couples
                </Link>
              </li>
              <li>
                <Link href="/clubs" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  Clubs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400 font-medium">
            © {new Date().getFullYear()} NiceModels. All rights reserved.
          </p>
          <p className="mt-3 text-xs text-gray-500">
            This website is for adults only (18+). By using this site, you confirm that you are of legal age.
          </p>
        </div>
      </div>
    </footer>
  )
}

