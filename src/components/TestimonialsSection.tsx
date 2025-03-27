import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { RiStarFill, RiStarHalfFill } from 'react-icons/ri';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Book Lover",
    company: "Literature Club",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    text: "ReadScape has completely transformed how I discover new books. The recommendations are spot-on and I've found authors I never would have discovered otherwise!",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Literature Professor",
    company: "State University",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    text: "As someone who reads professionally, I appreciate the vast selection and reliability of ReadScape. My students also love the accessible format and affordable prices.",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Avid Reader",
    company: "Book Club Organizer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    text: "I organize multiple book clubs and ReadScape makes it simple to coordinate our reading lists. The discounts for bulk purchases are amazing too!",
    rating: 4.5
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Tech Enthusiast",
    company: "Digital Nomad",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    text: "The mobile reading experience is flawless. I travel constantly and having my entire library in my pocket without taking up storage space is a game-changer.",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block text-purple-600 dark:text-purple-400 text-sm font-medium uppercase tracking-wider mb-4"
            style={{ letterSpacing: '0.2em' }}
          >
            TESTIMONIALS
          </motion.span>
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            What Our <span className="text-purple-600">Readers</span> Say
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied readers who have made ReadScape their go-to platform for literary exploration.
          </p>
        </div>

        {/* Testimonials carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="testimonials-swiper pb-16"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 h-full flex flex-col relative overflow-hidden"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-purple-500/10 to-pink-500/10 rounded-bl-full"></div>
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-t from-purple-500/10 to-pink-500/10 rounded-tr-full"></div>
                  
                  {/* Quote icon */}
                  <div className="text-gray-200 dark:text-gray-700 text-6xl font-serif absolute top-4 right-6">"</div>
                  
                  {/* Content */}
                  <div className="mb-6 flex-grow relative z-10">
                    <p className="text-gray-600 dark:text-gray-300 italic">
                      {testimonial.text}
                    </p>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                      <RiStarFill key={i} className="w-4 h-4" />
                    ))}
                    {testimonial.rating % 1 !== 0 && <RiStarHalfFill className="w-4 h-4" />}
                  </div>
                  
                  {/* User info */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-purple-500/50">
                      <img
                        src={testimonial.image || `https://ui-avatars.com/api/?name=${testimonial.name.replace(/\s/g, '+')}&background=random`}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role} · {testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection; 