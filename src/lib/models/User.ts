import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '@/types';

// Extend the User interface to include mongoose Document methods
export interface IUser extends Omit<User, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const LocationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number
  }
});

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number, required: true },
  gpa: Number
});

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  description: { type: String, required: true },
  isCurrent: { type: Boolean, default: false }
});

const SocialLinksSchema = new mongoose.Schema({
  linkedin: String,
  twitter: String,
  github: String,
  website: String
});

const UserProfileSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: String,
  phone: String,
  bio: String,
  location: LocationSchema,
  education: [EducationSchema],
  experience: [ExperienceSchema],
  skills: [String],
  socialLinks: SocialLinksSchema,
  graduationYear: Number,
  department: String,
  company: String,
  position: String,
  linkedinUrl: String,
  isPublic: { type: Boolean, default: true },
  lastActive: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.ALUMNI
  },
  profile: {
    type: UserProfileSchema,
    required: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
UserSchema.index({
  name: 'text',
  'profile.bio': 'text',
  'profile.skills': 'text',
  'profile.company': 'text',
  'profile.position': 'text'
});

// Index for filtering
UserSchema.index({ 'profile.graduationYear': 1 });
UserSchema.index({ 'profile.department': 1 });
UserSchema.index({ 'profile.company': 1 });
UserSchema.index({ 'profile.location.city': 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(this: IUser, next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
UserSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

// Static method to find users for directory
UserSchema.statics.findForDirectory = function(filters: any = {}, page = 1, limit = 20) {
  const query: any = { 
    isActive: true,
    'profile.isPublic': true 
  };

  // Add search filters
  if (filters.query) {
    query.$text = { $search: filters.query };
  }

  if (filters.graduationYear && filters.graduationYear.length > 0) {
    query['profile.graduationYear'] = { $in: filters.graduationYear };
  }

  if (filters.department && filters.department.length > 0) {
    query['profile.department'] = { $in: filters.department };
  }

  if (filters.company && filters.company.length > 0) {
    query['profile.company'] = { $in: filters.company };
  }

  if (filters.location && filters.location.length > 0) {
    query['profile.location.city'] = { $in: filters.location };
  }

  if (filters.skills && filters.skills.length > 0) {
    query['profile.skills'] = { $in: filters.skills };
  }

  // Sorting
  let sort: any = {};
  if (filters.sortBy) {
    const order = filters.sortOrder === 'desc' ? -1 : 1;
    switch (filters.sortBy) {
      case 'name':
        sort = { name: order };
        break;
      case 'graduationYear':
        sort = { 'profile.graduationYear': order };
        break;
      case 'lastActive':
        sort = { 'profile.lastActive': order };
        break;
      default:
        sort = { name: 1 };
    }
  } else {
    sort = { name: 1 };
  }

  const skip = (page - 1) * limit;

  return this.find(query)
    .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Create the model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;