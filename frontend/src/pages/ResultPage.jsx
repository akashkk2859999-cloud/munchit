import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { personalities } from '../data/quizData';

const getFallbackResult = (answers) => {
  if (!answers) return null;
  const counts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const key in answers) {
    counts[answers[key]]++;
  }
  let sortedKeys = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const primary = sortedKeys[0];
  
  return {
    primaryKey: primary
  };
};

const getPersonalityImage = (key) => {
  switch(key) {
    case 'A': return '/images/personalities/img_p3_2.png'; // Cheesy Stix
    case 'B': return '/images/personalities/img_p2_2.png'; // Sweet Surprise
    case 'C': return '/images/personalities/img_p4_2.png'; // Sour Cream & Onion
    case 'D': return '/images/personalities/img_p6_2.png'; // Creamy Crunch
    case 'E': return '/images/personalities/img_p5_2.png'; // Hot Chilli
    default: return '/images/personalities/img_p2_2.png';
  }
};

const getPersonalityAdjective = (key) => {
  switch(key) {
    case 'A': return "CHEESY";
    case 'B': return "LOVABLE";
    case 'C': return "SASSY";
    case 'D': return "SMOOTH";
    case 'E': return "SPICY";
    default: return "LOVABLE";
  }
};

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSharePoster, setShowSharePoster] = useState(false);
  
  const state = location.state;
  
  const result = useMemo(() => {
    if (!state) return null;
    return state.result || getFallbackResult(state.fallbackAnswers || state.answers);
  }, [state]);

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const pKey = result.primaryKey || 'A';
  const primaryData = personalities[pKey];
  const heroImage = getPersonalityImage(pKey);
  const adjective = getPersonalityAdjective(pKey);

  let shortDesc = primaryData.description;
  if (pKey === 'E') shortDesc = "You don't wait for moments... you create them. Bold, loud, unforgettable.";
  else if (pKey === 'A') shortDesc = "Sharp. Charming. Effortlessly magnetic. You don't force moments, you own them.";
  else if (pKey === 'B') shortDesc = "Soft-hearted. Easy to love. Weirdly unforgettable. You don't chase attention, people just gravitate toward you.";
  else if (pKey === 'C') shortDesc = "Bold. Blunt. Impossible to forget. You say what everyone else is thinking and make honesty feel refreshing.";
  else if (pKey === 'D') shortDesc = "Calm. Intentional. Quietly powerful. You don't need to be loud to stand out.";

  // Split description for the poster view
  const descSentences = primaryData.description.split('. ').filter(Boolean);
  const tagline = (descSentences[0] || "").toUpperCase() + (descSentences[0]?.endsWith('.') ? '' : '.');
  const restOfDesc = descSentences.slice(1).join('. ') + (descSentences.length > 1 && !descSentences[descSentences.length-1].endsWith('.') ? '.' : '');

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Munch It Personality',
        text: `I'm the ${adjective} Snack! ${shortDesc}`,
        url: window.location.origin
      }).catch(console.error);
    } else {
      alert("Share feature not supported on this browser.");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showSharePoster ? (
        <motion.div 
          key="poster"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen bg-munchit-red flex flex-col items-center justify-between py-10 px-6 relative overflow-hidden font-sans"
        >
          {/* Abstract background elements */}
          {/* Top Left Green Wave */}
          <div className="absolute -top-10 -left-10 w-40 h-20 bg-green-500 rounded-full transform -rotate-12 opacity-90" />
          {/* Top Right Cyan Wave */}
          <div className="absolute top-0 right-0 w-64 h-32 bg-[#00D2D3] rounded-bl-full opacity-90" />
          <div className="absolute top-4 right-0 w-48 h-24 bg-blue-400 rounded-bl-full opacity-60" />
          
          {/* Bottom shapes (Yellow and Green) */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-munchit-yellow opacity-100 z-0" />
          <div className="absolute -bottom-20 right-[-10%] w-80 h-64 bg-green-500 rounded-full opacity-100 z-0" />

          {/* Close button */}
          <button 
            onClick={() => setShowSharePoster(false)}
            className="absolute top-6 left-6 z-50 text-white bg-black/20 p-2 rounded-full hover:bg-black/40 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center pt-12">
            <h1 className="text-[3.5rem] md:text-[4.5rem] leading-none font-black text-munchit-yellow tracking-tighter uppercase drop-shadow-md text-center">
              {primaryData.name}
            </h1>
            <div className="mt-4 text-center">
              <h2 className="text-xl md:text-2xl font-black text-munchit-yellow uppercase tracking-wide">
                YOU'RE THE {adjective} SNACK.
              </h2>
              <h3 className="text-lg md:text-xl font-black text-munchit-yellow uppercase tracking-wide mt-1">
                {tagline}
              </h3>
            </div>

            <div className="mt-8 space-y-4 px-2">
              <p className="text-munchit-yellow font-medium text-center text-[15px] md:text-lg leading-relaxed drop-shadow-sm">
                {restOfDesc}
              </p>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-md mx-auto mt-10 flex flex-col items-center">
            {/* Logo area */}
            <div className="mb-10 font-display text-5xl font-black text-munchit-yellow transform -rotate-3 drop-shadow-lg" style={{ WebkitTextStroke: '1px white' }}>
              <span className="text-2xl block text-center mb-[-10px] transform rotate-3" style={{ WebkitTextStroke: '0px' }}>I'M A</span>
              SNACK
            </div>

            {/* CTA Button */}
            <button
              onClick={handleNativeShare}
              className="w-full bg-[#00D2D3] hover:bg-[#00B5B5] text-white rounded-full py-4 px-6 flex items-center justify-between shadow-[0_4px_0_0_#00A0A0] active:translate-y-1 active:shadow-none transition-all z-20"
            >
              <div className="flex items-center justify-center bg-munchit-red w-10 h-10 rounded-full">
                <ArrowRight size={24} strokeWidth={3} />
              </div>
              <span className="font-bold text-xl text-center flex-grow">Share Result</span>
              <div className="w-10" />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`min-h-screen flex flex-col md:flex-row font-sans overflow-hidden transition-colors duration-500 bg-munchit-yellow`}
        >
          {/* Top Image Area */}
          <div className="relative w-full md:w-1/2 h-[65vh] md:h-screen rounded-b-[2.5rem] md:rounded-b-none md:rounded-r-[2.5rem] overflow-hidden shadow-lg border-b-4 md:border-b-0 md:border-r-4 border-munchit-red/20 z-10">
            <img
              src={heroImage}
              alt={`${primaryData.name} Vibe`}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          </div>

          {/* Bottom Content Area */}
          <div className="flex-grow md:w-1/2 flex flex-col justify-center px-6 py-8 md:p-12 lg:p-20">
            <div className="max-w-xl mx-auto w-full">
              <h1 className="text-[2rem] md:text-[3rem] lg:text-[4rem] leading-none font-black text-munchit-red tracking-tight mb-4 font-display uppercase drop-shadow-sm">
                YOU'RE THE<br />{adjective} SNACK
              </h1>
              <p className="text-gray-900 font-medium text-base md:text-lg lg:text-xl leading-snug mb-8">
                {shortDesc}
              </p>

              {/* CTA Button */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setShowSharePoster(true)}
                  className="w-full bg-[#00D2D3] hover:bg-[#00B5B5] text-white rounded-full py-4 px-6 flex items-center justify-between shadow-[0_6px_0_0_#00A0A0] active:translate-y-1 active:shadow-none transition-all"
                >
                  <div className="flex items-center justify-center bg-munchit-red w-10 h-10 rounded-full">
                    <ArrowRight size={24} strokeWidth={3} />
                  </div>
                  <span className="font-bold text-xl text-center flex-grow">Share Quiz</span>
                  <div className="w-10" />
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full text-munchit-red font-bold underline text-base hover:text-red-800 transition-colors py-2"
                >
                  Take Again
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultPage;
