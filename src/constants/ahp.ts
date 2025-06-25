import { ref } from 'vue';

export const criteriaPairs= [
  ["akreditasi", "biaya"],
  ["akreditasi", "tingkatKeterimaan"],
  ["akreditasi", "jarak"],
  ["akreditasi", "jumlahJurusan"],
  ["biaya", "tingkatKeterimaan"],
  ["biaya", "jarak"],
  ["biaya", "jumlahJurusan"],
  ["tingkatKeterimaan", "jarak"],
  ["tingkatKeterimaan", "jumlahJurusan"],
  ["jarak", "jumlahJurusan"],
];

export const ahpScale = [
  { value: 1, label: 'Sama penting (1)' },
  { value: 2, label: 'Antara 1 dan 3 (2)' },
  { value: 3, label: 'Sedikit lebih penting (3)' },
  { value: 4, label: 'Antara 3 dan 5 (4)' },
  { value: 5, label: 'Lebih penting (5)' },
  { value: 6, label: 'Antara 5 dan 7 (6)' },
  { value: 7, label: 'Jauh lebih penting (7)' },
  { value: 8, label: 'Antara 7 dan 9 (8)' },
  { value: 9, label: 'Ekstrem penting (9)' }
];

export const ahpStats = ref<{
  consistencyRatio: number,
} | null>(null);
export interface Criterion {
  id: number;
  label: string;
  value: string;
}

export const criteria: Criterion[] = [
  { id: 1, label: 'Akreditasi', value: 'akreditasi' },
  { id: 2, label: 'Biaya', value: 'biaya' },
  { id: 3, label: 'Jarak', value: 'jarak' },
  { id: 4, label: 'Jumlah Jurusan', value: 'jumlahJurusan' },
  { id: 5, label: 'Tingkat Keketatan (Semakin ketat semakin baik)', value: 'tingkatKeterimaan' },
]
