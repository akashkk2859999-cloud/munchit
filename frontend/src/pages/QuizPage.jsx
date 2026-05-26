import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { questions } from '../data/quizData';

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const navigate = useNavigate();

  // Enforce OTP verification before allowing participation
  useEffect(() => {
    const userStr = sessionStorage.getItem('verified_user');
    if (!userStr) {
      navigate('/');
      return;
    }
    try {
      const parsed = JSON.parse(userStr);
      if (!parsed.verified || !parsed.name || !parsed.phoneNumber) {
        navigate('/');
        return;
      }
      setVerifiedUser(parsed);
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleContinue = async () => {
    if (!selectedOption) return;

    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setSelectedOption(null);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Submit quiz
      setIsSubmitting(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '/backend';
        const response = await axios.post(`${apiUrl}/api/quiz/submit`, { 
          answers: newAnswers,
          name: verifiedUser?.name || 'Anonymous',
          phoneNumber: verifiedUser?.phoneNumber || ''
        });
        navigate('/result', { state: { result: response.data, answers: newAnswers } });
      } catch (error) {
        console.error('Failed to submit quiz to backend', error);
        // Fallback for edge case resilience
        navigate('/result', { state: { fallbackAnswers: newAnswers } });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSkip = () => {
    // Pick a random option as a default answer to progress forward
    const randomOption = ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)];
    handleOptionSelect(randomOption);
    setTimeout(() => {
      handleContinue();
    }, 100);
  };

  // Maps indexes to prefix emojis in options
  const optionEmojis = {
    0: '🔥',
    1: '😎',
    2: '👀',
    3: '🤔',
    4: '🤷‍♀️'
  };

  // Maps indexes to colorful sticker stamp text
  const optionStamps = {
    0: { text: "LET'S GO!", color: "bg-[#00D2D3] border-[#00B5B5] text-white" },
    1: { text: "CHILL ✨", color: "bg-munchit-pink border-[#C9076E] text-white" },
    2: { text: "100", color: "bg-munchit-red border-red-700 text-white" },
    3: { text: "PERIODT.", color: "bg-[#0066CC] border-blue-800 text-white" },
    4: { text: "SAY IT!", color: "bg-munchit-pink border-[#C9076E] text-white" }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center py-0 md:py-8 md:px-4 overflow-hidden relative">
      
      {/* ── BACKGROUND AMBIENT EFFECTS (Desktop only) ── */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-munchit-yellow/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-munchit-red/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── PHONE CONTAINER SIMULATOR ── */}
      <div className="w-full h-screen md:h-[850px] md:max-h-[90vh] md:w-[412px] bg-munchit-yellow md:rounded-[3rem] md:shadow-2xl md:border-[12px] md:border-slate-800 md:relative md:overflow-hidden flex flex-col z-10 transition-all duration-300">
        
        {/* Phone Notch (Desktop simulator only) */}
        <div className="hidden md:block absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40" />

        {/* ── APP CANVAS ── */}
        <div className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden p-6 pt-12 md:pt-14 pb-8 select-none">
          
          {/* ── TOP HEADER / QUIZ PROGRESS ── */}
          <div className="flex justify-between items-center w-full mb-6 relative">
            {/* Logo */}
            <div className="font-display font-black text-2xl tracking-tighter text-munchit-red transform -rotate-3" style={{ textShadow: '2px 2px 0px #FFF' }}>
              MUNCH <span className="text-black bg-white px-1 py-0.5 rounded text-sm border border-munchit-red">IT</span>
            </div>
            
            {/* Question Pill */}
            <div className="bg-[#00D2D3] border-2 border-white shadow-[2px_2px_0_0_#000] text-white px-4 py-1.5 rounded-full font-display font-black text-xs uppercase tracking-wider">
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
                {/* Custom Mascot loader */}
                <div className="relative flex items-center justify-center mb-6">
                  <div className="w-16 h-16 border-8 border-black/10 border-t-munchit-red rounded-full animate-spin"></div>
                  <span className="absolute text-2xl animate-bounce">🥜</span>
                </div>
                <h2 className="text-2xl font-display font-black text-black tracking-tight uppercase">Analyzing your Vibe...</h2>
                <p className="text-xs font-bold text-black/60 uppercase mt-2">Reading the snack database...</p>
              </motion.div>
            ) : (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col flex-grow w-full"
              >
                
                {/* ── MASCOT PROGRESS BAR ── */}
                <div className="w-full relative mb-8">
                  {/* Outer track */}
                  <div className="bg-black/10 rounded-full h-4 border border-black/5 flex items-center px-1 relative w-full overflow-hidden">
                    {/* Inner progress fill */}
                    <div 
                      className="bg-[#00E676] rounded-full h-2 transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                  {/* Gliding Peanut Mascot */}
                  <div 
                    className="absolute -top-1 w-6 h-6 flex items-center justify-center text-xl transition-all duration-300 select-none pointer-events-none"
                    style={{ 
                      left: `calc(${((currentQuestionIndex + 1) / questions.length) * 100}% - 14px)` 
                    }}
                  >
                    🥜
                  </div>
                </div>

                {/* ── TORN PAPER QUESTION CARD ── */}
                <div className="relative mb-6">
                  {/* Thinking sticker overlap */}
                  <div className="absolute -top-5 -right-3 z-20 transform rotate-12 text-4xl hover:scale-110 transition-transform">
                    🤔
                  </div>
                  {/* Ripped-edge polygon paper container */}
                  <div 
                    className="bg-white border-2 border-black p-6 pt-8 pb-10 shadow-[4px_4px_0_0_#000] relative"
                    style={{
                      clipPath: "polygon(0% 0%, 100% 0%, 100% 92%, 97% 90%, 94% 93%, 90% 90%, 87% 92%, 84% 89%, 81% 91%, 78% 89%, 74% 92%, 71% 90%, 68% 92%, 65% 89%, 62% 91%, 59% 89%, 55% 93%, 52% 90%, 49% 92%, 46% 89%, 43% 91%, 40% 89%, 36% 92%, 33% 90%, 30% 92%, 27% 89%, 24% 91%, 21% 89%, 17% 92%, 14% 90%, 11% 92%, 8% 89%, 5% 91%, 0% 89%)"
                    }}
                  >
                    <h2 className="text-xl md:text-2xl text-black font-display font-black leading-snug uppercase tracking-tight text-center">
                      {currentQuestion.text}
                    </h2>
                  </div>
                </div>

                {/* ── OPTION CARDS ── */}
                <div className="space-y-3.5 mb-8 flex-grow flex flex-col justify-center">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option.id;
                    const stamp = optionStamps[idx];
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        className={`w-full text-left px-5 py-4.5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between relative group ${
                          isSelected 
                            ? 'border-munchit-red bg-white text-black shadow-[4px_4px_0_0_#E30613] transform scale-[1.02]' 
                            : 'border-black/10 bg-white hover:bg-gray-50 text-gray-800 hover:border-black/20 shadow-[2px_2px_0_0_rgba(0,0,0,0.05)]'
                        }`}
                      >
                        {/* Emoji prefix & text */}
                        <div className="flex items-center gap-3.5 pr-4 flex-1">
                          <span className="text-2xl filter drop-shadow">{optionEmojis[idx]}</span>
                          <span className="font-sans font-extrabold text-xs md:text-sm tracking-tight leading-snug uppercase">
                            {option.text}
                          </span>
                        </div>

                        {/* Stamp Label Stamp */}
                        <div 
                          className={`flex-shrink-0 border border-black px-2.5 py-1 rounded-lg text-[9px] font-display font-black uppercase tracking-wider transform group-hover:scale-105 transition-all shadow-[1px_1px_0_0_#000] rotate-3 ${stamp.color}`}
                        >
                          {stamp.text}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ── FOOTER NAVIGATION ── */}
                <div className="mt-auto flex items-center justify-between w-full pt-4 border-t border-black/5 relative z-10">
                  {/* Skip button */}
                  <button
                    onClick={handleSkip}
                    className="font-display font-black text-lg text-munchit-red hover:text-red-700 uppercase tracking-widest active:scale-95 transition-all"
                  >
                    SKIP
                  </button>

                  {/* Circular circular arrow continue */}
                  <button
                    onClick={handleContinue}
                    disabled={!selectedOption}
                    className={`rounded-full p-4.5 border-2 border-white shadow-[3px_3px_0_0_#000] transition-all flex items-center justify-center ${
                      selectedOption 
                        ? 'bg-munchit-red hover:bg-red-700 text-white active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none border-gray-400'
                    }`}
                  >
                    <ArrowRight size={24} strokeWidth={3} className="text-white" />
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
};

export default QuizPage;
