import type {
  SchoolInfo,
  BrandingSettings,
  AcademicYear,
  Term,
  GradeScale,
  NotificationRule,
  QuietHours,
  PaymentGateway,
  PaymentMethod,
  SMSProvider,
  TransportRoute,
  AdminAccount,
  SettingsCategory
} from './settings-types'

export const settingsCategories: SettingsCategory[] = [
  {
    id: 'school-info',
    title: 'School Information',
    description: 'Basic school details and contact information',
    icon: 'School',
    href: '/settings/school-info',
    roles: ['super_admin', 'admin']
  },
  {
    id: 'branding',
    title: 'Branding',
    description: 'Customize colors, logo, and app appearance',
    icon: 'Palette',
    href: '/settings/branding',
    roles: ['super_admin']
  },
  {
    id: 'academic-year',
    title: 'Academic Year',
    description: 'Manage academic years and sessions',
    icon: 'Calendar',
    href: '/settings/academic-year',
    roles: ['super_admin', 'admin']
  },
  {
    id: 'terms',
    title: 'Term Management',
    description: 'Configure terms, semesters, and quarters',
    icon: 'CalendarDays',
    href: '/settings/terms',
    roles: ['super_admin', 'admin']
  },
  {
    id: 'grading',
    title: 'Grading Scale',
    description: 'Set up grading scales and grade calculator',
    icon: 'GraduationCap',
    href: '/settings/grading',
    roles: ['super_admin', 'admin']
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure notification rules and quiet hours',
    icon: 'Bell',
    href: '/settings/notifications',
    roles: ['super_admin', 'admin', 'teacher', 'parent']
  },
  {
    id: 'payment-gateway',
    title: 'Payment Gateway',
    description: 'Set up payment providers and methods',
    icon: 'CreditCard',
    href: '/settings/payment-gateway',
    roles: ['super_admin', 'admin']
  },
  {
    id: 'sms-provider',
    title: 'SMS Provider',
    description: 'Configure SMS gateway for notifications',
    icon: 'MessageSquare',
    href: '/settings/sms-provider',
    roles: ['super_admin']
  },
  {
    id: 'transport',
    title: 'Transport Routes',
    description: 'Manage bus routes and stops',
    icon: 'Bus',
    href: '/settings/transport',
    roles: ['super_admin', 'admin']
  },
  {
    id: 'admin-accounts',
    title: 'Admin Accounts',
    description: 'Manage administrator accounts and roles',
    icon: 'Users',
    href: '/settings/admin-accounts',
    roles: ['super_admin']
  },
  {
    id: 'data-management',
    title: 'Data Management',
    description: 'Export, import, and backup data',
    icon: 'Database',
    href: '/settings/data-management',
    roles: ['super_admin', 'admin']
  }
]

export const schoolInfo: SchoolInfo = {
  name: 'Delhi Public School',
  code: 'DPS-001',
  address: '123 Education Lane, Sector 10',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110001',
  phone: '+91 11 2345 6789',
  email: 'info@dps.edu.in',
  website: 'www.dps.edu.in',
  principalName: 'Dr. Rajesh Kumar',
  establishedYear: '1995',
  affiliationNumber: 'CBSE/2023/12345'
}

export const brandingSettings: BrandingSettings = {
  primaryColor: '#2563eb',
  secondaryColor: '#1e40af',
  accentColor: '#3b82f6',
  appName: 'School Connect',
  tagline: 'Connecting Education, Empowering Future'
}

export const academicYears: AcademicYear[] = [
  {
    id: '1',
    name: '2024-25',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    isActive: true
  },
  {
    id: '2',
    name: '2023-24',
    startDate: '2023-04-01',
    endDate: '2024-03-31',
    isActive: false
  },
  {
    id: '3',
    name: '2022-23',
    startDate: '2022-04-01',
    endDate: '2023-03-31',
    isActive: false
  }
]

