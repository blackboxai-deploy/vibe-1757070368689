import mongoose, { Document, Model } from 'mongoose';
import { Event, EventType, RSVPStatus } from '@/types';

export interface IEvent extends Omit<Event, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const EventLocationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['virtual', 'physical', 'hybrid'],
    required: true
  },
  address: String,
  city: String,
  state: String,
  country: String,
  virtualLink: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});

const RSVPSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(RSVPStatus),
    required: true
  },
  notes: String
}, {
  timestamps: true
});

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(EventType),
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: EventLocationSchema,
    required: true
  },
  maxAttendees: Number,
  currentAttendees: {
    type: Number,
    default: 0
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: String,
  tags: [String],
  rsvps: [RSVPSchema],
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for search and filtering
EventSchema.index({ title: 'text', description: 'text', tags: 'text' });
EventSchema.index({ type: 1 });
EventSchema.index({ startDate: 1 });
EventSchema.index({ endDate: 1 });
EventSchema.index({ 'location.city': 1 });
EventSchema.index({ isFeatured: 1 });
EventSchema.index({ isActive: 1 });
EventSchema.index({ organizerId: 1 });

// Virtual field for organizer population
EventSchema.virtual('organizer', {
  ref: 'User',
  localField: 'organizerId',
  foreignField: '_id',
  justOne: true
});

// Update currentAttendees when RSVP changes
EventSchema.pre('save', function(this: IEvent, next) {
  if (this.isModified('rsvps')) {
    this.currentAttendees = this.rsvps.filter(rsvp => rsvp.status === RSVPStatus.GOING).length;
  }
  next();
});

// Static method to find upcoming events
EventSchema.statics.findUpcoming = function(limit = 10) {
  return this.find({
    isActive: true,
    startDate: { $gte: new Date() }
  })
  .sort({ startDate: 1 })
  .limit(limit)
  .populate('organizerId', 'name profile.avatar');
};

// Static method to find events with filters
EventSchema.statics.findWithFilters = function(filters: any = {}, page = 1, limit = 20) {
  const query: any = { isActive: true };

  if (filters.query) {
    query.$text = { $search: filters.query };
  }

  if (filters.type && filters.type.length > 0) {
    query.type = { $in: filters.type };
  }

  if (filters.dateRange) {
    query.startDate = {
      $gte: filters.dateRange.start,
      $lte: filters.dateRange.end
    };
  }

  if (filters.location && filters.location.length > 0) {
    query['location.city'] = { $in: filters.location };
  }

  if (filters.isVirtual !== undefined) {
    query['location.type'] = filters.isVirtual ? 'virtual' : { $ne: 'virtual' };
  }

  // Sorting
  let sort: any = {};
  if (filters.sortBy) {
    const order = filters.sortOrder === 'desc' ? -1 : 1;
    switch (filters.sortBy) {
      case 'date':
        sort = { startDate: order };
        break;
      case 'title':
        sort = { title: order };
        break;
      case 'attendees':
        sort = { currentAttendees: order };
        break;
      default:
        sort = { startDate: 1 };
    }
  } else {
    sort = { startDate: 1 };
  }

  const skip = (page - 1) * limit;

  return this.find(query)
    .populate('organizerId', 'name profile.avatar')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Method to check if user has RSVP'd
EventSchema.methods.hasUserRSVPd = function(userId: string) {
  return this.rsvps.some((rsvp: any) => rsvp.userId.toString() === userId);
};

// Method to get user's RSVP status
EventSchema.methods.getUserRSVPStatus = function(userId: string) {
  const rsvp = this.rsvps.find((rsvp: any) => rsvp.userId.toString() === userId);
  return rsvp ? rsvp.status : null;
};

const EventModel: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default EventModel;