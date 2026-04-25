/**
 * Test script for Google Drive link conversion functionality
 */

// Import the functions
import { convertGoogleDriveLinkToImage, isGoogleDriveLink, getImagePreviewUrl } from './googleDriveUtils';

console.log('Testing Google Drive link conversion functionality...\n');

// Test cases
const testCases = [
  {
    name: 'Standard sharing link',
    url: 'https://drive.google.com/file/d/1234567890abcdefg/view?usp=sharing',
    expected: 'https://drive.google.com/uc?export=view&id=1234567890abcdefg'
  },
  {
    name: 'Open link format',
    url: 'https://drive.google.com/open?id=1234567890abcdefg',
    expected: 'https://drive.google.com/uc?export=view&id=1234567890abcdefg'
  },
  {
    name: 'UC direct link',
    url: 'https://drive.google.com/uc?id=1234567890abcdefg',
    expected: 'https://drive.google.com/uc?export=view&id=1234567890abcdefg'
  },
  {
    name: 'Converted URL (already processed)',
    url: 'https://drive.google.com/uc?export=view&id=1234567890abcdefg',
    expected: 'https://drive.google.com/uc?export=view&id=1234567890abcdefg'
  },
  {
    name: 'Regular image URL (should remain unchanged)',
    url: 'https://example.com/image.jpg',
    expected: 'https://example.com/image.jpg'
  },
  {
    name: 'Invalid Google Drive URL',
    url: 'https://drive.google.com/some/invalid/path',
    expected: null
  }
];

console.log('Running test cases...\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`Input:    ${testCase.url}`);
  
  const converted = convertGoogleDriveLinkToImage(testCase.url);
  const isDriveLink = isGoogleDriveLink(testCase.url);
  const previewUrl = getImagePreviewUrl(testCase.url);
  
  console.log(`Converted: ${converted}`);
  console.log(`Is Drive:  ${isDriveLink}`);
  console.log(`Preview:   ${previewUrl}`);
  console.log(`Expected:  ${testCase.expected}`);
  console.log(`Status:    ${converted === testCase.expected ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

console.log('Testing completed!');