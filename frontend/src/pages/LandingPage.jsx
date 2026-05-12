import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const personalities = [
  { id: 1, image: '/images/personalities/img_p4_2.png', bg: 'bg-munchit-yellow' }, // Sassy Snack
  { id: 2, image: '/images/personalities/img_p5_2.png', bg: 'bg-munchit-yellow' }, // Spicy Snack
  { id: 3, image: '/images/personalities/img_p2_2.png', bg: 'bg-munchit-yellow' }, // Lovable Snack
  { id: 4, image: '/images/personalities/img_p3_2.png', bg: 'bg-munchit-yellow' }, // Cheesy Snack
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [[page, direction], setPage] = useState([0, 0]);

  // Wrap index to positive value within array bounds
  const currentIndex = Math.abs(page % personalities.length);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 2000); // Auto-slide every 2 seconds
    return () => clearInterval(timer);
  }, [page]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans overflow-hidden transition-colors duration-500 bg-munchit-yellow`}>
      
      {/* Carousel Area */}
      <div className="relative w-full md:w-1/2 h-[65vh] md:h-screen rounded-b-[2.5rem] md:rounded-b-none md:rounded-r-[2.5rem] overflow-hidden shadow-lg border-b-4 md:border-b-0 md:border-r-4 border-munchit-red/20 z-10 touch-pan-y">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={personalities[currentIndex].image}
            alt="Snack Personality"
            className="absolute inset-0 w-full h-full object-cover object-top cursor-grab active:cursor-grabbing"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          />
        </AnimatePresence>

        {/* Dots indicator inside the image area */}
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
          {personalities.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow md:w-1/2 flex flex-col justify-center px-6 py-8 md:p-12 lg:p-20">
        <div className="max-w-xl mx-auto w-full">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-munchit-red tracking-tight leading-[1.1] mb-4 font-display uppercase">
            Which Munch it<br />Flavour are you?
          </h1>
          <p className="text-gray-900 font-medium text-base md:text-lg lg:text-xl leading-snug mb-8">
            Seven situations. No right answers. Just you being you. Find out which Munch It snack personality you actually are; not the one you think you are.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/quiz')}
            className="w-full bg-[#00D2D3] hover:bg-[#00B5B5] text-white rounded-full py-4 px-6 flex items-center justify-between shadow-[0_6px_0_0_#00A0A0] active:translate-y-1 active:shadow-none transition-all"
          >
            <div className="flex items-center justify-center bg-munchit-red w-10 h-10 rounded-full">
              <ArrowRight size={24} strokeWidth={3} />
            </div>
            <span className="font-bold text-xl text-center flex-grow">Take the personality quiz</span>
            <div className="w-10" /> {/* Spacer for centering text */}
          </button>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
