export type SimplifiedPatient = {
  patientId: number;
  level: number | null;
  symptom: string | null;
  annotationTriage?: string;
  appointmentDate?: string | Date | undefined;
  recentMedicine?: string;
  situation?: string;
  name: string;
  lastName?: string;
  allergy?: string;
  birthDate?: string | Date;
  cpf?: string;
  email?: string;
  phone?: string;
  recordsAsDoctor: any[];
};
