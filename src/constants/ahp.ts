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

// export const ahpScale = [
//   { value: 9, label: "Ekstrem lebih penting" },
//   { value: 7, label: "Sangat lebih penting" },
//   { value: 5, label: "Lebih penting" },
//   { value: 3, label: "Sedikit lebih penting" },
//   { value: 1, label: "Sama penting" },
//   { value: 1 / 3, label: "Sedikit kurang penting" },
//   { value: 1 / 5, label: "Kurang penting" },
//   { value: 1 / 7, label: "Sangat kurang penting" },
//   { value: 1 / 9, label: "Ekstrem kurang penting" },
// ];

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
  // consistencyIndex: number,
  // lambdaMax: number,
  // matrixSize: number
} | null>(null);

// export function ahpLabel(value: number): string {
//   switch (value) {
//     case 1: return 'Mutlak kurang penting';
//     case 2: return 'Sangat kurang penting';
//     case 3: return 'Kurang penting';
//     case 4: return 'Sedikit kurang penting';
//     case 5: return 'Sama penting';
//     case 6: return 'Sedikit lebih penting';
//     case 7: return 'Lebih penting';
//     case 8: return 'Sangat lebih penting';
//     case 9: return 'Mutlak lebih penting';
//     default: return `Skor: ${value}`;
//   }
// }

// export const getColorClass = (kriteria:string) => {
//   if (kriteria === "Akreditasi") return "text-red-600"
//   if (kriteria === "Biaya") return "text-green-600"
//   if (kriteria === "Jarak") return "text-yellow-600"
//   if (kriteria === "Persentase Kelulusan") return "text-purple-600"
//   if (kriteria === "Jumlah Jurusan") return "text-pink-600"
//   return "text-gray-600" // default kalau ga cocok
// }

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
