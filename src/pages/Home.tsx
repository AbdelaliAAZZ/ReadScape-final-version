import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import React Icons
import {
  RiHeartLine,
  RiHeartFill,
  RiEyeLine,
  RiStarFill,
  RiStarHalfFill,
  RiArrowUpLine,
  RiShieldCheckLine,
  RiTruckLine,
  RiSecurePaymentLine,
  RiCheckLine,
  RiShoppingCart2Line
} from 'react-icons/ri';

// Import data and custom hooks
import {
  Book,
  trendingBooks,
  Service,
  upcomingBooks,
} from '../data/books';
import { useAlert } from '../App';
import NewsletterSection from "../components/NewsletterSection";
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

// Example services array
const services: Service[] = [
  {
    icon: RiShieldCheckLine,
    title: 'Original Content',
    description: 'Only verified and quality books',
  },
  {
    icon: RiTruckLine,
    title: 'Fast Delivery',
    description: 'Instant access to digital content',
  },
  {
    icon: RiSecurePaymentLine,
    title: 'Secure Payments',
    description: 'Multiple secure payment options',
  },
  {
    icon: RiCheckLine,
    title: 'Money-back Guarantee',
    description: '30-day satisfaction guarantee',
  },
];

// Animation variants for staggering child elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

// A shared component for consistent section backgrounds
interface SectionBackgroundProps {
  children: React.ReactNode;
  darkBg?: boolean;
}

const SectionBackground: React.FC<SectionBackgroundProps> = ({ children, darkBg = false }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background styling */}
      <div className={`absolute inset-0 z-0 ${darkBg ? "bg-white dark:bg-gray-900/90" : "bg-gray-50 dark:bg-gray-900/60"}`}></div>
      <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/**
 *hada tartib dyal sections in home page
 * Displays:
 * - Hero section with animated background
 * - Services
 * - Trending books
 * - Discount highlight
 * - Upcoming books
 * - Testimonials
 * - Newsletter signup
 * - Scroll-to-top floating button
 */
