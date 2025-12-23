'use client'

import { useState } from 'react'
import { Search, MapPin, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (category) params.set('category', category)
    if (maxPrice) params.set('max_price', maxPrice)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form 
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800"
          >
            <option value="">All Cities</option>
            <option value="Zurich">Zurich</option>
            <option value="Geneva">Geneva</option>
            <option value="Basel">Basel</option>
            <option value="Bern">Bern</option>
            <option value="Lausanne">Lausanne</option>
            <option value="Lucerne">Lucerne</option>
            <option value="St. Gallen">St. Gallen</option>
          </select>
        </div>

        {/* Category */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800"
          >
            <option value="">All Categories</option>
            <option value="escort">Escort</option>
            <option value="trans">Trans</option>
            <option value="couples">Couples</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        {/* Max Price */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Max Price/Hour
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Any"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </button>
        </div>
      </div>
    </form>
  )
}

