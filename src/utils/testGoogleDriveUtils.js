/**
 * Test file to verify Google Drive utility functions
 */

import { convertGoogleDriveLinkToImage, isGoogleDriveLink, getImagePreviewUrl } from './googleDriveUtils';

// Test cases for Google Drive link conversion
console.log('Testing Google Drive utility functions...\n');

// Test 1: Valid Google Drive sharing link
const testLink1 = 'https://drive.google.com/file/d/1234567890abcdefg/view?usp=sharing';
console.log('Test 1 - Valid Google Drive sharing link:');
console.log('Input:', testLink1);
console.log('Output:', convertGoogleDriveLinkToImage(testLink1));
console.log('Is Google Drive link:', isGoogleDriveLink(testLink1));
console.log('Get Image Preview URL:', getImagePreviewUrl(testLink1));
console.log('');

// Test 2: Valid Google Drive open link
const testLink2 = 'https://drive.google.com/open?id=1234567890abcdefg';
console.log('Test 2 - Valid Google Drive open link:');
console.log('Input:', testLink2);
console.log('Output:', convertGoogleDriveLinkToImage(testLink2));
console.log('Is Google Drive link:', isGoogleDriveLink(testLink2));
console.log('Get Image Preview URL:', getImagePreviewUrl(testLink2));
console.log('');

// Test 3: Valid Google Drive uc link
const testLink3 = 'https://drive.google.com/uc?id=1234567890abcdefg';
console.log('Test 3 - Valid Google Drive uc link:');
console.log('Input:', testLink3);
console.log('Output:', convertGoogleDriveLinkToImage(testLink3));
console.log('Is Google Drive link:', isGoogleDriveLink(testLink3));
console.log('Get Image Preview URL:', getImagePreviewUrl(testLink3));
console.log('');

// Test 4: Regular image URL (not Google Drive)
const testLink4 = 'https://example.com/image.jpg';
console.log('Test 4 - Regular image URL:');
console.log('Input:', testLink4);
console.log('Output:', convertGoogleDriveLinkToImage(testLink4));
console.log('Is Google Drive link:', isGoogleDriveLink(testLink4));
console.log('Get Image Preview URL:', getImagePreviewUrl(testLink4));
console.log('');

// Test 5: Invalid Google Drive link
const testLink5 = 'https://drive.google.com/some/invalid/path';
console.log('Test 5 - Invalid Google Drive link:');
console.log('Input:', testLink5);
console.log('Output:', convertGoogleDriveLinkToImage(testLink5));
console.log('Is Google Drive link:', isGoogleDriveLink(testLink5));
console.log('Get Image Preview URL:', getImagePreviewUrl(testLink5));
console.log('');

console.log('All tests completed!');