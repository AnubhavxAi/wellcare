"use client";

import { useState, FormEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, Calendar, User, FlaskConical, AlertCircle, Smartphone, MapPin, ShieldCheck, Beaker, Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { labTests, type LabTest } from "@/components/LabTestBooking";

function BookTestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTestName = searchParams.get("test") || "";
  
  // Find test details if it matches one in our list
  const preSelectedTest = labTests.find(
    t => t.name.toLowerCase() === initialTestName.toLowerCase()
  );

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    pincode: "",
    date: "",
    time: "",
    testName: preSelectedTest ? preSelectedTest.name : (initialTestName || ""),
    doctorPrescription: "No"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) newErrors.age = "Valid age (1-120) is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = "Valid 10-digit mobile number is required";
    if (!formData.address.trim()) newErrors.address = "Complete address is required";
    
    // Pincode validation for Agra (starts with 282xxx)
    if (!formData.pincode.match(/^282[0-9]{3}$/)) {
      newErrors.pincode = "We currently only collect samples within Agra (282001-282XXX)";
    }
    
    if (!formData.date) newErrors.date = "Preferred date is required";
    if (!formData.time) newErrors.time = "Preferred time is required";
    if (!formData.testName.trim()) newErrors.testName = "Test name is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const message = `Hello Wellcare Pharmacy! I'd like to book a Lab Test at Home.\n\n` +
      `🧪 Test Required: ${formData.testName}\n` +
      `📅 Date: ${formData.date}\n` +
      `⏰ Time: ${formData.time}\n` +
      `📝 Doctor Prescription: ${formData.doctorPrescription}\n\n` +
      `👤 Patient Details:\n` +
      `Name: ${formData.name}\n` +
      `Age: ${formData.age} | Gender: ${formData.gender}\n` +
      `Mobile: ${formData.mobile}\n\n` +
      `🏠 Collection Address:\n` +
      `${formData.address}\n` +
      `Pincode: ${formData.pincode}\n\n` +
      `Please let me know the total cost and confirm the booking.`;

    const encodedMessage = encodeURIComponent(message);
    
    alert("Redirecting to WhatsApp to confirm your Lab Test booking...");
    window.open(`https://wa.me/919897397532?text=${encodedMessage}`, "_blank");
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 14); // Allow booking 14 days in advance
  const maxDate = maxDateObj.toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 pb-20">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        <button onClick={() => router.push("/")} className="hover:text-[var(--color-brand-green)] transition-colors">Home</button>
        <ChevronRight size={14} />
        <span className="font-bold text-gray-900 truncate">Book Lab Test</span>
      </nav>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute -right-10 -top-10 opacity-10">
            <Beaker size={200} />
          </div>
          
          <div className="relative z-10 w-full">
            <div className="inline-flex items-center space-x-2 bg-blue-500/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider text-blue-50">
              <Home size={12} className="mr-1" />
              Free Home Collection
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Book Home Lab Test</h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-lg">Certified phlebotomists will collect your sample safely from your home.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* Section 1: Test Details */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-2">
              <FlaskConical className="mr-2 text-blue-500" size={20} />
              Test Details
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Which test do you need? *</label>
                {preSelectedTest ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">{preSelectedTest.name}</h4>
                      <p className="text-xs text-blue-600 mt-0.5">{preSelectedTest.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="block font-black text-xl text-blue-700">₹{preSelectedTest.price}</span>
                      {preSelectedTest.originalPrice && <span className="text-xs text-blue-400 line-through">₹{preSelectedTest.originalPrice}</span>}
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={formData.testName}
                      onChange={(e) => setFormData({...formData, testName: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.testName ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                      placeholder="e.g. Complete Blood Count, Thyroid Profile, etc."
                    />
                    {errors.testName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.testName}</p>}
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Do you have a doctor's prescription for this test?</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="prescription"
                      value="Yes"
                      checked={formData.doctorPrescription === "Yes"}
                      onChange={(e) => setFormData({...formData, doctorPrescription: e.target.value})}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="prescription"
                      value="No"
                      checked={formData.doctorPrescription === "No"}
                      onChange={(e) => setFormData({...formData, doctorPrescription: e.target.value})}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Patient Info */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-2">
              <User className="mr-2 text-[var(--color-brand-green)]" size={20} />
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none transition-all`}
                  placeholder="Enter patient full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  min="1" max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.age ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none transition-all`}
                  placeholder="Years"
                />
                {errors.age && <p className="text-red-500 text-xs mt-1 font-medium">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Gender *</label>
                <div className="flex items-center space-x-4 h-12">
                  {["Male", "Female", "Other"].map(g => (
                    <label key={g} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="w-4 h-4 text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]"
                      />
                      <span className="text-sm font-medium text-gray-700">{g}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="text-red-500 text-xs -mt-1 font-medium">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number *</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-medium">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.mobile ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none transition-all`}
                    placeholder="Enter 10-digit number"
                  />
                </div>
                {errors.mobile && <p className="text-red-500 text-xs mt-1 font-medium">{errors.mobile}</p>}
              </div>
            </div>
          </section>

          {/* Section 3: Collection Address */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-2">
              <MapPin className="mr-2 text-rose-500" size={20} />
              Home Collection Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Complete Address *</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none`}
                  placeholder="House No, Street Name, Landmark, Locality"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.pincode ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-rose-500 outline-none transition-all`}
                  placeholder="e.g. 282005"
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pincode}</p>}
              </div>
              
              <div className="flex items-end">
                 <div className="bg-orange-50 text-orange-700 text-xs px-3 py-2.5 rounded-lg border border-orange-100 w-full font-medium flex items-start mt-4 sm:mt-0">
                   <AlertCircle size={14} className="mr-1.5 shrink-0 mt-0.5" />
                   Available in Agra city limits only.
                 </div>
              </div>
            </div>
          </section>

          {/* Section 4: Collection Time */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-2">
              <Calendar className="mr-2 text-blue-500" size={20} />
              Collection Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Date *</label>
                <input
                  type="date"
                  min={today}
                  max={maxDate}
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.date ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1 font-medium">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Time Slot *</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.time ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm bg-white cursor-pointer`}
                >
                  <option value="" disabled>Select available time</option>
                  <option>06:30 AM - 08:00 AM (Fasting)</option>
                  <option>08:00 AM - 10:00 AM (Fasting)</option>
                  <option>10:00 AM - 12:00 PM</option>
                  <option>12:00 PM - 02:00 PM</option>
                  <option>02:00 PM - 04:00 PM</option>
                  <option>04:00 PM - 06:00 PM</option>
                </select>
                {errors.time && <p className="text-red-500 text-xs mt-1 font-medium">{errors.time}</p>}
              </div>
            </div>
          </section>

          {/* Error Banner */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-sm font-bold text-red-800">Please fix the errors above to continue</h4>
                <p className="text-xs text-red-600 mt-1">Some fields in the form are incomplete.</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <Smartphone size={22} />
            <span className="text-lg">Confirm Test via WhatsApp →</span>
          </button>
          <p className="text-center text-xs text-gray-400 mt-4 font-medium flex items-center justify-center">
            <ShieldCheck size={14} className="mr-1" />
            Your details are secure and only sent to Wellcare Pharmacy's verified WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function BookTestPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-16">
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading Booking Form...</div>}>
           <BookTestForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
