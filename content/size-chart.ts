export type GarmentCategory =
  | "elbise"
  | "gomlek-bluz"
  | "pantolon-etek"
  | "triko"
  | "dis-giyim"
  | "aksesuar";

export interface SizeChartRow {
  size: "XS" | "S" | "M" | "L" | "XL" | "STD";
  bust: string;     // Göğüs (cm)
  waist: string;    // Bel (cm)
  hip: string;      // Basen (cm)
  length: string;   // Boy (cm)
  heightRange?: [number, number]; // Önerilen boy aralığı (cm)
  weightRange?: [number, number]; // Önerilen kilo aralığı (kg)
}

export interface CategorySizeChart {
  category: GarmentCategory;
  title: string;
  measurementNote: string;
  rows: SizeChartRow[];
}

export const sizeCharts: Record<GarmentCategory, CategorySizeChart> = {
  elbise: {
    category: "elbise",
    title: "Elbise Beden Tablosu",
    measurementNote:
      "Ölçüler doğrudan vücut ölçüleridir (cm). Ara bedendeyseniz dökümlü duruş için bir üst bedeni tercih edebilirsiniz.",
    rows: [
      { size: "XS", bust: "80–84", waist: "62–66", hip: "88–92", length: "126", heightRange: [155, 168], weightRange: [45, 53] },
      { size: "S", bust: "84–88", waist: "66–70", hip: "92–96", length: "128", heightRange: [158, 173], weightRange: [52, 60] },
      { size: "M", bust: "88–93", waist: "70–75", hip: "96–101", length: "130", heightRange: [160, 176], weightRange: [59, 67] },
      { size: "L", bust: "93–99", waist: "75–81", hip: "101–107", length: "132", heightRange: [162, 178], weightRange: [66, 75] },
      { size: "XL", bust: "99–105", waist: "81–88", hip: "107–113", length: "133", heightRange: [162, 180], weightRange: [74, 84] },
    ],
  },
  "gomlek-bluz": {
    category: "gomlek-bluz",
    title: "Gömlek & Bluz Beden Tablosu",
    measurementNote:
      "Göğüs ve bel ölçüleri cm cinsinden vücut ölçüsüdür. Boy ölçüsü omuz tepe noktasından etek ucuna kadardır.",
    rows: [
      { size: "XS", bust: "80–84", waist: "62–66", hip: "88–92", length: "64", heightRange: [155, 168], weightRange: [45, 53] },
      { size: "S", bust: "84–88", waist: "66–70", hip: "92–96", length: "66", heightRange: [158, 173], weightRange: [52, 60] },
      { size: "M", bust: "88–93", waist: "70–75", hip: "96–101", length: "68", heightRange: [160, 176], weightRange: [59, 67] },
      { size: "L", bust: "93–99", waist: "75–81", hip: "101–107", length: "70", heightRange: [162, 178], weightRange: [66, 75] },
      { size: "XL", bust: "99–105", waist: "81–88", hip: "107–113", length: "72", heightRange: [162, 180], weightRange: [74, 84] },
    ],
  },
  "pantolon-etek": {
    category: "pantolon-etek",
    title: "Pantolon & Etek Beden Tablosu",
    measurementNote:
      "Bel ve basen ölçüleri alt giyimde temel kriterdir. Yüksek bel kalıplarda belin en ince noktası baz alınmalıdır.",
    rows: [
      { size: "XS", bust: "80–84", waist: "62–65", hip: "88–92", length: "104", heightRange: [155, 168], weightRange: [45, 52] },
      { size: "S", bust: "84–88", waist: "66–69", hip: "92–96", length: "106", heightRange: [158, 173], weightRange: [51, 59] },
      { size: "M", bust: "88–93", waist: "70–74", hip: "96–101", length: "107", heightRange: [160, 176], weightRange: [58, 66] },
      { size: "L", bust: "93–99", waist: "75–80", hip: "101–107", length: "108", heightRange: [162, 178], weightRange: [65, 74] },
      { size: "XL", bust: "99–105", waist: "81–87", hip: "107–113", length: "109", heightRange: [162, 180], weightRange: [73, 83] },
    ],
  },
  triko: {
    category: "triko",
    title: "Triko Beden Tablosu",
    measurementNote:
      "Triko dokular esneklik payına sahiptir. Doğal lifli ürünlerde yıkama talimatına uyulması formun korunmasını sağlar.",
    rows: [
      { size: "XS", bust: "80–85", waist: "62–67", hip: "88–93", length: "58", heightRange: [155, 168], weightRange: [45, 54] },
      { size: "S", bust: "85–90", waist: "67–72", hip: "93–98", length: "60", heightRange: [158, 174], weightRange: [53, 61] },
      { size: "M", bust: "90–95", waist: "72–77", hip: "98–103", length: "62", heightRange: [160, 177], weightRange: [60, 68] },
      { size: "L", bust: "95–101", waist: "77–83", hip: "103–109", length: "64", heightRange: [162, 179], weightRange: [67, 76] },
      { size: "XL", bust: "101–107", waist: "83–89", hip: "109–115", length: "66", heightRange: [162, 180], weightRange: [75, 85] },
    ],
  },
  "dis-giyim": {
    category: "dis-giyim",
    title: "Dış Giyim Beden Tablosu",
    measurementNote:
      "Ceket, trençkot ve kaban kalıplarında iç katman (triko/gömlek) payı bırakılmıştır. Kendi bedeninizi seçebilirsiniz.",
    rows: [
      { size: "XS", bust: "82–86", waist: "64–68", hip: "90–94", length: "112", heightRange: [155, 168], weightRange: [45, 54] },
      { size: "S", bust: "86–90", waist: "68–72", hip: "94–98", length: "114", heightRange: [158, 174], weightRange: [53, 61] },
      { size: "M", bust: "90–95", waist: "72–77", hip: "98–103", length: "116", heightRange: [160, 177], weightRange: [60, 69] },
      { size: "L", bust: "95–101", waist: "77–83", hip: "103–109", length: "118", heightRange: [162, 179], weightRange: [68, 77] },
      { size: "XL", bust: "101–107", waist: "83–89", hip: "109–115", length: "120", heightRange: [162, 180], weightRange: [76, 86] },
    ],
  },
  aksesuar: {
    category: "aksesuar",
    title: "Aksesuar Ölçü Tablosu",
    measurementNote:
      "Çanta, şal ve kemer ürünlerimizde standart (STD) veya ürün açıklamasında belirtilen özel ebatlar geçerlidir.",
    rows: [
      { size: "STD", bust: "Standart", waist: "Ayarlanabilir (64–96)", hip: "Standart", length: "Ürün detayında belirtilir" },
    ],
  },
};

