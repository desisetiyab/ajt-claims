import React, { useState, useEffect } from 'react';
import type { PersonalClaimData, EmployeeData } from '../types';

interface PersonalClaimFormProps {
  onSubmit: (data: PersonalClaimData) => void;
  onBack: () => void;
  initialData: PersonalClaimData;
  employeeData: EmployeeData[];
}

const PersonalClaimForm: React.FC<PersonalClaimFormProps> = ({ onSubmit, onBack, initialData, employeeData }) => {
  const [formData, setFormData] = useState<PersonalClaimData>(initialData);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    setIsVerified(false);
    setVerificationInput('');
    setVerificationError(null);
    setFormData(initialData);
  }, [selectedEmployeeName, initialData]);

  const handleVerify = () => {
    if (!verificationInput || verificationInput.length !== 4) {
        setVerificationError('Please enter the last 4 digits.');
        return;
    }

    const selectedEmployee = employeeData.find(emp => emp['Full Name'] === selectedEmployeeName);
    if (!selectedEmployee) {
      setVerificationError('An error occurred. Please select your name again.');
      return;
    }

    const fullId = String(selectedEmployee['IC / Passport Number']).replace(/[^a-zA-Z0-9]/g, '');
    const last4Digits = fullId.slice(-4);
    
    if (verificationInput === last4Digits) {
      setIsVerified(true);
      setVerificationError(null);
      setFormData({
        name: selectedEmployee['Full Name'],
        icOrPassport: selectedEmployee['IC / Passport Number'],
        bankName: selectedEmployee['Bank Name'],
        bankAccount: String(selectedEmployee['Bank Account Number']),
      });
    } else {
      setIsVerified(false);
      setVerificationError('Verification failed. The last 4 digits do not match.');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerified) {
      onSubmit(formData);
    }
  };

  const hasEmployeeData = employeeData.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-700 text-center">Personal Claim Details</h2>
      
      {!hasEmployeeData && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4" role="alert">
              <p className="font-bold">Employee Data Not Loaded</p>
              <p className="text-sm">Please ask an administrator to upload the employee data Excel file.</p>
          </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
        <select
          id="name"
          name="name"
          value={selectedEmployeeName}
          onChange={(e) => setSelectedEmployeeName(e.target.value)}
          required
          disabled={!hasEmployeeData}
          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-100"
        >
          <option value="">-- Select your name --</option>
          {employeeData.map(emp => (
            <option key={emp['Full Name']} value={emp['Full Name']}>{emp['Full Name']}</option>
          ))}
        </select>
      </div>

      {selectedEmployeeName && (
        <div className="p-4 bg-slate-50 rounded-lg border">
            <label htmlFor="verification" className="block text-sm font-medium text-slate-600 mb-1">Identity Verification</label>
            <p className="text-xs text-slate-500 mb-2">Please enter the last 4 digits of your IC or Passport number to auto-fill your details.</p>
            <div className="flex items-start space-x-2">
                <input
                    type="text"
                    id="verification"
                    value={verificationInput}
                    onChange={(e) => setVerificationInput(e.target.value.slice(0, 4))}
                    maxLength={4}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., 1234"
                    disabled={isVerified}
                />
                <button 
                    type="button" 
                    onClick={handleVerify}
                    disabled={isVerified}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-600 border border-transparent rounded-md shadow-sm hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500 disabled:bg-slate-300"
                >
                    {isVerified ? 'Verified' : 'Verify'}
                </button>
            </div>
            {verificationError && <p className="mt-2 text-sm text-red-600">{verificationError}</p>}
             {isVerified && <p className="mt-2 text-sm text-green-600">Verification successful. Your details have been auto-filled.</p>}
        </div>
      )}

      <div>
        <label htmlFor="icOrPassport" className="block text-sm font-medium text-slate-600 mb-1">IC / Passport Number</label>
        <input
          type="text"
          name="icOrPassport"
          id="icOrPassport"
          value={formData.icOrPassport}
          readOnly
          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-100 text-slate-500 sm:text-sm cursor-not-allowed"
          placeholder="Auto-filled after verification"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="bankName" className="block text-sm font-medium text-slate-600 mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            id="bankName"
            value={formData.bankName}
            readOnly
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-100 text-slate-500 sm:text-sm cursor-not-allowed"
            placeholder="Auto-filled"
          />
        </div>
        <div>
          <label htmlFor="bankAccount" className="block text-sm font-medium text-slate-600 mb-1">Bank Account Number</label>
          <input
            type="text"
            name="bankAccount"
            id="bankAccount"
            value={formData.bankAccount}
            readOnly
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-100 text-slate-500 sm:text-sm cursor-not-allowed"
            placeholder="Auto-filled"
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4">
        <button type="button" onClick={onBack} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500">
          Back
        </button>
        <button type="submit" disabled={!isVerified} className="inline-flex justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed">
          Next: Upload Receipt
        </button>
      </div>
    </form>
  );
};

export default PersonalClaimForm;