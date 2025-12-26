'use client'

import { useState } from 'react'
import { Search, Grid, List } from 'lucide-react'

interface FilterBarProps {
  onFilterChange?: (filters: any) => void
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState({
    category: 'All',
    city: '',
    distance: '+0km',
    name: '',
    size: 'XL',
    verified: false,
    withComments: false,
    withVideo: false,
    hasStory: false
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Dropdown */}
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
        >
          <option>All</option>
          <option>Escorts</option>
          <option>Trans</option>
          <option>New Girls</option>
        </select>

        {/* City Dropdown */}
        <select
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
        >
          <option value="">City</option>
          <option>Zurich</option>
          <option>Geneva</option>
          <option>Basel</option>
          <option>Bern</option>
          <option>Lausanne</option>
        </select>

        {/* Distance Dropdown */}
        <select
          value={filters.distance}
          onChange={(e) => handleFilterChange('distance', e.target.value)}
          className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
        >
          <option>+0km</option>
          <option>+5km</option>
          <option>+10km</option>
          <option>+20km</option>
          <option>+50km</option>
        </select>

        {/* Search by Name */}
        <div className="flex-1 min-w-[150px] relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Name"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>

        {/* Size Dropdown */}
        <select
          value={filters.size}
          onChange={(e) => handleFilterChange('size', e.target.value)}
          className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
        >
          <option>XL</option>
          <option>L</option>
          <option>M</option>
          <option>S</option>
        </select>

        {/* Grid/List Toggle */}
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 transition ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'hover:bg-gray-100'}`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 transition ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'hover:bg-gray-100'}`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Button */}
        <button className="px-3 py-1.5 bg-pink-500 text-white rounded text-xs font-semibold hover:bg-pink-600 transition">
          Filter
        </button>

        {/* Checkboxes */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={filters.verified}
              onChange={(e) => handleFilterChange('verified', e.target.checked)}
              className="w-3.5 h-3.5 text-pink-500 focus:ring-pink-500 rounded"
            />
            <span>100% verified</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={filters.withComments}
              onChange={(e) => handleFilterChange('withComments', e.target.checked)}
              className="w-3.5 h-3.5 text-pink-500 focus:ring-pink-500 rounded"
            />
            <span>With comments</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={filters.withVideo}
              onChange={(e) => handleFilterChange('withVideo', e.target.checked)}
              className="w-3.5 h-3.5 text-pink-500 focus:ring-pink-500 rounded"
            />
            <span>With Video</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={filters.hasStory}
              onChange={(e) => handleFilterChange('hasStory', e.target.checked)}
              className="w-3.5 h-3.5 text-pink-500 focus:ring-pink-500 rounded"
            />
            <span>Has Story</span>
          </label>
        </div>

        {/* Reset and Sort */}
        <button className="px-3 py-1.5 border border-gray-300 rounded text-xs hover:bg-gray-50 transition whitespace-nowrap">
          Reset filter
        </button>
        <button className="px-3 py-1.5 border border-gray-300 rounded text-xs hover:bg-gray-50 transition flex items-center gap-1 whitespace-nowrap">
          ↑ Sort
        </button>
      </div>
    </div>
  )
}
