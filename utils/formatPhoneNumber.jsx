export const formatPhoneNumber = (number) => {
	if (!number) return '';
	
	// Remove any non-digit characters
	let cleaned = number.replace(/\D/g, '');
	
	// Handle numbers starting with '07'
	if (cleaned.startsWith('07')) {
	  cleaned = '256' + cleaned.substring(1);
	}
	// Handle numbers starting with '7'
	else if (cleaned.startsWith('7')) {
	  cleaned = '256' + cleaned;
	}
	// Handle numbers starting with '0'
	else if (cleaned.startsWith('0')) {
	  cleaned = '256' + cleaned.substring(1);
	}
	// Handle numbers without country code
	else if (!cleaned.startsWith('256')) {
	  cleaned = '256' + cleaned;
	}
	
	return '+' + cleaned;
  };