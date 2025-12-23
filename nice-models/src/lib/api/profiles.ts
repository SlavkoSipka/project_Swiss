import { createClient } from '@/lib/supabase/client'

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'model' | 'admin'
  is_verified: boolean
  created_at: string
  model_details?: ModelDetails | null
  photos?: Photo[]
  reviews?: Review[]
}

export interface ModelDetails {
  id: string
  location_city: string | null
  location_country: string | null
  bio: string | null
  height: number | null
  age: number | null
  phone_number: string | null
  services: string[] | null
  price_per_hour: number | null
}

export interface Photo {
  id: string
  model_id: string
  photo_url: string
  is_verified: boolean
  is_primary: boolean
  display_order: number
  created_at: string
}

export interface Review {
  id: string
  model_id: string
  reviewer_id: string
  rating: number
  comment: string | null
  is_verified: boolean
  is_approved: boolean
  created_at: string
  reviewer?: {
    full_name: string | null
    username: string | null
  }
}

export interface SearchFilters {
  category?: string
  city?: string
  country?: string
  minAge?: number
  maxAge?: number
  minPrice?: number
  maxPrice?: number
  services?: string[]
  verified?: boolean
}

/**
 * Fetch featured/top models for homepage
 */
export async function getFeaturedProfiles(limit: number = 4) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      model_details(*),
      photos(*)
    `)
    .eq('role', 'model')
    .eq('is_verified', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured profiles:', error)
    return []
  }

  return data as Profile[]
}

/**
 * Search profiles with filters
 */
export async function searchProfiles(filters: SearchFilters, page: number = 1, pageSize: number = 12) {
  const supabase = createClient()
  const offset = (page - 1) * pageSize

  let query = supabase
    .from('profiles')
    .select(`
      *,
      model_details(*),
      photos(*)
    `, { count: 'exact' })
    .eq('role', 'model')

  // Apply filters
  if (filters.verified) {
    query = query.eq('is_verified', true)
  }

  // Filter by model_details
  if (filters.city) {
    query = query.eq('model_details.location_city', filters.city)
  }

  if (filters.country) {
    query = query.eq('model_details.location_country', filters.country)
  }

  if (filters.minAge) {
    query = query.gte('model_details.age', filters.minAge)
  }

  if (filters.maxAge) {
    query = query.lte('model_details.age', filters.maxAge)
  }

  if (filters.minPrice) {
    query = query.gte('model_details.price_per_hour', filters.minPrice)
  }

  if (filters.maxPrice) {
    query = query.lte('model_details.price_per_hour', filters.maxPrice)
  }

  // Pagination and ordering
  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error searching profiles:', error)
    return { profiles: [], total: 0 }
  }

  return {
    profiles: data as Profile[],
    total: count || 0,
  }
}

/**
 * Get single profile by ID with all details
 */
export async function getProfileById(id: string) {
  const supabase = createClient()

  try {
    // First, try to get basic profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return null
    }

    if (!profile) {
      console.error('Profile not found:', id)
      return null
    }

    // Get model_details
    const { data: modelDetails } = await supabase
      .from('model_details')
      .select('*')
      .eq('id', id)
      .single()

    // Get photos
    const { data: photos } = await supabase
      .from('photos')
      .select('*')
      .eq('model_id', id)
      .order('display_order')

    // Get reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*, reviewer:profiles!reviews_reviewer_id_fkey(full_name, username)')
      .eq('model_id', id)
      .eq('is_approved', true)

    // Get languages
    const { data: languages } = await supabase
      .from('languages')
      .select('*')
      .eq('model_id', id)

    // Get availability
    const { data: availability } = await supabase
      .from('availability')
      .select('*')
      .eq('model_id', id)
      .order('day_of_week')

    return {
      ...profile,
      model_details: modelDetails,
      photos: photos || [],
      reviews: reviews || [],
      languages: languages || [],
      availability: availability || [],
    } as Profile & {
      languages?: { language_code: string; language_name: string }[]
      availability?: {
        day_of_week: number
        start_time: string
        end_time: string
        is_available: boolean
      }[]
    }
  } catch (error) {
    console.error('Unexpected error in getProfileById:', error)
    return null
  }
}

/**
 * Get similar profiles (same city)
 */
export async function getSimilarProfiles(profileId: string, city: string, limit: number = 4) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      model_details(*),
      photos(*)
    `)
    .eq('role', 'model')
    .eq('model_details.location_city', city)
    .neq('id', profileId)
    .limit(limit)

  if (error) {
    console.error('Error fetching similar profiles:', error)
    return []
  }

  return data as Profile[]
}

/**
 * Calculate average rating for a model
 */
export async function getModelRating(modelId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('model_id', modelId)
    .eq('is_approved', true)

  if (error || !data || data.length === 0) {
    return { rating: 0, count: 0 }
  }

  const sum = data.reduce((acc, review) => acc + review.rating, 0)
  const average = sum / data.length

  return {
    rating: Math.round(average * 10) / 10, // Round to 1 decimal
    count: data.length,
  }
}

/**
 * Get primary photo for a model
 */
export function getPrimaryPhoto(photos: Photo[] | undefined): string {
  if (!photos || photos.length === 0) {
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop'
  }

  const primary = photos.find(p => p.is_primary)
  return primary?.photo_url || photos[0].photo_url
}

