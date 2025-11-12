import React, { useState, useCallback } from 'react';
import type { ClaimType, ClaimFormData, ExtractedReceiptData, PersonalClaimData, VendorClaimData, EmployeeData } from './types';
import { processReceipt } from './services/geminiService';
import ClaimTypeSelector from './components/ClaimTypeSelector';
import PersonalClaimForm from './components/PersonalClaimForm';
import VendorClaimForm from './components/VendorClaimForm';
import ReceiptUpload from './components/ReceiptUpload';
import ReviewClaim from './components/ReviewClaim';
import SubmissionSuccess from './components/SubmissionSuccess';
import Spinner from './components/Spinner';
import EmployeeDataUploader from './components/EmployeeDataUploader';

type Step = 'selectType' | 'fillForm' | 'uploadReceipt' | 'review' | 'submitted';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('selectType');
  const [claimType, setClaimType] = useState<ClaimType | null>(null);
  const [claimPurpose, setClaimPurpose] = useState<string>('');
  const [formData, setFormData] = useState<ClaimFormData | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);

  const handleSelectClaimType = (type: ClaimType) => {
    setClaimType(type);
    setFormData(type === 'personal' 
      ? { name: '', icOrPassport: '', bankName: '', bankAccount: '' }
      : { companyName: '', companyRegistrationNumber: '', bankName: '', bankAccount: '' });
    setStep('fillForm');
  };
  
  const handleFormSubmit = (data: ClaimFormData) => {
    setFormData(data);
    setStep('uploadReceipt');
  };

  const handleProcessReceipt = useCallback(async () => {
    if (!receiptFile) {
      setError('Please upload a receipt file first.');
      return;
    }
     if (!claimPurpose) {
      setError('Please select a purpose for the claim.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await processReceipt(receiptFile, claimPurpose);
      setExtractedData(data);
      setStep('review');
    } catch (e) {
      const err = e as Error;
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [receiptFile, claimPurpose]);

  const handleFinalSubmit = () => {
    setIsLoading(true);
    setError(null);
    // Simulate API call to submit the final claim
    console.log("Submitting Claim:", { claimType, claimPurpose, formData, extractedData });
    setTimeout(() => {
      setIsLoading(false);
      setStep('submitted');
    }, 1500);
  };

  const handleReset = () => {
    setStep('selectType');
    setClaimType(null);
    setFormData(null);
    setReceiptFile(null);
    setExtractedData(null);
    setClaimPurpose('');
    setError(null);
    setIsLoading(false);
  };

  const handleBack = (targetStep: Step) => {
    setError(null);
    setStep(targetStep);
  };
  
  const handleDataLoaded = (data: EmployeeData[]) => {
    setEmployeeData(data);
  };

  const renderStep = () => {
    switch (step) {
      case 'selectType':
        return <ClaimTypeSelector onSelect={handleSelectClaimType} />;
      case 'fillForm':
        if (claimType === 'personal') {
          return <PersonalClaimForm onSubmit={handleFormSubmit} onBack={() => handleBack('selectType')} initialData={formData as PersonalClaimData} employeeData={employeeData} />;
        }
        if (claimType === 'vendor') {
          return <VendorClaimForm onSubmit={handleFormSubmit} onBack={() => handleBack('selectType')} initialData={formData as VendorClaimData}/>;
        }
        return null;
      case 'uploadReceipt':
        return <ReceiptUpload setReceiptFile={setReceiptFile} onProcess={handleProcessReceipt} onBack={() => handleBack('fillForm')} claimPurpose={claimPurpose} setClaimPurpose={setClaimPurpose} />;
      case 'review':
        if (formData && receiptFile && extractedData && claimPurpose) {
          return (
            <ReviewClaim
              formData={formData}
              claimType={claimType!}
              receiptFile={receiptFile}
              extractedData={extractedData}
              claimPurpose={claimPurpose}
              onDataChange={setExtractedData}
              onSubmit={handleFinalSubmit}
              onBack={() => handleBack('uploadReceipt')}
            />
          );
        }
        return null; // or a loading/error state
      case 'submitted':
        return <SubmissionSuccess onReset={handleReset} />;
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">AJT Claims Portal</h1>
          <p className="text-slate-500 mt-2">Submit your personal or vendor claims seamlessly.</p>
        </header>

        <EmployeeDataUploader onDataLoaded={handleDataLoaded} />

        <main className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 transition-all duration-300">
           {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
                <Spinner />
                <p className="mt-4 text-slate-600 font-medium">
                  {step === 'uploadReceipt' ? 'Analyzing your receipt...' : 'Submitting your claim...'}
                </p>
              </div>
            )}
           {error && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-30 shadow-md" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {renderStep()}
        </main>
        <footer className="text-center mt-8 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} AJT Corporation. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
