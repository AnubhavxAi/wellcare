"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Activity, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { doctorsData, specialties } from "@/data/doctors";

interface DoctorDirectoryProps {
  limit?: number;
  hideFilters?: boolean;
}

export default function DoctorDirectory({ limit, hideFilters = false }: DoctorDirectoryProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");

  const filteredDoctors = useMemo(() => {
    let result = doctorsData.filter((doctor) => {
      const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        searchTerm === "" || 
        doctor.name.toLowerCase().includes(searchLower) ||
        doctor.specialty.toLowerCase().includes(searchLower) ||
        doctor.treats.some(ill => ill.toLowerCase().includes(searchLower));
        
      return matchesSpecialty && matchesSearch;
    });

    if (limit) {
      result = result.slice(0, limit);
    }
    return result;
  }, [searchTerm, selectedSpecialty, limit]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-100" id="doctors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-navy)] mb-4">
            {hideFilters ? "Our Top Doctors" : "Find Doctors in Agra"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Consult the best specialists in your area for your specific health concerns.
          </p>
        </div>

        {/* Search and Filter Controls */}
        {!hideFilters && (
          <div className="max-w-4xl mx-auto mb-12 flex flex-col space-y-6">
            <div className="relative w-full shadow-sm rounded-xl overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search doctors by name, specialty, or condition..."
                className="block w-full pl-11 pr-4 py-4 border-0 ring-1 ring-inset ring-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-inset focus:ring-[var(--color-brand-green)] sm:text-base sm:leading-6 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Specialty Pills Row */}
            <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide snap-x" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {specialties.map((specialty) => {
                const isActive = selectedSpecialty === specialty;
                return (
                  <button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`snap-center shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all border-2 ${
                      isActive
                        ? "bg-[#DCFCE7] border-[#16A34A] text-[#15803D]"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {specialty}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Doctor Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group"
              >
                {/* Visual Header / Banner */}
                <div className="h-20 bg-gradient-to-r from-emerald-50 to-teal-50 relative border-b border-gray-50">
                  {selectedSpecialty !== "All" && doctor.specialty === selectedSpecialty && (
                    <div className="absolute top-4 left-4 bg-[var(--color-brand-green)] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center">
                      <Stethoscope size={14} className="mr-1.5" />
                      Specialist Match
                    </div>
                  )}
                </div>
                
                {/* Avatar overlapping banner */}
                <div className="px-6 relative flex justify-between items-end -mt-10">
                   <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-gray-100 flex items-center justify-center transform group-hover:scale-105 transition-transform overflow-hidden shrink-0 z-10">
                       <img 
                          src={doctor.photo} 
                          alt={doctor.name} 
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=E8F5F0&color=1D9E75`;
                          }}
                        />
                   </div>
                   
                   <button 
                     onClick={() => router.push(`/book-doctor/${doctor.slug}`)}
                     className="bg-white border-2 border-[var(--color-brand-green)] text-[var(--color-brand-green)] hover:bg-green-50 font-bold px-4 py-2 rounded-xl text-sm shadow-sm transition-colors mb-1 active:scale-95"
                   >
                     Book Visit
                   </button>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-[var(--color-brand-navy)] mb-1 leading-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-[var(--color-brand-green)] font-semibold text-sm">
                      {doctor.specialty}
                    </p>
                  </div>

                  {/* Location & Details */}
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-start text-gray-600 text-sm">
                      <MapPin size={18} className="mr-2.5 text-gray-400 mt-0.5 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{doctor.area}</span>
                        <span className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate" title={doctor.timings.join(", ")}>
                          {doctor.timings[0]} - {doctor.timings[doctor.timings.length - 1]}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-start text-gray-600 text-sm">
                      <Activity size={18} className="mr-2.5 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs text-gray-400 block mb-1.5 uppercase tracking-wider font-bold">Treats</span>
                        <div className="flex flex-wrap gap-1.5">
                          {doctor.treats.slice(0, 3).map(illness => (
                            <span 
                              key={illness} 
                              className="text-[10px] px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-600 font-medium whitespace-nowrap"
                            >
                              {illness}
                            </span>
                          ))}
                          {doctor.treats.length > 3 && (
                            <span className="text-[10px] px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-600 font-medium">
                              +{doctor.treats.length - 3} more
                            </span>
                          )}
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
          <div className="text-center py-16 bg-white rounded-3xl mt-6 border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any specialists matching your current search criteria.</p>
            {!hideFilters && (
              <button 
                onClick={() => { setSearchTerm(""); setSelectedSpecialty("All"); }}
                className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* View All Button for Homepage */}
        {limit && hideFilters && (
          <div className="mt-10 sm:mt-12 text-center">
            <button
              onClick={() => router.push("/doctors")}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg active:scale-95"
            >
              <span>View All Doctors →</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
