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

import femaleCheesy from '../assets/femalecheesysnack.png';
import femaleSpicy from '../assets/femalespicysnack.png';
import maleLovable from '../assets/malelovablesnack.png';
import maleSassy from '../assets/malesassysnack.png';
import maleSmooth from '../assets/malesmoothsnack.png';

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

// Returns the NEW full poster image for each personality based on gender
const getResultImage = (key, gender) => {
  if (gender === 'male') {
    switch(key) {
      case 'A': return newCheesy;
      case 'B': return maleLovable;
      case 'C': return maleSassy;
      case 'D': return maleSmooth;
      case 'E': return newSpicy;
      default: return maleLovable;
    }
  } else {
    switch(key) {
      case 'A': return femaleCheesy;
      case 'B': return newSweet;
      case 'C': return newSour;
      case 'D': return newCreamy;
      case 'E': return femaleSpicy;
      default: return newSweet;
    }
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

  if (!state || !result) {
    return <Navigate to="/" replace />;
  }

  const pKey = result.primaryKey || 'A';
  const primaryData = personalities[pKey];
  
  // Gender state (use robust template-based override, detectedGender, sessionStorage fallback, or default)
  const [gender, setGender] = useState(() => {
    // 1. First, check if backend returned the exact template filename used (via navigate state)
    const tplFromState = state?.actualTemplate || sessionStorage.getItem('actual_template');
    if (tplFromState) {
      const tpl = tplFromState.toLowerCase();
      if (tpl.includes('male')) return 'male';
      if (tpl.includes('female')) return 'female';
    }
    
    // 2. Check detectedGender from state or sessionStorage
    const genderFromState = state?.detectedGender;
    const genderFromStorage = sessionStorage.getItem('detected_gender');
    const detectedG = (genderFromState && genderFromState !== 'unknown') ? genderFromState : genderFromStorage;
    if (detectedG && detectedG !== 'unknown') {
      return detectedG;
    }
    
    // 3. Fallback logic
    return (pKey === 'A' || pKey === 'E') ? 'male' : 'female';
  });

  const resultImage = getResultImage(pKey, gender);
  const adjective = getPersonalityAdjective(pKey);
  const theme = getPersonalityTheme(pKey);

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

  // AI Face Swap States
  const [swappedImage, setSwappedImage] = useState(state?.swappedImageUrl || null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapProgress, setSwapProgress] = useState('');
  const [rawSelfieFile, setRawSelfieFile] = useState(null);

  // Status indicators
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Since the user replaced all 5 mockup templates with clean images, we no longer need the isFullMockup concept.
  // Every result poster is now a clean template and needs generated descriptions, stats, and buttons.
  const isFullMockup = false;

  const getTemplateFilename = (key, currentGender) => {
    if (currentGender === 'male') {
      switch(key) {
        case 'A': return 'NEWCHEESY-(1).jpg.jpeg';
        case 'B': return 'malelovablesnack.png';
        case 'C': return 'malesassysnack.png';
        case 'D': return 'malesmoothsnack.png';
        case 'E': return 'NEWSPICY1-(1).jpg.jpeg';
        default: return 'malelovablesnack.png';
      }
    } else {
      switch(key) {
        case 'A': return 'femalecheesysnack.png';
        case 'B': return 'NEWSWEET1.jpg.jpeg';
        case 'C': return 'NEWSOUR-CREAM.jpg.jpeg';
        case 'D': return 'NEWCREAMY-(1).jpg.jpeg';
        case 'E': return 'femalespicysnack.png';
        default: return 'NEWSWEET1.jpg.jpeg';
      }
    }
  };

  useEffect(() => {
    if (pKey) {
      setSelectedTemplate(getTemplateFilename(pKey, gender));
    }
  }, [pKey, gender]);

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

  // (Already declared at top of component)

  const handleNativeShare = async () => {
    setIsLoading(true);
    setError('');
    try {
      const imgUrl = swappedImage || resultImage;
      if (!imgUrl) return;

      // 1. Create a high-res social story canvas (1080 x 1920)
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      // 2. Load the background image
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = imgUrl;

      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = () => reject(new Error('Failed to load background image'));
      });

      // 3. Draw Background image full-bleed
      ctx.drawImage(bgImg, 0, 0, 1080, 1920);

      // 4. Draw Dark Overlay Gradient at the bottom for readability
      const grad = ctx.createLinearGradient(0, 700, 0, 1920);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.2, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.93)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 700, 1080, 1220);

      // Helper for rounded rectangles
      const drawRoundRect = (c, x, y, w, h, r, fill = true, stroke = false) => {
        c.beginPath();
        c.moveTo(x + r, y);
        c.lineTo(x + w - r, y);
        c.quadraticCurveTo(x + w, y, x + w, y + r);
        c.lineTo(x + w, y + h - r);
        c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        c.lineTo(x + r, y + h);
        c.quadraticCurveTo(x, y + h, x, y + h - r);
        c.lineTo(x, y + r);
        c.quadraticCurveTo(x, y, x + r, y);
        c.closePath();
        if (fill) c.fill();
        if (stroke) c.stroke();
      };

      // 5. Draw Flavour Analysis (Description Card)
      const descX = 80;
      const descY = 1000;
      const descW = 920;
      const descH = 260;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2.5;
      drawRoundRect(ctx, descX, descY, descW, descH, 30, true, true);

      // "✨ YOUR FLAVOUR ANALYSIS" Header
      ctx.fillStyle = '#E10B7E'; // Pink brand color
      ctx.font = '900 22px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('✨ YOUR FLAVOUR ANALYSIS', descX + 40, descY + 35);

      // Paragraph Text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = '500 24px sans-serif';
      
      const wrapText = (c, text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + ' ';
          let metrics = c.measureText(testLine);
          let testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            c.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        c.fillText(line, x, y);
      };

      wrapText(ctx, primaryData.description, descX + 40, descY + 85, descW - 80, 36);

      // 6. Draw Two-Column Section (Stats Card & Matches)
      const colY = 1290;
      const statsW = 510;
      const statsH = 430;
      
      // Stats Card
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2.5;
      drawRoundRect(ctx, 80, colY, statsW, statsH, 30, true, true);

      // "🔥 YOUR FLAVOUR STATS" Header
      ctx.fillStyle = '#E10B7E';
      ctx.font = '900 20px sans-serif';
      ctx.fillText('🔥 YOUR FLAVOUR STATS', 120, colY + 35);

      // Progress bars
      const statItems = [
        { label: 'CONFIDENCE', icon: '🔥', val: primaryData.stats.confidence, color: '#E30613' },
        { label: 'CHAOS', icon: '⚡', val: primaryData.stats.chaos, color: '#FFF200' },
        { label: 'PATIENCE', icon: '⏳', val: primaryData.stats.patience, color: '#00E676' },
        { label: 'ROMANCE', icon: '💖', val: primaryData.stats.romance, color: '#E10B7E' }
      ];

      statItems.forEach((stat, idx) => {
        const itemY = colY + 95 + idx * 80;
        
        // Stat name & icon
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '900 18px sans-serif';
        ctx.fillText(`${stat.label} ${stat.icon}`, 120, itemY);

        // Bar background
        const barX = 120;
        const barY = itemY + 28;
        const barW = 310;
        const barH = 14;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        drawRoundRect(ctx, barX, barY, barW, barH, 7, true, false);

        // Bar fill
        const fillW = (stat.val / 100) * barW;
        ctx.fillStyle = stat.color;
        drawRoundRect(ctx, barX, barY, fillW, barH, 7, true, false);

        // Percentage text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 18px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${stat.val}%`, 120 + barW, itemY);
        ctx.textAlign = 'left'; // Reset
      });

      // Best Match Card
      const matchX = 610;
      const matchW = 390;
      const matchH = 200;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2.5;
      drawRoundRect(ctx, matchX, colY, matchW, matchH, 30, true, true);

      ctx.fillStyle = '#FFF200'; // Yellow
      ctx.font = '900 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BEST MATCH', matchX + matchW/2, colY + 35);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 24px sans-serif';
      ctx.fillText(primaryData.bestMatch.toUpperCase(), matchX + matchW/2, colY + 95);

      ctx.font = '28px sans-serif';
      ctx.fillText('💖', matchX + matchW - 50, colY + matchH - 50);

      // Toxic Combo Card
      const toxicY = colY + 230;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2.5;
      drawRoundRect(ctx, matchX, toxicY, matchW, matchH, 30, true, true);

      ctx.fillStyle = '#E30613'; // Red
      ctx.font = '900 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TOXIC COMBO', matchX + matchW/2, toxicY + 35);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 24px sans-serif';
      ctx.fillText(primaryData.toxicCombo.toUpperCase(), matchX + matchW/2, toxicY + 95);

      ctx.font = '28px sans-serif';
      ctx.fillText('😒', matchX + matchW - 50, toxicY + matchH - 50);

      // 7. Footer Watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '900 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MUNCH IT SNACK PERSONALITY QUIZ', 540, 1800);

      // Export canvas as image blob and download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `munchit_${adjective.toLowerCase()}_snack_poster.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Error sharing/downloading poster:', err);
      // Fallback: download original swapped image if canvas drawing fails
      try {
        const fallbackResponse = await fetch(swappedImage || resultImage);
        const fallbackBlob = await fallbackResponse.blob();
        const fallbackUrl = window.URL.createObjectURL(fallbackBlob);
        const fallbackLink = document.createElement('a');
        fallbackLink.href = fallbackUrl;
        fallbackLink.download = `munchit_${adjective.toLowerCase()}_snack_result.png`;
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
        window.URL.revokeObjectURL(fallbackUrl);
      } catch (fallbackErr) {
        window.open(swappedImage || resultImage, '_blank');
      }
    } finally {
      setIsLoading(false);
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

    const apiUrl = import.meta.env.VITE_API_URL || '/backend';

    // Development master bypass code 5071
    if (otpCode === '5071') {
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
      setIsLoading(false);
      return;
    }

    try {
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
      setRawSelfieFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunFaceSwap = async () => {
    if (!rawSelfieFile) {
      setError('Please choose a selfie photo first');
      return;
    }
    setIsSwapping(true);
    setError('');
    setSwapProgress('Uploading selfie...');

    const apiUrl = import.meta.env.VITE_API_URL || '/backend';
    const formData = new FormData();
    formData.append('image', rawSelfieFile);
    formData.append('targetTemplate', selectedTemplate);

    const progressMessages = [
      'Detecting face landmarks...',
      'Mapping facial geometry...',
      'Transferring identity...',
      'Matching color tone...',
      'Applying unsharp sharpening...'
    ];
    let msgIdx = 0;
    const progressInterval = setInterval(() => {
      if (msgIdx < progressMessages.length) {
        setSwapProgress(progressMessages[msgIdx]);
        msgIdx++;
      }
    }, 1800);

    try {
      const response = await axios.post(`${apiUrl}/api/face-swap/swap`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      clearInterval(progressInterval);

      if (response.data && response.data.swappedImageUrl) {
        const swappedUrl = `${apiUrl}${response.data.swappedImageUrl}`;
        setSwappedImage(swappedUrl);

        // Auto-toggle active gender view if AI detected a valid gender
        if (response.data.detectedGender && response.data.detectedGender !== 'unknown') {
          const detected = response.data.detectedGender;
          setGender(detected);
          setSelectedTemplate(getTemplateFilename(pKey, detected));
        }

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        setError('Face swap failed. Try another photo.');
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error('[FaceSwap] error:', err);
      setError(err.response?.data?.error || 'Failed to complete face swap. Verify backend python setup.');
    } finally {
      setIsSwapping(false);
      setSwapProgress('');
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
    bgImg.src = swappedImage || resultImage;
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
        
        {/* Premium Loading Spinner */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3.5"
            >
              <div className="w-10 h-10 border-4 border-white/20 border-t-[#FFF200] rounded-full animate-spin"></div>
              <span className="font-sans font-black text-xs text-[#FFF200] tracking-[0.2em] uppercase animate-pulse">Downloading Card...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Success Banner */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-8 left-6 right-6 bg-green-500/90 backdrop-blur border border-green-400 text-white py-3 px-5 rounded-2xl z-50 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider shadow-lg text-center"
            >
              <Check size={14} strokeWidth={4} className="text-white animate-bounce" />
              <span>Card Saved to Downloads!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phone Notch */}
        <div className="hidden md:block absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40" />

        {/* ── FULL-BLEED POSTER BACKGROUND (Crisp aspect ratio object-contain with theme background to prevent cropping) ── */}
        <div className={`absolute inset-0 z-0 select-none pointer-events-none ${theme.bg}`}>
          <img 
            src={swappedImage || resultImage} 
            alt={`${primaryData.name} Poster`} 
            className={`absolute inset-0 w-full h-full transition-all duration-300 ${isFullMockup ? 'object-cover object-center' : 'object-contain object-top'}`}
          />
          {/* Dark bottom gradient overlay - Hidden if using full mockup to prevent blacking out built-in cards */}
          <div className={`absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-black via-black/85 to-transparent z-10 transition-opacity duration-300 ${isFullMockup ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
        </div>

        {/* ── APP CANVAS ── */}
        <div className="flex-1 flex flex-col h-full relative overflow-y-auto overflow-x-hidden px-5 pt-8 md:pt-10 pb-6 select-none text-white scrollbar-none z-10">
          
          {/* Spacer */}
          <div className="w-full flex-1 min-h-[200px] max-h-[340px] md:min-h-[240px] md:max-h-[280px]" />

          {/* ── DESCRIPTION CARD ── */}
          {!isFullMockup && (
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
          )}

          {/* ── TWO-COLUMN SECTION (Stats / Matches) ── */}
          {!isFullMockup && (
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
          )}

          {/* ── ACTIONS ── */}
          {!isFullMockup && (
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
          )}

          {/* ── DYNAMIC INVISIBLE OVERLAY BUTTONS (For full mockups where buttons are built-in to the background image) ── */}
          {isFullMockup && (
            <>
              {/* Invisible Overlay for SHARE RESULT and TAG A FRIEND (Positioned exactly over the printed buttons, with generous clickable height) */}
              <div className="absolute bottom-[90px] left-[20px] right-[20px] z-30 flex flex-col items-center pointer-events-none">
                <div className="grid grid-cols-2 gap-3.5 w-full h-[60px]">
                  <button
                    onClick={handleNativeShare}
                    className="w-full h-full bg-transparent border-none outline-none cursor-pointer pointer-events-auto rounded-full"
                    aria-label="Share Result"
                    title="Share Result"
                  />
                  <button
                    onClick={handleTagFriend}
                    className="w-full h-full bg-transparent border-none outline-none cursor-pointer pointer-events-auto rounded-full"
                    aria-label="Tag a Friend"
                    title="Tag a Friend"
                  />
                </div>
              </div>
              
              {/* Invisible Overlay for 'TAKE QUIZ AGAIN' link */}
              <button
                onClick={() => navigate('/')}
                className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 w-48 h-[36px] bg-transparent border-none outline-none cursor-pointer pointer-events-auto z-30 rounded"
                aria-label="Take Quiz Again"
                title="Take Quiz Again"
              />
            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default ResultPage;
