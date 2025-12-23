import Link from 'next/link'
import { Search, MapPin, Users, Star, TrendingUp, Clock } from 'lucide-react'
import SearchBar from '@/components/home/SearchBar'
import CategoryCard from '@/components/home/CategoryCard'
import FeaturedProfiles from '@/components/home/FeaturedProfiles'
import StatsSection from '@/components/home/StatsSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
              Companion Tonight
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            The leading escort portal in Switzerland. Over 1,200+ verified models available 24/7.
          </p>

          {/* Search Bar */}
          <SearchBar />

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Users className="w-8 h-8 mx-auto mb-2 text-pink-300" />
              <div className="text-2xl font-bold">1,292</div>
              <div className="text-sm text-gray-300">Online Now</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Star className="w-8 h-8 mx-auto mb-2 text-pink-300" />
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-gray-300">Verified</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-pink-300" />
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-gray-300">Cities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Clock className="w-8 h-8 mx-auto mb-2 text-pink-300" />
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-gray-300">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Choose Your <span className="text-pink-600">Category</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CategoryCard
              title="Escorts"
              count={780}
              icon="👗"
              href="/escorts"
              color="from-pink-500 to-rose-500"
            />
            <CategoryCard
              title="Trans"
              count={156}
              icon="💃"
              href="/trans"
              color="from-purple-500 to-pink-500"
            />
            <CategoryCard
              title="New Girls"
              count={89}
              icon="✨"
              href="/new-girls"
              color="from-blue-500 to-purple-500"
            />
            <CategoryCard
              title="VIP Models"
              count={127}
              icon="👑"
              href="/vip"
              color="from-yellow-500 to-orange-500"
            />
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <FeaturedProfiles />

      {/* Popular Locations */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Popular <span className="text-pink-600">Locations</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'Zurich', count: 160 },
              { name: 'Geneva', count: 282 },
              { name: 'Basel', count: 78 },
              { name: 'Bern', count: 130 },
              { name: 'Lausanne', count: 283 },
              { name: 'Lucerne', count: 58 },
              { name: 'St. Gallen', count: 18 },
            ].map((location) => (
              <Link
                key={location.name}
                href={`/search?city=${location.name}`}
                className="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 text-center group"
              >
                <MapPin className="w-8 h-8 mx-auto mb-2 text-pink-500 group-hover:text-pink-600" />
                <h3 className="font-semibold text-gray-800">{location.name}</h3>
                <p className="text-sm text-gray-500">{location.count} models</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of satisfied clients and find your perfect companion today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Models
            </Link>
            <Link
              href="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-pink-600 transition"
          >
              Register as Model
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
