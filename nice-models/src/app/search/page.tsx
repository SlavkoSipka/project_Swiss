import SearchFilters from '@/components/search/SearchFilters'
import ProfileGrid from '@/components/search/ProfileGrid'
import { Suspense } from 'react'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">
          Find Your Perfect <span className="text-pink-600">Companion</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <SearchFilters />
          </aside>

          {/* Results Grid */}
          <main className="lg:col-span-3">
            <Suspense fallback={<div>Loading...</div>}>
              <ProfileGrid />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

