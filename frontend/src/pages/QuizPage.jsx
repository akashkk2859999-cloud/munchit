import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ArrowRight, X, Phone, User, Shield, Check, AlertCircle } from 'lucide-react';
import { questions } from '../data/quizData';
import munchItLogo from '../assets/Munch It logo.png';

const MunchItStickIcon = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] ${className}`}>
    <rect x="7" y="2" width="10" height="20" rx="3.5" fill="#FFA500" transform="rotate(15 12 12)" />
    <rect x="9" y="3" width="6" height="18" rx="2" fill="#FFE100" transform="rotate(15 12 12)" />
    <line x1="7.5" y1="6" x2="11.5" y2="6" stroke="#D32F2F" strokeWidth="1.8" strokeLinecap="round" transform="rotate(15 12 12)" />
    <line x1="9" y1="10" x2="13" y2="10" stroke="#D32F2F" strokeWidth="1.8" strokeLinecap="round" transform="rotate(15 12 12)" />
    <line x1="8.5" y1="14" x2="12.5" y2="14" stroke="#D32F2F" strokeWidth="1.8" strokeLinecap="round" transform="rotate(15 12 12)" />
    <line x1="10" y1="18" x2="14" y2="18" stroke="#D32F2F" strokeWidth="1.8" strokeLinecap="round" transform="rotate(15 12 12)" />
  </svg>
);

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const navigate = useNavigate();

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setSelectedOption(answers[questions[prevIndex].id] || null);
    }
  };

  // Participant Validation & OTP states (moved to after-quiz)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pinId, setPinId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [finalAnswers, setFinalAnswers] = useState(null);

  // Initialize verifiedUser if already checked previously
  useEffect(() => {
    const userStr = sessionStorage.getItem('verified_user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed.verified && parsed.name && parsed.phoneNumber) {
          setVerifiedUser(parsed);
          setName(parsed.name);
          setPhoneNumber(parsed.phoneNumber);
          setAgreed(true);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const getHighlightedText = (text) => {
    const highlights = [
      "your type of person",
      "leaves you on read",
      "broke",
      "expensive plans",
      "upsets you",
      "'single life' content",
      "fail",
      "something shady"
    ];
    
    let highlighted = text;
    highlights.forEach(phrase => {
      const regex = new RegExp(`(${phrase})`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="inline-block px-2.5 py-1 bg-[#FFF200] text-black font-sans font-black uppercase rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000] mx-1 transform -rotate-[2.5deg] leading-none text-[15px] md:text-[17px] short:text-[11px] tracking-tight">$1</span>`);
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  // Termii OTP Integration Handlers
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

        // Submit quiz to backend
        const submitResponse = await axios.post(`${apiUrl}/api/quiz/submit`, { 
          answers: finalAnswers,
          name: name,
          phoneNumber: phoneNumber
        });

        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/result', { state: { result: submitResponse.data, answers: finalAnswers } });
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

  const handleContinue = async () => {
    if (!selectedOption) return;

    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setSelectedOption(null);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const storedUser = sessionStorage.getItem('verified_user');
      let isVerified = false;
      let name = null;
      let phoneNumber = null;

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.verified && parsed.name && parsed.phoneNumber) {
            isVerified = true;
            name = parsed.name;
            phoneNumber = parsed.phoneNumber;
          }
        } catch (e) {}
      }

      if (isVerified) {
        setIsSubmitting(true);
        try {
          const apiUrl = import.meta.env.VITE_API_URL || '/backend';
          const response = await axios.post(`${apiUrl}/api/quiz/submit`, { 
            answers: newAnswers,
            name: name,
            phoneNumber: phoneNumber
          });
          navigate('/result', { state: { result: response.data, answers: newAnswers } });
        } catch (error) {
          console.error('Failed to submit quiz to backend', error);
          navigate('/result', { state: { fallbackAnswers: newAnswers } });
        } finally {
          setIsSubmitting(false);
        }
      } else {
        // Not verified! Open validation modal to authenticate user via Termii SMS OTP
        setFinalAnswers(newAnswers);
        setIsModalOpen(true);
      }
    }
  };

  const handleBypass = async () => {
    setIsLoading(true);
    setError('');
    const finalName = name.trim() || 'Munch It Fan';
    const finalPhone = phoneNumber.trim() || '08000000000';

    sessionStorage.setItem('verified_user', JSON.stringify({
      name: finalName,
      phoneNumber: finalPhone,
      verified: true
    }));

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/backend';
      const submitResponse = await axios.post(`${apiUrl}/api/quiz/submit`, { 
        answers: finalAnswers,
        name: finalName,
        phoneNumber: finalPhone
      });

      setIsModalOpen(false);
      navigate('/result', { state: { result: submitResponse.data, answers: finalAnswers } });
    } catch (err) {
      console.error('Bypass submit error:', err);
      navigate('/result', { state: { fallbackAnswers: finalAnswers } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    const randomOption = ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)];
    handleOptionSelect(randomOption);
    setTimeout(() => {
      handleContinue();
    }, 100);
  };

  // Emoji faces and stamp labels — each with unique rotation for organic sticker feel
  const optionStyles = [
    { 
      emoji: '🔥', 
      label: "LET'S GO!", 
      labelBg: 'bg-[#00C9C9]', 
      labelText: 'text-white',
      labelBorder: 'border-[#00A5A5]',
      rotation: '-6deg',
      isEmoji: false,
    },
    { 
      emoji: '😎', 
      label: "CHILL ✨", 
      labelBg: 'bg-[#E10B7E]', 
      labelText: 'text-white',
      labelBorder: 'border-[#C9076E]',
      rotation: '5deg',
      isEmoji: false,
    },
    { 
      emoji: '👀', 
      label: "💯", 
      labelBg: '',
      labelText: '',
      labelBorder: '',
      rotation: '0deg',
      isEmoji: true,
    },
    { 
      emoji: '🤔', 
      label: "PERIODT.", 
      labelBg: 'bg-[#0066CC]', 
      labelText: 'text-white',
      labelBorder: 'border-[#004C99]',
      rotation: '-3deg',
      isEmoji: false,
    },
    { 
      emoji: '🤷‍♀️', 
      label: "SAY IT!", 
      labelBg: 'bg-[#E10B7E]', 
      labelText: 'text-white',
      labelBorder: 'border-[#C9076E]',
      rotation: '7deg',
      isEmoji: false,
    }
  ];

  return (
    <div className="min-h-screen h-[100dvh] w-full bg-slate-950 flex items-center justify-center py-0 md:py-8 md:px-4 overflow-hidden relative">
      
      {/* ── Desktop ambient glow ── */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-munchit-yellow/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-munchit-red/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── PHONE CONTAINER ── */}
      <div className="w-full h-[100dvh] md:h-[850px] md:max-h-[90vh] md:w-[412px] bg-munchit-yellow md:rounded-[3rem] md:shadow-2xl md:border-[12px] md:border-slate-800 md:relative md:overflow-hidden flex flex-col z-10 transition-all duration-300">
        
        {/* Phone Notch */}
        <div className="hidden md:block absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40" />

        {/* ── APP CANVAS — locked vertical scroll to ensure absolute single-viewport fit ── */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden px-4 pt-6 short:pt-2 md:pt-10 pb-4 short:pb-1 select-none scrollbar-none">
          
          {/* ── TOP HEADER ── */}
          <div className="flex justify-between items-center w-full mb-2 relative z-10">
            {/* Logo */}
            <div className="relative h-9 flex items-center">
              <img 
                src={munchItLogo} 
                alt="MUNCH IT Logo" 
                className="h-full w-auto object-contain select-none pointer-events-none filter drop-shadow-sm" 
              />
            </div>
            
            {/* Question Counter Pill — GREEN/TEAL like client ref */}
            <div className="bg-[#00C9C9] border-2 border-[#00A5A5] shadow-[2px_2px_0_0_#000] text-white px-4 py-1.5 rounded-full font-sans font-black text-[11px] uppercase tracking-wider">
              QUESTION {currentQuestionIndex + 1}/{questions.length}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div
                key="submitting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center flex-grow py-20 text-center"
              >
                {/* Animated loader */}
                <div className="relative flex items-center justify-center mb-6">
                  <div className="w-20 h-20 border-[6px] border-black/10 border-t-munchit-red rounded-full animate-spin"></div>
                  <span className="absolute flex items-center justify-center animate-bounce">
                    <MunchItStickIcon className="w-8 h-8" />
                  </span>
                </div>
                <h2 className="text-2xl font-display font-black text-black tracking-tight uppercase mb-1">
                  Analyzing your Vibe...
                </h2>
                <p className="text-[11px] font-bold text-black/50 uppercase tracking-widest">
                  Reading the snack database...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 60, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col flex-1 w-full justify-between h-[calc(100%-3rem)] min-h-[400px] short:min-h-0"
              >
                
                {/* ── TOP GROUP (PROGRESS & QUESTION) ── */}
                <div className="w-full flex flex-col">
                  
                  {/* ── PROGRESS BAR — centered, 65% width, with MunchIt stick tracking ── */}
                  <div className="mx-auto w-[65%] max-w-[240px] relative mb-2 short:mb-1 flex items-center h-8 short:h-6">
                    {/* Track */}
                    <div className="bg-[#E0F2F1] rounded-full h-3 w-full overflow-hidden relative border border-black/10">
                      {/* Vibrant Green Progress Fill */}
                      <motion.div 
                        className="bg-[#00E676] rounded-full h-full"
                        initial={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                    {/* MunchIt stick tracking icon */}
                    <motion.div 
                      className="absolute top-1/2 -translate-y-1/2 z-10 pointer-events-none select-none flex items-center justify-center"
                      initial={{ left: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                      animate={{ left: `calc(${progress}% - 12px)` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <MunchItStickIcon className="w-6 h-6" />
                    </motion.div>
                  </div>

                  {/* ── QUESTION CARD — Compact layout, fits on single screen ── */}
                  <motion.div 
                    className="relative mt-3 short:mt-1 mb-2 short:mb-1 px-4"
                    animate={{ 
                      y: [0, -3, 0],
                      rotate: [0, -0.5, 0.5, 0]
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Retro silver duct tape sticker at top — gives a real hand-made Polaroid/poster feel */}
                    <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-[#B0B0B0] border-2 border-black -rotate-[1.5deg] z-25 shadow-[1px_1px_0_0_rgba(0,0,0,0.15)] flex items-center justify-center" style={{ clipPath: 'polygon(4% 0%, 96% 0%, 100% 50%, 96% 100%, 4% 100%, 0% 50%)' }}>
                      <div className="w-full h-[1px] bg-white/20"></div>
                    </div>

                    {/* Dark torn-edge paper card — dynamically scaled heights with vibrant neon teal border */}
                    <div 
                      className="bg-gray-900 border-[3.5px] border-[#00C9C9] px-6 short:px-4 pt-10 pb-20 short:pt-5 short:pb-10 min-h-[190px] short:min-h-[120px] shadow-[4px_4px_0_0_#000] relative flex flex-col justify-center text-center overflow-hidden"
                      style={{
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 87%, 97% 90%, 94% 86%, 90% 89%, 87% 85%, 84% 88%, 81% 85%, 78% 88%, 74% 85%, 71% 89%, 68% 86%, 65% 89%, 62% 85%, 59% 88%, 55% 85%, 52% 89%, 49% 86%, 46% 89%, 43% 85%, 40% 88%, 36% 85%, 33% 89%, 30% 86%, 27% 89%, 24% 85%, 21% 88%, 17% 85%, 14% 89%, 11% 86%, 8% 89%, 5% 85%, 0% 88%)"
                      }}
                    >
                      {/* Inner premium border */}
                      <div className="absolute inset-1.5 border border-dashed border-[#FFF200]/20 rounded-md pointer-events-none z-10" />

                      <h2 
                        className="text-[20px] md:text-[23px] short:text-[14px] text-white font-display font-black leading-[1.38] uppercase tracking-normal max-w-[315px] mx-auto w-full relative z-10"
                        style={{ textWrap: 'balance' }}
                      >
                        {getHighlightedText(currentQuestion.text)}
                      </h2>
                    </div>
                  </motion.div>
                </div>

                {/* ── OPTION CARDS — spread evenly across available space ── */}
                <div className="flex-1 flex flex-col justify-evenly px-4 w-full">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option.id;
                    const style = optionStyles[idx];
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.2 }}
                        className={`w-full text-left px-4 py-3 short:py-1.5 rounded-2xl border-2 transition-all duration-150 flex items-center gap-3 relative group ${
                          isSelected 
                            ? 'bg-white border-black shadow-[3px_3px_0_0_#000] transform scale-[1.01] z-10' 
                            : 'bg-white border-[#00E676] hover:bg-white text-gray-800 shadow-sm'
                        }`}
                      >
                        {/* Plain floating emoji prefix */}
                        <span className="text-2xl select-none flex-shrink-0 filter drop-shadow-sm">
                          {style.emoji}
                        </span>

                        {/* Option text — Bolder and more legible */}
                        <span className="font-sans font-extrabold text-[13px] short:text-[11px] tracking-tight leading-snug uppercase text-slate-950 flex-1">
                          {option.text}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* ── FOOTER NAVIGATION ── */}
                <div className="flex items-center justify-between w-full pt-2.5 short:pt-1 relative z-10">
                  {/* Stateful Back Button (Always visible; goes to landing page on Q1) */}
                  <button
                    onClick={currentQuestionIndex > 0 ? handleBack : () => navigate('/')}
                    className="font-sans font-black text-xs text-white uppercase tracking-wider active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-full border-2 border-black shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                  >
                    ← BACK
                  </button>

                  {/* Skip Button */}
                  <button
                    onClick={handleSkip}
                    className="font-sans font-black text-xs text-white uppercase tracking-wider active:scale-95 transition-all cursor-pointer bg-[#E30613] hover:bg-red-700 px-5 py-2.5 rounded-full border-2 border-black shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                  >
                    SKIP ➔
                  </button>

                  {/* Continue Button */}
                  <motion.button
                    onClick={handleContinue}
                    disabled={!selectedOption}
                    whileTap={selectedOption ? { scale: 0.9, y: 2 } : {}}
                    className={`rounded-full w-12 h-12 short:w-10 short:h-10 transition-all flex items-center justify-center shadow-lg cursor-pointer ${
                      selectedOption 
                        ? 'bg-[#E30613] hover:bg-red-700 text-white active:scale-95' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRight size={22} strokeWidth={4} className="text-white" />
                  </motion.button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ── VERIFICATION PROMPT OVERLAY (If modal closed but final answers ready) ── */}
        {finalAnswers && !isModalOpen && !success && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center z-45">
            <div className="bg-white border-4 border-munchit-red rounded-[2rem] p-6 max-w-xs shadow-2xl relative">
              <div className="text-4xl mb-3 animate-bounce">🔮</div>
              <h3 className="text-xl font-display font-black text-black uppercase mb-1">
                YOUR VIBE IS READY!
              </h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4 leading-normal">
                Verify your phone number to reveal your Munch It snack personality.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#00D2D3] hover:bg-[#00B5B5] text-white font-sans font-black py-3 px-6 rounded-full uppercase tracking-wider border-2 border-white shadow-[0_4px_0_0_#00A0A0] active:translate-y-0.5 active:shadow-none"
              >
                VERIFY NOW
              </button>
            </div>
          </div>
        )}

        {/* ── PARTICIPANT VALIDATION MODAL ── */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.85, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.85, y: 40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative border-4 border-munchit-red flex flex-col my-auto max-h-[90%]"
              >
                {/* Top Banner */}
                <div className="bg-munchit-red text-white py-4 px-5 relative flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="text-munchit-yellow w-5 h-5 animate-pulse" />
                    <span className="font-sans font-black text-sm tracking-wider uppercase">PARTICIPANT VALIDATION</span>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 transition-colors"
                    aria-label="Close"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                </div>

                {/* Main Body */}
                <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-3.5">
                  {/* Error Banner */}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 text-red-600 p-3 rounded-xl flex items-start gap-2 text-[11px] font-bold border border-red-200"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Successful State */}
                  {success ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center flex-grow">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 border-2 border-green-500"
                      >
                        <Check className="text-green-600 w-10 h-10" strokeWidth={3.5} />
                      </motion.div>
                      <h3 className="text-2xl font-display font-black text-gray-800 mb-1">VIBE UNLOCKED! 🎉</h3>
                      <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Generating your personality...</p>
                    </div>
                  ) : !otpSent ? (
                    /* Form State: Entering Name & Phone */
                    <form onSubmit={handleSendOtp} className="space-y-3.5 flex flex-col flex-1">
                      <p className="text-gray-600 font-bold text-[11px] leading-relaxed uppercase tracking-wide">
                        Enter your details to register and verify your number. You will receive a quick verification code via SMS.
                      </p>

                      {/* Name input */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          placeholder="Your Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D2D3] focus:border-transparent focus:bg-white transition-all text-xs"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      {/* Phone Number Input */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Phone size={16} />
                        </div>
                        <input
                          type="tel"
                          placeholder="Phone Number (e.g. 08031234567)"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D2D3] focus:border-transparent focus:bg-white transition-all text-xs"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      {/* Agree Checkbox with clickable links inside */}
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
                              ? 'bg-[#00D2D3] border-[#00D2D3] text-white' 
                              : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}>
                            {agreed && <Check size={10} strokeWidth={4} />}
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-gray-600 leading-tight">
                          I confirm that I am 18 years of age or older, and agree to the{" "}
                          <a 
                            href="https://munchit-ue.tolaram.com/privacy" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline text-[#00D2D3] font-black hover:text-teal-600 cursor-pointer"
                          >
                            Privacy Policy
                          </a>{" "}
                          and{" "}
                          <a 
                            href="https://munchit-ue.tolaram.com/terms" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline text-[#00D2D3] font-black hover:text-teal-600 cursor-pointer"
                          >
                            Terms and Conditions
                          </a>.
                        </span>
                      </label>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-sans font-black text-sm uppercase rounded-full py-3 px-6 transition-all flex items-center justify-center gap-2 ${
                          isLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                            : 'bg-[#00D2D3] hover:bg-[#00B5B5] text-white shadow-[0_4px_0_0_#00A0A0] active:translate-y-0.5 active:shadow-none border-2 border-white'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                            <span>SENDING...</span>
                          </div>
                        ) : (
                          <>
                            <span>Send OTP</span>
                            <ArrowRight size={16} strokeWidth={3.5} />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleBypass}
                        disabled={isLoading}
                        className="text-[10px] font-black text-gray-400 hover:text-[#00D2D3] mt-2 transition-colors disabled:opacity-50 uppercase tracking-wider text-center cursor-pointer"
                      >
                        Skip Verification (Local Test)
                      </button>
                    </form>
                  ) : (
                    /* OTP State: Verifying */
                    <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                      <p className="text-gray-600 font-bold text-[11px] uppercase leading-tight">
                        An SMS OTP has been sent to <span className="font-black text-gray-800">{phoneNumber}</span>. Enter the 4-digit PIN below.
                      </p>

                      {/* OTP Input */}
                      <div className="max-w-[160px] mx-auto">
                        <input
                          type="text"
                          maxLength="4"
                          placeholder="• • • •"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full text-center tracking-[0.5em] font-black text-2xl border-2 border-gray-300 rounded-xl py-3 focus:outline-none focus:border-[#00D2D3] transition-all bg-gray-50 font-sans"
                          disabled={isLoading}
                          autoFocus
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`w-full font-sans font-black text-sm uppercase rounded-full py-3.5 px-6 transition-all flex items-center justify-center gap-2 ${
                            isLoading
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                              : 'bg-munchit-red hover:bg-red-700 text-white shadow-[0_4px_0_0_#9E040C] active:translate-y-0.5 active:shadow-none border-2 border-white'
                          }`}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                              <span>VERIFYING...</span>
                            </div>
                          ) : (
                            <>
                              <span>VERIFY & VIEW RESULT</span>
                              <Check size={16} strokeWidth={3.5} />
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpCode('');
                            setError('');
                          }}
                          disabled={isLoading}
                          className="text-[10px] font-black text-gray-400 hover:text-gray-600 mt-1 transition-colors disabled:opacity-50 uppercase tracking-wider cursor-pointer"
                        >
                          ← CHANGE DETAILS
                        </button>
                        <button
                          type="button"
                          onClick={handleBypass}
                          disabled={isLoading}
                          className="text-[10px] font-black text-gray-400 hover:text-munchit-red mt-1 transition-colors disabled:opacity-50 uppercase tracking-wider cursor-pointer"
                        >
                          Skip Verification
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

export default QuizPage;