export const terms: Term[] = [
  {
    id: '1',
    name: 'Term 1',
    startDate: '2024-04-01',
    endDate: '2024-09-30',
    academicYearId: '1',
    isActive: false
  },
  {
    id: '2',
    name: 'Term 2',
    startDate: '2024-10-01',
    endDate: '2025-03-31',
    academicYearId: '1',
    isActive: true
  }
]

export const gradeScales: GradeScale[] = [
  { id: '1', name: 'Outstanding', minPercentage: 91, maxPercentage: 100, grade: 'A1', gradePoint: 10, remarks: 'Excellent' },
  { id: '2', name: 'Excellent', minPercentage: 81, maxPercentage: 90, grade: 'A2', gradePoint: 9, remarks: 'Very Good' },
  { id: '3', name: 'Very Good', minPercentage: 71, maxPercentage: 80, grade: 'B1', gradePoint: 8, remarks: 'Good' },
  { id: '4', name: 'Good', minPercentage: 61, maxPercentage: 70, grade: 'B2', gradePoint: 7, remarks: 'Above Average' },
  { id: '5', name: 'Above Average', minPercentage: 51, maxPercentage: 60, grade: 'C1', gradePoint: 6, remarks: 'Average' },
  { id: '6', name: 'Average', minPercentage: 41, maxPercentage: 50, grade: 'C2', gradePoint: 5, remarks: 'Below Average' },
  { id: '7', name: 'Below Average', minPercentage: 33, maxPercentage: 40, grade: 'D', gradePoint: 4, remarks: 'Needs Improvement' },
  { id: '8', name: 'Fail', minPercentage: 0, maxPercentage: 32, grade: 'E', gradePoint: 0, remarks: 'Not Satisfactory' }
]

export const notificationRules: NotificationRule[] = [
  {
    id: '1',
    name: 'Attendance Alert',
    event: 'student_absent',
    channels: ['push', 'sms'],
    recipients: ['parent'],
    isEnabled: true
  },
  {
    id: '2',
    name: 'Fee Due Reminder',
    event: 'fee_due',
    channels: ['push', 'sms', 'email'],
    recipients: ['parent'],
    isEnabled: true
  },
  {
    id: '3',
    name: 'Exam Schedule',
    event: 'exam_scheduled',
    channels: ['push', 'email'],
    recipients: ['parent', 'teacher'],
    isEnabled: true
  },
  {
    id: '4',
    name: 'Result Published',
    event: 'result_published',
    channels: ['push', 'sms'],
    recipients: ['parent'],
    isEnabled: true
  },
  {
    id: '5',
    name: 'Homework Assigned',
    event: 'homework_assigned',
    channels: ['push'],
    recipients: ['parent'],
    isEnabled: false
  }
]

export const quietHoursConfig: QuietHours = {
  enabled: true,
  startTime: '21:00',
  endTime: '07:00',
  daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  bypassForUrgent: true
}

export const paymentGateways: PaymentGateway[] = [
  {
    id: '1',
    name: 'Razorpay',
    provider: 'razorpay',
    isActive: true,
    isDefault: true,
    logo: '/payment/razorpay.svg'
  },
  {
    id: '2',
    name: 'Paytm',
    provider: 'paytm',
    isActive: true,
    isDefault: false,
    logo: '/payment/paytm.svg'
  },
  {
    id: '3',
    name: 'Stripe',
    provider: 'stripe',
    isActive: false,
    isDefault: false,
    logo: '/payment/stripe.svg'
  },
  {
    id: '4',
    name: 'Cashfree',
    provider: 'cashfree',
    isActive: false,
    isDefault: false,
    logo: '/payment/cashfree.svg'
  }
]

