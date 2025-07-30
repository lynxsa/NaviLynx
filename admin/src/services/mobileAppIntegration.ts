// Import venue data types and mock data
interface BLEBeacon {
  id: string
  name: string
  uuid: string
  major: number
  minor: number
  position: { x: number; y: number; floor: number }
  transmissionPower: number
  battery: number
  lastSeen: string
  status: 'active' | 'inactive' | 'low_battery'
}

interface POI {
  id: string
  name: string
  type: 'store' | 'restaurant' | 'service' | 'entrance' | 'exit' | 'restroom' | 'atm' | 'info'
  position: { x: number; y: number; floor: number }
  description?: string
  icon?: string
  hours?: string
  contact?: string
  category?: string
  tags?: string[]
}

interface NavigationGraph {
  nodes: { id: string; x: number; y: number; floor: number; type: string }[]
  edges: { from: string; to: string; distance: number; accessible: boolean }[]
}

interface Venue {
  id: string
  name: string
  type: 'shopping_mall' | 'airport' | 'hospital' | 'university' | 'office' | 'hotel'
  address: string
  city: string
  province: string
  coordinates: { latitude: number; longitude: number }
  capacity: number
  floors: number
  operatingHours: string
  contact: {
    phone: string
    email: string
    website?: string
    social?: {
      facebook?: string
      twitter?: string
      instagram?: string
    }
  }
  amenities: string[]
  accessibility: {
    wheelchairAccessible: boolean
    elevators: number
    escalators: number
    disabledParking: number
    brailleSignage: boolean
    audioAssistance: boolean
  }
  parking: {
    totalSpaces: number
    disabledSpaces: number
    hourlyRate: number
    dailyRate: number
    evCharging: boolean
  }
  bleBeacons: BLEBeacon[]
  pois: POI[]
  navigationGraph: NavigationGraph
  rating: number
  reviewCount: number
  images: string[]
  description: string
  tags: string[]
  lastUpdated: string
  isActive: boolean
}

// Mock comprehensive venue data
const comprehensiveVenues: Venue[] = [
  {
    id: 'sandton-city',
    name: 'Sandton City',
    type: 'shopping_mall',
    address: '83 Rivonia Road, Sandhurst',
    city: 'Sandton',
    province: 'Gauteng',
    coordinates: { latitude: -26.107658, longitude: 28.056725 },
    capacity: 50000,
    floors: 5,
    operatingHours: '09:00 - 21:00',
    contact: {
      phone: '+27 11 217 6000',
      email: 'info@sandtoncity.com',
      website: 'https://sandtoncity.com'
    },
    amenities: ['WiFi', 'Parking', 'Food Court', 'Cinema', 'ATMs'],
    accessibility: {
      wheelchairAccessible: true,
      elevators: 8,
      escalators: 12,
      disabledParking: 50,
      brailleSignage: true,
      audioAssistance: true
    },
    parking: {
      totalSpaces: 7000,
      disabledSpaces: 50,
      hourlyRate: 15,
      dailyRate: 80,
      evCharging: true
    },
    bleBeacons: [
      { id: 'sc-001', name: 'Main Entrance', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 1001, minor: 1, position: { x: 0, y: 0, floor: 0 }, transmissionPower: -59, battery: 95, lastSeen: '2024-01-20T10:30:00Z', status: 'active' }
    ],
    pois: [
      { id: 'sc-poi-001', name: 'Pick n Pay', type: 'store', position: { x: 50, y: 30, floor: 0 }, description: 'Supermarket', category: 'grocery' }
    ],
    navigationGraph: {
      nodes: [{ id: 'entrance-main', x: 0, y: 0, floor: 0, type: 'entrance' }],
      edges: []
    },
    rating: 4.3,
    reviewCount: 12847,
    images: [],
    description: 'Premier shopping destination in Sandton',
    tags: ['shopping', 'dining', 'entertainment'],
    lastUpdated: '2024-01-20T10:30:00Z',
    isActive: true
  }
]

// Mobile App Integration Service
export class MobileAppIntegrationService {
  private static instance: MobileAppIntegrationService | null = null
  private venues: Venue[] = []
  private syncCallbacks: ((venues: Venue[]) => void)[] = []

  private constructor() {
    this.venues = comprehensiveVenues
  }

  static getInstance(): MobileAppIntegrationService {
    if (!this.instance) {
      this.instance = new MobileAppIntegrationService()
    }
    return this.instance
  }

