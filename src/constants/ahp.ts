import { ref } from 'vue';

export const criteriaPairs= [
  ["Akreditasi", "Biaya"],
  ["Akreditasi", "Persentase Kelulusan"],
  ["Akreditasi", "Jarak"],
  ["Akreditasi", "Jumlah Jurusan"],
  ["Biaya", "Persentase Kelulusan"],
  ["Biaya", "Jarak"],
  ["Biaya", "Jumlah Jurusan"],
  ["Persentase Kelulusan", "Jarak"],
  ["Persentase Kelulusan", "Jumlah Jurusan"],
  ["Jarak", "Jumlah Jurusan"],
];

export const ahpScale = [
  { value: 9, label: "Ekstrem lebih penting" },
  { value: 7, label: "Sangat lebih penting" },
  { value: 5, label: "Lebih penting" },
  { value: 3, label: "Sedikit lebih penting" },
  { value: 1, label: "Sama penting" },
  { value: 1 / 3, label: "Sedikit kurang penting" },
  { value: 1 / 5, label: "Kurang penting" },
  { value: 1 / 7, label: "Sangat kurang penting" },
  { value: 1 / 9, label: "Ekstrem kurang penting" },
];

export const ahpStats = ref<{
  consistencyRatio: number,
  // consistencyIndex: number,
  // lambdaMax: number,
  // matrixSize: number
} | null>(null);

export function ahpLabel(value: number): string {
  switch (value) {
    case 1: return 'Mutlak kurang penting';
    case 2: return 'Sangat kurang penting';
    case 3: return 'Kurang penting';
    case 4: return 'Sedikit kurang penting';
    case 5: return 'Sama penting';
    case 6: return 'Sedikit lebih penting';
    case 7: return 'Lebih penting';
    case 8: return 'Sangat lebih penting';
    case 9: return 'Mutlak lebih penting';
    default: return `Skor: ${value}`;
  }
}

export const getColorClass = (kriteria:string) => {
  if (kriteria === "Akreditasi") return "text-red-600"
  if (kriteria === "Biaya") return "text-green-600"
  if (kriteria === "Jarak") return "text-yellow-600"
  if (kriteria === "Persentase Kelulusan") return "text-purple-600"
  if (kriteria === "Jumlah Jurusan") return "text-pink-600"
  return "text-gray-600" // default kalau ga cocok
}
