export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  location: string;
  illnessesTreated: string[];
}

export const commonIllnesses = [
  "Cold & Flu",
  "Fever",
  "Diabetes",
  "Skin Issues",
  "Child Health",
  "Stomach Pain",
  "Acne",
  "Skin Rash",
  "Hypertension",
  "Joint Pain"
];

export const doctorsData: Doctor[] = [
  {
    id: "1",
    name: "[Insert Doctor Name]",
    qualification: "[Insert Qualification]",
    location: "Arjun Nagar",
    illnessesTreated: ["Fever", "Diabetes", "Skin Rash", "Acne"]
  },
  {
    id: "2",
    name: "[Insert Doctor Name]",
    qualification: "[Insert Qualification]",
    location: "Sikandra",
    illnessesTreated: ["Cold & Flu", "Stomach Pain", "Joint Pain", "Fever"]
  },
  {
    id: "3",
    name: "[Insert Doctor Name]",
    qualification: "[Insert Qualification]",
    location: "Tajganj",
    illnessesTreated: ["Skin Issues", "Acne", "Skin Rash"]
  },
  {
    id: "4",
    name: "[Insert Doctor Name]",
    qualification: "[Insert Qualification]",
    location: "Kamla Nagar",
    illnessesTreated: ["Child Health", "Fever", "Cold & Flu"]
  },
  {
    id: "5",
    name: "[Insert Doctor Name]",
    qualification: "[Insert Qualification]",
    location: "Arjun Nagar",
    illnessesTreated: ["Hypertension", "Diabetes", "Heart Issues"]
  },
  {
    id: "6",
    name: "[Insert Doctor Name]",
    qualification: "[Insert Qualification]",
    location: "Sikandra",
    illnessesTreated: ["Child Health", "Skin Issues", "Stomach Pain"]
  }
];
