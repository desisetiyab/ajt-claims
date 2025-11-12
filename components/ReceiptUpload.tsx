import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpTrayIcon, DocumentCheckIcon } from './icons';

interface ReceiptUploadProps {
  setReceiptFile: (file: File | null) => void;
  onProcess: () => void;
  onBack: () => void;
  claimPurpose: string;
  setClaimPurpose: (purpose: string) => void;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ setReceiptFile, onProcess, onBack, claimPurpose, setClaimPurpose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File is too large. Maximum size is 10MB.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a JPG, PNG, or PDF.');
        return;
      }
      setError(null);
      setFile(selectedFile);
      setReceiptFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      // Reuse validation logic from handleFileChange
      const event = { target: { files: [droppedFile] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  };


  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-slate-700 text-center mb-2">Upload Receipt or Invoice</h2>
      <p className="text-slate-500 text-center mb-8">Select the purpose of your claim, then upload a clear image or PDF of your document.</p>

      <div className="w-full mb-6">
        <label htmlFor="claimPurpose" className="block text-sm font-medium text-slate-600 mb-1">Purpose of Claim</label>
        <select
          id="claimPurpose"
          name="claimPurpose"
          value={claimPurpose}
          onChange={(e) => setClaimPurpose(e.target.value)}
          required
          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">-- Select a purpose --</option>
          <option value="Meals & Entertainment">Meals & Entertainment</option>
          <option value="Office Supplies">Office Supplies</option>
          <option value="Travel & Accommodation">Travel & Accommodation</option>
          <option value="Training & Development">Training & Development</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {previewUrl ? (
        <div className="w-full text-center">
          <div className="w-full max-w-sm mx-auto h-64 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden mb-4 bg-slate-100">
            {file?.type === 'application/pdf' ? (
              <embed src={previewUrl} type="application/pdf" className="h-full w-full" />
            ) : (
              <img src={previewUrl} alt="Receipt Preview" className="max-h-full max-w-full object-contain" />
            )}
          </div>
          <div className="flex items-center justify-center bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
             <DocumentCheckIcon className="h-6 w-6 mr-3" />
            <span className="font-medium">{file?.name}</span>
          </div>
          <button onClick={() => {
            setFile(null);
            setReceiptFile(null);
            setPreviewUrl(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
          }} className="mt-4 text-sm text-red-600 hover:text-red-800">
            Remove file
          </button>
        </div>
      ) : (
        <label 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative block w-full border-2 border-slate-300 border-dashed rounded-lg p-12 text-center hover:border-slate-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer transition-colors"
        >
          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-slate-400" />
          <span className="mt-2 block text-sm font-medium text-slate-900">
            Click to upload or drag and drop
          </span>
          <span className="mt-1 block text-xs text-slate-500">PNG, JPG or PDF up to 10MB</span>
          <input
            ref={fileInputRef}
            id="file-upload"
            name="file-upload"
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, application/pdf"
          />
        </label>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      
      <div className="flex w-full justify-between items-center pt-8 mt-4">
        <button type="button" onClick={onBack} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500">
          Back
        </button>
        <button 
          onClick={onProcess}
          disabled={!file || !claimPurpose} 
          className="inline-flex justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          Process and Review
        </button>
      </div>
    </div>
  );
};

export default ReceiptUpload;