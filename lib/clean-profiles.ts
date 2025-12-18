/**
 * Clean corrupted profile data from localStorage
 * This ensures profiles are stored as objects, not JSON strings
 */

export function cleanCorruptedProfiles() {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem('arcnet_profiles')
    if (!stored) return

    const parsed = JSON.parse(stored)
    const cleaned: Record<string, any> = {}

    for (const key in parsed) {
      const value = parsed[key]
      
      // If value is a string, try to parse it
      if (typeof value === 'string') {
        try {
          const parsedValue = JSON.parse(value)
          if (parsedValue && typeof parsedValue === 'object' && 'name' in parsedValue) {
            cleaned[key] = parsedValue
          }
        } catch {
          // Skip corrupted entries
          continue
        }
      } 
      // If value is already an object with name property, keep it
      else if (value && typeof value === 'object' && 'name' in value) {
        cleaned[key] = value
      }
    }

    // Save cleaned profiles
    localStorage.setItem('arcnet_profiles', JSON.stringify(cleaned))
    console.log('[Clean] Cleaned corrupted profiles from localStorage')
  } catch (error) {
    console.error('[Clean] Error cleaning profiles:', error)
    // If cleaning fails, remove all profiles to start fresh
    localStorage.removeItem('arcnet_profiles')
  }
}

