import supabase from './supabase';

// Types for gate progress
export type GateProgress = {
  id?: string;
  user_id: string;
  portal_solved: boolean;
  email_signed_up: boolean;
  account_created: boolean;
  gates_unlocked: number[];
  eggs_found: string[];
  current_gate: number;
  next_egg_visible: boolean;
  updated_at: string;
};

// Get a user's gate progress
export async function getUserProgress(userId: string): Promise<GateProgress | null> {
  const { data, error } = await supabase
    .from('gate_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user progress:', error);
    return null;
  }
  
  return data;
}

// Create or update a user's gate progress
export async function updateUserProgress(progress: GateProgress): Promise<boolean> {
  // Update the timestamp
  progress.updated_at = new Date().toISOString();
  
  const { error } = await supabase
    .from('gate_progress')
    .upsert(progress, { onConflict: 'user_id' });
  
  if (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
  
  return true;
}

// Helper to check if a gate is unlocked
export async function isGateUnlocked(userId: string, gateNumber: number): Promise<boolean> {
  const progress = await getUserProgress(userId);
  
  if (!progress) return false;
  
  return progress.gates_unlocked.includes(gateNumber);
}

// Add a found egg
export async function markEggFound(userId: string, eggId: string): Promise<boolean> {
  const progress = await getUserProgress(userId);
  
  if (!progress) return false;
  
  // Don't add duplicates
  if (progress.eggs_found.includes(eggId)) return true;
  
  // Add the egg to the found list
  progress.eggs_found.push(eggId);
  
  return updateUserProgress(progress);
}

// Unlock a new gate
export async function unlockGate(userId: string, gateNumber: number): Promise<boolean> {
  const progress = await getUserProgress(userId);
  
  if (!progress) return false;
  
  // Don't add duplicates
  if (progress.gates_unlocked.includes(gateNumber)) return true;
  
  // Add the gate to the unlocked list
  progress.gates_unlocked.push(gateNumber);
  
  // Update current gate if this one is higher
  if (gateNumber > progress.current_gate) {
    progress.current_gate = gateNumber;
  }
  
  return updateUserProgress(progress);
}

// Check if an egg is visible
export async function isEggVisible(userId: string, eggId: string): Promise<boolean> {
  const progress = await getUserProgress(userId);
  
  if (!progress) return false;
  
  // For simplicity, assume egg visibility is based on current gate
  // You could implement more complex logic based on your requirements
  return progress.next_egg_visible;
}