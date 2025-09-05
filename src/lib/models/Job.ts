import mongoose, { Document, Model } from 'mongoose';
import { Job, JobType, ExperienceLevel, ApplicationStatus } from '@/types';

export interface IJob extends Omit<Job, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const SalaryRangeSchema = new mongoose.Schema({
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  period: { 
    type: String, 
    enum: ['hourly', 'monthly', 'yearly'],
    default: 'yearly'
  }
});

const JobLocationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    required: true
  },
  city: String,
  state: String,
  country: String
});

const JobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeUrl: String,
  coverLetter: String,
  status: {
    type: String,
    enum: Object.values(ApplicationStatus),
    default: ApplicationStatus.PENDING
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  notes: String
});

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  responsibilities: [{
    type: String,
    required: true
  }],
  type: {
    type: String,
    enum: Object.values(JobType),
    required: true
  },
  experience: {
    type: String,
    enum: Object.values(ExperienceLevel),
    required: true
  },
  location: {
    type: JobLocationSchema,
    required: true
  },
  salary: SalaryRangeSchema,
  skills: [String],
  benefits: [String],
  applicationUrl: String,
  applicationEmail: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [JobApplicationSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes for search and filtering
JobSchema.index({ title: 'text', description: 'text', company: 'text' });
JobSchema.index({ type: 1 });
JobSchema.index({ experience: 1 });
JobSchema.index({ 'location.type': 1 });
JobSchema.index({ 'location.city': 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ isActive: 1 });
JobSchema.index({ isFeatured: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ expiresAt: 1 });

// Virtual field for poster population
JobSchema.virtual('poster', {
  ref: 'User',
  localField: 'postedBy',
  foreignField: '_id',
  justOne: true
});

// Static method to find active jobs
JobSchema.statics.findActive = function(limit = 20) {
  return this.find({
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gte: new Date() } }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('postedBy', 'name profile.avatar profile.company');
};

// Static method to find jobs with filters
JobSchema.statics.findWithFilters = function(filters: any = {}, page = 1, limit = 20) {
  const query: any = { 
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gte: new Date() } }
    ]
  };

  if (filters.query) {
    query.$text = { $search: filters.query };
  }

  if (filters.type && filters.type.length > 0) {
    query.type = { $in: filters.type };
  }

  if (filters.experience && filters.experience.length > 0) {
    query.experience = { $in: filters.experience };
  }

  if (filters.location && filters.location.length > 0) {
    query.$or = [
      { 'location.city': { $in: filters.location } },
      { 'location.type': 'remote' }
    ];
  }

  if (filters.skills && filters.skills.length > 0) {
    query.skills = { $in: filters.skills };
  }

  if (filters.salaryMin || filters.salaryMax) {
    query['salary.min'] = {};
    if (filters.salaryMin) {
      query['salary.min'].$gte = filters.salaryMin;
    }
    if (filters.salaryMax) {
      query['salary.max'] = { $lte: filters.salaryMax };
    }
  }

  if (filters.datePosted) {
    const now = new Date();
    let dateFilter;
    
    switch (filters.datePosted) {
      case 'today':
        dateFilter = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = null;
    }
    
    if (dateFilter) {
      query.createdAt = { $gte: dateFilter };
    }
  }

  // Sorting
  let sort: any = {};
  if (filters.sortBy) {
    const order = filters.sortOrder === 'desc' ? -1 : 1;
    switch (filters.sortBy) {
      case 'date':
        sort = { createdAt: order };
        break;
      case 'salary':
        sort = { 'salary.min': order };
        break;
      case 'relevance':
        if (filters.query) {
          sort = { score: { $meta: 'textScore' } };
        } else {
          sort = { createdAt: -1 };
        }
        break;
      default:
        sort = { createdAt: -1 };
    }
  } else {
    sort = { createdAt: -1 };
  }

  const skip = (page - 1) * limit;

  return this.find(query)
    .populate('postedBy', 'name profile.avatar profile.company')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Method to check if user has applied
JobSchema.methods.hasUserApplied = function(userId: string) {
  return this.applications.some((app: any) => app.userId.toString() === userId);
};

// Method to get user's application
JobSchema.methods.getUserApplication = function(userId: string) {
  return this.applications.find((app: any) => app.userId.toString() === userId);
};

const JobModel: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default JobModel;