"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Calendar, Clock, MapPin, User, Stethoscope, AlertCircle, Smartphone, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { doctorsData } from "@/data/doctors";

export default function BookDoctorClient({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const doctor = doctorsData.find(d => d.slug === params.slug);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    email: "",
    date: "",
    time: "",
    visitType: "In-Clinic",
    symptoms: "",
    conditions: [] as string[],
    medications: "",
    allergies: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col pt-16 bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h1>
            <button onClick={() => router.push('/doctors')} className="text-[var(--color-brand-green)] font-semibold hover:underline">
              Return to Directory
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCheckboxChange = (condition: string) => {
    setFormData(prev => {
      if (condition === "None of the above") {
        return { ...prev, conditions: ["None of the above"] };
      }
      const newConditions = prev.conditions.filter(c => c !== "None of the above");
      return {
        ...prev,
        conditions: newConditions.includes(condition)
          ? newConditions.filter(c => c !== condition)
          : [...newConditions, condition]
      };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) newErrors.age = "Valid age (1-120) is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = "Valid 10-digit mobile number is required";
    if (!formData.date) newErrors.date = "Preferred date is required";
    if (!formData.time) newErrors.time = "Preferred time is required";
    if (!formData.symptoms.trim()) newErrors.symptoms = "Please describe your primary concern";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const message = `Hello Wellcare Pharmacy! I'd like to book an appointment.\n\n` +
      `👨‍⚕️ Doctor: ${doctor.name} (${doctor.specialty})\n` +
      `📅 Date: ${formData.date}\n` +
      `⏰ Time: ${formData.time}\n` +
      `🏥 Visit Type: ${formData.visitType}\n\n` +
      `👤 Patient Details:\n` +
      `Name: ${formData.name}\n` +
      `Age: ${formData.age} | Gender: ${formData.gender}\n` +
      `Mobile: ${formData.mobile}\n` +
      (formData.email ? `Email: ${formData.email}\n\n` : `\n`) +
      `🩺 Health Details:\n` +
      `Primary Concern: ${formData.symptoms}\n` +
      `Existing Conditions: ${formData.conditions.length > 0 ? formData.conditions.join(", ") : "None"}\n` +
      `Current Medications: ${formData.medications || "None"}\n` +
      `Known Allergies: ${formData.allergies || "None"}\n\n` +
      `Please confirm availability. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    
    // Optional: show a success toast before redirecting
    alert("Redirecting to WhatsApp to confirm your booking with Wellcare Pharmacy...");
    
    window.open(`https://wa.me/919897397532?text=${encodedMessage}`, "_blank");
  };

  // Get min date (today) and max date (+30 days)
  const today = new Date().toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 30);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <button onClick={() => router.push("/")} className="hover:text-[var(--color-brand-green)] transition-colors">Home</button>
          <ChevronRight size={14} />
          <button onClick={() => router.push("/doctors")} className="hover:text-[var(--color-brand-green)] transition-colors">Doctors</button>
          <ChevronRight size={14} />
          <span className="font-bold text-gray-900 truncate">Book Appointment</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[var(--color-brand-navy)] text-white p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-6">Book Appointment with {doctor.name}</h1>
            
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 overflow-hidden shrink-0 hidden sm:block">
                <img 
                  src={doctor.photo} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=E8F5F0&color=1D9E75`;
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">{doctor.name}</h3>
                <p className="text-emerald-300 font-semibold mb-2">{doctor.specialty}</p>
                <div className="flex items-center text-gray-300 text-sm mb-1">
                  <MapPin size={14} className="mr-1.5" />
                  {doctor.area}
                </div>
                <div className="flex items-start text-gray-300 text-sm">
                  <Clock size={14} className="mr-1.5 mt-0.5 shrink-0" />
                  <span className="max-w-xs">{doctor.timings[0]} - {doctor.timings[doctor.timings.length - 1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {/* Section 1: Patient Details */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-2">
                <User className="mr-2 text-[var(--color-brand-green)]" size={20} />
                Patient Details
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

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none transition-all"
                    placeholder="For booking confirmation"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Appointment Details */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-2">
                <Calendar className="mr-2 text-blue-500" size={20} />
                Appointment Details
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
                    {doctor.timings.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-red-500 text-xs mt-1 font-medium">{errors.time}</p>}
                </div>

                <div className="md:col-span-2 mt-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Type of Visit *</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className={`flex-1 border p-4 rounded-xl cursor-pointer flex items-center space-x-3 transition-all ${formData.visitType === 'In-Clinic' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                      <input 
                        type="radio" 
                        name="visitType" 
                        value="In-Clinic" 
                        checked={formData.visitType === 'In-Clinic'}
                        onChange={(e) => setFormData({...formData, visitType: e.target.value})}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                      />
                      <div>
                        <span className="block text-sm font-bold text-gray-900">In-Clinic Visit</span>
                        <span className="text-xs text-gray-500">Visit {doctor.name} at the clinic</span>
                      </div>
                    </label>
                    <label className={`flex-1 border p-4 rounded-xl cursor-pointer flex items-center space-x-3 transition-all ${formData.visitType === 'Home Visit' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                      <input 
                        type="radio" 
                        name="visitType" 
                        value="Home Visit" 
                        checked={formData.visitType === 'Home Visit'}
                        onChange={(e) => setFormData({...formData, visitType: e.target.value})}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                      />
                      <div>
                        <span className="block text-sm font-bold text-gray-900">Home Visit</span>
                        <span className="text-xs text-gray-500">Subject to doctor's approval</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Health Details */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-2">
                <Stethoscope className="mr-2 text-rose-500" size={20} />
                Health Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Primary Concern / Symptoms *</label>
                  <textarea
                    rows={3}
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.symptoms ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm resize-none`}
                    placeholder="Describe your main health concern or symptoms..."
                  />
                  {errors.symptoms && <p className="text-red-500 text-xs mt-1 font-medium">{errors.symptoms}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Existing Conditions</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["Diabetes", "Hypertension", "Thyroid", "Asthma", "Heart Disease", "None of the above"].map(condition => (
                      <label key={condition} className="flex items-start space-x-2 cursor-pointer bg-gray-50 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.conditions.includes(condition)}
                          onChange={() => handleCheckboxChange(condition)}
                          className="w-4 h-4 mt-0.5 text-rose-500 rounded focus:ring-rose-500"
                        />
                        <span className="text-xs font-medium text-gray-700 leading-tight">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Current Medications <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea
                    rows={2}
                    value={formData.medications}
                    onChange={(e) => setFormData({...formData, medications: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm resize-none"
                    placeholder="List any medicines you are currently taking"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Known Allergies <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                    placeholder="e.g. Penicillin, Peanuts"
                  />
                </div>
              </div>
            </section>

            {/* Error Banner */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-red-800">Please fix the errors above to continue</h4>
                  <p className="text-xs text-red-600 mt-1">Some required fields are missing or invalid.</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <Smartphone size={22} />
              <span className="text-lg">Confirm Booking via WhatsApp →</span>
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 font-medium flex items-center justify-center">
              <ShieldCheck size={14} className="mr-1" />
              Your details are secure and only sent to Wellcare Pharmacy's verified WhatsApp.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
