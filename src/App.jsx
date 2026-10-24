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
  Trees,
  Camera,
  Maximize2
} from 'lucide-react';

// ============================================================================
// 0. EASY PNG IMAGE CONFIGURATION LIST
// ============================================================================
// Put your .png (or .jpg) files inside your "public/images/" folder in VS Code
// (e.g., TheForts/public/images/heropic.png) and match the filenames below.
// If a file is not in your folder yet, a high-res resort fallback photo will show automatically.

const SITE_IMAGES = {
  // --- BRAND LOGO ---
  // Leave empty "" to hide the logo everywhere. When ready, set to: "/images/logo.png"
  logo: '',

  // --- HERO SECTION PICTURES ---
  heroBackground: '/images/herobg.png',

  // --- AMENITIES & INCLUSIONS PICTURES ---
  swimmingPoolArea: '/images/swimming.png',
  riversideBalconyArea: '/images/balcony.png',
  functionSpace: '/images/function.png',
  kitchenArea: '/images/kitchen.png',
  recreationalArea: '/images/recreation.png',
  gardenArea: '/images/garden.png',

  // --- 4 ROOMS PICTURES ---
  overlookingRoom: '/images/overlooking.png',
  familyRoom: '/images/family.png',
  barkadaRoom: '/images/barkada.png',
  cozyRoom: '/images/cozy.png'
};

// High-resolution fallback photos used automatically until local PNG files are placed in /public/images/
const FALLBACK_IMAGES = {
  heroBackground:
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1920&q=80',
  swimmingPoolArea:
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=80',
  riversideBalconyArea:
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
  functionSpace:
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
  kitchenArea:
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=80',
  recreationalArea:
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
  gardenArea:
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
  overlookingRoom:
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
  familyRoom:
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80',
  barkadaRoom:
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
  cozyRoom:
    'https://images.unsplash.com/photo-1540518614846-7ede433c457?auto=format&fit=crop&w=900&q=80'
};

// Optional Brand Logo component: renders nothing when SITE_IMAGES.logo is ""
function FortsBrandLogo({ className = 'w-12 h-12' }) {
  const [imgError, setImgError] = useState(false);

  if (!SITE_IMAGES.logo || imgError) {
    return null;
  }

  return (
    <img
      src={SITE_IMAGES.logo}
      alt="The Forts Riverside Private Resort Logo"
      onError={() => setImgError(true)}
      className={`${className} rounded-full object-contain shadow-xs shrink-0`}
    />
  );
}

// Helper image component: tries your local PNG path first, falls back cleanly if not uploaded yet
function SmartResortImage({ localSrc, fallbackSrc, alt, className }) {
  const [useFallback, setUseFallback] = useState(!localSrc);
  const activeSrc = useFallback ? fallbackSrc : localSrc;

  return (
    <img
      src={activeSrc}
      alt={alt}
      onError={() => {
        if (!useFallback && fallbackSrc) {
          setUseFallback(true);
        }
      }}
      className={className}
    />
  );
}

// ============================================================================
// 1. STEP 1 MAIN BOOKING TYPES (3 CLEAR CHOICES)
// ============================================================================

const BOOKING_TYPES = [
  {
    id: 'resort',
    title: 'Resort Booking',
    subtitle: 'Select a Tour or Overnight Package • Available Any Day',
    badge: 'Most Popular • Pools + Amenities',
    icon: Waves,
    shortDesc:
      'Exclusive access to the swimming pools, riverside balcony, function space & rooms. Choose from Day Tour, Night Tour, or 22-Hr Overnight Packages.',
    selectionPrompt: 'Step 2: Select Your Resort Package'
  },
  {
    id: 'staycation',
    title: 'Staycation Booking',
    subtitle: 'Select a 22-Hour Room • Mon–Thurs & Non-Holidays Only',
    badge: 'Weekday Room Stay • Free Gas',
    icon: BedDouble,
    shortDesc:
      'Relaxing 22-hour air-conditioned room stay (2:00 PM – 12:00 NN) for a peaceful weekday escape. Inclusive of FREE use of Kitchen Gas.',
    selectionPrompt: 'Step 2: Select Your Staycation Room (Mon–Thurs Only)'
  },
  {
    id: 'events',
    title: 'Events Booking',
    subtitle: 'Reserve a Date & Inquire • Birthdays, Reunions & Celebrations',
    badge: 'Custom Quote • Function Spaces',
    icon: PartyPopper,
    shortDesc:
      'Ideal for birthdays, family reunions, baptisms, and milestone celebrations. Pick your target date on the calendar to request a custom event quotation.',
    selectionPrompt: 'Step 2: Select Your Event Type & Inquiry Details'
  }
];

// ============================================================================
// 2. PACKAGES, STAYCATION ROOMS & EVENTS DATA
// ============================================================================

