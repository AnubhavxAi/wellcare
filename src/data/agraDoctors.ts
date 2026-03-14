export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  illnessesTreated: string[];
  clinicLocation: string;
  timings: string;
  imageSrc: string;
}

export const agraDoctors: Doctor[] = [
  {
    "id": "d1",
    "name": "Dr. Arun Jain",
    "specialty": "Pediatrician",
    "illnessesTreated": [
      "Fever",
      "Cough",
      "Vaccination",
      "Child Nutrition"
    ],
    "clinicLocation": "Shahaganj, Agra",
    "timings": "11:00 AM - 02:30 PM, 07:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-arun-jain.jpg"
  },
  {
    "id": "d2",
    "name": "Dr. Himanshu Kumar Singh",
    "specialty": "ENT Specialist",
    "illnessesTreated": [
      "Sinusitis",
      "Ear Infection",
      "Tonsillitis",
      "Hearing Loss"
    ],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "10:30 AM - 02:00 PM, 06:30 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-himanshu-singh.jpg"
  },
  {
    "id": "d3",
    "name": "Dr. Himanshu Jindal",
    "specialty": "General Physician",
    "illnessesTreated": [
      "Viral Fever",
      "Hypertension",
      "Diabetes Management",
      "Infections"
    ],
    "clinicLocation": "Kamla Nagar, Agra",
    "timings": "10:00 AM - 02:00 PM, 06:00 PM - 08:30 PM",
    "imageSrc": "/doctors/dr-himanshu-jindal.jpg"
  },
  {
    "id": "d4",
    "name": "Dr. (Major) Durgesh Sharma",
    "specialty": "Diabetologist",
    "illnessesTreated": [
      "Diabetes",
      "Thyroid Disorders",
      "Obesity",
      "Hypertension"
    ],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "09:00 AM - 01:00 PM, 05:00 PM - 08:00 PM",
    "imageSrc": "/doctors/dr-durgesh-sharma.jpg"
  },
  {
    "id": "d5",
    "name": "Dr. Raghuvir Singh",
    "specialty": "Dermatologist",
    "illnessesTreated": [
      "Acne",
      "Eczema",
      "Psoriasis",
      "Skin Allergies"
    ],
    "clinicLocation": "Kamla Nagar, Agra",
    "timings": "11:00 AM - 03:00 PM, 06:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-raghuvir-singh.jpg"
  },
  {
    "id": "d6",
    "name": "Dr. Jyoti Garg",
    "specialty": "General Physician",
    "illnessesTreated": [
      "Fever",
      "Anemia",
      "Gastritis",
      "Respiratory Infections"
    ],
    "clinicLocation": "Sikandra, Agra",
    "timings": "10:00 AM - 01:30 PM, 05:30 PM - 08:00 PM",
    "imageSrc": "/doctors/dr-jyoti-garg.jpg"
  },
  {
    "id": "d7",
    "name": "Dr. Mukesh Kumar Baghel",
    "specialty": "Pediatrician",
    "illnessesTreated": [
      "Childhood Infections",
      "Vaccination",
      "Neonatal Care",
      "Growth Monitoring"
    ],
    "clinicLocation": "Tajganj, Agra",
    "timings": "10:30 AM - 02:00 PM, 06:30 PM - 09:30 PM",
    "imageSrc": "/doctors/dr-mukesh-baghel.jpg"
  },
  {
    "id": "d8",
    "name": "Dr. Gaurav Gangwar",
    "specialty": "Diabetologist",
    "illnessesTreated": [
      "Type 2 Diabetes",
      "Insulin Therapy",
      "Gestational Diabetes",
      "Thyroid"
    ],
    "clinicLocation": "Sikandra, Agra",
    "timings": "09:30 AM - 01:00 PM, 05:00 PM - 08:00 PM",
    "imageSrc": "/doctors/dr-gaurav-gangwar.jpg"
  },
  {
    "id": "d9",
    "name": "Dr. Amit Gupta",
    "specialty": "Dermatologist",
    "illnessesTreated": [
      "Skin Whitening",
      "Anti-Aging",
      "Chemical Peels",
      "Laser Hair Removal"
    ],
    "clinicLocation": "Kamla Nagar, Agra",
    "timings": "10:00 AM - 02:00 PM, 06:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-amit-gupta.jpg"
  },
  {
    "id": "d10",
    "name": "Dr. Pankaj Gupta",
    "specialty": "Diabetologist",
    "illnessesTreated": [
      "Diabetes Complications",
      "Metabolic Disorders",
      "Hypoglycemia",
      "Foot Care"
    ],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "10:00 AM - 02:00 PM, 05:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-pankaj-gupta.jpg"
  },
  {
    "id": "d11",
    "name": "Dr. Sameer Sharma",
    "specialty": "Pediatrician",
    "illnessesTreated": [
      "Pneumonia",
      "Diarrhea",
      "Malnutrition",
      "Asthma in Children"
    ],
    "clinicLocation": "Tajganj, Agra",
    "timings": "11:00 AM - 03:00 PM, 07:00 PM - 09:30 PM",
    "imageSrc": "/doctors/dr-sameer-sharma.jpg"
  },
  {
    "id": "d12",
    "name": "Dr. Ashok Katra",
    "specialty": "General Physician",
    "illnessesTreated": [
      "Dengue",
      "Malaria",
      "Typhoid",
      "Joint Pain"
    ],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "09:00 AM - 01:00 PM, 06:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-ashok-katra.jpg"
  },
  {
    "id": "d13",
    "name": "Dr. Rahul Pengoria",
    "specialty": "Pediatrician",
    "illnessesTreated": [
      "Newborn Care",
      "Pediatric Allergy",
      "Feeding Problems",
      "Infections"
    ],
    "clinicLocation": "Tajganj, Agra",
    "timings": "10:00 AM - 01:30 PM, 05:00 PM - 08:30 PM",
    "imageSrc": "/doctors/dr-rahul-pengoria.jpg"
  },
  {
    "id": "d14",
    "name": "Dr. Navendra Singh",
    "specialty": "General Physician",
    "illnessesTreated": [
      "Back Pain",
      "Migraine",
      "Abdominal Pain",
      "Seasonal Flu"
    ],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "10:30 AM - 02:30 PM, 06:30 PM - 09:30 PM",
    "imageSrc": "/doctors/dr-navendra-singh.jpg"
  },
  {
    "id": "d15",
    "name": "Dr. Ashwarya Gupta",
    "specialty": "Diabetologist",
    "illnessesTreated": [
      "Endocrine Disorders",
      "Diabetes Mellitus",
      "Weight Management",
      "Hormonal Imbalance"
    ],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM",
    "imageSrc": "/doctors/dr-ashwarya-gupta.jpg"
  },
  {
    "id": "d16",
    "name": "Dr. Himanshu Yadav",
    "specialty": "General Surgeon",
    "illnessesTreated": [
      "Hernia",
      "Appendicitis",
      "Gallstones",
      "Wound Care"
    ],
    "clinicLocation": "Tajganj, Agra",
    "timings": "11:00 AM - 03:00 PM, 07:00 PM - 10:00 PM",
    "imageSrc": "/doctors/dr-himanshu-yadav.jpg"
  },
  {
    "id": "d17",
    "name": "Dr. Ashish Gupta",
    "specialty": "Dentist",
    "illnessesTreated": [
      "Tooth Extraction",
      "Dental Implants",
      "Cavity Filling",
      "Scaling"
    ],
    "clinicLocation": "Khandari, Agra",
    "timings": "10:00 AM - 02:00 PM, 05:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-ashish-gupta.jpg"
  },
  {
    "id": "d18",
    "name": "Dr. Sumit Kumar Agarwal",
    "specialty": "Dentist",
    "illnessesTreated": [
      "Gum Surgery",
      "Dental Pain",
      "Bleeding Gums",
      "Orthodontic Aligners"
    ],
    "clinicLocation": "Kamla Nagar, Agra",
    "timings": "10:00 AM - 02:00 PM, 05:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-sumit-agarwal.jpg"
  }
];