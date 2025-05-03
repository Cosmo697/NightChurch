"use client"

import { useState, useEffect } from 'react'
import { usePuzzle } from '@/context/puzzle-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'

export default function EmailSignup() {
  const { portalSolved, puzzleLevels, unlockPuzzle } = usePuzzle()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState('')
  
  // Unlock the first puzzle level regardless of email signup
  // This ensures portal solvers always have access to the next step
  useEffect(() => {
    if (portalSolved) {
      // Check if this puzzle is already unlocked to prevent infinite loop
      const isEchoesAlreadyUnlocked = puzzleLevels.some(
        level => level.id === 'echoes' && level.isUnlocked
      );
      
      // Only unlock if it's not already unlocked
      if (!isEchoesAlreadyUnlocked) {
        unlockPuzzle('echoes');
      }
    }
  }, [portalSolved, unlockPuzzle, puzzleLevels]);
  
  // Check if user has solved the portal
  if (!portalSolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md p-8 bg-black/80 border border-purple-900/50 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-pink-300 mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">
            This sacred space is only accessible to those who have unlocked the portal.
          </p>
          <Button asChild variant="outline" className="border-purple-700 text-purple-300">
            <Link href="/">Return to the gateway</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic email validation
    if (!email) {
      setEmailError('Email is required')
      return
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email')
      return
    }
    
    setIsSubmitting(true)
    setEmailError('')
    
    try {
      // Use fetch to send the data to our MongoDB-connected API endpoint
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (response.status === 409) {
          // Email already exists - but we'll treat this as a success
          // since the user is effectively subscribed
          setIsSubmitted(true)
          
          // Store email in localStorage for future reference
          if (typeof window !== 'undefined') {
            localStorage.setItem('nightchurch-email', email)
          }
          
          // Unlock the next puzzle level (Echoes of Unity)
          unlockPuzzle('echoes')
          
          return
        }
        
        throw new Error(data.message || 'Failed to subscribe')
      }
      
      // Success!
      setIsSubmitted(true)
      
      // Store email in localStorage for future reference
      if (typeof window !== 'undefined') {
        localStorage.setItem('nightchurch-email', email)
      }
      
      // Unlock the next puzzle level (Echoes of Unity)
      unlockPuzzle('echoes')
    } catch (error) {
      console.error('Subscription error:', error)
      setEmailError(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleSkip = () => {
    // Mark the echoes puzzle as unlocked even if they skip email signup
    unlockPuzzle('echoes')
    
    // Record that they skipped but might return later
    if (typeof window !== 'undefined') {
      localStorage.setItem('nightchurch-email-skipped', 'true')
    }
    
    // Redirect to home page
    window.location.href = '/'
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full mx-4"
      >
        <div className="mb-8 text-center">
          <div className="relative w-full h-16 mb-4">
            <Image
              src="/images/Night_Church_Lettering_2025.webp"
              alt="NIGHT CHURCH"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-purple-300 mb-2">Welcome, Seeker</h1>
          <p className="text-gray-300">
            You've solved the portal and gained access to our inner circle.
          </p>
        </div>
        
        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/80 border border-purple-900/50 rounded-lg p-6 text-center"
          >
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-pink-300 mb-2">You're In!</h2>
            <p className="text-gray-300 mb-6">
              Your connection to Night Church has been established. 
              Watch for messages from the void.
            </p>
            
            <div className="mt-8 p-4 bg-purple-900/20 border border-purple-800/40 rounded-lg">
              <p className="text-sm text-purple-300 mb-2">But there's more to discover...</p>
              <p className="text-xs text-gray-400 italic">
                "Listen for the echoes in unexpected places. 
                These pages hold secrets for those who pay attention."
              </p>
            </div>
            
            <div className="mt-6">
              <Button 
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => window.location.href = '/'}
              >
                Continue to Night Church
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-black/80 border border-purple-900/50 rounded-lg p-6">
            <div className="mb-6">
              <p className="text-purple-200">
                Join our mailing list to receive exclusive invitations to our private events and extra
                content only available to our community.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-black/50 border-purple-700 focus:border-pink-500 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`bg-black/50 border-purple-700 focus:border-pink-500 text-white ${
                    emailError ? 'border-pink-500' : ''
                  }`}
                />
                {emailError && <p className="text-pink-500 text-sm">{emailError}</p>}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button 
                  type="submit" 
                  className="flex-1 bg-purple-800 hover:bg-purple-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Joining...' : 'Join the Congregation'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-purple-500 text-purple-300 hover:bg-purple-900/20"
                  onClick={handleSkip}
                >
                  Skip for Now
                </Button>
              </div>
              
              <p className="text-xs text-gray-400 text-center pt-2">
                You can always sign up later - this page will remain accessible to you.
              </p>
            </form>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-xs text-purple-400/60">
            This is just the beginning of your journey.
            Stay vigilant for hidden messages throughout the site.
          </p>
        </div>
      </motion.div>
    </div>
  )
}