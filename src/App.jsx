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
  Maximize2,
  Star,
  Quote,
  FileText,
  RotateCcw,
  Wifi,
  Mic2,
  Coffee,
  CreditCard,
  Keyboard,
  MessageCircle,
  Send,
  Bot
} from 'lucide-react';

// ============================================================================
// 0. EASY PNG IMAGE CONFIGURATION LIST
// ============================================================================
const SITE_IMAGES = {
  logo: '',
  heroBackground: '/images/herobg.png',
  swimmingPoolArea: '/images/swimming.png',
  riversideBalconyArea: '/images/balcony.png',
  functionSpace: '/images/function.png',
  kitchenArea: '/images/kitchen.png',
  recreationalArea: '/images/recreation.png',
  gardenArea: '/images/garden.png',
  // 4 Official Staycation Rooms from PDF
  vistaRoom: '/overlooking.jpg',
  hideoutRoom: '/hideout.jpg',
  riverLoftRoom: '/barkada.jpg',
  cozyDenRoom: '/cozy.jpg'
};

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
  vistaRoom:
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
  hideoutRoom:
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80',
  riverLoftRoom:
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
  cozyDenRoom:
    'https://images.unsplash.com/photo-1540518614846-7ede433c457?auto=format&fit=crop&w=900&q=80'
};

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
// 1. STEP 1 MAIN BOOKING TYPES (RETRACTABLE INTO 3 ICON BUTTONS)
// ============================================================================

const BOOKING_TYPES = [
  {
    id: 'staycation',
    title: 'Staycation Booking',
    shortLabel: 'Staycation',
    subtitle: '22-Hr Room-Only Stay • Free Silog Breakfast, Pool & LPG',
    badge: 'From ₱2,000 / Night',
    icon: BedDouble,
    shortDesc:
      'Choose from our rooms. Available to book a week before the date only.',
    selectionPrompt: 'Step 2: Select Your Staycation Room'
  },
  {
    id: 'resort',
    title: 'Exclusive Resort Booking',
    shortLabel: 'Resort',
    subtitle: 'Day Tour, Night Tour & 22-Hr Exclusive Packages',
    badge: 'Exclusive Use',
    icon: Waves,
    shortDesc:
      'Private access to the swimming pools, riverside balcony, function space & rooms.',
    selectionPrompt: 'Step 2: Select Your Exclusive Resort Package'
  },
  {
    id: 'events',
    title: 'Events Booking',
    shortLabel: 'Events',
    subtitle: 'Birthdays, Reunions, Team Building & Celebrations',
    badge: 'Custom Quote',
    icon: PartyPopper,
    shortDesc:
      'Celebrate milestones by the scenic Angat River.',
    selectionPrompt: 'Step 2: Select Your Event Type'
  }
];

// ============================================================================
// 2. PACKAGES, STAYCATION ROOMS (UPDATED FROM PDF) & EVENTS DATA
// ============================================================================

