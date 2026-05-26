import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Phone, User, Shield, Check, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';

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
      const apiUrl = import.meta.env.VITE_API_URL || '/backend';
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
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center py-0 md:py-8 md:px-4 overflow-hidden relative">
      
      {/* ── BACKGROUND AMBIENT EFFECTS (Desktop only) ── */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-munchit-yellow/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-munchit-red/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── PHONE CONTAINER SIMULATOR ── */}
      <div className="w-full h-screen md:h-[850px] md:max-h-[90vh] md:w-[412px] bg-munchit-yellow md:rounded-[3rem] md:shadow-2xl md:border-[12px] md:border-slate-800 md:relative md:overflow-hidden flex flex-col z-10 transition-all duration-300">
        
        {/* Phone Notch/Dynamic Island (Desktop simulator only) */}
        <div className="hidden md:block absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40" />

        {/* ── APP CANVAS ── */}
        <div className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden p-6 pt-12 md:pt-14 pb-8 select-none">
          
          {/* ── TOP NAV BAR ── */}
          <div className="flex justify-between items-center w-full mb-6">
            {/* Custom Premium MUNCH IT Logo */}
            <div className="font-display font-black text-3xl tracking-tighter text-munchit-red transform -rotate-3 select-none flex flex-col leading-none" style={{ textShadow: '2px 2px 0px #FFF' }}>
              <span className="text-[10px] text-black font-sans font-bold tracking-widest leading-none mb-0.5 self-start">KELLOGG'S</span>
              <span className="flex items-center">
                MUNCH
                <span className="text-black ml-1 bg-white px-1.5 py-0.5 rounded text-lg leading-none border-2 border-munchit-red">IT</span>
              </span>
            </div>
            
            {/* Hamburger / Info Button */}
            <button 
              onClick={() => alert("Munch It Personality Quiz - V1.5") }
              className="bg-munchit-red border-2 border-white shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] text-white rounded-full p-2.5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {/* ── FLOATERS & STICKERS ── */}
          {/* Flame Icon */}
          <div className="absolute top-[180px] left-[8%] z-20 transform -rotate-12 animate-bounce">
            <span className="text-4xl">🔥</span>
          </div>
          {/* Crown Icon */}
          <div className="absolute top-[110px] right-[12%] z-20 transform rotate-12 animate-pulse">
            <span className="text-3xl">👑</span>
          </div>

          {/* Sticker 1: "NO LIE, THIS QUIZ IS TOO ACCURATE 😭" */}
          <div className="absolute top-[138px] left-[5%] z-20 bg-black border-2 border-white text-white px-3 py-1.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-tight shadow-md transform -rotate-6 flex items-center gap-1.5">
            <span>NO LIE, THIS QUIZ IS TOO ACCURATE</span>
            <span className="text-sm">😭</span>
          </div>

          {/* Sticker 2: "my result was insaneee! 🤪" */}
          <div className="absolute top-[225px] right-[4%] z-20 bg-munchit-pink border-2 border-white text-white px-3 py-1.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-tight shadow-md transform rotate-6 flex items-center gap-1">
            <span>my result was insaneee!</span>
            <span className="text-sm">🤪</span>
          </div>

          {/* Sticker 3: "I feel so attacked 💀" */}
          <div className="absolute top-[280px] right-[8%] z-20 bg-[#00D2D3] border-2 border-white text-white px-3 py-1.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-tight shadow-md transform -rotate-6 flex items-center gap-1">
            <span>I feel so attacked</span>
            <span className="text-sm">💀</span>
          </div>

          {/* ── HERO HEADER ── */}
          <div className="mt-8 mb-6 relative z-10 text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-black text-munchit-red leading-none font-display uppercase tracking-tighter transform -rotate-2 drop-shadow-sm select-none" style={{ textShadow: '3px 3px 0px #FFF, 5px 5px 0px rgba(0,0,0,0.1)' }}>
              WHICH
              <span className="block text-5xl md:text-6xl text-black my-1 font-black">MUNCH IT</span>
              SNACK ARE YOU?
            </h1>
            <p className="mt-3 text-xs md:text-sm font-extrabold text-black/80 max-w-[280px] leading-tight tracking-wide uppercase">
              7 QUICK QUESTIONS.<br />ONE DANGEROUSLY ACCURATE RESULT.
            </p>
          </div>

          {/* ── MAIN GROUP INFLUENCERS GRAPHIC ── */}
          <div className="flex-1 flex items-center justify-center min-h-[220px] relative my-2 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-munchit-yellow via-transparent to-transparent z-10" />
            <img 
              src="/images/personalities/g_d0_img_p7_1.webp" 
              alt="Munch It Vibe Group" 
              className="w-[90%] h-full max-h-[300px] object-contain object-center filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.25)] transform scale-105 select-none"
            />
          </div>

          {/* ── BOTTOM ACTIONS ── */}
          <div className="relative z-20 mt-auto flex flex-col gap-5 w-full">
            
            {/* CTA TAKE QUIZ BUTTON */}
            <div className="relative w-full">
              {/* Hand-drawn styled arrow pointer */}
              <div className="absolute -top-12 left-[12%] z-10 pointer-events-none transform -rotate-12 animate-pulse hidden md:block">
                <svg className="w-10 h-10 text-white fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>

              <button
                onClick={() => {
                  setError('');
                  setIsModalOpen(true);
                }}
                className="w-full bg-[#00D2D3] hover:bg-[#00B5B5] active:translate-y-1 active:shadow-none text-white rounded-full py-4.5 px-6 flex items-center justify-between shadow-[0_6px_0_0_#00A0A0] transition-all border-2 border-white"
              >
                <div className="flex items-center justify-center bg-munchit-red w-10 h-10 rounded-full border border-white">
                  <ArrowRight size={24} strokeWidth={3} className="text-white" />
                </div>
                <span className="font-display font-black text-xl text-center flex-grow uppercase tracking-wider">Take the quiz</span>
                <div className="w-10" /> {/* Spacer */}
              </button>
            </div>

            {/* SOCIAL PROOF PARTICIPANT COUNTER */}
            <div className="bg-black/5 rounded-2xl py-2 px-3 flex items-center justify-between border border-black/10 gap-3">
              {/* Overlapping avatar stack */}
              <div className="flex -space-x-2.5">
                {['img_p2_2.webp', 'img_p3_2.webp', 'img_p4_2.webp', 'img_p5_2.webp'].map((img, i) => (
                  <img
                    key={i}
                    src={`/images/personalities/${img}`}
                    alt="avatar"
                    className="w-7 h-7 rounded-full border-2 border-munchit-yellow object-cover object-top"
                  />
                ))}
              </div>
              
              <div className="text-[10px] md:text-xs font-black text-black/90 uppercase tracking-tight text-right flex-grow leading-tight">
                127,432 PEOPLE ALREADY FOUND THEIR FLAVOUR 👀
              </div>
            </div>

          </div>

        </div>

        {/* ── MODAL COMPONENT ── */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative border-4 border-munchit-red flex flex-col my-auto max-h-[90%]"
              >
                
                {/* Top Banner Accent */}
                <div className="bg-munchit-red text-white py-4 px-6 relative flex justify-between items-center border-b-2 border-white">
                  <div className="flex items-center gap-2">
                    <Shield className="text-munchit-yellow w-6 h-6 animate-pulse" />
                    <span className="font-display font-black text-lg tracking-wide uppercase">PARTICIPANT VALIDATION</span>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors"
                  >
                    <X size={18} strokeWidth={3} />
                  </button>
                </div>

                {/* Main Body */}
                <div className="p-5 md:p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                  
                  {/* Error Banner */}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 text-red-600 p-3 rounded-2xl flex items-start gap-2 text-xs font-bold border border-red-200"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Successful State */}
                  {success ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center flex-grow">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce border-2 border-green-500">
                        <Check className="text-green-600 w-10 h-10" strokeWidth={3.5} />
                      </div>
                      <h3 className="text-2xl font-display font-black text-gray-800 mb-1">VIBE UNLOCKED!</h3>
                      <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">Preparing your quiz deck...</p>
                    </div>
                  ) : !otpSent ? (
                    /* Form State: Entering Name & Phone */
                    <form onSubmit={handleSendOtp} className="space-y-4 flex flex-col flex-1">
                      <p className="text-gray-700 font-bold text-xs leading-relaxed uppercase">
                        Enter your details to register and verify your number. You will receive a quick verification code via SMS.
                      </p>

                      {/* Name input */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <User size={18} />
                        </div>
                        <input
                          type="text"
                          placeholder="YOUR FULL NAME"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-munchit-red focus:bg-white transition-all text-xs"
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
                          placeholder="PHONE NUMBER (E.G. 08031234567)"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-munchit-red focus:bg-white transition-all text-xs"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      {/* Scrollable Privacy Policy Section */}
                      <div className="border border-gray-200 rounded-2xl bg-gray-50 p-3 max-h-[100px] overflow-y-auto text-left">
                        <h4 className="font-black text-[10px] text-gray-800 mb-1 uppercase">MUNCH IT – PRIVACY POLICY & TERMS</h4>
                        <p className="text-[9px] text-gray-500 font-medium leading-normal space-y-1.5">
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
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <div className="relative flex items-center mt-0.5">
                          <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="sr-only"
                            disabled={isLoading}
                          />
                          <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${
                            agreed 
                              ? 'bg-munchit-red border-munchit-red text-white' 
                              : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}>
                            {agreed && <Check size={10} strokeWidth={4} />}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 leading-tight">
                          I confirm that I am 18 years of age or older, and agree to the Privacy Policy and Terms and Conditions.
                        </span>
                      </label>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-display font-black text-sm uppercase rounded-full py-3 px-6 transition-all flex items-center justify-center gap-2 ${
                          isLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                            : 'bg-[#00D2D3] hover:bg-[#00B5B5] text-white shadow-[0_4px_0_0_#00A0A0] active:translate-y-0.5 active:shadow-none border border-white'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                            <span>Dispatched SMS...</span>
                          </div>
                        ) : (
                          <>
                            <span>Send OTP</span>
                            <ArrowRight size={16} strokeWidth={3.5} />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* OTP State: Verifying standard code */
                    <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                      <p className="text-gray-700 font-bold text-xs uppercase leading-tight">
                        An SMS OTP verification pin has been sent to <span className="font-black text-gray-800">{phoneNumber}</span>. Please enter the 4-digit PIN below.
                      </p>

                      {/* OTP Input */}
                      <div className="max-w-[160px] mx-auto relative">
                        <input
                          type="text"
                          maxLength="4"
                          placeholder="PIN"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full text-center tracking-[0.4em] font-black text-2xl border-2 border-gray-300 rounded-2xl py-3 focus:outline-none focus:border-munchit-red transition-all bg-gray-50 font-display"
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
                          className={`w-full font-display font-black text-sm uppercase rounded-full py-3.5 px-6 transition-all flex items-center justify-center gap-2 ${
                            isLoading
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                              : 'bg-munchit-red hover:bg-red-700 text-white shadow-[0_4px_0_0_#9E040C] active:translate-y-0.5 active:shadow-none border border-white'
                          }`}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                              <span>Verifying...</span>
                            </div>
                          ) : (
                            <>
                              <span>Verify and Start Quiz</span>
                              <Check size={16} strokeWidth={3.5} />
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
                          className="text-[10px] font-black text-gray-400 hover:text-gray-600 mt-1 transition-colors disabled:opacity-50 uppercase tracking-wider"
                        >
                          Change details
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
    </div>
  );
};

export default LandingPage;
