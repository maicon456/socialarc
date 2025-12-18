/**
 * Media Persistence - Ensures photos and videos are saved and accessible
 * This module handles persistent storage of media files for the dapp
 */

const MEDIA_STORAGE_KEY = 'arcnet_media_files'
const MEDIA_METADATA_KEY = 'arcnet_media_metadata'

export interface MediaMetadata {
  url: string
  originalUrl: string
  type: 'image' | 'video'
  timestamp: number
  size: number
  name: string
}

/**
 * Store media permanently in localStorage
 */
export function persistMedia(url: string, dataURL: string, metadata: Omit<MediaMetadata, 'url' | 'originalUrl'>): void {
  if (typeof window === 'undefined') return

  try {
    // Store the data URL
    const key = url.replace('arcnet://media/', '')
    localStorage.setItem(key, dataURL)
    
    // Store metadata
    const metadataList = getMediaMetadataList()
    metadataList[url] = {
      url,
      originalUrl: url,
      ...metadata,
    }
    localStorage.setItem(MEDIA_METADATA_KEY, JSON.stringify(metadataList))
  } catch (error) {
    console.error('[MediaPersistence] Error persisting media:', error)
  }
}

/**
 * Get all persisted media metadata
 */
export function getMediaMetadataList(): Record<string, MediaMetadata> {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(MEDIA_METADATA_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

/**
 * Ensure media is accessible - retrieves from storage if needed
 */
export function ensureMediaAccessible(url: string): string | null {
  if (typeof window === 'undefined') return null

  // If it's already a data URL or external URL, return as is
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // If it's an arcnet:// URL, retrieve from localStorage
  if (url.startsWith('arcnet://media/')) {
    const key = url.replace('arcnet://media/', '')
    const dataURL = localStorage.getItem(key)
    return dataURL || null
  }

  return url
}

/**
 * Clean up old media files (optional - for storage management)
 */
export function cleanupOldMedia(maxAge: number = 30 * 24 * 60 * 60 * 1000): void {
  if (typeof window === 'undefined') return

  try {
    const metadataList = getMediaMetadataList()
    const now = Date.now()
    const toRemove: string[] = []

    for (const url in metadataList) {
      const metadata = metadataList[url]
      if (now - metadata.timestamp > maxAge) {
        toRemove.push(url)
        const key = url.replace('arcnet://media/', '')
        localStorage.removeItem(key)
        localStorage.removeItem(`${key}_meta`)
      }
    }

    // Remove from metadata list
    toRemove.forEach(url => delete metadataList[url])
    localStorage.setItem(MEDIA_METADATA_KEY, JSON.stringify(metadataList))
  } catch (error) {
    console.error('[MediaPersistence] Error cleaning up media:', error)
  }
}