const PACKAGES_DATA = [
  // --- 1. ROOM-ONLY STAYCATION BOOKINGS (EXACT PDF ROOMS, RATES & INCLUSIONS) ---
  {
    id: 'staycation-cozy-den',
    category: 'staycation',
    bookingType: 'staycation',
    subGroup: '22-Hour Room-Only Staycation',
    name: 'THE COZY DEN — Cozy Room',
    shortName: 'The Cozy Den',
    roomCode: 'Cozy Room',
    timeLabel: '2PM–12NN (22 Hrs)',
    duration: '22 Hours per Night (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN',
    isOvernightMultiDay: true,
    icon: BedDouble,
    minPax: 2,
    maxPax: 4,
    paxLabel: '2–4 Guests',
    weekdayRate: 2000,
    weekendRate: 2500,
    monThuOnly: false,
    excessFeePerHead: 300, // PDF: P300/person inclusive of pool access & silog breakfast
    allowExtraMattress: false,
    gasIncluded: true,
    gasFeeOption: 0,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: '4 Single Floor Mattresses • Private CR',
    includedRooms: 'Air-conditioned room • 4 single floor mattresses • Private bathroom',
    description:
      'Cozy air-conditioned staycation room for 2–4 guests featuring 4 single floor mattresses and a private bathroom. Includes Silog breakfast for each registered guest, swimming pool access, kitchen & LPG use, Wi-Fi, parking, and karaoke.',
    inclusions: [
      '22-hour room accommodation (2:00 PM check-in to 12:00 NN check-out)',
      'Silog breakfast for each registered guest',
      'Air-conditioned room with 4 single floor mattresses & Private bathroom',
      'Swimming pool, Riverside area & common areas access',
      'Kitchen access and free use of LPG for cooking',
      'Wi-Fi access, Parking space & Karaoke use (until 10:00 PM)'
    ]
  },
  {
    id: 'staycation-vista',
    category: 'staycation',
    bookingType: 'staycation',
    subGroup: '22-Hour Room-Only Staycation',
    name: 'THE VISTA — Overlooking Room',
    shortName: 'The Vista',
    roomCode: 'Overlooking Room',
    timeLabel: '2PM–12NN (22 Hrs)',
    duration: '22 Hours per Night (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN',
    isOvernightMultiDay: true,
    icon: Sun,
    minPax: 2,
    maxPax: 4,
    paxLabel: '2–4 Guests',
    weekdayRate: 2800,
    weekendRate: 3300,
    monThuOnly: false,
    excessFeePerHead: 300,
    allowExtraMattress: true,
    gasIncluded: true,
    gasFeeOption: 0,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: '2 Double Beds + Sofa • Private CR',
    includedRooms: 'Air-conditioned room • 2 double beds • Sofa • Private bathroom',
    description:
      'Scenic overlooking room for 2–4 guests with 2 double beds, a comfortable sofa, and a private bathroom. Includes Silog breakfast per registered guest, pool access, free LPG cooking use, Wi-Fi, parking, and karaoke.',
    inclusions: [
      '22-hour room accommodation (2:00 PM check-in to 12:00 NN check-out)',
      'Silog breakfast for each registered guest',
      'Air-conditioned room with 2 double beds, Sofa & Private bathroom',
      'Swimming pool, Riverside area & common areas access',
      'Kitchen access and free use of LPG for cooking',
      'Extra mattress available for an additional fee (₱150 single / ₱200 double)'
    ]
  },
  {
    id: 'staycation-hideout',
    category: 'staycation',
    bookingType: 'staycation',
    subGroup: '22-Hour Room-Only Staycation',
    name: 'THE HIDEOUT — Small Barkada Room',
    shortName: 'The Hideout',
    roomCode: 'Small Barkada Room',
    timeLabel: '2PM–12NN (22 Hrs)',
    duration: '22 Hours per Night (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN',
    isOvernightMultiDay: true,
    icon: Users,
    minPax: 4,
    maxPax: 6,
    paxLabel: '4–6 Guests',
    weekdayRate: 3000,
    weekendRate: 3500,
    monThuOnly: false,
    excessFeePerHead: 300,
    allowExtraMattress: false,
    gasIncluded: true,
    gasFeeOption: 0,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: '2 Single Bunk Beds + 1 Double Bed',
    includedRooms: 'Air-conditioned room • 2 single bunk beds • 1 double bed • Shared bathroom',
    description:
      'Designed for families and small barkadas of 4–6 guests! Equipped with 2 single bunk beds, 1 double bed, and shared bathroom access, plus Silog breakfast for each registered guest, pool access, and free LPG use.',
    inclusions: [
      '22-hour room accommodation (2:00 PM check-in to 12:00 NN check-out)',
      'Silog breakfast for each registered guest',
      'Air-conditioned room with 2 single bunk beds, 1 double bed & Shared bathroom',
      'Swimming pool, Riverside area & common areas access',
      'Kitchen access and free use of LPG for cooking',
      'Wi-Fi access, Parking space & Karaoke use (until 10:00 PM)'
    ]
  },
  {
    id: 'staycation-river-loft',
    category: 'staycation',
    bookingType: 'staycation',
    subGroup: '22-Hour Room-Only Staycation',
    name: 'THE RIVER LOFT — Barkada Room',
    shortName: 'The River Loft',
    roomCode: 'Barkada Room',
    timeLabel: '2PM–12NN (22 Hrs)',
    duration: '22 Hours per Night (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN',
    isOvernightMultiDay: true,
    icon: Sparkles,
    minPax: 10,
    maxPax: 15,
    paxLabel: '10–15 Guests',
    weekdayRate: 5000,
    weekendRate: 6000,
    monThuOnly: false,
    excessFeePerHead: 300,
    allowExtraMattress: true,
    gasIncluded: true,
    gasFeeOption: 0,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: '2 Double Bunks + 3 Single Bunks • Private CR',
    includedRooms: 'Air-conditioned • 2 double bunk beds • 3 single bunk beds • Private bathroom',
    description:
      'Our largest staycation room for 10–15 guests! Features 2 double bunk beds, 3 single bunk beds, and a private bathroom. Includes Silog breakfast per registered guest, pool access, kitchen & LPG use, Wi-Fi, and karaoke.',
    inclusions: [
      '22-hour room accommodation (2:00 PM check-in to 12:00 NN check-out)',
      'Silog breakfast for each registered guest',
      '2 double bunk beds, 3 single bunk beds & Private bathroom',
      'Swimming pool, Riverside area & common areas access',
      'Kitchen access and free use of LPG for cooking',
      'Extra mattress available for an additional fee (₱150 single / ₱200 double)'
    ]
  },

  // --- 2. EXCLUSIVE RESORT BOOKING PACKAGES (ANY DAY) ---
  {
    id: 'day-tour',
    category: 'resort',
    bookingType: 'resort',
    subGroup: 'Day & Night Tours',
    name: 'Day Tour Package (Exclusive)',
    shortName: 'Day Tour',
    timeLabel: '8AM–5PM (9 Hrs)',
    duration: '9 Hours (8:00 AM – 5:00 PM)',
    checkIn: '8:00 AM',
    checkOut: '5:00 PM',
    isOvernightMultiDay: false,
    icon: Sun,
    minPax: 1,
    maxPax: 15,
    paxLabel: 'Up to 15 Pax',
    weekdayRate: 4500,
    weekendRate: 5000,
    monThuOnly: false,
    excessFeePerHead: 150,
    allowExtraMattress: false,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Daytime Escape',
    includedRooms: 'The Vista - Overlooking Room',
    description:
      'Includes exclusive access to the resort’s pools, riverside balcony, kitchen, function space, and recreational facilities for a fun-filled daytime escape.',
    inclusions: [
      'Complimentary stay in The Vista (Overlooking Room)',
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
    name: 'Night Tour Package (Exclusive)',
    shortName: 'Night Tour',
    timeLabel: '7PM–6AM (11 Hrs)',
    duration: '11 Hours (7:00 PM – 6:00 AM)',
    checkIn: '7:00 PM',
    checkOut: '6:00 AM (Next Day)',
    isOvernightMultiDay: false,
    icon: Moon,
    minPax: 1,
    maxPax: 15,
    paxLabel: 'Up to 15 Pax',
    weekdayRate: 6999,
    weekendRate: 7500,
    monThuOnly: false,
    excessFeePerHead: 200,
    allowExtraMattress: false,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Evening Getaway',
    includedRooms: 'The Vista - Overlooking Room',
    description:
      'Enjoy evening relaxation with warm ambient string lighting, peaceful riverside views, night swimming, and exclusive access to the resort’s amenities.',
    inclusions: [
      'Complimentary stay in The Vista (Overlooking Room)',
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
    shortName: 'Family Overnight',
    timeLabel: '2PM–12NN (Up to 3D2N)',
    duration: '22 Hours per Night (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN',
    isOvernightMultiDay: true,
    icon: BedDouble,
    minPax: 4,
    maxPax: 8,
    paxLabel: '4–8 Pax',
    weekdayRate: 7999,
    weekendRate: 8999,
    monThuOnly: false,
    excessFeePerHead: 200,
    allowExtraMattress: true,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: '22-Hr Exclusive',
    includedRooms: 'Private Air-Conditioned Room Stay + Whole Resort Grounds',
    description:
      '22-hour exclusive resort experience tailored for families of 4 to 8 guests. Can be booked for 2 Days & 1 Night or up to 3 Days & 2 Nights.',
    inclusions: [
      'Exclusive resort access (2:00 PM check-in – 12:00 NN check-out)',
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
    shortName: 'Barkada Overnight',
    timeLabel: '2PM–12NN (Up to 3D2N)',
    duration: '22 Hours per Night (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN',
    isOvernightMultiDay: true,
    icon: Users,
    minPax: 9,
    maxPax: 15,
    paxLabel: '9–15 Pax',
    weekdayRate: 10999,
    weekendRate: 11999,
    monThuOnly: false,
    excessFeePerHead: 200,
    allowExtraMattress: true,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'Barkada Favorite',
    includedRooms: 'The River Loft (Barkada Room) + Exclusive Resort Access',
    description:
      'Designed for barkadas and medium groups of 9 to 15 guests looking for an unforgettable 22-hour riverside bonding experience with full exclusive resort access.',
    inclusions: [
      'Exclusive resort access (2:00 PM – 12:00 NN)',
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
    shortName: 'Mid Group',
    timeLabel: '2PM–12NN (Up to 3D2N)',
    duration: '22 Hours per Night (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN',
    isOvernightMultiDay: true,
    icon: Users,
    minPax: 16,
    maxPax: 20,
    paxLabel: '16–20 Pax',
    weekdayRate: 13999,
    weekendRate: 14999,
    monThuOnly: false,
    excessFeePerHead: 200,
    allowExtraMattress: true,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: '2 Group Rooms Included',
    includedRooms: 'Includes The River Loft & The Hideout + Exclusive Grounds',
    description:
      'Spacious 22-hour exclusive package for 16 to 20 guests, complete with two group rooms plus full exclusive access to all resort amenities.',
    inclusions: [
      'Includes BOTH The River Loft & The Hideout Rooms',
      'Exclusive resort access (2:00 PM – 12:00 NN)',
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
    shortName: 'Whole Resort',
    timeLabel: '2PM–12NN (Up to 3D2N)',
    duration: '22 Hours per Night (2:00 PM – 12:00 NN)',
    checkIn: '2:00 PM',
    checkOut: '12:00 NN',
    isOvernightMultiDay: true,
    icon: Sparkles,
    minPax: 20,
    maxPax: 30,
    paxLabel: 'Up to 30 Pax',
    weekdayRate: 15999,
    weekendRate: 16499,
    monThuOnly: false,
    excessFeePerHead: 200,
    allowExtraMattress: true,
    gasIncluded: false,
    gasFeeOption: 400,
    maxExtendedHours: 2,
    extendedHourRate: 500,
    badge: 'ALL 4 Resort Rooms',
    includedRooms: 'Includes ALL 4 Rooms (The Vista, The Hideout, The River Loft & The Cozy Den)',
    description:
      'The ultimate private resort takeover for up to 30 guests! Includes ALL 4 air-conditioned rooms at The Forts plus complete exclusive access to every amenity.',
    inclusions: [
      'Includes ALL 4 Resort Rooms (The Vista, The Hideout, The River Loft & The Cozy Den)',
      'Up to 30 guests included in base rate',
      'Total privacy & exclusive resort access',
      'Swimming Pool, Riverside Balcony & Function Space',
      'Kitchen Area & Recreational Court access',
      'Generous On-site Parking & Pet-Friendly'
    ]
  },

  // --- 3. EVENTS BOOKING ---
  {
    id: 'event-birthday',
    category: 'events',
    bookingType: 'events',
    subGroup: 'Celebrations & Gatherings',
    name: 'Birthday & Milestone Celebration',
    shortName: 'Birthday / Milestone',
    timeLabel: 'Custom Schedule',
    duration: 'Flexible Event Hours (By Arrangement)',
    checkIn: 'Custom Schedule',
    checkOut: 'Custom Schedule',
    isOvernightMultiDay: true,
    icon: PartyPopper,
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
    timeLabel: 'Full Day or Overnight',
    duration: 'Full Day or Multi-Day Event',
    checkIn: 'Custom Schedule',
    checkOut: 'Custom Schedule',
    isOvernightMultiDay: true,
    icon: Users,
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
    shortName: 'Team Building',
    timeLabel: 'Custom Day / Overnight',
    duration: 'Custom Day or Overnight Schedule',
    checkIn: 'Custom Schedule',
    checkOut: 'Custom Schedule',
    isOvernightMultiDay: true,
    icon: Sparkles,
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
// 3. OFFICIAL 4 ROOMS DATA (UPDATED EXACTLY FROM PDF PAGES 1-4 & 9)
// ============================================================================

const ROOMS_DATA = [
  {
    id: 'room-vista',
    packageId: 'staycation-vista',
    name: 'THE VISTA',
    subtitle: 'Overlooking Room',
    capacity: '2–4 Guests',
    weekdayRate: 2800,
    weekendRate: 3300,
    tagline: 'Scenic overlooking sanctuary with 2 double beds, sofa, and private bathroom',
    beds: ['2 Double Beds', 'Sofa'],
    cr: 'Private Bathroom',
    hasPrivateCR: true,
    extraMattressNote: 'Extra mattress available for an additional fee (₱150 single / ₱200 double)',
    features: [
      'Air-conditioned room',
      '2 double beds & Sofa',
      'Private bathroom',
      'Includes Silog breakfast for each registered guest',
      'Swimming pool access, Kitchen & free LPG use, Wi-Fi & Karaoke'
    ],
    localSrc: SITE_IMAGES.vistaRoom,
    image: FALLBACK_IMAGES.vistaRoom
  },
  {
    id: 'room-hideout',
    packageId: 'staycation-hideout',
    name: 'THE HIDEOUT',
    subtitle: 'Small Barkada Room',
    capacity: '4–6 Guests',
    weekdayRate: 3000,
    weekendRate: 3500,
    tagline: 'Comfortable group room with bunk beds and a double bed for small barkadas & families',
    beds: ['2 Single Bunk Beds', '1 Double Bed'],
    cr: 'Shared Bathroom',
    hasPrivateCR: false,
    extraMattressNote: 'Ideal layout for 4–6 registered guests',
    features: [
      'Air-conditioned room',
      '2 single bunk beds & 1 double bed',
      'Shared bathroom access',
      'Includes Silog breakfast for each registered guest',
      'Swimming pool access, Kitchen & free LPG use, Wi-Fi & Karaoke'
    ],
    localSrc: SITE_IMAGES.hideoutRoom,
    image: FALLBACK_IMAGES.hideoutRoom
  },
  {
    id: 'room-river-loft',
    packageId: 'staycation-river-loft',
    name: 'THE RIVER LOFT',
    subtitle: 'Barkada Room',
    capacity: '10–15 Guests',
    weekdayRate: 5000,
    weekendRate: 6000,
    tagline: 'Spacious barkada headquarters with 2 double bunk beds, 3 single bunk beds & private CR',
    beds: ['2 Double Bunk Beds', '3 Single Bunk Beds'],
    cr: 'Private Bathroom',
    hasPrivateCR: true,
    extraMattressNote: 'Extra mattress available for an additional fee (₱150 single / ₱200 double)',
    features: [
      'Air-conditioned room',
      '2 double bunk beds & 3 single bunk beds',
      'Private bathroom',
      'Includes Silog breakfast for each registered guest',
      'Swimming pool access, Kitchen & free LPG use, Wi-Fi & Karaoke'
    ],
    localSrc: SITE_IMAGES.riverLoftRoom,
    image: FALLBACK_IMAGES.riverLoftRoom
  },
  {
    id: 'room-cozy-den',
    packageId: 'staycation-cozy-den',
    name: 'THE COZY DEN',
    subtitle: 'Cozy Room',
    capacity: '2–4 Guests',
    weekdayRate: 2000,
    weekendRate: 2500,
    tagline: 'Budget-friendly air-conditioned room with 4 single floor mattresses & private CR',
    beds: ['4 Single Floor Mattresses'],
    cr: 'Private Bathroom',
    hasPrivateCR: true,
    extraMattressNote: 'Most affordable 22-hour staycation room with private bathroom',
    features: [
      'Air-conditioned room',
      '4 single floor mattresses',
      'Private bathroom',
      'Includes Silog breakfast for each registered guest',
      'Swimming pool access, Kitchen & free LPG use, Wi-Fi & Karaoke'
    ],
    localSrc: SITE_IMAGES.cozyDenRoom,
    image: FALLBACK_IMAGES.cozyDenRoom
  }
];

// ============================================================================
// 4. VISUAL AMENITIES PHOTO SHOWCASE DATA
// ============================================================================

const AMENITIES_GALLERY = [
  {
    id: 'amenity-pool',
    title: 'Swimming Pool Area',
    tag: 'Included in All Bookings',
    localSrc: SITE_IMAGES.swimmingPoolArea,
    fallbackSrc: FALLBACK_IMAGES.swimmingPoolArea,
    icon: Waves,
    description:
      'Refreshing blue-tiled swimming pool with dedicated adult and kiddie sections, overhead sun-shade canopy, and warm string lighting for relaxing swims.',
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
      'Our signature elevated deck overlooking the tranquil Angat River. The best spot at the resort for morning Silog breakfast, golden-hour sunset photos, and cool breezes.',
    highlights: ['Unobstructed River View', 'Morning Silog Breakfast Spot', 'Breezy Open-Air Deck']
  },
  {
    id: 'amenity-function',
    title: 'Function Space & Karaoke Area',
    tag: 'Karaoke Included (Until 10 PM)',
    localSrc: SITE_IMAGES.functionSpace,
    fallbackSrc: FALLBACK_IMAGES.functionSpace,
    icon: Mic2,
    description:
      'Spacious, well-ventilated covered pavilion right beside the pool—equipped with karaoke use (until 10:00 PM) and Wi-Fi access for dining, celebrations, and bonding.',
    highlights: ['Karaoke Included (Until 10 PM)', 'Free Wi-Fi Access', 'Covered Dining Pavilion']
  },
  {
    id: 'amenity-kitchen',
    title: 'Kitchen & LPG Cooking Area',
    tag: 'Free LPG on Staycations',
    localSrc: SITE_IMAGES.kitchenArea,
    fallbackSrc: FALLBACK_IMAGES.kitchenArea,
    icon: Utensils,
    description:
      'Prepare hot meals with ease. Kitchen access and use of LPG for cooking are included free on all Room-Only Staycations (and optional +₱400 on Exclusive Resort Packages).',
    highlights: ['Free LPG on Staycations', 'Prep Counter & Sink', 'No Corkage on Food']
  },
  {
    id: 'amenity-recreation',
    title: 'Recreational & Parking Court',
    tag: 'Free On-Site Parking',
    localSrc: SITE_IMAGES.recreationalArea,
    fallbackSrc: FALLBACK_IMAGES.recreationalArea,
    icon: Car,
    description:
      'Wide gated concrete court where guests can play outdoor games or park private vehicles securely inside the resort grounds.',
    highlights: ['Included Parking Space', 'Badminton & Outdoor Games', 'Secure Gated Grounds']
  },
  {
    id: 'amenity-garden',
    title: 'Riverside Garden & Common Areas',
    tag: 'Nature & Relaxation',
    localSrc: SITE_IMAGES.gardenArea,
    fallbackSrc: FALLBACK_IMAGES.gardenArea,
    icon: Trees,
    description:
      'Surrounded by lush trees and tropical plants along the riverbank, featuring shaded umbrella seating where you can unwind in nature.',
    highlights: ['Shaded Umbrella Seating', 'Riverside Access', 'Peaceful Nature Vibe']
  }
];

// ============================================================================
// 5. OFFICIAL POLICIES & HOUSE RULES FROM THE PDF (PAGES 6–8)
// ============================================================================

const STAYCATION_POLICIES_PDF = [
  {
    num: '01',
    title: 'Check-in & Check-out',
    icon: Clock,
    items: [
      'Check-in: 2:00 PM | Check-out: 12:00 NN the following day (22-hour stay).',
      'Early check-in or late check-out is subject to availability and additional charges.'
    ]
  },
  {
    num: '02',
    title: 'Guest Capacity & Registration',
    icon: Users,
    items: [
      'Only registered guests are allowed. Extra guests must be declared and approved before arrival.',
      'Additional guests are charged ₱300 per person per stay (inclusive of pool access and Silog breakfast), subject to room capacity.',
      'Visitors are not allowed without management approval.'
    ]
  },
  {
    num: '03',
    title: 'Swimming Pool Rules',
    icon: Waves,
    items: [
      'Pool use is included during the stay. Guests swim at their own risk; follow posted safety instructions.',
      'No food, drinks, or glass containers in the pool.',
      'Children must be supervised by a responsible adult at all times. No running, pushing, or rough play around the pool.'
    ]
  },
  {
    num: '04',
    title: 'Karaoke & Quiet Hours',
    icon: Mic2,
    items: [
      'Karaoke is included, subject to availability and resort rules.',
      'Karaoke use strictly ends at 10:00 PM.',
      'Guests must keep noise at a reasonable level, especially in shared areas.'
    ]
  },
  {
    num: '05',
    title: 'Kitchen & Cooking',
    icon: Utensils,
    items: [
      'Kitchen use and LPG are included for Staycation bookings.',
      'Use cooking equipment responsibly, never leave cooking unattended, and turn off the LPG after use.',
      'Guests must clean their cooking area, wash used utensils, and dispose of food waste properly.'
    ]
  },
  {
    num: '06',
    title: 'Room, Property Care & Cleanliness',
    icon: ShieldCheck,
    items: [
      'Keep rooms, furniture, appliances, and linens in good condition. Do not move furniture or mattresses between rooms without permission.',
      'Lost or damaged resort property may be charged at a reasonable replacement or repair cost, subject to verification.',
      'Keep the room and shared areas tidy and place trash in designated bins. Excessive mess requiring special cleaning may incur a disclosed cleaning fee.'
    ]
  },
  {
    num: '07',
    title: 'Safety & Prohibited Activities',
    icon: AlertCircle,
    items: [
      'No illegal drugs, dangerous activities, or unauthorized parties.',
      'No smoking inside air-conditioned rooms.',
      'No pets in the swimming pool. Guests are responsible for their personal belongings and supervising children in their care.'
    ]
  },
  {
    num: '08',
    title: 'Breakfast & Shared Access Policy',
    icon: Coffee,
    items: [
      'One Silog breakfast per registered guest is included on Staycation bookings (confirm meal choices and serving schedule before arrival).',
      'Shared resort access: Room-only bookings do not grant exclusive use of the resort. Pool and common areas may be shared with other guests.',
      'Weekday and non-holiday room-only bookings may be accepted in advance. Weekend and holiday room-only bookings open 7 days before the date if no whole-resort booking is confirmed.'
    ]
  }
];

const PAYMENT_CANCELLATION_PDF = [
  {
    title: '1. Reservation & 50% Down Payment',
    items: [
      'A 50% down payment (DP) is required to secure your reservation.',
      'Your booking is confirmed only after management verifies your payment (send proof of payment through the official booking channel).',
      'The remaining 50% balance must be paid upon arrival, before room use.'
    ]
  },
  {
    title: '2. Cancellation & No-Show Policy',
    items: [
      'Guests must inform management as soon as possible if they need to cancel.',
      'The down payment is generally non-refundable for guest-initiated cancellations, subject to applicable law.',
      'Failure to arrive on the scheduled check-in date without prior notice is considered a no-show, and the down payment will be forfeited.'
    ]
  },
  {
    title: '3. Rescheduling Policy (7-Day Rule)',
    items: [
      'One reschedule is allowed if requested at least 7 days before check-in, subject to availability and management approval.',
      'Any difference in room rates, seasonal rates, or applicable fees must be settled by the guest.',
      'Rescheduling requests made less than 7 days before check-in may be declined or subject to additional conditions.'
    ]
  },
  {
    title: '4. Cancellation by the Resort & Terms Agreement',
    items: [
      'If The Forts must cancel a confirmed booking, the guest may choose either a full refund of payments made or rescheduling to another available date.',
      'Payment of the 50% down payment confirms the guest’s acceptance of the resort’s booking, payment, cancellation, and rescheduling policies.'
    ]
  }
];

// ============================================================================
// 6. GUEST REVIEWS DATA
// ============================================================================

const REVIEWS_DATA = [
  {
    id: 'rev-1',
    name: 'Alyssa & Marco',
    stayType: 'THE VISTA — Overlooking Room (2–4 Pax)',
    date: 'October 2026',
    rating: 5,
    highlight: 'Free Silog breakfast by the river + super relaxing view!',
    comment:
      'We booked The Vista for 2 nights (₱2,800/night weekday). Waking up to the Angat River view with free Silog breakfast for both of us made our anniversary staycation so special. Free LPG use in the kitchen and karaoke until 10 PM were huge bonuses!'
  },
  {
    id: 'rev-2',
    name: 'kevin_delacruz',
    stayType: 'THE RIVER LOFT — Barkada Room (14 Pax)',
    date: 'September 2026',
    rating: 5,
    highlight: 'Best barkada room! 2 double bunks + 3 single bunks fit us all',
    comment:
      'Super sulit ng ₱5,000 for 10–15 guests sa The River Loft! May sariling private bathroom sa loob, malamig ang aircon, at may kasama pang Silog breakfast bawat isa sa amin. Solid din ang swimming pool sa gabi.'
  },
  {
    id: 'rev-3',
    name: 'Maria Katrina S.',
    stayType: 'Whole Resort Overnight (28 Pax)',
    date: 'August 2026',
    rating: 5,
    highlight: 'Ultimate family reunion spot with all 4 rooms included',
    comment:
      'Sobrang ganda ng view sa Riverside Balcony lalo na pag sunset! Getting all 4 rooms (The Vista, The Hideout, The River Loft, and The Cozy Den) gave our elders and kids complete privacy and comfort.'
  },
  {
    id: 'rev-4',
    name: 'Rhea Mendoza',
    stayType: 'THE COZY DEN — Cozy Room (4 Pax)',
    date: 'July 2026',
    rating: 5,
    highlight: '₱2,000 for 22 hours with private CR, pool & breakfast!',
    comment:
      'Where else can you find a ₱2,000 22-hour staycation with a private bathroom, aircon, swimming pool access, free LPG cooking, and free Silog breakfast?! Super clean and accommodating staff.'
  }
];

// ============================================================================
// 7. PHILIPPINE HOLIDAYS (2026 & 2027)
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
// 8. OFFICIAL FAQS DATA
// ============================================================================

const FAQS_DATA = [
  {
    question: 'What is included in the Room-Only Staycation Bookings (₱2,000–₱6,000)?',
    answer:
      'Every 22-hour Room-Only Staycation (The Cozy Den, The Vista, The Hideout, and The River Loft) includes air-conditioned room accommodation from 2:00 PM to 12:00 NN, one Silog breakfast for each registered guest, swimming pool access, kitchen access and free use of LPG for cooking, riverside & common area access, Wi-Fi, parking space, and karaoke use until 10:00 PM.'
  },
  {
    question: 'Can we book a Staycation Room on Weekends or Holidays?',
    answer:
      'Yes! Weekday (Mon–Thu) rates start at ₱2,000–₱5,000, while Weekend/Holiday rates are ₱2,500–₱6,000. Per resort policy, weekday and non-holiday room-only bookings may be accepted in advance, while weekend and holiday room-only bookings open 7 days before the target date if no whole-resort booking has been confirmed.'
  },
  {
    question: 'How many days can we select on the calendar for Overnight / Staycation bookings?',
    answer:
      'You can select multiple consecutive dates on our calendar up to a maximum of 3 Days & 2 Nights (2 nights total). Selecting 2 dates gives you a 2 Days & 1 Night (22-hour) stay, while selecting 3 dates gives you a 3 Days & 2 Nights stay. The Rate Calculator automatically computes each night’s weekday or weekend/holiday rate.'
  },
  {
    question: 'How much are extra guests and extra mattresses?',
    answer:
      'For Room-Only Staycations, additional guests beyond the base capacity are charged ₱300 per person per stay (already inclusive of swimming pool access and Silog breakfast). Extra single mattresses are ₱150/night and extra double mattresses are ₱200/night, subject to availability.'
  },
  {
    question: 'What is your Down Payment, Cancellation, and Rescheduling policy?',
    answer:
      'A 50% down payment (DP) is required to secure your reservation, and the remaining 50% balance is payable upon arrival before room use. Down payments are generally non-refundable for guest-initiated cancellations or no-shows. One reschedule is allowed if requested at least 7 days before check-in, subject to availability and management approval.'
  }
];

// ============================================================================
// 9. HELPER FUNCTIONS
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

const addDaysToKey = (dateKey, daysToAdd) => {
  const d = parseDateKey(dateKey);
  d.setDate(d.getDate() + daysToAdd);
  return toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
};

const diffDaysBetweenKeys = (startKey, endKey) => {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
};

const formatReadableDate = (dateKey) => {
  if (!dateKey) return '';
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatSlashDate = (dateKey) => {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  return `${m}/${d}/${y}`;
};

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

  const applicableRate = isPeakDay ? pkg.weekendRate : pkg.weekdayRate;
  return {
    available: true,
    rate: applicableRate,
    rateLabel: formatPHP(applicableRate),
    tierLabel: isHoliday
      ? `Holiday Rate (${holidayName})`
      : isWeekend
      ? 'Weekend Rate (Fri–Sun)'
      : 'Weekday Rate (Mon–Thu)',
    isPeakDay,
    isWeekend,
    isHoliday,
    holidayName
  };
};

// Build a single month grid (Monday-first like the screenshot: Lu Ma Mi H B S Li / Mo Tu We Th Fr Sa Su)
const buildMonthDaysMondayFirst = (year, month, selectedPackage, customHolidays, today) => {
  const jsFirstDay = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
  const mondayFirstOffset = (jsFirstDay + 6) % 7; // 0=Mon..6=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < mondayFirstOffset; i++) {
    cells.push(null);
  }

  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = toDateKey(year, month, day);
    const dateObj = new Date(year, month, day);
    const isPast = dateObj < todayMidnight;
    const rateInfo = getDayRateInfo(dateKey, selectedPackage, customHolidays);

    cells.push({
      day,
      dateKey,
      isPast,
      ...rateInfo
    });
  }

  return cells;
};

// ============================================================================
// AI CHAT SUPPORT KNOWLEDGE BASE & COMPONENT (GEMINI API + SMART FALLBACK)
// ============================================================================

const RESORT_SYSTEM_PROMPT = `
You are the official AI Concierge for "The Forts Riverside Private Resort" (website: https://theforts.ph), located near the scenic Angat River and Beltran Street.
Be warm, helpful, concise, and polite. Format prices in Philippine Pesos (₱). Only answer based on the official resort facts below:

1. TWO MAIN WAYS TO BOOK OVERNIGHT / DAY STAYS + EVENTS:
   A) ROOM-ONLY STAYCATION BOOKINGS (22-Hour Stay: 2:00 PM Check-in to 12:00 NN Check-out):
      - THE COZY DEN (Cozy Room, 2–4 Guests): ₱2,000 Weekday (Mon–Thu) | ₱2,500 Weekend/Holiday. Air-conditioned, 4 single floor mattresses, private bathroom.
      - THE VISTA (Overlooking Room, 2–4 Guests): ₱2,800 Weekday | ₱3,300 Weekend/Holiday. Air-conditioned, 2 double beds, sofa, private bathroom. Extra mattress allowed.
      - THE HIDEOUT (Small Barkada Room, 4–6 Guests): ₱3,000 Weekday | ₱3,500 Weekend/Holiday. Air-conditioned, 2 single bunk beds, 1 double bed, shared bathroom.
      - THE RIVER LOFT (Barkada Room, 10–15 Guests): ₱5,000 Weekday | ₱6,000 Weekend/Holiday. Air-conditioned, 2 double bunk beds, 3 single bunk beds, private bathroom. Extra mattress allowed.
      * Staycation Inclusions: 22-hour room stay, 1 free Silog breakfast per registered guest, swimming pool access, kitchen access & FREE use of LPG for cooking, riverside & common area access, Wi-Fi, parking, and karaoke use (until 10:00 PM).
      * Shared Access Note: Room-only bookings do not grant exclusive use of the entire resort. Weekday/non-holiday bookings are accepted in advance; weekend/holiday room-only bookings open 7 days before the target date if no whole-resort booking is confirmed.
      * Staycation Extra Charges: Extra guest is ₱300/person per stay (includes pool access & Silog breakfast). Extra single mattress is ₱150/night; extra double mattress is ₱200/night (subject to availability).

   B) EXCLUSIVE RESORT BOOKINGS (Private access to pools, riverside balcony, function space, kitchen, court & included rooms):
      - Day Tour (9 Hrs, 8:00 AM – 5:00 PM, up to 15 pax): ₱4,500 Weekday | ₱5,000 Fri–Sun/Holiday. Includes 1 complimentary room (The Vista). Excess guest: ₱150/head.
      - Night Tour (11 Hrs, 7:00 PM – 6:00 AM, up to 15 pax): ₱6,999 Weekday | ₱7,500 Fri–Sun/Holiday. Includes 1 complimentary room (The Vista). Excess guest: ₱200/head.
      - Family Overnight Exclusive (22 Hrs, 2:00 PM – 12:00 NN, 4–8 pax): ₱7,999 Weekday | ₱8,999 Fri–Sun/Holiday.
      - Barkada Overnight Exclusive (22 Hrs, 9–15 pax): ₱10,999 Weekday | ₱11,999 Fri–Sun/Holiday.
      - Mid Group Overnight Exclusive (22 Hrs, 16–20 pax): ₱13,999 Weekday | ₱14,999 Fri–Sun/Holiday (Includes The River Loft & The Hideout).
      - Whole Resort Package (22 Hrs, up to 30 pax): ₱15,999 Weekday | ₱16,499 Fri–Sun/Holiday (Includes ALL 4 air-conditioned rooms).
      * Resort Package Add-ons: Excess overnight guest is ₱200/head. Optional Kitchen LPG use is +₱400. Extended hours: ₱500/hr (max 2 hours, subject to availability).

   C) MULTI-DAY OVERNIGHT LIMIT:
      - Overnight and Staycation bookings can be selected for multiple consecutive dates up to a MAXIMUM of 3 Days & 2 Nights (2 nights total).

   D) EVENTS BOOKING:
      - Birthdays, family reunions, and corporate team-building events are available with custom quotes.

2. HOUSE RULES & POLICIES:
   - Karaoke & Quiet Hours: Karaoke ends strictly at 10:00 PM. Keep noise reasonable afterward.
   - Swimming Pool: Proper swim attire required. No food, drinks, glassware, or pets in the pool. Supervise children at all times.
   - Food & Kitchen: Outside food/drinks allowed with NO corkage fee. Clean-As-You-Go (CLAYGO) and turn off LPG after cooking.
   - Smoking & Pets: Strictly no smoking inside air-conditioned rooms. Well-behaved pets are welcome on the grounds (keep off beds and out of the pool).
   - Payment, Cancellation & Rescheduling: 50% down payment (DP) is required to secure a booking; remaining 50% balance is paid upon arrival before room use. Down payment is non-refundable for guest-initiated cancellations or no-shows. One reschedule is allowed if requested at least 7 days before check-in (subject to availability).

3. LOCATION & HOW TO BOOK:
   - Location: Near Angat River and Beltran Street (searchable on Google Maps & Waze as "The Forts Riverside Private Resort").
   - How to Book: Use the 3-Step Rate Calculator on the website to compute the exact rate, then click "Reserve Selected Dates" or submit via the official Google Form: https://forms.gle/STv73fxDoKJxDC4A7 or message on Facebook/Instagram.
`;

const QUICK_CHAT_QUESTIONS = [
  'Staycation room rates?',
  'What is included in Staycation?',
  'Exclusive resort packages?',
  'Payment & cancellation rules?'
];

// Local fallback responder in case the Gemini API key is not added yet
function getLocalFallbackAnswer(userText) {
  const q = userText.toLowerCase();

  if (q.includes('staycation') || q.includes('room') || q.includes('vista') || q.includes('cozy') || q.includes('hideout') || q.includes('loft')) {
    return `Here are our 22-Hour Room-Only Staycation rates (2:00 PM – 12:00 NN):\n• THE COZY DEN (2–4 pax): ₱2,000 Weekday | ₱2,500 Wknd/Hol\n• THE VISTA (2–4 pax): ₱2,800 Weekday | ₱3,300 Wknd/Hol\n• THE HIDEOUT (4–6 pax): ₱3,000 Weekday | ₱3,500 Wknd/Hol\n• THE RIVER LOFT (10–15 pax): ₱5,000 Weekday | ₱6,000 Wknd/Hol\n\nAll staycations include free Silog breakfast per registered guest, pool access, kitchen & free LPG use, Wi-Fi, parking, and karaoke until 10 PM!`;
  }
  if (q.includes('inclusion') || q.includes('include') || q.includes('breakfast') || q.includes('gas') || q.includes('lpg')) {
    return `Room-Only Staycations include:\n• 22-hour A/C room stay (2PM–12NN)\n• Free Silog breakfast for each registered guest\n• Swimming pool & riverside access\n• Kitchen access + FREE LPG cooking use\n• Wi-Fi, gated parking & karaoke (until 10 PM).\n\nFor Exclusive Resort Bookings, LPG use is an optional +₱400 add-on.`;
  }
  if (q.includes('exclusive') || q.includes('day tour') || q.includes('night tour') || q.includes('whole resort') || q.includes('package')) {
    return `Our Exclusive Resort Packages (Mon–Thu / Fri–Sun & Hol):\n• Day Tour (8AM–5PM, 15 pax): ₱4,500 / ₱5,000\n• Night Tour (7PM–6AM, 15 pax): ₱6,999 / ₱7,500\n• Family Overnight (4–8 pax): ₱7,999 / ₱8,999\n• Barkada Overnight (9–15 pax): ₱10,999 / ₱11,999\n• Mid Group (16–20 pax): ₱13,999 / ₱14,999\n• Whole Resort (Up to 30 pax, all 4 rooms): ₱15,999 / ₱16,499`;
  }
  if (q.includes('extra') || q.includes('excess') || q.includes('mattress')) {
    return `Extra Guest & Mattress Rates:\n• Staycation Extra Guest: ₱300/person per stay (includes pool access & Silog breakfast)\n• Extra Single Mattress: ₱150/night\n• Extra Double Mattress: ₱200/night\n• Resort Day Tour Excess: ₱150/head (Night/Overnight: ₱200/head)`;
  }
  if (q.includes('pay') || q.includes('down') || q.includes('cancel') || q.includes('resched') || q.includes('rule') || q.includes('policy')) {
    return `Booking & House Policies:\n• 50% down payment is required to lock in your dates; 50% balance is paid upon arrival.\n• Down payments are non-refundable for cancellations/no-shows.\n• 1 reschedule is allowed if requested at least 7 days before check-in.\n• Karaoke is until 10:00 PM, no smoking inside rooms, and no corkage fee on food!`;
  }
  if (q.includes('book') || q.includes('reserve') || q.includes('location') || q.includes('where')) {
    return `We are located beside the scenic Angat River near Beltran Street (search "The Forts Riverside Private Resort" on Google Maps/Waze).\n\nTo book, select your dates in our 3-Step Rate Calculator on this page and click "Reserve Selected Dates", or fill out our Google Form: https://forms.gle/STv73fxDoKJxDC4A7`;
  }

  return `Hi! I can help you with Staycation Room rates (₱2,000–₱6,000 with free Silog breakfast & LPG), Exclusive Resort Packages (₱4,500–₱16,499), check-in times, extra mattresses, or booking policies. What would you like to know?`;
}

function FortsAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! 👋 Welcome to The Forts Riverside Private Resort. Ask me anything about our Staycation Rooms, Exclusive Packages, inclusions, or house rules!'
    }
  ]);

  // Reads your Gemini API Key from your .env file (VITE_GEMINI_API_KEY)
  const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || '';

  const sendMessage = async (customQuestion = null) => {
    const textToSend = (customQuestion ?? input).trim();
    if (!textToSend || isLoading) return;

    const updatedMessages = [...messages, { role: 'user', text: textToSend }];
    setMessages(updatedMessages);
    if (!customQuestion) setInput('');
    setIsLoading(true);

    try {
      // If no API key is configured yet, use the built-in local fallback
      if (!GEMINI_API_KEY) {
        await new Promise((r) => setTimeout(r, 450));
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: getLocalFallbackAnswer(textToSend) }
        ]);
        setIsLoading(false);
        return;
      }

      // Format conversation history for Gemini API
      const contents = updatedMessages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: RESORT_SYSTEM_PROMPT }]
            },
            contents
          })
        }
      );

      const data = await response.json();
      const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        getLocalFallbackAnswer(textToSend);

      setMessages((prev) => [...prev, { role: 'assistant', text: aiReply }]);
    } catch (error) {
      // Fallback gracefully if offline or quota exceeded
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: getLocalFallbackAnswer(textToSend) }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window */}
      {isOpen ? (
        <div className="w-[340px] sm:w-[380px] h-[510px] bg-white rounded-3xl border border-[#E6DBC8] shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-[#0B3553] text-white border-b-2 border-[#C8AD7F] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F5EFE6] text-[#0B3553] flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">The Forts AI Concierge</h4>
                <span className="text-[11px] text-[#E6DBC8] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Instant Resort Support
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0B3553] text-white rounded-br-xs shadow-2xs'
                      : 'bg-white text-slate-800 border border-[#E6DBC8] rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E6DBC8] text-slate-500 rounded-2xl rounded-bl-xs px-3.5 py-2 text-xs italic">
                  Typing a reply...
                </div>
              </div>
            )}

            {/* Quick Question Chips */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {QUICK_CHAT_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="text-[11px] font-semibold bg-[#F5EFE6] hover:bg-[#ebe1d1] text-[#0B3553] border border-[#E6DBC8] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-white border-t border-[#E6DBC8] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about rooms, rates, or rules..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B3553]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#0B3553] hover:bg-[#16486B] disabled:bg-slate-200 text-white transition-colors cursor-pointer"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Floating Launcher Button */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-[#0B3553] hover:bg-[#16486B] text-white font-bold text-xs sm:text-sm px-4 py-3.5 rounded-full shadow-xl border-2 border-[#C8AD7F] transition-transform hover:scale-105 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-[#F5EFE6]" />
          <span>Ask AI Concierge</span>
        </button>
      )}
    </div>
  );
}

