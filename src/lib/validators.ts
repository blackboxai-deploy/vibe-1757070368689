import { z } from 'zod';
import { UserRole, EventType, JobType, ExperienceLevel, RSVPStatus } from '@/types';

// User validation schemas
export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.nativeEnum(UserRole),
  graduationYear: z.number().min(1950).max(new Date().getFullYear() + 10).optional(),
  department: z.string().min(2).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  }).optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional(),
  skills: z.array(z.string()).optional(),
  isPublic: z.boolean()
});

// Event validation schemas
export const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.nativeEnum(EventType),
  startDate: z.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Invalid start date',
  }),
  endDate: z.date({
    required_error: 'End date is required',
    invalid_type_error: 'Invalid end date',
  }),
  location: z.object({
    type: z.enum(['virtual', 'physical', 'hybrid']),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    virtualLink: z.string().url('Invalid virtual link').optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  }),
  maxAttendees: z.number().positive('Maximum attendees must be positive').optional(),
  tags: z.array(z.string()),
  isPublic: z.boolean()
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
}).refine(data => {
  if (data.location.type === 'virtual' || data.location.type === 'hybrid') {
    return !!data.location.virtualLink;
  }
  return true;
}, {
  message: "Virtual link is required for virtual or hybrid events",
  path: ["location.virtualLink"],
}).refine(data => {
  if (data.location.type === 'physical' || data.location.type === 'hybrid') {
    return !!data.location.address && !!data.location.city;
  }
  return true;
}, {
  message: "Address and city are required for physical or hybrid events",
  path: ["location.address"],
});

export const rsvpSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  status: z.nativeEnum(RSVPStatus),
  notes: z.string().max(200, 'Notes must be less than 200 characters').optional()
});

// Job validation schemas
export const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string().min(5, 'Each requirement must be at least 5 characters')).min(1, 'At least one requirement is needed'),
  responsibilities: z.array(z.string().min(5, 'Each responsibility must be at least 5 characters')).min(1, 'At least one responsibility is needed'),
  type: z.nativeEnum(JobType),
  experience: z.nativeEnum(ExperienceLevel),
  location: z.object({
    type: z.enum(['remote', 'onsite', 'hybrid']),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional()
  }),
  salary: z.object({
    min: z.number().positive('Minimum salary must be positive'),
    max: z.number().positive('Maximum salary must be positive'),
    currency: z.string().default('USD'),
    period: z.enum(['hourly', 'monthly', 'yearly']).default('yearly')
  }).optional(),
  skills: z.array(z.string()),
  benefits: z.array(z.string()),
  applicationUrl: z.string().url('Invalid application URL').optional(),
  applicationEmail: z.string().email('Invalid application email').optional(),
  expiresAt: z.date().optional()
}).refine(data => {
  if (data.salary) {
    return data.salary.max >= data.salary.min;
  }
  return true;
}, {
  message: "Maximum salary must be greater than or equal to minimum salary",
  path: ["salary.max"],
}).refine(data => {
  return data.applicationUrl || data.applicationEmail;
}, {
  message: "Either application URL or application email is required",
  path: ["applicationUrl"],
});

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  resumeUrl: z.string().url('Invalid resume URL').optional(),
  coverLetter: z.string().max(1000, 'Cover letter must be less than 1000 characters').optional()
});

// Search and filter schemas
export const alumniSearchSchema = z.object({
  query: z.string().optional(),
  graduationYear: z.array(z.number()).optional(),
  department: z.array(z.string()).optional(),
  company: z.array(z.string()).optional(),
  location: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  isAvailableForMentorship: z.boolean().optional(),
  sortBy: z.enum(['name', 'graduationYear', 'lastActive']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

export const eventSearchSchema = z.object({
  query: z.string().optional(),
  type: z.array(z.nativeEnum(EventType)).optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date()
  }).optional(),
  location: z.array(z.string()).optional(),
  isVirtual: z.boolean().optional(),
  sortBy: z.enum(['date', 'title', 'attendees']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

export const jobSearchSchema = z.object({
  query: z.string().optional(),
  type: z.array(z.nativeEnum(JobType)).optional(),
  experience: z.array(z.nativeEnum(ExperienceLevel)).optional(),
  location: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  datePosted: z.enum(['today', 'week', 'month', 'all']).optional(),
  sortBy: z.enum(['date', 'salary', 'relevance']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

// Donation schemas
export const donationSchema = z.object({
  amount: z.number().positive('Donation amount must be positive').min(1, 'Minimum donation is $1'),
  campaignId: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.enum(['monthly', 'quarterly', 'yearly']).optional(),
  dedicatedTo: z.string().max(100, 'Dedication must be less than 100 characters').optional(),
  message: z.string().max(500, 'Message must be less than 500 characters').optional()
}).refine(data => {
  if (data.isRecurring) {
    return !!data.recurringInterval;
  }
  return true;
}, {
  message: "Recurring interval is required for recurring donations",
  path: ["recurringInterval"],
});

// Message schemas
export const messageSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  content: z.string().min(1, 'Message content is required').max(1000, 'Message must be less than 1000 characters'),
  type: z.enum(['text', 'image', 'file']).default('text')
});

export const conversationSchema = z.object({
  type: z.enum(['direct', 'group', 'forum']),
  participants: z.array(z.string().min(1)).min(1, 'At least one participant is required'),
  title: z.string().optional()
});

// Mentorship schemas
export const mentorshipRequestSchema = z.object({
  mentorId: z.string().min(1, 'Mentor ID is required'),
  category: z.enum(['career', 'technical', 'entrepreneurship', 'personal_development']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  goals: z.array(z.string().min(5, 'Each goal must be at least 5 characters')).min(1, 'At least one goal is required')
});

export const mentorshipResponseSchema = z.object({
  mentorshipId: z.string().min(1, 'Mentorship ID is required'),
  action: z.enum(['accept', 'reject'])
});

// Type exports for use in components
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type JobFormData = z.infer<typeof jobSchema>;
export type DonationFormData = z.infer<typeof donationSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type AlumniSearchData = z.infer<typeof alumniSearchSchema>;
export type EventSearchData = z.infer<typeof eventSearchSchema>;
export type JobSearchData = z.infer<typeof jobSearchSchema>;