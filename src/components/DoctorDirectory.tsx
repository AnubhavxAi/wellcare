"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Activity, Stethoscope, ChevronDown } from "lucide-react";
import { doctorsData as oldDoctorsData, commonIllnesses } from "@/data/doctorsData";
import { agraDoctors, Doctor as AgraDoctor } from "@/data/agraDoctors";

// Use agraDoctors dataset
const doctorsData = agraDoctors;

export default function DoctorDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIllness, setSelectedIllness] = useState<string>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter doctors based on search term and selected illness
  const filteredDoctors = useMemo(() => {
    return doctorsData.filter((doctor) => {
      // Check if selected illness matches
      const matchesIllness = selectedIllness === "All" || doctor.illnessesTreated.includes(selectedIllness);
      
      // Check search term against illnesses or location
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        searchTerm === "" || 
        doctor.clinicLocation.toLowerCase().includes(searchLower) ||
        doctor.illnessesTreated.some(ill => ill.toLowerCase().includes(searchLower));
        
      return matchesIllness && matchesSearch;
    });
  }, [searchTerm, selectedIllness]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" id="doctors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-navy)] mb-4">Agra Doctor Directory</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Find the best specialists in your area for your specific health concerns.</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="max-w-3xl mx-auto mb-12 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by illness, symptom, or location..."
              className="block w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] focus:bg-white transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-72">
            <button
              className="w-full flex items-center justify-between text-left px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] focus:bg-white transition-all shadow-sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="truncate flex-grow">
                {selectedIllness === "All" ? "Find doctors by illness or problem" : selectedIllness}
              </span>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 max-h-60 overflow-y-auto"
                >
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-green-50 hover:text-[var(--color-brand-green)] transition-colors text-sm font-medium"
                    onClick={() => { setSelectedIllness("All"); setIsDropdownOpen(false); }}
                  >
                    All Illnesses & Problems
                  </button>
                  {commonIllnesses.map(illness => (
                    <button
                      key={illness}
                      className="w-full text-left px-4 py-2 hover:bg-green-50 hover:text-[var(--color-brand-green)] transition-colors text-sm font-medium"
                      onClick={() => { setSelectedIllness(illness); setIsDropdownOpen(false); }}
                    >
                      {illness}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group"
              >
                {/* Visual Header / Banner */}
                <div className="h-20 bg-gradient-to-r from-blue-50 to-green-50 relative">
                  {/* Selected Illness Recommendation Badge */}
                  {selectedIllness !== "All" && doctor.illnessesTreated.includes(selectedIllness) && (
                    <div className="absolute top-4 left-4 bg-[var(--color-brand-green)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center">
                      <Stethoscope size={14} className="mr-1.5" />
                      Recommended for {selectedIllness}
                    </div>
                  )}
                </div>
                
                {/* Avatar overlapping banner */}
                <div className="px-6 relative flex justify-end">
                   <div className="absolute -top-12 left-6 w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-gray-100 flex items-center justify-center transform group-hover:scale-105 transition-transform overflow-hidden">
                      {doctor.imageSrc ? (
                        <img 
                          src={doctor.imageSrc} 
                          alt={doctor.name} 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 rounded-xl text-blue-600 flex items-center justify-center">
                           <span className="text-xl font-bold">+</span>
                        </div>
                      )}
                   </div>
                   
                   {/* Book button on right side */}
                   <button className="text-[var(--color-brand-green)] font-semibold text-sm hover:text-green-700 transition-colors mt-4">
                     Book Visit
                   </button>
                </div>

                {/* Card Content */}
                <div className="p-6 pt-6 flex flex-col flex-grow">
                  {/* Prominent Header Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[var(--color-brand-navy)] mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-[var(--color-brand-green)] font-medium text-sm">
                      {doctor.specialty}
                    </p>
                  </div>

                  {/* Location & Details */}
                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-start text-gray-600 text-sm">
                      <MapPin size={18} className="mr-2.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{doctor.clinicLocation}</span>
                        <span className="text-xs text-gray-500 mt-0.5">{doctor.timings}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start text-gray-600 text-sm">
                      <Activity size={18} className="mr-2.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-gray-400 block mb-1 uppercase tracking-wider font-bold">Treats</span>
                        <div className="flex flex-wrap gap-1.5">
                          {doctor.illnessesTreated.map(illness => (
                            <span 
                              key={illness} 
                              className={`text-xs px-2.5 py-1 rounded-full ${
                                illness === selectedIllness 
                                  ? 'bg-[var(--color-brand-green)] text-white font-bold shadow-sm' 
                                  : 'bg-[#1a9c51]/10 text-[#1a9c51] font-medium border border-[#1a9c51]/20'
                              }`}
                            >
                              {illness}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any specialists matching your current search criteria. Try clearing some filters.</p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedIllness("All"); }}
              className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
