/**
 * Form validation utilities for SkillOnCall.ca
 * Provides client-side validation for different field types with proper character restrictions
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => ValidationResult;
}

// Validation patterns
export const VALIDATION_PATTERNS = {
  // Canadian phone number (various formats)
  phone: /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
  
  // Canadian postal code (A1A 1A1 format)
  postalCode: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  
  // Name (letters, spaces, hyphens, apostrophes)
  name: /^[A-Za-z\s\-']+$/,
  
  // City name (letters, spaces, hyphens, apostrophes, periods)
  city: /^[A-Za-z\s\-'.]+$/,
  
  // Address (letters, numbers, spaces, common punctuation)
  address: /^[A-Za-z0-9\s\-'.,#\/]+$/,
  
  // Bio/description (letters, numbers, spaces, common punctuation)
  bio: /^[A-Za-z0-9\s\-'.,!?()]+$/,
};

// Character restrictions for different input types
export const INPUT_RESTRICTIONS = {
  phone: {
    allowedChars: /[0-9+\-().\s]/,
    maxLength: 15,
    description: 'Numbers, +, -, (, ), ., and spaces only'
  },
  postalCode: {
    allowedChars: /[A-Za-z0-9\s\-]/,
    maxLength: 7,
    description: 'Letters, numbers, spaces, and hyphens only'
  },
  name: {
    allowedChars: /[A-Za-z\s\-']/,
    maxLength: 50,
    description: 'Letters, spaces, hyphens, and apostrophes only'
  },
  city: {
    allowedChars: /[A-Za-z\s\-'.]/,
    maxLength: 50,
    description: 'Letters, spaces, hyphens, apostrophes, and periods only'
  },
  address: {
    allowedChars: /[A-Za-z0-9\s\-'.,#\/]/,
    maxLength: 100,
    description: 'Letters, numbers, spaces, and common address characters'
  },
  bio: {
    allowedChars: /[A-Za-z0-9\s\-'.,!?()]/,
    maxLength: 200,
    description: 'Letters, numbers, spaces, and common punctuation'
  }
};

/**
 * Validates a phone number in Canadian format
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone.trim()) {
    return { isValid: false, message: 'Phone number is required' };
  }

  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 10) {
    return { isValid: false, message: 'Phone number must be at least 10 digits' };
  }
  
  if (cleanPhone.length > 11) {
    return { isValid: false, message: 'Phone number cannot exceed 11 digits' };
  }

  // Check if it starts with 1 (North American format)
  if (cleanPhone.length === 11 && !cleanPhone.startsWith('1')) {
    return { isValid: false, message: 'Invalid phone number format' };
  }

  if (!VALIDATION_PATTERNS.phone.test(phone)) {
    return { isValid: false, message: 'Please enter a valid phone number (e.g., (416) 555-0123)' };
  }

  return { isValid: true };
}

/**
 * Validates a Canadian postal code
 */
export function validatePostalCode(postalCode: string): ValidationResult {
  if (!postalCode.trim()) {
    return { isValid: false, message: 'Postal code is required' };
  }

  const formatted = postalCode.toUpperCase().replace(/\s/g, '');
  
  if (!VALIDATION_PATTERNS.postalCode.test(formatted)) {
    return { isValid: false, message: 'Please enter a valid Canadian postal code (e.g., K1A 0A6)' };
  }

  return { isValid: true };
}

/**
 * Validates a name field
 */
