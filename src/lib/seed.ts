import dbConnect from './database';
import User from './models/User';
import EventModel from './models/Event';
import JobModel from './models/Job';
import { UserRole, EventType, JobType, ExperienceLevel } from '@/types';

// Sample data for seeding
const sampleUsers = [
  {
    email: 'admin@university.edu',
    password: 'admin123',
    name: 'System Administrator',
    role: UserRole.ADMIN,
    profile: {
      firstName: 'System',
      lastName: 'Administrator',
      isPublic: false,
      lastActive: new Date()
    }
  },
  {
    email: 'john.doe@university.edu',
    password: 'password123',
    name: 'John Doe',
    role: UserRole.ALUMNI,
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      graduationYear: 2018,
      department: 'Computer Science',
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      location: {
        city: 'San Francisco',
        state: 'CA',
        country: 'USA'
      },
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      bio: 'Passionate software engineer with 6 years of experience in full-stack development.',
      isPublic: true,
      lastActive: new Date()
    }
  },
  {
    email: 'sarah.chen@university.edu',
    password: 'password123',
    name: 'Sarah Chen',
    role: UserRole.ALUMNI,
    profile: {
      firstName: 'Sarah',
      lastName: 'Chen',
      graduationYear: 2016,
      department: 'Business Administration',
      company: 'InnovateCo',
      position: 'Product Manager',
      location: {
        city: 'New York',
        state: 'NY',
        country: 'USA'
      },
      skills: ['Product Management', 'Strategy', 'Analytics', 'Leadership'],
      bio: 'Product leader focused on building user-centric solutions.',
      isPublic: true,
      lastActive: new Date()
    }
  },
  {
    email: 'michael.rodriguez@university.edu',
    password: 'password123',
    name: 'Michael Rodriguez',
    role: UserRole.ALUMNI,
    profile: {
      firstName: 'Michael',
      lastName: 'Rodriguez',
      graduationYear: 2019,
      department: 'Engineering',
      company: 'CloudTech Solutions',
      position: 'DevOps Engineer',
      location: {
        city: 'Austin',
        state: 'TX',
        country: 'USA'
      },
      skills: ['DevOps', 'Kubernetes', 'Docker', 'CI/CD', 'Terraform'],
      bio: 'DevOps specialist passionate about automation and scalable systems.',
      isPublic: true,
      lastActive: new Date()
    }
  },
  {
    email: 'emily.wang@university.edu',
    password: 'password123',
    name: 'Emily Wang',
    role: UserRole.ALUMNI,
    profile: {
      firstName: 'Emily',
      lastName: 'Wang',
      graduationYear: 2020,
      department: 'Mathematics',
      company: 'Analytics Pro',
      position: 'Senior Data Scientist',
      location: {
        city: 'Boston',
        state: 'MA',
        country: 'USA'
      },
      skills: ['Machine Learning', 'Python', 'R', 'Statistics', 'Data Visualization'],
      bio: 'Data scientist specializing in machine learning and predictive analytics.',
      isPublic: true,
      lastActive: new Date()
    }
  },
  {
    email: 'student@university.edu',
    password: 'password123',
    name: 'Alex Johnson',
    role: UserRole.STUDENT,
    profile: {
      firstName: 'Alex',
      lastName: 'Johnson',
      graduationYear: 2025,
      department: 'Computer Science',
      location: {
        city: 'University Town',
        state: 'CA',
        country: 'USA'
      },
      skills: ['Python', 'Java', 'React', 'Machine Learning'],
      bio: 'Computer Science student passionate about AI and software development.',
      isPublic: true,
      lastActive: new Date()
    }
  },
  {
    email: 'recruiter@techcorp.com',
    password: 'password123',
    name: 'Lisa Thompson',
    role: UserRole.RECRUITER,
    profile: {
      firstName: 'Lisa',
      lastName: 'Thompson',
      company: 'TechCorp Inc.',
      position: 'Senior Technical Recruiter',
      location: {
        city: 'San Francisco',
        state: 'CA',
        country: 'USA'
      },
      skills: ['Technical Recruiting', 'Talent Acquisition', 'Interviewing'],
      bio: 'Experienced technical recruiter helping top talent find their dream jobs.',
      isPublic: true,
      lastActive: new Date()
    }
  }
];

const sampleEvents = [
  {
    title: 'Tech Alumni Networking Night',
    description: 'Join fellow tech alumni for an evening of networking, sharing experiences, and building connections. Light refreshments will be provided.',
    type: EventType.NETWORKING,
    startDate: new Date('2024-02-15T19:00:00'),
    endDate: new Date('2024-02-15T22:00:00'),
    location: {
      type: 'physical' as const,
      address: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA'
    },
    maxAttendees: 50,
    tags: ['networking', 'technology', 'careers'],
    isPublic: true,
    isFeatured: true
  },
  {
    title: 'Career Development Webinar',
    description: 'Learn the latest strategies for career advancement in the tech industry. Features panel discussion with successful alumni.',
    type: EventType.WEBINAR,
    startDate: new Date('2024-02-18T14:00:00'),
    endDate: new Date('2024-02-18T15:30:00'),
    location: {
      type: 'virtual' as const,
      virtualLink: 'https://zoom.us/meeting/example'
    },
    maxAttendees: 200,
    tags: ['career', 'professional development', 'webinar'],
    isPublic: true,
    isFeatured: false
  },
  {
    title: 'Alumni Reunion 2024',
    description: 'Annual alumni reunion celebrating our community. Includes dinner, awards ceremony, and campus tours.',
    type: EventType.REUNION,
    startDate: new Date('2024-03-01T18:00:00'),
    endDate: new Date('2024-03-01T23:00:00'),
    location: {
      type: 'physical' as const,
      address: 'University Campus Center',
      city: 'University Town',
      state: 'CA',
      country: 'USA'
    },
    maxAttendees: 300,
    tags: ['reunion', 'celebration', 'community'],
    isPublic: true,
    isFeatured: true
  }
];

