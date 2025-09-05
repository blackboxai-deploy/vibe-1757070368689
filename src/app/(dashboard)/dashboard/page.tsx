'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalConnections: 245,
    eventsAttended: 12,
    mentorshipSessions: 3,
    jobsApplied: 5
  });

  const [recentEvents] = useState([
    {
      id: 1,
      title: 'Tech Alumni Networking Night',
      date: new Date('2024-02-15T19:00:00'),
      location: 'San Francisco',
      attendees: 45,
      image: 'https://placehold.co/300x200?text=Tech+networking+event+in+modern+conference+room'
    },
    {
      id: 2,
      title: 'Career Development Webinar',
      date: new Date('2024-02-18T14:00:00'),
      location: 'Virtual',
      attendees: 120,
      image: 'https://placehold.co/300x200?text=Professional+development+webinar+setup'
    },
    {
      id: 3,
      title: 'Alumni Reunion 2024',
      date: new Date('2024-03-01T18:00:00'),
      location: 'University Campus',
      attendees: 200,
      image: 'https://placehold.co/300x200?text=University+campus+reunion+gathering'
    }
  ]);

  const [recentJobs] = useState([
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'Remote',
      salary: '$120K - $160K',
      postedBy: 'Sarah Chen',
      postedDate: new Date('2024-01-28')
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateCo',
      location: 'New York, NY',
      salary: '$130K - $180K',
      postedBy: 'Michael Rodriguez',
      postedDate: new Date('2024-01-25')
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'Boston, MA',
      salary: '$110K - $145K',
      postedBy: 'Emily Wang',
      postedDate: new Date('2024-01-22')
    }
  ]);

  const [mentorshipOpportunities] = useState([
    {
      id: 1,
      mentor: 'Dr. Jennifer Liu',
      title: 'VP of Engineering at CloudTech',
      expertise: ['Leadership', 'Cloud Architecture', 'Team Management'],
      rating: 4.9,
      sessions: 24,
      image: 'https://placehold.co/100x100?text=Professional+woman+mentor+headshot'
    },
    {
      id: 2,
      mentor: 'Robert Kim',
      title: 'Startup Founder & CEO',
      expertise: ['Entrepreneurship', 'Fundraising', 'Product Strategy'],
      rating: 4.8,
      sessions: 18,
      image: 'https://placehold.co/100x100?text=Startup+founder+professional+photo'
    }
  ]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-blue-100">
          Ready to connect with your alumni network? Here's what's happening in your community.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Connections</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalConnections}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Events Attended</p>
                <p className="text-2xl font-bold text-slate-900">{stats.eventsAttended}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Mentorship</p>
                <p className="text-2xl font-bold text-slate-900">{stats.mentorshipSessions}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Job Applications</p>
                <p className="text-2xl font-bold text-slate-900">{stats.jobsApplied}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Don't miss these networking opportunities</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/events">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-4 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/64x64?text=Event';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">{event.title}</h4>
                  <p className="text-sm text-slate-600">
                    {formatDate(event.date)} at {formatTime(event.date)}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-slate-500">{event.location}</span>
                    <span className="text-xs text-slate-500">{event.attendees} attending</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Latest Job Opportunities</CardTitle>
                <CardDescription>Opportunities from your alumni network</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/jobs">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{job.title}</h4>
                    <p className="text-sm text-slate-600">{job.company}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-slate-500">{job.location}</span>
                      <span className="text-xs font-medium text-green-600">{job.salary}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Posted by {job.postedBy} on {formatDate(job.postedDate)}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Apply</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mentorship Opportunities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Mentors</CardTitle>
              <CardDescription>Connect with experienced professionals in your field</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/mentorship">Explore Mentorship</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentorshipOpportunities.map((mentor) => (
              <div key={mentor.id} className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mentor.image} alt={mentor.mentor} />
                    <AvatarFallback>{mentor.mentor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{mentor.mentor}</h4>
                    <p className="text-sm text-slate-600 mb-2">{mentor.title}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {mentor.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span>⭐ {mentor.rating}</span>
                        <span>•</span>
                        <span>{mentor.sessions} sessions</span>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these popular features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link href="/dashboard/directory">
                <span className="text-2xl">🔍</span>
                <span className="font-medium">Find Alumni</span>
                <span className="text-xs text-slate-500">Search directory</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link href="/dashboard/events/create">
                <span className="text-2xl">📅</span>
                <span className="font-medium">Create Event</span>
                <span className="text-xs text-slate-500">Organize meetup</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link href="/dashboard/jobs/post">
                <span className="text-2xl">💼</span>
                <span className="font-medium">Post Job</span>
                <span className="text-xs text-slate-500">Share opportunity</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link href="/dashboard/donations">
                <span className="text-2xl">💝</span>
                <span className="font-medium">Donate</span>
                <span className="text-xs text-slate-500">Support alma mater</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}