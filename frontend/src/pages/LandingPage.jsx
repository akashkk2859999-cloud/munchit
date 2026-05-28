import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Phone, User, Shield, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import munchItLogo from '../assets/Munch It logo.png';
import modeellls from '../assets/modeellls.png';
import element1 from '../assets/element1.png';
import element2 from '../assets/element2.png';
import element3 from '../assets/element3.png';
import element4 from '../assets/element4.png';
import cheesySnack from '../assets/cheesy_snack.png';
import lovableSnack from '../assets/lovable_snack.png';
import sassySnack from '../assets/sassy_snack.png';
import smoothSnack from '../assets/smooth_snack.png';
import spicySnack from '../assets/spicy_snack.png';

const LandingPage = () => {
  const navigate = useNavigate();

  // Navigation Drawer State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Floating particles
  const [particles] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 3,
      duration: Math.random() * 4 + 3,
      emoji: ['🔥', '⚡', '✨', '🥜', '💥', '👑', '🎯', '💫', '🌟', '😎', '🤩', '🎉'][i]
    }))
  );

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
      const apiUrl = import.meta.env.VITE_API_URL || '/backend';
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
      const apiUrl = import.meta.env.VITE_API_URL || '/backend';
      const response = await axios.post(`${apiUrl}/api/otp/verify`, {
        pinId: pinId,
        pin: otpCode
      });

      if (response.data && response.data.success) {
        setSuccess(true);
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

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center py-0 md:py-8 md:px-4 overflow-hidden relative">
      
      {/* ── BACKGROUND AMBIENT EFFECTS (Desktop only) ── */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-munchit-yellow/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-munchit-red/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── PHONE CONTAINER SIMULATOR ── */}
      <div className="w-full h-[100dvh] md:h-[850px] md:max-h-[90vh] md:w-[412px] bg-munchit-yellow md:rounded-[3rem] md:shadow-2xl md:border-[12px] md:border-slate-800 relative overflow-hidden flex flex-col z-10 transition-all duration-300">
        
        {/* Phone Notch/Dynamic Island (Desktop simulator only) */}
        <div className="hidden md:block absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40" />

        {/* ── Floating Emoji Particles ── */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute z-30 pointer-events-none select-none opacity-30"
            style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: `${p.size + 8}px` }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut"
            }}
          >
            {p.emoji}
          </motion.div>
        ))}

        {/* ── APP CANVAS ── */}
        <div className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden select-none">
          
          {/* ── TOP BRAND BAR ── */}
          <div className="flex justify-between items-center w-full px-5 pt-10 md:pt-12 pb-2 relative z-20">
            {/* MUNCH IT Logo */}
            <div className="relative h-12 flex items-center">
              <img 
                src={munchItLogo} 
                alt="MUNCH IT Logo" 
                className="h-full w-auto object-contain select-none pointer-events-none filter drop-shadow-sm" 
              />
            </div>
            
            {/* Hamburger Button */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="bg-[#0099FF] text-[#FFF200] rounded-full w-10 h-10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer z-30"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* ── HEADLINE SECTION ── */}
          <div className="px-5 mt-16 short:mt-9 xshort:mt-1 mb-2 short:mb-1 relative z-10 text-center flex flex-col items-center justify-center flex-shrink-0">
            
            {/* Styled outline drawings & stickers */}
            {/* Element 3: Fire Sticker (Top-Left) — pushed up and scaled down */}
            <motion.img 
              src={element3} 
              alt="Fire Sticker" 
              className="absolute top-2 left-0.5 z-20 w-[84px] short:w-[68px] xshort:w-[50px] object-contain drop-shadow-md select-none pointer-events-none"
              animate={{ y: [0, -3, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Yellow Crown SVG (Top-Right) */}
            <motion.div
              className="absolute top-6 right-8 z-20 w-12 h-12 text-[#FFF200]"
              animate={{ rotate: [-6, 6, -6], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-sm">
                <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                <path d="M3 20h18" strokeWidth="3.5" />
              </svg>
            </motion.div>

            {/* Float-animated speech bubble stickers — adjusted to prevent text overlapping */}
            {/* Element 2: Pink Speech Bubble (Pushed higher, to the right, and slightly smaller) */}
            <motion.img 
              src={element2} 
              alt="My Result Sticker" 
              className="absolute top-[2%] right-[1px] short:right-[2px] xshort:right-[4px] z-20 w-[80px] short:w-[68px] xshort:w-[50px] object-contain drop-shadow-md select-none pointer-events-none"
              animate={{ rotate: [4, 8, 4], y: [0, 3, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />

            {/* Headline Title — Optimized size and rotation to prevent edge clipping */}
            <h1 
              className="text-[2.25rem] short:text-[2.0rem] xshort:text-[1.6rem] px-4 leading-[0.9] font-black text-[#E30613] font-sans uppercase tracking-tight transform -rotate-[4.5deg] select-none mt-4 short:mt-2 xshort:mt-1 w-full"
              style={{ 
                textShadow: '-3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 5px 5px 0px rgba(0,0,0,0.15)' 
              }}
            >
              WHAT'S YOUR
              <span className="block text-[4.2rem] short:text-[3.6rem] xshort:text-[2.9rem] my-0.5 font-black leading-[0.9]">SNACK</span>
              <span className="block text-[2.5rem] short:text-[2.2rem] xshort:text-[1.8rem] leading-[0.9]">PERSONALITY?</span>
            </h1>
            <p 
              className="mt-3 xshort:mt-2 text-[15.5px] short:text-[13.5px] xshort:text-[11px] font-black text-[#0055FF] max-w-[300px] leading-tight tracking-[0.08em] uppercase font-sans text-center transform -rotate-[4.5deg] select-none"
              style={{
                textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.8)'
              }}
            >
              7 QUICK QUESTIONS<br/>ONE DANGEROUSLY ACCURATE RESULT
            </p>
          </div>
          {/* ── HERO IMAGE ── */}
          <div className="flex-1 flex items-end justify-center min-h-[220px] short:min-h-[180px] xshort:min-h-[140px] relative mt-8 short:mt-4 xshort:mt-0 px-4 z-0">
            {/* Very subtle low-opacity black gradient overlay to blend the cut-off feet seamlessly */}
            <div className="absolute bottom-0 left-0 right-0 h-[100px] short:h-[70px] bg-gradient-to-t from-black/5 via-black/2 to-transparent z-15 pointer-events-none" />
            
            {/* Element 1: Black Speech Bubble — placed inside the hero container to completely decouple it from text and prevent any overlap */}
            <motion.img 
              src={element1} 
              alt="No Lie Sticker" 
              className="absolute bottom-[380px] short:bottom-[330px] xshort:bottom-[225px] left-[1px] short:left-[2px] xshort:left-[4px] z-20 w-[84px] short:w-[70px] xshort:w-[52px] object-contain drop-shadow-md select-none pointer-events-none"
              animate={{ rotate: [-6, -2, -6], y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Element 4: Blue Speech Bubble */}
            <motion.img 
              src={element4} 
              alt="I Feel So Attacked Sticker" 
              className="absolute bottom-[300px] short:bottom-[245px] xshort:bottom-[150px] right-[1px] short:right-[2px] xshort:right-[4px] z-20 w-[100px] short:w-[86px] xshort:w-[60px] object-contain drop-shadow-md select-none pointer-events-none"
              animate={{ rotate: [-4, 2, -4], y: [0, -3, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
            
            <img 
              src={modeellls} 
              alt="Munch It Personality Squad" 
              className="w-[130%] short:w-[125%] xshort:w-full max-w-none object-contain object-bottom filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] transform scale-[1.04] xshort:scale-[1.08] select-none relative z-10"
            />
          </div>

          {/* ── BOTTOM ACTIONS (MERGES SEAMLESSLY INTO GRADIENT) ── */}
          <div className="relative z-20 px-5 pb-4 pt-3 flex flex-col gap-3 w-full bg-black">
            
            {/* CTA TAKE QUIZ BUTTON */}
            <motion.button
              onClick={handleStartQuiz}
              whileTap={{ scale: 0.96 }}
              className="w-full bg-[#0099FF] hover:bg-[#0088EE] text-[#FFF200] rounded-full py-4 px-6 flex items-center justify-center gap-3 border-2 border-white/10 shadow-[0_5px_15px_rgba(0,153,255,0.3)] transition-all select-none cursor-pointer font-sans font-black text-xl uppercase tracking-wider relative overflow-hidden"
            >
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
              
              <span>TAKE THE QUIZ</span>
              <span className="text-xl">➔</span>
            </motion.button>

            {/* SOCIAL PROOF */}
            <div className="mx-auto w-[82%] bg-white/5 rounded-2xl py-2 px-3 flex items-center justify-between border-2 border-[#FFF200] gap-2">
              {/* Overlapping avatar stack */}
              <div className="flex -space-x-2.5 flex-shrink-0">
                {[cheesySnack, lovableSnack, sassySnack, smoothSnack, spicySnack].map((snackImg, i) => (
                  <img
                    key={i}
                    src={snackImg}
                    alt="snack avatar"
                    className="w-7 h-7 rounded-full border border-white/20 object-cover bg-black"
                  />
                ))}
              </div>
              
              <div className="text-[10px] font-black text-[#FFF200] uppercase tracking-tight text-right flex-grow leading-tight">
                127,432 PEOPLE ALREADY FOUND THEIR FLAVOUR 👀
              </div>
            </div>

          </div>

        </div>

        {/* ── PREMIUM NAVIGATION DRAWER ── */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between p-6 text-white text-left font-sans select-none"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-center w-full mb-8 pt-4">
                  <div className="h-9 flex items-center">
                    <img 
                      src={munchItLogo} 
                      alt="MUNCH IT Logo" 
                      className="h-full w-auto object-contain filter drop-shadow-sm" 
                    />
                  </div>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-[#FFF200] hover:bg-[#FFE100] text-black rounded-full p-2 border-2 border-black shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer"
                    aria-label="Close Menu"
                  >
                    <X size={18} strokeWidth={4} />
                  </button>
                </div>

                {/* Brand slogan */}
                <div className="mb-8 px-2">
                  <h3 className="text-[#FFF200] font-display font-black text-2xl uppercase tracking-tight -rotate-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    CRUNCH OUT LOUD! 🔥
                  </h3>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mt-1.5">
                    Find your unique snack personality
                  </p>
                </div>

                {/* Navigation Links */}
                <div className="space-y-4">
                  {[
                    { label: '🏠 HOME', action: () => { setIsMenuOpen(false); navigate('/'); } },
                    { label: '🔥 TAKE THE QUIZ', action: () => { setIsMenuOpen(false); navigate('/quiz'); } },
                    { label: '🔒 PRIVACY POLICY', action: () => { setIsMenuOpen(false); navigate('/privacy'); } },
                    { label: '📜 TERMS & CONDITIONS', action: () => { setIsMenuOpen(false); navigate('/terms'); } },
                  ].map((link, idx) => (
                    <motion.button
                      key={idx}
                      onClick={link.action}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left px-5 py-4 bg-gray-900 hover:bg-gray-800 border-2 border-black rounded-2xl font-sans font-black text-sm uppercase tracking-wider text-white shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="group-hover:text-[#FFF200] transition-colors">{link.label}</span>
                      <span className="text-[#FFF200] text-xs transition-transform group-hover:translate-x-1">➔</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Credits */}
              <div className="text-center pt-6 border-t border-white/10">
                <span className="block font-sans font-black text-[11px] text-gray-500 tracking-[0.2em] uppercase">
                  Munch It Personality Quiz
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default LandingPage;
