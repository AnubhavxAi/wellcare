"use client";
import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, ShieldCheck, X, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function PrescriptionUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

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
    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError("File too large. Maximum 5MB allowed.");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadError("Invalid file type. Please upload JPG, PNG, or PDF.");
      return;
    }

    setFile(selectedFile);
    setUploadError(null);
    setUploadComplete(false);
    setUploadProgress(null);

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setUploadProgress(null);
    setUploadComplete(false);
    setUploadError(null);
    setShowPhonePrompt(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitPrescription = async () => {
    if (!file) return;
    if (!user && !phone) {
      setShowPhonePrompt(true);
      return;
    }

    setUploadError(null);
    setUploadProgress(10); // Start simulated progress

    try {
      const userPhone = user?.phone || phone;
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
      const filePath = userPhone ? `${userPhone}/${fileName}` : `guest/${fileName}`;

      // 1. Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("prescriptions")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;
      setUploadProgress(60);

      // 2. Get signed URL (7 days)
      const { data: urlData } = await supabase.storage
        .from("prescriptions")
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);

      const fileUrl = urlData?.signedUrl || "";
      setUploadProgress(90);

      // 3. Save metadata via API route
      const res = await fetch("/api/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: userPhone,
          userId: user?.phone || null,
          fileUrl,
          fileName: file.name,
          fileSize: file.size,
        }),
      });

      if (!res.ok) throw new Error("Failed to record prescription metadata");

      setUploadComplete(true);
      setUploadProgress(100);
    } catch (err: any) {
      console.error("Prescription upload error:", err);
      setUploadError(err.message || "Upload failed. Please try again.");
      setUploadProgress(null);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-10 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] mb-3">Upload Your Prescription</h2>
          <p className="text-gray-500 text-sm sm:text-base">Please attach a clear image of your valid doctor&apos;s prescription.</p>
        </div>

        <motion.div
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center transition-colors duration-300 ease-in-out ${
            isDragging ? 'border-[var(--color-brand-green)] bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            backgroundColor: isDragging ? "rgba(236, 253, 245, 0.5)" : "rgba(249, 250, 251, 1)",
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
            id="prescription-file-input"
          />

          <AnimatePresence mode="wait">
            {uploadComplete ? (
              <motion.div
                key="upload-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-[var(--color-brand-green)] w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Prescription Received!</h3>
                <p className="text-gray-600 text-sm mb-4 max-w-sm">
                  We&apos;ll review your prescription and call you within 30 minutes to confirm your order.
                </p>
                <button
                  onClick={clearFile}
                  className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Upload Another
                </button>
              </motion.div>
            ) : !file ? (
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
                <div className="relative w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm mb-4 flex flex-col items-center">
                  <button
                    onClick={clearFile}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
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
                    <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>

                {uploadProgress !== null && uploadProgress < 100 && (
                  <div className="w-full max-w-sm mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[var(--color-brand-green)] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {showPhonePrompt && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="w-full max-w-sm mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none text-sm"
                    />
                  </motion.div>
                )}

                {uploadError && (
                  <div className="w-full max-w-sm mb-4 bg-red-50 px-3 py-2 rounded-lg flex items-center space-x-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <p className="text-sm text-red-700">{uploadError}</p>
                  </div>
                )}

                {uploadProgress === null && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitPrescription}
                    disabled={showPhonePrompt && phone.length < 10}
                    className={`px-8 py-3 font-bold rounded-xl shadow-md transition-all ${
                      showPhonePrompt && phone.length < 10 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[var(--color-brand-green)] text-white hover:shadow-lg"
                    }`}
                  >
                    Submit Prescription
                  </motion.button>
                )}

                {uploadProgress !== null && uploadProgress < 100 && (
                  <div className="flex items-center space-x-2 text-[var(--color-brand-green)]">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
