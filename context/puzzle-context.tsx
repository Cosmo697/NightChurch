"use client"

import { createContext, useContext, useState, useEffect } from 'react'

// Define the puzzle levels and their unlocked states
export type PuzzleLevel = {
  id: string
  name: string
  isUnlocked: boolean
  isSolved: boolean
  path: string // URL path to the hidden content
}

interface PuzzleContextType {
  portalSolved: boolean
  setPortalSolved: (solved: boolean) => void
  puzzleLevels: PuzzleLevel[]
  currentLevel: number
  unlockPuzzle: (id: string) => void
  solvePuzzle: (id: string) => void
  isLevelUnlocked: (id: string) => boolean
  isLevelSolved: (id: string) => boolean
  getNextPuzzleLevel: () => PuzzleLevel | null
  canAccessEasterEggs: boolean
}

// Initial puzzle levels configuration
const initialPuzzleLevels: PuzzleLevel[] = [
  {
    id: 'echoes',
    name: 'Echoes of Unity',
    isUnlocked: false, // Only unlocked after portal is solved
    isSolved: false,
    path: '/hidden/account-creation'
  },
  {
    id: 'whispers',
    name: 'Whispers in the Dark',
    isUnlocked: false,
    isSolved: false,
    path: '/hidden/whispers-puzzle'
  },
  {
    id: 'reflection',
    name: 'Reflection Chamber',
    isUnlocked: false,
    isSolved: false,
    path: '/hidden/community-board'
  },
  {
    id: 'transcendence',
    name: 'Transcendence',
    isUnlocked: false,
    isSolved: false,
    path: '/hidden/sacred-archives'
  },
  {
    id: 'illumination',
    name: 'The Illumination',
    isUnlocked: false,
    isSolved: false,
    path: '/hidden/virtual-altar'
  }
]

const PuzzleContext = createContext<PuzzleContextType | undefined>(undefined)

export function PuzzleProvider({ children }: { children: React.ReactNode }) {
  const [puzzleLevels, setPuzzleLevels] = useState<PuzzleLevel[]>(initialPuzzleLevels)
  const [currentLevel, setCurrentLevel] = useState<number>(0)
  const [portalSolved, setPortalSolved] = useState<boolean>(false)
  
  // Derived state - can only access easter eggs if portal is solved
  // Users who bypass the portal don't get access to easter eggs
  const canAccessEasterEggs = portalSolved // Only true for puzzle solvers, not for those who bypass
  
  // Load saved puzzle progress from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if portal has been solved
      const portalSolvedStatus = localStorage.getItem('nightchurch-portal-solved')
      if (portalSolvedStatus === 'true') {
        setPortalSolved(true)
      }
      
      // Load puzzle progress
      const savedProgress = localStorage.getItem('nightchurch-puzzle-progress')
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress)
          setPuzzleLevels(parsed.puzzleLevels)
          setCurrentLevel(parsed.currentLevel)
        } catch (e) {
          console.error('Failed to parse saved puzzle progress', e)
        }
      }
    }
  }, [])
  
  // Save puzzle progress to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'nightchurch-puzzle-progress',
        JSON.stringify({ puzzleLevels, currentLevel })
      )
    }
  }, [puzzleLevels, currentLevel])
  
  // Save portal solved status to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nightchurch-portal-solved', portalSolved.toString())
      
      // If portal is solved, unlock the first puzzle
      if (portalSolved) {
        setPuzzleLevels(prevLevels => {
          const updatedLevels = [...prevLevels]
          if (!updatedLevels[0].isUnlocked) {
            updatedLevels[0] = { ...updatedLevels[0], isUnlocked: true }
          }
          return updatedLevels
        })
      }
    }
  }, [portalSolved])
  
  // Unlock a puzzle by its ID
  const unlockPuzzle = (id: string) => {
    setPuzzleLevels(prevLevels => 
      prevLevels.map(level => 
        level.id === id ? { ...level, isUnlocked: true } : level
      )
    )
  }
  
  // Mark a puzzle as solved by its ID and unlock the next one
  const solvePuzzle = (id: string) => {
    setPuzzleLevels(prevLevels => {
      // Find the index of the solved puzzle
      const solvedIndex = prevLevels.findIndex(level => level.id === id)
      
      if (solvedIndex === -1) return prevLevels
      
      // Create a copy of the array
      const updatedLevels = [...prevLevels]
      
      // Mark the current puzzle as solved
      updatedLevels[solvedIndex] = {
        ...updatedLevels[solvedIndex],
        isSolved: true
      }
      
      // Unlock the next puzzle if it exists
      if (solvedIndex + 1 < updatedLevels.length) {
        updatedLevels[solvedIndex + 1] = {
          ...updatedLevels[solvedIndex + 1],
          isUnlocked: true
        }
        
        // Update the current level
        setCurrentLevel(solvedIndex + 1)
      }
      
      return updatedLevels
    })
  }
  
  // Check if a puzzle level is unlocked
  const isLevelUnlocked = (id: string) => {
    // Can't access any levels if portal isn't solved
    if (!portalSolved) return false
    
    const level = puzzleLevels.find(level => level.id === id)
    return level ? level.isUnlocked : false
  }
  
  // Check if a puzzle level is solved
  const isLevelSolved = (id: string) => {
    const level = puzzleLevels.find(level => level.id === id)
    return level ? level.isSolved : false
  }
  
  // Get the next unsolved puzzle level
  const getNextPuzzleLevel = () => {
    const nextLevel = puzzleLevels.find(level => level.isUnlocked && !level.isSolved)
    return nextLevel || null
  }
  
  return (
    <PuzzleContext.Provider
      value={{
        portalSolved,
        setPortalSolved,
        puzzleLevels,
        currentLevel,
        unlockPuzzle,
        solvePuzzle,
        isLevelUnlocked,
        isLevelSolved,
        getNextPuzzleLevel,
        canAccessEasterEggs
      }}
    >
      {children}
    </PuzzleContext.Provider>
  )
}

export function usePuzzle() {
  const context = useContext(PuzzleContext)
  if (context === undefined) {
    throw new Error('usePuzzle must be used within a PuzzleProvider')
  }
  return context
}