export interface Doctor {
  slug: string;
  name: string;
  specialty: string;
  area: string;
  timings: string[];
  treats: string[];
  photo: string;
}

export const doctorsData: Doctor[] = [
{
  slug: "dr-arun-jain",
  name: "Dr. Arun Jain",
  specialty: "Pediatrician",
  area: "Shahaganj, Agra",
  timings: ["11:00 AM","11:30 AM","12:00 PM","12:30 PM",
             "01:00 PM","01:30 PM","02:00 PM",
             "07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM"],
  treats: ["Fever","Cough","Vaccination","Child Nutrition"],
  photo: "/doctors/dr-arun-jain.jpg"
},
{
  slug: "dr-himanshu-kumar-singh",
  name: "Dr. Himanshu Kumar Singh",
  specialty: "ENT Specialist",
  area: "Arjun Nagar, Agra",
  timings: ["10:30 AM","11:00 AM","11:30 AM","12:00 PM",
             "12:30 PM","01:00 PM","01:30 PM","02:00 PM",
             "06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM"],
  treats: ["Sinusitis","Ear Infection","Tonsillitis","Hearing Loss"],
  photo: "/doctors/dr-himanshu-singh.jpg"
},
{
  slug: "dr-himanshu-jindal",
  name: "Dr. Himanshu Jindal",
  specialty: "General Physician",
  area: "Kamla Nagar, Agra",
  timings: ["10:00 AM","10:30 AM","11:00 AM","11:30 AM",
             "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM",
             "06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM"],
  treats: ["Viral Fever","Hypertension","Diabetes Management","Infections"],
  photo: "/doctors/dr-himanshu-jindal.jpg"
},
{
  slug: "dr-durgesh-sharma",
  name: "Dr. (Major) Durgesh Sharma",
  specialty: "Diabetologist",
  area: "Arjun Nagar, Agra",
  timings: ["09:00 AM","09:30 AM","10:00 AM","10:30 AM",
             "11:00 AM","11:30 AM","12:00 PM","12:30 PM","01:00 PM",
             "05:00 PM","05:30 PM","06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM"],
  treats: ["Diabetes","Thyroid Disorders","Obesity","Hypertension"],
  photo: "/doctors/dr-durgesh-sharma.jpg"
},
{
  slug: "dr-raghuvir-singh",
  name: "Dr. Raghuvir Singh",
  specialty: "Dermatologist",
  area: "Kamla Nagar, Agra",
  timings: ["11:00 AM","11:30 AM","12:00 PM","12:30 PM",
             "01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM",
             "06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM"],
  treats: ["Acne","Eczema","Psoriasis","Skin Allergies"],
  photo: "/doctors/dr-raghuvir-singh.jpg"
},
{
  slug: "dr-jyoti-garg",
  name: "Dr. Jyoti Garg",
  specialty: "General Physician",
  area: "Sikandra, Agra",
  timings: ["10:00 AM","10:30 AM","11:00 AM","11:30 AM",
             "12:00 PM","12:30 PM","01:00 PM","01:30 PM",
             "05:30 PM","06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM"],
  treats: ["Fever","Anemia","Gastritis","Respiratory Infections"],
  photo: "/doctors/dr-jyoti-garg.jpg"
},
{
  slug: "dr-mukesh-baghel",
  name: "Dr. Mukesh Kumar Baghel",
  specialty: "Pediatrician",
  area: "Tajganj, Agra",
  timings: ["10:30 AM","11:00 AM","11:30 AM","12:00 PM",
             "12:30 PM","01:00 PM","01:30 PM","02:00 PM",
             "06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM","09:30 PM"],
  treats: ["Childhood Infections","Vaccination","Neonatal Care","Growth Monitoring"],
  photo: "/doctors/dr-mukesh-baghel.jpg"
},
{
  slug: "dr-gaurav-gangwar",
  name: "Dr. Gaurav Gangwar",
  specialty: "Diabetologist",
  area: "Sikandra, Agra",
  timings: ["09:30 AM","10:00 AM","10:30 AM","11:00 AM",
             "11:30 AM","12:00 PM","12:30 PM","01:00 PM",
             "05:00 PM","05:30 PM","06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM"],
  treats: ["Type 2 Diabetes","Insulin Therapy","Gestational Diabetes","Thyroid"],
  photo: "/doctors/dr-gaurav-gangwar.jpg"
},
{
  slug: "dr-amit-gupta",
  name: "Dr. Amit Gupta",
  specialty: "Dermatologist",
  area: "Kamla Nagar, Agra",
  timings: ["10:00 AM","10:30 AM","11:00 AM","11:30 AM",
             "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM",
             "06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM"],
  treats: ["Skin Whitening","Anti-Aging","Chemical Peels","Laser Hair Removal"],
  photo: "/doctors/dr-amit-gupta.jpg"
},
{
  slug: "dr-pankaj-gupta",
  name: "Dr. Pankaj Gupta",
  specialty: "Diabetologist",
  area: "Arjun Nagar, Agra",
  timings: ["10:00 AM","10:30 AM","11:00 AM","11:30 AM",
             "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM",
             "05:00 PM","05:30 PM","06:00 PM","06:30 PM","07:00 PM","07:30 PM",
             "08:00 PM","08:30 PM","09:00 PM"],
  treats: ["Diabetes Complications","Metabolic Disorders","Hypoglycemia","Foot Care"],
  photo: "/doctors/dr-pankaj-gupta.jpg"
},
{
  slug: "dr-sameer-sharma",
  name: "Dr. Sameer Sharma",
  specialty: "Pediatrician",
  area: "Tajganj, Agra",
  timings: ["11:00 AM","11:30 AM","12:00 PM","12:30 PM",
             "01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM",
             "07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM","09:30 PM"],
  treats: ["Pneumonia","Diarrhea","Malnutrition","Asthma in Children"],
  photo: "/doctors/dr-sameer-sharma.jpg"
},
{
  slug: "dr-ashok-katra",
  name: "Dr. Ashok Katra",
  specialty: "General Physician",
  area: "Arjun Nagar, Agra",
  timings: ["09:00 AM","09:30 AM","10:00 AM","10:30 AM",
             "11:00 AM","11:30 AM","12:00 PM","12:30 PM","01:00 PM",
             "06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM"],
  treats: ["Dengue","Malaria","Typhoid","Joint Pain"],
  photo: "/doctors/dr-ashok-katra.jpg"
},
{
  slug: "dr-rahul-pengoria",
  name: "Dr. Rahul Pengoria",
  specialty: "Pediatrician",
  area: "Tajganj, Agra",
  timings: ["10:00 AM","10:30 AM","11:00 AM","11:30 AM",
             "12:00 PM","12:30 PM","01:00 PM","01:30 PM",
             "05:00 PM","05:30 PM","06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM"],
  treats: ["Newborn Care","Pediatric Allergy","Feeding Problems","Infections"],
  photo: "/doctors/dr-rahul-pengoria.jpg"
},
{
  slug: "dr-navendra-singh",
  name: "Dr. Navendra Singh",
  specialty: "General Physician",
  area: "Arjun Nagar, Agra",
  timings: ["10:30 AM","11:00 AM","11:30 AM","12:00 PM",
             "12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM",
             "06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM","09:30 PM"],
  treats: ["Back Pain","Migraine","Abdominal Pain","Seasonal Flu"],
  photo: "/doctors/dr-navendra-singh.jpg"
},
{
  slug: "dr-ashwarya-gupta",
  name: "Dr. Ashwarya Gupta",
  specialty: "Diabetologist",
  area: "Arjun Nagar, Agra",
  timings: ["10:00 AM","10:30 AM","11:00 AM","11:30 AM",
             "12:00 PM","12:30 PM","01:00 PM",
             "05:00 PM","05:30 PM","06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM"],
  treats: ["Endocrine Disorders","Diabetes Mellitus","Weight Management","Hormonal Imbalance"],
  photo: "/doctors/dr-ashwarya-gupta.jpg"
},
{
  slug: "dr-himanshu-yadav",
  name: "Dr. Himanshu Yadav",
  specialty: "General Surgeon",
  area: "Tajganj, Agra",
  timings: ["11:00 AM","11:30 AM","12:00 PM","12:30 PM",
             "01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM",
             "07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM","09:30 PM","10:00 PM"],
  treats: ["Hernia","Appendicitis","Gallstones","Wound Care"],
  photo: "/doctors/dr-himanshu-yadav.jpg"
},
{
  slug: "dr-ashish-gupta",
  name: "Dr. Ashish Gupta",
  specialty: "Dentist",
  area: "Khandari, Agra",
  timings: ["10:00 AM","10:30 AM","11:00 AM","11:30 AM",
             "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM",
             "05:00 PM","05:30 PM","06:00 PM","06:30 PM","07:00 PM","07:30 PM",
             "08:00 PM","08:30 PM","09:00 PM"],
  treats: ["Tooth Extraction","Dental Implants","Cavity Filling","Scaling"],
  photo: "/doctors/dr-ashish-gupta.jpg"
},
{
  slug: "dr-sumit-agarwal",
  name: "Dr. Sumit Kumar Agarwal",
  specialty: "Dentist",
  area: "Kamla Nagar, Agra",
  timings: ["10:00 AM","10:30 AM","11:00 AM","11:30 AM",
             "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM",
             "05:00 PM","05:30 PM","06:00 PM","06:30 PM","07:00 PM","07:30 PM",
             "08:00 PM","08:30 PM","09:00 PM"],
  treats: ["Gum Surgery","Dental Pain","Bleeding Gums","Orthodontic Aligners"],
  photo: "/doctors/dr-sumit-agarwal.jpg"
}
];

export const specialties = [
  "All",
  "General Physician",
  "Pediatrician",
  "Diabetologist",
  "Dermatologist",
  "ENT Specialist",
  "Dentist",
  "General Surgeon"
];
