"use client"

import { useState } from 'react'
import { usePuzzle } from '@/context/puzzle-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function AccountCreation() {
  const { puzzleLevels, isLevelUnlocked, solvePuzzle } = usePuzzle()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Check if user has solved the first puzzle and unlocked this level
  const hasAccess = isLevelUnlocked('echoes')
  
  // Get the next puzzle level
  const nextPuzzleLevel = puzzleLevels.find(level => level.id === 'reflection')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: Record<string, string> = {}
    
    if (!formData.username) newErrors.username = 'Username is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Here you would normally send the data to your backend
    // For now, we'll just simulate a successful submission
    setIsSubmitted(true)
    setErrors({})
    
    // Mark this puzzle as solved
    solvePuzzle('echoes')
  }
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md p-8 bg-black/80 border border-purple-900/50 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-pink-300 mb-4">Echo Chamber Closed</h1>
          <p className="text-gray-300 mb-6">
            This sanctuary remains hidden to those who haven't discovered the path.
          </p>
          <Button asChild variant="outline" className="border-purple-700 text-purple-300">
            <Link href="/">Return to the known path</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full mx-4 p-8 bg-black/80 backdrop-blur-sm border border-purple-900/50 rounded-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-300 mb-2">Create Your Account</h1>
          <p className="text-gray-300">
            Join the inner circle and become part of our community.
          </p>
        </div>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="bg-black/50 border-purple-700 focus:border-pink-500 text-white"
              />
              {errors.username && <p className="text-pink-500 text-sm">{errors.username}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="bg-black/50 border-purple-700 focus:border-pink-500 text-white"
              />
              {errors.email && <p className="text-pink-500 text-sm">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="bg-black/50 border-purple-700 focus:border-pink-500 text-white"
              />
              {errors.password && <p className="text-pink-500 text-sm">{errors.password}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="bg-black/50 border-purple-700 focus:border-pink-500 text-white"
              />
              {errors.confirmPassword && (
                <p className="text-pink-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-purple-800 hover:bg-purple-700 text-white"
              >
                Create Account
              </Button>
            </div>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-pink-300 mb-2">Welcome to Night Church</h2>
            <p className="text-gray-300 mb-6">
              You've now gained deeper access to our community.
            </p>
            
            {nextPuzzleLevel && (
              <div className="mt-8 p-4 bg-purple-900/20 border border-purple-800/40 rounded-lg">
                <p className="text-sm text-purple-300 mb-2">Further possibilities reveal themselves...</p>
                <p className="text-xs text-gray-400 italic">
                  "In reflection, truth is found. Look for mirrors that reveal the hidden community."
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <Button asChild variant="outline" className="border-purple-700 text-purple-300">
                <Link href="/">Return to Night Church</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}