const Home = () => {
  const { showAlert } = useAlert();

  // Add style tag for keyframes animations
  const keyframesStyle = `
    @keyframes scroll {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(-800px, -800px);
      }
    }
    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    /* Active slide styling */
    .swiper-slide-active .swiper-slide-book > div {
      transform: scale(1.05);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
  `;

  // Button to scroll back up
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Local tracking of which books have been "liked"
  const [likedBooks, setLikedBooks] = useState<Record<number, boolean>>({});

  // When the user scrolls beyond a threshold (500px), show the scroll-up button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize likedBooks from localStorage on component load
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        const favorites = JSON.parse(storedFavorites);
        const likedState: Record<number, boolean> = {};
        favorites.forEach((book: Book) => {
          likedState[book.id] = true;
        });
        setLikedBooks(likedState);
      } catch (error) {
        console.error('Error parsing favorites from localStorage', error);
      }
    }
  }, []);

  /**
   * Scroll smoothly to a specific section by ID
   * This is triggered by an <a> or <button> "onClick" event.
   */
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Scroll smoothly to the top of the page.
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /**
   * Add or remove book from "favorites" (liked list).
   */
  const addToFavorites = (book: Book) => {
    // Get existing favorites from localStorage
    const storedFavorites = localStorage.getItem('favorites');
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    // Check if book is already in favorites
    const existingIndex = favorites.findIndex((item: Book) => item.id === book.id);
    
    // Update local state for UI feedback
    setLikedBooks((prev) => {
      const newState = { ...prev };
      
      if (existingIndex >= 0) {
        // Book exists in favorites, so we're removing it
        newState[book.id] = false;
      } else {
        // Book doesn't exist in favorites, so we're adding it
        newState[book.id] = true;
      }
      
      return newState;
    });
    
    if (existingIndex >= 0) {
      // If book exists, remove it
      favorites = favorites.filter((item: Book) => item.id !== book.id);
      showAlert(`${book.title} removed from favorites!`, 'success');
    } else {
      // If book doesn't exist, add it
      favorites.push(book);
      showAlert(`${book.title} added to favorites!`, 'success');
    }
    
    // Save updated favorites to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Dispatch custom event to notify other components (like Navbar)
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  /**
   * Add selected book to cart in localStorage.
   * - If the book is already in cart, increase its quantity.
   * - Otherwise, add it with quantity = 1
   */
  const addToCart = (book: Book) => {
    const storedCart = localStorage.getItem('cartItems');
    const cartItems = storedCart ? JSON.parse(storedCart) : [];

    const existingItemIndex = cartItems.findIndex(
      (item: Book) => item.id === book.id
    );

    if (existingItemIndex >= 0) {
      const updatedCartItems = [...cartItems];
      const existingItem = updatedCartItems[existingItemIndex];
      updatedCartItems[existingItemIndex] = {
        ...existingItem,
        quantity: (existingItem.quantity || 1) + 1,
      };
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } else {
      const updatedCartItems = [...cartItems, { ...book, quantity: 1 }];
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }

    // Dispatch custom event to notify other components (e.g., a Cart badge)
    window.dispatchEvent(new Event('cartUpdated'));

    showAlert(`${book.title} added to cart!`, 'success');
  };

  return (
    <div className="pt-16 bg-white dark:bg-[var(--color-dark-bg-primary)]">
      {/* Styles for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: keyframesStyle }} />
      
      {/* HERO SECTION */}
      <SectionBackground>
        <section
          id="home"
          className="min-h-[calc(100vh-4rem)] py-20 flex items-center"
        >
          {/* Hero content */}
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-5xl md:text-7xl font-bold leading-tight mb-10 text-gray-900 dark:text-white"
                >
                  Say goodbye to <span className="relative inline-block">
                    browsing
                    <span className="absolute bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></span>
                  </span> for your next <span className="relative inline-block">
                    book
                    <span className="absolute bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></span>
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto md:mx-0"
                >
                  With access to over 10,000 titles across all genres, you can find your perfect read and save thousands of hours using the world's largest digital books library.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start"
                >
                  <Link
                    to="/books"
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-lg text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Explore Library
                  </Link>
                  <a
                    href="#trending"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('trending');
                    }}
                    className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-lg font-medium border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Popular Books
                  </a>
                </motion.div>
              </div>

              {/* Right side: Book images */}
              <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="relative"
                >
                  <div className="grid grid-cols-3 gap-3">
                    {/* First Book - Left */}
                    <div className="relative perspective-1000">
                      <motion.div
                        initial={{ rotateY: -15, rotate: -10 }}
                        animate={{ 
                          y: [0, -5, 0], 
                          boxShadow: [
                            "0 10px 30px rgba(124, 58, 237, 0.3)",
                            "0 15px 35px rgba(124, 58, 237, 0.4)",
                            "0 10px 30px rgba(124, 58, 237, 0.3)"
                          ]
                        }}
                        transition={{ 
                          y: { repeat: Infinity, duration: 3, ease: "easeInOut", repeatType: "loop" },
                          boxShadow: { repeat: Infinity, duration: 3, ease: "easeInOut", repeatType: "loop" }
                        }}
                        className="relative shadow-2xl rounded-lg overflow-hidden book-hover-target"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Glowing border effect */}
                        <motion.div 
                          className="absolute inset-0 rounded-lg z-0"
                          animate={{ 
                            boxShadow: [
                              "0 0 0 0px rgba(139, 92, 246, 0)",
                              "0 0 0 3px rgba(139, 92, 246, 0.3)",
                              "0 0 0 0px rgba(139, 92, 246, 0)"
                            ]
                          }} 
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
                        />
                        
                        <img
                    src="/assets/img/book-1.jpg"
                          alt="Book cover"
                          className="w-full aspect-[2/3] object-cover shadow-xl rounded-lg relative z-10"
                        />
                        
                        {/* Floating particles - continue animating on hover */}
                        <motion.div 
                          className="absolute top-1/4 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-70 z-20"
                          animate={{ 
                            y: [0, -10, 0],
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            delay: 0.5,
                            repeatType: "loop"
                          }}
                        />
                        
                        <motion.div 
                          className="absolute bottom-1/3 -left-1 w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-70 z-20"
                          animate={{ 
                            y: [0, -15, 0],
                            scale: [1, 0.8, 1],
                            opacity: [0.7, 0.9, 0.7]
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                        />
                        
                        {/* Book info overlay */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-800/50 to-transparent opacity-0 z-20 flex flex-col justify-end p-4 rounded-lg transition-opacity duration-300 book-overlay"
                        >
                          <div
                            className="transform translate-y-4 opacity-0 transition-all duration-300 book-details"
                          >
                            <p className="font-bold text-white text-sm">The Silent Patient</p>
                            <p className="text-xs text-white/80 mt-1">Alex Michaelides</p>
                            <div className="flex items-center mt-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <RiStarFill key={i} className="w-3 h-3" />
                                ))}
                              </div>
                              <span className="text-white/80 text-xs ml-1">(4.5)</span>
                            </div>
                            <Link
                              to="/details/1"
                              className="mt-3 text-xs font-medium bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-1 px-3 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 inline-block"
                            >
                              View Details
                            </Link>
                          </div>
                </div>
              </motion.div>
            </div>
                    
                    {/* Second Book - Middle */}
                    <div className="relative mt-6 z-10 perspective-1000">
                      <motion.div
                        initial={{ y: 0 }}
                        animate={{ 
                          y: [-8, 0, -8], 
                          boxShadow: [
                            "0 15px 30px rgba(236, 72, 153, 0.3)",
                            "0 20px 40px rgba(236, 72, 153, 0.4)",
                            "0 15px 30px rgba(236, 72, 153, 0.3)"
                          ]
                        }}
                        transition={{ 
                          duration: 4, 
                          ease: "easeInOut", 
                          repeat: Infinity,
                          times: [0, 0.5, 1],
                          repeatType: "loop"
                        }}
                        className="relative shadow-2xl rounded-lg overflow-hidden book-hover-target"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Pulsing border effect */}
                        <motion.div 
                          className="absolute inset-0 rounded-lg z-0"
                          animate={{ 
                            boxShadow: [
                              "0 0 0 0px rgba(244, 114, 182, 0)",
                              "0 0 0 3px rgba(244, 114, 182, 0.3)",
                              "0 0 0 0px rgba(244, 114, 182, 0)"
                            ]
                          }} 
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2, repeatType: "loop" }}
                        />
                        
                        <img
                          src="/assets/img/book-2.jpg"
                          alt="Book cover"
                          className="w-full aspect-[2/3] object-cover shadow-xl rounded-lg relative z-10"
                        />
                        
                        {/* Floating particles */}
                        <motion.div 
                          className="absolute -top-1 right-1/4 w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-70 z-20 blur-[1px]"
                          animate={{ 
                            y: [0, -20, 0],
                            x: [0, 10, 0],
                            scale: [1, 0.8, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 5, 
                            repeat: Infinity,
                            delay: 1,
                            repeatType: "loop"
                          }}
                        />
                        
                        <motion.div 
                          className="absolute bottom-1/4 -left-2 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 opacity-70 z-20 blur-[1px]"
                          animate={{ 
                            y: [0, 15, 0],
                            x: [0, -5, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 0.9, 0.7]
                          }}
                          transition={{ 
                            duration: 6, 
                            repeat: Infinity,
                            delay: 0.5,
                            repeatType: "loop"
                          }}
                        />
                        
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-30"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5, 
                            delay: 0.5,
                            ease: "easeInOut",
                            repeatDelay: 3,
                            repeatType: "loop"
                          }}
                        />
                        
                        {/* Book info overlay */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-pink-800/50 to-transparent opacity-0 z-20 flex flex-col justify-end p-4 rounded-lg transition-opacity duration-300 book-overlay"
                        >
                          <div
                            className="transform translate-y-4 opacity-0 transition-all duration-300 book-details"
                          >
                            <p className="font-bold text-white text-sm">Atomic Habits</p>
                            <p className="text-xs text-white/80 mt-1">James Clear</p>
                            <div className="flex items-center mt-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <RiStarFill key={i} className="w-3 h-3" />
                                ))}
                              </div>
                              <span className="text-white/80 text-xs ml-1">(4.8)</span>
                            </div>
                            <Link
                              to="/details/2"
                              className="mt-3 text-xs font-medium bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-1 px-3 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 inline-block"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </motion.div>
          </div>

                    {/* Third Book - Right */}
                    <div className="relative perspective-1000">
                      <motion.div
                        initial={{ rotateY: 15, rotate: 10 }}
                        animate={{ 
                          y: [0, -7, 0], 
                          boxShadow: [
                            "0 10px 30px rgba(59, 130, 246, 0.3)",
                            "0 15px 35px rgba(59, 130, 246, 0.4)",
                            "0 10px 30px rgba(59, 130, 246, 0.3)"
                          ]
                        }}
                        transition={{ 
                          y: { repeat: Infinity, duration: 3.5, ease: "easeInOut", repeatType: "loop" },
                          boxShadow: { repeat: Infinity, duration: 3.5, ease: "easeInOut", repeatType: "loop" },
                          delay: 0.3
                        }}
                        className="relative shadow-2xl rounded-lg overflow-hidden book-hover-target"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Glowing border effect */}
                        <motion.div 
                          className="absolute inset-0 rounded-lg z-0"
                          animate={{ 
                            boxShadow: [
                              "0 0 0 0px rgba(59, 130, 246, 0)",
                              "0 0 0 3px rgba(59, 130, 246, 0.3)",
                              "0 0 0 0px rgba(59, 130, 246, 0)"
                            ]
                          }} 
                          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4, repeatType: "loop" }}
                        />
                        
                        <img
                          src="/assets/img/book-3.jpg"
                          alt="Book cover"
                          className="w-full aspect-[2/3] object-cover shadow-xl rounded-lg relative z-10"
                        />
                        
                        {/* Floating particles */}
                        <motion.div 
                          className="absolute top-1/3 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-70 z-20 blur-[1px]"
                          animate={{ 
                            y: [0, -15, 0],
                            scale: [1, 0.9, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 4.5, 
                            repeat: Infinity,
                            delay: 1.5,
                            repeatType: "loop"
                          }}
                        />
                        
                        <motion.div 
                          className="absolute bottom-1/4 -left-2 w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-70 z-20"
                          animate={{ 
                            y: [0, 10, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 0.9, 0.7]
                          }}
                          transition={{ 
                            duration: 3.5, 
                            repeat: Infinity,
                            delay: 1,
                            repeatType: "loop"
                          }}
                        />
                        
                        {/* Book info overlay */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent opacity-0 z-20 flex flex-col justify-end p-4 rounded-lg transition-opacity duration-300 book-overlay"
                        >
                          <div
                            className="transform translate-y-4 opacity-0 transition-all duration-300 book-details"
                          >
                            <p className="font-bold text-white text-sm">Psychology of Money</p>
                            <p className="text-xs text-white/80 mt-1">Morgan Housel</p>
                            <div className="flex items-center mt-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <RiStarFill key={i} className="w-3 h-3" />
                                ))}
      </div>
                              <span className="text-white/80 text-xs ml-1">(4.7)</span>
                            </div>
                            <Link
                              to="/details/3"
                              className="mt-3 text-xs font-medium bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-1 px-3 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 inline-block"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </SectionBackground>

      {/* SERVICES SECTION */}
      <SectionBackground>
        <section id="services" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Our <span className="text-purple-600">Services</span>
            </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Experience premium e-book services designed to enhance your reading journey.
            </p>
          </div>

            {/* Services with arrows connecting them */}
            <div className="relative">
              <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
            {services.map((service, index) => {
                  let IconComponent = null;
                  
                  // Assign unique animations for each icon
              if (service.icon === RiShieldCheckLine) {
                    IconComponent = <RiShieldCheckLine className="text-4xl text-purple-600 dark:text-purple-400" />;
              } else if (service.icon === RiTruckLine) {
                    IconComponent = <RiTruckLine className="text-4xl text-purple-600 dark:text-purple-400" />;
              } else if (service.icon === RiSecurePaymentLine) {
                    IconComponent = <RiSecurePaymentLine className="text-4xl text-purple-600 dark:text-purple-400" />;
              } else if (service.icon === RiCheckLine) {
                    IconComponent = <RiCheckLine className="text-4xl text-purple-600 dark:text-purple-400" />;
              }
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex flex-col items-center text-center mb-8 md:mb-0 relative z-10"
                    >
                      <div className={`w-24 h-24 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/20 flex items-center justify-center mb-4 relative group overflow-hidden`}>
                        {/* Animated glow effect */}
                        <motion.div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100"
                          animate={{ 
                            boxShadow: ["0 0 0 0px rgba(168, 85, 247, 0.4)", "0 0 0 10px rgba(168, 85, 247, 0)", "0 0 0 0px rgba(168, 85, 247, 0.4)"]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                          }}
                        />
                        
                        {/* Animated background shape */}
                        <motion.div 
                          className="absolute inset-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/30"
                          animate={{ 
                            rotate: [0, 360],
                            scale: [0.8, 1, 0.8],
                            borderRadius: ["40% 60% 60% 40% / 40% 40% 60% 60%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 60% 40% / 40% 40% 60% 60%"]
                          }}
                          transition={{ 
                            duration: 8, 
                            repeat: Infinity, 
                            repeatType: "reverse"
                          }}
                        />
                        
                        {/* Icon with hover effect */}
                        <motion.div
                          whileHover={{ 
                            scale: 1.2,
                            rotate: service.icon === RiTruckLine ? 10 : 0
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="relative z-10"
                        >
                          {IconComponent}
                        </motion.div>
                        
                        {/* Orbiting dots */}
                        <motion.div
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute w-full h-full pointer-events-none"
                        >
                          <div className="absolute -right-1 top-1/2 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-md" />
                        </motion.div>
                        
                        {/* Second orbiting dot with different timing */}
                        <motion.div
                          animate={{
                            rotate: [360, 0],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute w-full h-full pointer-events-none"
                        >
                          <div className="absolute left-0 top-1/4 w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-sm" />
                        </motion.div>
                  </div>
                      <h3 className="text-xl font-semibold mb-2 dark:text-white">
                    {service.title}
                  </h3>
                      <p className="text-gray-600 dark:text-gray-300 max-w-[200px]">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
              </div>
            </div>
        </div>
      </section>
      </SectionBackground>

      {/* TRENDING BOOKS SECTION */}
      <SectionBackground darkBg={true}>
        <section id="trending" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-block text-purple-600 dark:text-purple-400 text-sm font-medium uppercase tracking-wider mb-4"
                style={{ letterSpacing: '0.2em' }}
              >
                EXPLORE LIBRARY
              </motion.span>
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Trending <span className="text-purple-600">Books</span>
            </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover our most popular titles that readers can't get enough of.
            </p>
            </div>
          </div>

          {/* Swiper for trending books (both desktop and mobile) */}
          <div className="container mx-auto px-4 max-w-7xl relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              centeredSlides={true}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                  centeredSlides: true,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                  centeredSlides: false,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                  centeredSlides: false,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 24,
                  centeredSlides: false,
                },
              }}
              className="trending-books-swiper !pb-14"
            >
              {trendingBooks.map((book) => (
                <SwiperSlide key={book.id} className="pb-6 pt-4">
                  <div className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 h-full">
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-base font-semibold text-white line-clamp-1 mb-1">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-300 mb-2">
                          by {book.author}
                        </p>
                        
                        <div className="flex gap-2 mt-2 justify-center">
                          <Link
                            to={`/details/${book.id}`}
                            className="w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
                            aria-label="View details"
                          >
                            <RiEyeLine className="text-white" />
                          </Link>
                          
                          <button
                            onClick={() => addToFavorites(book)}
                            className={`w-9 h-9 ${
                              likedBooks[book.id] 
                                ? "bg-red-500" 
                                : "bg-white/20 backdrop-blur-sm hover:bg-white/40"
                            } rounded-full flex items-center justify-center transition-colors`}
                            aria-label={likedBooks[book.id] ? "Remove from favorites" : "Add to favorites"}
                          >
                            {likedBooks[book.id] ? (
                              <RiHeartFill className="text-white" />
                            ) : (
                              <RiHeartLine className="text-white" />
                            )}
                          </button>
                          
                        <button
                          onClick={() => addToCart(book)}
                            className="w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
                            aria-label="Add to cart"
                        >
                            <RiShoppingCart2Line className="text-white" />
                        </button>
                        </div>
                    </div>

                      {/* Fixed action buttons for mobile */}
                      <div className="md:hidden absolute bottom-4 right-4 flex gap-2">
                        <Link
                          to={`/details/${book.id}`}
                          className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                          aria-label="View details"
                        >
                          <RiEyeLine className="text-white" />
                        </Link>
                      </div>
                      
                      {/* Discount badge */}
                      {book.discount && book.price > book.discount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                          {Math.round(((book.price - book.discount) / book.price) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    
                    {/* Card footer with details - visible on both desktop and mobile */}
                    <div className="p-4 bg-white dark:bg-gray-800 flex flex-col">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        by {book.author}
                      </p>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(Math.floor(book.rating))].map((_, i) => (
                            <RiStarFill key={i} className="w-3.5 h-3.5" />
                          ))}
                          {book.rating % 1 !== 0 && <RiStarHalfFill className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                          ({book.rating.toFixed(1)})
                        </span>
                      </div>
                      <div className="flex items-center mt-auto">
                        {book.discount ? (
                          <>
                            <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                              ${book.discount}
                            </span>
                            <span className="text-gray-400 line-through ml-2 text-xs">
                              ${book.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                            ${book.price}
                          </span>
                        )}
                        </div>
                      </div>
                    </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom navigation buttons */}
            <div className="swiper-button-prev !w-10 !h-10 !bg-white dark:!bg-gray-800 !rounded-full !text-purple-600 !shadow-lg border border-gray-100 dark:border-gray-700 after:!text-sm"></div>
            <div className="swiper-button-next !w-10 !h-10 !bg-white dark:!bg-gray-800 !rounded-full !text-purple-600 !shadow-lg border border-gray-100 dark:border-gray-700 after:!text-sm"></div>
            
            {/* View all books button */}
            <div className="mt-12 text-center">
              <Link
                to="/books"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
              >
                View All Trending Books
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
          </div>
        </div>
      </section>
      </SectionBackground>

      {/* DISCOUNT SECTION */}
      <SectionBackground>
        <section id="discount" className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left: Floating images with 3D effect */}
            <div className="flex justify-center">
                <div className="relative transform perspective-1000">
                <motion.div
                  initial={{ rotate: -6, x: 0 }}
                  whileInView={{ rotate: -6, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.05 }}
                    className="mb-6 shadow-2xl rounded-lg overflow-hidden"
                    style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}
                >
                  <img
                    src="/assets/img/book-1.jpg"
                    alt="Discounted Book #1"
                    className="w-48 h-auto object-contain rounded-lg shadow-xl aspect-[2/3]"
                  />
                </motion.div>

                <motion.div
                  initial={{ rotate: 6, x: 0, y: 0 }}
                  whileInView={{ rotate: 12, x: 30, y: 30 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.05 }}
                    className="absolute top-0 left-0 shadow-2xl rounded-lg overflow-hidden"
                    style={{ transformStyle: 'preserve-3d', transform: 'translateZ(40px)' }}
                >
                  <img
                    src="/assets/img/book-2.jpg"
                    alt="Discounted Book #2"
                    className="w-48 h-auto object-contain rounded-lg shadow-xl aspect-[2/3]"
                  />
                </motion.div>
              </div>
            </div>

            {/* Right: Text & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
                <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Up To <span className="text-purple-600">60% Discount</span>
              </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 mb-6 rounded-full"></div>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                Take advantage of the discount days we have for you: buy books
                from your favorite writers, the more you buy, the more discounts
                we offer. Never miss a special offer on the books you love.
              </p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs mr-3">
                    ✓
                  </span>
                  <span className="dark:text-gray-300">
                    Access to exclusive promotional prices
                  </span>
                </li>
                <li className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs mr-3">
                    ✓
                  </span>
                  <span className="dark:text-gray-300">
                    Monthly membership discounts available
                  </span>
                </li>
                <li className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs mr-3">
                    ✓
                  </span>
                  <span className="dark:text-gray-300">
                    Special bundle offers for series and collections
                  </span>
                </li>
              </ul>
              <Link
                to="/books"
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-colors transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0 duration-300"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      </SectionBackground>

      {/* UPCOMING BOOKS SECTION */}
      <SectionBackground darkBg={true}>
        <section id="upcoming" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Upcoming <span className="text-purple-600">Books</span>
            </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Be the first to know about our newest releases and upcoming titles.
              Pre-order now to secure your copy.
            </p>
          </div>

          {/* Motion container for the cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {upcomingBooks.map((book) => (
              <motion.div
                key={book.id}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex p-4">
                  <div className="w-1/3">
                      <motion.div
                        whileHover={{ scale: 1.05, rotateY: 10 }}
                      transition={{ duration: 0.3 }}
                        className="rounded-lg shadow-lg overflow-hidden"
                      >
                        <img
                      src={book.image}
                      alt={book.title}
                          className="w-full h-full object-cover rounded-md"
                    />
                      </motion.div>
                  </div>
                  <div className="w-2/3 pl-4 flex flex-col justify-between">
                    <div>
                        <div className="inline-block text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 py-1 px-2 rounded-full mb-2 uppercase tracking-wider">
                        Coming Soon
                      </div>
                        <h3 className="text-lg font-semibold line-clamp-1 text-gray-900 dark:text-white">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {book.author}
                      </p>
                      <div className="flex items-center mt-1 mb-2">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: Math.floor(book.rating) }).map(
                            (_, i) => (
                                <RiStarFill key={i} className="w-4 h-4" />
                            )
                          )}
                            {book.rating % 1 !== 0 && <RiStarHalfFill className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">
                          ${book.discount}
                        </span>
                        <span className="text-gray-400 line-through ml-2">
                          ${book.price}
                        </span>
                        <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-0.5 rounded-full">
                          Save{' '}
                          {Math.round(
                            ((book.price - book.discount) / book.price) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToFavorites(book)}
                            className={`p-2 rounded-full shadow-md button-pop ${
                              likedBooks[book.id] 
                              ? "bg-red-500 text-white" 
                              : "bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-600 hover:text-white"
                            } transition-colors`}
                          aria-label="Add to favorites"
                        >
                          <RiHeartLine className="text-lg" />
                        </motion.button>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Link
                            to={`/details/${book.id}`}
                            className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full shadow-sm hover:bg-purple-600 hover:text-white transition-colors block"
                            aria-label="View details"
                          >
                            <RiEyeLine className="text-lg" />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12 text-center">
            <Link
              to="/books"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
            >
              View All Upcoming Books
            </Link>
          </div>
        </div>
      </section>
      </SectionBackground>

      {/* Testimonials Section */}
      <SectionBackground>
        <section id="testimonials">
      <TestimonialsSection />
        </section>
      </SectionBackground>

      {/* Newsletter Section */}
      <SectionBackground darkBg={true}>
        <section id="newsletter">
      <NewsletterSection />
        </section>
      </SectionBackground>

      {/* Scroll-to-top button floating at bottom-right - Add 3D effect */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed right-8 bottom-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 button-3d"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <RiArrowUpLine size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Footer Component */}
      <Footer />

      {/* Add this CSS at the bottom of your <style> tag */}
      <style dangerouslySetInnerHTML={{ __html: keyframesStyle + `
        .book-hover-target {
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .book-hover-target:hover {
          transform: scale(1.08) translateY(-10px) rotateY(-25deg);
        }
        .book-hover-target:nth-child(2):hover {
          transform: scale(1.1) translateY(-10px) rotateY(5deg) rotateX(5deg);
        }
        .book-hover-target:nth-child(3):hover, .perspective-1000:last-child .book-hover-target:hover {
          transform: scale(1.08) translateY(-10px) rotateY(25deg) rotate(15deg);
        }
        .book-hover-target:hover .book-overlay {
          opacity: 1;
        }
        .book-hover-target:hover .book-details {
          opacity: 1;
          transform: translateY(0);
        }
      ` }} />
    </div>
  );
};

export default Home;
