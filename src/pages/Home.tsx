import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  Target,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  Star,
  Laptop,
  BookOpenCheck
} from 'lucide-react';
import Testimonials from '../components/Testimonials';

const Home: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const stats = [
    { id: 1, name: 'Active Students', value: '10,000+', icon: <Users className="h-6 w-6" /> },
    { id: 2, name: 'Success Rate', value: '94%', icon: <TrendingUp className="h-6 w-6" /> },
    { id: 3, name: 'Course Completion', value: '98%', icon: <CheckCircle className="h-6 w-6" /> },
    { id: 4, name: 'Student Satisfaction', value: '4.8/5', icon: <Star className="h-6 w-6" /> },
  ];

  const features = [
    {
      id: 1,
      title: 'AI-Powered Learning Path',
      description: 'Get a personalized study plan that adapts to your progress and learning style',
      icon: <Brain className="h-6 w-6" />,
    },
    {
      id: 2,
      title: 'Smart Study Schedule',
      description: 'Optimize your study time with AI-generated schedules that work around your life',
      icon: <Clock className="h-6 w-6" />,
    },
    {
      id: 3,
      title: 'Interactive Resources',
      description: 'Access engaging study materials, practice questions, and video explanations',
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      id: 4,
      title: 'Progress Analytics',
      description: 'Track your improvement with detailed performance insights and recommendations',
      icon: <Target className="h-6 w-6" />,
    },
  ];

  const subjects = [
    { name: 'Mathematics', icon: <Award className="h-8 w-8" />, color: 'bg-blue-500' },
    { name: 'Physics', icon: <TrendingUp className="h-8 w-8" />, color: 'bg-purple-500' },
    { name: 'Chemistry', icon: <BookOpenCheck className="h-8 w-8" />, color: 'bg-green-500' },
    { name: 'Computer Science', icon: <Laptop className="h-8 w-8" />, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Video Background */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>
          <img
            src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Students studying"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-white ring-1 ring-inset ring-indigo-500/20">
                  Latest Update
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-white">
                  <span>New AI Features Released</span>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Transform Your Learning Journey with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Experience personalized education powered by artificial intelligence. Our platform adapts to your unique learning style, helping you achieve academic excellence with confidence.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/assessment"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start Free Assessment
              </Link>
              <Link to="/about" className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-12 sm:-mt-16 lg:-mt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-5xl backdrop-blur-lg bg-white/90 rounded-2xl shadow-xl ring-1 ring-gray-200/50 p-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="flex flex-col items-center justify-center text-center">
                  <dt className="text-base font-semibold leading-7 text-gray-600 flex items-center gap-2">
                    {stat.icon}
                    {stat.name}
                  </dt>
                  <dd className="text-3xl font-bold leading-9 tracking-tight text-indigo-600">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Smart Learning</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to excel in your studies
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our AI-powered platform combines cutting-edge technology with proven educational methods to create a truly personalized learning experience.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`flex flex-col p-6 rounded-xl transition-all duration-300 ${
                    activeFeature === feature.id
                      ? 'bg-indigo-50 shadow-lg scale-105'
                      : 'bg-white shadow-md hover:shadow-lg'
                  }`}
                  onMouseEnter={() => setActiveFeature(feature.id)}
                  onMouseLeave={() => setActiveFeature(null)}
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 text-white">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Comprehensive Coverage</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Master Key Subjects
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Explore our extensive collection of subjects, each carefully crafted to ensure deep understanding and retention.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <div className={`absolute inset-0 ${subject.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative p-8">
                  <div className={`${subject.color} inline-flex rounded-lg p-3 text-white ring-1 ring-inset ring-gray-200/20`}>
                    {subject.icon}
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                    {subject.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your learning experience?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join thousands of students who have already discovered the power of AI-powered personalized learning.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/assessment"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start Free Assessment
              </Link>
              <Link to="/about" className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 