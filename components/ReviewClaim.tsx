import React, { useState, useEffect } from 'react';
import type { ClaimFormData, ClaimType, ExtractedReceiptData, PersonalClaimData, VendorClaimData } from '../types';

interface ReviewClaimProps {
  formData: ClaimFormData;
  claimType: ClaimType;
  receiptFile: File;
  extractedData: ExtractedReceiptData;
  claimPurpose: string;
  onDataChange: (data: ExtractedReceiptData) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const ReviewClaim: React.FC<ReviewClaimProps> = ({ formData, claimType, receiptFile, extractedData, claimPurpose, onDataChange, onSubmit, onBack }) => {
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(receiptFile);
    setReceiptPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [receiptFile]);

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({
      ...extractedData,
      [name]: value,
    });
  };

  const handleItemChange = (index: number, field: 'description' | 'amount', value: string) => {
    const newItems = [...extractedData.items];
    const updatedItem = { ...newItems[index] };

    if (field === 'amount') {
      updatedItem.amount = parseFloat(value) || 0;
    } else {
      updatedItem.description = value;
    }
    newItems[index] = updatedItem;

    const newTotal = newItems.reduce((sum, item) => sum + item.amount, 0);

    onDataChange({
      ...extractedData,
      items: newItems,
      totalAmount: newTotal,
    });
  };
  
  const renderFormData = () => {
    if (claimType === 'personal') {
      const data = formData as PersonalClaimData;
      return (
        <>
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-500">Full Name</span>
            <span className="font-medium text-slate-800">{data.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-500">IC/Passport</span>
            <span className="font-medium text-slate-800">{data.icOrPassport}</span>
          </div>
        </>
      );
    } else {
      const data = formData as VendorClaimData;
      return (
        <>
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-500">Company Name</span>
            <span className="font-medium text-slate-800">{data.companyName}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-500">Registration No.</span>
            <span className="font-medium text-slate-800">{data.companyRegistrationNumber}</span>
          </div>
        </>
      );
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-slate-700 text-center">Review Your Claim</h2>

      {/* Extracted Data */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">AI Extracted Details</h3>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="space-y-3 mb-4 text-sm">
              <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="vendorName" className="text-slate-500 font-medium">Vendor Name</label>
                  <input
                    id="vendorName"
                    name="vendorName"
                    type="text"
                    value={extractedData.vendorName}
                    onChange={handleHeaderChange}
                    className="col-span-2 block w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                  <label htmlFor="invoiceNumber" className="text-slate-500 font-medium">Invoice/Receipt No.</label>
                  <input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    type="text"
                    value={extractedData.invoiceNumber}
                    onChange={handleHeaderChange}
                    className="col-span-2 block w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
              </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium text-slate-600 pb-2">Item Description</th>
                <th className="text-right font-medium text-slate-600 pb-2 w-32">Amount (RM)</th>
              </tr>
            </thead>
            <tbody>
              {extractedData.items.map((item, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-1.5 pr-2">
                     <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-transparent rounded-md hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                     />
                  </td>
                  <td className="py-1.5 text-right">
                    <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                        className="w-full px-2 py-1 border border-transparent rounded-md text-right hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                        step="0.01"
                     />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300">
                <td className="text-right font-bold text-slate-800 pt-2">Total Amount</td>
                <td className="text-right font-bold text-slate-800 pt-2 text-lg">
                  RM{extractedData.totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
          <p className="text-xs text-slate-500 mt-3 text-center">Please verify that the extracted information is accurate. You can edit the fields above if needed.</p>
        </div>
      </div>
      
      {/* Submitted Details */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">Your Information</h3>
        <div className="text-sm space-y-2">
           <div className="flex justify-between py-2 border-b">
            <span className="text-slate-500">Claim Purpose</span>
            <span className="font-medium text-slate-800">{claimPurpose}</span>
          </div>
          {renderFormData()}
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-500">Bank Name</span>
            <span className="font-medium text-slate-800">{formData.bankName}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Bank Account</span>
            <span className="font-medium text-slate-800">{formData.bankAccount}</span>
          </div>
        </div>
      </div>

       {/* Receipt Preview */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">Uploaded Document</h3>
        <div className="w-full h-48 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden bg-slate-50">
          {receiptFile.type === 'application/pdf' ? (
            <embed src={receiptPreviewUrl} type="application/pdf" className="h-full w-full" />
          ) : (
            <img src={receiptPreviewUrl} alt="Receipt" className="max-h-full max-w-full object-contain" />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button type="button" onClick={onBack} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500">
          Back
        </button>
        <button onClick={onSubmit} className="inline-flex justify-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">
          Submit Claim
        </button>
      </div>
    </div>
  );
};

export default ReviewClaim;