  // Venue Management
  getAllVenues(): Venue[] {
    return this.venues
  }

  getVenueById(id: string): Venue | null {
    return this.venues.find(venue => venue.id === id) || null
  }

  getVenuesByCity(city: string): Venue[] {
    return this.venues.filter(venue => 
      venue.city.toLowerCase() === city.toLowerCase()
    )
  }

  getVenuesByProvince(province: string): Venue[] {
    return this.venues.filter(venue => 
      venue.province.toLowerCase() === province.toLowerCase()
    )
  }

  getVenuesByType(type: string): Venue[] {
    return this.venues.filter(venue => venue.type === type)
  }

  searchVenues(query: string): Venue[] {
    const searchTerm = query.toLowerCase()
    return this.venues.filter(venue =>
      venue.name.toLowerCase().includes(searchTerm) ||
      venue.address.toLowerCase().includes(searchTerm) ||
      venue.city.toLowerCase().includes(searchTerm) ||
      venue.description.toLowerCase().includes(searchTerm) ||
      venue.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // BLE Beacon Management
  getAllBeacons(): BLEBeacon[] {
    return this.venues.flatMap(venue => venue.bleBeacons)
  }

  getBeaconsByVenue(venueId: string): BLEBeacon[] {
    const venue = this.getVenueById(venueId)
    return venue ? venue.bleBeacons : []
  }

  getActiveBeacons(): BLEBeacon[] {
    return this.getAllBeacons().filter(beacon => beacon.status === 'active')
  }

  getLowBatteryBeacons(): BLEBeacon[] {
    return this.getAllBeacons().filter(beacon => beacon.status === 'low_battery')
  }

  updateBeaconStatus(beaconId: string, status: 'active' | 'inactive' | 'low_battery'): boolean {
    for (const venue of this.venues) {
      const beacon = venue.bleBeacons.find(b => b.id === beaconId)
      if (beacon) {
        beacon.status = status
        beacon.lastSeen = new Date().toISOString()
        this.triggerSync()
        return true
      }
    }
    return false
  }

  updateBeaconBattery(beaconId: string, batteryLevel: number): boolean {
    for (const venue of this.venues) {
      const beacon = venue.bleBeacons.find(b => b.id === beaconId)
      if (beacon) {
        beacon.battery = batteryLevel
        beacon.lastSeen = new Date().toISOString()
        
        // Auto-update status based on battery level
        if (batteryLevel < 20) {
          beacon.status = 'low_battery'
        } else if (beacon.status === 'low_battery' && batteryLevel > 30) {
          beacon.status = 'active'
        }
        
        this.triggerSync()
        return true
      }
    }
    return false
  }

  // POI Management
  getAllPOIs(): POI[] {
    return this.venues.flatMap(venue => venue.pois)
  }

  getPOIsByVenue(venueId: string): POI[] {
    const venue = this.getVenueById(venueId)
    return venue ? venue.pois : []
  }

  getPOIsByType(type: string): POI[] {
    return this.getAllPOIs().filter(poi => poi.type === type)
  }

  getPOIsByCategory(category: string): POI[] {
    return this.getAllPOIs().filter(poi => poi.category === category)
  }

  searchPOIs(query: string, venueId?: string): POI[] {
    const searchTerm = query.toLowerCase()
    const pois = venueId ? this.getPOIsByVenue(venueId) : this.getAllPOIs()
    
    return pois.filter(poi =>
      poi.name.toLowerCase().includes(searchTerm) ||
      poi.description?.toLowerCase().includes(searchTerm) ||
      poi.category?.toLowerCase().includes(searchTerm) ||
      (poi.tags && poi.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)))
    )
  }

  // Navigation Management
  getNavigationGraph(venueId: string): NavigationGraph | null {
    const venue = this.getVenueById(venueId)
    return venue ? venue.navigationGraph : null
  }

