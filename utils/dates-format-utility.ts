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

export function convertDateToISO8601(dateInput: any) {
  if (!dateInput) return '';
  
  // If it's already a Date object
  if (dateInput instanceof Date) {
    return dateInput.toISOString();
  }
  
  // If it's not a string, return empty
  if (typeof dateInput !== 'string') {
    return '';
  }
  
  const dateString = dateInput.trim();
  
  // If already in ISO format
  if (dateString.includes('T') && dateString.includes('Z')) {
    return dateString;
  }
  
  // Handle MM/DD/YYYY format (like 12/04/2025)
  const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, month, day, year] = match;
    // Create date at midnight UTC to avoid timezone issues
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return date.toISOString();
  }
  
  // Fallback: try parsing the date string directly
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('Invalid date format:', dateString);
    return '';
  }
  
  return date.toISOString();
}