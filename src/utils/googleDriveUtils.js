/**
 * Utility functions for handling Google Drive image links
 */

/**
 * Converts a Google Drive sharing URL to a direct image URL that can be embedded
 * @param {string} url - The Google Drive sharing URL
 * @returns {string|null} - The direct image URL or null if the URL is not a valid Google Drive link
 */
export const convertGoogleDriveLinkToImage = (url) => {
  if (!url) return null;
  
  // Handle different Google Drive URL formats
  // Example: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // Example: https://drive.google.com/open?id=FILE_ID
  // Example: https://drive.google.com/uc?id=FILE_ID
  
  try {
    const parsedUrl = new URL(url);
    
    // If it's already a direct image URL (not a Google Drive link)
    if (parsedUrl.hostname !== 'drive.google.com' && parsedUrl.hostname !== 'docs.google.com') {
      return url;
    }
    
    // Extract file ID from different possible URL formats
    let fileId = null;
    
    if (parsedUrl.pathname.includes('/file/d/')) {
      // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      const match = parsedUrl.pathname.match(/\/file\/d\/([^\/]+)/);
      if (match) fileId = match[1];
    } else if (parsedUrl.searchParams.get('id')) {
      // Format: https://drive.google.com/open?id=FILE_ID or https://drive.google.com/uc?id=FILE_ID
      fileId = parsedUrl.searchParams.get('id');
    }
    
    // Additional check for Google Drive URLs with different patterns
    if (!fileId && parsedUrl.pathname.includes('/id/')) {
      // Format: https://drive.google.com/file/d/FILE_ID/edit
      const match = parsedUrl.pathname.match(/\/d\/([^\/]+)/);
      if (match) fileId = match[1];
    }
    
    // Check for other possible id parameter names
    if (!fileId) {
      // Try other common parameter names that might contain the file ID
      const possibleIdParams = ['id', 'fileid', 'docid'];
      for (const param of possibleIdParams) {
        if (parsedUrl.searchParams.get(param)) {
          fileId = parsedUrl.searchParams.get(param);
          break;
        }
      }
    }
    
    if (fileId) {
      // Return the direct image URL
      // Using the 'uc' endpoint which provides the direct download URL
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    // Fallback: If the original URL was a Google Drive URL but we couldn't extract the ID,
    // return the original URL to allow image loading attempt
    if (parsedUrl.hostname === 'drive.google.com') {
      // As a last resort, if we can't parse the URL properly, return the original URL
      // This allows the image to attempt loading, though it might not work
      return url;
    }
    
    // If we couldn't extract a file ID and it's not a Google Drive URL, return null
    return null;
  } catch (error) {
    console.error('Error parsing Google Drive URL:', error);
    return null;
  }
};

/**
 * Checks if a URL is a Google Drive link (either sharing link or converted direct link)
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is a Google Drive link
 */
export const isGoogleDriveLink = (url) => {
  if (!url) return false;
  
  // Check if the URL contains Google Drive patterns
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    return true;
  }
  
  return false;
};

/**
 * Gets the preview URL for an image, handling Google Drive links
 * @param {string} url - The original image URL
 * @returns {string} - The appropriate URL for preview
 */
export const getImagePreviewUrl = (url) => {
  if (!url) return null;
  
  if (isGoogleDriveLink(url)) {
    return convertGoogleDriveLinkToImage(url);
  }
  
  return url;
};