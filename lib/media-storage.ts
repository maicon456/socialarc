/**
 * Media Storage for Arc Network DApp
 * Stores photos and videos and generates URLs for on-chain registration
 */

export interface MediaFile {
  file: File
  url: string
  type: 'image' | 'video'
  size: number
}

/**
 * Convert file to base64 data URL for storage
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Store media files in localStorage (temporary solution)
 * In production, upload to IPFS/Arweave
 */
export async function storeMediaFiles(files: File[]): Promise<string[]> {
  const urls: string[] = []
  
  for (const file of files) {
    try {
      // Convert to base64 data URL
      const dataURL = await fileToDataURL(file)
      
      // Store in localStorage with a unique key
      const key = `arcnet_media_${Date.now()}_${Math.random().toString(36).substring(7)}`
      localStorage.setItem(key, dataURL)
      
      // Create a URL that can be used to retrieve the media
      // Format: arcnet://media/{key}
      const mediaUrl = `arcnet://media/${key}`
      urls.push(mediaUrl)
      
      // Also store metadata
      const metadata = {
        type: file.type,
        name: file.name,
        size: file.size,
        timestamp: Date.now(),
      }
      localStorage.setItem(`${key}_meta`, JSON.stringify(metadata))
      
      console.log(`[Media] Stored ${file.type} file: ${key}`)
    } catch (error) {
      console.error('[Media] Error storing file:', error)
      throw new Error(`Failed to store file: ${file.name}`)
    }
  }
  
  return urls
}

/**
 * Retrieve media file from storage
 */
export function getMediaFromURL(url: string): string | null {
  if (!url.startsWith('arcnet://media/')) {
    // If it's already a data URL or regular URL, return as is
    return url
  }
  
  const key = url.replace('arcnet://media/', '')
  const dataURL = localStorage.getItem(key)
  
  return dataURL || null
}

/**
 * Get media metadata
 */
export function getMediaMetadata(url: string): { type: string; name: string; size: number; timestamp: number } | null {
  if (!url.startsWith('arcnet://media/')) {
    return null
  }
  
  const key = url.replace('arcnet://media/', '')
  const metadataStr = localStorage.getItem(`${key}_meta`)
  
  if (!metadataStr) return null
  
  try {
    return JSON.parse(metadataStr)
  } catch {
    return null
  }
}

/**
 * Upload to IPFS (if configured) or use local storage
 */
export async function uploadMediaToStorage(files: File[]): Promise<string[]> {
  // Check if IPFS/Pinata is configured
  const pinataApiKey = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_PINATA_API_KEY : undefined
  const pinataSecret = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_PINATA_SECRET_KEY : undefined
  
  if (pinataApiKey && pinataSecret) {
    // Upload to Pinata IPFS
    return await uploadToPinata(files)
  } else {
    // Use local storage (temporary solution)
    return await storeMediaFiles(files)
  }
}

/**
 * Upload files to Pinata IPFS
 */
async function uploadToPinata(files: File[]): Promise<string[]> {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY!
  const secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY!
  const urls: string[] = []
  
  for (const file of files) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
          type: file.type.startsWith('image') ? 'image' : 'video',
          timestamp: Date.now().toString(),
        },
      })
      formData.append('pinataMetadata', metadata)
      
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      const ipfsUrl = `ipfs://${data.IpfsHash}`
      const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
      
      // Store both IPFS URL and gateway URL
      urls.push(gatewayUrl)
      
      console.log(`[Media] Uploaded to IPFS: ${data.IpfsHash}`)
    } catch (error) {
      console.error('[Media] Pinata upload failed, using local storage:', error)
      // Fallback to local storage
      return await storeMediaFiles(files)
    }
  }
  
  return urls
}


