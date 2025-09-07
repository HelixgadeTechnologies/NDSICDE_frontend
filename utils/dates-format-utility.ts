// Main function with multiple format options
export function formatDate(
  isoString: string, 
  format: 'full' | 'short' | 'relative' | 'time' | 'date-only' | 'custom' = 'full',
  customOptions?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = new Date(isoString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    switch (format) {
      case 'full':
        // August 6, 2025 at 1:52 PM
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).replace(',', ' at');

      case 'short':
        // Aug 6, 2025, 1:52 PM
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

      case 'date-only':
        // August 6, 2025
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

      case 'time':
        // 1:52 PM
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

      case 'relative':
        // "2 hours ago", "3 days ago", etc.
        return getRelativeTime(date);

      case 'custom':
        // Use custom options if provided
        return date.toLocaleDateString('en-US', customOptions);

      default:
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

// Helper function for relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Handle future dates
  if (diffInSeconds < 0) {
    const futureDiff = Math.abs(diffInSeconds);
    
    if (futureDiff < 60) return 'in a few seconds';
    if (futureDiff < 3600) return `in ${Math.floor(futureDiff / 60)} minutes`;
    if (futureDiff < 86400) return `in ${Math.floor(futureDiff / 3600)} hours`;
    if (futureDiff < 2592000) return `in ${Math.floor(futureDiff / 86400)} days`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Past dates
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

// Specific utility functions for common use cases
export const dateUtils = {
  // For user-friendly display
  toReadable: (isoString: string) => formatDate(isoString, 'full'),
  
  // For compact display in tables/cards
  toCompact: (isoString: string) => formatDate(isoString, 'short'),
  
  // For showing when something happened
  toRelative: (isoString: string) => formatDate(isoString, 'relative'),
  
  // For showing just the date
  dateOnly: (isoString: string) => formatDate(isoString, 'date-only'),
  
  // For showing just the time
  timeOnly: (isoString: string) => formatDate(isoString, 'time'),
  
  // For different locales
  toLocale: (isoString: string, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(locale, options);
    } catch (error) {
      return 'Invalid date';
      console.log(error);
    }
  }
};

// Examples of usage:
/*
const isoDate = "2025-08-06T13:52:12.198Z";

console.log(formatDate(isoDate, 'full'));      // "August 6, 2025 at 1:52 PM"
console.log(formatDate(isoDate, 'short'));     // "Aug 6, 2025, 1:52 PM"
console.log(formatDate(isoDate, 'relative'));  // "in 11 months" (from current date)
console.log(formatDate(isoDate, 'date-only')); // "August 6, 2025"
console.log(formatDate(isoDate, 'time'));      // "1:52 PM"

// Using utility functions
console.log(dateUtils.toReadable(isoDate));    // "August 6, 2025 at 1:52 PM"
console.log(dateUtils.toCompact(isoDate));     // "Aug 6, 2025, 1:52 PM"
console.log(dateUtils.toRelative(isoDate));    // "in 11 months"

// Custom formatting
console.log(formatDate(isoDate, 'custom', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})); // "Wednesday, August 6, 2025"
*/