import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Check,
  Info,
  MapPin,
  Sparkles,
  Sun,
  Moon,
  Home,
  Utensils,
  Car,
  Heart,
  PawPrint,
  Waves,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Flame,
  Plus,
  Minus,
  BedDouble,
  Bath,
  Wind,
  PartyPopper,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Compass,
  Trees
} from 'lucide-react';

// ==========================================
// 1. UPDATED PACKAGES & RATES CONFIGURATION
// ==========================================

const PACKAGE_CATEGORIES = [
  { id: 'all', label: 'All Packages' },
  { id: 'resort-tours', label: 'Day & Night Tours' },
  { id: 'overnight-exclusive', label: 'Overnight Exclusive' },
  { id: 'staycation', label: 'Staycation Rooms (Mon–Thu)' },
  { id: 'events', label: 'Events Booking' }
];

const PACKAGES_DATA = [
  // --- RESORT BOOKING: DAY & NIGHT TOURS (ANY DAY) ---
  {
    id: 'day-tour',
    category: 'resort-tours',
    categoryLabel: 'Resort Tour Package',
    name: 'Day Tour Package',
    shortName: 'Day Tour',
    duration: '9 Hours (8:00 AM – 5:00 PM)',
    checkIn: '8:00 AM',
    checkOut: '5:00 PM',
    minPax: 1,
    maxPax: 15,
    paxLabel: 'Up to 15 Base Pax',
    weekdayRate: 4500,
    weekendRate: 5000,
    monThuOnly: false,
    excessFeePerHead: 150,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Popular Daytime Escape',
    includedRooms: '1 Complimentary Overlooking Room (2 Double Beds, Private CR)',
    description:
      'Includes full access to the resort’s swimming pools, riverside balcony areas, kitchen, function space, and recreational facilities for a fun-filled daytime escape.',
    inclusions: [
      'Complimentary stay in Overlooking Room',
      'Full access to Swimming Pool Area',
      'Riverside Balcony & Garden Area access',
      'Recreational / Activities Area (Badminton, etc.)',
      'Kitchen & Function Space access',
      'Free On-site Parking & Pet-Friendly spaces'
    ]
  },
  {
    id: 'night-tour',
    category: 'resort-tours',
    categoryLabel: 'Resort Tour Package',
    name: 'Night Tour Package',
    shortName: 'Night Tour',
    duration: '11 Hours (7:00 PM – 6:00 AM)',
    checkIn: '7:00 PM',
    checkOut: '6:00 AM (Next Day)',
    minPax: 1,
    maxPax: 15,
    paxLabel: 'Up to 15 Base Pax',
    weekdayRate: 6999,
    weekendRate: 7500,
    monThuOnly: false,
    excessFeePerHead: 200,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Serene Evening Getaway',
    includedRooms: '1 Complimentary Overlooking Room (2 Double Beds, Private CR)',
    description:
      'Enjoy evening relaxation with warm ambient string lighting, peaceful riverside views, night swimming, and access to the resort’s amenities for a serene night getaway.',
    inclusions: [
      'Complimentary stay in Overlooking Room',
      'Night swimming with ambient pool lighting',
      'Riverside Balcony & Function Space access',
      'Recreational & Kitchen Area access',
      'Peaceful overnight breeze by Angat River',
      'Free On-site Parking'
    ]
  },

  // --- RESORT BOOKING: OVERNIGHT EXCLUSIVE PACKAGES (22 HRS, ANY DAY) ---
  {
    id: 'overnight-family',
    category: 'overnight-exclusive',
    categoryLabel: 'Overnight Exclusive (22 Hrs)',
    name: 'Family Overnight Package',
    shortName: 'Family Pkg (4-8 Pax)',
    duration: '22 Hours (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN (Next Day)',
    minPax: 4,
    maxPax: 8,
    paxLabel: '4–8 Pax',
    weekdayRate: 7999,
    weekendRate: 8999,
    monThuOnly: false,
    excessFeePerHead: 200,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Best for Families',
    includedRooms: 'Private Air-Conditioned Room Stay',
    description:
      '22-hour exclusive resort experience tailored for families of 4 to 8 guests. Enjoy full access to all resort facilities, private room accommodation, and extended leisure time.',
    inclusions: [
      '22 Hours exclusive access (2:00 PM – 12:00 NN)',
      'Private air-conditioned room accommodation',
      'Full access to Swimming Pool & Riverside Balcony',
      'Kitchen Area, Garden & Function Space access',
      'Recreational / Activities Area access',
      'On-site Parking & Pet-Friendly'
    ]
  },
  {
    id: 'overnight-barkada',
    category: 'overnight-exclusive',
    categoryLabel: 'Overnight Exclusive (22 Hrs)',
    name: 'Barkada Overnight Package',
    shortName: 'Barkada Pkg (9-15 Pax)',
    duration: '22 Hours (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN (Next Day)',
    minPax: 9,
    maxPax: 15,
    paxLabel: '9–15 Pax',
    weekdayRate: 10999,
    weekendRate: 11999,
    monThuOnly: false,
    excessFeePerHead: 200,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Barkada Favorite',
    includedRooms: 'Spacious Group Room Stay',
    description:
      'Designed for barkadas and medium groups of 9 to 15 guests looking for an unforgettable 22-hour riverside bonding experience with full resort access.',
    inclusions: [
      '22 Hours exclusive access (2:00 PM – 12:00 NN)',
      'Air-conditioned group room stay',
      'Day & Night Swimming Pool access',
      'Riverside Balcony, Function & Kitchen Area',
      'Recreational Court & Garden Area access',
      'On-site Parking'
    ]
  },
  {
    id: 'overnight-midgroup',
    category: 'overnight-exclusive',
    categoryLabel: 'Overnight Exclusive (22 Hrs)',
    name: 'Mid Group Overnight Package',
    shortName: 'Mid Group (16-20 Pax)',
    duration: '22 Hours (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN (Next Day)',
    minPax: 16,
    maxPax: 20,
    paxLabel: '16–20 Pax',
    weekdayRate: 13999,
    weekendRate: 14999,
    monThuOnly: false,
    excessFeePerHead: 200,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Includes 2 Large Rooms',
    includedRooms: 'Includes Barkada Room & Family Room',
    description:
      'Spacious 22-hour exclusive package for 16 to 20 guests, complete with both the Barkada Room and Family Room plus full access to all resort amenities.',
    inclusions: [
      'Includes BOTH Barkada Room & Family Room',
      '22 Hours exclusive resort access (2:00 PM – 12:00 NN)',
      'Full Swimming Pool & Riverside Balcony access',
      'Function Space, Kitchen & Garden Area',
      'Recreational / Activities Area access',
      'Free On-site Parking'
    ]
  },
  {
    id: 'overnight-wholeresort',
    category: 'overnight-exclusive',
    categoryLabel: 'Overnight Exclusive (22 Hrs)',
    name: 'Whole Resort Exclusive Package',
    shortName: 'Whole Resort (Up to 30 Pax)',
    duration: '22 Hours (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN (Next Day)',
    minPax: 20,
    maxPax: 30,
    paxLabel: 'Up to 30 Pax',
    weekdayRate: 15999,
    weekendRate: 16499,
    monThuOnly: false,
    excessFeePerHead: 200,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'All Resort Rooms Included',
    includedRooms: 'Includes ALL Resort Rooms (Overlooking, Family, Barkada & Cozy)',
    description:
      'The ultimate private resort takeover for up to 30 guests! Includes ALL 4 air-conditioned rooms at The Forts plus complete exclusive access to every amenity.',
    inclusions: [
      'Includes ALL Resort Rooms (Overlooking, Family, Barkada & Cozy)',
      'Up to 30 guests included in base rate',
      '22 Hours total privacy & exclusive access',
      'Swimming Pool, Riverside Balcony & Function Space',
      'Kitchen Area & Recreational Court access',
      'Generous On-site Parking & Pet-Friendly'
    ]
  },

  // --- STAYCATION BOOKING (MON-THURS & NON-HOLIDAYS ONLY, 22 HRS ROOMS) ---
  {
    id: 'staycation-overlooking',
    category: 'staycation',
    categoryLabel: 'Staycation 22-Hr Room (Mon–Thu Only)',
    name: 'Staycation: Overlooking Room',
    shortName: 'Overlooking Room (2-4 Pax)',
    duration: '22 Hours (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN (Next Day)',
    minPax: 2,
    maxPax: 4,
    paxLabel: '2–4 Pax',
    weekdayRate: 3000,
    weekendRate: null, // Mon-Thu & Non-Holidays only
    monThuOnly: true,
    excessFeePerHead: 200,
    gasIncluded: true, // Inclusive of Use of Kitchen Gas
    gasFeeOption: 0,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Mon–Thu Staycation',
    includedRooms: 'Overlooking Room (2 Double Beds, Private CR)',
    description:
      'Ideal for couples or small families seeking a peaceful weekday riverfront staycation. Includes 2 Double Beds, Private CR, Air-conditioning, and FREE use of Kitchen Gas.',
    inclusions: [
      '22 Hours room stay (Mon–Thurs & Non-Holidays)',
      '2 Double Beds (Air-conditioned)',
      'Private CR, shower, and sink',
      'INCLUSIVE of Use of Kitchen Gas (Free)',
      'Access to resort common areas & riverside balcony',
      'Direct scenic view of the Angat River'
    ]
  },
  {
    id: 'staycation-family',
    category: 'staycation',
    categoryLabel: 'Staycation 22-Hr Room (Mon–Thu Only)',
    name: 'Staycation: Family Room',
    shortName: 'Family Room (4-6 Pax)',
    duration: '22 Hours (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN (Next Day)',
    minPax: 4,
    maxPax: 6,
    paxLabel: '4–6 Pax',
    weekdayRate: 4000,
    weekendRate: null,
    monThuOnly: true,
    excessFeePerHead: 200,
    gasIncluded: true,
    gasFeeOption: 0,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Mon–Thu Staycation',
    includedRooms: 'Family Room (2 Double Beds + Single/Sofa, Private CR)',
    description:
      'Comfortable and spacious weekday staycation room for families or small groups of 4 to 6 guests. Features 2 Double Beds + Single/Sofa, Private CR, and free Kitchen Gas use.',
    inclusions: [
      '22 Hours room stay (Mon–Thurs & Non-Holidays)',
      '2 Double Beds + Single Mattress / Sofa (Air-conditioned)',
      'Private CR, shower, and sink',
      'INCLUSIVE of Use of Kitchen Gas (Free)',
      'Access to riverside balcony & resort facilities',
      'On-site Parking included'
    ]
  },
  {
    id: 'staycation-barkada',
    category: 'staycation',
    categoryLabel: 'Staycation 22-Hr Room (Mon–Thu Only)',
    name: 'Staycation: Barkada Room',
    shortName: 'Barkada Room (12-15 Pax)',
    duration: '22 Hours (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN (Next Day)',
    minPax: 12,
    maxPax: 15,
    paxLabel: '12–15 Pax',
    weekdayRate: 5000,
    weekendRate: null,
    monThuOnly: true,
    excessFeePerHead: 200,
    gasIncluded: true,
    gasFeeOption: 0,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Mon–Thu Group Staycation',
    includedRooms: 'Barkada Room (Bunk Beds, Sofa Bed, Private CR)',
    description:
      'Weekday group staycation for 12 to 15 guests! Appointed with 4 Single Bunk Beds, 1 Double Bunk Bed, 1 Queen Sofa Bed, Private CR, and inclusive of Kitchen Gas.',
    inclusions: [
      '22 Hours room stay (Mon–Thurs & Non-Holidays)',
      '4 Single Bunk Beds, 1 Double Bunk Bed & 1 Queen Sofa Bed',
      'Air-conditioned with Private CR, shower, and sink',
      'INCLUSIVE of Use of Kitchen Gas (Free)',
      'Access to riverside balcony & common areas',
      'Best value weekday group retreat'
    ]
  },
  {
    id: 'staycation-cozy',
    category: 'staycation',
    categoryLabel: 'Staycation 22-Hr Room (Mon–Thu Only)',
    name: 'Staycation: Cozy Room',
    shortName: 'Cozy Room (4 Pax)',
    duration: '22 Hours (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN (Next Day)',
    minPax: 1,
    maxPax: 4,
    paxLabel: '4 Pax',
    weekdayRate: 6000,
    weekendRate: null,
    monThuOnly: true,
    excessFeePerHead: 200,
    gasIncluded: true,
    gasFeeOption: 0,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Mon–Thu Staycation',
    includedRooms: 'Cozy Room (4 Single Mattresses, Common CR)',
    description:
      'Air-conditioned weekday staycation room for up to 4 guests with 4 Single Mattresses, access to Common CR, and inclusive of Kitchen Gas use.',
    inclusions: [
      '22 Hours room stay (Mon–Thurs & Non-Holidays)',
      '4 Single Mattresses (Air-conditioned)',
      'Access to Common CR / Shower Area',
      'INCLUSIVE of Use of Kitchen Gas (Free)',
      'Access to riverside balcony & common spaces',
      'On-site Parking'
    ]
  },

  // --- EVENTS BOOKING (FOR RESERVATIONS) ---
  {
    id: 'events-booking',
    category: 'events',
    categoryLabel: 'Events & Celebrations',
    name: 'Events & Special Celebrations Booking',
    shortName: 'Events Booking',
    duration: 'Custom Event Hours / Full Day',
    checkIn: 'Flexible (By Arrangement)',
    checkOut: 'Flexible (By Arrangement)',
    minPax: 20,
    maxPax: 100,
    paxLabel: 'Custom Capacity',
    weekdayRate: 0,
    weekendRate: 0,
    isEvent: true,
    monThuOnly: false,
    excessFeePerHead: 0,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Birthdays & Reunions',
    includedRooms: 'Customizable Function Space & Resort Rooms',
    description:
      'Ideal for birthdays, family reunions, baptisms, corporate team buildings, and milestone celebrations by the scenic Angat River.',
    inclusions: [
      'Dedicated Function Space & Open Garden Areas',
      'Scenic Riverside Balcony backdrop for photos',
      'Swimming Pool & Recreational Area access',
      'Kitchen Area access for catering or food prep',
      'Flexible room inclusions based on event size',
      'Direct coordination with The Forts Event Team'
    ]
  }
];

