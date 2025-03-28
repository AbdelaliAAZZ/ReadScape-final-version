import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  RiStarFill,
  RiStarHalfFill,
  RiShoppingCartLine,
  RiArrowLeftLine,
  RiAddLine,
  RiSubtractLine,
  RiHeartLine,
  RiHeartFill,
  RiEyeLine
} from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Book, getBookById, books, trendingBooks } from '../data/books';
import { useAlert } from '../App';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Define the Review interface to match the Book type's Review interface
interface Review {
  id: number;
  user: string;
  name: string;
  rating: number;
  comment: string;
  date?: string;
  image?: string;
}

// Extended properties for type safety, using Omit to exclude the reviews property from Book
interface DetailBook extends Omit<Book, 'reviews'> {
  bestSeller?: boolean;
  reviewCount?: number;
  pages?: string;
  language?: string;
  isbn?: string;
  highlights?: string[];
  reviews?: Review[];
}

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const { showAlert } = useAlert();
  const [quantity, setQuantity] = useState(1);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<DetailBook | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Get book data from the centralized data file
  useEffect(() => {
    if (id) {
      const fetchedBook = getBookById(parseInt(id));
      if (fetchedBook) {
        // Cast to the extended type for additional properties
        setBook(fetchedBook as DetailBook);
        
        // Find similar books (same author or category)
        const similar = [...books, ...trendingBooks].filter(
          (b) => 
            b.id !== fetchedBook.id && 
            (b.author === fetchedBook.author || 
             b.category === fetchedBook.category)
        ).slice(0, 4);
        setSimilarBooks(similar);
      }

      // Check if book is in favorites
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const isLiked = favorites.some((favBook: Book) => favBook.id === parseInt(id));
      setLiked(isLiked);
      
      setLoading(false);
    }
  }, [id]);

  // Function to increment quantity
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  // Function to decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Function to add to cart
  const addToCart = () => {
    if (!book) return;
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: Book) => item.id === book.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...book, quantity });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    showAlert(`${book.title} added to cart`, "success");
  };
  
  // Add to favorites function
  const toggleFavorite = () => {
    if (!book) return;
    
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (liked) {
      const updatedFavorites = favorites.filter((favBook: Book) => favBook.id !== book.id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      showAlert("Removed from favorites", "success");
    } else {
      favorites.push(book);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      showAlert("Added to favorites", "success");
    }
    setLiked(!liked);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center pt-16">
        <h2 className="text-2xl font-bold mb-4">Book not found</h2>
        <Link to="/books" className="text-purple-600 hover:underline">
          Return to Books
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-white dark:bg-gray-900 min-h-screen">
      {/* Book Details Section */}
      <div className="container mx-auto px-4 py-12">
        <Link
          to="/books"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition-colors"
        >
          <RiArrowLeftLine className="mr-2" /> Back to Books
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {/* Book Image */}
            <div className="p-8 flex justify-center items-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-700">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-96 object-contain rounded-lg shadow-lg"
                />
                <div className="absolute -top-3 -right-3">
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-full shadow-lg ${
                      liked
                        ? "bg-red-500 text-white"
                        : "bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                    } transition-colors`}
                    aria-label={liked ? "Remove from favorites" : "Add to favorites"}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={liked ? "filled" : "outline"}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {liked ? <RiHeartFill className="text-xl" /> : <RiHeartLine className="text-xl" />}
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Book Info */}
            <div className="p-8 md:col-span-2 lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs font-medium rounded-full">
                    {book.category}
                  </span>
                  {book.bestSeller && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs font-medium rounded-full">
                      Bestseller
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-2 dark:text-white">{book.title}</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">by {book.author}</p>

                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(Math.floor(book.rating))].map((_, i) => (
                      <RiStarFill key={i} />
                    ))}
                    {book.rating % 1 !== 0 && <RiStarHalfFill />}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {book.rating} ({book.reviewCount || 42} reviews)
                  </span>
                </div>

                <div className="prose prose-lg dark:prose-invert mb-6 max-w-none">
                  <p>{book.description || 'A captivating book that takes readers on an unforgettable journey through imaginative worlds and compelling characters. Perfect for readers who enjoy thoughtful narratives and engaging storytelling.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">Book Details</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex">
                        <span className="font-medium w-32">Format:</span>
                        <span>{book.format || 'Hardcover'}</span>
                      </li>
                      <li className="flex">
                        <span className="font-medium w-32">Pages:</span>
                        <span>{book.pages || '314'}</span>
                      </li>
                      <li className="flex">
                        <span className="font-medium w-32">Language:</span>
                        <span>{book.language || 'English'}</span>
                      </li>
                      <li className="flex">
                        <span className="font-medium w-32">ISBN:</span>
                        <span>{book.isbn || '978-1234567890'}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">What You'll Learn</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      {book.highlights ? (
                        book.highlights.map((highlight: string, index: number) => (
                          <li key={index} className="flex">
                            <span className="text-purple-600 mr-2">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="flex">
                            <span className="text-purple-600 mr-2">•</span>
                            <span>Gain insights into compelling characters</span>
                          </li>
                          <li className="flex">
                            <span className="text-purple-600 mr-2">•</span>
                            <span>Discover rich and detailed worlds</span>
                          </li>
                          <li className="flex">
                            <span className="text-purple-600 mr-2">•</span>
                            <span>Experience emotional storytelling</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-6">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <span className="text-gray-700 dark:text-gray-300 mr-3">Price:</span>
                      {book.discount && book.discount < book.price ? (
                        <div className="flex items-center">
                          <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">${book.discount}</span>
                          <span className="ml-2 text-lg text-gray-500 line-through">${book.price}</span>
                          <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                            {Math.round(((book.price - book.discount) / book.price) * 100)}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">${book.price}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                        className={`p-2 ${
                          quantity <= 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <RiSubtractLine />
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        aria-label="Increase quantity"
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <RiAddLine />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={toggleFavorite}
                    className={`flex-grow sm:flex-grow-0 px-6 py-3 rounded-lg font-medium transition-all border flex items-center justify-center ${
                      liked
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {liked ? <RiHeartFill className="mr-2" /> : <RiHeartLine className="mr-2" />}
                    {liked ? "Added to Favorites" : "Add to Favorites"}
                  </button>

                  <button
                    onClick={addToCart}
                    className="flex-grow sm:flex-grow-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center"
                  >
                    <RiShoppingCartLine className="mr-2" /> Add to Cart
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section with images */}
      <div className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 dark:text-white">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {book.reviews ? (
              book.reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start">
                    <img
                      src={review.image || `/assets/img/avatar-${(index % 6) + 1}.jpg`}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold dark:text-white">{review.name}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {review.date || new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(review.rating || 5)].map((_, i) => (
                          <RiStarFill key={i} />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Default reviews if none provided
              [1, 2, 3, 4].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start">
                    <img
                      src={[
                        "https://randomuser.me/api/portraits/women/44.jpg",
                        "https://randomuser.me/api/portraits/men/32.jpg",
                        "https://randomuser.me/api/portraits/women/68.jpg",
                        "https://randomuser.me/api/portraits/men/75.jpg"
                      ][index - 1]}
                      alt="Reviewer"
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=User+${index}&background=random`;
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold dark:text-white">
                          {["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Williams"][index - 1]}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(Date.now() - (index * 15 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <RiStarFill key={i} className="text-sm" />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {[
                          "This book exceeded all my expectations. The character development is fantastic and the storyline kept me engaged from beginning to end.",
                          "One of the best books I've read this year. The author's writing style is captivating and the plot is full of unexpected twists.",
                          "I couldn't put this book down! The narrative is compelling and the themes explored are both thought-provoking and relevant.",
                          "A truly immersive reading experience. The author has created a rich world with complex characters that stay with you long after you finish reading."
                        ][index - 1]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Similar Books Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 dark:text-white">You May Also Like</h2>
          
          {similarBooks.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop={true}
              navigation={{
                nextEl: '.similar-swiper-button-next',
                prevEl: '.similar-swiper-button-prev',
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              className="similar-books-swiper !pb-14"
            >
              {similarBooks.map((similar) => (
                <SwiperSlide key={similar.id} className="pb-6 pt-4">
                  <div className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 h-full">
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={similar.image}
                        alt={similar.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-base font-semibold text-white line-clamp-1 mb-1">
                          {similar.title}
                        </h3>
                        <p className="text-xs text-gray-300 mb-2">
                          by {similar.author}
                        </p>
                        
                        <div className="flex gap-2 mt-2 justify-center">
                          <Link
                            to={`/details/${similar.id}`}
                            className="w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
                            aria-label="View details"
                          >
                            <RiEyeLine className="text-white" />
                          </Link>
                        </div>
                      </div>
                      
                      {/* Discount badge */}
                      {similar.discount && similar.price > similar.discount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                          {Math.round(((similar.price - similar.discount) / similar.price) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    
                    {/* Card footer with details */}
                    <div className="p-4 bg-white dark:bg-gray-800 flex flex-col">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
                        {similar.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        by {similar.author}
                      </p>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(Math.floor(similar.rating))].map((_, i) => (
                            <RiStarFill key={i} className="w-3.5 h-3.5" />
                          ))}
                          {similar.rating % 1 !== 0 && <RiStarHalfFill className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                          ({similar.rating.toFixed(1)})
                        </span>
                      </div>
                      <div className="flex items-center mt-auto">
                        {similar.discount ? (
                          <>
                            <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                              ${similar.discount}
                            </span>
                            <span className="text-gray-400 line-through ml-2 text-xs">
                              ${similar.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                            ${similar.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center">No similar books found</p>
          )}
          
          {/* Custom navigation buttons */}
          <div className="similar-swiper-button-prev !w-10 !h-10 !bg-white dark:!bg-gray-800 !rounded-full !text-purple-600 !shadow-lg border border-gray-100 dark:border-gray-700 after:!text-sm"></div>
          <div className="similar-swiper-button-next !w-10 !h-10 !bg-white dark:!bg-gray-800 !rounded-full !text-purple-600 !shadow-lg border border-gray-100 dark:border-gray-700 after:!text-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default Details; 