import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  validateBio,
  restrictInputCharacters,
  INPUT_RESTRICTIONS
} from '@/lib/validation';

export interface ValidatedTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  fieldType: 'bio';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  showValidationState?: boolean;
  className?: string;
  labelClassName?: string;
}

export default function ValidatedTextarea({
  label,
  fieldType,
  value,
  onChange,
  error,
  helperText,
  required = false,
  showValidationState = true,
  className,
  labelClassName,
  ...props
}: ValidatedTextareaProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  // Validate field based on type
  const validateField = (val: string): string => {
    if (!val.trim() && required) {
      return `${label} is required`;
    }

    if (!val.trim()) return '';

    switch (fieldType) {
      case 'bio':
        const bioResult = validateBio(val);
        return bioResult.isValid ? '' : bioResult.message || '';
      
      default:
        return '';
    }
  };

  // Handle input change with character restrictions
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value;

    // Apply character restrictions for bio field
    if (fieldType === 'bio') {
      newValue = restrictInputCharacters(newValue, 'bio');
    }

    onChange(newValue);
  };

  // Handle blur to trigger validation
  const handleBlur = () => {
    setHasBeenTouched(true);
    setIsValidating(true);
    
    setTimeout(() => {
      const errorMessage = validateField(value);
      setValidationError(errorMessage);
      setIsValidating(false);
    }, 100);
  };

  // Handle focus to clear validation state
  const handleFocus = () => {
    if (validationError) {
      setValidationError('');
    }
  };

  // Get validation state
  const getValidationState = () => {
    if (isValidating) return 'validating';
    if (error || validationError) return 'error';
    if (hasBeenTouched && value && !validationError) return 'success';
    return 'default';
  };

  const validationState = getValidationState();
  const displayError = error || validationError;

  // Get placeholder based on field type
  const getPlaceholder = () => {
    if (props.placeholder) return props.placeholder;
    
    switch (fieldType) {
      case 'bio':
        return 'Tell us about yourself...';
      default:
        return '';
    }
  };

  // Get max length based on field type
  const getMaxLength = () => {
    if (props.maxLength) return props.maxLength;
    
    const restriction = INPUT_RESTRICTIONS[fieldType as keyof typeof INPUT_RESTRICTIONS];
    return restriction?.maxLength || undefined;
  };

  return (
    <div className="space-y-1">
      <Label 
        htmlFor={props.id} 
        className={cn(
          "text-sm font-medium",
          required && "after:content-['*'] after:text-red-500 after:ml-1",
          labelClassName
        )}
      >
        {label}
      </Label>
      
      <div className="relative">
        <Textarea
          {...props}
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={getPlaceholder()}
          maxLength={getMaxLength()}
          className={cn(
            "transition-all duration-200",
            validationState === 'error' && "border-red-500 focus:border-red-500 focus:ring-red-500",
            validationState === 'success' && "border-green-500 focus:border-green-500 focus:ring-green-500",
            validationState === 'validating' && "border-blue-500 focus:border-blue-500 focus:ring-blue-500",
            className
          )}
        />
        
        {/* Validation state indicator */}
        {showValidationState && hasBeenTouched && (
          <div className="absolute right-3 top-3">
            {validationState === 'validating' && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
            {validationState === 'success' && (
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {validationState === 'error' && (
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Helper text or error message */}
      {displayError ? (
        <p className="text-red-600 text-sm">{displayError}</p>
      ) : helperText ? (
        <p className="text-gray-500 text-xs">{helperText}</p>
      ) : null}
      
      {/* Character count for bio field */}
      {fieldType === 'bio' && (
        <div className="flex justify-end text-xs text-gray-400">
          <span>{value.length}/200</span>
        </div>
      )}
    </div>
  );
}



