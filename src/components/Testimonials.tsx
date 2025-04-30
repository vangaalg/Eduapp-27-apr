import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  institute: string;
  rank: string;
  year: string;
  content: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    institute: "IIT Bombay",
    rank: "AIR 45",
    year: "2023",
    content: "EduPrepAI's personalized learning approach helped me identify and overcome my weak areas in Physics. The AI-driven practice questions were particularly helpful.",
    rating: 5,
    image: "/student1.jpg"
  },
  {
    id: 2,
    name: "Priya Patel",
    institute: "IIT Delhi",
    rank: "AIR 98",
    year: "2023",
    content: "The study schedule and progress tracking features kept me motivated throughout my preparation. I could see my improvement in real-time.",
    rating: 5,
    image: "/student2.jpg"
  },
  {
    id: 3,
    name: "Arun Kumar",
    institute: "IIT Madras",
    rank: "AIR 156",
    year: "2023",
    content: "What sets EduPrepAI apart is its adaptive learning system. The platform understood my learning pace and adjusted accordingly.",
    rating: 5,
    image: "/student3.jpg"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600">Hear from our students who cracked IIT-JEE with EduPrepAI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/48';
                    }}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                  <div className="text-sm text-gray-600">
                    {testimonial.institute} | {testimonial.rank}
                  </div>
                  <div className="text-xs text-gray-500">Batch of {testimonial.year}</div>
                </div>
              </div>

              <div className="mb-4 flex">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <Star
                    key={index}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <p className="text-gray-600 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            View More Success Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 