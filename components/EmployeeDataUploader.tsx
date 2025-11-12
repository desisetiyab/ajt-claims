import React, { useState, useCallback } from 'react';
import type { EmployeeData } from '../types';
import { ArrowUpTrayIcon, DocumentCheckIcon } from './icons';

// Inform TypeScript that the XLSX library is available globally.
declare var XLSX: any;

interface EmployeeDataUploaderProps {
  onDataLoaded: (data: EmployeeData[]) => void;
}

const EmployeeDataUploader: React.FC<EmployeeDataUploaderProps> = ({ onDataLoaded }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // FIX: Cast the result of sheet_to_json instead of using a type argument,
        // as XLSX is declared as `any` and doesn't support generic type arguments here.
        const json = XLSX.utils.sheet_to_json(worksheet) as EmployeeData[];
        
        // Basic validation for required columns
        if (json.length > 0 && json[0]['Full Name'] && json[0]['IC / Passport Number'] && json[0]['Bank Name'] && json[0]['Bank Account Number']) {
            onDataLoaded(json);
        } else {
            setError("Invalid Excel format. Make sure the headers 'Full Name', 'IC / Passport Number', 'Bank Name', and 'Bank Account Number' exist.");
            setFileName(null);
            onDataLoaded([]);
        }
      } catch (err) {
        console.error(err);
        setError("There was an error processing the Excel file.");
        setFileName(null);
        onDataLoaded([]);
      }
    };
    reader.readAsBinaryString(file);
  }, [onDataLoaded]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
          setError('Invalid file type. Please upload an .xls or .xlsx file.');
          return;
      }
      handleFile(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => e.preventDefault();
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
          setError('Invalid file type. Please upload an .xls or .xlsx file.');
          return;
      }
      handleFile(file);
    }
  };


  return (
    <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-700 text-center">Manage Employee Data</h3>
        <p className="text-sm text-slate-500 text-center mb-4">Upload the latest Excel file with employee details.</p>
        
        <label 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative block w-full border-2 border-slate-300 border-dashed rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer transition-colors bg-slate-50"
        >
            <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".xlsx, .xls"
            />
            {fileName ? (
                 <div className="flex items-center justify-center text-green-700">
                    <DocumentCheckIcon className="h-6 w-6 mr-3" />
                    <span className="font-medium">{fileName} loaded successfully.</span>
                </div>
            ) : (
                <>
                    <ArrowUpTrayIcon className="mx-auto h-8 w-8 text-slate-400" />
                    <span className="mt-2 block text-sm font-medium text-slate-900">
                        Upload Employee Data File
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                        Drag & drop or click to upload .xlsx or .xls
                    </span>
                </>
            )}
        </label>
        {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default EmployeeDataUploader;