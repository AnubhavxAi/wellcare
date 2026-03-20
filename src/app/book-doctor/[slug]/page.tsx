import React from "react";
import BookDoctorClient from "./BookDoctorClient";
import { doctorsData } from "@/data/doctors";

export function generateStaticParams() {
  return doctorsData.map((doctor) => ({
    slug: doctor.slug,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <BookDoctorClient params={resolvedParams} />;
}
