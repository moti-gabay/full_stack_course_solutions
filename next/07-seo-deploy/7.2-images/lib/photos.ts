import p10 from "@/public/photos/photo-10.jpg";
import p15 from "@/public/photos/photo-15.jpg";
import p28 from "@/public/photos/photo-28.jpg";
import p29 from "@/public/photos/photo-29.jpg";
import p37 from "@/public/photos/photo-37.jpg";
import p42 from "@/public/photos/photo-42.jpg";
import p48 from "@/public/photos/photo-48.jpg";

// ייבוא סטטי: Next קורא את הרוחב והגובה מהקובץ בזמן build,
// כך שאין צורך לכתוב width/height ידנית ואין layout shift.
export const photos = [
  { id: 10, src: p10, alt: "יער ליד אגם" },
  { id: 15, src: p15, alt: "נחל בין סלעים" },
  { id: 28, src: p28, alt: "שביל ביער" },
  { id: 29, src: p29, alt: "הרים בערפל" },
  { id: 37, src: p37, alt: "חוף ים" },
  { id: 42, src: p42, alt: "בית קפה" },
  { id: 48, src: p48, alt: "מחשב נייד על שולחן" },
];
