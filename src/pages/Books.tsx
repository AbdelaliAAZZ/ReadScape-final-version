import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  RiFilterLine, 
  RiHeartLine, 
  RiStarFill,
  RiStarHalfFill,
  RiArrowRightSLine,
  RiArrowLeftSLine,
  RiHeartFill,
  RiCheckLine,
  RiEyeLine,
  RiShoppingCart2Line
} from 'react-icons/ri';
import { Book, getAllBooks } from '../data/books';
import { useAlert } from '../App';

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);
  
  // Animation keyframes
  const keyframesStyle = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0) translateX(0) rotate(0);
      }
      25% {
        transform: translateY(-30px) translateX(15px) rotate(5deg);
      }
      50% {
        transform: translateY(10px) translateX(-15px) rotate(-5deg);
      }
      75% {
        transform: translateY(20px) translateX(10px) rotate(3deg);
      }
    }
  `;
  
  const booksPerPage = 15; // 3 rows of 5 books each for desktop view
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);
  const { showAlert } = useAlert();

  // Load books and extract categories
  useEffect(() => {
    const allBooks = getAllBooks();
    setBooks(allBooks);
    
    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(allBooks.map(book => book.category || 'Uncategorized'))
    );
    setCategories(uniqueCategories);
    
    // Load favorites and cart items from localStorage
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const favIds = JSON.parse(storedFavorites).map((fav: Book) => fav.id);
      setFavorites(favIds);
    }
    
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      const cartIds = JSON.parse(storedCartItems).map((item: Book) => item.id);
      setCartItems(cartIds);
    }
    
    setLoading(false);
  }, []);

  // Update favorites when localStorage changes
  useEffect(() => {
    const handleFavoritesChange = () => {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const favIds = JSON.parse(storedFavorites).map((fav: Book) => fav.id);
        setFavorites(favIds);
      }
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesChange);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesChange);
    };
  }, []);

  // Update cart items when localStorage changes
  useEffect(() => {
    const handleCartChange = () => {
      const storedCartItems = localStorage.getItem('cartItems');
      if (storedCartItems) {
        const cartIds = JSON.parse(storedCartItems).map((item: Book) => item.id);
        setCartItems(cartIds);
      }
    };
    
    window.addEventListener('cartUpdated', handleCartChange);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartChange);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Function to check if a book is in favorites
  const isBookFavorite = (bookId: number) => {
    return favorites.includes(bookId);
  };

  // Function to check if a book is in cart
  const isBookInCart = (bookId: number) => {
    return cartItems.includes(bookId);
  };

  // Function to add to favorites
  const addToFavorites = (book: Book) => {
    // Get current favorites from localStorage
    const storedFavorites = localStorage.getItem('favorites');
    const currentFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    // Check if book is already in favorites
    const isAlreadyFavorite = currentFavorites.some((fav: Book) => fav.id === book.id);
    
    if (!isAlreadyFavorite) {
      // Add book to favorites
      const updatedFavorites = [...currentFavorites, book];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      // Update local state
      setFavorites(prev => [...prev, book.id]);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('favoritesUpdated'));
      
      showAlert(`${book.title} added to favorites!`, 'success');
    } else {
      // Remove book from favorites
      const updatedFavorites = currentFavorites.filter((fav: Book) => fav.id !== book.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      // Update local state
      setFavorites(prev => prev.filter(id => id !== book.id));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('favoritesUpdated'));
      
      showAlert(`${book.title} removed from favorites!`, 'success');
    }
  };

  // Function to add to cart
  const addToCart = (book: Book) => {
    // Get current cart items from localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    const currentCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
    
    // Check if book is already in cart
    const isAlreadyInCart = currentCartItems.some((item: Book) => item.id === book.id);
    
    if (!isAlreadyInCart) {
      // Add book to cart with quantity
      const bookWithQuantity = { ...book, quantity: 1 };
      const updatedCartItems = [...currentCartItems, bookWithQuantity];
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      
      // Update local state
      setCartItems(prev => [...prev, book.id]);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('cartUpdated'));
      
      showAlert(`${book.title} added to cart!`, 'success');
    } else {
      showAlert('This book is already in your cart!', 'info');
    }
  };

  const filterBooks = (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      // Apply any existing search query and sort
      applyFilters(searchQuery, sortOption, 'all');
    } else {
      // Apply category filter along with any existing search query and sort
      applyFilters(searchQuery, sortOption, category);
    }
    
    setCurrentPage(1);
  };

  const sortBooks = (sortBy: string) => {
    setSortOption(sortBy);
    applyFilters(searchQuery, sortBy, selectedCategory);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, sortOption, selectedCategory);
    setCurrentPage(1);
  };

  // Apply all filters and sorting at once
  const applyFilters = (query: string, sortBy: string, category: string) => {
    let filteredBooks = getAllBooks();
    
    // Apply category filter
    if (category !== 'all') {
      filteredBooks = filteredBooks.filter(book => 
        book.category && book.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply search filter - improved to better match partial terms
    if (query.trim()) {
      const searchTerms = query.toLowerCase().trim().split(/\s+/);
      
      filteredBooks = filteredBooks.filter(book => {
        // Check if all search terms match either title or author
        return searchTerms.every(term => {
          const titleMatch = book.title.toLowerCase().includes(term);
          const authorMatch = book.author.toLowerCase().includes(term);
          
          return titleMatch || authorMatch;
        });
      });
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        filteredBooks.sort((a, b) => {
          const priceA = a.discount || a.price;
          const priceB = b.discount || b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        filteredBooks.sort((a, b) => {
          const priceA = a.discount || a.price;
          const priceB = b.discount || b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filteredBooks.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming newer books have higher IDs
        filteredBooks.sort((a, b) => b.id - a.id);
        break;
      case 'title-az':
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-za':
        filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default sorting (featured or recommended)
        // No specific sorting
        break;
    }
    
    setBooks(filteredBooks);
  };

  // Book Card Component with smaller design
  const BookCard = ({ book }: { book: Book }) => {
    return (
      <motion.div
        variants={itemVariants}
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 group hover:shadow-xl h-full"
        whileHover={{ y: -5 }}
      >
        <div className="aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex justify-center gap-2 mb-2">
                <Link
                  to={`/details/${book.id}`}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
                  aria-label="View details"
                >
                  <RiEyeLine className="text-white" />
                </Link>
                
        <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToFavorites(book);
                  }}
                  aria-label={isBookFavorite(book.id) ? "Remove from favorites" : "Add to favorites"}
                  className={`w-8 h-8 ${
                    isBookFavorite(book.id)
                      ? "bg-red-500"
                      : "bg-white/20 backdrop-blur-sm hover:bg-white/40"
                  } rounded-full flex items-center justify-center transition-colors`}
                >
                  {isBookFavorite(book.id) ? (
                    <RiHeartFill className="text-white" />
                  ) : (
                    <RiHeartLine className="text-white" />
                  )}
        </button>
                
        <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(book);
                  }}
                  disabled={isBookInCart(book.id)}
                  className={`w-8 h-8 ${
                    isBookInCart(book.id)
                      ? "bg-green-500"
                      : "bg-white/20 backdrop-blur-sm hover:bg-white/40"
                  } rounded-full flex items-center justify-center transition-colors`}
                  aria-label={isBookInCart(book.id) ? "Already in cart" : "Add to cart"}
                >
                  {isBookInCart(book.id) ? (
                    <RiCheckLine className="text-white" />
                  ) : (
                    <RiShoppingCart2Line className="text-white" />
                  )}
        </button>
              </div>
            </div>
          </div>
          
          {/* Discount tag */}
          {book.discount && book.price > book.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded font-medium">
              {Math.round(((book.price - book.discount) / book.price) * 100)}% OFF
            </div>
          )}
          
          {/* Coming soon badge - Only show if property exists and is true */}
          {book.category === 'Coming Soon' && (
            <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded font-medium">
              Coming Soon
            </div>
          )}
        </div>
        
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 text-xs h-9">
            {book.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
            by {book.author}
          </p>
          
          <div className="flex items-center mb-1">
            <div className="flex text-yellow-400">
              {[...Array(Math.floor(book.rating))].map((_, i) => (
                <RiStarFill key={i} className="text-xs" />
              ))}
              {book.rating % 1 !== 0 && <RiStarHalfFill className="text-xs" />}
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
              ({book.rating.toFixed(1)})
        </span>
          </div>
          
          <div className="flex items-center mt-auto">
            {book.discount ? (
              <>
                <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs">
                  ${book.discount}
                </span>
                <span className="text-gray-400 line-through ml-2 text-xs">
                  ${book.price}
                </span>
              </>
            ) : (
              <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs">
                ${book.price}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <style dangerouslySetInnerHTML={{ __html: keyframesStyle }} />
      
      {/* Hero section with background similar to Home.tsx */}
      <div className="relative py-16 overflow-hidden">
        {/* Background blur elements */}
        <div className="absolute inset-0 z-0 bg-gray-50 dark:bg-gray-900/60"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Explore Our <span className="text-purple-600">Book Collection</span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover thousands of books from classic literature to the latest bestsellers across all genres.
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-end gap-4 max-w-6xl mx-auto mb-8">
            {/* Search */}
            <div className="flex-grow md:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for books..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                </div>
              </div>
              
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category filter */}
              <div className="relative">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => filterBooks(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer pr-10"
                  aria-label="Filter books by category"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none text-gray-500">
                  <RiFilterLine />
                </div>
              </div>
              
              {/* Sort filter */}
              <div className="relative">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  value={sortOption}
                  onChange={(e) => sortBooks(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer pr-10"
                  aria-label="Sort books by"
                >
                  <option value="default">Default</option>
                  <option value="price-low-high">Price (Low to High)</option>
                  <option value="price-high-low">Price (High to Low)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="newest">Newest First</option>
                  <option value="title-az">Title (A-Z)</option>
                  <option value="title-za">Title (Z-A)</option>
                </select>
                <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Books Grid */}
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gray-50 dark:bg-gray-900/60"></div>
        <div className="absolute top-1/3 right-20 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-20 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Books count and active filters */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              Showing{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {indexOfFirstBook + 1}-
                {indexOfLastBook > books.length ? books.length : indexOfLastBook}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {books.length}
              </span>{" "}
              books
              {selectedCategory !== "all" && (
                <span>
                  {" "}
                  in <span className="font-medium text-purple-600 dark:text-purple-400">{selectedCategory}</span>
                </span>
              )}
              {searchQuery && (
                <span>
                  {" "}
                  matching <span className="font-medium text-purple-600 dark:text-purple-400">"{searchQuery}"</span>
                </span>
              )}
            </div>
            
            {(selectedCategory !== "all" || searchQuery || sortOption !== "default") && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSortOption("default");
                  setSearchQuery("");
                  setBooks(getAllBooks());
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center"
              >
                Clear filters
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : books.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
            </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No books found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            <button
              onClick={() => {
                  setSelectedCategory("all");
                  setSortOption("default");
                  setSearchQuery("");
                setBooks(getAllBooks());
              }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded hover:from-purple-700 hover:to-pink-700 transition-colors shadow-md"
            >
                Reset filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mx-auto"
          >
            {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
          </motion.div>
        )}
        
        {/* Pagination */}
          {books.length > 0 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
              <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentPage === 1
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors shadow-sm"
                }`}
                aria-label="Previous page"
              >
                  <RiArrowLeftSLine className="text-xl" />
              </button>
              
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show only 5 pages at a time
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                            currentPage === page
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow"
                              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-900/50 shadow-sm"
                          }`}
                          aria-label={`Page ${page}`}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={page}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400"
                        >
                          ...
                </span>
                      );
                    }
                    return null;
                  })}
              </div>
              
              <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                disabled={currentPage === totalPages}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentPage === totalPages
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors shadow-sm"
                }`}
                aria-label="Next page"
              >
                  <RiArrowRightSLine className="text-xl" />
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Books; 