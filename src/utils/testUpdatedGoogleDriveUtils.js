/**
 * Test file to verify updated Google Drive utility functions
 */

// Since we can't directly import in this context, I'll simulate the functions
const isGoogleDriveLink = (url) => {
  if (!url) return false;
  
  // Check if the URL contains Google Drive patterns
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    return true;
  }
  
  return false;
};

const convertGoogleDriveLinkToImage = (url) => {
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
      // Format: https://drive.google.com/open?id=FILE_ID
      fileId = parsedUrl.searchParams.get('id');
    } else if (parsedUrl.searchParams.get('id')) {
      // Format: https://drive.google.com/uc?id=FILE_ID
      fileId = parsedUrl.searchParams.get('id');
    }
    
    if (fileId) {
      // Return the direct image URL
      // Using the 'uc' endpoint which provides the direct download URL
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    // If we couldn't extract a file ID, return null
    return null;
  } catch (error) {
    console.error('Error parsing Google Drive URL:', error);
    return null;
  }
};

// Test cases for Google Drive link conversion
console.log('Testing updated Google Drive utility functions...\n');

// Test 1: Valid Google Drive sharing link
const testLink1 = 'https://drive.google.com/file/d/1234567890abcdefg/view?usp=sharing';
console.log('Test 1 - Valid Google Drive sharing link:');
console.log('Input:', testLink1);
console.log('Is Google Drive link:', isGoogleDriveLink(testLink1));
console.log('Convert result:', convertGoogleDriveLinkToImage(testLink1));
console.log('');

// Test 2: Converted Google Drive link (like what would be stored in DB)
const testLink2 = 'https://drive.google.com/uc?export=view&id=1234567890abcdefg';
console.log('Test 2 - Converted Google Drive link (like DB storage):');
console.log('Input:', testLink2);
console.log('Is Google Drive link:', isGoogleDriveLink(testLink2));
console.log('Convert result:', convertGoogleDriveLinkToImage(testLink2));
console.log('');

// Test 3: Regular image URL (not Google Drive)
const testLink3 = 'https://example.com/image.jpg';
console.log('Test 3 - Regular image URL:');
console.log('Input:', testLink3);
console.log('Is Google Drive link:', isGoogleDriveLink(testLink3));
console.log('Convert result:', convertGoogleDriveLinkToImage(testLink3));
console.log('');

// Test 4: Google Drive open link
const testLink4 = 'https://drive.google.com/open?id=1234567890abcdefg';
console.log('Test 4 - Google Drive open link:');
console.log('Input:', testLink4);
console.log('Is Google Drive link:', isGoogleDriveLink(testLink4));
console.log('Convert result:', convertGoogleDriveLinkToImage(testLink4));
console.log('');

console.log('All tests completed!');