'use client';

import { useState, useCallback, useEffect } from 'react';
import { DocumentArrowUpIcon, CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ExtractedData {
  orderNumber?: string;
  customerInfo?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Cleanup URL objects when component unmounts or when fileUrl changes
  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  // Track fileUrl updates
  useEffect(() => {
    console.log('fileUrl updated:', fileUrl);
  }, [fileUrl]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    // Clean up previous URL if it exists
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    setError(null);
    setExtractedData(null);
    console.log('Selected file:', selectedFile);
    console.log('File URL:', fileUrl);
    
    if (!selectedFile) {
      setFile(null);
      setFileUrl(null);
      return;
    }

    if (!selectedFile.type.includes('pdf')) {
      setError('Please upload a PDF file');
      setFile(null);
      setFileUrl(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
      setError('File size must be less than 10MB');
      setFile(null);
      setFileUrl(null);
      return;
    }

    // Create new URL object and update state atomically
    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setFileUrl(url);
    console.log('Selected file:', selectedFile);
    console.log('New URL created:', url);
  }, [fileUrl]); // Add fileUrl as dependency to properly cleanup

  const handleExtract = () => {};
  const handleMatch = () => {};

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">
          Upload New Order
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload a PDF file containing the order details.
        </p>
      </div>
      <div className="border-t border-gray-200 p-6">
        {!file ? (
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} border-dashed rounded-lg`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a file</span>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    accept=".pdf" 
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF up to 10MB</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Left side - PDF Viewer */}
            <div className="flex-1 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleFileSelect(null)}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  Remove file
                </button>
              </div>
              <div className="p-4 bg-gray-100 min-h-[600px] flex justify-center items-center">
                {fileUrl && (
                  <iframe
                    src={fileUrl}
                    className="w-full h-[600px]"
                    title="PDF Viewer"
                  />
                )}
              </div>
            </div>

            {/* Right side - Extraction Controls */}
            <div className="w-96 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="text-sm font-medium text-gray-700">Extracted Data</h3>
              </div>
              <div className="p-4 space-y-4">
                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={isExtracting}
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
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Order Number</dt>
                          <dd className="mt-1 text-sm text-gray-900">{extractedData.orderNumber || 'Not found'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Customer Info</dt>
                          <dd className="mt-1 text-sm text-gray-900">{extractedData.customerInfo || 'Not found'}</dd>
                        </div>
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

                    <button
                      type="button"
                      onClick={handleMatch}
                      className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Match and Create Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mt-2 flex items-center text-sm text-red-600">
            <XCircleIcon className="h-5 w-5 mr-1" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
