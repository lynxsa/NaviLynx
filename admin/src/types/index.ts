export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "admin" | "manager" | "moderator" | "viewer";
  status: "active" | "inactive" | "pending" | "suspended";
  avatar?: string;
  phone?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  permissions: Permission[];
  profile: UserProfile;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: "create" | "read" | "update" | "delete" | "manage";
}

export interface UserProfile {
  bio?: string;
  department?: string;
  position?: string;
  location?: string;
  timezone?: string;
  language?: string;
  preferences: Record<string, unknown>;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  type: "mall" | "store" | "restaurant" | "entertainment" | "service";
  address: Address;
  coordinates: Coordinates;
  floorPlans: FloorPlan[];
  stores: Store[];
  amenities: Amenity[];
  arWaypoints: ARWaypoint[];
  operatingHours: OperatingHours;
  contact: ContactInfo;
  status: "active" | "inactive" | "maintenance";
  images: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  metrics: VenueMetrics;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  formatted: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface FloorPlan {
  id: string;
  venueId: string;
  floor: number;
  name: string;
  mapImage: string;
  arAnchors: ARWaypoint[];
  dimensions: {
    width: number;
    height: number;
    scale: number;
  };
}

export interface Store {
  id: string;
  venueId: string;
  name: string;
  category: string;
  logo: string;
  description: string;
  location: StoreLocation;
  contact: ContactInfo;
  deals: Deal[];
  products: Product[];
  status: "open" | "closed" | "coming_soon";
}

export interface StoreLocation {
  floor: number;
  unit: string;
  coordinates: Coordinates;
  arWaypoints: ARWaypoint[];
}

export interface Amenity {
  id: string;
  name: string;
  type: "restroom" | "parking" | "atm" | "wifi" | "restaurant" | "elevator" | "escalator";
  location: Coordinates;
  floor: number;
  status: "available" | "unavailable" | "maintenance";
  description?: string;
  icon: string;
}

export interface ARWaypoint {
  id: string;
  name: string;
  description: string;
  type: "store" | "amenity" | "exit" | "landmark" | "navigation";
  coordinates: Coordinates;
  floor: number;
  arAnchor: {
    id: string;
    transform: Transform3D;
    confidence: number;
  };
  visibilityRadius: number;
  associatedStoreId?: string;
  associatedAmenityId?: string;
  icon: string;
  label: string;
  metadata: Record<string, unknown>;
}

export interface Transform3D {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  scale: { x: number; y: number; z: number };
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
  holidays: HolidayHours[];
}

export interface DayHours {
  open: string; // HH:mm format
  close: string; // HH:mm format
  closed: boolean;
}

export interface HolidayHours {
  date: string; // ISO date
  name: string;
  hours?: DayHours;
  closed: boolean;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface VenueMetrics {
  totalVisitors: number;
  uniqueVisitors: number;
  averageVisitDuration: number;
  popularTimes: Record<string, number>;
  conversionRate: number;
  satisfaction: number;
  arEngagement: number;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  type: "discount" | "buy_one_get_one" | "cashback" | "free_shipping" | "bundle";
  value: number;
  valueType: "percentage" | "fixed_amount" | "points";
  category: string;
  storeId?: string;
  venueId?: string;
  conditions: DealCondition[];
  validFrom: Date;
  validUntil: Date;
  maxRedemptions?: number;
  currentRedemptions: number;
  status: "active" | "inactive" | "expired" | "draft";
  images: string[];
  qrCode?: string;
  promocode?: string;
  targetAudience: TargetAudience;
  metrics: DealMetrics;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealCondition {
  type: "minimum_purchase" | "specific_products" | "user_segment" | "time_window";
  value: unknown;
  description: string;
}

export interface TargetAudience {
  ageRange?: { min: number; max: number };
  gender?: "male" | "female" | "all";
  location?: string[];
  interests?: string[];
  spendingRange?: { min: number; max: number };
  userSegments?: string[];
}

export interface DealMetrics {
  views: number;
  clicks: number;
  redemptions: number;
  conversions: number;
  revenue: number;
  clickThroughRate: number;
  conversionRate: number;
  revenuePerUser: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  subcategory: string;
  sku: string;
  barcode?: string;
  price: number;
  currency: string;
  images: string[];
  specifications: Record<string, unknown>;
  storeId: string;
  venueId: string;
  availability: ProductAvailability;
  ratings: ProductRatings;
  tags: string[];
  status: "available" | "out_of_stock" | "discontinued";
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductAvailability {
  inStock: boolean;
  quantity: number;
  lowStockThreshold: number;
  restockDate?: Date;
  supplier?: string;
}

export interface ProductRatings {
  average: number;
  total: number;
  distribution: Record<string, number>; // "1": count, "2": count, etc.
}

export interface ScanHistory {
  id: string;
  userId: string;
  productId: string;
  storeId: string;
  venueId: string;
  scanType: "barcode" | "qr_code" | "ar_recognition" | "text_ocr";
  scanData: string;
  confidence: number;
  location: Coordinates;
  timestamp: Date;
  result: ScanResult;
  metadata: Record<string, unknown>;
}

export interface ScanResult {
  success: boolean;
  productFound: boolean;
  product?: Product;
  relatedDeals?: Deal[];
  recommendations?: Product[];
  errorMessage?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  agentId?: string;
  type: "user_support" | "technical" | "billing" | "general";
  status: "active" | "resolved" | "pending" | "escalated";
  priority: "low" | "medium" | "high" | "urgent";
  subject: string;
  messages: ChatMessage[];
  tags: string[];
  satisfaction?: number;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: "user" | "agent" | "system" | "bot";
  content: string;
  type: "text" | "image" | "file" | "location" | "product_link";
  attachments?: Attachment[];
  timestamp: Date;
  edited: boolean;
  editedAt?: Date;
  reactions?: MessageReaction[];
  metadata: Record<string, unknown>;
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnail?: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface Analytics {
  id: string;
  type: "user_behavior" | "venue_performance" | "deal_effectiveness" | "ar_usage" | "system_health";
  period: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  startDate: Date;
  endDate: Date;
  metrics: Record<string, number | string>;
  dimensions: Record<string, string>;
  filters: AnalyticsFilter[];
  generatedAt: Date;
  generatedBy: string;
}

export interface AnalyticsFilter {
  field: string;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "in" | "not_in";
  value: unknown;
}

export interface SystemHealth {
  timestamp: Date;
  services: ServiceStatus[];
  performance: PerformanceMetrics;
  errors: ErrorSummary[];
  alerts: Alert[];
}

export interface ServiceStatus {
  name: string;
  status: "healthy" | "warning" | "critical" | "down";
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastCheck: Date;
  details?: Record<string, unknown>;
}

export interface PerformanceMetrics {
  apiResponseTime: number;
  databaseQueryTime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  activeUsers: number;
  requestsPerSecond: number;
  errorRate: number;
}

export interface ErrorSummary {
  type: string;
  count: number;
  lastOccurrence: Date;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  stackTrace?: string;
}

export interface Alert {
  id: string;
  type: "system" | "security" | "performance" | "business";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  triggered: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  metadata: Record<string, unknown>;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  metadata?: Record<string, unknown>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filters?: Record<string, unknown>;
}

export interface TableColumn<T = unknown> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: T) => React.ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  frequency: "immediate" | "hourly" | "daily" | "weekly";
  categories: string[];
}