  findRoute(venueId: string, fromNodeId: string, toNodeId: string, accessibleOnly = false): {
    path: string[]
    distance: number
    accessible: boolean
  } | null {
    const graph = this.getNavigationGraph(venueId)
    if (!graph) return null

    // Simple shortest path algorithm (Dijkstra's)
    const distances: { [key: string]: number } = {}
    const previous: { [key: string]: string | null } = {}
    const visited = new Set<string>()
    const queue: string[] = []

    // Initialize distances
    graph.nodes.forEach(node => {
      distances[node.id] = node.id === fromNodeId ? 0 : Infinity
      previous[node.id] = null
      queue.push(node.id)
    })

    while (queue.length > 0) {
      // Find node with minimum distance
      const current = queue.reduce((min, node) => 
        distances[node] < distances[min] ? node : min
      )

      queue.splice(queue.indexOf(current), 1)
      visited.add(current)

      if (current === toNodeId) break

      // Check neighbors
      graph.edges.forEach(edge => {
        if (edge.from === current && !visited.has(edge.to)) {
          if (accessibleOnly && !edge.accessible) return

          const alt = distances[current] + edge.distance
          if (alt < distances[edge.to]) {
            distances[edge.to] = alt
            previous[edge.to] = current
          }
        }
      })
    }

    // Reconstruct path
    if (distances[toNodeId] === Infinity) return null

    const path: string[] = []
    let current: string | null = toNodeId
    while (current !== null) {
      path.unshift(current)
      current = previous[current]
    }

    // Check if path is fully accessible
    let isAccessible = true
    for (let i = 0; i < path.length - 1; i++) {
      const edge = graph.edges.find(e => 
        e.from === path[i] && e.to === path[i + 1]
      )
      if (!edge?.accessible) {
        isAccessible = false
        break
      }
    }

    return {
      path,
      distance: distances[toNodeId],
      accessible: isAccessible
    }
  }

  // Data Synchronization
  addSyncCallback(callback: (venues: Venue[]) => void): void {
    this.syncCallbacks.push(callback)
  }

  removeSyncCallback(callback: (venues: Venue[]) => void): void {
    const index = this.syncCallbacks.indexOf(callback)
    if (index > -1) {
      this.syncCallbacks.splice(index, 1)
    }
  }

  private triggerSync(): void {
    this.syncCallbacks.forEach(callback => callback(this.venues))
  }

  // Export/Import
  exportVenueData(): string {
    return JSON.stringify(this.venues, null, 2)
  }

  importVenueData(jsonData: string): boolean {
    try {
      const importedVenues = JSON.parse(jsonData) as Venue[]
      // Validate structure (basic validation)
      if (Array.isArray(importedVenues) && importedVenues.length > 0) {
        this.venues = importedVenues
        this.triggerSync()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to import venue data:', error)
      return false
    }
  }

  // Statistics
  getVenueStats() {
    const totalVenues = this.venues.length
    const activeVenues = this.venues.filter(v => v.isActive).length
    const totalCapacity = this.venues.reduce((sum, v) => sum + v.capacity, 0)
    const totalBeacons = this.venues.reduce((sum, v) => sum + v.bleBeacons.length, 0)
    const activeBeacons = this.getAllBeacons().filter(b => b.status === 'active').length
    const lowBatteryBeacons = this.getAllBeacons().filter(b => b.status === 'low_battery').length
    const totalPOIs = this.venues.reduce((sum, v) => sum + v.pois.length, 0)
    const avgRating = this.venues.reduce((sum, v) => sum + v.rating, 0) / totalVenues

    return {
      totalVenues,
      activeVenues,
      inactiveVenues: totalVenues - activeVenues,
      totalCapacity,
      totalBeacons,
      activeBeacons,
      inactiveBeacons: totalBeacons - activeBeacons - lowBatteryBeacons,
      lowBatteryBeacons,
      totalPOIs,
      avgRating: Math.round(avgRating * 10) / 10,
      lastUpdated: new Date().toISOString()
    }
  }

  // Real-time updates (simulated)
  startRealTimeUpdates(): void {
    setInterval(() => {
      // Simulate beacon battery drain
      this.getAllBeacons().forEach(beacon => {
        if (beacon.status === 'active' && Math.random() < 0.1) {
          beacon.battery = Math.max(0, beacon.battery - Math.random() * 2)
          beacon.lastSeen = new Date().toISOString()
          
          if (beacon.battery < 20) {
            beacon.status = 'low_battery'
          }
        }
      })

      this.triggerSync()
    }, 30000) // Update every 30 seconds
  }
}

// Export singleton instance
export const mobileAppIntegration = MobileAppIntegrationService.getInstance()

// Export types for use in components
export type {
  Venue,
  POI,
  BLEBeacon,
  NavigationGraph
}
