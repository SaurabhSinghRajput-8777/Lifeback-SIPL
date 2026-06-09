"use server";

import { revalidatePath } from "next/cache";
import { ClinicianRepository } from "./repositories/clinician.repository";

export async function addClinicalNote(formData: FormData) {
  const patientId = formData.get("patientId") as string;
  const clinicianId = formData.get("clinicianId") as string;
  const assessmentId = formData.get("assessmentId") as string | null;
  const title = formData.get("title") as string | null;
  const content = formData.get("content") as string;

  if (!patientId || !clinicianId || !content) {
    throw new Error("Missing required fields for clinical note.");
  }

  await ClinicianRepository.saveClinicalNote({
    patientId,
    clinicianId,
    assessmentId: assessmentId || undefined,
    title: title || undefined,
    content,
  });

  revalidatePath(`/clinician/patients/${patientId}`);
}
