import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiArrowLeftLine,
  RiMastercardFill,
  RiPaypalFill,
  RiVisaLine,
  RiShoppingCartLine,
  RiCheckboxCircleLine,
} from 'react-icons/ri';
import { Book } from '../data/books';
import { useAlert } from '../App';
import Footer from '../components/Footer';

// Variants for step transitions
const stepVariants: Variants = {
  hidden: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // What step of the form are we on? 1=Shipping, 2=Payment, 3=Review & Confirm
  const [step, setStep] = useState(1);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('mastercard');

  // Once the order is completely processed, we show the thank-you screen
  const [orderProcessed, setOrderProcessed] = useState(false);

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Multi-step form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  // Calculate order summary
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.discount || 0) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  // Load cart items from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      const items = JSON.parse(storedCart);
      setCartItems(items);
    }
    setLoading(false);
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  // Go to the next step (validate if needed)
  const handleNext = () => {
    // You could add step-specific validation here
    // For example, if step=1, validate shipping fields before proceeding
    setStep((prev) => prev + 1);
  };

  // Go back to the previous step
  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  /**
   * Final submission after Step 3 (Review & Confirm).
   * This simulates an order being placed, then shows the success screen.
   */
  const handleSubmitOrder = () => {
    // Simulate a short delay (like an API request)
    setTimeout(() => {
      setOrderProcessed(true);
      // Clear cart
      localStorage.setItem('cartItems', JSON.stringify([]));
      // Show success message
      showAlert('Order placed successfully!', 'success');

      // After some time, redirect to home (optional)
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 1200);
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {orderProcessed ? (
        // ============ THANK YOU SCREEN ============
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <RiCheckboxCircleLine className="text-green-600 dark:text-green-400 text-4xl" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your order has been placed successfully. You will receive a
              confirmation email shortly.
            </p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
            >
              Return to Home
            </Link>
          </motion.div>
        </div>
      ) : (
        <>
          <div className="container mx-auto px-4 py-8">
            {/* Top Bar and Title */}
            <div className="mb-8">
              <Link
                to="/cart"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <RiArrowLeftLine className="mr-2" /> Back to Cart
              </Link>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mt-4">
                Complete Your Purchase
              </h1>
            </div>

            {loading ? (
              // ============ LOADING SPINNER ============
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : cartItems.length === 0 ? (
              // ============ EMPTY CART MESSAGE ============
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RiShoppingCartLine className="text-gray-400 text-2xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Add some items to your cart before checkout.
                </p>
                <Link
                  to="/books"
                  className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-md"
                >
                  Browse Books
                </Link>
              </div>
            ) : (
              // ============ CHECKOUT CONTENT ============
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: MULTI-STEP FORM */}
                <div className="lg:col-span-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    {/* ---------------- Progress Steps / Timeline ---------------- */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between w-full mb-6">
                        {/* Step 1: Shipping */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 ${
                              step >= 1
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            } rounded-full flex items-center justify-center font-bold transition-colors`}
                          >
                            1
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              step >= 1
                                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            Shipping
                          </div>
                        </div>
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            step > 1
                              ? 'bg-purple-200 dark:bg-purple-900'
                              : 'bg-gray-200 dark:bg-gray-700'
                          } transition-colors`}
                        ></div>
                        {/* Step 2: Payment */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 ${
                              step >= 2
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            } rounded-full flex items-center justify-center font-bold transition-colors`}
                          >
                            2
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              step >= 2
                                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            Payment
                          </div>
                        </div>
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            step > 2
                              ? 'bg-purple-200 dark:bg-purple-900'
                              : 'bg-gray-200 dark:bg-gray-700'
                          } transition-colors`}
                        ></div>
                        {/* Step 3: Review & Confirm */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 ${
                              step >= 3
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            } rounded-full flex items-center justify-center font-bold transition-colors`}
                          >
                            3
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              step >= 3
                                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            Confirm
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ------------ ANIMATED STEP CONTENT ------------- */}
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          variants={stepVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-6">
                            Shipping Information
                          </h2>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                First Name
                              </label>
                              <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                placeholder="Enter your first name"
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                Last Name
                              </label>
                              <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                placeholder="Enter your last name"
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                Email Address
                              </label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                placeholder="your@email.com"
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                placeholder="(123) 456-7890"
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                Address
                              </label>
                              <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                placeholder="1234 Main Street"
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="city"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                City
                              </label>
                              <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                placeholder="e.g. New York"
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="zipCode"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                ZIP / Postal Code
                              </label>
                              <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                placeholder="e.g. 10001"
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="country"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                Country
                              </label>
                              <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                placeholder="e.g. USA"
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                          </div>

                          {/* NEXT STEP BUTTON */}
                          <div className="mt-8 text-right">
                            <button
                              onClick={handleNext}
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
                            >
                              Next Step
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          variants={stepVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-6">
                            Payment Method
                          </h2>

                          {/* Payment Method Options */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div
                              className={`border ${
                                paymentMethod === 'mastercard'
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                  : 'border-gray-300 dark:border-gray-700'
                              } rounded-lg p-5 cursor-pointer transition-colors hover:shadow-md`}
                              onClick={() => handlePaymentMethodChange('mastercard')}
                            >
                              <div className="flex items-center mb-3">
                                <input
                                  type="radio"
                                  id="mastercard"
                                  name="paymentMethod"
                                  checked={paymentMethod === 'mastercard'}
                                  onChange={() => {}}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                                />
                                <label
                                  htmlFor="mastercard"
                                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                  MasterCard
                                </label>
                              </div>
                              <div className="flex justify-center">
                                <RiMastercardFill className="text-4xl text-gray-700 dark:text-gray-300" />
                              </div>
                            </div>

                            <div
                              className={`border ${
                                paymentMethod === 'visa'
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                  : 'border-gray-300 dark:border-gray-700'
                              } rounded-lg p-5 cursor-pointer transition-colors hover:shadow-md`}
                              onClick={() => handlePaymentMethodChange('visa')}
                            >
                              <div className="flex items-center mb-3">
                                <input
                                  type="radio"
                                  id="visa"
                                  name="paymentMethod"
                                  checked={paymentMethod === 'visa'}
                                  onChange={() => {}}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                                />
                                <label
                                  htmlFor="visa"
                                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                  Visa
                                </label>
                              </div>
                              <div className="flex justify-center">
                                <RiVisaLine className="text-4xl text-gray-700 dark:text-gray-300" />
                              </div>
                            </div>

                            <div
                              className={`border ${
                                paymentMethod === 'paypal'
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                  : 'border-gray-300 dark:border-gray-700'
                              } rounded-lg p-5 cursor-pointer transition-colors hover:shadow-md`}
                              onClick={() => handlePaymentMethodChange('paypal')}
                            >
                              <div className="flex items-center mb-3">
                                <input
                                  type="radio"
                                  id="paypal"
                                  name="paymentMethod"
                                  checked={paymentMethod === 'paypal'}
                                  onChange={() => {}}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                                />
                                <label
                                  htmlFor="paypal"
                                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                  PayPal
                                </label>
                              </div>
                              <div className="flex justify-center">
                                <RiPaypalFill className="text-4xl text-gray-700 dark:text-gray-300" />
                              </div>
                            </div>
                          </div>

                          {/* If credit card (visa/mastercard) show card inputs */}
                          {(paymentMethod === 'mastercard' || paymentMethod === 'visa') && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 mb-6"
                            >
                              <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">
                                Card Details
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                  <label
                                    htmlFor="cardNumber"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                  >
                                    Card Number
                                  </label>
                                  <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    required
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label
                                    htmlFor="cardName"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                  >
                                    Name on Card
                                  </label>
                                  <input
                                    type="text"
                                    id="cardName"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                    placeholder="John Doe"
                                    required
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="expiry"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                  >
                                    Expiration Date
                                  </label>
                                  <input
                                    type="text"
                                    id="expiry"
                                    name="expiry"
                                    value={formData.expiry}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                    placeholder="MM/YY"
                                    required
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="cvv"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                  >
                                    CVV
                                  </label>
                                  <input
                                    type="text"
                                    id="cvv"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                    placeholder="XXX"
                                    required
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* NAVIGATION BUTTONS */}
                          <div className="mt-8 flex justify-between">
                            <button
                              onClick={handleBack}
                              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-6 rounded-lg font-medium transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
                            >
                              Back
                            </button>
                            <button
                              onClick={handleNext}
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
                            >
                              Next Step
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          variants={stepVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-6">
                            Review &amp; Confirm
                          </h2>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Please review your shipping and payment details before placing your order.
                          </p>

                          <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
                              Shipping Info
                            </h3>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              <div>
                                <strong>Name:</strong> {formData.firstName} {formData.lastName}
                              </div>
                              <div>
                                <strong>Email:</strong> {formData.email}
                              </div>
                              <div>
                                <strong>Phone:</strong> {formData.phone}
                              </div>
                              <div>
                                <strong>Address:</strong> {formData.address}, {formData.city},{' '}
                                {formData.zipCode}, {formData.country}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
                              Payment Method
                            </h3>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              {paymentMethod === 'paypal' ? (
                                <div>PayPal</div>
                              ) : (
                                <>
                                  <div>
                                    <strong>Card Type:</strong> {paymentMethod.toUpperCase()}
                                  </div>
                                  <div>
                                    <strong>Card Number:</strong> **** **** ****{' '}
                                    {formData.cardNumber.slice(-4)}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* NAVIGATION + PLACE ORDER BUTTON */}
                          <div className="mt-8 flex justify-between">
                            <button
                              onClick={handleBack}
                              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-6 rounded-lg font-medium transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
                            >
                              Back
                            </button>
                            <button
                              onClick={handleSubmitOrder}
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
                            >
                              Confirm &amp; Place Order
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* RIGHT: ORDER SUMMARY */}
                <div className="lg:col-span-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-4">
                      Order Summary
                    </h2>

                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {cartItems.map((item) => (
                        <div key={item.id} className="py-3 flex">
                          <div className="w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden mr-4 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity || 1}
                            </p>
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-gray-800 dark:text-gray-200">
                                ${item.discount}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                $
                                {((item.discount || 0) * (item.quantity || 1)).toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                        <span className="text-gray-900 dark:text-gray-100">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-medium mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-900 dark:text-gray-100">Total</span>
                        <span className="text-purple-600 dark:text-purple-400">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg
                          className="w-4 h-4 mr-2 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Secure checkout
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <svg
                          className="w-4 h-4 mr-2 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Free returns
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <svg
                          className="w-4 h-4 mr-2 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        24/7 customer support
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};

export default Checkout;
