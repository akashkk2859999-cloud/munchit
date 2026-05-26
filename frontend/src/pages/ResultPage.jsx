import React, { useMemo } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Share2, RefreshCw } from 'lucide-react';
import { personalities } from '../data/quizData';

// Import newly uploaded packshot assets
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

const getPersonalityImage = (key) => {
  switch(key) {
    case 'A': return '/images/personalities/img_p3_2.webp'; // Cheesy Stix
    case 'B': return '/images/personalities/img_p2_2.webp'; // Sweet Surprise
    case 'C': return '/images/personalities/img_p4_2.webp'; // Sour Cream & Onion
    case 'D': return '/images/personalities/img_p6_2.webp'; // Creamy Crunch
    case 'E': return '/images/personalities/img_p5_2.webp'; // Hot Chilli
    default: return '/images/personalities/img_p2_2.webp';
  }
};

const getPackshotImage = (key) => {
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
    case 'B': return "Sweet";
    case 'C': return "Sassy";
    case 'D': return "Smooth";
    case 'E': return "Spicy";
    default: return "Sweet";
  }
};

// Gets custom gradient class based on personality type
const getPersonalityBackground = (key) => {
  switch(key) {
    case 'A': return "bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-950";
    case 'B': return "bg-gradient-to-b from-pink-600 via-rose-700 to-slate-950";
    case 'C': return "bg-gradient-to-b from-emerald-600 via-teal-700 to-slate-950";
    case 'D': return "bg-gradient-to-b from-purple-800 via-violet-900 to-slate-950";
    case 'E': return "bg-gradient-to-b from-red-600 via-[#E30613] to-amber-950";
    default: return "bg-gradient-to-b from-red-600 via-[#E30613] to-amber-950";
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
  const heroImage = getPersonalityImage(pKey);
  const packshotImage = getPackshotImage(pKey);
  const adjective = getPersonalityAdjective(pKey);
  const bgGradient = getPersonalityBackground(pKey);

  const handleNativeShare = () => {
    const textDesc = `${primaryData.adjectives.join(" ")} ${primaryData.tagline}`;
    if (navigator.share) {
      navigator.share({
        title: `I am the ${adjective} Snack!`,
        text: `I took the Which Munch It Flavour Are You quiz and got the ${adjective} Snack! ${textDesc}`,
        url: window.location.origin
      }).catch(console.error);
    } else {
      // Fallback share alerts/clipboard copy
      navigator.clipboard.writeText(`${window.location.origin}\nI got the ${adjective} Snack! ${textDesc}`)
        .then(() => alert("Result URL copied to clipboard! Share it with your friends."))
        .catch(() => alert("Sharing is not supported on this browser. Try copying the page link!"));
    }
  };

  const handleTagFriend = () => {
    const text = `Hey! Take this Which Munch It Flavour Are You quiz to find your snack personality: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center py-0 md:py-8 md:px-4 overflow-hidden relative font-sans">
      
      {/* ── BACKGROUND AMBIENT EFFECTS (Desktop only) ── */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-munchit-yellow/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-munchit-red/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── PHONE CONTAINER SIMULATOR ── */}
      <div className={`w-full h-screen md:h-[850px] md:max-h-[90vh] md:w-[412px] ${bgGradient} md:rounded-[3rem] md:shadow-2xl md:border-[12px] md:border-slate-800 md:relative md:overflow-hidden flex flex-col z-10 transition-all duration-300`}>
        
        {/* Phone Notch (Desktop simulator only) */}
        <div className="hidden md:block absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40" />

        {/* ── APP CANVAS ── */}
        <div className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden p-6 pt-12 md:pt-14 pb-8 select-none text-white scrollbar-none">
          
          {/* Flame Stickers overlay (For E/Spicy) or custom floaters */}
          {pKey === 'E' && (
            <>
              <div className="absolute top-[80px] left-[10%] z-20 transform -rotate-12 animate-pulse text-3xl">🔥</div>
              <div className="absolute top-[75px] right-[10%] z-20 transform rotate-12 animate-pulse text-3xl">🔥</div>
            </>
          )}

          {/* ── TOP HEADER ── */}
          <div className="flex justify-between items-center w-full mb-5 relative z-10">
            {/* Logo */}
            <div className="font-display font-black text-2xl tracking-tighter text-munchit-yellow transform -rotate-3" style={{ textShadow: '2px 2px 0px #E30613' }}>
              MUNCH <span className="text-black bg-white px-1.5 py-0.5 rounded text-sm border border-munchit-yellow">IT</span>
            </div>
            
            {/* Share Badge */}
            <button 
              onClick={handleNativeShare}
              className="bg-munchit-yellow border-2 border-white shadow-[2px_2px_0_0_#000] text-black active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] rounded-full p-2.5 transition-all"
            >
              <Share2 size={16} strokeWidth={3} />
            </button>
          </div>

          <div className="text-center relative z-10 mb-4">
            <span className="text-munchit-yellow font-display font-black text-xs md:text-sm tracking-[0.2em] uppercase leading-none block">
              YOU'RE THE
            </span>
            <h1 className="text-4xl md:text-5xl font-black font-display leading-none uppercase tracking-tighter mt-1 text-glow">
              {adjective} <span className="text-munchit-yellow block text-5xl md:text-6xl font-black">SNACK</span>
            </h1>
          </div>

          {/* ── INFLUENCER FRAME & PACKSHOT OVERLAY ── */}
          <div className="w-[78%] aspect-[4/5] max-h-[260px] rounded-[2rem] border-4 border-white shadow-2xl relative mx-auto mb-6 bg-slate-900 group">
            
            {/* Influencer Portrait */}
            <img 
              src={heroImage} 
              alt={`${primaryData.name} Vibe`} 
              className="w-full h-full object-cover object-top rounded-[1.8rem] select-none"
            />
            
            {/* Tilted Product Packshot Overlay (Bottom-Left Corner) */}
            <div className="absolute -bottom-5 -left-8 w-26 h-26 rounded-2xl border-4 border-white shadow-2xl rotate-12 overflow-hidden bg-white z-20 transform hover:scale-105 transition-all select-none">
              <img 
                src={packshotImage} 
                alt={`${primaryData.name} packshot`} 
                className="w-full h-full object-contain p-1"
              />
            </div>

            {/* Float badge "I'M A SNACK" */}
            <div className="absolute -top-3 -right-6 z-20 bg-munchit-yellow border-2 border-white text-black px-2 py-1 rounded-lg text-[9px] font-display font-black uppercase tracking-wider shadow-md transform rotate-12">
              100% SNACK 👑
            </div>

          </div>

          {/* ── ADJECTIVES / TAGLINE DESCRIPTION ── */}
          <div className="text-center mb-6 px-2 relative z-10">
            <div className="bg-[#FFF200] text-black px-4 py-1.5 rounded-full inline-block font-display font-black text-xs tracking-wider uppercase mb-2 border border-white shadow-[2px_2px_0_0_#000] transform -rotate-1">
              {primaryData.adjectives.join(" ")}
            </div>
            <p className="text-white font-extrabold text-xs md:text-sm uppercase tracking-wide leading-tight max-w-[290px] mx-auto mt-2">
              {primaryData.tagline}
            </p>
          </div>

          {/* ── FLAVOUR STATS CARD ── */}
          <div className="bg-black/35 backdrop-blur-md rounded-[1.8rem] border border-white/10 p-5 mb-5 w-full text-left shadow-lg relative z-10">
            <h3 className="font-display font-black text-xs md:text-sm text-munchit-yellow uppercase tracking-widest mb-3.5 border-b border-white/10 pb-1.5">
              YOUR FLAVOUR STATS
            </h3>
            
            {/* Bars list */}
            <div className="space-y-2.5">
              {[
                { label: 'CONFIDENCE', icon: '🔥', val: primaryData.stats.confidence, color: 'bg-munchit-red border-red-500' },
                { label: 'CHAOS', icon: '⚡', val: primaryData.stats.chaos, color: 'bg-munchit-yellow border-yellow-500' },
                { label: 'PATIENCE', icon: '⏳', val: primaryData.stats.patience, color: 'bg-[#00E676] border-green-500' },
                { label: 'ROMANCE', icon: '💖', val: primaryData.stats.romance, color: 'bg-munchit-pink border-pink-500' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-white/95 leading-none">
                    <span className="flex items-center gap-1">
                      <span>{stat.icon}</span> {stat.label}
                    </span>
                    <span>{stat.val}%</span>
                  </div>
                  {/* Progress track */}
                  <div className="w-full bg-white/10 rounded-full h-3 border border-white/5 p-0.5 flex items-center">
                    <div 
                      className={`h-1.5 rounded-full border-t border-white/20 transition-all duration-500 ${stat.color}`}
                      style={{ width: `${stat.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── MATCH & TOXIC SECTION (Side-by-side cards) ── */}
          <div className="grid grid-cols-2 gap-4.5 mb-5 relative z-10 w-full">
            {/* Best Match */}
            <div className="bg-black/35 backdrop-blur-md rounded-2xl border border-white/10 p-3.5 text-center flex flex-col items-center justify-center relative shadow-md">
              <span className="absolute -top-2.5 -left-1 text-xl filter drop-shadow">💖</span>
              <span className="block text-[8px] text-munchit-yellow uppercase tracking-widest font-black mb-1">BEST MATCH</span>
              <span className="block text-xs font-display font-black uppercase text-white leading-tight">
                {primaryData.bestMatch}
              </span>
            </div>

            {/* Toxic Combo */}
            <div className="bg-black/35 backdrop-blur-md rounded-2xl border border-white/10 p-3.5 text-center flex flex-col items-center justify-center relative shadow-md">
              <span className="absolute -top-2.5 -right-1 text-xl filter drop-shadow">🥶</span>
              <span className="block text-[8px] text-red-400 uppercase tracking-widest font-black mb-1">TOXIC COMBO</span>
              <span className="block text-xs font-display font-black uppercase text-white leading-tight">
                {primaryData.toxicCombo}
              </span>
            </div>
          </div>

          {/* ── TRAITS & PHRASE SECTION (Side-by-side boxes) ── */}
          <div className="grid grid-cols-2 gap-4.5 mb-8 relative z-10 w-full">
            {/* Most Used Phrase */}
            <div className="bg-black/35 backdrop-blur-md rounded-2xl border border-white/10 p-3.5 text-center flex flex-col justify-center shadow-md min-h-[72px]">
              <span className="block text-[8px] text-munchit-yellow uppercase tracking-widest font-black mb-1">MOST USED PHRASE</span>
              <span className="block text-xs font-display font-black uppercase text-white tracking-wide leading-tight italic">
                {primaryData.mostUsedPhrase}
              </span>
            </div>

            {/* Toxic Trait */}
            <div className="bg-black/35 backdrop-blur-md rounded-2xl border border-white/10 p-3.5 text-center flex flex-col justify-center relative shadow-md min-h-[72px]">
              <span className="absolute -top-3 right-4 text-lg animate-bounce">😈</span>
              <span className="block text-[8px] text-red-400 uppercase tracking-widest font-black mb-1">TOXIC TRAIT</span>
              <span className="block text-[9px] font-sans font-black uppercase text-white leading-snug tracking-tight">
                {primaryData.toxicTrait}
              </span>
            </div>
          </div>

          {/* ── FOOTER SHARE & RETRY BUTTONS ── */}
          <div className="mt-auto flex flex-col gap-4 w-full relative z-10">
            
            {/* SHARE RESULT OUTLINE BUTTON */}
            <button
              onClick={handleNativeShare}
              className="w-full border-2 border-munchit-yellow hover:bg-munchit-yellow/10 text-munchit-yellow rounded-full py-3.5 px-6 font-display font-black text-base uppercase tracking-wider transition-all border-dashed shadow-[0_2px_10px_rgba(255,242,0,0.15)] select-none flex items-center justify-center gap-2"
            >
              <span>SHARE RESULT</span>
              <span className="text-base">📤</span>
            </button>

            {/* TAG A FRIEND SOLID BUTTON */}
            <button
              onClick={handleTagFriend}
              className="w-full bg-munchit-yellow hover:bg-[#E6D900] active:translate-y-0.5 active:shadow-none text-black rounded-full py-4 px-6 flex items-center justify-between shadow-[0_4px_0_0_#A69D00] transition-all border-2 border-white select-none"
            >
              <div className="flex items-center justify-center bg-munchit-red w-8 h-8 rounded-full border border-white shadow-sm">
                <ArrowRight size={18} strokeWidth={3} className="text-white" />
              </div>
              <span className="font-display font-black text-base text-center flex-grow uppercase tracking-wider">TAG A FRIEND</span>
              <div className="w-8" />
            </button>

            {/* TAKE AGAIN RESTART ACTION */}
            <button
              onClick={() => navigate('/')}
              className="text-xs font-black text-white/50 hover:text-white mt-1 uppercase tracking-widest flex items-center justify-center gap-1.5 mx-auto transition-colors active:scale-95 py-1"
            >
              <RefreshCw size={12} strokeWidth={3} />
              <span>TAKE QUIZ AGAIN</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ResultPage;
