import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Phone, User, Shield, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

const personalities = [
  { id: 1, image: '/images/personalities/img_p4_2.webp', bg: 'bg-munchit-yellow' }, // Sassy Snack
  { id: 2, image: '/images/personalities/img_p5_2.webp', bg: 'bg-munchit-yellow' }, // Spicy Snack
  { id: 3, image: '/images/personalities/img_p2_2.webp', bg: 'bg-munchit-yellow' }, // Lovable Snack
  { id: 4, image: '/images/personalities/img_p3_2.webp', bg: 'bg-munchit-yellow' }, // Cheesy Snack
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [[page, direction], setPage] = useState([0, 0]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pinId, setPinId] = useState('');
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Wrap index to positive value within array bounds
  const currentIndex = Math.abs(page % personalities.length);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 2000); // Auto-slide every 2 seconds
    return () => clearInterval(timer);
  }, [page]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  // Termii OTP API Integration Handlers
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Privacy Policy & Terms');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      console.log('[OTP] Requesting send to:', phoneNumber);
      
      const response = await axios.post(`${apiUrl}/api/otp/send`, {
        phoneNumber: phoneNumber
      });

      if (response.data && response.data.pinId) {
        setPinId(response.data.pinId);
        setOtpSent(true);
      } else {
        setError('Failed to dispatch verification code. Please check your number.');
      }
    } catch (err) {
      console.error('[OTP] Send error:', err);
      const serverMsg = err.response?.data?.error || 'Failed to send verification SMS. Try again.';
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.length < 4) {
      setError('Please enter a valid 4-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      console.log('[OTP] Requesting verify for pinId:', pinId, 'with pin:', otpCode);

      const response = await axios.post(`${apiUrl}/api/otp/verify`, {
        pinId: pinId,
        pin: otpCode
      });

      if (response.data && response.data.success) {
        setSuccess(true);
        // Persist verified user details in sessionStorage
        sessionStorage.setItem('verified_user', JSON.stringify({
          name: name,
          phoneNumber: phoneNumber,
          verified: true
        }));

        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/quiz');
        }, 1500);
      } else {
        setError('Incorrect or expired verification code');
      }
    } catch (err) {
      console.error('[OTP] Verification error:', err);
      const serverMsg = err.response?.data?.error || 'Invalid PIN code. Please try again.';
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans overflow-hidden transition-colors duration-500 bg-munchit-yellow relative`}>
      
      {/* Carousel Area */}
      <div className="relative w-full md:w-1/2 h-[65vh] md:h-screen rounded-b-[2.5rem] md:rounded-b-none md:rounded-r-[2.5rem] overflow-hidden shadow-lg border-b-4 md:border-b-0 md:border-r-4 border-munchit-red/20 z-10 touch-pan-y">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={personalities[currentIndex].image}
            alt="Snack Personality"
            className="absolute inset-0 w-full h-full object-cover object-top cursor-grab active:cursor-grabbing"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          />
        </AnimatePresence>

        {/* Dots indicator inside the image area */}
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
          {personalities.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow md:w-1/2 flex flex-col justify-center px-6 py-8 md:p-12 lg:p-20">
        <div className="max-w-xl mx-auto w-full">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-munchit-red tracking-tight leading-[1.1] mb-4 font-display uppercase">
            Which Munch it<br />Flavour are you?
          </h1>
          <p className="text-gray-900 font-medium text-base md:text-lg lg:text-xl leading-snug mb-8">
            Seven situations. No right answers. Just you being you. Find out which Munch It snack personality you actually are; not the one you think you are.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => {
              setError('');
              setIsModalOpen(true);
            }}
            className="w-full bg-[#00D2D3] hover:bg-[#00B5B5] text-white rounded-full py-4 px-6 flex items-center justify-between shadow-[0_6px_0_0_#00A0A0] active:translate-y-1 active:shadow-none transition-all"
          >
            <div className="flex items-center justify-center bg-munchit-red w-10 h-10 rounded-full">
              <ArrowRight size={24} strokeWidth={3} />
            </div>
            <span className="font-bold text-xl text-center flex-grow">Take the personality quiz</span>
            <div className="w-10" /> {/* Spacer for centering text */}
          </button>
        </div>
      </div>

      {/* Premium Verification Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative border-4 border-munchit-red"
            >
              
              {/* Top Banner Accent */}
              <div className="bg-munchit-red text-white py-4 px-6 relative flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className="text-munchit-yellow w-6 h-6 animate-pulse" />
                  <span className="font-display font-black text-lg md:text-xl tracking-wide">PARTICIPANT VALIDATION</span>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Main Body */}
              <div className="p-6 md:p-8">
                
                {/* Error Banner */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-600 p-3.5 rounded-2xl flex items-start gap-2 text-sm font-semibold mb-5 border border-red-150"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Successful State */}
                {success ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                      <Check className="text-green-600 w-12 h-12" strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">VIBE UNLOCKED!</h3>
                    <p className="text-gray-600 font-medium">Verification successful. Preparing your quiz deck...</p>
                  </div>
                ) : !otpSent ? (
                  /* Form State: Entering Name & Phone */
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <p className="text-gray-700 font-medium text-sm md:text-base mb-2">
                      Enter your details to register and verify your number. You will receive a quick verification code via SMS.
                    </p>

                    {/* Name input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-250 rounded-2xl py-3.5 pl-11 pr-4 font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-munchit-red focus:bg-white transition-all text-sm md:text-base"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Phone Number Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone Number (e.g. 08031234567)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-250 rounded-2xl py-3.5 pl-11 pr-4 font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-munchit-red focus:bg-white transition-all text-sm md:text-base"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Scrollable Privacy Policy Section */}
                    <div className="border border-gray-200 rounded-2xl bg-gray-50 p-4 max-h-[140px] overflow-y-auto text-left">
                      <h4 className="font-bold text-xs text-gray-800 mb-2 uppercase">MUNCH IT – PRIVACY POLICY & TERMS</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed space-y-2">
                        <strong>Version 1.0 (May 2026)</strong><br/><br/>
                        <strong>1. INTRODUCTION</strong><br/>
                        Kelloggs Tolaram Nigeria Ltd (“KTNL,” we", "us", "our,” “Munch It”) respects your privacy and is committed to protecting your (“you,” “yours,” “participant,” “consumer,” “customer”) personal data. This privacy policy contains information on how we collect your personal data as a part of Which Munch It Flavour Are You website (“Munch It”, “Website”), how we look after your personal data and inform you of your privacy rights and how the law protects you.<br/><br/>
                        This document outlines the Terms and Conditions of use as well as our Privacy Policy in compliance with the Nigeria Data Protection Act 2023 and other applicable laws. By downloading, accessing, or using this Website, you accept and agree to be bound by these Terms and Conditions and consent to the practices described in our Privacy Policy.<br/><br/>
                        <strong>2. PURPOSE OF THIS PRIVACY POLICY</strong><br/>
                        The main purpose of the Website is to help participants to answer a fun filled and entertaining quiz about their personality and they will get to know which Munch It flavour best suits their personality. Participants can share their Munch It personality on social media and share with their family and friends. Our Website is meant for adults above 18 years of age. However, if you want your Child to participate, you must be parent /legal guardian who will accept this policy on behalf of the Child.<br/><br/>
                        <strong>3. WHAT DATA WE COLLECT FROM YOU</strong><br/>
                        The data we collect from you is Personal Data: Full Name, Phone Number, Email ID, and Quiz Results. By sharing this information, you provide consent to: (a) collection, use, processing, storage, and retention of your data; (b) receiving future marketing communications; (c) sharing results on social media.<br/><br/>
                        <strong>4. DATA PROTECTION</strong><br/>
                        Munch It uses a range of physical, technical, and administrative security measures to safeguard your Personal Data. Dufil’s Customer Support is located at Kellogg Tolaram Nigeria Limited, 3B Eric Moore Road, Surulere, Lagos, Nigeria. Email: contact@kelloggtolaram.com. Phone: +234 907 029 3810.
                      </p>
                    </div>

                    {/* Agree Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <div className="relative flex items-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="sr-only"
                          disabled={isLoading}
                        />
                        <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                          agreed 
                            ? 'bg-munchit-red border-munchit-red text-white' 
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}>
                          {agreed && <Check size={14} strokeWidth={3.5} />}
                        </div>
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-gray-700 leading-tight">
                        I confirm that I am 18 years of age or older, and agree to the Privacy Policy and Terms and Conditions.
                      </span>
                    </label>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full font-bold text-lg rounded-full py-3.5 px-6 transition-all flex items-center justify-center gap-2 ${
                        isLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                          : 'bg-[#00D2D3] hover:bg-[#00B5B5] text-white shadow-[0_4px_0_0_#00A0A0] active:translate-y-1 active:shadow-none'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-3 border-gray-400 border-t-white rounded-full animate-spin"></div>
                          <span>Sending Verification SMS...</span>
                        </div>
                      ) : (
                        <>
                          <span>Send OTP</span>
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* OTP State: Verifying standard code */
                  <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
                    <p className="text-gray-700 font-medium text-sm md:text-base">
                      An SMS OTP verification pin has been sent to <span className="font-bold text-gray-800">{phoneNumber}</span>. Please enter the 4-digit PIN below to complete verification.
                    </p>

                    {/* OTP Input */}
                    <div className="max-w-[200px] mx-auto relative">
                      <input
                        type="text"
                        maxLength="4"
                        placeholder="PIN"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center tracking-[0.5em] font-black text-2xl md:text-3xl border-2 border-gray-300 rounded-2xl py-3.5 focus:outline-none focus:border-munchit-red transition-all"
                        disabled={isLoading}
                        autoFocus
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Submit OTP Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-bold text-lg rounded-full py-3.5 px-6 transition-all flex items-center justify-center gap-2 ${
                          isLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                            : 'bg-munchit-red hover:bg-red-700 text-white shadow-[0_4px_0_0_#9E040C] active:translate-y-1 active:shadow-none'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-3 border-gray-400 border-t-white rounded-full animate-spin"></div>
                            <span>Verifying...</span>
                          </div>
                        ) : (
                          <>
                            <span>Verify and Start Quiz</span>
                            <Check size={20} strokeWidth={2.5} />
                          </>
                        )}
                      </button>

                      {/* Go Back / Reset */}
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode('');
                          setError('');
                        }}
                        disabled={isLoading}
                        className="text-sm font-semibold text-gray-500 hover:text-gray-700 mt-2 transition-colors disabled:opacity-50"
                      >
                        Change Name or Phone Number
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LandingPage;
