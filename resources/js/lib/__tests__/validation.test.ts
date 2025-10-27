/**
 * Tests for validation utilities
 */

import {
  validatePhone,
  validatePostalCode,
  validateName,
  validateCity,
  validateAddress,
  validateBio,
  validateDateOfBirth,
  validateWorkPermitExpiry,
  restrictInputCharacters,
  formatPhoneNumber,
  formatPostalCode
} from '../validation';

describe('Validation Functions', () => {
  describe('validatePhone', () => {
    test('validates Canadian phone numbers correctly', () => {
      expect(validatePhone('(416) 555-0123')).toEqual({ isValid: true });
      expect(validatePhone('416-555-0123')).toEqual({ isValid: true });
      expect(validatePhone('416.555.0123')).toEqual({ isValid: true });
      expect(validatePhone('416 555 0123')).toEqual({ isValid: true });
      expect(validatePhone('+1 416 555 0123')).toEqual({ isValid: true });
    });

    test('rejects invalid phone numbers', () => {
      expect(validatePhone('123')).toEqual({ isValid: false, message: 'Phone number must be at least 10 digits' });
      expect(validatePhone('abc')).toEqual({ isValid: false, message: 'Phone number must be at least 10 digits' });
      expect(validatePhone('')).toEqual({ isValid: false, message: 'Phone number is required' });
    });
  });

  describe('validatePostalCode', () => {
    test('validates Canadian postal codes correctly', () => {
      expect(validatePostalCode('K1A 0A6')).toEqual({ isValid: true });
      expect(validatePostalCode('M5V 3A8')).toEqual({ isValid: true });
      expect(validatePostalCode('H0H 0H0')).toEqual({ isValid: true });
    });

    test('rejects invalid postal codes', () => {
      expect(validatePostalCode('12345')).toEqual({ isValid: false, message: 'Please enter a valid Canadian postal code (e.g., K1A 0A6)' });
      expect(validatePostalCode('K1A')).toEqual({ isValid: false, message: 'Please enter a valid Canadian postal code (e.g., K1A 0A6)' });
      expect(validatePostalCode('')).toEqual({ isValid: false, message: 'Postal code is required' });
    });
  });

  describe('validateName', () => {
    test('validates names correctly', () => {
      expect(validateName('John', 'First name')).toEqual({ isValid: true });
      expect(validateName("O'Connor", 'Last name')).toEqual({ isValid: true });
      expect(validateName('Mary-Jane', 'Full name')).toEqual({ isValid: true });
      expect(validateName('Jean Pierre', 'Full name')).toEqual({ isValid: true });
    });

    test('rejects invalid names', () => {
      expect(validateName('John123', 'Name')).toEqual({ isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' });
      expect(validateName('J', 'Name')).toEqual({ isValid: false, message: 'Name must be at least 2 characters' });
      expect(validateName('', 'Name')).toEqual({ isValid: false, message: 'Name is required' });
    });
  });

  describe('validateCity', () => {
    test('validates city names correctly', () => {
      expect(validateCity('Toronto')).toEqual({ isValid: true });
      expect(validateCity('St. John\'s')).toEqual({ isValid: true });
      expect(validateCity('Trois-Rivières')).toEqual({ isValid: true });
    });

    test('rejects invalid city names', () => {
      expect(validateCity('Toronto123')).toEqual({ isValid: false, message: 'City can only contain letters, spaces, hyphens, apostrophes, and periods' });
      expect(validateCity('T')).toEqual({ isValid: false, message: 'City must be at least 2 characters' });
      expect(validateCity('')).toEqual({ isValid: false, message: 'City is required' });
    });
  });

  describe('validateAddress', () => {
    test('validates addresses correctly', () => {
      expect(validateAddress('123 Main Street', 'Address')).toEqual({ isValid: true });
      expect(validateAddress('456 Oak Ave., Apt 2B', 'Address')).toEqual({ isValid: true });
      expect(validateAddress('789 #101 - First St.', 'Address')).toEqual({ isValid: true });
    });

    test('rejects invalid addresses', () => {
      expect(validateAddress('123', 'Address')).toEqual({ isValid: false, message: 'Address must be at least 5 characters' });
      expect(validateAddress('', 'Address')).toEqual({ isValid: false, message: 'Address is required' });
    });
  });

  describe('validateBio', () => {
    test('validates bio correctly', () => {
      expect(validateBio('I am a skilled worker')).toEqual({ isValid: true });
      expect(validateBio('')).toEqual({ isValid: true }); // Bio is optional
    });

    test('rejects bio that is too long', () => {
      const longBio = 'a'.repeat(201);
      expect(validateBio(longBio)).toEqual({ isValid: false, message: 'Bio cannot exceed 200 characters' });
    });
  });

  describe('validateDateOfBirth', () => {
    test('validates date of birth correctly', () => {
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);
      expect(validateDateOfBirth(validDate.toISOString().split('T')[0])).toEqual({ isValid: true });
    });

    test('rejects underage dates', () => {
      const underageDate = new Date();
      underageDate.setFullYear(underageDate.getFullYear() - 15);
      expect(validateDateOfBirth(underageDate.toISOString().split('T')[0])).toEqual({ 
        isValid: false, 
        message: 'You must be at least 16 years old' 
      });
    });

    test('rejects future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(validateDateOfBirth(futureDate.toISOString().split('T')[0])).toEqual({ 
        isValid: false, 
        message: 'Date of birth cannot be in the future' 
      });
    });
  });

  describe('restrictInputCharacters', () => {
    test('restricts phone input correctly', () => {
      expect(restrictInputCharacters('abc123', 'phone')).toBe('123');
      expect(restrictInputCharacters('(416) 555-0123', 'phone')).toBe('(416) 555-0123');
    });

    test('restricts postal code input correctly', () => {
      expect(restrictInputCharacters('K1A 0A6', 'postalCode')).toBe('K1A 0A6');
      expect(restrictInputCharacters('K1A0A6', 'postalCode')).toBe('K1A0A6');
    });

    test('restricts name input correctly', () => {
      expect(restrictInputCharacters('John123', 'name')).toBe('John');
      expect(restrictInputCharacters("O'Connor", 'name')).toBe("O'Connor");
    });
  });

  describe('formatPhoneNumber', () => {
    test('formats phone numbers correctly', () => {
      expect(formatPhoneNumber('4165550123')).toBe('(416) 555-0123');
      expect(formatPhoneNumber('416555')).toBe('(416) 555');
      expect(formatPhoneNumber('416')).toBe('(416');
    });
  });

  describe('formatPostalCode', () => {
    test('formats postal codes correctly', () => {
      expect(formatPostalCode('K1A0A6')).toBe('K1A 0A6');
      expect(formatPostalCode('K1A')).toBe('K1A');
    });
  });
});



