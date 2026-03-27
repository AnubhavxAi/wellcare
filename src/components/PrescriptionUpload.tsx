"use client";
import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const cameraInputRef = useRef<HTMLInputElement>(null);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
      handleFileSelected(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0)
      handleFileSelected(e.target.files[0]);
  };

  const handleFileSelected = (selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError("File too large. Maximum 10MB allowed.");
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
    } else setPreview(null);
  };

  const clearFile = () => {
    setFile(null); setPreview(null); setUploadProgress(null);
    setUploadComplete(false); setUploadError(null); setShowPhonePrompt(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitPrescription = async () => {
    if (!file) return;
    if (!user && !phone) { setShowPhonePrompt(true); return; }
    setUploadError(null); setUploadProgress(10);
    try {
      const userPhone = user?.phone || phone;
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
      const filePath = userPhone ? `${userPhone}/${fileName}` : `guest/${fileName}`;
      const { error: upErr } = await supabase.storage.from("prescriptions").upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      setUploadProgress(60);
      const { data: urlData } = await supabase.storage.from("prescriptions").createSignedUrl(filePath, 60 * 60 * 24 * 7);
      setUploadProgress(90);
      const res = await fetch("/api/prescription", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: userPhone, userId: user?.phone || null, fileUrl: urlData?.signedUrl || "", fileName: file.name, fileSize: file.size }),
      });
      if (!res.ok) throw new Error("Failed to record prescription metadata");
      setUploadComplete(true); setUploadProgress(100);
    } catch (err: any) {
      console.error("Prescription upload error:", err);
      setUploadError(err.message || "Upload failed. Please try again.");
      setUploadProgress(null);
    }
  };

  return (
    <section id="prescription-upload" className="py-20 bg-surface-container-low">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-3">
          Upload Your Prescription
        </h2>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          Ordering made easy. Just upload a photo of your prescription and we&apos;ll prepare your order 
          and deliver it to your Agra doorstep within 2 hours.
        </p>

        {/* Feature chips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "verified_user", text: "Secure & encrypted" },
            { icon: "schedule", text: "Ready in 30 minutes" },
            { icon: "local_shipping", text: "Free delivery above ₹499" },
          ].map((f) => (
            <div key={f.icon} className="flex items-center gap-3 bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_20px_rgba(25,28,28,0.04)]">
              <span className="material-symbols-outlined text-primary">{f.icon}</span>
              <span className="text-on-surface text-sm font-medium">{f.text}</span>
            </div>
          ))}
        </div>

        {/* Upload Zone */}
        <AnimatePresence mode="wait">
          {uploadComplete ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-lowest rounded-xl p-12 shadow-[0_12px_40px_rgba(25,28,28,0.06)] flex flex-col items-center">
              <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Prescription Received!</h3>
              <p className="text-on-surface-variant text-sm mb-6 max-w-sm">
                We&apos;ll review your prescription and contact you at{" "}
                <strong>{user?.phone || phone}</strong> within 30 minutes.
              </p>
              <button onClick={clearFile} className="px-6 py-2.5 bg-surface-container text-on-surface font-semibold rounded-full hover:bg-surface-container-high transition-all text-sm">
                Upload Another
              </button>
            </motion.div>
          ) : !file ? (
            <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                className={`relative group bg-surface-container-lowest border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer ${
                  isDragging ? "border-primary/50 bg-primary/5" : "border-outline-variant hover:border-primary/30 hover:bg-primary/5"
                }`}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" className="hidden" />
                <div className="w-16 h-16 bg-primary-fixed/30 rounded-full flex items-center justify-center mb-4 text-primary mx-auto group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">upload_file</span>
                </div>
                <p className="text-on-surface font-semibold text-lg mb-1">Drop your prescription here</p>
                <p className="text-on-surface-variant text-sm">Supports PDF, JPG, or PNG (Max 10MB)</p>
              </div>

              {/* Two CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <button onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">upload_file</span>
                  Choose File
                </button>
                <button onClick={() => cameraInputRef.current?.click()}
                  className="px-8 py-4 bg-surface-container-lowest text-primary font-bold rounded-full shadow-[0_4px_20px_rgba(25,28,28,0.06)] hover:bg-secondary-fixed transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">photo_camera</span>
                  Scan via Camera
                </button>
                <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
              </div>
            </motion.div>
          ) : (
            <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,28,28,0.06)] flex flex-col items-center">
              <div className="relative bg-surface-container-low rounded-xl p-4 mb-6 w-full max-w-sm flex flex-col items-center">
                <button onClick={clearFile} className="absolute top-2 right-2 p-1.5 bg-surface-container rounded-full text-on-surface-variant hover:text-error hover:bg-error-container transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                {preview ? (
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container mb-4 flex items-center justify-center">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary text-2xl">description</span>
                  </div>
                )}
                <p className="font-semibold text-on-surface truncate px-4 w-full text-center">{file.name}</p>
                <p className="text-xs text-on-surface-variant mt-1">{(file.size / 1024).toFixed(0)} KB</p>
              </div>

              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="w-full max-w-sm mb-6">
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} transition={{ duration: 0.3 }} />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2">Uploading... {uploadProgress}%</p>
                </div>
              )}

              {showPhonePrompt && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm mb-6">
                  <label className="block text-sm font-semibold text-on-surface mb-1.5 text-left">Your Phone Number</label>
                  <input type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-highest focus:ring-2 focus:ring-primary/15 outline-none text-sm text-on-surface" />
                </motion.div>
              )}

              {uploadError && (
                <div className="w-full max-w-sm mb-4 bg-error-container px-3 py-2 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-sm">error</span>
                  <p className="text-sm text-on-error-container">{uploadError}</p>
                </div>
              )}

              {uploadProgress === null && (
                <button onClick={handleSubmitPrescription}
                  disabled={showPhonePrompt && phone.length < 10}
                  className={`px-8 py-3 font-bold rounded-full shadow-md transition-all ${
                    showPhonePrompt && phone.length < 10
                      ? "bg-surface-container text-on-surface-variant cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-primary-container text-white hover:shadow-lg active:scale-95"
                  }`}>
                  Submit Prescription
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-on-surface-variant text-sm mt-6 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">lock</span>
          Your medical data is 100% secure and encrypted
        </p>
      </div>
    </section>
  );
}
