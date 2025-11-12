import { GoogleGenAI, Type } from "@google/genai";
import type { ExtractedReceiptData } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove "data:*/*;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const processReceipt = async (receiptFile: File, claimPurpose: string): Promise<ExtractedReceiptData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Image = await fileToBase64(receiptFile);

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      invoiceNumber: {
        type: Type.STRING,
        description: "The receipt or invoice number. If not found, return 'N/A'.",
      },
      vendorName: {
        type: Type.STRING,
        description: "The name of the vendor, store, or company. If not found, return 'N/A'.",
      },
      items: {
        type: Type.ARRAY,
        description: "A list of all items found on the receipt, including description and amount.",
        items: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "The description of the purchased item.",
            },
            amount: {
              type: Type.NUMBER,
              description: "The price of the item.",
            },
          },
          required: ["description", "amount"],
        },
      },
      totalAmount: {
        type: Type.NUMBER,
        description: "The final total amount from the receipt.",
      },
    },
    required: ["invoiceNumber", "vendorName", "items", "totalAmount"],
  };

  const textPart = {
    text: `Analyze this receipt or invoice for a claim with the purpose of "${claimPurpose}". Extract the vendor's name, the receipt or invoice number, all line items with their descriptions and prices, and the final total amount. Ensure the output is structured according to the provided JSON schema.`,
  };
  const imagePart = {
    inlineData: {
      mimeType: receiptFile.type,
      data: base64Image,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData: ExtractedReceiptData = JSON.parse(jsonText);
    return parsedData;

  } catch (error) {
    console.error("Error processing receipt with Gemini API:", error);
    throw new Error("Failed to analyze the receipt. The document might be unclear or the format unsupported. Please try again.");
  }
};