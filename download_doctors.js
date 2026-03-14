const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const data = [
  {
    "id": "d1",
    "name": "Dr. Arun Jain",
    "specialty": "Pediatrician",
    "illnessesTreated": ["Fever", "Cough", "Vaccination", "Child Nutrition"],
    "clinicLocation": "Shahaganj, Agra",
    "timings": "11:00 AM - 02:30 PM, 07:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-arun-jain.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-arun-jain-pediatrician-agra-13d36a73-2e6f-4de3-8f2f-0e5106105630.jpg"
  },
  {
    "id": "d2",
    "name": "Dr. Himanshu Kumar Singh",
    "specialty": "ENT Specialist",
    "illnessesTreated": ["Sinusitis", "Ear Infection", "Tonsillitis", "Hearing Loss"],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "10:30 AM - 02:00 PM, 06:30 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-himanshu-singh.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-himanshu-kumar-singh-ent-specialist-agra-20190520.jpg"
  },
  {
    "id": "d3",
    "name": "Dr. Himanshu Jindal",
    "specialty": "General Physician",
    "illnessesTreated": ["Viral Fever", "Hypertension", "Diabetes Management", "Infections"],
    "clinicLocation": "Kamla Nagar, Agra",
    "timings": "10:00 AM - 02:00 PM, 06:00 PM - 08:30 PM",
    "imageSrc": "/doctors/dr-himanshu-jindal.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-himanshu-jindal-general-physician-agra.jpg"
  },
  {
    "id": "d4",
    "name": "Dr. (Major) Durgesh Sharma",
    "specialty": "Diabetologist",
    "illnessesTreated": ["Diabetes", "Thyroid Disorders", "Obesity", "Hypertension"],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "09:00 AM - 01:00 PM, 05:00 PM - 08:00 PM",
    "imageSrc": "/doctors/dr-durgesh-sharma.jpg",
    "sourceImageUrl": "https://images.jdmagicbox.com/comp/agra/m9/0562px562.x562.180205163152.t2m9/catalogue/dr-major-durgesh-sharma-agra-ho-agra-diabetologist-doctors-2e6u4b4.jpg"
  },
  {
    "id": "d5",
    "name": "Dr. Raghuvir Singh",
    "specialty": "Dermatologist",
    "illnessesTreated": ["Acne", "Eczema", "Psoriasis", "Skin Allergies"],
    "clinicLocation": "Kamla Nagar, Agra",
    "timings": "11:00 AM - 03:00 PM, 06:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-raghuvir-singh.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-raghuvir-singh-dermatologist-agra.jpg"
  },
  {
    "id": "d6",
    "name": "Dr. Jyoti Garg",
    "specialty": "General Physician",
    "illnessesTreated": ["Fever", "Anemia", "Gastritis", "Respiratory Infections"],
    "clinicLocation": "Sikandra, Agra",
    "timings": "10:00 AM - 01:30 PM, 05:30 PM - 08:00 PM",
    "imageSrc": "/doctors/dr-jyoti-garg.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-jyoti-garg-general-physician-agra.jpg"
  },
  {
    "id": "d7",
    "name": "Dr. Mukesh Kumar Baghel",
    "specialty": "Pediatrician",
    "illnessesTreated": ["Childhood Infections", "Vaccination", "Neonatal Care", "Growth Monitoring"],
    "clinicLocation": "Tajganj, Agra",
    "timings": "10:30 AM - 02:00 PM, 06:30 PM - 09:30 PM",
    "imageSrc": "/doctors/dr-mukesh-baghel.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-mukesh-kumar-baghel-pediatrician-agra.jpg"
  },
  {
    "id": "d8",
    "name": "Dr. Gaurav Gangwar",
    "specialty": "Diabetologist",
    "illnessesTreated": ["Type 2 Diabetes", "Insulin Therapy", "Gestational Diabetes", "Thyroid"],
    "clinicLocation": "Sikandra, Agra",
    "timings": "09:30 AM - 01:00 PM, 05:00 PM - 08:00 PM",
    "imageSrc": "/doctors/dr-gaurav-gangwar.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-gaurav-gangwar-diabetologist-agra.jpg"
  },
  {
    "id": "d9",
    "name": "Dr. Amit Gupta",
    "specialty": "Dermatologist",
    "illnessesTreated": ["Skin Whitening", "Anti-Aging", "Chemical Peels", "Laser Hair Removal"],
    "clinicLocation": "Kamla Nagar, Agra",
    "timings": "10:00 AM - 02:00 PM, 06:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-amit-gupta.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-amit-gupta-dermatologist-agra.jpg"
  },
  {
    "id": "d10",
    "name": "Dr. Pankaj Gupta",
    "specialty": "Diabetologist",
    "illnessesTreated": ["Diabetes Complications", "Metabolic Disorders", "Hypoglycemia", "Foot Care"],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "10:00 AM - 02:00 PM, 05:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-pankaj-gupta.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-pankaj-gupta-diabetologist-agra.jpg"
  },
  {
    "id": "d11",
    "name": "Dr. Sameer Sharma",
    "specialty": "Pediatrician",
    "illnessesTreated": ["Pneumonia", "Diarrhea", "Malnutrition", "Asthma in Children"],
    "clinicLocation": "Tajganj, Agra",
    "timings": "11:00 AM - 03:00 PM, 07:00 PM - 09:30 PM",
    "imageSrc": "/doctors/dr-sameer-sharma.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-sameer-sharma-pediatrician-agra.jpg"
  },
  {
    "id": "d12",
    "name": "Dr. Ashok Katra",
    "specialty": "General Physician",
    "illnessesTreated": ["Dengue", "Malaria", "Typhoid", "Joint Pain"],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "09:00 AM - 01:00 PM, 06:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-ashok-katra.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-ashok-katra-general-physician-agra.jpg"
  },
  {
    "id": "d13",
    "name": "Dr. Rahul Pengoria",
    "specialty": "Pediatrician",
    "illnessesTreated": ["Newborn Care", "Pediatric Allergy", "Feeding Problems", "Infections"],
    "clinicLocation": "Tajganj, Agra",
    "timings": "10:00 AM - 01:30 PM, 05:00 PM - 08:30 PM",
    "imageSrc": "/doctors/dr-rahul-pengoria.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-rahul-pengoria-pediatrician-agra.jpg"
  },
  {
    "id": "d14",
    "name": "Dr. Navendra Singh",
    "specialty": "General Physician",
    "illnessesTreated": ["Back Pain", "Migraine", "Abdominal Pain", "Seasonal Flu"],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "10:30 AM - 02:30 PM, 06:30 PM - 09:30 PM",
    "imageSrc": "/doctors/dr-navendra-singh.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-navendra-singh-general-physician-agra.jpg"
  },
  {
    "id": "d15",
    "name": "Dr. Ashwarya Gupta",
    "specialty": "Diabetologist",
    "illnessesTreated": ["Endocrine Disorders", "Diabetes Mellitus", "Weight Management", "Hormonal Imbalance"],
    "clinicLocation": "Arjun Nagar, Agra",
    "timings": "10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM",
    "imageSrc": "/doctors/dr-ashwarya-gupta.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-ashwarya-gupta-diabetologist-agra.jpg"
  },
  {
    "id": "d16",
    "name": "Dr. Himanshu Yadav",
    "specialty": "General Surgeon",
    "illnessesTreated": ["Hernia", "Appendicitis", "Gallstones", "Wound Care"],
    "clinicLocation": "Tajganj, Agra",
    "timings": "11:00 AM - 03:00 PM, 07:00 PM - 10:00 PM",
    "imageSrc": "/doctors/dr-himanshu-yadav.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-himanshu-yadav-general-surgeon-agra.jpg"
  },
  {
    "id": "d17",
    "name": "Dr. Ashish Gupta",
    "specialty": "Dentist",
    "illnessesTreated": ["Tooth Extraction", "Dental Implants", "Cavity Filling", "Scaling"],
    "clinicLocation": "Khandari, Agra",
    "timings": "10:00 AM - 02:00 PM, 05:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-ashish-gupta.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-ashish-gupta-dentist-agra.jpg"
  },
  {
    "id": "d18",
    "name": "Dr. Sumit Kumar Agarwal",
    "specialty": "Dentist",
    "illnessesTreated": ["Gum Surgery", "Dental Pain", "Bleeding Gums", "Orthodontic Aligners"],
    "clinicLocation": "Kamla Nagar, Agra",
    "timings": "10:00 AM - 02:00 PM, 05:00 PM - 09:00 PM",
    "imageSrc": "/doctors/dr-sumit-agarwal.jpg",
    "sourceImageUrl": "https://imagesx.practo.com/providers/dr-sumit-kumar-agarwal-dentist-agra.jpg"
  }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      } else if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error("Request Failed With a Status Code: " + res.statusCode));
      }
    }).on('error', reject);
  });
};

async function main() {
  const finalData = [];
  const publicDir = path.join(__dirname, 'public');
  
  for (const item of data) {
    const { sourceImageUrl, ...rest } = item;
    
    const destPath = path.join(publicDir, rest.imageSrc);
    try {
      console.log("Downloading " + sourceImageUrl + " to " + destPath);
      await downloadImage(sourceImageUrl, destPath);
    } catch(err) {
      console.error("Failed to download " + sourceImageUrl + ":", err);
    }
    finalData.push(rest);
  }

  let tsContent = "export interface Doctor {\\n  id: string;\\n  name: string;\\n  specialty: string;\\n  illnessesTreated: string[];\\n  clinicLocation: string;\\n  timings: string;\\n  imageSrc: string;\\n}\\n\\n";
  tsContent += "export const agraDoctors: Doctor[] = " + JSON.stringify(finalData, null, 2) + ";\\n";

  fs.writeFileSync(path.join(__dirname, 'src', 'data', 'agraDoctors.ts'), tsContent);
  console.log("Done!");
}

main();
