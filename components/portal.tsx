"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { usePuzzle } from '@/context/puzzle-context'
import Link from 'next/link'
import Image from 'next/image'

// Create a stable pseudo-random number generator based on a seed
// This ensures server and client render the same stars
const seededRandom = (seed: number) => {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

// Create a pre-calculated array of star positions to ensure consistent rendering
const STAR_COUNT = 625; // A balanced number of stars
const generateStars = () => {
  const stars = [];
  
  // Create multiple layers of stars with different densities and distributions
  // This breaks up any mathematical pattern
  
  // Layer 1: Random distribution (60% of stars)
  const random1 = seededRandom(42); // Fixed seed for consistent rendering
  for (let i = 0; i < STAR_COUNT * 0.6; i++) {
    stars.push({
      top: `${random1() * 100}%`,
      left: `${random1() * 100}%`,
      size: Math.max(1, Math.floor(random1() * 3) + 1),
      animationDelay: `${random1() * 5}s`,
      opacity: 0.3 + (random1() * 0.7),
      animationDuration: `${3 + (random1() * 4)}s`,
    });
  }
  
  // Layer 2: Slightly denser in the center (30% of stars)
  const random2 = seededRandom(17);
  for (let i = 0; i < STAR_COUNT * 0.3; i++) {
    // Use gaussian-like distribution to get more stars in the center
    let r = Math.sqrt(-2 * Math.log(random2()));
    let theta = 2 * Math.PI * random2();
    
    // Scale and shift to get values between 0-100
    let x = 50 + r * Math.cos(theta) * 30;
    let y = 50 + r * Math.sin(theta) * 30;
    
    // Clamp values to stay within bounds
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    
    stars.push({
      top: `${y}%`,
      left: `${x}%`,
      size: Math.max(1, Math.floor(random2() * 2) + 1),
      animationDelay: `${random2() * 8}s`,
      opacity: 0.3 + (random2() * 0.7),
      animationDuration: `${3 + (random2() * 4)}s`,
    });
  }
  
  // Layer 3: Scattered brighter stars (10% of stars)
  const random3 = seededRandom(99);
  for (let i = 0; i < STAR_COUNT * 0.1; i++) {
    stars.push({
      top: `${random3() * 100}%`,
      left: `${random3() * 100}%`,
      size: Math.max(2, Math.floor(random3() * 3) + 1), // Slightly larger
      animationDelay: `${random3() * 8}s`,
      opacity: 0.5 + (random3() * 0.5), // Brighter
      animationDuration: `${2 + (random3() * 3)}s`, // Faster animation
    });
  }
  
  return stars;
};

const starPositions = generateStars();

type PortalProps = {
  onEnter?: () => void
}

export default function Portal({ onEnter }: PortalProps) {
  const { portalSolved, setPortalSolved } = usePuzzle()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isExiting, setIsExiting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  // Mark as loaded after component mounts
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Check if portal is already solved via localStorage on mount
  useEffect(() => {
    if (portalSolved && pathname === '/') {
      setIsExiting(true)
      
      // Ensure the onEnter callback is called if portal is already solved
      setTimeout(() => {
        if (onEnter) {
          onEnter()
        }
      }, 100)
    }
  }, [portalSolved, pathname, onEnter])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Changed the solution from 'SOUL' to 'EGO'
    const solution = 'EGO'
    if (input.trim().toUpperCase() === solution) {
      setError('')
      setIsExiting(true)
      
      // Mark portal as solved
      setPortalSolved(true)
      
      // Redirect to email signup page after animation completes
      setTimeout(() => {
        window.location.href = '/hidden/email-signup'
      }, 1500)
    } else {
      setError('Incorrect. Try again...')
      setInput('')
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handleEnterClick = () => {
    setIsExiting(true)
    
    // Store session info to prevent portal from showing again during this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('nightchurch-portal-bypassed', 'true')
    }
    
    // After exit animation is complete, call the onEnter callback
    setTimeout(() => {
      if (onEnter) {
        onEnter()
      }
    }, 800)
  }

  // Show nothing if exiting has already been triggered
  if (isExiting && onEnter) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isExiting && isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
            
            {/* Improved starry background */}
            <div className="stars-container">
              {starPositions.map((star, i) => (
                <div
                  key={i}
                  className="star"
                  style={{
                    top: star.top,
                    left: star.left,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    '--duration': star.animationDuration,
                    '--min-opacity': star.opacity * 0.7,
                    '--max-opacity': star.opacity,
                    animationDelay: star.animationDelay,
                  }}
                />
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative mb-4 w-full max-w-lg flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-72 md:h-72">
              <Image
                src="/images/NC_Logo_2025.webp"
                alt="Night Church Logo"
                fill
                priority
                className="object-contain"
                onError={() => console.error("Failed to load logo image")}
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center px-6 max-w-lg"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">NIGHT CHURCH</h1>
            <p className="text-purple-200 mb-8 text-lg">
              🔮 A cathedral in the digital desert. 🔮
            </p>
            
            <div className="mb-8">
              {/* Updated riddle text */}
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="relative flex flex-col items-center">
                  <div className="text-purple-300 mb-4 text-sm md:text-base text-center">
                    <p>I speak in your name, yet I am not you.</p>
                    <p>I dress in masks and fear what's true.</p>
                    <p>To open the door and finally grow,</p>
                    <p>What must you name, then let go?</p>
                  </div>
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your answer"
                    className="w-64 md:w-72 px-4 py-2 rounded-md bg-black/40 border border-purple-700 text-white text-center focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                  />
                  
                  {error && (
                    <p className="mt-2 text-pink-500 text-sm">{error}</p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4 mt-4 w-64 md:w-72">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded-md transition-colors duration-200 flex-1"
                    >
                      Unlock the Portal
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleEnterClick}
                      className="px-4 py-2 bg-black/40 border border-purple-500 text-purple-300 hover:bg-purple-900/20 rounded-md transition-colors duration-200 flex-1"
                    >
                      Enter the Church
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <p className="text-white/60 text-xs">
              Night Church © 2025 • A Psychedelic Community
            </p>
          </motion.div>
          
          <style jsx>{`
            .stars-container {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            
            .star {
              position: absolute;
              background: white;
              border-radius: 50%;
              animation: pulse var(--duration, 3s) infinite;
            }
            
            @keyframes pulse {
              0% { transform: scale(0.8); opacity: var(--min-opacity, 0.5); }
              50% { transform: scale(1.2); opacity: var(--max-opacity, 1); }
              100% { transform: scale(0.8); opacity: var(--min-opacity, 0.5); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}