import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
              NICE MODELS
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              The leading escort portal in Switzerland. Find verified models, escorts, and companions.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-pink-400 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-pink-400 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-pink-400 transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="text-gray-300 hover:text-pink-400 transition">
                  Search Models
                </Link>
              </li>
              <li>
                <Link href="/new-girls" className="text-gray-300 hover:text-pink-400 transition">
                  New Girls
                </Link>
              </li>
              <li>
                <Link href="/city-tours" className="text-gray-300 hover:text-pink-400 transition">
                  City Tours
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-pink-400 transition">
                  Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/escorts" className="text-gray-300 hover:text-pink-400 transition">
                  Escorts
                </Link>
              </li>
              <li>
                <Link href="/trans" className="text-gray-300 hover:text-pink-400 transition">
                  Trans
                </Link>
              </li>
              <li>
                <Link href="/couples" className="text-gray-300 hover:text-pink-400 transition">
                  Couples
                </Link>
              </li>
              <li>
                <Link href="/clubs" className="text-gray-300 hover:text-pink-400 transition">
                  Clubs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-pink-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-pink-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-pink-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-pink-400 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Nice Models. All rights reserved.</p>
          <p className="mt-2 text-xs">
            This website is for adults only (18+). By using this site, you confirm that you are of legal age.
          </p>
        </div>
      </div>
    </footer>
  )
}