// ==========================================
// 2. OFFICIAL 4 ROOMS DATA (NO FAMILY DELUXE)
// ==========================================

const ROOMS_DATA = [
  {
    id: 'room-overlooking',
    packageId: 'staycation-overlooking',
    name: 'Overlooking Room',
    capacity: '2–4 Pax',
    staycationRate: 3000,
    tagline: 'Ideal for couples or small families with a direct view of the Angat River',
    beds: ['2 Double Beds'],
    cr: 'With Private CR, shower, and sink',
    hasPrivateCR: true,
    features: [
      'Air-conditioned room',
      '2 Double Beds',
      'With private CR, shower, and sink',
      'Complimentary room for Day & Night Tours',
      'Inclusive of Kitchen Gas on Mon–Thu Staycations'
    ],
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'room-family',
    packageId: 'staycation-family',
    name: 'Family Room',
    capacity: '4–6 Pax',
    staycationRate: 4000,
    tagline: 'Comfortable and spacious sanctuary for families and small groups',
    beds: ['2 Double Beds', '1 Single Mattress / Sofa'],
    cr: 'With Private CR, shower, and sink',
    hasPrivateCR: true,
    features: [
      'Air-conditioned room',
      '2 Double Beds + Single/Sofa',
      'With private CR, shower, and sink',
      'Included in Mid Group & Whole Resort Overnight Packages',
      'Inclusive of Kitchen Gas on Mon–Thu Staycations'
    ],
    image:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'room-barkada',
    packageId: 'staycation-barkada',
    name: 'Barkada Room',
    capacity: '12–15 Pax',
    staycationRate: 5000,
    tagline: 'Ideal for large groups, barkada outings, and family gatherings',
    beds: ['4 Single Bunk Beds', '1 Double Bunk Bed', '1 Queen Sofa Bed (floor)'],
    cr: 'With Private CR, shower, and sink',
    hasPrivateCR: true,
    features: [
      'Air-conditioned room',
      '4 Single Bunk Beds & 1 Double Bunk Bed',
      '1 Queen Sofa Bed (floor)',
      'With private CR, shower, and sink',
      'Included in Mid Group & Whole Resort Overnight Packages'
    ],
    image:
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'room-cozy',
    packageId: 'staycation-cozy',
    name: 'Cozy Room',
    capacity: '4 Pax',
    staycationRate: 6000,
    tagline: 'Simple, air-conditioned space for restful group stays',
    beds: ['4 Single Mattresses'],
    cr: 'Common CR (No private CR, shower, or sink inside)',
    hasPrivateCR: false,
    features: [
      'Air-conditioned room',
      '4 Single Mattresses',
      'Uses Common CR, shower, and sink',
      'Included in Whole Resort (Up to 30 Pax) Package',
      'Inclusive of Kitchen Gas on Mon–Thu Staycations'
    ],
    image:
      'https://images.unsplash.com/photo-1540518614846-7ede433c457?auto=format&fit=crop&w=900&q=80'
  }
];

