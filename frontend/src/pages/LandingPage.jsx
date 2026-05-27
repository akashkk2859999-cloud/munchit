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
      <div className="w-full h-screen md:h-[850px] md:max-h-[90vh] md:w-[412px] bg-munchit-yellow md:rounded-[3rem] md:shadow-2xl md:border-[12px] md:border-slate-800 md:relative md:overflow-hidden flex flex-col z-10 transition-all duration-300 relative">
        
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
              onClick={() => alert("Munch It Personality Quiz — V2.0") }
              className="bg-[#0099FF] text-[#FFF200] rounded-full w-10 h-10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* ── HEADLINE SECTION ── */}
          <div className="px-5 mt-3 short:mt-1 mb-1 relative z-10 text-center flex flex-col items-center flex-grow short:flex-grow-0 justify-center min-h-[150px] short:min-h-0 short:py-0">
            
            {/* Styled outline drawings & stickers */}
            {/* Element 3: Fire Sticker (Top-Left) */}
            <motion.img 
              src={element3} 
              alt="Fire Sticker" 
              className="absolute top-6 left-2 z-20 w-[95px] short:w-[70px] object-contain drop-shadow-md select-none pointer-events-none"
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
            {/* Element 1: Black Speech Bubble (Moved down left side) */}
            <motion.img 
              src={element1} 
              alt="No Lie Sticker" 
              className="absolute top-[58%] left-[2px] z-20 w-[80px] short:w-[60px] object-contain drop-shadow-md select-none pointer-events-none"
              animate={{ rotate: [-6, -2, -6], y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Element 2: Pink Speech Bubble */}
            <motion.img 
              src={element2} 
              alt="My Result Sticker" 
              className="absolute top-[12%] right-[2px] z-20 w-[78px] short:w-[60px] object-contain drop-shadow-md select-none pointer-events-none"
              animate={{ rotate: [4, 8, 4], y: [0, 3, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />

            {/* Headline Title */}
            <h1 
              className="text-[2.6rem] short:text-[2.2rem] leading-[0.95] font-black text-[#E30613] font-display uppercase tracking-tight transform -rotate-[4.5deg] select-none mt-4 short:mt-2"
              style={{ 
                textShadow: '-3.2px -3.2px 0 #fff, 3.2px -3.2px 0 #fff, -3.2px 3.2px 0 #fff, 3.2px 3.2px 0 #fff, 5px 5px 0px rgba(0,0,0,0.15)' 
              }}
            >
              WHICH
              <span className="block text-[3.4rem] short:text-[2.8rem] my-1 short:my-0.5 font-black leading-[0.9]">MUNCH IT</span>
              <span className="block text-[3rem] short:text-[2.5rem] my-1 short:my-0.5 leading-[0.9]">SNACK</span>
              <span className="block text-[2.8rem] short:text-[2.3rem] leading-[0.9]">ARE YOU?</span>
            </h1>
            <p className="mt-2 text-[10px] font-black text-[#0099FF] max-w-[245px] leading-tight tracking-[0.12em] uppercase font-sans text-center transform -rotate-[4.5deg]">
              7 QUICK QUESTIONS<br/>ONE DANGEROUSLY ACCURATE RESULT
            </p>
          </div>
          {/* ── HERO IMAGE ── */}
          <div className="flex-1 flex items-end justify-center min-h-[220px] short:min-h-[180px] relative mt-2 short:mt-0 px-4 z-0">
            {/* Tall black gradient mask behind the models to blend yellow background into the black bottom actions seamlessly */}
            <div className="absolute bottom-0 left-0 right-0 h-[280px] bg-gradient-to-t from-black via-black/45 to-transparent z-0 pointer-events-none" />
            
            {/* Element 4: Blue Speech Bubble */}
            <motion.img 
              src={element4} 
              alt="I Feel So Attacked Sticker" 
              className="absolute bottom-[230px] short:bottom-[180px] right-[4px] z-20 w-[90px] short:w-[70px] object-contain drop-shadow-md select-none pointer-events-none"
              animate={{ rotate: [-4, 2, -4], y: [0, -3, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
            
            <img 
              src={modeellls} 
              alt="Munch It Personality Squad" 
              className="w-full max-h-[350px] short:max-h-[280px] object-contain object-bottom filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.25)] transform scale-[1.05] select-none relative z-10"
            />
          </div>

          {/* ── BOTTOM ACTIONS (MERGES SEAMLESSLY INTO GRADIENT) ── */}
          <div className="relative z-20 px-5 pb-4 pt-3 flex flex-col gap-3 w-full bg-black">
            
            {/* CTA TAKE QUIZ BUTTON */}
            <motion.button
              onClick={handleStartQuiz}
              whileTap={{ scale: 0.96 }}
              className="w-full bg-[#0099FF] hover:bg-[#0088EE] text-[#FFF200] rounded-full py-4 px-6 flex items-center justify-center gap-3 border-2 border-white/10 shadow-[0_5px_15px_rgba(0,153,255,0.3)] transition-all select-none cursor-pointer font-display font-black text-xl uppercase tracking-wider relative overflow-hidden"
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



      </div>
    </div>
  );
};

export default LandingPage;
