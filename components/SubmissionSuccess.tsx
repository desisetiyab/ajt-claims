
import React from 'react';
import { CheckCircleIcon } from './icons';

interface SubmissionSuccessProps {
  onReset: () => void;
}

const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ onReset }) => {
  return (
    <div className="text-center py-10">
      <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
      <h2 className="mt-4 text-2xl font-semibold text-slate-800">Claim Submitted Successfully!</h2>
      <p className="mt-2 text-slate-500">
        Your claim is now being processed. The finance team will review it and you will be notified upon completion.
      </p>
      <div className="mt-8">
        <button
          onClick={onReset}
          className="inline-flex justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        >
          Submit Another Claim
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