// ==========================================
// 3. PHILIPPINE HOLIDAYS (2026 & 2027)
// ==========================================

const DEFAULT_PH_HOLIDAYS = {
  '2026-01-01': "New Year's Day",
  '2026-02-17': 'Chinese New Year',
  '2026-02-25': 'EDSA People Power Anniversary',
  '2026-04-02': 'Maundy Thursday',
  '2026-04-03': 'Good Friday',
  '2026-04-04': 'Black Saturday',
  '2026-04-09': 'Araw ng Kagitingan',
  '2026-05-01': 'Labor Day',
  '2026-06-12': 'Independence Day',
  '2026-08-21': 'Ninoy Aquino Day',
  '2026-08-31': 'National Heroes Day',
  '2026-11-01': "All Saints' Day",
  '2026-11-02': "All Souls' Day",
  '2026-11-30': 'Bonifacio Day',
  '2026-12-08': 'Feast of the Immaculate Conception',
  '2026-12-24': 'Christmas Eve',
  '2026-12-25': 'Christmas Day',
  '2026-12-30': 'Rizal Day',
  '2026-12-31': 'Last Day of the Year',
  '2027-01-01': "New Year's Day",
  '2027-02-06': 'Chinese New Year',
  '2027-03-25': 'Maundy Thursday',
  '2027-03-26': 'Good Friday',
  '2027-03-27': 'Black Saturday',
  '2027-04-09': 'Araw ng Kagitingan',
  '2027-05-01': 'Labor Day',
  '2027-06-12': 'Independence Day',
  '2027-08-21': 'Ninoy Aquino Day',
  '2027-08-30': 'National Heroes Day',
  '2027-11-01': "All Saints' Day",
  '2027-11-30': 'Bonifacio Day',
  '2027-12-08': 'Feast of the Immaculate Conception',
  '2027-12-25': 'Christmas Day',
  '2027-12-30': 'Rizal Day'
};

// ==========================================
// 4. OFFICIAL FAQS DATA
// ==========================================

const FAQS_DATA = [
  {
    question: 'What are your check-in and check-out times?',
    answer:
      'For Day Tours, arrival is from 8:00 AM and departure is around 5:00 PM. For Night Tours, check-in starts at 7:00 PM and ends by 6:00 AM the next day. For Overnight Exclusive Packages and 22-Hour Staycation Rooms, check-in is at 2:00 PM while check-out is at 12:00 NN the next day.'
  },
  {
    question: 'How do I book a tour, room, or event?',
    answer:
      'You can select your preferred package and date in our Rate Calendar above to calculate your exact rate, then proceed to our official Google Booking Form (https://forms.gle/STv73fxDoKJxDC4A7) or message us on Facebook or Instagram to confirm your reservation.'
  },
  {
    question: 'What is included in the tour packages?',
    answer:
      'Each Day or Night Tour package includes one complimentary room (Overlooking Room) and full access to our resort amenities: Swimming Pool Area, Riverside Balcony Area, Recreational/Activities Area, Kitchen Area, Garden Area, and Function Space.'
  },
  {
    question: 'When are Staycation (22-Hour Room) rates available?',
    answer:
      'Staycation room-only bookings (Overlooking Room at ₱3,000, Family Room at ₱4,000, Barkada Room at ₱5,000, and Cozy Room at ₱6,000) are available exclusively on Mondays to Thursdays (excluding Holidays) and already include free use of Kitchen Gas. For Fridays, Saturdays, Sundays, and Holidays, please choose from our Day Tour, Night Tour, or Overnight Exclusive Resort Packages.'
  },
  {
    question: 'Are extra persons allowed in the room or package?',
    answer:
      'Yes, extra guests are welcome, subject to room and resort capacity limits. An excess guest fee applies for guests exceeding the maximum package capacity: ₱150/head for Day Tour, and ₱200/head for Night Tour, Overnight Exclusive Packages, and Staycations.'
  },
  {
    question: 'Are meals included in the packages? What about the Kitchen Gas Fee?',
    answer:
      'Meals are not included, but you are welcome to use our Kitchen Area to prepare your own food or bring your own snacks without corkage. For Staycation (Mon–Thu) bookings, use of Kitchen Gas is already INCLUDED. For Resort Bookings (Day Tour, Night Tour, and Overnight Exclusive Packages), there is an optional ₱400 fee if you wish to use the kitchen gas/stove.'
  },
  {
    question: 'Can we extend our stay beyond our check-out time?',
    answer:
      'Yes, subject to availability! Extended hours are charged at ₱500 per hour, up to a maximum of 2 extended hours.'
  },
  {
    question: 'Is parking available and is the resort kid-friendly & pet-friendly?',
    answer:
      'Absolutely! We provide free on-site parking for guests. Our resort is very kid-friendly with pools, recreational courts, and open spaces. Pets are also welcome—owners are simply responsible for cleaning up after their pets and ensuring they are well-managed during the stay.'
  },
  {
    question: 'Can we hold events or parties at the resort?',
    answer:
      'Yes! Our function spaces, riverside balcony, and open garden areas are ideal for birthdays, family reunions, and group celebrations. Select "Events Booking" in our calculator or contact us directly for special arrangements.'
  },
  {
    question: 'How do I get to The Forts Riverside Private Resort?',
    answer:
      'The resort is located near Beltran Street, right by the scenic Angat River. You can easily reach us by private car or public transport, and you can search "The Forts Riverside Private Resort" on Google Maps or Waze for turn-by-turn navigation.'
  }
];

// ==========================================
// 5. HELPER FUNCTIONS
// ==========================================

const formatPHP = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return `₱${amount.toLocaleString('en-PH')}`;
};

const toDateKey = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