const sampleJobs = [
  {
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    description: 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable web applications.',
    requirements: [
      '5+ years of software development experience',
      'Strong proficiency in JavaScript and React',
      'Experience with Node.js and database systems',
      'Familiarity with cloud platforms (AWS, Azure)',
      'Excellent problem-solving skills'
    ],
    responsibilities: [
      'Design and develop high-quality software solutions',
      'Collaborate with cross-functional teams',
      'Mentor junior developers',
      'Participate in code reviews and architecture decisions',
      'Contribute to technical documentation'
    ],
    type: JobType.FULL_TIME,
    experience: ExperienceLevel.SENIOR,
    location: {
      type: 'hybrid' as const,
      city: 'San Francisco',
      state: 'CA',
      country: 'USA'
    },
    salary: {
      min: 120000,
      max: 160000,
      currency: 'USD',
      period: 'yearly' as const
    },
    skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'TypeScript'],
    benefits: ['Health insurance', '401k matching', 'Flexible PTO', 'Remote work'],
    applicationEmail: 'careers@techcorp.com',
    isActive: true,
    isFeatured: true
  },
  {
    title: 'Product Manager',
    company: 'InnovateCo',
    description: 'Join our product team to drive the development of cutting-edge solutions. Lead product strategy and work with engineering teams to deliver exceptional user experiences.',
    requirements: [
      '3+ years of product management experience',
      'Strong analytical and problem-solving skills',
      'Experience with agile development methodologies',
      'Excellent communication and leadership skills',
      'Technical background preferred'
    ],
    responsibilities: [
      'Define product vision and strategy',
      'Manage product roadmap and prioritization',
      'Work closely with engineering and design teams',
      'Conduct market research and user interviews',
      'Track and analyze product metrics'
    ],
    type: JobType.FULL_TIME,
    experience: ExperienceLevel.MID,
    location: {
      type: 'onsite' as const,
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    salary: {
      min: 130000,
      max: 180000,
      currency: 'USD',
      period: 'yearly' as const
    },
    skills: ['Product Management', 'Strategy', 'Analytics', 'Agile', 'Leadership'],
    benefits: ['Health insurance', 'Equity', 'Professional development budget'],
    applicationUrl: 'https://innovateco.com/careers',
    isActive: true,
    isFeatured: false
  },
  {
    title: 'Data Scientist Intern',
    company: 'Analytics Pro',
    description: 'Summer internship opportunity for students interested in data science and machine learning. Work on real projects with our data science team.',
    requirements: [
      'Currently enrolled in relevant degree program',
      'Strong foundation in statistics and mathematics',
      'Programming experience in Python or R',
      'Familiarity with machine learning concepts',
      'Strong analytical thinking'
    ],
    responsibilities: [
      'Assist with data analysis and modeling projects',
      'Develop machine learning models',
      'Create data visualizations and reports',
      'Participate in team meetings and code reviews',
      'Present findings to stakeholders'
    ],
    type: JobType.INTERNSHIP,
    experience: ExperienceLevel.ENTRY,
    location: {
      type: 'remote' as const
    },
    salary: {
      min: 25,
      max: 30,
      currency: 'USD',
      period: 'hourly' as const
    },
    skills: ['Python', 'Machine Learning', 'Statistics', 'Data Analysis'],
    benefits: ['Mentorship', 'Learning opportunities', 'Flexible schedule'],
    applicationEmail: 'internships@analyticspro.com',
    isActive: true,
    isFeatured: false,
    expiresAt: new Date('2024-03-31')
  }
];

export async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await EventModel.deleteMany({});
    await JobModel.deleteMany({});
    
    // Create users
    console.log('Creating users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);
    
    // Create events (assign to first admin/alumni user as organizer)
    console.log('Creating events...');
    const adminUser = createdUsers.find(user => user.role === UserRole.ADMIN);
    const eventsWithOrganizer = sampleEvents.map(event => ({
      ...event,
      organizerId: adminUser!._id
    }));
    const createdEvents = await EventModel.insertMany(eventsWithOrganizer);
    console.log(`Created ${createdEvents.length} events`);
    
    // Create jobs (assign to alumni users as posters)
    console.log('Creating jobs...');
    const alumniUsers = createdUsers.filter(user => user.role === UserRole.ALUMNI);
    const jobsWithPosters = sampleJobs.map((job, index) => ({
      ...job,
      postedBy: alumniUsers[index % alumniUsers.length]._id
    }));
    const createdJobs = await JobModel.insertMany(jobsWithPosters);
    console.log(`Created ${createdJobs.length} jobs`);
    
    console.log('Database seeding completed successfully!');
    
    return {
      users: createdUsers.length,
      events: createdEvents.length,
      jobs: createdJobs.length
    };
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then((result) => {
      console.log('Seeding results:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}