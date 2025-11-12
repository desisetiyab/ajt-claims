export type ClaimType = 'personal' | 'vendor';

export interface EmployeeData {
  "Full Name": string;
  "IC / Passport Number": string;
  "Bank Name": string;
  "Bank Account Number": string;
  [key: string]: any;
}

export interface PersonalClaimData {
  name: string;
  icOrPassport: string;
  bankName: string;
  bankAccount: string;
}

export interface VendorClaimData {
  companyName: string;
  companyRegistrationNumber: string;
  bankName: string;
  bankAccount: string;
}

export type ClaimFormData = PersonalClaimData | VendorClaimData;

export interface ExtractedReceiptData {
  invoiceNumber: string;
  vendorName: string;
  items: {
    description: string;
    amount: number;
  }[];
  totalAmount: number;
}