// ============================================================================
// 10. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLightboxAmenity, setActiveLightboxAmenity] = useState(null);

  // Progressive Compact Step State:
  // 1 = Only Step 1 expanded
  // 2 = Step 1 retracts into 3 icon buttons; Step 2 expanded
  // 3 = Step 1 & Step 2 retract into minimal icon bars; Step 3 (Calendar + Calculator) shown
  const [activeWizardStep, setActiveWizardStep] = useState(1);

  // Calendar Base Month State (Displays 2 side-by-side months: currentMonth and currentMonth + 1)
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // STEP 1 State: 'staycation' | 'resort' | 'events'
  const [selectedBookingType, setSelectedBookingType] = useState('staycation');

  // STEP 2 State: Selected Package / Room / Event Option
  const [selectedPackageId, setSelectedPackageId] = useState('staycation-vista');

  // STEP 3 State: Selected Date(s) on Calendar (Max 3 days = 3 Days & 2 Nights)
  const initialStartKey = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    return toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
  }, [today]);

  const [selectedDates, setSelectedDates] = useState(() => [
    initialStartKey,
    addDaysToKey(initialStartKey, 1)
  ]);
  const [dateLimitNotice, setDateLimitNotice] = useState('');
  const [customHolidays, setCustomHolidays] = useState({});

  // Calculator Add-on & Inquiry States
  const [guestCount, setGuestCount] = useState(4);
  const [extraSingleMattresses, setExtraSingleMattresses] = useState(0);
  const [extraDoubleMattresses, setExtraDoubleMattresses] = useState(0);
  const [includeGasFee, setIncludeGasFee] = useState(false);
  const [extendedHours, setExtendedHours] = useState(0);
  const [eventTimePreference, setEventTimePreference] = useState(
    'Daytime Event (8:00 AM – 5:00 PM)'
  );
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [guestNotes, setGuestNotes] = useState('');

  // Reservation Summary Modal & FAQ
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const activeBookingTypeObj = useMemo(
    () => BOOKING_TYPES.find((b) => b.id === selectedBookingType) || BOOKING_TYPES[0],
    [selectedBookingType]
  );

  const step2Options = useMemo(
    () => PACKAGES_DATA.filter((p) => p.category === selectedBookingType),
    [selectedBookingType]
  );

  const selectedPackage = useMemo(
    () => PACKAGES_DATA.find((p) => p.id === selectedPackageId) || step2Options[0],
    [selectedPackageId, step2Options]
  );

  // Ensure valid dates when switching between Single-Day Tour and Multi-Day Overnight
  const normalizeDatesForPackage = (pkg, currentDates) => {
    const baseStart = currentDates[0] || initialStartKey;
    if (!pkg.isOvernightMultiDay) {
      return [baseStart];
    }
    if (currentDates.length >= 2) {
      return currentDates.slice(0, 3);
    }
    return [baseStart, addDaysToKey(baseStart, 1)];
  };

  // Step 1 Selection -> Retracts Step 1 into 3 Icon Buttons and opens Step 2
  const handleSelectBookingType = (typeId, scrollToStep = false) => {
    setSelectedBookingType(typeId);
    setDateLimitNotice('');
    const firstMatch = PACKAGES_DATA.find((p) => p.category === typeId);
    if (firstMatch) {
      setSelectedPackageId(firstMatch.id);
      setSelectedDates((prev) => normalizeDatesForPackage(firstMatch, prev));
      setExtraSingleMattresses(0);
      setExtraDoubleMattresses(0);

      if (typeId === 'staycation') {
        setGuestCount(firstMatch.maxPax);
      } else if (typeId === 'events') {
        setGuestCount(40);
      } else {
        setGuestCount(10);
      }
    }

    setActiveWizardStep(2);

    if (scrollToStep) {
      const el = document.getElementById('booking-calendar');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Step 2 Selection -> Retracts Step 2 into compact icon buttons and opens Step 3
  const handleSelectPackage = (pkgId, scrollToCal = false) => {
    const pkg = PACKAGES_DATA.find((p) => p.id === pkgId);
    if (!pkg) return;

    setDateLimitNotice('');
    if (pkg.category !== selectedBookingType) {
      setSelectedBookingType(pkg.category);
    }
    setSelectedPackageId(pkgId);
    setExtraSingleMattresses(0);
    setExtraDoubleMattresses(0);

    if (guestCount < pkg.minPax) {
      setGuestCount(pkg.minPax);
    } else if (guestCount > pkg.maxPax) {
      setGuestCount(pkg.maxPax);
    }

    setSelectedDates((prev) => normalizeDatesForPackage(pkg, prev));
    setActiveWizardStep(3);

    if (scrollToCal) {
      const el = document.getElementById('booking-calendar');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Two side-by-side months (Month 1 & Month 2)
  const secondMonthYear = useMemo(() => {
    if (currentMonth === 11) {
      return { month: 0, year: currentYear + 1 };
    }
    return { month: currentMonth + 1, year: currentYear };
  }, [currentMonth, currentYear]);

  const firstMonthCells = useMemo(
    () =>
      buildMonthDaysMondayFirst(currentYear, currentMonth, selectedPackage, customHolidays, today),
    [currentYear, currentMonth, selectedPackage, customHolidays, today]
  );

  const secondMonthCells = useMemo(
    () =>
      buildMonthDaysMondayFirst(
        secondMonthYear.year,
        secondMonthYear.month,
        selectedPackage,
        customHolidays,
        today
      ),
    [secondMonthYear, selectedPackage, customHolidays, today]
  );

  // Handle Date Click (Supports max 3 days = 3 Days & 2 Nights for overnight/staycation)
  const handleDayClick = (dayItem) => {
    if (!dayItem || dayItem.isPast) return;

    setDateLimitNotice('');

    if (!selectedPackage.isOvernightMultiDay) {
      setSelectedDates([dayItem.dateKey]);
      return;
    }

    // If 0 or >=2 dates are already selected, clicking a date starts a new Check-In selection
    if (selectedDates.length !== 1) {
      setSelectedDates([dayItem.dateKey]);
      return;
    }

    // When 1 date (Check-In) is selected, the next click sets Check-Out (up to max 3 days / 2 nights)
    const startKey = selectedDates[0];
    const diff = diffDaysBetweenKeys(startKey, dayItem.dateKey);

    if (diff === 0) {
      // Clicking the same date defaults to 2 Days & 1 Night
      setSelectedDates([startKey, addDaysToKey(startKey, 1)]);
      return;
    }

    if (diff > 0 && diff <= 2) {
      const range = [];
      for (let i = 0; i <= diff; i++) {
        range.push(addDaysToKey(startKey, i));
      }
      setSelectedDates(range);
      return;
    }

    if (diff > 2) {
      setDateLimitNotice(
        'Maximum overnight stay is 3 Days & 2 Nights (2 nights). Automatically capped at 3 days.'
      );
      setSelectedDates([startKey, addDaysToKey(startKey, 1), addDaysToKey(startKey, 2)]);
      return;
    }

    // If clicked an earlier date than startKey, make that the new Check-In date
    setSelectedDates([dayItem.dateKey]);
  };

  const handleClearDates = () => {
    setDateLimitNotice('');
    setSelectedDates([]);
  };

  // Rate Calculator Computation
  const priceBreakdown = useMemo(() => {
    if (!selectedDates.length) {
      return {
        available: false,
        nightsCount: 0,
        daysCount: 0,
        stayDurationLabel: 'Select dates on calendar',
        nightlyDetails: [],
        baseRate: 0,
        excessGuests: 0,
        excessFee: 0,
        mattressFee: 0,
        gasFee: 0,
        extendedFee: 0,
        downPayment50: 0,
        total: 0,
        hasWeekendStaycationWarning: false
      };
    }

    const isMultiDay = selectedPackage.isOvernightMultiDay;
    const daysCount = isMultiDay ? Math.max(2, selectedDates.length) : 1;
    const nightsCount = isMultiDay ? Math.max(1, daysCount - 1) : 1;

    const nightKeysToCharge = [];
    for (let i = 0; i < nightsCount; i++) {
      nightKeysToCharge.push(addDaysToKey(selectedDates[0], i));
    }

    const nightlyDetails = nightKeysToCharge.map((k, idx) => ({
      nightNumber: idx + 1,
      dateKey: k,
      ...getDayRateInfo(k, selectedPackage, customHolidays)
    }));

    const allAvailable = nightlyDetails.every((n) => n.available);
    const hasWeekendStaycationWarning =
      selectedPackage.category === 'staycation' && nightlyDetails.some((n) => n.isPeakDay);

    const baseRate = nightlyDetails.reduce((sum, n) => sum + (n.rate || 0), 0);
    const excessGuests = Math.max(0, guestCount - selectedPackage.maxPax);

    // PDF: Staycation extra guest is P300 per person per stay; Resort extra guest is per head
    const excessFee =
      selectedPackage.category === 'staycation'
        ? excessGuests * selectedPackage.excessFeePerHead
        : excessGuests * selectedPackage.excessFeePerHead * nightsCount;

    // PDF: Extra single mattress = P150/night, Extra double mattress = P200/night
    const mattressFeePerNight = extraSingleMattresses * 150 + extraDoubleMattresses * 200;
    const mattressFee = mattressFeePerNight * nightsCount;

    const gasFee = selectedPackage.gasIncluded
      ? 0
      : includeGasFee
      ? selectedPackage.gasFeeOption
      : 0;

    const extendedFee = extendedHours * selectedPackage.extendedHourRate;
    const total = baseRate + excessFee + mattressFee + gasFee + extendedFee;
    const downPayment50 = Math.round(total * 0.5);

    return {
      available: allAvailable,
      nightsCount,
      daysCount,
      stayDurationLabel: isMultiDay
        ? `${daysCount} Days & ${nightsCount} ${nightsCount > 1 ? 'Nights' : 'Night'}`
        : selectedPackage.duration,
      nightlyDetails,
      baseRate,
      excessGuests,
      excessFee,
      mattressFee,
      gasFee,
      extendedFee,
      downPayment50,
      total,
      hasWeekendStaycationWarning
    };
  }, [
    selectedDates,
    guestCount,
    selectedPackage,
    extraSingleMattresses,
    extraDoubleMattresses,
    includeGasFee,
    extendedHours,
    customHolidays
  ]);

  const checkInDateKey = selectedDates[0] || '';
  const checkOutDateKey = useMemo(() => {
    if (!selectedDates.length) return '';
    if (!selectedPackage.isOvernightMultiDay) return selectedDates[0];
    if (selectedDates.length >= 2) return selectedDates[selectedDates.length - 1];
    return addDaysToKey(selectedDates[0], 1);
  }, [selectedDates, selectedPackage]);

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

  // Copy Booking Summary to Clipboard
  const generateSummaryText = () => {
    const bookingCategoryName = activeBookingTypeObj.title;
    const dateSummary = selectedPackage.isOvernightMultiDay
      ? `${formatReadableDate(checkInDateKey)} (2:00 PM) to ${formatReadableDate(
          checkOutDateKey
        )} (12:00 NN) — ${priceBreakdown.stayDurationLabel}`
      : `${formatReadableDate(checkInDateKey)} (${selectedPackage.duration})`;

    const lines = [
      '=== THE FORTS RIVERSIDE PRIVATE RESORT — BOOKING INQUIRY ===',
      `Booking Category: ${bookingCategoryName}`,
      `Selected Option: ${selectedPackage.name} (${selectedPackage.paxLabel})`,
      `Selected Dates: ${dateSummary}`,
      selectedPackage.isEvent ? `Preferred Event Schedule: ${eventTimePreference}` : '',
      selectedPackage.isEvent
        ? `Estimated Event Guests: ${guestCount} Pax`
        : `Registered Guests: ${guestCount} Pax (${priceBreakdown.excessGuests} extra guest/s)`,
      extraSingleMattresses > 0 || extraDoubleMattresses > 0
        ? `Extra Mattresses: ${extraSingleMattresses} Single (₱150/night), ${extraDoubleMattresses} Double (₱200/night)`
        : '',
      !selectedPackage.isEvent
        ? `Kitchen LPG / Gas: ${
            selectedPackage.gasIncluded
              ? 'Included Free (Staycation)'
              : includeGasFee
              ? 'Yes (+Php 400)'
              : 'No'
          }`
        : '',
      !selectedPackage.isEvent && selectedPackage.category === 'staycation'
        ? 'Breakfast: Silog Breakfast Included for Each Registered Guest'
        : '',
      !selectedPackage.isEvent && extendedHours > 0
        ? `Extended Hours: ${extendedHours} hr(s) (+Php ${priceBreakdown.extendedFee})`
        : '',
      selectedPackage.isEvent
        ? 'Rate Status: Requesting Custom Event Price Quotation'
        : `Total Computed Rate: ${formatPHP(priceBreakdown.total)} (50% Down Payment Required: ${formatPHP(
            priceBreakdown.downPayment50
          )})`,
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

  // Helper to render a single month grid matching the reference picture
  const renderCleanMonthGrid = (cells) => {
    return (
      <div>
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 pb-3">
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
          <div>Su</div>
        </div>

        {/* Days Grid (Updated to Blue/Beige Theme) */}
        <div className="grid grid-cols-7 gap-y-1.5">
          {cells.map((dayItem, index) => {
            if (!dayItem) {
              return <div key={`empty-${index}`} className="h-10 sm:h-11" />;
            }

            const selectedIdx = selectedDates.indexOf(dayItem.dateKey);
            const isSelected = selectedIdx !== -1;
            const isStart = selectedIdx === 0;
            const isEnd =
              selectedDates.length > 1 && selectedIdx === selectedDates.length - 1;
            const isMiddle =
              selectedDates.length === 3 && selectedIdx === 1;
            const isSingleSelection = selectedDates.length === 1 && isStart;

            return (
              <div
                key={dayItem.dateKey}
                className="relative h-10 sm:h-11 flex items-center justify-center"
              >
                {/* Continuous Blue/Beige Highlight Strip */}
                {isSelected && !isSingleSelection && (
                  <div
                    className={`absolute inset-y-0.5 bg-[#F5EFE6] ${
                      isStart
                        ? 'left-1/2 right-0'
                        : isEnd
                        ? 'left-0 right-1/2'
                        : 'inset-x-0'
                    }`}
                  />
                )}

                <button
                  type="button"
                  disabled={dayItem.isPast}
                  onClick={() => handleDayClick(dayItem)}
                  title={
                    dayItem.holidayName
                      ? `${dayItem.holidayName} (Holiday Rate Applies)`
                      : undefined
                  }
                  className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm transition-all select-none ${
                    dayItem.isPast
                      ? 'text-slate-300 line-through cursor-not-allowed font-normal'
                      : isStart || isEnd
                      ? 'bg-[#0B3553] text-white font-bold shadow-md ring-2 ring-[#C8AD7F] cursor-pointer scale-[1.03]'
                      : isMiddle
                      ? 'bg-[#0B3553]/15 text-[#0B3553] font-bold cursor-pointer'
                      : 'hover:border hover:border-[#0B3553] text-slate-700 font-semibold cursor-pointer'
                  }`}
                >
                  {dayItem.day}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
          TOP ANNOUNCEMENT BAR
      ========================================== */}
      <div className="bg-[#0B3553] text-white text-xs sm:text-sm py-2.5 px-4 text-center border-b border-[#C8AD7F]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#F5EFE6]">
            <Sparkles className="w-3.5 h-3.5 text-[#C8AD7F]" />
            Updated 2026 Staycation & Resort Rates!
          </span>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="text-white/90">
            22-Hr Staycation Rooms from ₱2,000 (w/ Free Silog Breakfast, Pool & LPG)
          </span>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="text-white/90">
            Overnight Stays Up to 3 Days & 2 Nights
          </span>
        </div>
      </div>

      {/* ==========================================
          STICKY NAVIGATION BAR
      ========================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
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

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#home" className="hover:text-[#0B3553] transition-colors">
              Home
            </a>
            <a href="#rooms" className="hover:text-[#0B3553] transition-colors">
              Rooms
            </a>
            <a href="#packages" className="hover:text-[#0B3553] transition-colors">
              Packages & Rates
            </a>
            <a href="#amenities" className="hover:text-[#0B3553] transition-colors">
              Amenities
            </a>
            <a href="#rules" className="hover:text-[#0B3553] transition-colors">
              Policies & Rules
            </a>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#booking-calendar"
              className="inline-flex items-center gap-2 bg-[#0B3553] hover:bg-[#16486B] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-[#F5EFE6]" />
              Book Now!
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-[#0B3553] hover:bg-[#F5EFE6]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1.5">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              Home
            </a>
            <a
              href="#booking-calendar"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8] font-bold"
            >
              3-Step Calendar & Rate Calculator
            </a>
            <a
              href="#rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              Staycation Rooms (The Cozy Den, Vista, Hideout, River Loft)
            </a>
            <a
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              Packages & Rates Table
            </a>
            <a
              href="#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              Amenities Photo Gallery
            </a>
            <a
              href="#rules"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              Staycation Policies & Rules
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
            >
              Guest Reviews
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium"
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
                Unwind by the scenic Angat River. Book a <strong>22-Hour Room-Only Staycation</strong>{' '}
                (inclusive of Silog breakfast, pool access, LPG cooking & karaoke) or reserve the{' '}
                <strong>Whole Resort Exclusively</strong> for your family and barkada.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="#booking-calendar"
                  className="inline-flex items-center gap-2.5 bg-[#F5EFE6] hover:bg-white text-[#0B3553] font-bold px-6 py-4 rounded-xl shadow-lg transition-all cursor-pointer text-sm sm:text-base"
                >
                  <CalendarIcon className="w-5 h-5 text-[#0B3553]" />
                  See Availability
                </a>
                <a
                  href="#rooms"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-xl border border-white/25 backdrop-blur-xs transition-all text-sm sm:text-base"
                >
                  <BedDouble className="w-4 h-4 text-[#E6DBC8]" />
                  Explore our Rooms
                </a>
              </div>
            </div>
          </div>

          
        </div>
      </section>

      {/* ==========================================
          2-MONTH CALENDAR + RATE CALCULATOR
      ========================================== */}
      <section id="booking-calendar" className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0B3553] bg-[#F5EFE6] border border-[#E6DBC8] px-4 py-1.5 rounded-full mb-3">
              <CalendarIcon className="w-3.5 h-3.5 text-[#0B3553]" />
              Guided 3-Step Booking & Rate Calculator
            </span>
            <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553]">
              Select Your Stay & Calculate Your Rate
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              View your all-in price rates and availability with your preffered booking dates!
            </p>
          </div>

          {/* ==========================================
              RETRACTED MINIMAL ICON BAR (VISIBLE IN STEP 2 & STEP 3)
          ========================================== */}
          {activeWizardStep > 1 && (
            <div className="mb-6 bg-[#FAF8F5] border border-[#E6DBC8] rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              {/* Retracted Step 1: 3 Minimal Icon Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveWizardStep(1)}
                  className="text-xs font-bold text-[#0B3553] hover:underline flex items-center gap-1.5 cursor-pointer"
                  title="Click to expand Step 1 descriptions"
                >
                  <span className="w-5 h-5 rounded-full bg-[#0B3553] text-white text-[10px] flex items-center justify-center">
                    1
                  </span>
                  <span className="hidden sm:inline">Step 1:</span>
                </button>

                <div className="inline-flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-[#E6DBC8]">
                  {BOOKING_TYPES.map((type) => {
                    const IconComp = type.icon;
                    const isSelected = selectedBookingType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleSelectBookingType(type.id)}
                        title={`${type.title} (${type.subtitle})`}
                        className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B3553] text-white shadow-xs ring-2 ring-[#C8AD7F]'
                            : 'text-slate-500 hover:bg-[#F5EFE6] hover:text-[#0B3553]'
                        }`}
                        aria-label={type.title}
                      >
                        <IconComp className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-bold text-[#0B3553] bg-white px-3 py-1.5 rounded-lg border border-[#E6DBC8]">
                  {activeBookingTypeObj.title}
                </span>
              </div>

              {/* Retracted Step 2: Minimal Icon Buttons (Visible when in Step 3) */}
              {activeWizardStep === 3 && (
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveWizardStep(2)}
                    className="text-xs font-bold text-[#0B3553] hover:underline flex items-center gap-1.5 cursor-pointer"
                    title="Click to expand Step 2 options"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#0B3553] text-white text-[10px] flex items-center justify-center">
                      2
                    </span>
                    <span className="hidden sm:inline">Step 2:</span>
                  </button>

                  <div className="inline-flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-[#E6DBC8] flex-wrap">
                    {step2Options.map((pkg) => {
                      const PkgIcon = pkg.icon || BedDouble;
                      const isSelected = pkg.id === selectedPackage.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => handleSelectPackage(pkg.id)}
                          title={`${pkg.name} (${pkg.paxLabel})`}
                          className={`h-9 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1D5B8C] text-white shadow-2xs'
                              : 'text-slate-500 hover:bg-[#F5EFE6] hover:text-[#0B3553]'
                          }`}
                        >
                          <PkgIcon className="w-4 h-4 shrink-0" />
                          <span className={isSelected ? 'inline' : 'hidden xl:inline'}>
                            {pkg.shortName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveWizardStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-[#0B3553] flex items-center gap-1 ml-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>
            </div>
          )}

          {/* ==========================================
              STEP 1 EXPANDED VIEW (ONLY SHOWN WHEN activeWizardStep === 1)
          ========================================== */}
          {activeWizardStep === 1 && (
            <div className="max-w-4xl mx-auto bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[#E6DBC8] shadow-xs">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-7 h-7 rounded-full bg-[#0B3553] text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0B3553]">
                    Step 1: Choose Your Booking Category
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click an option below.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BOOKING_TYPES.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selectedBookingType === type.id;

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleSelectBookingType(type.id)}
                      className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-[#0B3553] text-white border-[#0B3553] shadow-md'
                          : 'bg-white hover:bg-[#F5EFE6]/60 text-slate-800 border-[#E6DBC8] hover:border-[#0B3553]'
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
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              isSelected
                                ? 'bg-[#F5EFE6] text-[#0B3553]'
                                : 'bg-[#F5EFE6] text-[#8A6D3B] border border-[#E6DBC8]'
                            }`}
                          >
                            {type.badge}
                          </span>
                        </div>

                        <h4
                          className={`text-xl font-brand-serif font-bold ${
                            isSelected ? 'text-white' : 'text-[#0B3553]'
                          }`}
                        >
                          {type.title}
                        </h4>
                        <p
                          className={`text-xs font-semibold mt-1 ${
                            isSelected ? 'text-[#E6DBC8]' : 'text-[#1D5B8C]'
                          }`}
                        >
                          {type.subtitle}
                        </p>
                        <p
                          className={`text-xs mt-2.5 leading-relaxed ${
                            isSelected ? 'text-slate-200' : 'text-slate-600'
                          }`}
                        >
                          {type.shortDesc}
                        </p>
                      </div>

                      <div
                        className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                          isSelected
                            ? 'border-white/20 text-[#F5EFE6]'
                            : 'border-slate-100 text-[#0B3553]'
                        }`}
                      >
                        <span>Select & Continue</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==========================================
              STEP 2 EXPANDED VIEW (ONLY SHOWN WHEN activeWizardStep === 2)
          ========================================== */}
          {activeWizardStep === 2 && (
            <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-6 border border-[#E6DBC8] shadow-xs">
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
                      Select an option below.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`mt-4 grid grid-cols-1 sm:grid-cols-2 ${
                  selectedBookingType === 'staycation' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
                } gap-3.5`}
              >
                {step2Options.map((pkg) => {
                  const isSelected = pkg.id === selectedPackage.id;
                  const PkgIcon = pkg.icon || BedDouble;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handleSelectPackage(pkg.id)}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#0B3553] text-white border-[#0B3553] shadow-sm ring-2 ring-[#C8AD7F]'
                          : 'bg-white hover:bg-[#F5EFE6]/50 text-slate-800 border-slate-200 hover:border-[#0B3553]/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-[#F5EFE6] text-[#0B3553]'
                                : 'bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8]'
                            }`}
                          >
                            <PkgIcon className="w-3 h-3" />
                            {pkg.paxLabel}
                          </span>
                          <span
                            className={`text-[11px] font-medium ${
                              isSelected ? 'text-[#E6DBC8]' : 'text-slate-400'
                            }`}
                          >
                            {pkg.timeLabel}
                          </span>
                        </div>

                        <p
                          className={`font-bold text-base mt-2.5 ${
                            isSelected ? 'text-white' : 'text-[#0B3553]'
                          }`}
                        >
                          {pkg.name}
                        </p>

                        <p
                          className={`text-xs mt-1 line-clamp-2 ${
                            isSelected ? 'text-slate-200' : 'text-slate-500'
                          }`}
                        >
                          {pkg.includedRooms}
                        </p>
                      </div>

                      <div
                        className={`mt-4 pt-2.5 border-t flex items-center justify-between text-xs font-bold ${
                          isSelected
                            ? 'border-white/20 text-[#F5EFE6]'
                            : 'border-slate-100 text-[#1D5B8C]'
                        }`}
                      >
                        {pkg.isEvent ? (
                          <span>Inquire Rate →</span>
                        ) : (
                          <span>
                            {formatPHP(pkg.weekdayRate)} – {formatPHP(pkg.weekendRate)}
                          </span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==========================================
              STEP 3: 2-MONTH CALENDAR + RATE CALCULATOR
              (SHOWN WHEN activeWizardStep === 3)
          ========================================== */}
          {activeWizardStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT 7 COLUMNS: AIRBNB SCREENSHOT-STYLE 2-MONTH CALENDAR CARD */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6DBC8] shadow-sm p-6 sm:p-8">
                {/* Top Header Matching Reference Screenshot */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
                  <div>
                    <h3 className="text-2xl sm:text-[26px] font-bold text-[#0B3553] tracking-tight leading-tight">
                      {!selectedDates.length
                        ? 'Select dates'
                        : selectedPackage.isOvernightMultiDay
                        ? `${priceBreakdown.nightsCount} ${
                            priceBreakdown.nightsCount === 1 ? 'night' : 'nights'
                          }`
                        : selectedPackage.shortName}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {!selectedDates.length
                        ? 'Add your travel dates for exact pricing'
                        : selectedPackage.isOvernightMultiDay
                        ? `${formatReadableDate(checkInDateKey)} - ${formatReadableDate(checkOutDateKey)}`
                        : `${formatReadableDate(checkInDateKey)} (${selectedPackage.timeLabel})`}
                    </p>
                  </div>

                  {/* Twin Bordered CHECK-IN / CHECK-OUT Input Boxes */}
                  <div className="grid grid-cols-2 border border-[#E6DBC8] rounded-xl overflow-hidden bg-white shrink-0 min-w-[270px] sm:min-w-[300px]">
                    {/* CHECK-IN BOX */}
                    <div className="p-2.5 pl-3.5 border-2 border-[#0B3553] rounded-xl flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#0B3553]">
                          CHECK-IN
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#0B3553]">
                          {checkInDateKey ? formatSlashDate(checkInDateKey) : 'Add date'}
                        </span>
                      </div>
                      {checkInDateKey && (
                        <button
                          type="button"
                          onClick={handleClearDates}
                          className="p-1 text-slate-400 hover:text-[#0B3553] cursor-pointer"
                          aria-label="Clear Check-in"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* CHECK-OUT BOX */}
                    <div className="p-2.5 pl-3.5 flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                          CHECK-OUT
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">
                          {checkOutDateKey ? formatSlashDate(checkOutDateKey) : 'Add date'}
                        </span>
                      </div>
                      {checkOutDateKey && (
                        <button
                          type="button"
                          onClick={handleClearDates}
                          className="p-1 text-slate-400 hover:text-[#0B3553] cursor-pointer"
                          aria-label="Clear Check-out"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notice Banner if User Tried to Select > 3 Days */}
                {dateLimitNotice && (
                  <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{dateLimitNotice}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDateLimitNotice('')}
                      className="text-amber-700 hover:text-amber-900 font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Two-Month Side-by-Side Calendar View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  {/* MONTH 1 */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={goToPreviousMonth}
                        className="p-1.5 rounded-full hover:bg-[#F5EFE6] text-[#0B3553] transition-colors cursor-pointer"
                        aria-label="Previous Month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <h4 className="text-sm sm:text-base font-bold text-[#0B3553]">
                        {monthNames[currentMonth]} {currentYear}
                      </h4>
                      <div className="w-7 md:hidden">
                        <button
                          type="button"
                          onClick={goToNextMonth}
                          className="p-1.5 rounded-full hover:bg-[#F5EFE6] text-[#0B3553] transition-colors cursor-pointer"
                          aria-label="Next Month"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="hidden md:block w-7" />
                    </div>
                    {renderCleanMonthGrid(firstMonthCells)}
                  </div>

                  {/* MONTH 2 */}
                  <div className="hidden md:block">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-7" />
                      <h4 className="text-sm sm:text-base font-bold text-[#0B3553]">
                        {monthNames[secondMonthYear.month]} {secondMonthYear.year}
                      </h4>
                      <button
                        type="button"
                        onClick={goToNextMonth}
                        className="p-1.5 rounded-full hover:bg-[#F5EFE6] text-[#0B3553] transition-colors cursor-pointer"
                        aria-label="Next Month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    {renderCleanMonthGrid(secondMonthCells)}
                  </div>
                </div>

                {/* Bottom Bar: Keyboard Icon + Clear / Done Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Keyboard className="w-4 h-4 text-slate-400" />
                    <span>
                      {selectedPackage.isOvernightMultiDay
                        ? 'Select up to 3 Days & 2 Nights (Max 2 nights)'
                        : 'Single-day tour selection'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleClearDates}
                      className="text-xs sm:text-sm font-bold text-[#0B3553] underline hover:text-[#1D5B8C] cursor-pointer"
                    >
                      Clear dates
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedDates.length) {
                          setSelectedDates([
                            initialStartKey,
                            addDaysToKey(initialStartKey, 1)
                          ]);
                        }
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#0B3553] hover:bg-[#16486B] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                    >
                      {selectedPackage.isOvernightMultiDay && selectedDates.length === 1
                        ? 'Select Check-Out'
                        : 'Done'}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLUMNS: LIVE RATE CALCULATOR */}
              <div className="lg:col-span-5 bg-[#FAF8F5] rounded-3xl border border-[#E6DBC8] shadow-sm overflow-hidden sticky top-24">
                <div className="p-5 sm:p-6 bg-[#0B3553] text-white border-b-2 border-[#C8AD7F]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-widest text-[#E6DBC8] font-bold">
                      Rate Calculator • {activeBookingTypeObj.shortLabel}
                    </span>
                    <span className="text-[11px] font-bold bg-white/15 text-[#F5EFE6] px-2.5 py-0.5 rounded-full">
                      {selectedPackage.paxLabel}
                    </span>
                  </div>
                  <h3 className="text-2xl font-brand-serif font-bold mt-1">
                    {selectedPackage.name}
                  </h3>
                  <p className="text-xs text-slate-200 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C8AD7F]" />
                    {priceBreakdown.stayDurationLabel}
                  </p>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  {/* Weekend/Holiday Staycation Advance Booking Policy Note */}
                  {priceBreakdown.hasWeekendStaycationWarning && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-950">
                          Weekend / Holiday Room-Only Policy:
                        </strong>
                        Weekend & holiday room-only bookings apply the Weekend/Holiday rate (
                        {formatPHP(selectedPackage.weekendRate)}/night) and open{' '}
                        <strong>7 days before the target date</strong> if no whole-resort booking is
                        confirmed.
                      </div>
                    </div>
                  )}

                  {/* IF EVENTS BOOKING */}
                  {selectedPackage.isEvent ? (
                    <div className="space-y-4">
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
                            'Overnight Celebration (2:00 PM – 12:00 NN)'
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
                    </div>
                  ) : (
                    /* LIVE RATE CALCULATOR FOR STAYCATION & RESORT BOOKINGS */
                    <>
                      <div className="space-y-3.5">
                        {/* Guest Counter */}
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-bold text-[#0B3553] flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-[#1D5B8C]" />
                              Total Registered Guests
                            </label>
                            <p className="text-xs text-slate-500">
                              Base: {selectedPackage.paxLabel} 
          
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
                            <span className="w-9 text-center font-bold text-sm text-[#0B3553]">
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

                        {/* Extra Mattresses (From PDF: Single P150/night, Double P200/night) */}
                        {selectedPackage.isOvernightMultiDay && (
                          <div className="pt-3 border-t border-[#E6DBC8]/70 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs sm:text-sm font-bold text-[#0B3553]">
                                  Extra Single Mattress (+₱150/night)
                                </span>
                                
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExtraSingleMattresses(Math.max(0, extraSingleMattresses - 1))
                                  }
                                  className="w-7 h-7 rounded-lg bg-white border border-[#E6DBC8] flex items-center justify-center hover:bg-[#F5EFE6] cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5 text-[#0B3553]" />
                                </button>
                                <span className="w-6 text-center font-bold text-xs text-[#0B3553]">
                                  {extraSingleMattresses}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExtraSingleMattresses(extraSingleMattresses + 1)
                                  }
                                  className="w-7 h-7 rounded-lg bg-white border border-[#E6DBC8] flex items-center justify-center hover:bg-[#F5EFE6] cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5 text-[#0B3553]" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs sm:text-sm font-bold text-[#0B3553]">
                                  Extra Double Mattress (+₱200/night)
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExtraDoubleMattresses(Math.max(0, extraDoubleMattresses - 1))
                                  }
                                  className="w-7 h-7 rounded-lg bg-white border border-[#E6DBC8] flex items-center justify-center hover:bg-[#F5EFE6] cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5 text-[#0B3553]" />
                                </button>
                                <span className="w-6 text-center font-bold text-xs text-[#0B3553]">
                                  {extraDoubleMattresses}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExtraDoubleMattresses(extraDoubleMattresses + 1)
                                  }
                                  className="w-7 h-7 rounded-lg bg-white border border-[#E6DBC8] flex items-center justify-center hover:bg-[#F5EFE6] cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5 text-[#0B3553]" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Kitchen LPG / Gas Option */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#E6DBC8]/70">
                          <div>
                            <span className="text-sm font-bold text-[#0B3553] flex items-center gap-1.5">
                              <Flame className="w-4 h-4 text-[#8A6D3B]" />
                              Kitchen & LPG Cooking Use
                            </span>
                            <p className="text-xs text-slate-500">
                              {selectedPackage.gasIncluded
                                ? 'Included Free with Staycation'
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
                      </div>

                      {/* Itemized Rate Calculator Breakdown Box */}
                      <div className="p-4 rounded-2xl bg-[#0B3553] text-white space-y-2">
                        <div className="flex items-center justify-between pb-1 border-b border-white/15">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#E6DBC8]">
                            Computed Rate Breakdown
                          </span>
                          <span className="text-[11px] text-[#F5EFE6] font-semibold">
                            {priceBreakdown.stayDurationLabel}
                          </span>
                        </div>

                        {priceBreakdown.nightlyDetails.map((n) => (
                          <div
                            key={n.dateKey}
                            className="flex justify-between text-xs sm:text-sm text-slate-200"
                          >
                            <span>
                              {selectedPackage.isOvernightMultiDay
                                ? `Night ${n.nightNumber}: ${formatReadableDate(n.dateKey)} (${
                                    n.isPeakDay ? 'Wknd/Hol' : 'Weekday'
                                  })`
                                : `${selectedPackage.shortName} (${n.tierLabel})`}
                            </span>
                            <span className="font-semibold text-white">{formatPHP(n.rate)}</span>
                          </div>
                        ))}

                        {selectedPackage.category === 'staycation' && (
                          <div className="flex justify-between text-xs text-[#E6DBC8]">
                            <span>Silog Breakfast ({guestCount} registered guests)</span>
                            <span className="font-semibold">Included Free</span>
                          </div>
                        )}

                        {priceBreakdown.excessGuests > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm text-[#F5EFE6]">
                            <span>
                              Extra Guests ({priceBreakdown.excessGuests} pax ×{' '}
                              {formatPHP(selectedPackage.excessFeePerHead)})
                            </span>
                            <span className="font-semibold">
                              +{formatPHP(priceBreakdown.excessFee)}
                            </span>
                          </div>
                        )}

                        {priceBreakdown.mattressFee > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm text-[#F5EFE6]">
                            <span>
                              Extra Mattresses ({extraSingleMattresses}S / {extraDoubleMattresses}D ×{' '}
                              {priceBreakdown.nightsCount}n)
                            </span>
                            <span className="font-semibold">
                              +{formatPHP(priceBreakdown.mattressFee)}
                            </span>
                          </div>
                        )}

                        {priceBreakdown.gasFee > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm text-[#F5EFE6]">
                            <span>Kitchen LPG Use</span>
                            <span className="font-semibold">+{formatPHP(priceBreakdown.gasFee)}</span>
                          </div>
                        )}

                        <div className="pt-2.5 border-t border-white/20 flex items-baseline justify-between">
                          <span className="text-sm font-bold text-white">Total Computed Rate</span>
                          <span className="text-2xl font-brand-serif font-extrabold text-[#F5EFE6]">
                            {priceBreakdown.available
                              ? formatPHP(priceBreakdown.total)
                              : 'Select Dates'}
                          </span>
                        </div>

                        {priceBreakdown.available && (
                          <div className="pt-1 flex items-center justify-between text-xs text-[#E6DBC8]">
                            <span>50% Down Payment to Reserve:</span>
                            <span className="font-bold text-white">
                              {formatPHP(priceBreakdown.downPayment50)}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Primary Reserve CTA */}
                  <button
                    type="button"
                    disabled={!priceBreakdown.available}
                    onClick={() => setBookingModalOpen(true)}
                    className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all ${
                      priceBreakdown.available
                        ? 'bg-[#1D5B8C] hover:bg-[#0B3553] text-white cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <CalendarIcon className="w-5 h-5 text-[#F5EFE6]" />
                    {selectedPackage.isEvent
                      ? 'Request Event Quotation'
                      : priceBreakdown.available
                      ? 'Reserve Selected Dates'
                      : 'Select Your Dates on Calendar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          OFFICIAL 4 STAYCATION ROOMS (FROM PDF PAGES 1–5 & 9)
      ========================================== */}
      <section id="rooms" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E6DBC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0B3553] bg-[#F5EFE6] border border-[#E6DBC8] px-3.5 py-1.5 rounded-full mb-3">
              <BedDouble className="w-3.5 h-3.5 text-[#0B3553]" />
              Explore your Accomodations
            </span>
            <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553]">
              Our 4 Relaxing Rooms
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Your comfort is our priority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ROOMS_DATA.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-[#E6DBC8] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                  <SmartResortImage
                    localSrc={room.localSrc}
                    fallbackSrc={room.image}
                    alt={`${room.name} - ${room.subtitle}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="bg-[#0B3553]/95 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#F5EFE6]" />
                      {room.capacity}
                    </span>
                    <span className="bg-white/95 backdrop-blur-xs text-[#0B3553] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <Coffee className="w-3.5 h-3.5 text-[#8A6D3B]" />
                      Free Silog Breakfast
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-2xl sm:text-3xl font-brand-serif font-bold text-[#0B3553]">
                        {room.name}
                      </h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1D5B8C]">
                        {room.subtitle}
                      </span>
                    </div>
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

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">{room.extraMattressNote}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          PACKAGES & OFFICIAL STAYCATION RATE TABLE (FROM PDF PAGE 9)
      ========================================== */}
      <section id="packages" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[#8A6D3B] font-bold text-xs uppercase tracking-[0.2em]">
              Official Rate Sheet & Inclusions
            </span>
            <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553] mt-2">
              Staycation & Exclusive Resort Packages
            </h2>
          </div>

          {/* 1. ROOM-ONLY STAYCATION RATES TABLE (PDF PAGE 9) */}
          <div className="mb-16 bg-[#FAF8F5] rounded-3xl border border-[#E6DBC8] overflow-hidden shadow-xs">
            <div className="p-6 sm:p-8 bg-[#0B3553] text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C8AD7F]">
                  Room-Only Staycation Rates • 22-Hour Stay
                </span>
                <h3 className="text-2xl sm:text-3xl font-brand-serif font-bold mt-1">
                  Check-in 2:00 PM • Check-out 12:00 NN
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Silog breakfast, swimming pool access, kitchen &amp; LPG use, Wi-Fi, parking &amp;
                  karaoke are included.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Room Rate Table */}
              <div className="lg:col-span-7 overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white rounded-2xl overflow-hidden border border-[#E6DBC8]">
                  <thead>
                    <tr className="bg-[#F5EFE6] text-[#0B3553] text-xs font-extrabold uppercase">
                      <th className="py-3.5 px-4 border-b border-[#E6DBC8]">Room</th>
                      <th className="py-3.5 px-4 border-b border-[#E6DBC8]">Weekday</th>
                      <th className="py-3.5 px-4 border-b border-[#E6DBC8]">Weekend / Holiday</th>
                      <th className="py-3.5 px-4 border-b border-[#E6DBC8] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#0B3553]">
                        THE COZY DEN <span className="text-slate-500 font-normal">(2–4 pax)</span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0B3553]">₱2,000</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#1D5B8C]">₱2,500</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectPackage('staycation-cozy-den', true)}
                          className="text-xs font-bold text-[#0B3553] hover:underline cursor-pointer"
                        >
                          Select →
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#0B3553]">
                        THE VISTA <span className="text-slate-500 font-normal">(2–4 pax)</span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0B3553]">₱2,800</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#1D5B8C]">₱3,300</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectPackage('staycation-vista', true)}
                          className="text-xs font-bold text-[#0B3553] hover:underline cursor-pointer"
                        >
                          Select →
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#0B3553]">
                        THE HIDEOUT <span className="text-slate-500 font-normal">(4–6 pax)</span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0B3553]">₱3,000</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#1D5B8C]">₱3,500</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectPackage('staycation-hideout', true)}
                          className="text-xs font-bold text-[#0B3553] hover:underline cursor-pointer"
                        >
                          Select →
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#0B3553]">
                        THE RIVER LOFT{' '}
                        <span className="text-slate-500 font-normal">(10–15 pax)</span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0B3553]">₱5,000</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#1D5B8C]">₱6,000</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectPackage('staycation-river-loft', true)}
                          className="text-xs font-bold text-[#0B3553] hover:underline cursor-pointer"
                        >
                          Select →
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Additional Charges Table from PDF Page 9 */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-[#E6DBC8] p-5 space-y-3">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#0B3553] border-b border-slate-100 pb-2">
                    Additional Charges (Staycation)
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Extra guest (w/ pool &amp; Silog meal)</span>
                      <span className="font-bold text-[#0B3553]">₱300 / person</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Extra single mattress</span>
                      <span className="font-bold text-[#0B3553]">₱150 / night</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Extra double mattress</span>
                      <span className="font-bold text-[#0B3553]">₱200 / night</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Early check-in / late check-out</span>
                      <span className="font-semibold text-slate-500">Subject to availability</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. EXCLUSIVE RESORT PACKAGES (DAY/NIGHT TOURS & OVERNIGHT EXCLUSIVE) */}
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl sm:text-3xl font-brand-serif font-bold text-[#0B3553] mb-6">
                Exclusive Resort Packages (Day Tour, Night Tour &amp; 22-Hr Overnight)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PACKAGES_DATA.filter((p) => p.category === 'resort').map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-2xl border border-slate-200 bg-white hover:border-[#0B3553]/40 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8] px-2.5 py-1 rounded-md">
                          {pkg.paxLabel}
                        </span>
                        <span className="text-[11px] font-bold text-[#1D5B8C]">
                          {pkg.timeLabel}
                        </span>
                      </div>

                      <h4 className="text-xl font-brand-serif font-bold text-[#0B3553] mt-3">
                        {pkg.name}
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
                            Fri–Sun &amp; Hol:
                          </span>
                          <span className="text-lg font-extrabold text-[#1D5B8C]">
                            {formatPHP(pkg.weekendRate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPackage(pkg.id, true)}
                      className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[#0B3553] hover:bg-[#16486B] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CalendarIcon className="w-3.5 h-3.5 text-[#F5EFE6]" />
                      Select in Rate Calculator
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          VISUAL AMENITIES & INCLUSIONS PHOTO GALLERY
      ========================================== */}
      <section id="amenities" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E6DBC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0B3553] bg-[#F5EFE6] border border-[#E6DBC8] px-3.5 py-1.5 rounded-full mb-3">
                <Camera className="w-3.5 h-3.5 text-[#0B3553]" />
                Resort Photo Tour &amp; Facilities
              </span>
              <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553]">
                Amenities &amp; Shared Spaces
              </h2>
            </div>
          </div>

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
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                      <SmartResortImage
                        localSrc={item.localSrc}
                        fallbackSrc={item.fallbackSrc}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B3553]/70 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3.5 left-3.5">
                        <span className="bg-white/95 backdrop-blur-xs text-[#0B3553] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                          {item.tag}
                        </span>
                      </div>

                      <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#0B3553]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-4 h-4" />
                      </div>

                      <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-2.5 text-white">
                        <div className="p-2 rounded-lg bg-[#0B3553]/90 border border-white/20 text-[#F5EFE6]">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <h3 className="text-xl font-brand-serif font-bold leading-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>

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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          OFFICIAL STAYCATION POLICIES, HOUSE RULES & PAYMENT TERMS (FROM PDF PAGES 6–8)
      ========================================== */}
      <section id="rules" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0B3553] bg-[#F5EFE6] border border-[#E6DBC8] px-3.5 py-1.5 rounded-full mb-3">
              <FileText className="w-3.5 h-3.5 text-[#0B3553]" />
              Official Resort Guidelines
            </span>
            <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553]">
              House Rules, Staycation &amp; Payment Policies
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Please review our official Staycation House Rules and Payment, Cancellation &amp;
              Rescheduling Policy prior to confirming your reservation.
            </p>
          </div>

          {/* 8-Card Grid of Official Staycation Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {STAYCATION_POLICIES_PDF.map((policy) => {
              const IconComp = policy.icon;
              return (
                <div
                  key={policy.num}
                  className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6DBC8] shadow-2xs"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E6DBC8]">
                    <div className="p-2.5 rounded-xl bg-[#0B3553] text-[#F5EFE6]">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A6D3B]">
                        Policy {policy.num}
                      </span>
                      <h3 className="text-xl font-brand-serif font-bold text-[#0B3553]">
                        {policy.title}
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {policy.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#1D5B8C] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Payment, Cancellation & Rescheduling Policy Box (PDF Pages 7-8) */}
          <div className="rounded-3xl bg-[#0B3553] text-white p-6 sm:p-10 border-2 border-[#C8AD7F] shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/15">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10 text-[#C8AD7F]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C8AD7F]">
                    Official Terms &amp; Conditions
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-brand-serif font-bold">
                    Payment, Cancellation &amp; Rescheduling Policy
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold bg-[#F5EFE6] text-[#0B3553] px-3.5 py-2 rounded-xl self-start md:self-auto">
                50% Down Payment Required
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {PAYMENT_CANCELLATION_PDF.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5"
                >
                  <h4 className="text-base font-bold text-[#F5EFE6]">{sec.title}</h4>
                  <ul className="space-y-2">
                    {sec.items.map((it, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs sm:text-sm text-slate-200 leading-relaxed"
                      >
                        <Check className="w-4 h-4 text-[#C8AD7F] shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          GUEST REVIEWS & TESTIMONIALS SECTION
      ========================================== */}
      <section id="reviews" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E6DBC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0B3553] bg-[#F5EFE6] border border-[#E6DBC8] px-3.5 py-1.5 rounded-full mb-3">
                <Star className="w-3.5 h-3.5 text-[#C8AD7F] fill-[#C8AD7F]" />
                Verified Guest Feedback
              </span>
              <h2 className="text-3xl sm:text-5xl font-brand-serif font-bold text-[#0B3553]">
                Guest Reviews &amp; Experiences
              </h2>
            </div>

            <div className="bg-white px-5 py-4 rounded-2xl border border-[#E6DBC8] flex items-center gap-4 self-start md:self-auto shadow-2xs">
              <div className="text-center pr-4 border-r border-[#E6DBC8]">
                <span className="text-3xl font-brand-serif font-extrabold text-[#0B3553] block leading-none">
                  4.9
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A6D3B]">
                  Out of 5.0
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#C8AD7F]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C8AD7F]" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Staycation &amp; Exclusive Resort Guests
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS_DATA.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E6DBC8] shadow-2xs flex flex-col justify-between relative"
              >
                <Quote className="w-8 h-8 text-[#F5EFE6] absolute top-5 right-5" />
                <div>
                  <div className="flex items-center gap-1 text-[#C8AD7F] mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C8AD7F]" />
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-[#0B3553]">{rev.highlight}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#0B3553] block">{rev.name}</span>
                    <span className="text-[#1D5B8C] font-medium">{rev.stayType}</span>
                  </div>
                  <span className="text-slate-400 font-medium">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          DIRECTIONS & LOCATION SECTION
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
                by car or public transport.
              </p>

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
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-[#E6DBC8] shadow-xs bg-[#FAF8F5] relative h-72 sm:h-80 flex flex-col justify-between p-6">
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
                  <div className="w-10 h-10 rounded-full bg-[#F5EFE6] border-4 border-[#0B3553] shadow-lg flex items-center justify-center text-[#0B3553]">
                    <MapPin className="w-5 h-5" />
                  </div>
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
          FOOTER
      ========================================== */}
      <footer className="bg-[#0B3553] text-slate-200 py-14 border-t-4 border-[#C8AD7F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
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
            </div>

            <div className="p-6 sm:p-7 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-brand-serif font-bold text-[#0B3553]">
                {activeLightboxAmenity.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeLightboxAmenity.description}
              </p>
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
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#E6DBC8] font-bold">
                  {activeBookingTypeObj.title} Summary
                </span>
                <h3 className="text-xl font-brand-serif font-bold mt-0.5">
                  {selectedPackage.name}
                </h3>
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
                  Special Requests / Meal Schedule Notes (Optional)
                </label>
                <input
                  type="text"
                  value={guestNotes}
                  onChange={(e) => setGuestNotes(e.target.value)}
                  placeholder="e.g., Silog breakfast preference, extra mattress request..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B3553]"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6DBC8] text-xs sm:text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Dates:</span>
                  <span className="font-bold text-[#0B3553] text-right">
                    {selectedPackage.isOvernightMultiDay
                      ? `${formatReadableDate(checkInDateKey)} → ${formatReadableDate(
                          checkOutDateKey
                        )}`
                      : formatReadableDate(checkInDateKey)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedPackage.isEvent
                      ? eventTimePreference
                      : priceBreakdown.stayDurationLabel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Guests:</span>
                  <span className="font-semibold text-slate-800">
                    {guestCount} Pax ({priceBreakdown.excessGuests} extra)
                  </span>
                </div>
                {!selectedPackage.isEvent && (
                  <>
                    <div className="pt-2 border-t border-[#E6DBC8] flex justify-between items-baseline">
                      <span className="font-bold text-[#0B3553]">Total Computed Rate:</span>
                      <span className="text-xl font-brand-serif font-extrabold text-[#0B3553]">
                        {formatPHP(priceBreakdown.total)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-[#8A6D3B] font-bold">
                      <span>Required 50% Down Payment:</span>
                      <span>{formatPHP(priceBreakdown.downPayment50)}</span>
                    </div>
                  </>
                )}
              </div>

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
      {/* AI CHAT SUPPORT WIDGET */}
      <FortsAIChatbot />
    </div>
  );
}