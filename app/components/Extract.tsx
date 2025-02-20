import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { ExtractedData } from "../upload/page";

interface BackendItem {
  Request_Item?: string;
  Amount?: string;
  Unit_Price?: string;
  Total?: string;
}

type ExtractProps = {
  file: File | null;
  extractedData: ExtractedData | null;
  setExtractedData: (data: ExtractedData | null) => void;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://0.0.0.0:8000";

export default function Extract({ file, extractedData, setExtractedData }: ExtractProps) {
  const [isExtracting, setIsExtracting] = useState(false);

  const extractFile = async () => {
    setIsExtracting(true);
    try {
      if (!file) {
        console.error('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
    
      const response = await fetch(`${BACKEND_URL}/extract`, {
        method: "POST",
        body: formData,
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const items: BackendItem[] = await response.json();
      
      // Transform the backend response to match our frontend format
      const transformedData: ExtractedData = {
        items: items.map((item: BackendItem) => ({
          name: item.Request_Item || '',
          quantity: item.Amount ? parseFloat(item.Amount) : 0,
          price: item.Unit_Price ? parseFloat(item.Unit_Price) : 0,
          total: item.Total ? parseFloat(item.Total) : 0
        }))
      };
      
      setExtractedData(transformedData);
    } catch (error) {
      console.error('Error extracting data:', error);
      // You might want to show an error message to the user here
    }
    setIsExtracting(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={extractFile}
        disabled={isExtracting || !file}
        className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isExtracting ? (
          <>
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
            Extracting...
          </>
        ) : (
          <>
            <MagnifyingGlassIcon className="h-5 w-5" />
            Extract Data
          </>
        )}
      </button>

      {extractedData && (
        <div className="space-y-4">
          <div className="rounded-md bg-gray-50 p-4">
            <dl className="space-y-2">
              {extractedData.items && extractedData.items.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Items</dt>
                  <dd className="mt-1">
                    <ul className="divide-y divide-gray-200">
                      {extractedData.items.map((item, index) => (
                        <li key={index} className="py-2">
                          <div className="text-sm text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}
    </>
  );
}