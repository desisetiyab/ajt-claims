
import React, { useState } from 'react';
import type { VendorClaimData } from '../types';

interface VendorClaimFormProps {
  onSubmit: (data: VendorClaimData) => void;
  onBack: () => void;
  initialData: VendorClaimData;
}

const VendorClaimForm: React.FC<VendorClaimFormProps> = ({ onSubmit, onBack, initialData }) => {
  const [formData, setFormData] = useState<VendorClaimData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-700 text-center">Vendor Claim Details</h2>

      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-slate-600 mb-1">Company Name</label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="e.g., Awesome Tech Sdn Bhd"
        />
      </div>

      <div>
        <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-slate-600 mb-1">Company Registration Number</label>
        <input
          type="text"
          name="companyRegistrationNumber"
          id="companyRegistrationNumber"
          value={formData.companyRegistrationNumber}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="e.g., 202301001234 (1234567-A)"
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
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Public Bank"
          />
        </div>
        <div>
          <label htmlFor="bankAccount" className="block text-sm font-medium text-slate-600 mb-1">Bank Account Number</label>
          <input
            type="text"
            name="bankAccount"
            id="bankAccount"
            value={formData.bankAccount}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 3123456789"
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4">
        <button type="button" onClick={onBack} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500">
          Back
        </button>
        <button type="submit" className="inline-flex justify-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
          Next: Upload Invoice
        </button>
      </div>
    </form>
  );
};

export default VendorClaimForm;
