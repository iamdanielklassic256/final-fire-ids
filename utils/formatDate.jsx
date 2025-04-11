/**
 * Formats a date string or Date object into a human-readable format
 * @param {string|Date} date - The date to format (string or Date object)
 * @param {Object} options - Formatting options
 * @param {string} [options.locale="en-US"] - The locale to use for formatting
 * @param {string} [options.dateStyle="long"] - Predefined date style: "full", "long", "medium", or "short"
 * @param {Object} [options.custom] - Custom formatting options that override dateStyle
 * @returns {string} The formatted date string
 */
export const formatDate = (date, options = {}) => {
	if (!date) return '';
	
	try {
	  // Convert string to Date object if necessary
	  const dateObj = typeof date === 'string' ? new Date(date) : date;
	  
	  // Check if date is valid
	  if (isNaN(dateObj.getTime())) {
		console.warn('Invalid date provided to formatDate:', date);
		return '';
	  }
	  
	  const { 
		locale = 'en-US',
		dateStyle = 'long',
		custom
	  } = options;
	  
	  // Use custom formatting options if provided, otherwise use dateStyle
	  const formatOptions = custom || {
		dateStyle
	  };
	  
	  // For long dateStyle without custom options, use a more detailed format
	  if (dateStyle === 'long' && !custom) {
		return dateObj.toLocaleDateString(locale, {
		  year: 'numeric',
		  month: 'long',
		  day: 'numeric'
		});
	  }
	  
	  return dateObj.toLocaleDateString(locale, formatOptions);
	} catch (error) {
	  console.error('Error formatting date:', error);
	  return '';
	}
  };
  
  /**
   * Common date format presets
   */
  export const DateFormats = {
	FULL: { dateStyle: 'full' },                         // Tuesday, April 11, 2025
	LONG: { dateStyle: 'long' },                         // April 11, 2025
	MEDIUM: { dateStyle: 'medium' },                     // Apr 11, 2025
	SHORT: { dateStyle: 'short' },                       // 4/11/25
	NUMERIC: { custom: { year: 'numeric', month: 'numeric', day: 'numeric' } },          // 4/11/2025
	MONTH_YEAR: { custom: { year: 'numeric', month: 'long' } },                          // April 2025
	MONTH_DAY: { custom: { month: 'long', day: 'numeric' } },                            // April 11
	WEEKDAY: { custom: { weekday: 'long' } },                                            // Tuesday
	WEEKDAY_MONTH_DAY: { custom: { weekday: 'long', month: 'long', day: 'numeric' } },   // Tuesday, April 11
  };
  
  // Usage examples:
  // formatDate(dob) // Default long format: April 11, 2025
  // formatDate(dob, DateFormats.SHORT) // Short format: 4/11/25
  // formatDate(dob, { locale: 'fr-FR' }) // French locale: 11 avril 2025
  // formatDate(dob