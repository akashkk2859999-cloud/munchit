import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { questions } from '../data/quizData';

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
        const response = await axios.post('http://localhost:5000/api/quiz/submit', { answers: newAnswers });
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

  return (
    <div className="min-h-screen bg-munchit-yellow md:bg-[url('/images/personalities/g_d0_img_p7_1.png')] md:bg-cover md:bg-center md:bg-fixed flex flex-col items-center font-sans pb-6 md:py-10 relative">
      
      {/* Centered Desktop Container */}
      <div className="w-full max-w-3xl bg-munchit-yellow md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col flex-grow md:flex-grow-0 min-h-screen md:min-h-[80vh]">
        
        {/* Top Red Header Area */}
        <div className="bg-munchit-red text-white pt-10 pb-6 px-6 md:px-12 shadow-md relative z-10 rounded-b-[2rem] md:rounded-b-none">
          <h1 className="text-2xl md:text-3xl font-black text-center mb-6 font-display tracking-wide" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
            <span className="text-munchit-yellow align-top text-lg mr-1">✦</span>
            WHICH MUNCH IT<br className="md:hidden"/> FLAVOUR ARE YOU?
            <span className="text-munchit-yellow align-top text-lg ml-1">✦</span>
          </h1>
          
          <div className="flex justify-between items-end mb-2 font-bold text-sm md:text-base">
            <span>{String(currentQuestionIndex + 1).padStart(2, '0')} Question</span>
            <span>{currentQuestionIndex + 1} of {questions.length}</span>
          </div>
          
          {/* Segmented Progress Bar */}
          <div className="flex gap-1 md:gap-2 h-2 w-full">
            {questions.map((_, idx) => (
              <div 
                key={idx} 
                className={`flex-1 rounded-full ${idx <= currentQuestionIndex ? 'bg-munchit-yellow' : 'bg-white/30'}`} 
              />
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow px-6 py-8 md:px-12 md:py-10 flex flex-col">
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div
                key="submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center flex-grow py-20"
              >
                <div className="w-16 h-16 border-8 border-gray-200 border-t-munchit-red rounded-full animate-spin mb-6"></div>
                <h2 className="text-2xl font-black text-gray-800">Analyzing your vibe...</h2>
              </motion.div>
            ) : (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-grow"
              >
                {/* Question Card */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm mb-6 border border-gray-100 min-h-[120px] flex items-center justify-center text-center">
                  <h2 className="text-xl md:text-3xl text-gray-800 font-bold leading-relaxed">
                    {currentQuestion.text}
                  </h2>
                </div>

                {/* Options */}
                <div className="space-y-3 md:space-y-4 mb-8">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`w-full text-left px-6 py-4 md:py-5 rounded-full border transition-all duration-200 font-medium text-sm md:text-lg flex items-center ${
                        selectedOption === option.id 
                          ? 'border-[#00D2D3] bg-[#00D2D3] text-white shadow-md transform scale-[1.02]' 
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {/* Custom Radio Button */}
                      <div className="mr-4 flex-shrink-0 relative">
                        {selectedOption === option.id ? (
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border border-[#00D2D3] flex items-center justify-center">
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-munchit-red rounded-full" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-gray-200" />
                        )}
                      </div>
                      {option.text}
                    </button>
                  ))}
                </div>

                {/* Continue Button */}
                <div className="mt-auto">
                  <button
                    onClick={handleContinue}
                    disabled={!selectedOption}
                    className={`w-full max-w-md mx-auto rounded-full py-4 px-6 flex items-center justify-between shadow-[0_4px_0_0_#00A0A0] transition-all ${
                      selectedOption 
                        ? 'bg-[#00D2D3] hover:bg-[#00B5B5] text-white active:translate-y-1 active:shadow-none' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${selectedOption ? 'bg-munchit-red' : 'bg-gray-400'}`}>
                      <ArrowRight size={24} strokeWidth={3} className="text-white" />
                    </div>
                    <span className="font-bold text-xl text-center flex-grow">Continue</span>
                    <div className="w-10" /> {/* Spacer */}
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
