"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { labTests } from "@/components/LabTestBooking";

export default function LabTestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileSelected(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
  };
  const handleFileSelected = (f: File) => {
    if (f.size > 10 * 1024 * 1024) { setUploadError("Max 10MB."); return; }
    setFile(f); setUploadError(null); setUploadComplete(false); setUploadProgress(null);
  };
  const clearFile = () => { setFile(null); setUploadProgress(null); setUploadComplete(false); setUploadError(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleUpload = async () => {
    if (!file) return;
    if (!user && !phone) return;
    setUploadError(null); setUploadProgress(10);
    try {
      const userPhone = user?.phone || phone;
      const filePath = `${userPhone || "guest"}/${Date.now()}_${file.name.replace(/\s/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("prescriptions").upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      setUploadProgress(60);
      const { data: urlData } = await supabase.storage.from("prescriptions").createSignedUrl(filePath, 60 * 60 * 24 * 7);
      setUploadProgress(90);
      await fetch("/api/prescription", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: userPhone, userId: user?.phone || null, fileUrl: urlData?.signedUrl || "", fileName: file.name, fileSize: file.size }) });
      setUploadComplete(true); setUploadProgress(100);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed."); setUploadProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-24 pb-32">
        {/* Page Header */}
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
          Precision Diagnostics
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed mb-12">
          Book certified lab tests with home collection across Agra. Clear results, professional care, and a sanctuary for your health data.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Upload Prescription */}
            <div className="bg-surface-container-low rounded-xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-headline font-bold text-2xl text-on-surface">Upload Prescription</h2>
                  <p className="text-on-surface-variant text-sm">We&apos;ll identify the tests for you</p>
                </div>
                <span className="bg-secondary-fixed text-on-secondary-fixed rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified_user</span> Secure & Private
                </span>
              </div>

              <AnimatePresence mode="wait">
                {uploadComplete ? (
                  <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                    <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
                    </div>
                    <p className="font-semibold text-on-surface mb-2">Prescription received!</p>
                    <p className="text-on-surface-variant text-sm mb-4">We&apos;ll contact you shortly.</p>
                    <button onClick={clearFile} className="text-primary font-semibold text-sm hover:underline">Upload Another</button>
                  </motion.div>
                ) : !file ? (
                  <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div
                      className={`relative group bg-surface-container-lowest border-2 border-dashed rounded-xl p-12 transition-all text-center cursor-pointer ${
                        isDragging ? "border-primary/50 bg-primary/5" : "border-outline-variant hover:border-primary/50 hover:bg-primary/5"
                      }`}
                      onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="w-16 h-16 bg-primary-fixed/30 rounded-full flex items-center justify-center mb-4 text-primary mx-auto group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">upload_file</span>
                      </div>
                      <p className="text-on-surface font-semibold text-lg mb-1">Drop your prescription here</p>
                      <p className="text-on-surface-variant text-sm">Supports PDF, JPG, or PNG (Max 10MB)</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-6">
                    <div className="bg-surface-container-lowest rounded-xl p-4 mb-4 flex items-center gap-4 w-full max-w-md">
                      <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">description</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-on-surface truncate">{file.name}</p>
                        <p className="text-xs text-on-surface-variant">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <button onClick={clearFile} className="text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                    {uploadProgress !== null && uploadProgress < 100 && (
                      <div className="w-full max-w-md mb-4">
                        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                          <motion.div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                            initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}
                    {uploadError && <p className="text-error text-sm mb-4">{uploadError}</p>}
                    {uploadProgress === null && (
                      <button onClick={handleUpload}
                        className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all">
                        Submit Prescription
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recommended Packages */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline font-bold text-2xl text-on-surface">Recommended Packages</h2>
                <button className="text-primary font-semibold text-sm hover:underline">View All Tests →</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {labTests.map((test, i) => (
                  <motion.div key={test.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_40px_rgba(25,28,28,0.04)] hover:translate-y-[-4px] transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-secondary-container rounded-lg text-on-secondary-container">
                        <span className="material-symbols-outlined">{test.icon}</span>
                      </div>
                      {test.popular && (
                        <span className="text-xs font-bold uppercase tracking-widest text-tertiary bg-tertiary-fixed px-2 py-1 rounded">Popular</span>
                      )}
                    </div>
                    <h3 className="font-headline text-xl font-bold mb-2 text-on-surface">{test.name}</h3>
                    <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">{test.description}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        {test.originalPrice && <span className="text-on-surface-variant line-through text-xs">₹{test.originalPrice}</span>}
                        <div className="text-2xl font-extrabold text-on-surface font-headline">₹{test.price}</div>
                      </div>
                      <button onClick={() => router.push(`/book-test?test=${encodeURIComponent(test.name)}`)}
                        className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full text-sm shadow-md hover:shadow-lg transition-all active:scale-95">
                        Book
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Why choose card */}
            <div className="bg-primary rounded-xl p-8 text-white">
              <div className="p-3 bg-white/10 rounded-lg w-fit mb-4">
                <span className="material-symbols-outlined text-white">verified_user</span>
              </div>
              <h3 className="font-headline text-xl font-bold mb-4 text-white">Why choose Wellcare Labs?</h3>
              {[
                "NABL & CAP certified diagnostic facilities.",
                "Sample collection by trained Phlebotomists.",
                "Digital reports delivered within 24 hours.",
                "Home collection across all Agra localities.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary-fixed text-sm mt-0.5">check_circle</span>
                  <p className="text-white/80 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="bg-surface-container-low rounded-xl p-6">
              <h3 className="font-headline font-bold text-on-surface mb-4">How it works</h3>
              {[
                { n: 1, t: "Pick a Test", d: "Select from our lab tests or upload prescription." },
                { n: 2, t: "Sample Collection", d: "Trained technician visits your Agra address." },
                { n: 3, t: "Digital Report", d: "Receive encrypted results via WhatsApp in 24hrs." },
              ].map((step) => (
                <div key={step.n} className="flex gap-4 mb-4 last:mb-0">
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {step.n}
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface text-sm">{step.t}</p>
                    <p className="text-on-surface-variant text-xs leading-relaxed mt-0.5">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
