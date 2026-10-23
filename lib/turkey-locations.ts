export interface CityEntry {
  city: string;
  districts: string[];
}

export const TURKEY_CITIES: CityEntry[] = [
  {
    city: "Adana",
    districts: ["Seyhan", "Çukurova", "Yüreğir", "Sarıçam", "Ceyhan", "Kozan"],
  },
  {
    city: "İstanbul",
    districts: ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar", "Bakırköy", "Ataşehir", "Sarıyer", "Beyoğlu", "Maltepe"],
  },
  {
    city: "Ankara",
    districts: ["Çankaya", "Yenimahalle", "Keçiören", "Gölbaşı", "Etimesgut", "Mamak"],
  },
  {
    city: "İzmir",
    districts: ["Konak", "Karşıyaka", "Bornova", "Çeşme", "Urla", "Güzelbahçe", "Buca"],
  },
  {
    city: "Antalya",
    districts: ["Muratpaşa", "Konyaaltı", "Lara", "Alanya", "Kaş", "Manavgat"],
  },
  {
    city: "Bursa",
    districts: ["Nilüfer", "Osmangazi", "Mudanya", "Yıldırım", "İnegöl"],
  },
  {
    city: "Mersin",
    districts: ["Yenişehir", "Mezitli", "Toroslar", "Akdeniz", "Tarsus"],
  },
  {
    city: "Gaziantep",
    districts: ["Şehitkamil", "Şahinbey", "Oğuzeli"],
  },
  {
    city: "Muğla",
    districts: ["Bodrum", "Fethiye", "Marmaris", "Menteşe", "Datça"],
  },
  {
    city: "Eskişehir",
    districts: ["Tepebaşı", "Odunpazarı"],
  },
];
