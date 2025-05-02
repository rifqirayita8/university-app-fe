import { ref } from 'vue';

export const criteriaPairs= [
  ["akreditasi", "biaya"],
  ["akreditasi", "passRate"],
  ["akreditasi", "jarak"],
  ["akreditasi", "jumlahJurusan"],
  ["biaya", "passRate"],
  ["biaya", "jarak"],
  ["biaya", "jumlahJurusan"],
  ["passRate", "jarak"],
  ["passRate", "jumlahJurusan"],
  ["jarak", "jumlahJurusan"]
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
  // consistencyIndex: number,
  // lambdaMax: number,
  // matrixSize: number
} | null>(null);