export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  if (!name.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters` };
  }

  if (name.trim().length > 50) {
    return { isValid: false, message: `${fieldName} cannot exceed 50 characters` };
  }

  if (!VALIDATION_PATTERNS.name.test(name)) {
    return { isValid: false, message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }

  return { isValid: true };
}

/**
 * Validates a city name
 */
export function validateCity(city: string): ValidationResult {
  if (!city.trim()) {
    return { isValid: false, message: 'City is required' };
  }

  if (city.trim().length < 2) {
    return { isValid: false, message: 'City must be at least 2 characters' };
  }

  if (city.trim().length > 50) {
    return { isValid: false, message: 'City cannot exceed 50 characters' };
  }

  if (!VALIDATION_PATTERNS.city.test(city)) {
    return { isValid: false, message: 'City can only contain letters, spaces, hyphens, apostrophes, and periods' };
  }

  return { isValid: true };
}

/**
 * Validates an address field
 */
export function validateAddress(address: string, fieldName: string = 'Address'): ValidationResult {
  if (!address.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  if (address.trim().length < 5) {
    return { isValid: false, message: `${fieldName} must be at least 5 characters` };
  }

  if (address.trim().length > 100) {
    return { isValid: false, message: `${fieldName} cannot exceed 100 characters` };
  }

  if (!VALIDATION_PATTERNS.address.test(address)) {
    return { isValid: false, message: `${fieldName} contains invalid characters` };
  }

  return { isValid: true };
}

/**
 * Validates a bio/description field
 */
export function validateBio(bio: string): ValidationResult {
  if (bio && bio.length > 200) {
    return { isValid: false, message: 'Bio cannot exceed 200 characters' };
  }

  if (bio && !VALIDATION_PATTERNS.bio.test(bio)) {
    return { isValid: false, message: 'Bio contains invalid characters' };
  }

  return { isValid: true };
}

/**
 * Validates a date of birth
 */
export function validateDateOfBirth(dateOfBirth: string): ValidationResult {
  if (!dateOfBirth) {
    return { isValid: false, message: 'Date of birth is required' };
  }

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  let actualAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    actualAge--;
  }

  if (actualAge < 16) {
    return { isValid: false, message: 'You must be at least 16 years old' };
  }

  if (actualAge > 100) {
    return { isValid: false, message: 'Please enter a valid date of birth' };
  }

  if (birthDate > today) {
    return { isValid: false, message: 'Date of birth cannot be in the future' };
  }

  return { isValid: true };
}

/**
 * Validates work permit expiry date
 */
export function validateWorkPermitExpiry(expiryDate: string): ValidationResult {
  if (!expiryDate) {
    return { isValid: false, message: 'Permit expiry date is required' };
  }

  const expiry = new Date(expiryDate);
  const today = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(today.getFullYear() + 1);

  if (expiry <= today) {
    return { isValid: false, message: 'Permit expiry date must be in the future' };
  }

  if (expiry > oneYearFromNow) {
    return { isValid: false, message: 'Permit expiry date cannot be more than 1 year in the future' };
  }

  return { isValid: true };
}

/**
 * Restricts input characters based on field type
 */
export function restrictInputCharacters(
  value: string, 
  fieldType: keyof typeof INPUT_RESTRICTIONS
): string {
  const restriction = INPUT_RESTRICTIONS[fieldType];
  if (!restriction) return value;

  // Remove invalid characters
  const cleaned = value.split('').filter(char => restriction.allowedChars.test(char)).join('');
  
  // Apply max length
  return cleaned.slice(0, restriction.maxLength);
}

/**
 * Formats phone number as user types
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const phoneNumber = value.replace(/\D/g, '');
  
  // Don't format if empty or too short
  if (phoneNumber.length === 0) return '';
  
  // Format based on length
  if (phoneNumber.length <= 3) {
    return `(${phoneNumber}`;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
}

/**
 * Formats postal code as user types
 */
export function formatPostalCode(value: string): string {
  // Remove all non-alphanumeric characters
  const postalCode = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  if (postalCode.length <= 3) {
    return postalCode;
  } else {
    return `${postalCode.slice(0, 3)} ${postalCode.slice(3, 6)}`;
  }
}

/**
 * Validates all form fields at once
 */
export function validateFormData(formData: any): Record<string, string> {
  const errors: Record<string, string> = {};

  // Validate required fields
  if (!formData.first_name?.trim()) {
    errors.first_name = 'First name is required';
  } else {
    const nameValidation = validateName(formData.first_name, 'First name');
    if (!nameValidation.isValid) {
      errors.first_name = nameValidation.message!;
    }
  }

  if (!formData.last_name?.trim()) {
    errors.last_name = 'Last name is required';
  } else {
    const nameValidation = validateName(formData.last_name, 'Last name');
    if (!nameValidation.isValid) {
      errors.last_name = nameValidation.message!;
    }
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else {
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.message!;
    }
  }

  if (!formData.date_of_birth) {
    errors.date_of_birth = 'Date of birth is required';
  } else {
    const dobValidation = validateDateOfBirth(formData.date_of_birth);
    if (!dobValidation.isValid) {
      errors.date_of_birth = dobValidation.message!;
    }
  }

  if (!formData.work_authorization) {
    errors.work_authorization = 'Work authorization status is required';
  }

  if ((formData.work_authorization === 'work_permit' || formData.work_authorization === 'student_permit') && !formData.work_permit_expiry) {
    errors.work_permit_expiry = 'Permit expiry date is required';
  } else if (formData.work_permit_expiry) {
    const expiryValidation = validateWorkPermitExpiry(formData.work_permit_expiry);
    if (!expiryValidation.isValid) {
      errors.work_permit_expiry = expiryValidation.message!;
    }
  }

  if (!formData.address_line_1?.trim()) {
    errors.address_line_1 = 'Street address is required';
  } else {
    const addressValidation = validateAddress(formData.address_line_1, 'Street address');
    if (!addressValidation.isValid) {
      errors.address_line_1 = addressValidation.message!;
    }
  }

  if (!formData.city?.trim()) {
    errors.city = 'City is required';
  } else {
    const cityValidation = validateCity(formData.city);
    if (!cityValidation.isValid) {
      errors.city = cityValidation.message!;
    }
  }

  if (!formData.province) {
    errors.province = 'Province is required';
  }

  if (!formData.postal_code?.trim()) {
    errors.postal_code = 'Postal code is required';
  } else {
    const postalValidation = validatePostalCode(formData.postal_code);
    if (!postalValidation.isValid) {
      errors.postal_code = postalValidation.message!;
    }
  }

  if (!formData.emergency_contact_name?.trim()) {
    errors.emergency_contact_name = 'Emergency contact name is required';
  } else {
    const nameValidation = validateName(formData.emergency_contact_name, 'Emergency contact name');
    if (!nameValidation.isValid) {
      errors.emergency_contact_name = nameValidation.message!;
    }
  }

  if (!formData.emergency_contact_relationship?.trim()) {
    errors.emergency_contact_relationship = 'Emergency contact relationship is required';
  } else {
    const nameValidation = validateName(formData.emergency_contact_relationship, 'Emergency contact relationship');
    if (!nameValidation.isValid) {
      errors.emergency_contact_relationship = nameValidation.message!;
    }
  }

  if (!formData.emergency_contact_phone?.trim()) {
    errors.emergency_contact_phone = 'Emergency contact phone number is required';
  } else {
    const phoneValidation = validatePhone(formData.emergency_contact_phone);
    if (!phoneValidation.isValid) {
      errors.emergency_contact_phone = phoneValidation.message!;
    }
  }

  // Validate optional bio field
  if (formData.bio) {
    const bioValidation = validateBio(formData.bio);
    if (!bioValidation.isValid) {
      errors.bio = bioValidation.message!;
    }
  }

  return errors;
}