const parseDateKey = (dateKey) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatReadableDate = (dateKey) => {
  if (!dateKey) return '';
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Checks if a date is Fri (5), Sat (6), Sun (0) OR a holiday
const getDayRateInfo = (dateKey, pkg, customHolidays) => {
  const dateObj = parseDateKey(dateKey);
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 4 = Thu, 5 = Fri, 6 = Sat
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
  const holidayName = DEFAULT_PH_HOLIDAYS[dateKey] || customHolidays[dateKey] || null;
  const isHoliday = Boolean(holidayName);
  const isPeakDay = isWeekend || isHoliday;

  if (pkg.isEvent) {
    return {
      available: true,
      isEvent: true,
      rate: 0,
      rateLabel: 'Inquire',
      tierLabel: isHoliday
        ? `Holiday (${holidayName})`
        : isWeekend
        ? 'Weekend (Fri–Sun)'
        : 'Weekday (Mon–Thu)',
      isPeakDay,
      isWeekend,
      isHoliday,
      holidayName
    };
  }

  // Staycation 22-Hr Rooms are Mon-Thurs & Non-Holidays ONLY
  if (pkg.monThuOnly) {
    if (isPeakDay) {
      return {
        available: false,
        rate: null,
        rateLabel: 'Mon–Thu Only',
        tierLabel: isHoliday
          ? `Unavailable on Holiday (${holidayName})`
          : 'Unavailable on Fri–Sun',
        isPeakDay,
        isWeekend,
        isHoliday,
        holidayName
      };
    }
    return {
      available: true,
      rate: pkg.weekdayRate,
      rateLabel: formatPHP(pkg.weekdayRate),
      tierLabel: 'Staycation Rate (Mon–Thu)',
      isPeakDay: false,
      isWeekend: false,
      isHoliday: false,
      holidayName: null
    };
  }

  // Resort Booking (Available Any Day)
  const applicableRate = isPeakDay ? pkg.weekendRate : pkg.weekdayRate;
  return {
    available: true,
    rate: applicableRate,
    rateLabel: formatPHP(applicableRate),
    tierLabel: isHoliday
      ? `Holiday Rate (${holidayName})`
      : isWeekend
      ? 'Fri–Sun & Holiday Rate'
      : 'Mon–Thurs Rate',
    isPeakDay,
    isWeekend,
    isHoliday,
    holidayName
  };
};

// ==========================================
// 6. MAIN APPLICATION COMPONENT
// ==========================================

export default function App() {
  // Navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calendar & Calculator State
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Default selected package: Overnight Family Package or Day Tour
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPackageId, setSelectedPackageId] = useState('day-tour');

  // Default selected date: find next Monday or Wednesday so every package works out of the box
  const initialDateKey = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    return toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
  }, [today]);

  const [selectedDateKey, setSelectedDateKey] = useState(initialDateKey);
  const [customHolidays, setCustomHolidays] = useState({});
  const [holidayToggleMode, setHolidayToggleMode] = useState(false);

  // Calculator Add-on States
  const [guestCount, setGuestCount] = useState(10);
  const [includeGasFee, setIncludeGasFee] = useState(false);
  const [extendedHours, setExtendedHours] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [guestNotes, setGuestNotes] = useState('');

  // Modal & FAQ states
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Currently selected package object
  const selectedPackage = useMemo(
    () => PACKAGES_DATA.find((p) => p.id === selectedPackageId) || PACKAGES_DATA[0],
    [selectedPackageId]
  );

  // Filtered packages for the picker
  const filteredPackages = useMemo(() => {
    if (selectedCategory === 'all') return PACKAGES_DATA;
    return PACKAGES_DATA.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Handle package switch & adjust default guest count within package range
  const handleSelectPackage = (pkgId, scrollToCal = false) => {
    const pkg = PACKAGES_DATA.find((p) => p.id === pkgId);
    if (!pkg) return;
    setSelectedPackageId(pkgId);

    // Adjust guest count to fit cleanly in the new package's standard capacity
    if (guestCount < pkg.minPax) {
      setGuestCount(pkg.minPax);
    } else if (guestCount > pkg.maxPax) {
      setGuestCount(pkg.maxPax);
    }

    // If switching to a Mon-Thu only Staycation package and currently selected date is Fri-Sun/Holiday,
    // keep the date selected so the user sees the helpful prompt, or let them click any Mon-Thu cell.
    if (scrollToCal) {
      const el = document.getElementById('booking-calendar');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calendar Grid Generation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    // Leading empty slots
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = toDateKey(currentYear, currentMonth, day);
      const dateObj = new Date(currentYear, currentMonth, day);
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isPast = dateObj < todayMidnight;
      const rateInfo = getDayRateInfo(dateKey, selectedPackage, customHolidays);

      days.push({
        day,
        dateKey,
        isPast,
        ...rateInfo
      });
    }

    return days;
  }, [currentYear, currentMonth, selectedPackage, customHolidays, today]);

  // Selected Date Rate & Total Calculation
  const selectedDateInfo = useMemo(() => {
    if (!selectedDateKey) return null;
    return getDayRateInfo(selectedDateKey, selectedPackage, customHolidays);
  }, [selectedDateKey, selectedPackage, customHolidays]);

  const priceBreakdown = useMemo(() => {
    if (!selectedDateInfo || !selectedDateInfo.available) {
      return {
        available: false,
        baseRate: 0,
        excessGuests: 0,
        excessFee: 0,
        gasFee: 0,
        extendedFee: 0,
        total: 0
      };
    }

    const baseRate = selectedDateInfo.rate || 0;
    const excessGuests = Math.max(0, guestCount - selectedPackage.maxPax);
    const excessFee = excessGuests * selectedPackage.excessFeePerHead;

    const gasFee = selectedPackage.gasIncluded
      ? 0
      : includeGasFee
      ? selectedPackage.gasFeeOption
      : 0;

    const extendedFee = extendedHours * selectedPackage.extendedHourRate;
    const total = baseRate + excessFee + gasFee + extendedFee;

    return {
      available: true,
      baseRate,
      excessGuests,
      excessFee,
      gasFee,
      extendedFee,
      total
    };
  }, [selectedDateInfo, guestCount, selectedPackage, includeGasFee, extendedHours]);

  // Month Navigation
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Click handler for a calendar day cell
  const handleDayClick = (dayItem) => {
    if (!dayItem || dayItem.isPast) return;

    if (holidayToggleMode) {
      setCustomHolidays((prev) => {
        const updated = { ...prev };
        if (updated[dayItem.dateKey]) {
          delete updated[dayItem.dateKey];
        } else {
          updated[dayItem.dateKey] = 'Custom Holiday';
        }
        return updated;
      });
      return;
    }

    setSelectedDateKey(dayItem.dateKey);
  };

  // Copy Booking Summary to Clipboard
  const generateSummaryText = () => {
    const lines = [
      '=== THE FORTS RIVERSIDE PRIVATE RESORT — BOOKING INQUIRY ===',
      `Package: ${selectedPackage.name} (${selectedPackage.paxLabel})`,
      `Check-In Date: ${formatReadableDate(selectedDateKey)}`,
      `Schedule: ${selectedPackage.duration}`,
      `Rate Tier: ${selectedDateInfo?.tierLabel || 'Standard'}`,
      `Total Guests: ${guestCount} Pax (${priceBreakdown.excessGuests} excess pax)`,
      `Kitchen Gas: ${
        selectedPackage.gasIncluded
          ? 'Included (Free with Staycation)'
          : includeGasFee
          ? 'Yes (+Php 400)'
          : 'No'
      }`,
      `Extended Hours: ${extendedHours} hr(s) (+Php ${priceBreakdown.extendedFee})`,
      selectedPackage.isEvent
        ? 'Estimated Total: Custom Event Quote'
        : `Estimated Total: ${formatPHP(priceBreakdown.total)}`,
      guestName ? `Guest Name: ${guestName}` : '',
      guestContact ? `Contact Info: ${guestContact}` : '',
      guestNotes ? `Special Notes: ${guestNotes}` : '',
      'Official Website: https://theforts.ph'
    ].filter(Boolean);
    return lines.join('\n');
  };

  const handleCopySummary = () => {
    const text = generateSummaryText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 font-sans selection:bg-teal-700 selection:text-white">
      {/* ==========================================
          TOP ANNOUNCEMENT BAR
      ========================================== */}
      <div className="bg-teal-950 text-teal-100 text-xs sm:text-sm py-2 px-4 text-center border-b border-teal-800/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Updated 2026 Rates Now Live!
          </span>
          <span className="hidden md:inline text-teal-400">•</span>
          <span>Staycation 22-Hr Rooms from ₱3,000 (Mon–Thu)</span>
          <span className="hidden md:inline text-teal-400">•</span>
          <span>Day Tours from ₱4,500 & Overnight Exclusive from ₱7,999</span>
        </div>
      </div>

      {/* ==========================================
          STICKY NAVIGATION BAR
      ========================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-800 to-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xl font-serif font-bold tracking-tight text-slate-900">
                The Forts
              </span>
              <span className="block text-xs text-teal-700 font-medium tracking-wider uppercase">
                Riverside Private Resort
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#home" className="hover:text-teal-700 transition-colors">
              Home
            </a>
            <a href="#packages" className="hover:text-teal-700 transition-colors">
              Tour Packages & Rates
            </a>
            <a
              href="#booking-calendar"
              className="text-teal-800 font-semibold flex items-center gap-1.5 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              <CalendarIcon className="w-4 h-4 text-teal-700" />
              Rate Calendar
            </a>
            <a href="#rooms" className="hover:text-teal-700 transition-colors">
              Rooms
            </a>
            <a href="#directions" className="hover:text-teal-700 transition-colors">
              Directions
            </a>
            <a href="#faqs" className="hover:text-teal-700 transition-colors">
              FAQs
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#booking-calendar"
              className="inline-flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4" />
              Book Now!
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-stone-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-2">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-slate-700 hover:bg-stone-100 font-medium"
            >
              Home
            </a>
            <a
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-slate-700 hover:bg-stone-100 font-medium"
            >
              Tour Packages & Updated Rates
            </a>
            <a
              href="#booking-calendar"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg bg-teal-50 text-teal-800 font-semibold"
            >
              Interactive Rate Calendar & Calculator
            </a>
            <a
              href="#rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-slate-700 hover:bg-stone-100 font-medium"
            >
              Rooms (Overlooking, Family, Barkada, Cozy)
            </a>
            <a
              href="#directions"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-slate-700 hover:bg-stone-100 font-medium"
            >
              Directions
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-slate-700 hover:bg-stone-100 font-medium"
            >
              FAQs
            </a>
            <div className="pt-2">
              <a
                href="#booking-calendar"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-teal-800 text-white font-semibold py-3 rounded-xl shadow"
              >
                <CalendarIcon className="w-4 h-4" />
                Check Daily Rates & Book Now
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section id="home" className="relative overflow-hidden bg-slate-900 text-white">
        {/* Background Image with River & Pool ambiance */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1920&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/75 to-teal-950/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs sm:text-sm font-medium mb-6 backdrop-blur-xs">
              <MapPin className="w-4 h-4 text-amber-400" />
              Scenic Angat River & Beltran Street • Private Resort Sanctuary
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight text-white">
              The Forts Riverside Private Resort
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-stone-200 leading-relaxed max-w-2xl">
              A riverside haven designed for relaxation, fun, and unforgettable memories. Escape the
              noise of the city and unwind where comfort meets nature.
            </p>

            {/* Primary Hero CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#booking-calendar"
                className="inline-flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-4 rounded-xl shadow-lg transition-all cursor-pointer text-base"
              >
                <CalendarIcon className="w-5 h-5" />
                View Rate Calendar & Book Now
              </a>
              <a
                href="#packages"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-xl border border-white/25 backdrop-blur-xs transition-all text-base"
              >
                Explore Packages & Rates
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Highlights Bar */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/15">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-400">₱3,000</p>
                <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                  Staycation 22-Hr Rooms (Mon–Thu)
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-teal-300">₱4,500</p>
                <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                  Day Tour w/ Free Overlooking Room
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-400">₱7,999</p>
                <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                  22-Hr Overnight Exclusive Packages
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-teal-300">Up to 30+</p>
                <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                  Whole Resort & Events Capacity
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          WELCOME & AMENITIES SECTION
      ========================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Welcome Text */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-teal-700 font-semibold text-sm uppercase tracking-wider">
                Welcome to The Forts Riverside Private Resort!
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
                Where Comfort Meets Nature by the Scenic Angat River
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Escape to a relaxing riverside retreat where comfort meets nature. At{' '}
                <strong>The Forts Riverside Private Resort</strong>, we offer a peaceful getaway
                perfect for families, friends, and special gatherings — far from the noise of the
                city.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Surrounded by a calm and refreshing atmosphere, our resort is designed to give you
                privacy, comfort, and memorable experiences. Enjoy exclusive access to our cozy
                accommodations and inviting amenities, making every stay feel special and
                stress-free.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Whether you&apos;re planning a quiet weekday staycation, a fun-filled barkada
                outing, or a meaningful family celebration, The Forts is your home away from home
                right by the river.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-teal-50 text-teal-800 px-3.5 py-2 rounded-lg border border-teal-200">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Exclusive Private Access
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-900 px-3.5 py-2 rounded-lg border border-amber-200">
                  <PawPrint className="w-4 h-4 text-amber-600" />
                  Pet-Friendly & Kid-Friendly
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-stone-100 text-slate-700 px-3.5 py-2 rounded-lg border border-stone-200">
                  <Car className="w-4 h-4 text-slate-600" />
                  Free On-Site Parking
                </span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="lg:col-span-6">
              <div className="bg-stone-50 p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Resort Amenities & Inclusions
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Full access to our riverside spaces for a complete &quot;home away from home&quot;
                  retreat:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-stone-200/80">
                    <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700 shrink-0">
                      <Waves className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Swimming Pool Area</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Refreshing adult & kiddie pool sections with canopy shade & night lights
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-stone-200/80">
                    <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 shrink-0">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">
                        Riverside Balcony Area
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Scenic elevated deck overlooking the Angat River & golden sunsets
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-stone-200/80">
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Kitchen Area</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Prep counters, sink & cooking area (free gas on Mon–Thu staycations)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-stone-200/80">
                    <div className="p-2.5 rounded-lg bg-purple-50 text-purple-700 shrink-0">
                      <PartyPopper className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Function Space</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Spacious covered pavilion for dining, karaoke, birthdays & reunions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-stone-200/80">
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">
                        Recreational / Activities Area
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Outdoor court for badminton, team games, and family activities
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-stone-200/80">
                    <div className="p-2.5 rounded-lg bg-green-50 text-green-700 shrink-0">
                      <Trees className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">
                        Garden Area & Cozy Rooms
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Relaxing outdoor umbrella seating and 4 air-conditioned rooms
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          INTERACTIVE CALENDAR WITH DAILY PACKAGE RATES
          & BOOKING CALCULATOR (CORE FEATURE)
      ========================================== */}
      <section
        id="booking-calendar"
        className="py-16 sm:py-24 bg-gradient-to-b from-stone-100 to-stone-50 border-b border-stone-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-teal-800 bg-teal-100/80 px-3.5 py-1.5 rounded-full mb-3">
              <CalendarIcon className="w-3.5 h-3.5" />
              Interactive Daily Rate Calendar & Calculator
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
              Pick a Package to See Exact Daily Rates
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Select any <strong>Staycation Room</strong>, <strong>Day/Night Tour</strong>, or{' '}
              <strong>Overnight Exclusive Package</strong> below. Every day on the calendar
              automatically updates to display that package&apos;s exact rate for weekdays,
              weekends, and holidays.
            </p>
          </div>

          {/* STEP 1: PACKAGE PICKER BAR */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Step 1: Choose Your Package or Room
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Viewing Calendar Rates For:{' '}
                  <span className="text-teal-800 underline decoration-amber-400 decoration-2 underline-offset-4">
                    {selectedPackage.name}
                  </span>
                </h3>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {PACKAGE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-teal-800 text-white shadow-xs'
                        : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selectable Package Pills Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {filteredPackages.map((pkg) => {
                const isSelected = pkg.id === selectedPackageId;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handleSelectPackage(pkg.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-900 text-white border-teal-900 shadow-md ring-2 ring-teal-600/30'
                        : 'bg-stone-50/70 hover:bg-white text-slate-800 border-stone-200 hover:border-teal-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950'
                              : pkg.monThuOnly
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {pkg.paxLabel}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                      </div>
                      <p className="font-bold text-sm mt-2 line-clamp-1">{pkg.shortName}</p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          isSelected ? 'text-teal-200' : 'text-slate-500'
                        }`}
                      >
                        {pkg.monThuOnly ? 'Mon–Thu (22 Hrs)' : pkg.duration.split(' (')[0]}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-current/10 flex items-baseline justify-between">
                      {pkg.isEvent ? (
                        <span className="text-xs font-bold text-amber-400">Custom Quote</span>
                      ) : pkg.monThuOnly ? (
                        <span className="text-xs font-bold">
                          {formatPHP(pkg.weekdayRate)}{' '}
                          <span className="font-normal opacity-75">Mon-Thu</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold">
                          {formatPHP(pkg.weekdayRate)}
                          <span className="font-normal opacity-75"> – </span>
                          {formatPHP(pkg.weekendRate)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2 & 3: CALENDAR + LIVE CALCULATOR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT 7 COLUMNS: MONTHLY CALENDAR WITH DYNAMIC DAILY RATES */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              {/* Calendar Top Header */}
              <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold">
                    Step 2: Click a Date on the Calendar
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <h3 className="text-2xl font-serif font-bold">
                      {monthNames[currentMonth]} {currentYear}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Previous Month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentMonth(today.getMonth());
                      setCurrentYear(today.getFullYear());
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Next Month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rate Legend & Holiday Toggle Bar */}
              <div className="px-5 py-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    Mon–Thu:{' '}
                    <strong>
                      {selectedPackage.isEvent
                        ? 'Inquire'
                        : formatPHP(selectedPackage.weekdayRate)}
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Fri–Sun & Holidays:{' '}
                    <strong>
                      {selectedPackage.isEvent
                        ? 'Inquire'
                        : selectedPackage.monThuOnly
                        ? 'Not Available (Mon–Thu Only)'
                        : formatPHP(selectedPackage.weekendRate)}
                    </strong>
                  </span>
                </div>

                {/* Holiday Simulation Toggle */}
                <button
                  type="button"
                  onClick={() => setHolidayToggleMode(!holidayToggleMode)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium border transition-colors cursor-pointer ${
                    holidayToggleMode
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-slate-600 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {holidayToggleMode ? 'Click Any Date to Toggle Holiday (Done)' : 'Mark Custom Holiday'}
                </button>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 bg-stone-100/80 border-b border-stone-200 text-center text-xs font-bold text-slate-500 py-2.5">
                <div className="text-amber-700">SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div className="text-amber-700">FRI</div>
                <div className="text-amber-700">SAT</div>
              </div>

              {/* Calendar Grid Cells */}
              <div className="grid grid-cols-7 p-2 sm:p-4 gap-1.5 sm:gap-2">
                {calendarDays.map((dayItem, index) => {
                  if (!dayItem) {
                    return <div key={`empty-${index}`} className="h-20 sm:h-24 rounded-xl bg-stone-50/50" />;
                  }

                  const isSelected = dayItem.dateKey === selectedDateKey;

                  return (
                    <button
                      key={dayItem.dateKey}
                      type="button"
                      disabled={dayItem.isPast}
                      onClick={() => handleDayClick(dayItem)}
                      className={`h-20 sm:h-24 p-1.5 sm:p-2 rounded-xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                        dayItem.isPast
                          ? 'bg-stone-100/60 border-stone-200/60 text-stone-400 cursor-not-allowed opacity-55'
                          : isSelected
                          ? 'bg-teal-900 text-white border-teal-900 shadow-md ring-2 ring-amber-400 cursor-pointer scale-[1.02] z-10'
                          : !dayItem.available
                          ? 'bg-stone-100 border-stone-200 text-slate-500 hover:border-stone-300 cursor-pointer'
                          : dayItem.isPeakDay
                          ? 'bg-amber-50/60 hover:bg-amber-50 border-amber-200/80 text-slate-900 cursor-pointer'
                          : 'bg-white hover:bg-teal-50/50 border-stone-200 hover:border-teal-300 text-slate-900 cursor-pointer'
                      }`}
                    >
                      {/* Top row: Day number + Holiday/Wknd indicator */}
                      <div className="flex items-start justify-between w-full">
                        <span
                          className={`text-xs sm:text-sm font-bold leading-none ${
                            isSelected
                              ? 'text-white'
                              : dayItem.isHoliday
                              ? 'text-rose-600'
                              : dayItem.isWeekend
                              ? 'text-amber-800'
                              : 'text-slate-700'
                          }`}
                        >
                          {dayItem.day}
                        </span>

                        {dayItem.isHoliday && (
                          <span
                            title={dayItem.holidayName}
                            className={`text-[9px] font-bold uppercase px-1 py-0.5 rounded leading-none ${
                              isSelected
                                ? 'bg-rose-500 text-white'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            Hol
                          </span>
                        )}
                      </div>

                      {/* Middle optional holiday title */}
                      {dayItem.isHoliday && (
                        <p
                          className={`text-[9px] leading-tight line-clamp-1 ${
                            isSelected ? 'text-amber-200' : 'text-rose-600'
                          }`}
                        >
                          {dayItem.holidayName}
                        </p>
                      )}

                      {/* Bottom row: Dynamic Package Rate on that exact day */}
                      <div className="w-full mt-auto">
                        {dayItem.available ? (
                          <div
                            className={`text-[11px] sm:text-xs font-extrabold tracking-tight px-1.5 py-0.5 rounded-md inline-block w-full text-center truncate ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950'
                                : dayItem.isPeakDay
                                ? 'bg-amber-100/90 text-amber-950'
                                : 'bg-emerald-50 text-emerald-800'
                            }`}
                          >
                            {dayItem.rateLabel}
                          </div>
                        ) : (
                          <div
                            className={`text-[9px] sm:text-[10px] font-semibold px-1 py-0.5 rounded text-center leading-tight ${
                              isSelected
                                ? 'bg-rose-500/30 text-rose-100'
                                : 'bg-stone-200/80 text-stone-600'
                            }`}
                          >
                            Mon–Thu Only
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Helpful Note Footer inside Calendar */}
              <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Rate Rules:</strong> Staycation 22-Hour Room rates (₱3,000–₱6,000) apply
                  on <strong>Mondays to Thursdays (Non-Holidays)</strong> and include free use of
                  Kitchen Gas. Resort Tours & Overnight Exclusive Packages are available{' '}
                  <strong>any day</strong> with automatic Mon–Thu and Fri–Sun/Holiday pricing.
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLUMNS: LIVE BOOKING CALCULATOR & SUMMARY */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden sticky top-24">
              <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-900 to-teal-800 text-white">
                <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                  Step 3: Customize & Compute Total
                </span>
                <h3 className="text-xl font-serif font-bold mt-1">{selectedPackage.name}</h3>
                <p className="text-xs text-teal-100 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {selectedPackage.duration} • {selectedPackage.paxLabel}
                </p>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* Selected Date Banner */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Selected Check-In Date
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatReadableDate(selectedDateKey)}
                    </span>
                    <span className="block text-xs text-teal-700 font-medium mt-0.5">
                      {selectedDateInfo?.tierLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Daily Base Rate</span>
                    <span className="text-lg font-extrabold text-teal-800">
                      {selectedDateInfo?.available ? selectedDateInfo.rateLabel : 'Unavailable'}
                    </span>
                  </div>
                </div>

                {/* Alert if Staycation Room is selected on Fri-Sun or Holiday */}
                {selectedDateInfo && !selectedDateInfo.available && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <strong className="block text-sm text-amber-950 mb-0.5">
                          Staycation Rooms are Mon–Thurs (Non-Holidays) Only
                        </strong>
                        You picked a <strong>Weekend or Holiday</strong> date. Please select a
                        Monday–Thursday date on the calendar, OR switch to a Weekend-eligible
                        Resort Package below:
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSelectPackage('overnight-family')}
                        className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Switch to Family Overnight (₱8,999)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPackage('day-tour')}
                        className="text-xs font-bold bg-white hover:bg-stone-100 text-slate-800 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Switch to Day Tour (₱5,000)
                      </button>
                    </div>
                  </div>
                )}

                {/* Included Room & Capacity Info */}
                <div className="text-xs bg-teal-50/70 border border-teal-200/80 rounded-xl p-3.5 text-teal-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-teal-700" />
                    Accommodation Included:
                  </div>
                  <p className="text-slate-700">{selectedPackage.includedRooms}</p>
                </div>

                {/* Controls: Number of Guests */}
                {!selectedPackage.isEvent && (
                  <div className="space-y-4 pt-2 border-t border-stone-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-teal-700" />
                          Total Number of Guests
                        </label>
                        <p className="text-xs text-slate-500">
                          Package covers up to {selectedPackage.maxPax} pax. Excess:{' '}
                          {formatPHP(selectedPackage.excessFeePerHead)}/head
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          className="w-8 h-8 rounded-lg border border-stone-300 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                          aria-label="Decrease guests"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">{guestCount}</span>
                        <button
                          type="button"
                          onClick={() => setGuestCount(guestCount + 1)}
                          className="w-8 h-8 rounded-lg border border-stone-300 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                          aria-label="Increase guests"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Kitchen Gas Fee Option */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div>
                        <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-amber-600" />
                          Use of Kitchen Gas
                        </span>
                        <p className="text-xs text-slate-500">
                          {selectedPackage.gasIncluded
                            ? 'Inclusive with Staycation 22-Hr Room'
                            : 'Optional add-on for Resort Bookings (+₱400)'}
                        </p>
                      </div>

                      {selectedPackage.gasIncluded ? (
                        <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
                          Included (Free)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIncludeGasFee(!includeGasFee)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            includeGasFee
                              ? 'bg-teal-800 text-white border-teal-800'
                              : 'bg-stone-100 text-slate-700 border-stone-300 hover:bg-stone-200'
                          }`}
                        >
                          {includeGasFee ? 'Added (+₱400)' : 'Add +₱400'}
                        </button>
                      )}
                    </div>

                    {/* Extended Hours Selector (Max 2 hrs) */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div>
                        <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-teal-700" />
                          Extended Hours (Max 2 Hrs)
                        </span>
                        <p className="text-xs text-slate-500">Additional ₱500 per extended hour</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((hr) => (
                          <button
                            key={hr}
                            type="button"
                            onClick={() => setExtendedHours(hr)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              extendedHours === hr
                                ? 'bg-teal-800 text-white border-teal-800'
                                : 'bg-stone-100 text-slate-700 border-stone-300 hover:bg-stone-200'
                            }`}
                          >
                            {hr === 0 ? 'None' : `+${hr} hr`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ITEMIZED PRICE BREAKDOWN */}
                <div className="p-4 rounded-xl bg-stone-900 text-white space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Estimated Price Breakdown
                  </div>

                  {selectedPackage.isEvent ? (
                    <div className="py-2 text-sm text-stone-200">
                      Events & Celebrations are custom-quoted based on your guest count, room
                      inclusions, and event duration. Click below to request a reservation!
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-stone-300">
                          {selectedPackage.shortName} ({selectedDateInfo?.tierLabel})
                        </span>
                        <span className="font-semibold">
                          {priceBreakdown.available ? formatPHP(priceBreakdown.baseRate) : '—'}
                        </span>
                      </div>

                      {priceBreakdown.excessGuests > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm text-amber-300">
                          <span>
                            Excess Guests ({priceBreakdown.excessGuests} pax ×{' '}
                            {formatPHP(selectedPackage.excessFeePerHead)})
                          </span>
                          <span className="font-semibold">
                            +{formatPHP(priceBreakdown.excessFee)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-stone-300">Kitchen Gas Fee</span>
                        <span className="font-semibold text-emerald-300">
                          {selectedPackage.gasIncluded
                            ? 'Included (₱0)'
                            : includeGasFee
                            ? '+₱400'
                            : '₱0'}
                        </span>
                      </div>

                      {extendedHours > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm text-amber-300">
                          <span>Extended Hours ({extendedHours} hr × ₱500)</span>
                          <span className="font-semibold">
                            +{formatPHP(priceBreakdown.extendedFee)}
                          </span>
                        </div>
                      )}

                      <div className="pt-2.5 border-t border-stone-700 flex items-baseline justify-between">
                        <span className="text-sm font-bold text-white">Total Estimated Rate</span>
                        <span className="text-2xl font-extrabold text-amber-400">
                          {priceBreakdown.available ? formatPHP(priceBreakdown.total) : 'Select Valid Date'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Proceed to Reservation CTA */}
                <button
                  type="button"
                  disabled={!selectedDateInfo?.available}
                  onClick={() => setBookingModalOpen(true)}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all ${
                    selectedDateInfo?.available
                      ? 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer'
                      : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <CalendarIcon className="w-5 h-5" />
                  {selectedDateInfo?.available
                    ? 'Reserve This Date & Package'
                    : 'Select a Mon–Thu Date or Switch Package'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          UPDATED RATES & PACKAGES COMPLETE OVERVIEW
      ========================================== */}
      <section id="packages" className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-teal-700 font-bold text-xs uppercase tracking-widest">
              Official Updated Price List
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
              Riverside Tour Packages, Staycations & Exclusive Rates
            </h2>
            <p className="mt-3 text-slate-600">
              Our Riverside Tour Packages offer a simple, heartfelt way to explore the beauty of the
              river while enjoying the comforts of our quiet retreat. Click any package to load its
              rates directly into the calendar!
            </p>
          </div>

          <div className="space-y-12">
            {/* 1. RESORT BOOKING: DAY & NIGHT TOURS (ANY DAY) */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-stone-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Resort Booking • Available Any Day
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">
                    Day Tour & Night Tour Packages
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 sm:mt-0">
                  Includes 1 Complimentary Overlooking Room + Full Resort Amenities Access
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PACKAGES_DATA.filter((p) => p.category === 'resort-tours').map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-teal-100 text-teal-900 px-3 py-1 rounded-full">
                          {pkg.id === 'day-tour' ? (
                            <Sun className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <Moon className="w-3.5 h-3.5 text-indigo-600" />
                          )}
                          {pkg.duration}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          Excess guest: ₱{pkg.excessFeePerHead}/head
                        </span>
                      </div>

                      <h4 className="text-2xl font-serif font-bold text-slate-900">{pkg.name}</h4>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Rate Box */}
                      <div className="mt-5 grid grid-cols-2 gap-3 p-4 rounded-xl bg-white border border-stone-200">
                        <div>
                          <span className="text-[11px] font-bold uppercase text-slate-400 block">
                            Mon – Thurs
                          </span>
                          <span className="text-2xl font-extrabold text-teal-800">
                            {formatPHP(pkg.weekdayRate)}
                          </span>
                        </div>
                        <div className="border-l border-stone-200 pl-3">
                          <span className="text-[11px] font-bold uppercase text-amber-700 block">
                            Fri – Sun & Holidays
                          </span>
                          <span className="text-2xl font-extrabold text-amber-600">
                            {formatPHP(pkg.weekendRate)}
                          </span>
                        </div>
                      </div>

                      <ul className="mt-5 space-y-2">
                        {pkg.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                            <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-500">
                        Optional: +₱400 Kitchen Gas • +₱500/hr Extended (max 2 hrs)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectPackage(pkg.id, true)}
                        className="shrink-0 inline-flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Select in Calendar
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. OVERNIGHT EXCLUSIVE PACKAGES (2:00 PM - 12:00 NN) */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-stone-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Resort Booking • 22 Hours (2:00 PM – 12:00 NN)
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">
                    Overnight Exclusive Packages (Any Day)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 sm:mt-0">
                  Excess overnight guest fee: ₱200/head • Optional Kitchen Gas: +₱400
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {PACKAGES_DATA.filter((p) => p.category === 'overnight-exclusive').map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md">
                          {pkg.paxLabel}
                        </span>
                        <span className="text-[11px] font-semibold text-teal-700">22 Hours</span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 mt-3">{pkg.name}</h4>
                      <p className="text-xs font-semibold text-teal-800 mt-1">
                        {pkg.includedRooms}
                      </p>

                      <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-500 font-medium">Mon–Thurs:</span>
                          <span className="text-lg font-extrabold text-teal-800">
                            {formatPHP(pkg.weekdayRate)}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between border-t border-stone-200 pt-1.5">
                          <span className="text-xs text-amber-800 font-medium">
                            Fri–Sun & Hol:
                          </span>
                          <span className="text-lg font-extrabold text-amber-600">
                            {formatPHP(pkg.weekendRate)}
                          </span>
                        </div>
                      </div>

                      <ul className="mt-4 space-y-1.5">
                        {pkg.inclusions.slice(0, 4).map((inc, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPackage(pkg.id, true)}
                      className="mt-5 w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      Check Dates & Book
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. STAYCATION BOOKING (MON-THURS & NON-HOLIDAYS: 22 HRS ROOMS) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/15">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-1 rounded-full">
                    Staycation Booking • Mon–Thurs & Non-Holidays
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold mt-2">
                    22-Hour Staycation Rooms (Inclusive of Kitchen Gas)
                  </h3>
                  <p className="text-sm text-teal-100 mt-1">
                    Check-in 2:00 PM – Check-out 12:00 NN • Additional ₱500 per extended hour (max 2
                    hrs)
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PACKAGES_DATA.filter((p) => p.category === 'staycation').map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 uppercase">
                          {pkg.paxLabel}
                        </span>
                        <span className="text-[11px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded">
                          Free Gas Use
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white mt-2">
                        {pkg.name.replace('Staycation: ', '')}
                      </h4>
                      <p className="text-xs text-teal-100 mt-1">{pkg.includedRooms}</p>
                      <p className="text-3xl font-extrabold text-amber-400 mt-4">
                        {formatPHP(pkg.weekdayRate)}
                      </p>
                      <span className="text-[11px] text-teal-200 block">
                        22 Hours • Mon–Thurs Only
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPackage(pkg.id, true)}
                      className="mt-5 w-full py-2.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      View Mon–Thu Calendar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          OFFICIAL 4 ROOMS SECTION (NO FAMILY DELUXE)
      ========================================== */}
      <section id="rooms" className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-teal-700 font-bold text-xs uppercase tracking-widest">
              Cozy Riverfront Accommodations
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
              Explore Our 4 Air-Conditioned Rooms
            </h2>
            <p className="mt-3 text-slate-600">
              Our rooms are designed with your comfort and convenience in mind. Each space is
              thoughtfully appointed, offering a cozy sanctuary for you to unwind and recharge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ROOMS_DATA.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Room Image Header */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-200">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="bg-slate-900/85 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      {room.capacity}
                    </span>
                    <span className="bg-teal-800/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-teal-200" />
                      Air-Conditioned
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-amber-400 text-slate-950 font-extrabold text-sm px-3.5 py-1.5 rounded-xl shadow">
                    Staycation: {formatPHP(room.staycationRate)}{' '}
                    <span className="text-[11px] font-semibold">/ 22 hrs (Mon–Thu)</span>
                  </div>
                </div>

                {/* Room Details Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">{room.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{room.tagline}</p>

                    {/* Bed & CR Badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {room.beds.map((bed, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-stone-100 text-slate-800 px-3 py-1.5 rounded-lg"
                        >
                          <BedDouble className="w-3.5 h-3.5 text-teal-700" />
                          {bed}
                        </span>
                      ))}
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${
                          room.hasPrivateCR
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-900'
                        }`}
                      >
                        <Bath className="w-3.5 h-3.5" />
                        {room.cr}
                      </span>
                    </div>

                    {/* Bullet Features */}
                    <ul className="mt-5 space-y-2 border-t border-stone-100 pt-4">
                      {room.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                          <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectPackage(room.packageId, true)}
                      className="flex-1 py-3 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      Book Staycation (Mon–Thu)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPackage('overnight-wholeresort', true)}
                      className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Weekend Package
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          EVENTS BOOKING CALLOUT BANNER
      ========================================== */}
      <section className="py-14 bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
              <PartyPopper className="w-4 h-4" />
              Events Booking (For Reservations)
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold">
              Planning a Birthday, Family Reunion, or Special Celebration?
            </h3>
            <p className="text-teal-100 text-sm sm:text-base">
              Our scenic riverside balcony, function space, and open garden areas are ideal for
              unforgettable milestone events. Contact us or select Events Booking on our calendar!
            </p>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => handleSelectPackage('events-booking', true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 text-sm sm:text-base"
            >
              <CalendarIcon className="w-5 h-5" />
              Inquire for Events Booking
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          DIRECTIONS & LOCATION SECTION
      ========================================== */}
      <section id="directions" className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-teal-700 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                How to Get Here
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
                Directions to The Forts Riverside Private Resort
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Located near the scenic <strong>Angat River</strong> and{' '}
                <strong>Beltran Street</strong>, The Forts Riverside Private Resort can be easily
                accessed by private car or public transport. If you need further assistance, feel
                free to contact us—we&apos;ll be happy to guide you on your way!
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Landmark & Location</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Near Beltran Street, beside the scenic Angat River (Search &quot;The Forts
                      Riverside Private Resort&quot; on Google Maps / Waze)
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                  <Car className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Private Car & Public Transport
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      On-site gated parking is available for guests bringing private vehicles.
                      Tricycles and local transport are also readily accessible near Beltran Street.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=The+Forts+Riverside+Private+Resort+Angat+River+Beltran+Street"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://forms.gle/STv73fxDoKJxDC4A7"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors"
                >
                  Official Booking Form
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Stylized Visual Map Preview Card */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100 relative h-80 sm:h-96 flex flex-col justify-between p-6">
                {/* River & Road Map Illustration SVG background */}
                <svg
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  viewBox="0 0 800 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect width="800" height="500" fill="#EBF3F0" />
                  {/* Green terrain blocks */}
                  <path d="M0 0H800V220C620 260 420 180 200 260C80 300 0 270 0 270V0Z" fill="#D8EAD3" />
                  <path d="M0 360C220 330 450 410 800 320V500H0V360Z" fill="#DCE8D6" />
                  {/* Scenic Angat River Winding Path */}
                  <path
                    d="M-50 280C160 220 350 350 560 260C680 210 760 230 850 200L850 330C720 360 620 330 490 380C290 450 140 340 -50 390Z"
                    fill="#7CC4D8"
                  />
                  {/* Roads (Beltran Street) */}
                  <path
                    d="M120 0L290 250L650 160"
                    stroke="#FFFFFF"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  <path
                    d="M120 0L290 250L650 160"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                </svg>

                <div className="relative z-10 flex justify-between items-start">
                  <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs border border-stone-200 flex items-center gap-1.5">
                    <Waves className="w-4 h-4 text-sky-600" />
                    Angat River Bank • Beltran Street
                  </span>
                </div>

                {/* Center Map Pin Marker */}
                <div className="relative z-10 self-center my-auto flex flex-col items-center">
                  <div className="bg-teal-900 text-white px-4 py-2 rounded-xl shadow-lg border border-teal-700 text-center mb-2">
                    <p className="text-xs font-bold">The Forts Riverside Private Resort</p>
                    <p className="text-[10px] text-amber-300">theforts.ph • Open for Bookings</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-500 border-4 border-white shadow-lg flex items-center justify-center text-slate-950 animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>

                <div className="relative z-10 bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <strong className="text-slate-900">Need live directions?</strong> Connect with
                    us on Facebook or Instagram for immediate assistance.
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Angat+River+Beltran+Street"
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-800 font-bold hover:underline shrink-0"
                  >
                    View Map →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FREQUENTLY ASKED QUESTIONS (FAQs)
      ========================================== */}
      <section id="faqs" className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-teal-700 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Everything You Need to Know
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS_DATA.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-stone-50/80 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-teal-700 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-stone-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer className="bg-slate-950 text-stone-400 py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-slate-800">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white">
                  <Waves className="w-5 h-5" />
                </div>
                <span className="text-xl font-serif font-bold text-white">
                  The Forts Riverside Private Resort
                </span>
              </div>
              <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
                A riverside haven designed for relaxation, fun, and unforgettable memories. Located
                near the scenic Angat River and Beltran Street.
              </p>
              <p className="text-xs text-teal-400 font-medium">
                Questions? Connect with us on Facebook or Instagram for bookings and inquiries.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2 text-sm">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#booking-calendar" className="hover:text-white transition-colors">
                    Rate Calendar & Calculator
                  </a>
                </li>
                <li>
                  <a href="#packages" className="hover:text-white transition-colors">
                    Tour Packages & Updated Rates
                  </a>
                </li>
                <li>
                  <a href="#rooms" className="hover:text-white transition-colors">
                    Rooms (Overlooking, Family, Barkada, Cozy)
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="hover:text-white transition-colors">
                    Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3 text-sm">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
                Official Reservation Form
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Ready to lock in your dates? Compute your package rate using our interactive
                calendar or fill out our official booking form:
              </p>
              <a
                href="https://forms.gle/STv73fxDoKJxDC4A7"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-3 rounded-xl transition-colors"
              >
                Open Google Booking Form
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <p>© 2026 The Forts Riverside Private Resort | theforts.ph</p>
            <p className="flex items-center gap-1">
              Designed with <Heart className="w-3.5 h-3.5 text-rose-500" /> for unforgettable
              riverside memories
            </p>
          </div>
        </div>
      </footer>

      {/* ==========================================
          BOOKING SUMMARY & RESERVATION MODAL
      ========================================== */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 sm:p-6 bg-teal-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                  Reservation Summary
                </span>
                <h3 className="text-xl font-serif font-bold mt-0.5">{selectedPackage.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Optional Guest Details Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Number / FB
                  </label>
                  <input
                    type="text"
                    value={guestContact}
                    onChange={(e) => setGuestContact(e.target.value)}
                    placeholder="0917 XXX XXXX"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Requests / Event Details (Optional)
                </label>
                <input
                  type="text"
                  value={guestNotes}
                  onChange={(e) => setGuestNotes(e.target.value)}
                  placeholder="e.g., Birthday celebration, bringing 1 small pet..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-teal-700"
                />
              </div>

              {/* Summary Box */}
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs sm:text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Date:</span>
                  <span className="font-bold text-slate-900">
                    {formatReadableDate(selectedDateKey)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Schedule:</span>
                  <span className="font-semibold text-slate-800">{selectedPackage.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rate Tier Applied:</span>
                  <span className="font-semibold text-teal-800">{selectedDateInfo?.tierLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Guests:</span>
                  <span className="font-semibold text-slate-800">
                    {guestCount} Pax ({priceBreakdown.excessGuests} excess)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kitchen Gas:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedPackage.gasIncluded
                      ? 'Included Free'
                      : includeGasFee
                      ? 'Yes (+₱400)'
                      : 'Not Added'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Extended Hours:</span>
                  <span className="font-semibold text-slate-800">
                    {extendedHours} hr(s) (+{formatPHP(priceBreakdown.extendedFee)})
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-300 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Total Estimated Rate:</span>
                  <span className="text-xl font-extrabold text-teal-800">
                    {selectedPackage.isEvent
                      ? 'Custom Event Quote'
                      : formatPHP(priceBreakdown.total)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                <strong>Tip:</strong> Copy your booking breakdown below, then paste it into our
                official Google Reservation Form or send it directly to our Facebook/Instagram page!
              </p>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Booking Details
                    </>
                  )}
                </button>

                <a
                  href="https://forms.gle/STv73fxDoKJxDC4A7"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors text-center"
                >
                  Proceed to Booking Form
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}