// User and Authentication Types
export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  ALUMNI = 'alumni',
  STUDENT = 'student',
  RECRUITER = 'recruiter'
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: Location;
  education?: Education[];
  experience?: Experience[];
  skills?: string[];
  socialLinks?: SocialLinks;
  graduationYear?: number;
  department?: string;
  company?: string;
  position?: string;
  linkedinUrl?: string;
  isPublic: boolean;
  lastActive?: Date;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  gpa?: number;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  isCurrent: boolean;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

// Event Types
export interface Event {
  _id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  location: EventLocation;
  maxAttendees?: number;
  currentAttendees: number;
  organizerId: string;
  organizer: User;
  image?: string;
  tags: string[];
  rsvps: RSVP[];
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum EventType {
  NETWORKING = 'networking',
  WEBINAR = 'webinar',
  REUNION = 'reunion',
  CAREER_FAIR = 'career_fair',
  WORKSHOP = 'workshop',
  SOCIAL = 'social'
}

export interface EventLocation {
  type: 'virtual' | 'physical' | 'hybrid';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  virtualLink?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface RSVP {
  userId: string;
  user: User;
  status: RSVPStatus;
  createdAt: Date;
  notes?: string;
}

export enum RSVPStatus {
  GOING = 'going',
  MAYBE = 'maybe',
  NOT_GOING = 'not_going'
}

// Job Board Types
export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  type: JobType;
  experience: ExperienceLevel;
  location: JobLocation;
  salary?: SalaryRange;
  skills: string[];
  benefits: string[];
  applicationUrl?: string;
  applicationEmail?: string;
  postedBy: string;
  poster: User;
  applications: JobApplication[];
  isActive: boolean;
  isFeatured: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship'
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  MID = 'mid',
  SENIOR = 'senior',
  EXECUTIVE = 'executive'
}

export interface JobLocation {
  type: 'remote' | 'onsite' | 'hybrid';
  city?: string;
  state?: string;
  country?: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
}

export interface JobApplication {
  userId: string;
  user: User;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: Date;
  notes?: string;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  INTERVIEWED = 'interviewed',
  OFFERED = 'offered',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

// Mentorship Types
export interface Mentorship {
  _id: string;
  mentorId: string;
  mentor: User;
  menteeId: string;
  mentee: User;
  status: MentorshipStatus;
  category: MentorshipCategory;
  description: string;
  goals: string[];
  sessions: MentorshipSession[];
  startDate: Date;
  endDate?: Date;
  feedback?: MentorshipFeedback[];
  createdAt: Date;
  updatedAt: Date;
}

export enum MentorshipStatus {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum MentorshipCategory {
  CAREER = 'career',
  TECHNICAL = 'technical',
  ENTREPRENEURSHIP = 'entrepreneurship',
  PERSONAL_DEVELOPMENT = 'personal_development'
}

export interface MentorshipSession {
  _id: string;
  date: Date;
  duration: number; // minutes
  type: 'virtual' | 'in_person';
  notes?: string;
  completedAt?: Date;
}

export interface MentorshipFeedback {
  fromUserId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}

// Donation Types
export interface Donation {
  _id: string;
  donorId: string;
  donor: User;
  campaignId?: string;
  campaign?: DonationCampaign;
  amount: number;
  currency: string;
  isAnonymous: boolean;
  isRecurring: boolean;
  recurringInterval?: RecurringInterval;
  paymentMethod: string;
  stripePaymentId: string;
  status: DonationStatus;
  dedicatedTo?: string;
  message?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum RecurringInterval {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export interface DonationCampaign {
  _id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  currency: string;
  startDate: Date;
  endDate?: Date;
  category: CampaignCategory;
  image?: string;
  organizer: User;
  donations: Donation[];
  isActive: boolean;
  isFeatured: boolean;
  impactReport?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CampaignCategory {
  SCHOLARSHIP = 'scholarship',
  INFRASTRUCTURE = 'infrastructure',
  RESEARCH = 'research',
  SPORTS = 'sports',
  GENERAL = 'general'
}

// Messaging Types
export interface Message {
  _id: string;
  senderId: string;
  sender: User;
  conversationId: string;
  content: string;
  type: MessageType;
  attachments?: MessageAttachment[];
  readBy: MessageRead[];
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system'
}

export interface MessageAttachment {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface MessageRead {
  userId: string;
  readAt: Date;
}

export interface Conversation {
  _id: string;
  type: ConversationType;
  participants: string[];
  participantUsers: User[];
  title?: string;
  lastMessage?: Message;
  lastActivity: Date;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
  FORUM = 'forum'
}

// Analytics Types
export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalEvents: number;
  upcomingEvents: number;
  totalJobs: number;
  totalDonations: number;
  donationAmount: number;
  eventAttendance: EventAttendanceData[];
  userGrowth: UserGrowthData[];
  donationTrends: DonationTrendData[];
  popularSkills: SkillData[];
  departmentDistribution: DepartmentData[];
  locationDistribution: LocationData[];
}

export interface EventAttendanceData {
  eventId: string;
  eventTitle: string;
  attendees: number;
  capacity: number;
  date: Date;
}

export interface UserGrowthData {
  date: Date;
  count: number;
  role: UserRole;
}

export interface DonationTrendData {
  date: Date;
  amount: number;
  count: number;
}

export interface SkillData {
  skill: string;
  count: number;
}

export interface DepartmentData {
  department: string;
  count: number;
}

export interface LocationData {
  location: string;
  count: number;
}

// Search and Filter Types
export interface AlumniSearchFilters {
  query?: string;
  graduationYear?: number[];
  department?: string[];
  company?: string[];
  location?: string[];
  skills?: string[];
  isAvailableForMentorship?: boolean;
  sortBy?: 'name' | 'graduationYear' | 'lastActive';
  sortOrder?: 'asc' | 'desc';
}

export interface JobSearchFilters {
  query?: string;
  type?: JobType[];
  experience?: ExperienceLevel[];
  location?: string[];
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  datePosted?: 'today' | 'week' | 'month' | 'all';
  sortBy?: 'date' | 'salary' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export interface EventSearchFilters {
  query?: string;
  type?: EventType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: string[];
  isVirtual?: boolean;
  sortBy?: 'date' | 'title' | 'attendees';
  sortOrder?: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  graduationYear?: number;
  department?: string;
  agreeToTerms: boolean;
}

export interface ProfileForm {
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  location?: Location;
  company?: string;
  position?: string;
  linkedinUrl?: string;
  skills?: string[];
  isPublic: boolean;
}

export interface EventForm {
  title: string;
  description: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  location: EventLocation;
  maxAttendees?: number;
  image?: File;
  tags: string[];
  isPublic: boolean;
}

export interface JobForm {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  type: JobType;
  experience: ExperienceLevel;
  location: JobLocation;
  salary?: SalaryRange;
  skills: string[];
  benefits: string[];
  applicationUrl?: string;
  applicationEmail?: string;
  expiresAt?: Date;
}