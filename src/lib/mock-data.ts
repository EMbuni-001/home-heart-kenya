export type Tier = "Assistant" | "Intermediate" | "Professional";
export type Service = "Caregiving" | "Physiotherapy" | "Counseling";

export interface Provider {
  id: string;
  name: string;
  service: Service;
  tier: Tier;
  rate: number; // KES / hour
  rating: number;
  reviews: number;
  shift: "Day" | "Night" | "Flexible";
  location: string;
  bio: string;
  specialties: string[];
  avatar: string;
}

const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffd7c2,ffe2b0,c8e6c9,b3e5fc,d1c4e9`;

export const providers: Provider[] = [
  { id: "p1", name: "Wanjiru Kamau", service: "Caregiving", tier: "Professional", rate: 650, rating: 4.9, reviews: 124, shift: "Day", location: "Nairobi, Kilimani", bio: "12 years caring for seniors with diabetes & mobility needs.", specialties: ["Feeding", "Bathing", "Medication"], avatar: avatar("Wanjiru") },
  { id: "p2", name: "David Otieno", service: "Physiotherapy", tier: "Professional", rate: 1400, rating: 4.8, reviews: 87, shift: "Flexible", location: "Kisumu CBD", bio: "Licensed physiotherapist focused on stroke recovery.", specialties: ["Stroke", "Joint mobility", "Post-op"], avatar: avatar("David") },
  { id: "p3", name: "Amina Hassan", service: "Counseling", tier: "Intermediate", rate: 900, rating: 4.7, reviews: 56, shift: "Day", location: "Mombasa, Nyali", bio: "Psychosocial support for grief, loneliness & dementia families.", specialties: ["Grief", "Family", "Dementia"], avatar: avatar("Amina") },
  { id: "p4", name: "Peter Mwangi", service: "Caregiving", tier: "Assistant", rate: 350, rating: 4.5, reviews: 31, shift: "Night", location: "Nakuru", bio: "Night-shift companion care, light cleaning & meal prep.", specialties: ["Cleaning", "Companionship"], avatar: avatar("Peter") },
  { id: "p5", name: "Grace Achieng", service: "Physiotherapy", tier: "Intermediate", rate: 1100, rating: 4.6, reviews: 42, shift: "Day", location: "Eldoret", bio: "Home-based mobility & balance rehabilitation.", specialties: ["Falls prevention", "Geriatric"], avatar: avatar("Grace") },
  { id: "p6", name: "Joseph Kiprop", service: "Counseling", tier: "Professional", rate: 1500, rating: 4.95, reviews: 98, shift: "Flexible", location: "Nairobi, Westlands", bio: "Clinical psychologist for seniors and primary caregivers.", specialties: ["Anxiety", "Depression"], avatar: avatar("Joseph") },
];

export interface Tip { id: string; title: string; condition: string; body: string; }
export const tips: Tip[] = [
  { id: "t1", title: "Managing Hypertension at Home", condition: "Hypertension", body: "Take readings twice daily. Reduce salt below 5g/day. Walk 20 min after meals." },
  { id: "t2", title: "Diabetes Daily Care", condition: "Diabetes", body: "Check sugar fasting & 2 hr post-meal. Inspect feet daily. Hydrate well." },
  { id: "t3", title: "Arthritis Pain Relief", condition: "Arthritis", body: "Warm compresses, gentle stretches, avoid prolonged sitting. Omega-3 helps." },
  { id: "t4", title: "Dementia Communication", condition: "Dementia", body: "Speak slowly, use simple sentences, maintain a calm routine, avoid arguing." },
  { id: "t5", title: "Preventing Falls", condition: "Mobility", body: "Remove loose rugs, light hallways at night, install grab bars in bathrooms." },
];

export interface Training {
  id: string;
  title: string;
  date: string;
  city: string;
  type: "Training" | "Free Clinic" | "Talk";
  forRoles: ("provider" | "family" | "senior")[];
  forServices: ("Caregiving" | "Physiotherapy" | "Counseling" | "General")[];
  minTier: "Assistant" | "Intermediate" | "Professional";
  capacity: number;
}
export const trainings: Training[] = [
  { id: "tr1", title: "Geriatric First Aid Certification", date: "2026-06-18", city: "Nairobi", type: "Training", forRoles: ["provider", "family"], forServices: ["Caregiving", "General"], minTier: "Assistant", capacity: 24 },
  { id: "tr2", title: "Free Eye & BP Screening — Aga Khan", date: "2026-06-22", city: "Mombasa", type: "Free Clinic", forRoles: ["senior", "family"], forServices: ["General"], minTier: "Assistant", capacity: 80 },
  { id: "tr3", title: "Living with Alzheimer's — Public Talk", date: "2026-07-02", city: "Kisumu", type: "Talk", forRoles: ["family", "senior", "provider"], forServices: ["Counseling", "General"], minTier: "Assistant", capacity: 120 },
  { id: "tr4", title: "Advanced Physiotherapy for Seniors", date: "2026-07-10", city: "Nairobi", type: "Training", forRoles: ["provider"], forServices: ["Physiotherapy"], minTier: "Intermediate", capacity: 18 },
];

export interface VitalReading { date: string; systolic: number; diastolic: number; sugar: number; }
export const vitals: VitalReading[] = [
  { date: "Mon", systolic: 132, diastolic: 84, sugar: 6.2 },
  { date: "Tue", systolic: 128, diastolic: 82, sugar: 5.9 },
  { date: "Wed", systolic: 135, diastolic: 86, sugar: 6.5 },
  { date: "Thu", systolic: 130, diastolic: 83, sugar: 6.0 },
  { date: "Fri", systolic: 126, diastolic: 80, sugar: 5.7 },
  { date: "Sat", systolic: 131, diastolic: 84, sugar: 6.1 },
  { date: "Sun", systolic: 129, diastolic: 81, sugar: 5.8 },
];

export interface Prescription { id: string; medicine: string; dose: string; frequency: string; prescriber: string; until: string; }
export const prescriptions: Prescription[] = [
  { id: "rx1", medicine: "Amlodipine", dose: "5 mg", frequency: "Once daily, morning", prescriber: "Dr. N. Mutua", until: "2026-09-01" },
  { id: "rx2", medicine: "Metformin", dose: "500 mg", frequency: "Twice daily with meals", prescriber: "Dr. L. Wairimu", until: "Ongoing" },
  { id: "rx3", medicine: "Atorvastatin", dose: "20 mg", frequency: "Once nightly", prescriber: "Dr. N. Mutua", until: "2026-12-15" },
];

export const emergencyHotlines = [
  { name: "Kenya Red Cross Ambulance", number: "1199" },
  { name: "St John Ambulance", number: "+254 721 225 285" },
  { name: "Police Emergency", number: "999" },
  { name: "GBV Hotline", number: "1195" },
];
