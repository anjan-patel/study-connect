export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'parent'

export interface SettingsCategory {
  id: string
  title: string
  description: string
  icon: string
  href: string
  roles: UserRole[]
  badge?: string
}

export interface SchoolInfo {
  name: string
  code: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  website: string
  principalName: string
  establishedYear: string
  affiliationNumber: string
  logo?: string
}

export interface BrandingSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logoUrl?: string
  faviconUrl?: string
  appName: string
  tagline: string
}

export interface AcademicYear {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
}

export interface Term {
  id: string
  name: string
  startDate: string
  endDate: string
  academicYearId: string
  isActive: boolean
}

export interface GradeScale {
  id: string
  name: string
  minPercentage: number
  maxPercentage: number
  grade: string
  gradePoint: number
  remarks: string
}

export interface NotificationRule {
  id: string
  name: string
  event: string
  channels: ('push' | 'sms' | 'email')[]
  recipients: UserRole[]
  isEnabled: boolean
  template?: string
}

export interface QuietHours {
  enabled: boolean
  startTime: string
  endTime: string
  daysOfWeek: number[]
  bypassForUrgent: boolean
}

export interface PaymentGateway {
  id: string
  name: string
  provider: 'razorpay' | 'paytm' | 'stripe' | 'cashfree'
  isActive: boolean
  isDefault: boolean
  logo: string
}

export interface PaymentKeys {
  gateway: string
  keyId: string
  keySecret: string
  webhookSecret?: string
  testMode: boolean
}

export interface PaymentMethod {
  id: string
  name: string
  type: 'upi' | 'card' | 'netbanking' | 'wallet' | 'emi'
  isEnabled: boolean
  icon: string
}

export interface SMSProvider {
  id: string
  name: string
  provider: 'twilio' | 'msg91' | 'textlocal' | 'gupshup'
  isActive: boolean
  senderId: string
  logo: string
}

export interface TransportRoute {
  id: string
  name: string
  routeNumber: string
  vehicleNumber: string
  driverName: string
  driverPhone: string
  stops: RouteStop[]
  isActive: boolean
}

export interface RouteStop {
  id: string
  name: string
  arrivalTime: string
  departureTime: string
  sequence: number
  studentsCount: number
}

export interface AdminAccount {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  department?: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

export interface DataExportConfig {
  type: 'students' | 'teachers' | 'attendance' | 'fees' | 'grades' | 'all'
  format: 'csv' | 'excel' | 'pdf'
  dateRange?: {
    start: string
    end: string
  }
}

// Role-based access configuration
export const roleAccess: Record<UserRole, string[]> = {
  super_admin: [
    'school-info', 'branding', 'academic-year', 'terms', 'grading',
    'notifications', 'payment-gateway', 'sms-provider', 'transport',
    'admin-accounts', 'data-management'
  ],
  admin: [
    'school-info', 'academic-year', 'terms', 'grading',
    'notifications', 'payment-gateway', 'transport', 'data-management'
  ],
  teacher: [
    'notifications'
  ],
  parent: [
    'notifications'
  ]
}
