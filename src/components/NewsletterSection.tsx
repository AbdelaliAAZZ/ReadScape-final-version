import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAlert } from '../App';
import { RiMailLine, RiNotificationLine } from 'react-icons/ri';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const { showAlert } = useAlert();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showAlert('Please enter your email address', 'error');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showAlert('Please enter a valid email address', 'error');
      return;
    }
    
    // Simulate success (this would be an API call in a real application)
    showAlert('Thank you for subscribing to our newsletter!', 'success');
    setEmail('');
  };

  return (
    <div className="py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20"></div>
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
        <svg className="absolute top-0 right-0 opacity-10 dark:opacity-5" width="800" height="800" viewBox="0 0 800 800">
          <path fill="currentColor" className="text-purple-500" d="M400,125C229.4,125,125,229.4,125,400s104.4,275,275,275s275-104.4,275-275S570.6,125,400,125z M400,650c-138.1,0-250-111.9-250-250s111.9-250,250-250s250,111.9,250,250S538.1,650,400,650z"/>
          <path fill="currentColor" className="text-pink-500" d="M550,300c0,82.8-67.2,150-150,150s-150-67.2-150-150s67.2-150,150-150S550,217.2,550,300z"/>
        </svg>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-purple-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Left: Newsletter content */}
            <div className="md:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  Get <span className="text-purple-600">Book Recommendations</span> Straight to Your Inbox
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 mb-6 rounded-full"></div>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-xl">
                  Subscribe to our newsletter and receive personalized reading suggestions, exclusive discounts, and updates on new releases.
                </p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    'Weekly curated book recommendations',
                    'Early access to new releases',
                    'Exclusive discounts and promotions',
                    'Literary insights and author interviews'
                  ].map((benefit, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                      viewport={{ once: true }}
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs mt-1">
                        ✓
                      </span>
                      <span className="ml-3 text-gray-600 dark:text-gray-300">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
            
            {/* Right: Subscription form */}
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-purple-500/10 to-pink-500/10 rounded-bl-full"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-t from-purple-500/10 to-pink-500/10 rounded-tr-full"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full mb-6 mx-auto">
                    <RiNotificationLine className="text-3xl text-purple-600 dark:text-purple-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                    Join Our Newsletter
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="w-full px-5 py-4 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-md"
                    >
                      Subscribe Now
                    </motion.button>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection; 