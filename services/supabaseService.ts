// Supabase Configuration for NaviLynx
import { createClient } from '@supabase/supabase-js'

// These will be your actual Supabase credentials (to be set up)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types for TypeScript
export interface DatabaseVenue {
  id: string
  name: string
  description: string
  category: string
  province: string
  city: string
  address: string
  latitude: number
  longitude: number
  image_url: string
  rating: number
  review_count: number
  features: string[]
  opening_hours: any
  contact_info: any
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface DatabaseDeal {
  id: string
  venue_id: string
  title: string
  description: string
  discount_percentage: number
  original_price: number
  discounted_price: number
  image_url: string
  valid_from: string
  valid_until: string
  terms_conditions: string
  is_active: boolean
  created_at: string
}

export interface UserSession {
  id: string
  user_id: string
  session_start: string
  session_end?: string
  venues_visited: string[]
  navigation_count: number
  deals_viewed: string[]
  created_at: string
}

export interface NavigationLog {
  id: string
  user_id: string
  venue_id: string
  start_location: any
  destination: any
  navigation_mode: 'ar' | 'map'
  route_data: any
  duration_seconds: number
  success: boolean
  created_at: string
}

// Database Service Class
export class SupabaseService {
  // Venue Operations
  static async getVenues(limit: number = 50) {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data as DatabaseVenue[]
  }

  static async getVenueById(id: string) {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as DatabaseVenue
  }

  static async searchVenues(query: string) {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%, city.ilike.%${query}%`)
      .eq('is_active', true)
      .order('rating', { ascending: false })
    
    if (error) throw error
    return data as DatabaseVenue[]
  }

  // Deal Operations
  static async getActiveDeals(venueId?: string) {
    let query = supabase
      .from('deals')
      .select(`
        *,
        venues:venue_id (name, image_url)
      `)
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())

    if (venueId) {
      query = query.eq('venue_id', venueId)
    }

    const { data, error } = await query.order('discount_percentage', { ascending: false })
    
    if (error) throw error
    return data as DatabaseDeal[]
  }

  // Analytics Operations
  static async logUserSession(userId: string, sessionData: Partial<UserSession>) {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert([{
        user_id: userId,
        ...sessionData,
        created_at: new Date().toISOString()
      }])
    
    if (error) throw error
    return data
  }

  static async logNavigation(navigationData: Partial<NavigationLog>) {
    const { data, error } = await supabase
      .from('navigation_logs')
      .insert([{
        ...navigationData,
        created_at: new Date().toISOString()
      }])
    
    if (error) throw error
    return data
  }

  // Analytics for Investor Demo
  static async getAnalytics() {
    const [venues, sessions, navigation] = await Promise.all([
      supabase.from('venues').select('id').eq('is_active', true),
      supabase.from('user_sessions').select('id, navigation_count'),
      supabase.from('navigation_logs').select('id, success, duration_seconds')
    ])

    const totalVenues = venues.data?.length || 0
    const totalSessions = sessions.data?.length || 0
    const totalNavigations = navigation.data?.length || 0
    const successfulNavigations = navigation.data?.filter(n => n.success).length || 0
    const avgDuration = navigation.data?.reduce((sum, n) => sum + n.duration_seconds, 0) / totalNavigations || 0

    return {
      totalVenues,
      totalUsers: totalSessions,
      totalNavigations,
      successRate: totalNavigations > 0 ? (successfulNavigations / totalNavigations * 100) : 0,
      avgNavigationTime: Math.round(avgDuration),
      timestamp: new Date().toISOString()
    }
  }
}

export default supabase