const PACKAGES_DATA = [
  // --- 1. RESORT BOOKING PACKAGES (ANY DAY) ---
  {
    id: 'day-tour',
    category: 'resort',
    bookingType: 'resort',
    subGroup: 'Day & Night Tours',
    name: 'Day Tour Package',
    shortName: 'Day Tour (8AM–5PM)',
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
    badge: 'Daytime Escape',
    includedRooms: '1 Complimentary Overlooking Room (2 Double Beds, Private CR)',
    description:
      'Includes full access to the resort’s pools, riverside balcony, kitchen, function space, and recreational facilities for a fun-filled daytime escape.',
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
    category: 'resort',
    bookingType: 'resort',
    subGroup: 'Day & Night Tours',
    name: 'Night Tour Package',
    shortName: 'Night Tour (7PM–6AM)',
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
    badge: 'Evening Getaway',
    includedRooms: '1 Complimentary Overlooking Room (2 Double Beds, Private CR)',
    description:
      'Enjoy evening relaxation with warm ambient string lighting, peaceful riverside views, night swimming, and access to the resort’s amenities.',
    inclusions: [
      'Complimentary stay in Overlooking Room',
      'Night swimming with ambient pool lighting',
      'Riverside Balcony & Function Space access',
      'Recreational & Kitchen Area access',
      'Peaceful overnight breeze by Angat River',
      'Free On-site Parking'
    ]
  },
  {
    id: 'overnight-family',
    category: 'resort',
    bookingType: 'resort',
    subGroup: 'Overnight Exclusive (22 Hrs)',
    name: 'Family Package (Overnight Exclusive)',
    shortName: 'Family Package (4–8 Pax)',
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
    badge: '22-Hr Exclusive',
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
    category: 'resort',
    bookingType: 'resort',
    subGroup: 'Overnight Exclusive (22 Hrs)',
    name: 'Barkada Package (Overnight Exclusive)',
    shortName: 'Barkada Package (9–15 Pax)',
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
    category: 'resort',
    bookingType: 'resort',
    subGroup: 'Overnight Exclusive (22 Hrs)',
    name: 'Mid Group Package (Overnight Exclusive)',
    shortName: 'Mid Group (16–20 Pax)',
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
    badge: 'Includes Barkada & Family Rooms',
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
    category: 'resort',
    bookingType: 'resort',
    subGroup: 'Overnight Exclusive (22 Hrs)',
    name: 'Whole Resort Package (Up to 30 Pax)',
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
    badge: 'Includes ALL Resort Rooms',
    includedRooms: 'Includes ALL 4 Resort Rooms (Overlooking, Family, Barkada & Cozy)',
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

  // --- 2. STAYCATION BOOKING ROOMS (MON-THURS & NON-HOLIDAYS ONLY, 22 HRS) ---
  {
    id: 'staycation-overlooking',
    category: 'staycation',
    bookingType: 'staycation',
    subGroup: '22-Hour Staycation Rooms',
    name: 'Staycation: Overlooking Room',
    shortName: 'Overlooking Room (2–4 Pax)',
    duration: '22 Hours (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN (Next Day)',
    minPax: 2,
    maxPax: 4,
    paxLabel: '2–4 Pax',
    weekdayRate: 3000,
    weekendRate: null,
    monThuOnly: true,
    excessFeePerHead: 200,
    gasIncluded: true,
    gasFeeOption: 0,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: '2 Double Beds • Private CR',
    includedRooms: '2 Double Beds, Private CR',
    description:
      'Ideal for couples or small families seeking a peaceful weekday riverfront staycation. Features 2 Double Beds, Private CR, Air-conditioning, and FREE use of Kitchen Gas.',
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
    bookingType: 'staycation',
    subGroup: '22-Hour Staycation Rooms',
    name: 'Staycation: Family Room',
    shortName: 'Family Room (4–6 Pax)',
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
    badge: '2 Double Beds + Single/Sofa • Private CR',
    includedRooms: '2 Double Beds + Single/Sofa, Private CR',
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
    bookingType: 'staycation',
    subGroup: '22-Hour Staycation Rooms',
    name: 'Staycation: Barkada Room',
    shortName: 'Barkada Room (12–15 Pax)',
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
    badge: 'Bunk Beds + Sofa Bed • Private CR',
    includedRooms: 'Bunk Beds, Sofa Bed, Private CR',
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
    bookingType: 'staycation',
    subGroup: '22-Hour Staycation Rooms',
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
    badge: '4 Single Mattresses • Common CR',
    includedRooms: '4 Single Mattresses, Common CR',
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

  // --- 3. EVENTS BOOKING (FOR RESERVATIONS & INQUIRIES) ---
  {
    id: 'event-birthday',
    category: 'events',
    bookingType: 'events',
    subGroup: 'Celebrations & Gatherings',
    name: 'Birthday & Milestone Celebration',
    shortName: 'Birthday / Milestone Party',
    duration: 'Flexible Event Hours (By Arrangement)',
    checkIn: 'Custom Schedule',
    checkOut: 'Custom Schedule',
    minPax: 20,
    maxPax: 80,
    paxLabel: '30–80+ Guests',
    weekdayRate: 0,
    weekendRate: 0,
    isEvent: true,
    monThuOnly: false,
    excessFeePerHead: 0,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Price Upon Inquiry',
    includedRooms: 'Function Space, Pool, Riverside Balcony & Optional Rooms',
    description:
      'Celebrate birthdays, debuts, christenings, or anniversaries with a scenic riverside backdrop, covered function space, and pool access.',
    inclusions: [
      'Covered Function Space & Open Garden Areas',
      'Scenic Riverside Balcony backdrop for photos',
      'Swimming Pool & Recreational Area access',
      'Kitchen Area access for catering or food prep',
      'Customizable room inclusions based on guest count'
    ]
  },
  {
    id: 'event-reunion',
    category: 'events',
    bookingType: 'events',
    subGroup: 'Celebrations & Gatherings',
    name: 'Family Reunion & Clan Gathering',
    shortName: 'Family Reunion',
    duration: 'Full Day or Overnight Event',
    checkIn: 'Custom Schedule',
    checkOut: 'Custom Schedule',
    minPax: 25,
    maxPax: 100,
    paxLabel: '30–100 Guests',
    weekdayRate: 0,
    weekendRate: 0,
    isEvent: true,
    monThuOnly: false,
    excessFeePerHead: 0,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Price Upon Inquiry',
    includedRooms: 'Whole Resort Grounds, Function Pavilion & Rooms',
    description:
      'Bring the whole family together by the Angat River with plenty of open space for games, shared meals, swimming, and multi-generational bonding.',
    inclusions: [
      'Exclusive Function Space & Dining Area',
      'Recreational Court for family games & activities',
      'Adult & Kiddie Swimming Pool access',
      'Optional Whole Resort room bundle for elders & kids',
      'Generous On-site Parking'
    ]
  },
  {
    id: 'event-corporate',
    category: 'events',
    bookingType: 'events',
    subGroup: 'Celebrations & Gatherings',
    name: 'Corporate Outing / Team Building',
    shortName: 'Team Building / Retreat',
    duration: 'Custom Day or Overnight Schedule',
    checkIn: 'Custom Schedule',
    checkOut: 'Custom Schedule',
    minPax: 15,
    maxPax: 60,
    paxLabel: '15–60+ Pax',
    weekdayRate: 0,
    weekendRate: 0,
    isEvent: true,
    monThuOnly: false,
    excessFeePerHead: 0,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Price Upon Inquiry',
    includedRooms: 'Function Hall, Activity Court, Pool & Group Rooms',
    description:
      'Energize your team in a refreshing riverside setting complete with an outdoor activity court for team-building games, covered pavilion, and group rooms.',
    inclusions: [
      'Open Recreational / Badminton Court for team games',
      'Covered Function Space for workshops & dining',
      'Swimming Pool & Riverside Balcony lounge',
      'Flexible group room accommodations'
    ]
  }
];

// ============================================================================
// 3. VISUAL AMENITIES PHOTO SHOWCASE DATA (LINKED TO SITE_IMAGES)
// ============================================================================

const AMENITIES_GALLERY = [
  {
    id: 'amenity-pool',
    title: 'Swimming Pool Area',
    tag: 'Adult & Kiddie Pool Sections',
    localSrc: SITE_IMAGES.swimmingPoolArea,
    fallbackSrc: FALLBACK_IMAGES.swimmingPoolArea,
    icon: Waves,
    description:
      'Refreshing blue-tiled swimming pool with dedicated adult and kiddie sections, overhead sun-shade canopy, and warm string lighting for relaxing night swims.',
    highlights: ['Overhead Shade Canopy', 'Kiddie & Adult Sections', 'Warm Night String Lights']
  },
  {
    id: 'amenity-balcony',
    title: 'Riverside Balcony Area',
    tag: 'Direct Angat River & Sunset View',
    localSrc: SITE_IMAGES.riversideBalconyArea,
    fallbackSrc: FALLBACK_IMAGES.riversideBalconyArea,
    icon: Sun,
    description:
      'Our signature elevated deck overlooking the tranquil Angat River. The best spot at the resort for morning coffee, golden-hour sunset photos, and cool evening breezes.',
    highlights: ['Unobstructed River View', 'Golden Sunset Backdrop', 'Breezy Open-Air Deck']
  },
  {
    id: 'amenity-function',
    title: 'Function Space & Pavilion',
    tag: 'Ideal for Dining, Karaoke & Events',
    localSrc: SITE_IMAGES.functionSpace,
    fallbackSrc: FALLBACK_IMAGES.functionSpace,
    icon: PartyPopper,
    description:
      'A spacious, well-ventilated covered pavilion right beside the pool and staircase—perfect for group meals, birthday setups, family reunions, and bonding.',
    highlights: ['Covered Dining & Event Hall', 'Beside Pool & Kitchen', 'Great for Celebrations']
  },
  {
    id: 'amenity-kitchen',
    title: 'Kitchen & Prep Area',
    tag: 'Bring Food • No Corkage Fee',
    localSrc: SITE_IMAGES.kitchenArea,
    fallbackSrc: FALLBACK_IMAGES.kitchenArea,
    icon: Utensils,
    description:
      'Prepare hot meals for your family or barkada with ease. Features tiled prep counters, sink, and gas stove access (free gas use on Mon–Thu Staycations; optional ₱400 on Resort Packages).',
    highlights: ['No Corkage on Food/Drinks', 'Prep Counter & Sink', 'Free Gas on Staycations']
  },
  {
    id: 'amenity-recreation',
    title: 'Recreational / Activities Area',
    tag: 'Badminton, Games & Parking Court',
    localSrc: SITE_IMAGES.recreationalArea,
    fallbackSrc: FALLBACK_IMAGES.recreationalArea,
    icon: Sparkles,
    description:
      'Wide open concrete court area where kids, families, and barkadas can play badminton, organize team-building games, or park multiple private vehicles securely inside the gate.',
    highlights: ['Badminton & Outdoor Games', 'Kid-Friendly Open Space', 'Secure Gated Parking']
  },
  {
    id: 'amenity-garden',
    title: 'Riverside Garden & Lounge',
    tag: 'Umbrella Tables & Pet-Friendly',
    localSrc: SITE_IMAGES.gardenArea,
    fallbackSrc: FALLBACK_IMAGES.gardenArea,
    icon: Trees,
    description:
      'Surrounded by lush trees and tropical plants along the riverbank, featuring outdoor umbrella seating where you can unwind with loved ones and well-behaved pets.',
    highlights: ['Shaded Umbrella Seating', 'Pet-Friendly Grounds', 'Peaceful Nature Vibe']
  }
];

// ============================================================================
// 4. OFFICIAL 4 ROOMS DATA (FAMILY DELUXE REMOVED; LINKED TO SITE_IMAGES)
// ============================================================================

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
    localSrc: SITE_IMAGES.overlookingRoom,
    image: FALLBACK_IMAGES.overlookingRoom
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
    localSrc: SITE_IMAGES.familyRoom,
    image: FALLBACK_IMAGES.familyRoom
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
    localSrc: SITE_IMAGES.barkadaRoom,
    image: FALLBACK_IMAGES.barkadaRoom
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
    localSrc: SITE_IMAGES.cozyRoom,
    image: FALLBACK_IMAGES.cozyRoom
  }
];

// ============================================================================
// 5. PHILIPPINE HOLIDAYS (2026 & 2027)
// ============================================================================

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

// ============================================================================
// 6. OFFICIAL FAQS DATA
// ============================================================================

const FAQS_DATA = [
  {
    question: 'What is the difference between Resort Booking, Staycation Booking, and Events Booking?',
    answer:
      '1) Resort Booking (Available Any Day) gives your group exclusive access to the swimming pools, riverside balcony, function space, and included room(s) via Day Tour, Night Tour, or 22-Hr Overnight Packages. 2) Staycation Booking (Mon–Thurs & Non-Holidays Only) is a 22-hour air-conditioned room stay (₱3,000–₱6,000) with free Kitchen Gas use for a quiet weekday retreat. 3) Events Booking is for birthdays, family reunions, and larger celebrations requiring custom arrangements.'
  },
  {
    question: 'What are your check-in and check-out times?',
    answer:
      'For Day Tours, arrival is from 8:00 AM and departure is around 5:00 PM. For Night Tours, check-in starts at 7:00 PM and ends by 6:00 AM the next day. For Overnight Exclusive Packages and 22-Hour Staycation Rooms, check-in is at 2:00 PM while check-out is at 12:00 NN the next day.'
  },
  {
    question: 'How do I book a tour, room, or event?',
    answer:
      'Use our 3-Step Rate Calendar above: (1) Choose Resort, Staycation, or Events Booking, (2) Pick your specific Package or Room, and (3) Click your preferred date on the calendar to compute your total rate. Then click "Reserve This Date" to copy your summary and submit via our official Google Form (https://forms.gle/STv73fxDoKJxDC4A7) or Facebook/Instagram.'
  },
  {
    question: 'What is included in the tour packages?',
    answer:
      'Each Day or Night Tour package includes one complimentary room (Overlooking Room) and full access to our resort amenities: Swimming Pool Area, Riverside Balcony Area, Recreational/Activities Area, Kitchen Area, Garden Area, and Function Space.'
  },
  {
    question: 'Are extra persons allowed in the room or package?',
    answer:
      'Yes, extra guests are welcome, subject to room and resort capacity limits. An excess guest fee applies for guests exceeding the maximum package capacity: ₱150/head for Day Tour, and ₱200/head for Night Tour, Overnight Exclusive Packages, and Staycations.'
  },
  {
    question: 'Are meals included in the packages? What about the Kitchen Gas Fee?',
    answer:
      'Meals are not included, but you may use our Kitchen Area to prepare your own food or bring your own snacks without corkage. For Staycation (Mon–Thu) bookings, use of Kitchen Gas is already INCLUDED for free. For Resort Bookings (Day Tour, Night Tour, and Overnight Exclusive Packages), there is an optional ₱400 fee if you wish to use the kitchen gas/stove.'
  },
  {
    question: 'Is parking available and is the resort kid-friendly & pet-friendly?',
    answer:
      'Absolutely! We provide free on-site gated parking for guests. Our resort is very kid-friendly with pools, recreational courts, and open spaces. Pets are also welcome—owners are simply responsible for cleaning up after their pets and ensuring they are well-managed during the stay.'
  }
];

