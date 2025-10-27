import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ValidatedInput from '@/components/ui/validated-input';
import ValidatedTextarea from '@/components/ui/validated-textarea';

export default function TestValidation() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    postal_code: '',
    city: '',
    address: '',
    bio: '',
    date_of_birth: '',
    work_permit_expiry: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Head title="Validation Test" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{color: '#192341'}}>
            Form Validation Test
          </h1>
          <p className="text-gray-600">
            Test the validation system with different input types
          </p>
        </div>

        <Card className="bg-white rounded-xl shadow-sm" style={{border: '0.05px solid #10B3D6'}}>
          <CardHeader>
            <CardTitle className="text-xl">Validation Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ValidatedInput
                id="first_name"
                label="First Name"
                fieldType="name"
                value={formData.first_name}
                onChange={(value) => handleInputChange('first_name', value)}
                required
                placeholder="Enter your first name"
              />

              <ValidatedInput
                id="last_name"
                label="Last Name"
                fieldType="name"
                value={formData.last_name}
                onChange={(value) => handleInputChange('last_name', value)}
                required
                placeholder="Enter your last name"
              />

              <ValidatedInput
                id="phone"
                label="Phone Number"
                fieldType="phone"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                helperText="Try typing letters - they should be blocked"
                required
                placeholder="(416) 555-0123"
              />

              <ValidatedInput
                id="postal_code"
                label="Postal Code"
                fieldType="postalCode"
                value={formData.postal_code}
                onChange={(value) => handleInputChange('postal_code', value)}
                helperText="Canadian format: K1A 0A6"
                required
                placeholder="K1A 0A6"
              />

              <ValidatedInput
                id="city"
                label="City"
                fieldType="city"
                value={formData.city}
                onChange={(value) => handleInputChange('city', value)}
                required
                placeholder="Toronto"
              />

              <ValidatedInput
                id="address"
                label="Address"
                fieldType="address"
                value={formData.address}
                onChange={(value) => handleInputChange('address', value)}
                required
                placeholder="123 Main Street"
              />

              <ValidatedInput
                id="date_of_birth"
                label="Date of Birth"
                fieldType="date"
                value={formData.date_of_birth}
                onChange={(value) => handleInputChange('date_of_birth', value)}
                required
              />

              <ValidatedInput
                id="work_permit_expiry"
                label="Work Permit Expiry"
                fieldType="workPermitExpiry"
                value={formData.work_permit_expiry}
                onChange={(value) => handleInputChange('work_permit_expiry', value)}
                helperText="Must be in the future but not more than 1 year"
                required
              />
            </div>

            <ValidatedTextarea
              id="bio"
              label="Bio (Optional)"
              fieldType="bio"
              value={formData.bio}
              onChange={(value) => handleInputChange('bio', value)}
              helperText="Character count and restrictions apply"
              placeholder="Tell us about yourself..."
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Validation Features:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Phone:</strong> Only numbers, +, -, (, ), ., and spaces allowed</li>
                <li>• <strong>Postal Code:</strong> Only letters, numbers, spaces, and hyphens</li>
                <li>• <strong>Names:</strong> Only letters, spaces, hyphens, and apostrophes</li>
                <li>• <strong>City:</strong> Only letters, spaces, hyphens, apostrophes, and periods</li>
                <li>• <strong>Address:</strong> Letters, numbers, spaces, and common address characters</li>
                <li>• <strong>Bio:</strong> Letters, numbers, spaces, and common punctuation</li>
                <li>• <strong>Real-time validation</strong> with visual feedback</li>
                <li>• <strong>Character limits</strong> enforced automatically</li>
                <li>• <strong>Format assistance</strong> (phone numbers, postal codes)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



