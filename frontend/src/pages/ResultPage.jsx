import React, { useMemo } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Share2, RefreshCw, Heart, Skull, MessageCircle, Flame } from 'lucide-react';
import { personalities } from '../data/quizData';

// Import NEW packshot result images
import newCheesy from '../assets/NEWCHEESY-(1).jpg.jpeg';
import newSweet from '../assets/NEWSWEET1.jpg.jpeg';
import newSour from '../assets/NEWSOUR-CREAM.jpg.jpeg';
import newCreamy from '../assets/NEWCREAMY-(1).jpg.jpeg';
import newSpicy from '../assets/NEWSPICY1-(1).jpg.jpeg';

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

// Returns the NEW full poster image for each personality
const getResultImage = (key) => {
  switch(key) {
    case 'A': return newCheesy;
    case 'B': return newSweet;
    case 'C': return newSour;
    case 'D': return newCreamy;
    case 'E': return newSpicy;
    default: return newSweet;
  }
};

const getPersonalityAdjective = (key) => {
  switch(key) {
    case 'A': return "Cheesy";
    case 'B': return "Lovable";
    case 'C': return "Sassy";
    case 'D': return "Smooth";
    case 'E': return "Spicy";
    default: return "Sweet";
  }
};

// Gets the main brand color for each personality background gradient
const getPersonalityTheme = (key) => {
  switch(key) {
    case 'A': return {
      bg: "bg-gradient-to-b from-[#0044CC] via-[#003399] to-[#001A66]",
      accent: "#FFF200",
      glow: "bg-blue-500/20"
    };
    case 'B': return {
      bg: "bg-gradient-to-b from-[#E10B7E] via-[#C4096C] to-[#7A054A]",
      accent: "#FFF200",
      glow: "bg-pink-500/20"
    };
    case 'C': return {
      bg: "bg-gradient-to-b from-[#009933] via-[#007722] to-[#004411]",
      accent: "#FFF200",
      glow: "bg-green-500/20"
    };
    case 'D': return {
      bg: "bg-gradient-to-b from-[#662D91] via-[#4B1F6B] to-[#2D1240]",
      accent: "#FFF200",
      glow: "bg-purple-500/20"
    };
    case 'E': return {
      bg: "bg-gradient-to-b from-[#E30613] via-[#C9040F] to-[#8B0000]",
      accent: "#FFF200",
      glow: "bg-red-500/20"
    };
    default: return {
      bg: "bg-gradient-to-b from-[#E30613] via-[#C9040F] to-[#8B0000]",
      accent: "#FFF200",
      glow: "bg-red-500/20"
    };
  }
};

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const resultImage = getResultImage(pKey);
  const adjective = getPersonalityAdjective(pKey);
  const theme = getPersonalityTheme(pKey);

  const handleNativeShare = () => {
    const textDesc = `${primaryData.adjectives.join(" ")} ${primaryData.tagline}`;
    if (navigator.share) {
      navigator.share({
        title: `I'm the ${adjective} Snack!`,
        text: `I took the Munch It Snack Personality Quiz and I'm the ${adjective} Snack! ${textDesc}`,
        url: window.location.origin
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${window.location.origin}\nI'm the ${adjective} Snack! ${textDesc}`)
        .then(() => alert("Result copied! Share it with your friends."))
        .catch(() => alert("Try copying the page link to share!"));
    }
  };

  const handleTagFriend = () => {
    const text = `Hey! Take this Munch It Snack Personality Quiz to find your flavour: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center py-0 md:py-8 md:px-4 overflow-hidden relative font-sans">
      
      {/* ── Desktop ambient ── */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-munchit-yellow/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-munchit-red/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── PHONE CONTAINER ── */}
      <div className="w-full h-screen md:h-[850px] md:max-h-[90vh] md:w-[412px] bg-black md:rounded-[3rem] md:shadow-2xl md:border-[12px] md:border-slate-800 md:relative md:overflow-hidden flex flex-col z-10 transition-all duration-300 relative">
        
        {/* Phone Notch */}
        <div className="hidden md:block absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40" />

        {/* ── FULL-BLEED POSTER BACKGROUND ── */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src={resultImage} 
            alt={`${primaryData.name} Poster`} 
            className="w-full h-full object-fill"
          />
          {/* Dark bottom gradient overlay to guarantee white text contrast */}
          <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-black via-black/85 to-transparent" />
        </div>

        {/* ── APP CANVAS — scrollable elements overlaid on top ── */}
        <div className="flex-1 flex flex-col h-full relative overflow-y-auto overflow-x-hidden px-5 pt-8 md:pt-10 pb-6 select-none text-white scrollbar-none z-10">
          


          {/* ── EMPTY SPACER (Allows the top graphic and poster artwork to shine through) ── */}
          <div className="w-full flex-1 min-h-[220px] md:min-h-[250px]" />

          {/* ── SINGLE DESCRIPTION CARD — Trial layout showing the complete personality description ── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/95 rounded-2xl border border-white/10 p-4 mb-3 relative z-20 w-full text-white shadow-2xl text-left"
          >
            <span className="block text-[8px] text-pink-500 uppercase tracking-[0.2em] font-black mb-2 flex items-center gap-1">
              ✨ YOUR FLAVOUR ANALYSIS
            </span>
            <p className="text-[11px] font-medium text-white/90 leading-relaxed font-sans">
              {primaryData.description}
            </p>
          </motion.div>

          {/* ── TWO-COLUMN SECTION (Stats on Left, Matches on Right) ── */}
          <div className="grid grid-cols-12 gap-3 mb-4 relative z-20 w-full">
            
            {/* Left Column: Stats Card (spans 7 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-7 bg-black/95 rounded-2xl border border-white/10 p-3.5 flex flex-col justify-between shadow-2xl text-white"
            >
              <h3 className="font-display font-black text-[9px] text-[#E10B7E] uppercase tracking-[0.15em] mb-2 border-b border-white/10 pb-1 flex items-center gap-1">
                <Flame size={10} strokeWidth={3} className="text-[#E10B7E]" />
                YOUR FLAVOUR STATS
              </h3>
              
              <div className="space-y-3">
                {[
                  { label: 'CONFIDENCE', icon: '🔥', val: primaryData.stats.confidence, color: 'bg-[#E30613]' },
                  { label: 'CHAOS', icon: '⚡', val: primaryData.stats.chaos, color: 'bg-[#FFF200]' },
                  { label: 'PATIENCE', icon: '⏳', val: primaryData.stats.patience, color: 'bg-[#00E676]' },
                  { label: 'ROMANCE', icon: '💖', val: primaryData.stats.romance, color: 'bg-[#E10B7E]' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between gap-1.5 text-[8px] font-black uppercase tracking-wider text-white">
                    {/* Label + Emoji on the left */}
                    <div className="w-[58px] flex items-center justify-between flex-shrink-0 text-white/90">
                      <span className="truncate">{stat.label}</span>
                      <span className="text-[10px] select-none ml-0.5">{stat.icon}</span>
                    </div>
                    
                    {/* Progress bar in the middle */}
                    <div className="flex-1 bg-white/10 rounded-full h-2 p-0.5 flex items-center">
                      <motion.div 
                        className={`h-1 rounded-full ${stat.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.val}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + (i * 0.1), ease: "easeOut" }}
                      />
                    </div>
                    
                    {/* Value on the far right */}
                    <span className="w-5 text-right flex-shrink-0 text-[8px] text-white font-black">{stat.val}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Stacked Match Cards (spans 5 cols) */}
            <div className="col-span-5 flex flex-col gap-3">
              {/* Best Match */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-black/95 rounded-2xl border border-white/10 p-2.5 text-center flex flex-col items-center justify-center flex-1 shadow-2xl relative"
              >
                <span className="block text-[6.5px] text-munchit-yellow uppercase tracking-[0.15em] font-black mb-0.5">BEST MATCH</span>
                <span className="block text-[9.5px] font-display font-black uppercase text-white leading-tight">
                  {primaryData.bestMatch}
                </span>
                <span className="text-sm select-none absolute right-1.5 bottom-1.5 filter drop-shadow">💖</span>
              </motion.div>

              {/* Toxic Combo */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/95 rounded-2xl border border-white/10 p-2.5 text-center flex flex-col items-center justify-center flex-1 shadow-2xl relative"
              >
                <span className="block text-[6.5px] text-red-500 uppercase tracking-[0.15em] font-black mb-0.5">TOXIC COMBO</span>
                <span className="block text-[9.5px] font-display font-black uppercase text-white leading-tight">
                  {primaryData.toxicCombo}
                </span>
                <span className="text-sm select-none absolute right-1.5 bottom-1.5 filter drop-shadow">😒</span>
              </motion.div>
            </div>

          </div>

          {/* ── FOOTER ACTIONS (Side-by-Side black buttons with yellow borders) ── */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-auto flex flex-col gap-3.5 w-full relative z-20"
          >
            
            {/* Action buttons side-by-side */}
            <div className="grid grid-cols-2 gap-3.5 w-full">
              {/* SHARE RESULT */}
              <button
                onClick={handleNativeShare}
                className="bg-black hover:bg-zinc-900 border-2 border-[#FFF200] text-[#FFF200] rounded-full py-3 px-4 font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#000]"
              >
                <span>SHARE RESULT</span>
                <span>📤</span>
              </button>

              {/* TAG A FRIEND */}
              <button
                onClick={handleTagFriend}
                className="bg-black hover:bg-zinc-900 border-2 border-[#FFF200] text-[#FFF200] rounded-full py-3 px-4 font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#000]"
              >
                <span>TAG A FRIEND</span>
                <span>➔</span>
              </button>
            </div>

            {/* TAKE AGAIN */}
            <button
              onClick={() => navigate('/')}
              className="text-[10px] font-black text-white/40 hover:text-white/70 mt-1 uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 mx-auto transition-colors active:scale-95 py-1"
            >
              <RefreshCw size={10} strokeWidth={3} />
              <span>TAKE QUIZ AGAIN</span>
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default ResultPage;