// ============================================================================
// 7. HELPER FUNCTIONS
// ============================================================================

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

// Computes rate & availability of a specific date for the selected package/room/event
const getDayRateInfo = (dateKey, pkg, customHolidays) => {
  const dateObj = parseDateKey(dateKey);
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon ... 4 = Thu, 5 = Fri, 6 = Sat
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
  const holidayName = DEFAULT_PH_HOLIDAYS[dateKey] || customHolidays[dateKey] || null;
  const isHoliday = Boolean(holidayName);
  const isPeakDay = isWeekend || isHoliday;

  if (pkg.isEvent) {
    return {
      available: true,
      isEvent: true,
      rate: 0,
      rateLabel: 'Inquire Rate',
      tierLabel: isHoliday
        ? `Holiday Event (${holidayName})`
        : isWeekend
        ? 'Weekend Event (Fri–Sun)'
        : 'Weekday Event (Mon–Thu)',
      isPeakDay,
      isWeekend,
      isHoliday,
      holidayName
    };
  }

  // Staycation 22-Hr Rooms: Mon-Thurs & Non-Holidays ONLY
  if (pkg.monThuOnly) {
    if (isPeakDay) {
      return {
        available: false,
        rate: null,
        rateLabel: 'Mon–Thu Only',
        tierLabel: isHoliday
          ? `Unavailable on Holiday (${holidayName})`
          : 'Unavailable on Fri–Sun (Choose Resort Booking)',
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
      tierLabel: 'Staycation Room Rate (Mon–Thu)',
      isPeakDay: false,
      isWeekend: false,
      isHoliday: false,
      holidayName: null
    };
  }

  // Resort Booking Packages (Available Any Day)
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

// ============================================================================
// 8. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lightbox Modal for Amenity Photos
  const [activeLightboxAmenity, setActiveLightboxAmenity] = useState(null);

  // Calendar State
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // STEP 1 State: 'resort' | 'staycation' | 'events'
  const [selectedBookingType, setSelectedBookingType] = useState('resort');

  // STEP 2 State: Selected Package / Room / Event Option
  const [selectedPackageId, setSelectedPackageId] = useState('day-tour');

  // STEP 3 State: Selected Date on Calendar
  const initialDateKey = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    return toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
  }, [today]);

  const [selectedDateKey, setSelectedDateKey] = useState(initialDateKey);
  const [customHolidays, setCustomHolidays] = useState({});
  const [holidayToggleMode, setHolidayToggleMode] = useState(false);

  // Calculator Add-on & Inquiry States
  const [guestCount, setGuestCount] = useState(10);
  const [includeGasFee, setIncludeGasFee] = useState(false);
  const [extendedHours, setExtendedHours] = useState(0);
  const [eventTimePreference, setEventTimePreference] = useState('Daytime Event (8:00 AM – 5:00 PM)');
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [guestNotes, setGuestNotes] = useState('');

  // Reservation Summary Modal & FAQ
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Active Step 1 Booking Type Object
  const activeBookingTypeObj = useMemo(
    () => BOOKING_TYPES.find((b) => b.id === selectedBookingType) || BOOKING_TYPES[0],
    [selectedBookingType]
  );

  // Active Step 2 Options (Filtered strictly by Step 1 choice so customers aren't overwhelmed)
  const step2Options = useMemo(
    () => PACKAGES_DATA.filter((p) => p.category === selectedBookingType),
    [selectedBookingType]
  );

  // Currently selected package/room/event object
  const selectedPackage = useMemo(
    () => PACKAGES_DATA.find((p) => p.id === selectedPackageId) || step2Options[0],
    [selectedPackageId, step2Options]
  );

  // Switch Step 1 Booking Category (Resort vs Staycation vs Events)
  const handleSelectBookingType = (typeId, scrollToStep = false) => {
    setSelectedBookingType(typeId);
    const firstMatch = PACKAGES_DATA.find((p) => p.category === typeId);
    if (firstMatch) {
      setSelectedPackageId(firstMatch.id);
      if (typeId === 'staycation') {
        setGuestCount(firstMatch.maxPax);
        // If current selected date is a weekend, automatically jump to next Monday so Staycation shows available immediately
        const currentObj = parseDateKey(selectedDateKey);
        const dow = currentObj.getDay();
        if (dow === 0 || dow === 5 || dow === 6) {
          const daysToAdd = dow === 5 ? 3 : dow === 6 ? 2 : 1;
          const nextMon = new Date(
            currentObj.getFullYear(),
            currentObj.getMonth(),
            currentObj.getDate() + daysToAdd
          );
          setSelectedDateKey(
            toDateKey(nextMon.getFullYear(), nextMon.getMonth(), nextMon.getDate())
          );
          setCurrentMonth(nextMon.getMonth());
          setCurrentYear(nextMon.getFullYear());
        }
      } else if (typeId === 'events') {
        setGuestCount(40);
      } else {
        setGuestCount(10);
      }
    }

    if (scrollToStep) {
      const el = document.getElementById('booking-calendar');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Switch specific package/room in Step 2 (and sync Step 1 if triggered from another section)
  const handleSelectPackage = (pkgId, scrollToCal = false) => {
    const pkg = PACKAGES_DATA.find((p) => p.id === pkgId);
    if (!pkg) return;

    if (pkg.category !== selectedBookingType) {
      setSelectedBookingType(pkg.category);
    }
    setSelectedPackageId(pkgId);

    if (guestCount < pkg.minPax) {
      setGuestCount(pkg.minPax);
    } else if (guestCount > pkg.maxPax) {
      setGuestCount(pkg.maxPax);
    }

    // If user picked a Staycation room on a weekend date, jump to next Monday automatically
    if (pkg.monThuOnly) {
      const currentObj = parseDateKey(selectedDateKey);
      const dow = currentObj.getDay();
      if (dow === 0 || dow === 5 || dow === 6) {
        const daysToAdd = dow === 5 ? 3 : dow === 6 ? 2 : 1;
        const nextMon = new Date(
          currentObj.getFullYear(),
          currentObj.getMonth(),
          currentObj.getDate() + daysToAdd
        );
        setSelectedDateKey(
          toDateKey(nextMon.getFullYear(), nextMon.getMonth(), nextMon.getDate())
        );
        setCurrentMonth(nextMon.getMonth());
        setCurrentYear(nextMon.getFullYear());
      }
    }

    if (scrollToCal) {
      const el = document.getElementById('booking-calendar');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Monthly Calendar Cells
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

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
    const bookingCategoryName = activeBookingTypeObj.title;
    const lines = [
      '=== THE FORTS RIVERSIDE PRIVATE RESORT — BOOKING INQUIRY ===',
      `Booking Category: ${bookingCategoryName}`,
      `Selected Option: ${selectedPackage.name} (${selectedPackage.paxLabel})`,
      `Target Date: ${formatReadableDate(selectedDateKey)}`,
      selectedPackage.isEvent
        ? `Preferred Event Schedule: ${eventTimePreference}`
        : `Schedule: ${selectedPackage.duration}`,
      `Rate Tier: ${selectedDateInfo?.tierLabel || 'Standard'}`,
      selectedPackage.isEvent
        ? `Estimated Event Guests: ${guestCount} Pax`
        : `Total Guests: ${guestCount} Pax (${priceBreakdown.excessGuests} excess pax)`,
      !selectedPackage.isEvent
        ? `Kitchen Gas: ${
            selectedPackage.gasIncluded
              ? 'Included Free (Staycation)'
              : includeGasFee
              ? 'Yes (+Php 400)'
              : 'No'
          }`
        : '',
      !selectedPackage.isEvent
        ? `Extended Hours: ${extendedHours} hr(s) (+Php ${priceBreakdown.extendedFee})`
        : '',
      selectedPackage.isEvent
        ? 'Rate Status: Requesting Custom Event Price Quotation'
        : `Estimated Total Rate: ${formatPHP(priceBreakdown.total)}`,
      guestName ? `Guest Name: ${guestName}` : '',
      guestContact ? `Contact Info: ${guestContact}` : '',
      guestNotes ? `Event / Special Notes: ${guestNotes}` : '',
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
    <div
      className="min-h-screen bg-white text-slate-800 selection:bg-[#0B3553] selection:text-white"
      style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-brand-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
      `}</style>

      {/* ==========================================
          TOP ANNOUNCEMENT BAR (RIVERSIDE BLUE & BEIGE)
      ========================================== */}
      <div className="bg-[#0B3553] text-white text-xs sm:text-sm py-2.5 px-4 text-center border-b border-[#C8AD7F]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#F5EFE6]">
            <Sparkles className="w-3.5 h-3.5 text-[#C8AD7F]" />
            Updated 2026 Rates Now Live!
          </span>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="text-white/90">Staycation 22-Hr Rooms from ₱3,000 (Mon–Thu)</span>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="text-white/90">
            Day Tours from ₱4,500 & Overnight Exclusive from ₱7,999
          </span>
        </div>
      </div>

      {/* ==========================================
          STICKY NAVIGATION BAR (CLEAN WHITE & BLUE/BEIGE)
      ========================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Title (Logo only renders if SITE_IMAGES.logo is set) */}
          <a href="#home" className="flex items-center gap-3.5 group">
            <FortsBrandLogo className="w-12 h-12 group-hover:scale-105 transition-transform" />
            <div>
              <span className="block text-2xl sm:text-[28px] font-brand-serif font-bold tracking-tight text-[#0B3553] leading-none">
                The Forts Riverside
              </span>
              <span className="block text-[10px] sm:text-[11px] text-[#9A7B46] font-bold tracking-[0.24em] uppercase mt-1">
                Private Resort
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#home" className="hover:text-[#0B3553] transition-colors">
              Home
            </a>
            <a
              href="#booking-calendar"
              className="text-[#0B3553] font-bold flex items-center gap-1.5 bg-[#F5EFE6] px-3.5 py-1.5 rounded-full border border-[#E6DBC8] hover:bg-[#ebe1d1] transition-colors"
            >
              <CalendarIcon className="w-4 h-4 text-[#0B3553]" />
              Rate Calendar
            </a>
            <a href="#amenities" className="hover:text-[#0B3553] transition-colors">
              Amenities Photos
            </a>
            <a href="#packages" className="hover:text-[#0B3553] transition-colors">
              Packages & Rates
            </a>
            <a href="#rooms" className="hover:text-[#0B3553] transition-colors">
              Rooms
            </a>
            <a href="#directions" className="hover:text-[#0B3553] transition-colors">
              Directions
            </a>
            <a href="#faqs" className="hover:text-[#0B3553] transition-colors">
              FAQs
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#booking-calendar"
              className="inline-flex items-center gap-2 bg-[#0B3553] hover:bg-[#16486B] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-[#F5EFE6]" />
              Book Now!
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-[#0B3553] hover:bg-[#F5EFE6]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              Home
            </a>
            <a
              href="#booking-calendar"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8] font-bold"
            >
              3-Step Rate Calendar & Booking
            </a>
            <a
              href="#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              Amenities Photo Gallery
            </a>
            <a
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              Packages & Updated Rates
            </a>
            <a
              href="#rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              Rooms (Overlooking, Family, Barkada, Cozy)
            </a>
            <a
              href="#directions"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              Directions
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              FAQs
            </a>
          </div>
        )}
      </header>

      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section id="home" className="relative overflow-hidden bg-[#0B3553] text-white">
        {/* Background Photo using SITE_IMAGES.heroBackground */}
        <div className="absolute inset-0 opacity-25">
          <SmartResortImage
            localSrc={SITE_IMAGES.heroBackground}
            fallbackSrc={FALLBACK_IMAGES.heroBackground}
            alt="The Forts Riverside Resort Background"
            className="w-full h-full object-cover scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3553]/25 via-[#0B3553]/20 to-[#0B3553]/15" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-22">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 Columns: Welcome Headline & CTAs */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5EFE6]/15 border border-[#E6DBC8]/40 text-[#F5EFE6] text-xs sm:text-sm font-medium mb-6 backdrop-blur-xs">
                <MapPin className="w-4 h-4 text-[#C8AD7F]" />
                Scenic Angat River & Beltran Street • Private Resort Sanctuary
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-brand-serif font-bold tracking-tight leading-[1.08] text-white">
                The Forts Riverside
                <span className="block text-lg sm:text-2xl font-sans font-bold tracking-[0.26em] uppercase text-[#E6DBC8] mt-3">
                  Private Resort
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-100 leading-relaxed max-w-2xl">
                A riverside haven designed for relaxation, fun, and unforgettable memories. Escape
                the noise of the city and unwind where comfort meets nature.
              </p>

              {/* Quick Jump Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="#booking-calendar"
                  className="inline-flex items-center gap-2.5 bg-[#F5EFE6] hover:bg-white text-[#0B3553] font-bold px-6 py-4 rounded-xl shadow-lg transition-all cursor-pointer text-sm sm:text-base"
                >
                  <CalendarIcon className="w-5 h-5 text-[#0B3553]" />
                  Open Rate Calendar & Book Now
                </a>
                <a
                  href="#amenities"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-xl border border-white/25 backdrop-blur-xs transition-all text-sm sm:text-base"
                >
                  <Camera className="w-4 h-4 text-[#E6DBC8]" />
                  View Amenities Photos
                </a>
              </div>
            </div>
          </div>

          {/* Quick Highlights Strip */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/15">
            <div
              onClick={() => handleSelectBookingType('staycation', true)}
              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
            >
              <p className="text-2xl sm:text-3xl font-brand-serif font-bold text-[#F5EFE6]">
                ₱3,000
              </p>
              <p className="text-xs text-slate-200 mt-0.5">
                Staycation 22-Hr Rooms (Mon–Thu) →
              </p>
            </div>
            <div
              onClick={() => handleSelectBookingType('resort', true)}
              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
            >
              <p className="text-2xl sm:text-3xl font-brand-serif font-bold text-white">₱4,500</p>
              <p className="text-xs text-slate-200 mt-0.5">
                Day Tour w/ Free Overlooking Room →
              </p>
            </div>
            <div
              onClick={() => {
                handleSelectPackage('overnight-family', true);
              }}
              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
            >
              <p className="text-2xl sm:text-3xl font-brand-serif font-bold text-[#F5EFE6]">
                ₱7,999
              </p>
              <p className="text-xs text-slate-200 mt-0.5">
                22-Hr Overnight Exclusive Packages →
              </p>
            </div>
            <div
              onClick={() => handleSelectBookingType('events', true)}
              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
            >
              <p className="text-2xl sm:text-3xl font-brand-serif font-bold text-white">Events</p>
              <p className="text-xs text-slate-200 mt-0.5">
                Birthdays, Reunions & Celebrations →
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SIMPLIFIED 3-STEP RATE CALENDAR & BOOKING FLOW
          (RESTING WHITE & SOFT BEIGE/BLUE ACCENTS)
      ========================================== */}
      <section id="booking-calendar" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0B3553] bg-[#F5EFE6] border border-[#E6DBC8] px-4 py-1.5 rounded-full mb-3">
              <CalendarIcon className="w-3.5 h-3.5 text-[#0B3553]" />
              Simple 3-Step Booking & Daily Rate Calendar
            </span>
            <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553]">
              Check Availability & Exact Daily Rates
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Follow the 3 simple steps below—start by choosing whether you want a{' '}
              <strong className="text-[#0B3553]">Resort Package</strong>, a weekday{' '}
              <strong className="text-[#0B3553]">Staycation Room</strong>, or an{' '}
              <strong className="text-[#0B3553]">Events Inquiry</strong>.
            </p>
          </div>

          {/* ==========================================
              STEP 1: CHOOSE YOUR BOOKING TYPE (3 CARDS)
          ========================================== */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#0B3553] text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#0B3553]">
                Step 1: What type of booking are you looking for?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {BOOKING_TYPES.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selectedBookingType === type.id;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleSelectBookingType(type.id)}
                    className={`text-left p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? 'bg-[#0B3553] text-white border-[#0B3553] shadow-lg ring-4 ring-[#F5EFE6]'
                        : 'bg-[#FAF8F5] hover:bg-[#F5EFE6]/70 text-slate-800 border-[#E6DBC8] hover:border-[#0B3553]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div
                          className={`p-3 rounded-xl ${
                            isSelected
                              ? 'bg-white/15 text-[#F5EFE6]'
                              : 'bg-[#0B3553]/10 text-[#0B3553]'
                          }`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>

                        <span
                          className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                            isSelected
                              ? 'bg-[#F5EFE6] text-[#0B3553]'
                              : 'bg-[#F5EFE6] text-[#8A6D3B] border border-[#E6DBC8]'
                          }`}
                        >
                          {type.badge}
                        </span>
                      </div>

                      <h4
                        className={`text-xl sm:text-2xl font-brand-serif font-bold ${
                          isSelected ? 'text-white' : 'text-[#0B3553]'
                        }`}
                      >
                        {type.title}
                      </h4>
                      <p
                        className={`text-xs font-bold mt-1 ${
                          isSelected ? 'text-[#E6DBC8]' : 'text-[#1D5B8C]'
                        }`}
                      >
                        {type.subtitle}
                      </p>
                      <p
                        className={`text-xs sm:text-sm mt-3 leading-relaxed ${
                          isSelected ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {type.shortDesc}
                      </p>
                    </div>

                    <div
                      className={`mt-5 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                        isSelected
                          ? 'border-white/20 text-[#F5EFE6]'
                          : 'border-[#E6DBC8] text-[#0B3553]'
                      }`}
                    >
                      <span>{isSelected ? 'Selected Category' : `Select ${type.title}`}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#F5EFE6]" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==========================================
              STEP 2: PICK SPECIFIC PACKAGE / ROOM / EVENT
          ========================================== */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-6 border border-[#E6DBC8] shadow-2xs mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6DBC8]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#0B3553] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0B3553]">
                    {activeBookingTypeObj.selectionPrompt}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {selectedBookingType === 'resort' &&
                      'Click a Day/Night Tour or 22-Hr Overnight Package below to display its daily rates on the calendar:'}
                    {selectedBookingType === 'staycation' &&
                      'Click which air-conditioned room you want for your 22-hour weekday staycation (includes free Kitchen Gas):'}
                    {selectedBookingType === 'events' &&
                      'Select the type of celebration you are planning so we can prepare a custom event quotation for your date:'}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold bg-white text-[#0B3553] px-3 py-1.5 rounded-lg border border-[#E6DBC8] self-start sm:self-center shrink-0">
                Showing {step2Options.length}{' '}
                {selectedBookingType === 'staycation'
                  ? 'Rooms'
                  : selectedBookingType === 'events'
                  ? 'Event Types'
                  : 'Packages'}
              </span>
            </div>

            {/* Filtered Step 2 Cards */}
            <div
              className={`mt-5 grid grid-cols-1 sm:grid-cols-2 ${
                selectedBookingType === 'resort'
                  ? 'lg:grid-cols-3'
                  : selectedBookingType === 'staycation'
                  ? 'lg:grid-cols-4'
                  : 'lg:grid-cols-3'
              } gap-3.5`}
            >
              {step2Options.map((pkg) => {
                const isSelected = pkg.id === selectedPackage.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handleSelectPackage(pkg.id)}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#0B3553] text-white border-[#0B3553] shadow-md ring-2 ring-[#C8AD7F]'
                        : 'bg-white hover:bg-[#F5EFE6]/50 text-slate-800 border-slate-200 hover:border-[#0B3553]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-[#F5EFE6] text-[#0B3553]'
                              : 'bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8]'
                          }`}
                        >
                          {pkg.paxLabel}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F5EFE6] shrink-0" />}
                      </div>

                      <p
                        className={`font-bold text-base mt-2.5 ${
                          isSelected ? 'text-white' : 'text-[#0B3553]'
                        }`}
                      >
                        {pkg.shortName}
                      </p>

                      <p
                        className={`text-xs mt-1 line-clamp-2 ${
                          isSelected ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {pkg.includedRooms}
                      </p>
                    </div>

                    <div
                      className={`mt-4 pt-2.5 border-t flex items-baseline justify-between ${
                        isSelected ? 'border-white/20' : 'border-slate-100'
                      }`}
                    >
                      {pkg.isEvent ? (
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? 'text-[#F5EFE6]' : 'text-[#1D5B8C]'
                          }`}
                        >
                          Price Upon Inquiry →
                        </span>
                      ) : pkg.monThuOnly ? (
                        <div>
                          <span className="text-lg font-extrabold">
                            {formatPHP(pkg.weekdayRate)}
                          </span>
                          <span
                            className={`text-[11px] ml-1.5 ${
                              isSelected ? 'text-[#E6DBC8]' : 'text-slate-500'
                            }`}
                          >
                            / 22 hrs (Mon–Thu)
                          </span>
                        </div>
                      ) : (
                        <div className="w-full flex items-center justify-between text-xs">
                          <span>
                            Mon–Thu: <strong>{formatPHP(pkg.weekdayRate)}</strong>
                          </span>
                          <span
                            className={
                              isSelected ? 'text-[#F5EFE6]' : 'text-[#8A6D3B] font-semibold'
                            }
                          >
                            Fri–Sun: <strong>{formatPHP(pkg.weekendRate)}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==========================================
              STEP 3: INTERACTIVE CALENDAR + SUMMARY CARD
          ========================================== */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-7 h-7 rounded-full bg-[#0B3553] text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#0B3553]">
              Step 3: Pick Your Date on the Calendar & Review Your Rate
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT 7 COLUMNS: MONTHLY CALENDAR */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Calendar Header */}
              <div className="p-5 sm:p-6 bg-[#0B3553] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#E6DBC8] font-bold">
                    Showing Daily Rates For: {selectedPackage.shortName}
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-brand-serif font-bold mt-1">
                    {monthNames[currentMonth]} {currentYear}
                  </h4>
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
                    className="px-3.5 py-1.5 rounded-lg bg-[#F5EFE6] hover:bg-white text-[#0B3553] text-xs font-bold cursor-pointer"
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

              {/* Legend & Custom Holiday Bar */}
              <div className="px-5 py-3 bg-[#FAF8F5] border-b border-[#E6DBC8] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0B3553]" />
                    Mon–Thu:{' '}
                    <strong className="text-[#0B3553]">
                      {selectedPackage.isEvent
                        ? 'Inquire Rate'
                        : formatPHP(selectedPackage.weekdayRate)}
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C8AD7F]" />
                    Fri–Sun & Holidays:{' '}
                    <strong className="text-[#8A6D3B]">
                      {selectedPackage.isEvent
                        ? 'Inquire Rate'
                        : selectedPackage.monThuOnly
                        ? 'Staycation Not Available'
                        : formatPHP(selectedPackage.weekendRate)}
                    </strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setHolidayToggleMode(!holidayToggleMode)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold border transition-colors cursor-pointer ${
                    holidayToggleMode
                      ? 'bg-[#0B3553] text-white border-[#0B3553]'
                      : 'bg-white text-[#0B3553] border-[#E6DBC8] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C8AD7F]" />
                  {holidayToggleMode ? 'Done Marking Holidays' : 'Test Holiday Rate'}
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center text-xs font-bold text-slate-500 py-2.5">
                <div className="text-[#8A6D3B]">SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div className="text-[#8A6D3B]">FRI</div>
                <div className="text-[#8A6D3B]">SAT</div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 p-2 sm:p-4 gap-1.5 sm:gap-2 bg-white">
                {calendarDays.map((dayItem, index) => {
                  if (!dayItem) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="h-20 sm:h-24 rounded-xl bg-slate-50/70"
                      />
                    );
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
                          ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-[#0B3553] text-white border-[#0B3553] shadow-md ring-2 ring-[#C8AD7F] cursor-pointer scale-[1.02] z-10'
                          : !dayItem.available
                          ? 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300 cursor-pointer'
                          : dayItem.isPeakDay
                          ? 'bg-[#FAF8F5] hover:bg-[#F5EFE6] border-[#E6DBC8] text-slate-800 cursor-pointer'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#0B3553]/60 text-slate-800 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span
                          className={`text-xs sm:text-sm font-bold leading-none ${
                            isSelected
                              ? 'text-white'
                              : dayItem.isHoliday
                              ? 'text-rose-600'
                              : dayItem.isWeekend
                              ? 'text-[#8A6D3B]'
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
                                ? 'bg-[#F5EFE6] text-[#0B3553]'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            Hol
                          </span>
                        )}
                      </div>

                      {dayItem.isHoliday && (
                        <p
                          className={`text-[9px] leading-tight line-clamp-1 ${
                            isSelected ? 'text-[#F5EFE6]' : 'text-rose-600'
                          }`}
                        >
                          {dayItem.holidayName}
                        </p>
                      )}

                      <div className="w-full mt-auto">
                        {dayItem.available ? (
                          <div
                            className={`text-[10px] sm:text-xs font-extrabold tracking-tight px-1.5 py-0.5 rounded-md inline-block w-full text-center truncate ${
                              isSelected
                                ? 'bg-[#F5EFE6] text-[#0B3553]'
                                : dayItem.isEvent
                                ? 'bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8]'
                                : dayItem.isPeakDay
                                ? 'bg-[#F5EFE6] text-[#8A6D3B] border border-[#E6DBC8]'
                                : 'bg-[#0B3553]/10 text-[#0B3553]'
                            }`}
                          >
                            {dayItem.rateLabel}
                          </div>
                        ) : (
                          <div
                            className={`text-[9px] sm:text-[10px] font-semibold px-1 py-0.5 rounded text-center leading-tight ${
                              isSelected
                                ? 'bg-rose-500/30 text-rose-100'
                                : 'bg-slate-200/70 text-slate-500'
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

              <div className="p-4 bg-[#FAF8F5] border-t border-[#E6DBC8] text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#0B3553] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0B3553]">Quick Guide:</strong> Staycation Room rates
                  (₱3,000–₱6,000) are available on <strong>Mondays to Thursdays</strong> (excluding
                  holidays). For Fridays, Saturdays, Sundays, and Holidays, switch Step 1 to{' '}
                  <button
                    type="button"
                    onClick={() => handleSelectBookingType('resort')}
                    className="text-[#0B3553] font-bold underline cursor-pointer"
                  >
                    Resort Booking
                  </button>
                  .
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLUMNS: DYNAMIC CALCULATOR OR EVENT INQUIRY PANEL */}
            <div className="lg:col-span-5 bg-[#FAF8F5] rounded-2xl border border-[#E6DBC8] shadow-sm overflow-hidden sticky top-24">
              <div className="p-5 sm:p-6 bg-[#0B3553] text-white border-b-2 border-[#C8AD7F]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] uppercase tracking-widest text-[#E6DBC8] font-bold">
                    {activeBookingTypeObj.title}
                  </span>
                  <span className="text-[11px] font-bold bg-white/15 text-[#F5EFE6] px-2.5 py-0.5 rounded-full">
                    {selectedPackage.paxLabel}
                  </span>
                </div>
                <h3 className="text-2xl font-brand-serif font-bold mt-1">
                  {selectedPackage.name.replace('Staycation: ', '')}
                </h3>
                <p className="text-xs text-slate-200 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C8AD7F]" />
                  {selectedPackage.duration}
                </p>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* Selected Date Card */}
                <div className="p-3.5 rounded-xl bg-white border border-[#E6DBC8] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6D3B] block">
                      Selected Date
                    </span>
                    <span className="text-sm font-bold text-[#0B3553]">
                      {formatReadableDate(selectedDateKey)}
                    </span>
                    <span className="block text-xs text-slate-500 font-medium mt-0.5">
                      {selectedDateInfo?.tierLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">
                      {selectedPackage.isEvent ? 'Pricing' : 'Daily Rate'}
                    </span>
                    <span className="text-lg font-extrabold text-[#0B3553]">
                      {selectedDateInfo?.available ? selectedDateInfo.rateLabel : 'Unavailable'}
                    </span>
                  </div>
                </div>

                {/* Alert if Staycation Room is selected on Fri-Sun or Holiday */}
                {selectedDateInfo && !selectedDateInfo.available && (
                  <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#C8AD7F] text-[#0B3553] space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-[#8A6D3B] shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <strong className="block text-sm text-[#0B3553] mb-0.5">
                          Staycation Rooms are Mon–Thurs Only
                        </strong>
                        You clicked a <strong>Weekend or Holiday</strong>. Please click a
                        Monday–Thursday date on the calendar, OR switch to a Resort Booking Package
                        for weekend stays:
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSelectPackage('overnight-family')}
                        className="text-xs font-bold bg-[#0B3553] hover:bg-[#16486B] text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Switch to Family Overnight (₱8,999)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPackage('day-tour')}
                        className="text-xs font-bold bg-white hover:bg-slate-50 text-[#0B3553] border border-[#0B3553]/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Switch to Day Tour (₱5,000)
                      </button>
                    </div>
                  </div>
                )}

                {/* Accommodation / Spaces Included */}
                <div className="text-xs bg-white border border-[#E6DBC8] rounded-xl p-3.5 text-slate-700 space-y-1">
                  <div className="font-bold text-[#0B3553] flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-[#1D5B8C]" />
                    {selectedPackage.isEvent
                      ? 'Event Spaces & Rooms:'
                      : 'Room / Accommodation Included:'}
                  </div>
                  <p>{selectedPackage.includedRooms}</p>
                </div>

                {/* IF EVENTS BOOKING: SHOW SIMPLE EVENT INQUIRY FIELDS */}
                {selectedPackage.isEvent ? (
                  <div className="space-y-4 pt-2 border-t border-[#E6DBC8]">
                    <div>
                      <label className="block text-xs font-bold text-[#0B3553] mb-1.5">
                        Estimated Number of Event Guests
                      </label>
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#E6DBC8]">
                        <span className="text-xs text-slate-600 pl-1">Expected Attendance:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setGuestCount(Math.max(10, guestCount - 5))}
                            className="w-8 h-8 rounded-lg bg-[#F5EFE6] text-[#0B3553] flex items-center justify-center font-bold cursor-pointer"
                          >
                            -5
                          </button>
                          <span className="w-16 text-center font-bold text-sm text-[#0B3553]">
                            {guestCount} Pax
                          </span>
                          <button
                            type="button"
                            onClick={() => setGuestCount(guestCount + 5)}
                            className="w-8 h-8 rounded-lg bg-[#F5EFE6] text-[#0B3553] flex items-center justify-center font-bold cursor-pointer"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0B3553] mb-1.5">
                        Preferred Event Schedule
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          'Daytime Event (8:00 AM – 5:00 PM)',
                          'Evening Event (7:00 PM – 6:00 AM)',
                          'Overnight 22-Hr Celebration (2:00 PM – 12:00 NN)'
                        ].map((sched) => (
                          <button
                            key={sched}
                            type="button"
                            onClick={() => setEventTimePreference(sched)}
                            className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                              eventTimePreference === sched
                                ? 'bg-[#0B3553] text-white border-[#0B3553]'
                                : 'bg-white text-slate-700 border-[#E6DBC8] hover:bg-[#F5EFE6]/50'
                            }`}
                          >
                            <span>{sched}</span>
                            {eventTimePreference === sched && (
                              <Check className="w-4 h-4 text-[#F5EFE6]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B3553] text-white space-y-1.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#E6DBC8]">
                        Events Quotation & Reservation
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        Events are custom-packaged based on your guest count and room needs. Click
                        below to send your date and event details for an official quote!
                      </p>
                    </div>
                  </div>
                ) : (
                  /* IF RESORT OR STAYCATION BOOKING: SHOW LIVE PRICE CALCULATOR */
                  <>
                    <div className="space-y-4 pt-2 border-t border-[#E6DBC8]">
                      {/* Guest Counter */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-bold text-[#0B3553] flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#1D5B8C]" />
                            Total Guests
                          </label>
                          <p className="text-xs text-slate-500">
                            Max {selectedPackage.maxPax} pax included • Excess:{' '}
                            {formatPHP(selectedPackage.excessFeePerHead)}/head
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                            className="w-8 h-8 rounded-lg bg-white border border-[#E6DBC8] flex items-center justify-center hover:bg-[#F5EFE6] cursor-pointer"
                            aria-label="Decrease guests"
                          >
                            <Minus className="w-4 h-4 text-[#0B3553]" />
                          </button>
                          <span className="w-10 text-center font-bold text-sm text-[#0B3553]">
                            {guestCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setGuestCount(guestCount + 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-[#E6DBC8] flex items-center justify-center hover:bg-[#F5EFE6] cursor-pointer"
                            aria-label="Increase guests"
                          >
                            <Plus className="w-4 h-4 text-[#0B3553]" />
                          </button>
                        </div>
                      </div>

                      {/* Kitchen Gas Option */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#E6DBC8]/70">
                        <div>
                          <span className="text-sm font-bold text-[#0B3553] flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-[#8A6D3B]" />
                            Use of Kitchen Gas
                          </span>
                          <p className="text-xs text-slate-500">
                            {selectedPackage.gasIncluded
                              ? 'Inclusive with Staycation Room'
                              : 'Optional add-on for Resort Booking (+₱400)'}
                          </p>
                        </div>

                        {selectedPackage.gasIncluded ? (
                          <span className="text-xs font-bold bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8] px-2.5 py-1 rounded-md">
                            Included Free
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIncludeGasFee(!includeGasFee)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              includeGasFee
                                ? 'bg-[#0B3553] text-white border-[#0B3553]'
                                : 'bg-white text-[#0B3553] border-[#E6DBC8] hover:bg-[#F5EFE6]'
                            }`}
                          >
                            {includeGasFee ? 'Added (+₱400)' : 'Add +₱400'}
                          </button>
                        )}
                      </div>

                      {/* Extended Hours Option */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#E6DBC8]/70">
                        <div>
                          <span className="text-sm font-bold text-[#0B3553] flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#1D5B8C]" />
                            Extended Hours (Max 2 Hrs)
                          </span>
                          <p className="text-xs text-slate-500">Additional ₱500 per hour</p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {[0, 1, 2].map((hr) => (
                            <button
                              key={hr}
                              type="button"
                              onClick={() => setExtendedHours(hr)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                extendedHours === hr
                                  ? 'bg-[#0B3553] text-white border-[#0B3553]'
                                  : 'bg-white text-[#0B3553] border-[#E6DBC8] hover:bg-[#F5EFE6]'
                              }`}
                            >
                              {hr === 0 ? 'None' : `+${hr} hr`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Itemized Breakdown Box */}
                    <div className="p-4 rounded-xl bg-[#0B3553] text-white space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#E6DBC8]">
                        Estimated Price Breakdown
                      </div>

                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-slate-200">{selectedPackage.shortName}</span>
                        <span className="font-semibold">
                          {priceBreakdown.available ? formatPHP(priceBreakdown.baseRate) : '—'}
                        </span>
                      </div>

                      {priceBreakdown.excessGuests > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm text-[#F5EFE6]">
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
                        <span className="text-slate-200">Kitchen Gas Fee</span>
                        <span className="font-semibold text-[#F5EFE6]">
                          {selectedPackage.gasIncluded
                            ? 'Included Free (₱0)'
                            : includeGasFee
                            ? '+₱400'
                            : '₱0'}
                        </span>
                      </div>

                      {extendedHours > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm text-[#F5EFE6]">
                          <span>Extended Hours ({extendedHours} hr × ₱500)</span>
                          <span className="font-semibold">
                            +{formatPHP(priceBreakdown.extendedFee)}
                          </span>
                        </div>
                      )}

                      <div className="pt-2.5 border-t border-white/20 flex items-baseline justify-between">
                        <span className="text-sm font-bold text-white">Total Estimated Rate</span>
                        <span className="text-2xl font-brand-serif font-extrabold text-[#F5EFE6]">
                          {priceBreakdown.available
                            ? formatPHP(priceBreakdown.total)
                            : 'Select Mon–Thu'}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Primary Reserve CTA */}
                <button
                  type="button"
                  disabled={!selectedDateInfo?.available}
                  onClick={() => setBookingModalOpen(true)}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all ${
                    selectedDateInfo?.available
                      ? 'bg-[#1D5B8C] hover:bg-[#0B3553] text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CalendarIcon className="w-5 h-5 text-[#F5EFE6]" />
                  {selectedPackage.isEvent
                    ? 'Request Event Quotation for This Date'
                    : selectedDateInfo?.available
                    ? 'Reserve This Date & Package'
                    : 'Select a Mon–Thu Date or Switch to Resort Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          VISUAL AMENITIES & INCLUSIONS PHOTO GALLERY
          (USES SITE_IMAGES SO CUSTOMERS SEE WHAT THEY GET)
      ========================================== */}
      <section id="amenities" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E6DBC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0B3553] bg-[#F5EFE6] border border-[#E6DBC8] px-3.5 py-1.5 rounded-full mb-3">
                <Camera className="w-3.5 h-3.5 text-[#0B3553]" />
                Resort Photo Tour & Inclusions
              </span>
              <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553]">
                See the Amenities You’ll Be Enjoying
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                Experience a peaceful escape at our humble riverside retreat. Click any photo below
                to view a closer look at our swimming pool, scenic balcony over the water, kitchen,
                and recreation spaces.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#0B3553] px-3.5 py-2 rounded-xl border border-[#E6DBC8]">
                <ShieldCheck className="w-4 h-4 text-[#1D5B8C]" />
                Exclusive Use Available
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#0B3553] px-3.5 py-2 rounded-xl border border-[#E6DBC8]">
                <PawPrint className="w-4 h-4 text-[#8A6D3B]" />
                Pet & Kid-Friendly
              </span>
            </div>
          </div>

          {/* 6-Card Photo Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {AMENITIES_GALLERY.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveLightboxAmenity(item)}
                  className="group bg-white rounded-2xl border border-[#E6DBC8] overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Photo Container */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                      <SmartResortImage
                        localSrc={item.localSrc}
                        fallbackSrc={item.fallbackSrc}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B3553]/70 via-transparent to-transparent opacity-80" />

                      {/* Top Tag */}
                      <div className="absolute top-3.5 left-3.5">
                        <span className="bg-white/95 backdrop-blur-xs text-[#0B3553] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                          {item.tag}
                        </span>
                      </div>

                      {/* Expand Icon */}
                      <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#0B3553]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-4 h-4" />
                      </div>

                      {/* Bottom Title Overlay */}
                      <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-2.5 text-white">
                        <div className="p-2 rounded-lg bg-[#0B3553]/90 border border-white/20 text-[#F5EFE6]">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <h3 className="text-xl font-brand-serif font-bold leading-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description & Highlights */}
                    <div className="p-5">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {item.highlights.map((hl, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#F5EFE6] text-[#0B3553] px-2.5 py-1 rounded-md border border-[#E6DBC8]"
                          >
                            <Check className="w-3 h-3 text-[#1D5B8C]" />
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-[#FAF8F5] border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5B8C] group-hover:text-[#0B3553]">
                    <span>Click to enlarge photo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          COMPLETE PACKAGES & UPDATED RATES OVERVIEW
          (INCLUDES SECTIONS 1, 2, AND YOUR EXACT SECTION 3)
      ========================================== */}
      <section id="packages" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[#8A6D3B] font-bold text-xs uppercase tracking-[0.2em]">
              Complete Transparent Price List
            </span>
            <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553] mt-2">
              Updated Resort Packages & Staycation Rates
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Compare all of our packages at a glance. Click any option to load it directly into the
              Rate Calendar above.
            </p>
          </div>

          <div className="space-y-14">
            {/* 1. RESORT BOOKING: DAY & NIGHT TOURS */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1D5B8C]">
                    Resort Booking • Available Any Day
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-brand-serif font-bold text-[#0B3553]">
                    Day Tour & Night Tour Packages
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 sm:mt-0">
                  Includes 1 Complimentary Overlooking Room + Full Resort Amenities Access
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PACKAGES_DATA.filter((p) => p.id === 'day-tour' || p.id === 'night-tour').map(
                  (pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-2xl border border-[#E6DBC8] bg-[#FAF8F5] hover:bg-white p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#0B3553] text-white px-3 py-1 rounded-full">
                            {pkg.id === 'day-tour' ? (
                              <Sun className="w-3.5 h-3.5 text-[#F5EFE6]" />
                            ) : (
                              <Moon className="w-3.5 h-3.5 text-[#F5EFE6]" />
                            )}
                            {pkg.duration}
                          </span>
                          <span className="text-xs font-semibold text-[#8A6D3B]">
                            Excess guest: ₱{pkg.excessFeePerHead}/head
                          </span>
                        </div>

                        <h4 className="text-2xl sm:text-3xl font-brand-serif font-bold text-[#0B3553]">
                          {pkg.name}
                        </h4>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3 p-4 rounded-xl bg-white border border-[#E6DBC8]">
                          <div>
                            <span className="text-[11px] font-bold uppercase text-slate-400 block">
                              Mon – Thurs
                            </span>
                            <span className="text-2xl font-extrabold text-[#0B3553]">
                              {formatPHP(pkg.weekdayRate)}
                            </span>
                          </div>
                          <div className="border-l border-[#E6DBC8] pl-3">
                            <span className="text-[11px] font-bold uppercase text-[#8A6D3B] block">
                              Fri – Sun & Holidays
                            </span>
                            <span className="text-2xl font-extrabold text-[#1D5B8C]">
                              {formatPHP(pkg.weekendRate)}
                            </span>
                          </div>
                        </div>

                        <ul className="mt-5 space-y-2">
                          {pkg.inclusions.map((inc, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs sm:text-sm text-slate-700"
                            >
                              <Check className="w-4 h-4 text-[#1D5B8C] shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#E6DBC8] flex items-center justify-between gap-4">
                        <span className="text-xs text-slate-500">
                          Optional: +₱400 Kitchen Gas • +₱500/hr Extended (max 2 hrs)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectPackage(pkg.id, true)}
                          className="shrink-0 inline-flex items-center gap-1.5 bg-[#0B3553] hover:bg-[#16486B] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                        >
                          Select in Calendar
                          <ArrowRight className="w-4 h-4 text-[#F5EFE6]" />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* 2. OVERNIGHT EXCLUSIVE PACKAGES (2:00 PM - 12:00 NN) */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1D5B8C]">
                    Resort Booking • 22 Hours (2:00 PM – 12:00 NN)
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-brand-serif font-bold text-[#0B3553]">
                    Overnight Exclusive Packages (Any Day)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 sm:mt-0">
                  Excess overnight guest fee: ₱200/head • Optional Kitchen Gas: +₱400
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {PACKAGES_DATA.filter((p) => p.subGroup === 'Overnight Exclusive (22 Hrs)').map(
                  (pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-2xl border border-slate-200 bg-white hover:border-[#0B3553]/40 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8] px-2.5 py-1 rounded-md">
                            {pkg.paxLabel}
                          </span>
                          <span className="text-[11px] font-bold text-[#1D5B8C]">22 Hours</span>
                        </div>

                        <h4 className="text-xl font-brand-serif font-bold text-[#0B3553] mt-3">
                          {pkg.shortName}
                        </h4>
                        <p className="text-xs font-semibold text-[#8A6D3B] mt-1">
                          {pkg.includedRooms}
                        </p>

                        <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#E6DBC8] space-y-2">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-slate-600 font-medium">Mon–Thurs:</span>
                            <span className="text-lg font-extrabold text-[#0B3553]">
                              {formatPHP(pkg.weekdayRate)}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between border-t border-[#E6DBC8] pt-1.5">
                            <span className="text-xs text-[#8A6D3B] font-medium">
                              Fri–Sun & Hol:
                            </span>
                            <span className="text-lg font-extrabold text-[#1D5B8C]">
                              {formatPHP(pkg.weekendRate)}
                            </span>
                          </div>
                        </div>

                        <ul className="mt-4 space-y-1.5">
                          {pkg.inclusions.slice(0, 4).map((inc, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-1.5 text-xs text-slate-600"
                            >
                              <Check className="w-3.5 h-3.5 text-[#1D5B8C] shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectPackage(pkg.id, true)}
                        className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[#0B3553] hover:bg-[#16486B] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-[#F5EFE6]" />
                        Check Dates & Book
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* 3. STAYCATION BOOKING (MON-THURS & NON-HOLIDAYS: 22 HRS ROOMS) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0B3553] to-[#07243A] text-white shadow-lg">
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
    <div>
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-[#B89B67] text-white px-3 py-1 rounded-full">
        Staycation Booking • Mon–Thurs & Non-Holidays
      </span>
      <h3 className="text-2xl sm:text-3xl font-serif font-bold mt-2">
        22-Hour Staycation Rooms (Inclusive of Kitchen Gas)
      </h3>
      <p className="text-sm text-[#EFE9DC] mt-1">
        Check-in 2:00 PM – Check-out 12:00 NN • Additional ₱500 per extended hour (max 2 hrs)
      </p>
    </div>
  </div>

  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {PACKAGES_DATA.filter((p) => p.category === 'staycation').map((pkg) => (
      <div
        key={pkg.id}
        className="p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col justify-between hover:bg-white/10 hover:border-[#B89B67]/50 transition-all group"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#B89B67] uppercase">
              {pkg.paxLabel}
            </span>
            <span className="text-[11px] bg-[#EFE9DC]/10 text-[#EFE9DC] border border-[#EFE9DC]/20 px-2 py-0.5 rounded">
              Free Gas Use
            </span>
          </div>
          <h4 className="text-lg font-bold text-white mt-2">
            {pkg.name.replace('Staycation: ', '')}
          </h4>
          <p className="text-xs text-blue-100 mt-1">{pkg.includedRooms}</p>
          <p className="text-3xl font-extrabold text-[#B89B67] mt-4">
            {formatPHP(pkg.weekdayRate)}
          </p>
          <span className="text-[11px] text-[#EFE9DC] block mt-1">
            22 Hours • Mon–Thurs Only
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleSelectPackage(pkg.id, true)}
          className="mt-5 w-full py-2.5 px-3 rounded-lg bg-[#B89B67] hover:bg-[#9d8355] text-white font-bold text-xs transition-colors cursor-pointer group-hover:shadow-md"
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
          OFFICIAL 4 ROOMS & STAYCATION SECTION
          (USES SITE_IMAGES FOR EACH ROOM)
      ========================================== */}
      <section id="rooms" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E6DBC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0B3553] bg-[#F5EFE6] border border-[#E6DBC8] px-3.5 py-1.5 rounded-full mb-3">
              <BedDouble className="w-3.5 h-3.5 text-[#0B3553]" />
              Staycation Booking (Mon–Thurs) & Resort Rooms
            </span>
            <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553]">
              Our 4 Air-Conditioned Rooms
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Book an individual room for a <strong>22-Hour Weekday Staycation</strong> (Mon–Thurs
              & Non-Holidays, inclusive of free Kitchen Gas), or enjoy them as part of our Overnight
              Exclusive Packages on any day of the week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ROOMS_DATA.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-[#E6DBC8] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <SmartResortImage
                    localSrc={room.localSrc}
                    fallbackSrc={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="bg-[#0B3553]/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#F5EFE6]" />
                      {room.capacity}
                    </span>
                    <span className="bg-white/95 backdrop-blur-xs text-[#0B3553] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <Wind className="w-3.5 h-3.5 text-[#1D5B8C]" />
                      Air-Conditioned
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8] font-extrabold text-sm px-3.5 py-1.5 rounded-xl shadow">
                    Staycation: {formatPHP(room.staycationRate)}{' '}
                    <span className="text-[11px] font-semibold">/ 22 hrs (Mon–Thu)</span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-brand-serif font-bold text-[#0B3553]">
                      {room.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">{room.tagline}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {room.beds.map((bed, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8] px-3 py-1.5 rounded-lg"
                        >
                          <BedDouble className="w-3.5 h-3.5 text-[#1D5B8C]" />
                          {bed}
                        </span>
                      ))}
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                          room.hasPrivateCR
                            ? 'bg-slate-50 text-[#0B3553] border-slate-200'
                            : 'bg-[#FAF8F5] text-[#8A6D3B] border-[#E6DBC8]'
                        }`}
                      >
                        <Bath className="w-3.5 h-3.5 text-[#1D5B8C]" />
                        {room.cr}
                      </span>
                    </div>

                    <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                      {room.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs sm:text-sm text-slate-600"
                        >
                          <Check className="w-4 h-4 text-[#1D5B8C] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectPackage(room.packageId, true)}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#0B3553] hover:bg-[#16486B] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CalendarIcon className="w-4 h-4 text-[#F5EFE6]" />
                      Select Room for Staycation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          DIRECTIONS & LOCATION SECTION (CLEAN WHITE)
      ========================================== */}
      <section id="directions" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-[#1D5B8C] font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                How to Get Here
              </span>
              <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553]">
                Directions to The Forts Riverside Private Resort
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Located near the scenic <strong>Angat River</strong> and{' '}
                <strong>Beltran Street</strong>, The Forts Riverside Private Resort can be accessed
                by car or public transport. If you need further assistance, feel free to contact
                us—we&apos;ll be happy to guide you on your way!
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6DBC8] flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1D5B8C] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0B3553]">Landmark & Location</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Near Beltran Street, beside the scenic Angat River (Search &quot;The Forts
                      Riverside Private Resort&quot; on Google Maps / Waze)
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6DBC8] flex items-start gap-3">
                  <Car className="w-5 h-5 text-[#1D5B8C] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0B3553]">
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
                  className="inline-flex items-center gap-2 bg-[#0B3553] hover:bg-[#16486B] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#F5EFE6]" />
                  Open in Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://forms.gle/STv73fxDoKJxDC4A7"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#F5EFE6] hover:bg-[#ebe1d1] text-[#0B3553] border border-[#E6DBC8] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors"
                >
                  Official Booking Form
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-[#E6DBC8] shadow-xs bg-[#FAF8F5] relative h-80 sm:h-96 flex flex-col justify-between p-6">
                <svg
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                  viewBox="0 0 800 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect width="800" height="500" fill="#F8FAFC" />
                  <path
                    d="M0 0H800V220C620 260 420 180 200 260C80 300 0 270 0 270V0Z"
                    fill="#F5EFE6"
                  />
                  <path
                    d="M0 360C220 330 450 410 800 320V500H0V360Z"
                    fill="#EFE6D5"
                  />
                  {/* Scenic Angat River Winding Path */}
                  <path
                    d="M-50 280C160 220 350 350 560 260C680 210 760 230 850 200L850 330C720 360 620 330 490 380C290 450 140 340 -50 390Z"
                    fill="#1D5B8C"
                    fillOpacity="0.85"
                  />
                  <path
                    d="M120 0L290 250L650 160"
                    stroke="#FFFFFF"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  <path
                    d="M120 0L290 250L650 160"
                    stroke="#C8AD7F"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                </svg>

                <div className="relative z-10 flex justify-between items-start">
                  <span className="bg-white/95 backdrop-blur-xs text-[#0B3553] text-xs font-bold px-3.5 py-2 rounded-xl shadow-2xs border border-[#E6DBC8] flex items-center gap-1.5">
                    <Waves className="w-4 h-4 text-[#1D5B8C]" />
                    Angat River Bank • Beltran Street
                  </span>
                </div>

                <div className="relative z-10 self-center my-auto flex flex-col items-center">
                  <div className="bg-[#0B3553] text-white px-4 py-2 rounded-xl shadow-lg border border-[#C8AD7F] text-center mb-2">
                    <p className="text-xs font-bold">The Forts Riverside Private Resort</p>
                    <p className="text-[10px] text-[#F5EFE6]">theforts.ph • Open for Bookings</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F5EFE6] border-4 border-[#0B3553] shadow-lg flex items-center justify-center text-[#0B3553] animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>

                <div className="relative z-10 bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-[#E6DBC8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <strong className="text-[#0B3553]">Need live directions?</strong> Connect with
                    us on Facebook or Instagram for immediate assistance.
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Angat+River+Beltran+Street"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1D5B8C] font-bold hover:underline shrink-0"
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
      <section id="faqs" className="py-16 sm:py-24 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#8A6D3B] font-bold text-xs uppercase tracking-[0.2em] inline-flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#1D5B8C]" />
              Everything You Need to Know
            </span>
            <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553] mt-2">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS_DATA.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#E6DBC8] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-[#0B3553] text-sm sm:text-base">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#1D5B8C] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
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
          FOOTER (RIVERSIDE BLUE & BEIGE ACCENTS)
      ========================================== */}
      <footer className="bg-[#0B3553] text-slate-200 py-14 border-t-4 border-[#C8AD7F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/15">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <FortsBrandLogo className="w-12 h-12" />
                <div>
                  <span className="block text-2xl font-brand-serif font-bold text-white">
                    The Forts Riverside
                  </span>
                  <span className="block text-[10px] font-bold tracking-[0.28em] uppercase text-[#E6DBC8]">
                    Private Resort
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
                A riverside haven designed for relaxation, fun, and unforgettable memories. Located
                near the scenic Angat River and Beltran Street.
              </p>
              <p className="text-xs text-[#F5EFE6] font-medium">
                Questions? Connect with us on Facebook or Instagram for bookings and inquiries.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2 text-sm">
              <h4 className="font-bold text-[#F5EFE6] uppercase tracking-wider text-xs mb-3">
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
                    3-Step Rate Calendar
                  </a>
                </li>
                <li>
                  <a href="#amenities" className="hover:text-white transition-colors">
                    Amenities Photo Gallery
                  </a>
                </li>
                <li>
                  <a href="#packages" className="hover:text-white transition-colors">
                    Packages & Updated Rates
                  </a>
                </li>
                <li>
                  <a href="#rooms" className="hover:text-white transition-colors">
                    Rooms (Overlooking, Family, Barkada, Cozy)
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3 text-sm">
              <h4 className="font-bold text-[#F5EFE6] uppercase tracking-wider text-xs mb-3">
                Official Reservation Form
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ready to lock in your dates? Compute your package rate using our 3-Step calendar or
                fill out our official booking form:
              </p>
              <a
                href="https://forms.gle/STv73fxDoKJxDC4A7"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#F5EFE6] hover:bg-white text-[#0B3553] font-bold text-xs px-4 py-3 rounded-xl transition-colors"
              >
                Open Google Booking Form
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 The Forts Riverside Private Resort | theforts.ph</p>
            <p className="flex items-center gap-1">
              Designed with <Heart className="w-3.5 h-3.5 text-[#C8AD7F]" /> for unforgettable
              riverside memories
            </p>
          </div>
        </div>
      </footer>

      {/* ==========================================
          LIGHTBOX MODAL FOR AMENITIES PHOTOS
      ========================================== */}
      {activeLightboxAmenity && (
        <div
          onClick={() => setActiveLightboxAmenity(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E6DBC8]"
          >
            <div className="relative h-72 sm:h-96 bg-slate-900">
              <SmartResortImage
                localSrc={activeLightboxAmenity.localSrc}
                fallbackSrc={activeLightboxAmenity.fallbackSrc}
                alt={activeLightboxAmenity.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveLightboxAmenity(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#0B3553]/90 text-white hover:bg-[#0B3553] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="bg-[#F5EFE6] text-[#0B3553] text-xs font-bold px-3 py-1 rounded-full shadow">
                  {activeLightboxAmenity.tag}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-brand-serif font-bold text-[#0B3553]">
                {activeLightboxAmenity.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeLightboxAmenity.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeLightboxAmenity.highlights.map((hl, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#F5EFE6] text-[#0B3553] px-3 py-1.5 rounded-lg border border-[#E6DBC8]"
                  >
                    <Check className="w-3.5 h-3.5 text-[#1D5B8C]" />
                    {hl}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          BOOKING SUMMARY & RESERVATION MODAL
      ========================================== */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E6DBC8] shadow-2xl overflow-hidden">
            <div className="p-5 sm:p-6 bg-[#0B3553] text-white border-b-2 border-[#C8AD7F] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FortsBrandLogo className="w-10 h-10" />
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#E6DBC8] font-bold">
                    {activeBookingTypeObj.title} Summary
                  </span>
                  <h3 className="text-xl font-brand-serif font-bold mt-0.5">
                    {selectedPackage.name.replace('Staycation: ', '')}
                  </h3>
                </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0B3553] mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B3553]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B3553] mb-1">
                    Contact Number / FB
                  </label>
                  <input
                    type="text"
                    value={guestContact}
                    onChange={(e) => setGuestContact(e.target.value)}
                    placeholder="0917 XXX XXXX"
                    className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B3553]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3553] mb-1">
                  Special Requests / Event Details (Optional)
                </label>
                <input
                  type="text"
                  value={guestNotes}
                  onChange={(e) => setGuestNotes(e.target.value)}
                  placeholder="e.g., 50th Birthday setup, bringing 1 small pet..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B3553]"
                />
              </div>

              {/* Summary Box */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6DBC8] text-xs sm:text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Type:</span>
                  <span className="font-bold text-[#0B3553]">{activeBookingTypeObj.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Date:</span>
                  <span className="font-bold text-[#0B3553]">
                    {formatReadableDate(selectedDateKey)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Schedule:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedPackage.isEvent ? eventTimePreference : selectedPackage.duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Guests:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedPackage.isEvent
                      ? `${guestCount} Expected Guests`
                      : `${guestCount} Pax (${priceBreakdown.excessGuests} excess)`}
                  </span>
                </div>
                {!selectedPackage.isEvent && (
                  <>
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
                  </>
                )}
                <div className="pt-2 border-t border-[#E6DBC8] flex justify-between items-baseline">
                  <span className="font-bold text-[#0B3553]">
                    {selectedPackage.isEvent ? 'Quotation Status:' : 'Total Estimated Rate:'}
                  </span>
                  <span className="text-xl font-brand-serif font-extrabold text-[#0B3553]">
                    {selectedPackage.isEvent
                      ? 'Price Upon Inquiry'
                      : formatPHP(priceBreakdown.total)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                <strong>Next Step:</strong> Copy your booking details below, then paste them into
                our official Google Reservation Form or message us on Facebook/Instagram!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#F5EFE6] border border-[#E6DBC8] hover:bg-[#ebe1d1] text-[#0B3553] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-[#0B3553]" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#0B3553]" />
                      Copy Summary
                    </>
                  )}
                </button>

                <a
                  href="https://forms.gle/STv73fxDoKJxDC4A7"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0B3553] hover:bg-[#16486B] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors text-center"
                >
                  Open Booking Form
                  <ExternalLink className="w-4 h-4 text-[#F5EFE6]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}