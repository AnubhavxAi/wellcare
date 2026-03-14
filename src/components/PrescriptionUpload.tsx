"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, ShieldCheck, X, FileText, CheckCircle2 } from "lucide-react";

export default function PrescriptionUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Create preview if it's an image
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-10 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] mb-3">Upload Your Prescription</h2>
          <p className="text-gray-500 text-sm sm:text-base">Please attach a clear image of your valid doctor's prescription.</p>
        </div>

        <motion.div
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center transition-colors duration-300 ease-in-out ${
            isDragging ? 'border-[var(--color-brand-green)] bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            backgroundColor: isDragging ? "rgba(236, 253, 245, 0.5)" : "rgba(249, 250, 251, 1)", // Faint green tint
            borderColor: isDragging ? "#1a9c51" : "#d1d5db"
          }}
          transition={{ duration: 0.2 }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            className="hidden"
            id="prescription-upload"
          />
          
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div 
                key="upload-prompt"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center w-full relative z-10"
              >
                <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4 font-medium">Drag and drop your file here</p>
                <div className="flex items-center w-full mb-4">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Browse Files
                </button>
                <p className="mt-4 text-xs text-gray-400">Supports JPG, PNG, PDF (Max 5MB)</p>
              </motion.div>
            ) : (
              <motion.div 
                key="file-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center relative z-10"
              >
                <div className="relative w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm mb-6 flex flex-col items-center">
                  <button 
                    onClick={clearFile}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </button>
                  
                  {preview ? (
                     <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-100 mb-4 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                        <img src={preview} alt="Prescription preview" className="w-full h-full object-cover" />
                     </div>
                  ) : (
                     <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                       <FileText size={32} />
                     </div>
                  )}
                  
                  <div className="text-center w-full overflow-hidden">
                    <p className="font-semibold text-gray-800 truncate px-4">{file.name}</p>
                  </div>
                  
                  <div className="absolute -bottom-3 text-[var(--color-brand-green)] bg-white rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 size={24} className="fill-white" />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-[var(--color-brand-green)] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Submit Prescription
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Invisible overlay to catch drops on the whole area */}
          <div className="absolute inset-0 z-0"></div>
        </motion.div>

        <div className="mt-6 flex items-center justify-center text-gray-500">
          <ShieldCheck size={18} className="text-[var(--color-brand-green)] mr-2" />
          <span className="text-xs sm:text-sm font-medium">Your medical data is secure and encrypted.</span>
        </div>
      </div>
    </section>
  );
}
