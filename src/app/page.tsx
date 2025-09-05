'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const features = [
    {
      title: 'Alumni Directory',
      description: 'Connect with fellow alumni through our comprehensive searchable directory',
      benefits: ['Advanced search filters', 'LinkedIn integration', 'Profile insights', 'Export capabilities']
    },
    {
      title: 'Event Management',
      description: 'Discover and organize alumni events, reunions, and networking opportunities',
      benefits: ['Easy RSVP system', 'Calendar integration', 'Virtual & physical events', 'Event analytics']
    },
    {
      title: 'Mentorship Program',
      description: 'Get guidance from experienced alumni or become a mentor yourself',
      benefits: ['Smart matching', 'Session tracking', 'Feedback system', 'Category specialization']
    },
    {
      title: 'Job Board',
      description: 'Explore career opportunities and internships from the alumni network',
      benefits: ['Skill-based matching', 'Application tracking', 'Salary insights', 'Company profiles']
    },
    {
      title: 'Donation Platform',
      description: 'Support your alma mater through various giving opportunities',
      benefits: ['Campaign management', 'Impact reporting', 'Recurring donations', 'Tax receipts']
    },
    {
      title: 'Networking Hub',
      description: 'Engage in discussions and build meaningful professional relationships',
      benefits: ['Real-time messaging', 'Discussion forums', 'Group chats', 'AI recommendations']
    }
  ];

  const stats = [
    { label: 'Active Alumni', value: '15,000+' },
    { label: 'Events Hosted', value: '500+' },
    { label: 'Mentorship Connections', value: '2,500+' },
    { label: 'Job Opportunities', value: '1,200+' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-slate-800">AlumniConnect</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/directory" className="text-slate-600 hover:text-slate-900 transition-colors">
              Directory
            </Link>
            <Link href="/events" className="text-slate-600 hover:text-slate-900 transition-colors">
              Events
            </Link>
            <Link href="/jobs" className="text-slate-600 hover:text-slate-900 transition-colors">
              Jobs
            </Link>
            <Link href="/mentorship" className="text-slate-600 hover:text-slate-900 transition-colors">
              Mentorship
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Join Network</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              Connect, Grow, and
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {' '}Give Back
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Your comprehensive alumni network platform. Discover opportunities, find mentors, 
              attend exclusive events, and contribute to your alma mater's legacy.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" asChild>
                <Link href="/auth/register">Get Started Free</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/directory">Explore Directory</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                  <div className="text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Everything you need to stay connected
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Powerful features designed to strengthen your alumni network and create lasting professional relationships
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-600">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {feature.benefits.map((benefit) => (
                        <Badge key={benefit} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to reconnect with your network?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of alumni who are already building meaningful connections and advancing their careers
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">Create Your Profile</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold text-white">AlumniConnect</span>
              </div>
              <p className="text-sm">
                Connecting alumni worldwide through meaningful professional relationships and opportunities.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <div className="space-y-2 text-sm">
                <Link href="/directory" className="block hover:text-white transition-colors">Alumni Directory</Link>
                <Link href="/events" className="block hover:text-white transition-colors">Events</Link>
                <Link href="/jobs" className="block hover:text-white transition-colors">Job Board</Link>
                <Link href="/mentorship" className="block hover:text-white transition-colors">Mentorship</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <div className="space-y-2 text-sm">
                <Link href="/help" className="block hover:text-white transition-colors">Help Center</Link>
                <Link href="/contact" className="block hover:text-white transition-colors">Contact Us</Link>
                <Link href="/privacy" className="block hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Connect</h3>
              <div className="space-y-2 text-sm">
                <Link href="/donations" className="block hover:text-white transition-colors">Support Alumni</Link>
                <Link href="/messaging" className="block hover:text-white transition-colors">Community Forums</Link>
                <Link href="/admin" className="block hover:text-white transition-colors">Admin Portal</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 AlumniConnect. All rights reserved. Building stronger alumni communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}