export function recommendSize(params: {
  heightCm: number;
  weightKg: number;
  fitPreference: "dar" | "normal" | "rahat";
  productFit: "dar" | "normal" | "oversize";
}): {
  recommended: "XS" | "S" | "M" | "L" | "XL";
  alternative?: "XS" | "S" | "M" | "L" | "XL";
  explanation: string;
} {
  const { heightCm, weightKg, fitPreference, productFit } = params;
  const sizes: Array<"XS" | "S" | "M" | "L" | "XL"> = ["XS", "S", "M", "L", "XL"];

  // BMI ve kilo bazlı temel indeks
  const heightM = Math.max(1.45, Math.min(1.95, heightCm / 100));
  const bmi = weightKg / (heightM * heightM);

  let index = 1; // varsayılan S
  if (weightKg < 52 || bmi < 18.8) {
    index = 0; // XS
  } else if (weightKg < 60 && bmi < 21.8) {
    index = 1; // S
  } else if (weightKg < 68 && bmi < 24.5) {
    index = 2; // M
  } else if (weightKg < 77 && bmi < 27.5) {
    index = 3; // L
  } else {
    index = 4; // XL
  }

  // Boy 174 cm üzerindeyse ve indeks XS/S ise boydan dolayı 1 kademe esnetme değerlendirmesi
  if (heightCm >= 175 && index < 2) {
    index += 1;
  }

  // Kullanıcının duruş tercihi ve ürün kalıbı etkileşimi
  if (fitPreference === "rahat" && productFit === "dar") {
    index = Math.min(4, index + 1);
  } else if (fitPreference === "dar" && productFit === "oversize") {
    index = Math.max(0, index - 1);
  }

  const recommended = sizes[index];
  const alternative =
    fitPreference === "rahat" && index < 4
      ? sizes[index + 1]
      : fitPreference === "dar" && index > 0
        ? sizes[index - 1]
        : undefined;

  const fitNote =
    productFit === "oversize"
      ? "Bu ürün rahat/oversize kalıptadır."
      : productFit === "dar"
        ? "Bu ürün vücuda oturan dar kalıptadır."
        : "Bu ürün tam (normal) kalıptadır.";

  return {
    recommended,
    alternative,
    explanation: `${heightCm} cm boy ve ${weightKg} kg ölçüleriniz ile "${fitPreference}" duruş tercihinize göre önerilen beden ${recommended}${
      alternative ? ` (alternatif: ${alternative})` : ""
    }. ${fitNote} Bu sonuç bir öneridir; kesin uyum için ölçü tablosunu inceleyebilirsiniz.`,
  };
}
