import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Share2, 
  RefreshCw, 
  Heart, 
  Skull, 
  MessageCircle, 
  Flame, 
  X, 
  User, 
  Phone, 
  Shield, 
  Check, 
  AlertCircle, 
  Plus, 
  Minus, 
  RotateCw, 
  Upload, 
  Download 
} from 'lucide-react';
import axios from 'axios';
import { personalities } from '../data/quizData';

// Import NEW packshot result images
import newCheesy from '../assets/NEWCHEESY-(1).jpg.jpeg';
import newSweet from '../assets/NEWSWEET1.jpg.jpeg';
import newSour from '../assets/NEWSOUR-CREAM.jpg.jpeg';
import newCreamy from '../assets/NEWCREAMY-(1).jpg.jpeg';
import newSpicy from '../assets/NEWSPICY1-(1).jpg.jpeg';

// Munch It Crunchy Stick Icon
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

  // Modal States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [step, setStep] = useState('register'); // 'register' | 'otp' | 'customize'
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pinId, setPinId] = useState('');
  
  // Customization States
  const [userImage, setUserImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotateVal, setRotateVal] = useState(0);
  const [cardScale, setCardScale] = useState(0.85); // default scale set to 85% to see background poster more!

  // Status indicators
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem('verified_user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed.verified && parsed.name) {
          setName(parsed.name);
          setPhoneNumber(parsed.phoneNumber || '');
          setStep('customize');
        }
      } catch (e) {}
    }
  }, [isShareModalOpen]);

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const pKey = result.primaryKey || 'A';
  const primaryData = personalities[pKey];
  const resultImage = getResultImage(pKey);
  const adjective = getPersonalityAdjective(pKey);
  const theme = getPersonalityTheme(pKey);

  const handleNativeShare = () => {
    // Open customize card creator directly (OTP bypassed for dev testing!)
    setIsShareModalOpen(true);
    setStep('customize');
    if (!name) {
      setName('Munch It Tester');
    }
  };

  const handleTagFriend = () => {
    const text = `Hey! Take this Munch It Snack Personality Quiz to find your flavour: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Termii OTP Integration Handlers
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms & Privacy Policy');
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
        setStep('otp');
      } else {
        setError('Failed to send verification SMS. Check number.');
      }
    } catch (err) {
      console.error('[OTP] Send error:', err);
      const serverMsg = err.response?.data?.error || 'SMS Gateway delay. You can use the bypass option below.';
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.length < 4) {
      setError('Please enter a 4-digit code');
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
        sessionStorage.setItem('verified_user', JSON.stringify({
          name: name,
          phoneNumber: phoneNumber,
          verified: true
        }));
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setStep('customize');
        }, 1000);
      } else {
        setError('Incorrect verification code');
      }
    } catch (err) {
      console.error('[OTP] Verification error:', err);
      setError('Incorrect code. Try again or skip verification.');
    } finally {
      setIsLoading(false);
    }
  };

  // SMS Gateaway Carrier Failures Bypass
  const handleBypass = () => {
    const finalName = name.trim() || 'Munch It Fan';
    sessionStorage.setItem('verified_user', JSON.stringify({
      name: finalName,
      phoneNumber: phoneNumber || '08000000000',
      verified: true
    }));
    setName(finalName);
    setStep('customize');
  };

  // Handle Photo Upload
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas Generation & Download Card
  const handleDownloadCard = () => {
    setIsLoading(true);
    setError('');

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // 1. Load background poster image
    const bgImg = new Image();
    bgImg.src = resultImage;
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      // Fill canvas with theme gradient background (matches the preview card!)
      let themeBgGrad = ctx.createLinearGradient(0, 0, 0, 1350);
      if (pKey === 'A') {
        themeBgGrad.addColorStop(0, '#0044CC');
        themeBgGrad.addColorStop(0.5, '#003399');
        themeBgGrad.addColorStop(1, '#001A66');
      } else if (pKey === 'B') {
        themeBgGrad.addColorStop(0, '#E10B7E');
        themeBgGrad.addColorStop(0.5, '#C4096C');
        themeBgGrad.addColorStop(1, '#7A054A');
      } else if (pKey === 'C') {
        themeBgGrad.addColorStop(0, '#009933');
        themeBgGrad.addColorStop(0.5, '#007722');
        themeBgGrad.addColorStop(1, '#004411');
      } else if (pKey === 'D') {
        themeBgGrad.addColorStop(0, '#662D91');
        themeBgGrad.addColorStop(0.5, '#4B1F6B');
        themeBgGrad.addColorStop(1, '#2D1240');
      } else { // E
        themeBgGrad.addColorStop(0, '#E30613');
        themeBgGrad.addColorStop(0.5, '#C9040F');
        themeBgGrad.addColorStop(1, '#8B0000');
      }
      ctx.fillStyle = themeBgGrad;
      ctx.fillRect(0, 0, 1080, 1350);

      // Draw background poster with aspect-ratio preservation (object-contain, object-top)
      const imgAspect = bgImg.width / bgImg.height;
      const canvasAspect = 1080 / 1350;
      let drawW = 1080;
      let drawH = 1350;
      let drawX = 0;
      let drawY = 0;

      if (imgAspect > canvasAspect) {
        drawW = 1080;
        drawH = 1080 / imgAspect;
        drawX = 0;
        drawY = 0;
      } else {
        drawH = 1350;
        drawW = 1350 * imgAspect;
        drawX = (1080 - drawW) / 2;
        drawY = 0;
      }
      ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);

      // Add a dark bottom gradient overlay on canvas for beautiful overlay blending
      const grad = ctx.createLinearGradient(0, 500, 0, 1350);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1350);

      // 2. Draw Polaroid Frame Card
      const baseW = 760;
      const baseH = 880;
      const frameW = baseW * cardScale;
      const frameH = baseH * cardScale;
      
      const frameX = (1080 - frameW) / 2;
      const frameY = 240 + (baseH - frameH) / 2;

      // Draw shadow (scaled)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(frameX + 12 * cardScale, frameY + 12 * cardScale, frameW, frameH);

      // Draw frame background (scaled)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(frameX, frameY, frameW, frameH, 20 * cardScale);
      ctx.fill();

      // Polaroid photo area (scaled)
      const photoX = frameX + 40 * cardScale;
      const photoY = frameY + 40 * cardScale;
      const photoW = 680 * cardScale;
      const photoH = 680 * cardScale;

      // Draw photo container placeholder background
      ctx.fillStyle = '#E5E7EB';
      ctx.fillRect(photoX, photoY, photoW, photoH);

      // If user uploaded a photo, draw it with custom zoom and rotation
      if (userImage) {
        const photoImg = new Image();
        photoImg.src = userImage;
        photoImg.onload = () => {
          ctx.save();
          // Clip to photo container square
          ctx.beginPath();
          ctx.rect(photoX, photoY, photoW, photoH);
          ctx.clip();

          // Translate to center of photo square
          const centerX = photoX + photoW / 2;
          const centerY = photoY + photoH / 2;
          ctx.translate(centerX, centerY);

          // Apply rotation
          ctx.rotate((rotateVal * Math.PI) / 180);
          
          // Apply zoom
          ctx.scale(zoom, zoom);

          // Draw the photo centered with aspect preservation
          const imgAspect = photoImg.width / photoImg.height;
          let drawW = photoW;
          let drawH = photoH;
          if (imgAspect > 1) {
            drawW = photoH * imgAspect;
          } else {
            drawH = photoW / imgAspect;
          }

          ctx.drawImage(photoImg, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();

          // Finish drawing texts
          drawCardDetails(ctx, frameX, frameY, frameW, frameH, canvas, cardScale);
        };
        photoImg.onerror = () => {
          // Draw error fallback text
          ctx.fillStyle = '#9CA3AF';
          ctx.font = 'bold 36px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Photo loading error', photoX + photoW/2, photoY + photoH/2);
          drawCardDetails(ctx, frameX, frameY, frameW, frameH, canvas, cardScale);
        };
      } else {
        // Draw standard placeholder
        ctx.fillStyle = '#9CA3AF';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('UPLOAD A PHOTO IN THE CARD CREATOR', photoX + photoW / 2, photoY + photoH / 2);
        drawCardDetails(ctx, frameX, frameY, frameW, frameH, canvas, cardScale);
      }
    };
    bgImg.onerror = () => {
      setIsLoading(false);
      setError('Failed to load assets. Try taking a screenshot!');
    };
  };

  const drawCardDetails = (ctx, frameX, frameY, frameW, frameH, canvas, cardScale) => {
    // Write user Name's Snack Vibe text under photo in Polaroid
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    
    // Draw Name text (scaled proportionally)
    ctx.font = `900 ${Math.round(38 * cardScale)}px sans-serif`;
    ctx.fillText(`${name.toUpperCase()}'S SNACK VIBE`, frameX + frameW / 2, frameY + 775 * cardScale);

    // Draw personality tagline (scaled proportionally)
    ctx.fillStyle = '#E30613';
    ctx.font = `italic bold ${Math.round(28 * cardScale)}px sans-serif`;
    ctx.fillText(`"THE ${adjective.toUpperCase()} FLAVOUR"`, frameX + frameW / 2, frameY + 825 * cardScale);

    // Draw Munch It Badge on top corner of canvas
    ctx.fillStyle = '#FFF200';
    ctx.beginPath();
    ctx.roundRect(50, 50, 360, 80, 40);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.font = '900 32px sans-serif';
    ctx.fillText('MUNCH IT PERSONALITY', 230, 102);

    // Download image
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `munchit_${adjective.toLowerCase()}_snack_card.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Canvas export error:', err);
      setIsLoading(false);
      setError('Could not download image. Try taking a screenshot!');
    }
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

        {/* ── FULL-BLEED POSTER BACKGROUND (Crisp aspect ratio object-contain with theme background to prevent cropping) ── */}
        <div className={`absolute inset-0 z-0 select-none pointer-events-none ${theme.bg} flex items-center justify-center`}>
          <img 
            src={resultImage} 
            alt={`${primaryData.name} Poster`} 
            className="w-full h-full object-contain object-top"
          />
          {/* Dark bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-black via-black/85 to-transparent z-10" />
        </div>

        {/* ── APP CANVAS ── */}
        <div className="flex-1 flex flex-col h-full relative overflow-y-auto overflow-x-hidden px-5 pt-8 md:pt-10 pb-6 select-none text-white scrollbar-none z-10">
          
          {/* Spacer */}
          <div className="w-full flex-1 min-h-[220px] md:min-h-[250px]" />

          {/* ── DESCRIPTION CARD ── */}
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

          {/* ── TWO-COLUMN SECTION (Stats / Matches) ── */}
          <div className="grid grid-cols-12 gap-3 mb-4 relative z-20 w-full">
            
            {/* Stats Card */}
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
                    <div className="w-[58px] flex items-center justify-between flex-shrink-0 text-white/90">
                      <span className="truncate">{stat.label}</span>
                      <span className="text-[10px] select-none ml-0.5">{stat.icon}</span>
                    </div>
                    
                    <div className="flex-1 bg-white/10 rounded-full h-2 p-0.5 flex items-center">
                      <motion.div 
                        className={`h-1 rounded-full ${stat.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.val}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + (i * 0.1), ease: "easeOut" }}
                      />
                    </div>
                    
                    <span className="w-5 text-right flex-shrink-0 text-[8px] text-white font-black">{stat.val}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Match Cards */}
            <div className="col-span-5 flex flex-col gap-3">
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

          {/* ── ACTIONS ── */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-auto flex flex-col gap-3.5 w-full relative z-20"
          >
            
            <div className="grid grid-cols-2 gap-3.5 w-full">
              {/* SHARE RESULT (Card Creator trigger) */}
              <button
                onClick={handleNativeShare}
                className="bg-black hover:bg-zinc-900 border-2 border-[#FFF200] text-[#FFF200] rounded-full py-3 px-4 font-sans font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#000] cursor-pointer"
              >
                <span>SHARE RESULT</span>
                <Share2 size={13} />
              </button>

              {/* TAG A FRIEND */}
              <button
                onClick={handleTagFriend}
                className="bg-black hover:bg-zinc-900 border-2 border-[#FFF200] text-[#FFF200] rounded-full py-3 px-4 font-sans font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#000] cursor-pointer"
              >
                <span>TAG A FRIEND</span>
                <span>➔</span>
              </button>
            </div>

            {/* TAKE AGAIN */}
            <button
              onClick={() => navigate('/')}
              className="text-[10px] font-black text-white/40 hover:text-white/70 mt-1 uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 mx-auto transition-colors active:scale-95 py-1 cursor-pointer"
            >
              <RefreshCw size={10} strokeWidth={3} />
              <span>TAKE QUIZ AGAIN</span>
            </button>
          </motion.div>

        </div>

      </div>

      {/* ── PREMIUM SHAREABLE CARD CREATOR DRAWER/MODAL ── */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-900 rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative border-4 border-[#FFF200] flex flex-col my-auto max-h-[92%]"
            >
              {/* Header */}
              <div className="bg-[#FFF200] text-black py-4 px-6 flex justify-between items-center select-none">
                <div className="flex items-center gap-2">
                  <MunchItStickIcon className="w-5 h-5" />
                  <span className="font-sans font-black text-sm uppercase tracking-wide">
                    {step === 'customize' ? 'CARD CUSTOMIZER' : 'VIBE SHARING'}
                  </span>
                </div>
                <button 
                  onClick={() => setIsShareModalOpen(false)}
                  className="bg-black/10 hover:bg-black/20 text-black rounded-full p-1.5 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto flex-grow flex flex-col gap-4">
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-xl flex items-start gap-2 text-[10px] font-bold leading-normal text-left"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/20 border border-green-500/30 text-green-200 p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-center"
                  >
                    <Check className="w-4 h-4 text-green-400" strokeWidth={3.5} />
                    <span>Card Exported Successfully!</span>
                  </motion.div>
                )}

                {/* ── STEP 1: Registration Form ── */}
                {step === 'register' && (
                  <form onSubmit={handleSendOtp} className="flex flex-col gap-4 text-left">
                    <p className="text-gray-400 font-bold text-[10.5px] uppercase tracking-wide leading-relaxed">
                      Register to customize your snack vibe and download your customized card.
                    </p>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <User size={15} />
                      </div>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFF200] focus:border-transparent text-xs"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Phone size={15} />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone Number (e.g. 08031234567)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFF200] focus:border-transparent text-xs"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <div className="relative flex items-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="sr-only"
                          disabled={isLoading}
                        />
                        <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                          agreed 
                            ? 'bg-[#FFF200] border-[#FFF200] text-black' 
                            : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                        }`}>
                          {agreed && <Check size={10} strokeWidth={4} />}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 leading-tight">
                        I agree that I am 18+, and accept the terms of use and policies.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full font-sans font-black text-xs uppercase rounded-full py-3.5 px-6 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isLoading
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-[#FFF200] text-black shadow-[0_3px_0_0_#D4C900] active:translate-y-0.5 active:shadow-none'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-black rounded-full animate-spin"></div>
                          <span>SENDING CODE...</span>
                        </div>
                      ) : (
                        <>
                          <span>Send Verification OTP</span>
                          <ArrowRight size={14} strokeWidth={3.5} />
                        </>
                      )}
                    </button>

                    {/* Resilient Skip Bypass */}
                    <button
                      type="button"
                      onClick={handleBypass}
                      disabled={isLoading}
                      className="text-[10px] font-black text-[#FFF200] hover:text-yellow-300 hover:underline text-center mt-2 cursor-pointer uppercase tracking-wider disabled:opacity-50"
                    >
                      ⚡ Skip SMS verification & create card
                    </button>
                  </form>
                )}

                {/* ── STEP 2: OTP Entry ── */}
                {step === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 text-center">
                    <p className="text-gray-400 font-bold text-[10.5px] uppercase leading-tight">
                      SMS sent to <span className="text-white font-black">{phoneNumber}</span>. Enter code below:
                    </p>

                    <div className="max-w-[150px] mx-auto w-full">
                      <input
                        type="text"
                        maxLength="4"
                        placeholder="• • • •"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center tracking-[0.5em] font-black text-2xl border-2 border-gray-700 rounded-xl py-3 focus:outline-none focus:border-[#FFF200] transition-all bg-gray-800 text-white font-sans"
                        disabled={isLoading}
                        autoFocus
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full font-sans font-black text-xs uppercase rounded-full py-3.5 px-6 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isLoading
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-munchit-red text-white shadow-[0_3px_0_0_#9E040C] active:translate-y-0.5 active:shadow-none'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>VERIFYING...</span>
                        </div>
                      ) : (
                        <>
                          <span>VERIFY & VIEW CREATOR</span>
                          <Check size={14} strokeWidth={3.5} />
                        </>
                      )}
                    </button>

                    {/* Resilient Skip Bypass */}
                    <button
                      type="button"
                      onClick={handleBypass}
                      disabled={isLoading}
                      className="text-[10px] font-black text-[#FFF200] hover:text-yellow-300 hover:underline text-center mt-2 cursor-pointer uppercase tracking-wider disabled:opacity-50"
                    >
                      ⚡ Delay? Skip Verification
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                        setError('');
                        setStep('register');
                      }}
                      disabled={isLoading}
                      className="text-[9px] font-bold text-gray-500 hover:text-gray-400 mt-1 uppercase cursor-pointer tracking-wider"
                    >
                      ← Edit details
                    </button>
                  </form>
                )}

                {/* ── STEP 3: Customize Card & Photo Upload ── */}
                {step === 'customize' && (
                  <div className="flex flex-col gap-4">
                    
                    {/* Live Preview Container */}
                    <div className="relative w-full aspect-square bg-black border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-end p-4 shadow-inner">
                      {/* Base Poster Background */}
                      <img 
                        src={resultImage} 
                        alt="Poster" 
                        className="absolute inset-0 w-full h-full object-contain opacity-60 z-0 select-none pointer-events-none"
                      />
                      
                      {/* Polaroid Frame Container (scaled dynamically) */}
                      <div 
                        className="relative bg-white rounded-lg p-2.5 shadow-2xl mx-auto z-10 flex flex-col justify-between"
                        style={{
                          width: '180px',
                          height: '210px',
                          transform: `scale(${cardScale})`,
                          transformOrigin: 'center',
                          transition: 'transform 0.1s ease-out'
                        }}
                      >
                        
                        {/* Frame Photo Area */}
                        <div className="w-full aspect-square bg-gray-200 rounded overflow-hidden relative flex items-center justify-center">
                          {userImage ? (
                            <div 
                              className="w-full h-full relative"
                              style={{
                                transform: `rotate(${rotateVal}deg) scale(${zoom})`,
                                transition: 'transform 0.1s ease-out'
                              }}
                            >
                              <img 
                                src={userImage} 
                                alt="User upload" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <span className="text-[8px] font-bold text-gray-400 text-center uppercase p-1">No Photo</span>
                          )}
                        </div>

                        {/* Frame text details */}
                        <div className="text-center select-none pt-1">
                          <p className="text-[9px] font-black text-black leading-none truncate">
                            {name.toUpperCase()}'S SNACK VIBE
                          </p>
                          <p className="text-[7.5px] font-black italic text-munchit-red leading-tight truncate mt-0.5">
                            "THE {adjective.toUpperCase()}"
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Interactive Tools */}
                    <div className="flex flex-col gap-2.5 bg-gray-800/80 p-3 rounded-2xl border border-gray-700/50">
                      <div className="flex justify-between items-center gap-3">
                        <label 
                          htmlFor="card-photo-upload" 
                          className="flex items-center gap-1.5 bg-[#FFF200] hover:bg-yellow-400 text-black font-sans font-black text-[10px] px-3.5 py-2.5 rounded-full uppercase cursor-pointer tracking-wider"
                        >
                          <Upload size={12} strokeWidth={3} />
                          <span>Choose Photo</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          className="hidden"
                          id="card-photo-upload"
                        />

                        {/* Adjust tools */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full cursor-pointer transition-colors"
                            title="Zoom Out"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="text-[10px] font-bold text-gray-300 w-8 text-center">{Math.round(zoom * 100)}%</span>
                          <button
                            onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full cursor-pointer transition-colors"
                            title="Zoom In"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                          
                          <div className="w-[1px] h-6 bg-gray-700 mx-1"></div>

                          <button
                            onClick={() => setRotateVal(prev => (prev + 15) % 360)}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full cursor-pointer transition-colors flex items-center gap-1 text-[10px] font-bold px-2.5"
                            title="Rotate"
                          >
                            <RotateCw size={11} strokeWidth={3} />
                            <span>15°</span>
                          </button>
                        </div>
                      </div>

                      {/* Card Size / Scale Slider */}
                      <div className="flex flex-col gap-1.5 border-t border-gray-700/50 pt-2.5 mt-2">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400 tracking-wider">
                          <span>Polaroid Frame Size</span>
                          <span className="text-[#FFF200]">{Math.round(cardScale * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold text-gray-500">MIN</span>
                          <input 
                            type="range"
                            min="0.5"
                            max="1.0"
                            step="0.05"
                            value={cardScale}
                            onChange={(e) => setCardScale(parseFloat(e.target.value))}
                            className="flex-grow h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-[#FFF200] outline-none"
                          />
                          <span className="text-[9px] font-bold text-gray-500">MAX</span>
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={handleDownloadCard}
                      disabled={isLoading}
                      className={`w-full font-sans font-black text-xs uppercase rounded-full py-4 px-6 transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                        isLoading
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-[#FFF200] text-black shadow-[0_4px_0_0_#D4C900] active:translate-y-0.5 active:shadow-none'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-black rounded-full animate-spin"></div>
                          <span>GENERATING HIGH-RES CARD...</span>
                        </>
                      ) : (
                        <>
                          <Download size={14} strokeWidth={3} />
                          <span>Download customized card</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ResultPage;
