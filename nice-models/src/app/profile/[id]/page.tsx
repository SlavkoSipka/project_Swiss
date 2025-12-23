import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin,
  Star,
  CheckCircle,
  Heart,
  Share2,
  Flag,
  Phone,
  MessageSquare,
  Clock,
  DollarSign,
  User,
  Ruler,
  Languages as LanguagesIcon,
  Calendar,
} from 'lucide-react'
import PhotoGallery from '@/components/profile/PhotoGallery'
import ReviewsList from '@/components/profile/ReviewsList'
import ContactButtons from '@/components/profile/ContactButtons'
import SimilarProfiles from '@/components/profile/SimilarProfiles'
import { getProfileById, getModelRating } from '@/lib/api/profiles'

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params

  // Fetch profile from Supabase
  const profileData = await getProfileById(id)
  
  if (!profileData || !profileData.model_details) {
    notFound()
  }

  // Get rating
  const rating = await getModelRating(id)

  // Map days of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  const availability = Array.from({ length: 7 }, (_, i) => {
    const slot = profileData.availability?.find(a => a.day_of_week === i)
    return {
      day: dayNames[i],
      hours: slot && slot.is_available 
        ? `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`
        : 'Closed'
    }
  })

  const profile = {
    id,
    name: profileData.full_name || 'Model',
    age: profileData.model_details.age || 0,
    city: profileData.model_details.location_city || 'Unknown',
    country: profileData.model_details.location_country || 'Unknown',
    price: profileData.model_details.price_per_hour || 0,
    rating: rating.rating,
    reviews: rating.count,
    verified: profileData.is_verified,
    online: false, // TODO: implement online status
    phone: profileData.model_details.phone_number || '',
    height: profileData.model_details.height || 0,
    languages: profileData.languages?.map(l => l.language_name) || [],
    bio: profileData.model_details.bio || 'No bio available.',
    services: profileData.model_details.services || [],
    availability,
    photos: profileData.photos?.map(p => p.photo_url) || [],
    pricing: {
      '30min': Math.round((profileData.model_details.price_per_hour || 0) * 0.6),
      '1hour': profileData.model_details.price_per_hour || 0,
      '2hours': Math.round((profileData.model_details.price_per_hour || 0) * 1.8),
      'overnight': Math.round((profileData.model_details.price_per_hour || 0) * 4.5),
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-pink-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/search" className="hover:text-pink-600">Search</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{profile.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-gray-800">
                      {profile.name}, {profile.age}
                    </h1>
                    {profile.verified && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                      </div>
                    )}
                    {profile.online && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                        Online Now
                      </div>
                    )}
                  </div>
                  
                  <p className="text-lg text-gray-600 flex items-center mb-3">
                    <MapPin className="w-5 h-5 mr-2 text-pink-500" />
                    {profile.city}, {profile.country}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-gray-700">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="font-semibold text-lg">{profile.rating}</span>
                      <span className="ml-1">({profile.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <Heart className="w-5 h-5 text-pink-500" />
                  </button>
                  <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <Flag className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <User className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                  <div className="text-sm text-gray-600">Age</div>
                  <div className="font-semibold">{profile.age} years</div>
                </div>
                {profile.height > 0 && (
                  <div className="text-center">
                    <Ruler className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                    <div className="text-sm text-gray-600">Height</div>
                    <div className="font-semibold">{profile.height} cm</div>
                  </div>
                )}
                <div className="text-center">
                  <LanguagesIcon className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                  <div className="text-sm text-gray-600">Languages</div>
                  <div className="font-semibold">{profile.languages.length}</div>
                </div>
                <div className="text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                  <div className="text-sm text-gray-600">From</div>
                  <div className="font-semibold">${profile.price}/hr</div>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <PhotoGallery photos={profile.photos} />

            {/* About */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About Me</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Services Offered</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profile.services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center p-3 bg-pink-50 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-pink-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Languages</h2>
              <div className="flex flex-wrap gap-3">
                {profile.languages.map((lang) => (
                  <div
                    key={lang}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold"
                  >
                    {lang}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <ReviewsList profileId={id} rating={profile.rating} totalReviews={profile.reviews} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-20">
              <div className="mb-6">
                <div className="text-3xl font-bold text-pink-600 mb-1">
                  ${profile.price}
                </div>
                <div className="text-gray-600">per hour</div>
              </div>

              <ContactButtons phone={profile.phone} profileId={id} />

              {/* Pricing Table */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Pricing</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(profile.pricing).map(([duration, price]) => (
                    <div key={duration} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{duration.replace('_', ' ')}</span>
                      <span className="font-semibold">${price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-pink-500" />
                Availability
              </h3>
              <div className="space-y-2 text-sm">
                {profile.availability.map((slot) => (
                  <div key={slot.day} className="flex justify-between py-2 border-b last:border-0">
                    <span className="text-gray-600">{slot.day}</span>
                    <span className={`font-semibold ${slot.hours === 'Closed' ? 'text-red-500' : 'text-green-600'}`}>
                      {slot.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="font-semibold mb-2 text-yellow-800">Safety First</h3>
              <p className="text-sm text-yellow-700">
                Always meet in public first. Never send money in advance. Report suspicious behavior.
              </p>
            </div>
          </div>
        </div>

        {/* Similar Profiles */}
        <SimilarProfiles currentProfileId={id} city={profile.city} />
      </div>
    </div>
  )
}