export const paymentMethods: PaymentMethod[] = [
  { id: '1', name: 'UPI', type: 'upi', isEnabled: true, icon: 'Smartphone' },
  { id: '2', name: 'Credit/Debit Card', type: 'card', isEnabled: true, icon: 'CreditCard' },
  { id: '3', name: 'Net Banking', type: 'netbanking', isEnabled: true, icon: 'Building' },
  { id: '4', name: 'Wallets', type: 'wallet', isEnabled: false, icon: 'Wallet' },
  { id: '5', name: 'EMI', type: 'emi', isEnabled: false, icon: 'Calendar' }
]

export const smsProviders: SMSProvider[] = [
  {
    id: '1',
    name: 'MSG91',
    provider: 'msg91',
    isActive: true,
    senderId: 'SCHLCN',
    logo: '/sms/msg91.svg'
  },
  {
    id: '2',
    name: 'Twilio',
    provider: 'twilio',
    isActive: false,
    senderId: 'SCHOOL',
    logo: '/sms/twilio.svg'
  },
  {
    id: '3',
    name: 'TextLocal',
    provider: 'textlocal',
    isActive: false,
    senderId: 'TXTLCL',
    logo: '/sms/textlocal.svg'
  }
]

export const transportRoutes: TransportRoute[] = [
  {
    id: '1',
    name: 'North Zone Route',
    routeNumber: 'R-001',
    vehicleNumber: 'DL 01 AB 1234',
    driverName: 'Ramesh Kumar',
    driverPhone: '+91 98765 43210',
    isActive: true,
    stops: [
      { id: '1', name: 'Sector 10 Gate', arrivalTime: '07:00', departureTime: '07:05', sequence: 1, studentsCount: 12 },
      { id: '2', name: 'Model Town', arrivalTime: '07:15', departureTime: '07:18', sequence: 2, studentsCount: 8 },
      { id: '3', name: 'Civil Lines', arrivalTime: '07:30', departureTime: '07:33', sequence: 3, studentsCount: 15 },
      { id: '4', name: 'School Campus', arrivalTime: '07:45', departureTime: '-', sequence: 4, studentsCount: 0 }
    ]
  },
  {
    id: '2',
    name: 'South Zone Route',
    routeNumber: 'R-002',
    vehicleNumber: 'DL 02 CD 5678',
    driverName: 'Suresh Sharma',
    driverPhone: '+91 98765 12345',
    isActive: true,
    stops: [
      { id: '1', name: 'Vasant Kunj', arrivalTime: '07:00', departureTime: '07:05', sequence: 1, studentsCount: 10 },
      { id: '2', name: 'Saket', arrivalTime: '07:20', departureTime: '07:23', sequence: 2, studentsCount: 14 },
      { id: '3', name: 'School Campus', arrivalTime: '07:40', departureTime: '-', sequence: 3, studentsCount: 0 }
    ]
  }
]

export const adminAccounts: AdminAccount[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@dps.edu.in',
    phone: '+91 98765 00001',
    role: 'super_admin',
    department: 'Administration',
    isActive: true,
    lastLogin: '2024-01-15T10:30:00',
    createdAt: '2022-01-01T00:00:00'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@dps.edu.in',
    phone: '+91 98765 00002',
    role: 'admin',
    department: 'Academics',
    isActive: true,
    lastLogin: '2024-01-15T09:15:00',
    createdAt: '2022-06-15T00:00:00'
  },
  {
    id: '3',
    name: 'Amit Verma',
    email: 'amit.verma@dps.edu.in',
    phone: '+91 98765 00003',
    role: 'admin',
    department: 'Finance',
    isActive: true,
    lastLogin: '2024-01-14T16:45:00',
    createdAt: '2023-01-10T00:00:00'
  },
  {
    id: '4',
    name: 'Neha Singh',
    email: 'neha.singh@dps.edu.in',
    phone: '+91 98765 00004',
    role: 'admin',
    department: 'Transport',
    isActive: false,
    lastLogin: '2023-12-20T11:00:00',
    createdAt: '2023-03-01T00:00:00'
  }
]
