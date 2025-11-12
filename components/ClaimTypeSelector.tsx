
import React from 'react';
import type { ClaimType } from '../types';
import { UserIcon, BuildingOfficeIcon } from './icons';

interface ClaimTypeSelectorProps {
  onSelect: (type: ClaimType) => void;
}

const ClaimTypeSelector: React.FC<ClaimTypeSelectorProps> = ({ onSelect }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-700 text-center mb-2">New Claim</h2>
      <p className="text-slate-500 text-center mb-8">What type of claim would you like to submit?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect('personal')}
          className="group flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <UserIcon className="h-12 w-12 text-slate-400 group-hover:text-blue-600 transition-colors" />
          <span className="mt-4 text-xl font-medium text-slate-700 group-hover:text-blue-700">Personal Claim</span>
          <span className="mt-1 text-sm text-slate-500">For individual employee expenses</span>
        </button>
        <button
          onClick={() => onSelect('vendor')}
          className="group flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <BuildingOfficeIcon className="h-12 w-12 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="mt-4 text-xl font-medium text-slate-700 group-hover:text-indigo-700">Vendor Claim</span>
           <span className="mt-1 text-sm text-slate-500">For payments to external companies</span>
        </button>
      </div>
    </div>
  );
};

export default ClaimTypeSelector;
