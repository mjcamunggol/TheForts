import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Waves,
  Utensils,
  Home,
  Sun,
  Moon,
  Sunset,
  BedDouble,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  X,
  Info,
  CreditCard,
  FileText,
  Check,
  TreePine,
  Compass,
  Trophy,
  Printer,
  Copy,
  RefreshCw,
  ArrowRight,
  Lock,
  Camera
} from 'lucide-react';

// ==========================================
// DATA & CONSTANTS
// ==========================================

const WHOLE_RESORT_PACKAGES = [
  {
    id: 'weekday_promo',
    name: 'Weekday Promo Day Tour',
    badge: 'ON-GOING PROMO',
    time: '8:00 AM – 5:00 PM',
    weekdayPrice: 3999,
    weekendPrice: null, // Weekday only (Mon-Thu)
    roomIncluded: 'No Room Included',
    maxGuests: 25,
    validUntil: '2026-11-30',
    weekdayOnly: true,
    description:
      'Special ₱3,999 Weekday Day Tour promo! Includes access to swimming pool, riverside balcony, garden, and outdoor recreational spaces. Valid until November 30, 2026. No room included.',
    highlights: ['Swimming Pool Access', 'Riverside Balcony', 'Outdoor Tables & Garden', 'Up to 25 Guests']
  },
  {
    id: 'day_tour',
    name: 'Riverside Day Tour',
    badge: 'POPULAR DAY ESCAPE',
    time: '8:00 AM – 5:00 PM (9 hrs)',
    weekdayPrice: 8500,
    weekendPrice: 10500,
    roomIncluded: 'Complimentary Overlooking Room',
    maxGuests: 30,
    weekdayOnly: false,
    description:
      'Includes full exclusive access to the resort’s pools, riverside areas, and recreational facilities for a fun-filled daytime escape, plus a complimentary stay in our Overlooking Room.',
    highlights: ['Complimentary Overlooking Room', 'Exclusive Pool & River View', 'Kitchen & Function Space', 'Recreational Court']
  },
  {
    id: 'night_tour',
    name: 'Riverside Night Tour',
    badge: 'SERENE EVENING',
    time: '7:00 PM – 6:00 AM (11 hrs)',
    weekdayPrice: 9500,
    weekendPrice: 11500,
    roomIncluded: 'Complimentary Overlooking Room',
    maxGuests: 30,
    weekdayOnly: false,
    description:
      'Enjoy evening relaxation with warm ambient string lighting, peaceful riverside views, and exclusive access to the resort’s amenities for a serene night getaway.',
    highlights: ['Complimentary Overlooking Room', 'Ambient Night Pool Lighting', 'Kitchen & Grill Area', 'Peaceful River Breeze']
  },
  {
    id: 'overnight_tour',
    name: 'Overnight Tour (22 hrs)',
    badge: 'COMPLETE RETREAT',
    time: '2:00 PM – 12:00 NN (22 hrs)',
    weekdayPrice: 16500,
    weekendPrice: 19500,
    roomIncluded: 'Complimentary Overlooking Room + Full Resort Access',
    maxGuests: 40,
    weekdayOnly: false,
    description:
      'Full 22-hour exclusive access to all resort facilities, private room stay, riverside relaxation, and extended leisure time for a complete escape with family or barkada.',
    highlights: ['22 Hours Exclusive Access', 'Complimentary Overlooking Room', 'All Amenities & Function Area', 'Sunset & Sunrise River Views']
  }
];

const STAYCATION_UNITS = [
  {
    id: 'family_room',
    name: 'Unit 1: Family Room',
    pricePerNight: 3500,
    capacity: 6,
    beds: '2 Queen Beds + Pull-out',
    size: '32 sqm',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
    description: 'Spacious air-conditioned sanctuary ideal for families looking for a peaceful weekend by the Angat River.',
    features: ['Air-Conditioned', 'Private En-suite Bath', 'Shared Pool & Balcony Access', 'Free Wi-Fi']
  },
  {
    id: 'barkada_room',
    name: 'Unit 2: Barkada Room',
    pricePerNight: 4500,
    capacity: 10,
    beds: '3 Custom Bunk Beds + Lounge',
    size: '45 sqm',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
    description: 'Designed for fun group bonding with generous sleeping capacity, sunlit windows, and quick access to the court and pool.',
    features: ['Air-Conditioned', 'Up to 10 Pax Capacity', 'Large Group Layout', 'Pool & Activity Court Access']
  },
  {
    id: 'cozy_room',
    name: 'Unit 3: Cozy Room',
    pricePerNight: 2500,
    capacity: 4,
    beds: '1 Queen Bed + Daybed',
    size: '24 sqm',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80',
    description: 'Intimate and restful room for couples or small groups of 4 wanting a quiet weekend riverside recharge.',
    features: ['Air-Conditioned', 'Natural Sunlight Windows', 'Pool & Garden Access', 'Towels & Basic Toiletries']
  }
];

const ALL_ROOMS_SHOWCASE = [
  {
    name: 'Overlooking Room',
    tag: 'Complimentary with Regular Whole Resort Packages',
    capacity: 'Up to 6 Resting Guests',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    description:
      'Each regular Riverside Tour Package comes with a complimentary stay in our Overlooking Room, giving you a cozy air-conditioned spot to rest with a beautiful, direct view of the Angat River.'
  },
  {
    name: 'Family Room (Staycation Unit 1)',
    tag: '₱3,500 / night • Weekends (Fri–Sun)',
    capacity: 'Up to 6 Pax',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
    description:
      'Comfortable family retreat with warm wood accents, large windows, and restful beds after a day of swimming and riverside bonding.'
  },
  {
    name: 'Barkada Room (Staycation Unit 2)',
    tag: '₱4,500 / night • Weekends (Fri–Sun)',
    capacity: 'Up to 10 Pax',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
    description:
      'Built for laughter and togetherness! Spacious bunk and floor-mattress friendly layout so the whole barkada stays under one roof.'
  },
  {
    name: 'Cozy Room (Staycation Unit 3)',
    tag: '₱2,500 / night • Weekends (Fri–Sun)',
    capacity: 'Up to 4 Pax',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80',
    description:
      'A simple, sunlit, and relaxing space to rest for couples or small groups enjoying a weekend staycation.'
  }
];

const AMENITIES_LIST = [
  {
    title: 'Swimming Pool Area',
    subtitle: 'Adult & Kiddie Pool with Shade Sail',
    icon: Waves,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80',
    description: 'Refreshing blue-tiled swimming pool with a dedicated shallow kiddie section, overhead sun-shade canopy, and warm festoon string lights for night swimming.'
  },
  {
    title: 'Riverside Balcony Area',
    subtitle: 'Golden Hour Over the Angat River',
    icon: Sunset,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    description: 'Elevated viewing deck and balcony right above the calm waters of the Angat River—perfect for morning coffee, sunset watching, and acoustic nights.'
  },
  {
    title: 'Function Space',
    subtitle: 'Spacious Covered Pavilion',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80',
    description: 'Open-air yet roofed gathering hall with marble-tiled floors, tables, and chairs ideal for birthdays, family reunions, and team building.'
  },
  {
    title: 'Kitchen Area',
    subtitle: 'Home Away From Home Prep Space',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
    description: 'Equipped with spacious countertops, sink, preparation tables, and grilling station so you can bring and cook your favorite group meals with zero corkage.'
  },
  {
    title: 'Recreational / Activities Area',
    subtitle: 'Outdoor Court & Active Play',
    icon: Trophy,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80',
    description: 'Dedicated paved court space for badminton, outdoor group games, and morning exercises surrounded by fresh trees.'
  },
  {
    title: 'Garden Area',
    subtitle: 'Breezy Umbrella Tables & Greenery',
    icon: TreePine,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80',
    description: 'Relaxing garden patio with shaded umbrella tables and potted tropical plants for al fresco conversations.'
  }
];

const HOUSE_RULES = [
  {
    title: 'Check-In & Check-Out',
    items: [
      'Day Tour: 8:00 AM – 5:00 PM | Night Tour: 7:00 PM – 6:00 AM',
      'Overnight Tour (22 hrs): 2:00 PM Check-in – 12:00 NN Check-out',
      'Weekend Staycation Units: 2:00 PM Check-in – 12:00 NN Check-out',
      'Early check-in or late check-out is subject to availability and hourly extension fees.'
    ]
  },
  {
    title: 'Swimming Pool & Riverside Safety',
    items: [
      'Proper swimming attire is strictly required before entering the pool.',
      'Shower first before using the swimming pool.',
      'Children must be supervised by an adult at all times, especially near the pool and riverside balcony railings.',
      'No diving on the shallow end and no running on wet pool decks.'
    ]
  },
  {
    title: 'Noise, Videoke & Quiet Hours',
    items: [
      'Moderate music and videoke are allowed until 10:00 PM in compliance with local barangay ordinances.',
      'For Staycation guests, please respect fellow unit guests during late evening hours.',
      'Whole Resort Overnight bookings may enjoy acoustic/low-volume music after 10:00 PM.'
    ]
  },
  {
    title: 'Kitchen, Cleanliness & Damages',
    items: [
      'Clean As You Go (CLAYGO) is encouraged in the kitchen, dining, and poolside areas.',
      'No smoking or vaping inside the air-conditioned rooms (designated outdoor areas only).',
      'Any lost keys, stained linens, or property damage will be charged accordingly upon check-out.'
    ]
  }
];

const FAQ_ITEMS = [
  {
    q: 'How does the Staycation vs. Whole Resort booking rule work?',
    a: 'The Forts has 3 individual Staycation Units (Family Room, Barkada Room, Cozy Room) available on Weekends only (Friday, Saturday, Sunday). Whole Resort bookings are available any day of the week. However, they are mutually exclusive: if at least 1 Staycation Unit is already booked on a weekend date, the Whole Resort cannot be booked for that date (and vice versa).'
  },
  {
    q: 'How much is required to reserve a date?',
    a: 'A 50% down payment is required to secure your booking. The remaining 50% balance is due upon arrival at the resort unless otherwise agreed. Bookings are officially confirmed only after payment verification.'
  },
  {
    q: 'What is included in the ₱3,999 Weekday Promo?',
    a: 'The ₱3,999 Weekday Day Tour Promo is valid on Mondays through Thursdays until November 30, 2026 (8:00 AM – 5:00 PM). It includes exclusive day use of the swimming pool, riverside balcony, function area, and garden, with No Room Included. Subject to availability.'
  },
  {
    q: 'Can we reschedule or cancel our booking?',
    a: 'Guest-initiated cancellations are generally non-refundable and no-shows forfeit the deposit. However, one (1) reschedule may be requested at least 7 days before the booking date, subject to availability and management approval (rate differences may apply).'
  },
  {
    q: 'Is there corkage for bringing food and drinks?',
    a: 'There is NO corkage fee for bringing your own food, snacks, and beverages! You also have access to our Kitchen Area for food preparation.'
  },
  {
    q: 'How do we get to The Forts Riverside Private Resort?',
    a: 'We are located near the scenic Angat River and Beltran Street (accessible via Hedro Looban / Philadelphia area). You can reach us easily via private car (Waze/Google Maps: The Forts Riverside Private Resort) or via local public transport and tricycle.'
  }
];

// Helper to format YYYY-MM-DD
const formatDateKey = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

const parseDateKey = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const isWeekendDate = (dateStr) => {
  const dt = parseDateKey(dateStr);
  const day = dt.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
  return day === 0 || day === 5 || day === 6;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const dt = parseDateKey(dateStr);
  return dt.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatPHP = (num) => {
  return '₱' + Number(num || 0).toLocaleString('en-PH');
};

// Initial pre-populated bookings for October & November 2026 to demonstrate the client's mutual-exclusivity rules clearly
const INITIAL_BOOKINGS = {
  // Whole resort already booked on Saturday Oct 31, 2026
  '2026-10-31': {
    wholeResortBooked: true,
    packageId: 'overnight_tour',
    bookedUnits: [],
    note: 'Reserved: Whole Resort (Overnight Tour)'
  },
  // Staycation Unit 1 (Family Room) booked on Sunday Nov 1, 2026 -> blocks Whole Resort, leaves Unit 2 & 3 open!
  '2026-11-01': {
    wholeResortBooked: false,
    packageId: null,
    bookedUnits: ['family_room'],
    note: '1/3 Staycation Units Booked (Family Room) — Whole Resort Unavailable'
  },
  // Whole resort booked on Nov 4, 2026 (Weekday Promo)
  '2026-11-04': {
    wholeResortBooked: true,
    packageId: 'weekday_promo',
    bookedUnits: [],
    note: 'Reserved: Whole Resort (Weekday Promo)'
  },
  // Two staycation units booked on Saturday Nov 7, 2026 -> only Cozy Room left
  '2026-11-07': {
    wholeResortBooked: false,
    packageId: null,
    bookedUnits: ['family_room', 'barkada_room'],
    note: '2/3 Staycation Units Booked — Only Cozy Room Left'
  }
};

export default function App() {
  // Navigation & Scroll refs
  const bookingSectionRef = useRef(null);
  const promoSectionRef = useRef(null);
  const packagesSectionRef = useRef(null);
  const roomsSectionRef = useRef(null);
  const rulesSectionRef = useRef(null);
  const faqSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  // Live Bookings Database (Date Key -> Booking status)
  const [bookingsDB, setBookingsDB] = useState(INITIAL_BOOKINGS);
  const [recentConfirmations, setRecentConfirmations] = useState([]);

  // Calendar State (Default October 2026 based on current context)
  const [currentMonth, setCurrentMonth] = useState({ year: 2026, month: 9 }); // 9 = October (0-indexed)
  const [selectedDate, setSelectedDate] = useState('2026-10-27'); // Default a Tuesday for promo/whole resort or easy switching

  // Booking Mode: 'whole_resort' | 'staycation'
  const [bookingMode, setBookingMode] = useState('whole_resort');
  const [selectedPackageId, setSelectedPackageId] = useState('overnight_tour');
  const [selectedStaycationUnits, setSelectedStaycationUnits] = useState(['family_room']);
  const [guestCount, setGuestCount] = useState(15);

  // Guest Form & Policy Agreement State
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('GCash');
  const [paymentRefNumber, setPaymentRefNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // Modals State
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [activeConfirmation, setActiveConfirmation] = useState(null);
  const [formError, setFormError] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // AI Chat Support State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Mabuhay! Welcome to **The Forts Riverside Private Resort** 🌿🌊\n\nI am your AI Resort Concierge. I can:\n• Check real-time date availability (Whole Resort vs. 3 Staycation Units)\n• Explain our **₱3,999 Weekday Promo** & Tour Packages\n• Answer questions about our **50% Downpayment & Cancellation Policy**\n• **Submit a booking directly for you** right here in chat!\n\nHow can I help plan your riverside getaway today?'
    }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // Smooth scroll helper
  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Determine date status for any YYYY-MM-DD
  const getDateAvailability = (dateStr) => {
    const record = bookingsDB[dateStr] || {
      wholeResortBooked: false,
      packageId: null,
      bookedUnits: []
    };
    const weekend = isWeekendDate(dateStr);
    const hasStaycationBookings = record.bookedUnits.length > 0;
    const allStaycationBooked = record.bookedUnits.length >= STAYCATION_UNITS.length;

    // Rule 1: If Whole Resort is booked -> neither Whole Resort nor Staycation is available
    // Rule 2: If 1+ Staycation unit is booked -> Whole Resort is NOT available; remaining Staycation units ARE available (on weekends)
    // Rule 3: Staycation is ONLY allowed on Weekends (Fri, Sat, Sun)
    const canBookWholeResort = !record.wholeResortBooked && !hasStaycationBookings;
    const canBookStaycation = weekend && !record.wholeResortBooked && !allStaycationBooked;

    // Promo eligibility: Mon-Thu, on or before 2026-11-30, and Whole Resort is open
    const isPromoWindow = dateStr <= '2026-11-30' && !weekend;
    const canBookWeekdayPromo = canBookWholeResort && isPromoWindow;

    return {
      dateStr,
      weekend,
      wholeResortBooked: record.wholeResortBooked,
      bookedUnits: record.bookedUnits,
      availableUnits: STAYCATION_UNITS.filter((u) => !record.bookedUnits.includes(u.id)),
      canBookWholeResort,
      canBookStaycation,
      canBookWeekdayPromo,
      note: record.note || null
    };
  };

  const currentAvailability = useMemo(
    () => getDateAvailability(selectedDate),
    [selectedDate, bookingsDB]
  );

  // Keep selected staycation units valid when date changes
  useEffect(() => {
    if (bookingMode === 'staycation') {
      const availableIds = currentAvailability.availableUnits.map((u) => u.id);
      setSelectedStaycationUnits((prev) => {
        const filtered = prev.filter((id) => availableIds.includes(id));
        if (filtered.length === 0 && availableIds.length > 0) {
          return [availableIds[0]];
        }
        return filtered;
      });
    }
  }, [selectedDate, bookingMode, bookingsDB]);

  // Auto-adjust package if weekday_promo is selected on a weekend
  const selectedPackage = useMemo(() => {
    return WHOLE_RESORT_PACKAGES.find((p) => p.id === selectedPackageId) || WHOLE_RESORT_PACKAGES[1];
  }, [selectedPackageId]);

  // Dynamic Price Calculation
  const pricingSummary = useMemo(() => {
    const avail = currentAvailability;

    if (bookingMode === 'whole_resort') {
      if (!avail.canBookWholeResort) {
        return {
          valid: false,
          reason: avail.wholeResortBooked
            ? 'The Whole Resort is already reserved on this date.'
            : `Cannot book Whole Resort because ${avail.bookedUnits.length} Staycation Unit(s) are already booked on this date.`,
          total: 0,
          downpayment: 0,
          balance: 0,
          title: selectedPackage.name
        };
      }

      if (selectedPackage.weekdayOnly && avail.weekend) {
        return {
          valid: false,
          reason: 'The ₱3,999 Weekday Promo is only valid on Mondays to Thursdays (until Nov 30, 2026). Please pick a weekday or select a regular Tour Package.',
          total: 0,
          downpayment: 0,
          balance: 0,
          title: selectedPackage.name
        };
      }

      if (selectedPackage.id === 'weekday_promo' && selectedDate > '2026-11-30') {
        return {
          valid: false,
          reason: 'The ₱3,999 Weekday Promo is valid until November 30, 2026.',
          total: 0,
          downpayment: 0,
          balance: 0,
          title: selectedPackage.name
        };
      }

      const basePrice = avail.weekend
        ? selectedPackage.weekendPrice
        : selectedPackage.weekdayPrice;

      return {
        valid: true,
        reason: null,
        total: basePrice,
        downpayment: Math.round(basePrice * 0.5),
        balance: basePrice - Math.round(basePrice * 0.5),
        title: `Whole Resort — ${selectedPackage.name}`,
        subtitle: `${selectedPackage.time} • ${selectedPackage.roomIncluded}`,
        rateType: avail.weekend ? 'Weekend Rate (Fri–Sun)' : 'Weekday Rate (Mon–Thu)',
        maxCapacity: selectedPackage.maxGuests
      };
    } else {
      // Staycation mode
      if (!avail.weekend) {
        return {
          valid: false,
          reason: 'Staycation Unit bookings are strictly available on Weekends only (Friday, Saturday, Sunday). For weekdays, please switch to Whole Resort Booking.',
          total: 0,
          downpayment: 0,
          balance: 0,
          title: 'Staycation Units'
        };
      }

      if (avail.wholeResortBooked) {
        return {
          valid: false,
          reason: 'All Staycation Units are unavailable because the Whole Resort is exclusively booked on this date.',
          total: 0,
          downpayment: 0,
          balance: 0,
          title: 'Staycation Units'
        };
      }

      if (selectedStaycationUnits.length === 0) {
        return {
          valid: false,
          reason: 'Please select at least one available Staycation Unit.',
          total: 0,
          downpayment: 0,
          balance: 0,
          title: 'Staycation Units'
        };
      }

      const chosenUnits = STAYCATION_UNITS.filter((u) =>
        selectedStaycationUnits.includes(u.id)
      );
      const total = chosenUnits.reduce((sum, u) => sum + u.pricePerNight, 0);
      const totalCapacity = chosenUnits.reduce((sum, u) => sum + u.capacity, 0);

      return {
        valid: true,
        reason: null,
        total,
        downpayment: Math.round(total * 0.5),
        balance: total - Math.round(total * 0.5),
        title: `Staycation (${chosenUnits.map((u) => u.name.replace('Unit 1: ', '').replace('Unit 2: ', '').replace('Unit 3: ', '')).join(' + ')})`,
        subtitle: 'Check-in 2:00 PM – Check-out 12:00 NN • Shared Pool & Resort Facilities',
        rateType: `${chosenUnits.length} Unit(s) Selected • Weekend Staycation`,
        maxCapacity: totalCapacity
      };
    }
  }, [bookingMode, selectedPackage, selectedStaycationUnits, currentAvailability, selectedDate]);

  // Quick Handler: "Book This Promo" button
  const handleBookPromoClick = () => {
    setBookingMode('whole_resort');
    setSelectedPackageId('weekday_promo');
    // Find an available weekday in Oct/Nov 2026 if current selectedDate is a weekend or booked
    const candidateDates = ['2026-10-27', '2026-10-28', '2026-10-29', '2026-11-03', '2026-11-05', '2026-11-10'];
    const openWeekday = candidateDates.find((d) => getDateAvailability(d).canBookWeekdayPromo);
    if (openWeekday) {
      setSelectedDate(openWeekday);
      const dt = parseDateKey(openWeekday);
      setCurrentMonth({ year: dt.getFullYear(), month: dt.getMonth() });
    }
    scrollToRef(bookingSectionRef);
  };

  // Toggle Staycation Unit selection
  const toggleStaycationUnit = (unitId) => {
    if (currentAvailability.bookedUnits.includes(unitId)) return;
    setSelectedStaycationUnits((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
  };

  // Find next available weekend helper
  const jumpToNextAvailableWeekend = () => {
    const weekendCandidates = [
      '2026-10-30',
      '2026-11-01',
      '2026-11-06',
      '2026-11-07',
      '2026-11-08',
      '2026-11-13',
      '2026-11-14',
      '2026-11-15'
    ];
    const nextOpen = weekendCandidates.find((d) => getDateAvailability(d).canBookStaycation);
    if (nextOpen) {
      setSelectedDate(nextOpen);
      const dt = parseDateKey(nextOpen);
      setCurrentMonth({ year: dt.getFullYear(), month: dt.getMonth() });
    }
  };

  // Core Function to commit a booking into state (used by both the UI form and the AI Agent!)
  const executeBookingSubmission = ({
    dateStr,
    mode,
    packageId,
    unitIds,
    name,
    email,
    phone,
    guests,
    payMethod,
    payRef,
    notes,
    bookedVia = 'Website Direct'
  }) => {
    const avail = getDateAvailability(dateStr);

    if (mode === 'whole_resort') {
      if (!avail.canBookWholeResort) {
        return { ok: false, error: 'Whole Resort is not available on this date due to an existing reservation.' };
      }
      const pkg = WHOLE_RESORT_PACKAGES.find((p) => p.id === packageId) || WHOLE_RESORT_PACKAGES[1];
      if (pkg.weekdayOnly && avail.weekend) {
        return { ok: false, error: 'The Weekday Promo is only valid Monday to Thursday.' };
      }
      const total = avail.weekend ? pkg.weekendPrice : pkg.weekdayPrice;
      const downpayment = Math.round(total * 0.5);
      const balance = total - downpayment;
      const bookingCode = 'TF-' + Math.floor(100000 + Math.random() * 900000);

      setBookingsDB((prev) => ({
        ...prev,
        [dateStr]: {
          wholeResortBooked: true,
          packageId: pkg.id,
          bookedUnits: [],
          note: `Reserved: Whole Resort (${pkg.name}) by ${name}`
        }
      }));

      const confirmationObj = {
        bookingCode,
        timestamp: new Date().toLocaleString('en-PH'),
        dateStr,
        displayDate: formatDisplayDate(dateStr),
        mode: 'Whole Resort Booking',
        selectionSummary: `${pkg.name} (${pkg.time})`,
        roomInclusion: pkg.roomIncluded,
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        guestCount: guests,
        paymentMethod: payMethod || 'GCash',
        paymentRefNumber: payRef || 'PENDING-VERIFICATION',
        totalAmount: total,
        downpaymentAmount: downpayment,
        balanceAmount: balance,
        specialRequests: notes || 'None',
        bookedVia
      };

      setRecentConfirmations((prev) => [confirmationObj, ...prev]);
      setActiveConfirmation(confirmationObj);
      return { ok: true, confirmation: confirmationObj };
    } else {
      // Staycation mode
      if (!avail.weekend) {
        return { ok: false, error: 'Staycation units can only be booked on weekends (Fri, Sat, Sun).' };
      }
      if (avail.wholeResortBooked) {
        return { ok: false, error: 'Whole Resort is already booked on that date.' };
      }
      const validUnits = (unitIds || []).filter((id) => !avail.bookedUnits.includes(id));
      if (validUnits.length === 0) {
        return { ok: false, error: 'Selected staycation unit(s) are already booked on that date.' };
      }
      const unitObjects = STAYCATION_UNITS.filter((u) => validUnits.includes(u.id));
      const total = unitObjects.reduce((s, u) => s + u.pricePerNight, 0);
      const downpayment = Math.round(total * 0.5);
      const balance = total - downpayment;
      const bookingCode = 'TF-' + Math.floor(100000 + Math.random() * 900000);

      const updatedUnits = Array.from(new Set([...avail.bookedUnits, ...validUnits]));

      setBookingsDB((prev) => ({
        ...prev,
        [dateStr]: {
          wholeResortBooked: false,
          packageId: null,
          bookedUnits: updatedUnits,
          note: `${updatedUnits.length}/3 Staycation Units Booked — Whole Resort Unavailable`
        }
      }));

      const confirmationObj = {
        bookingCode,
        timestamp: new Date().toLocaleString('en-PH'),
        dateStr,
        displayDate: formatDisplayDate(dateStr),
        mode: 'Weekend Staycation Booking',
        selectionSummary: unitObjects.map((u) => u.name).join(', '),
        roomInclusion: 'Check-in 2:00 PM – Check-out 12:00 NN',
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        guestCount: guests,
        paymentMethod: payMethod || 'GCash',
        paymentRefNumber: payRef || 'PENDING-VERIFICATION',
        totalAmount: total,
        downpaymentAmount: downpayment,
        balanceAmount: balance,
        specialRequests: notes || 'None',
        bookedVia
      };

      setRecentConfirmations((prev) => [confirmationObj, ...prev]);
      setActiveConfirmation(confirmationObj);
      return { ok: true, confirmation: confirmationObj };
    }
  };

  // Handle Manual Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!pricingSummary.valid) {
      setFormError(pricingSummary.reason || 'Please select a valid available date and package.');
      return;
    }
    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setFormError('Please fill in your Full Name, Email Address, and Contact Number.');
      return;
    }
    if (!agreedToPolicy) {
      setFormError('You must read and check the required Booking Policy agreement before proceeding to payment.');
      return;
    }

    const res = executeBookingSubmission({
      dateStr: selectedDate,
      mode: bookingMode,
      packageId: selectedPackageId,
      unitIds: selectedStaycationUnits,
      name: guestName.trim(),
      email: guestEmail.trim(),
      phone: guestPhone.trim(),
      guests: guestCount,
      payMethod: paymentMethod,
      payRef: paymentRefNumber.trim() || 'GCASH-50DP-VERIFIED',
      notes: specialRequests.trim(),
      bookedVia: 'Website Booking Engine'
    });

    if (!res.ok) {
      setFormError(res.error);
    } else {
      // Reset fields slightly while showing modal
      setSpecialRequests('');
      setPaymentRefNumber('');
    }
  };

  // ==========================================
  // CALENDAR GENERATION
  // ==========================================
  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateKey(year, month, d);
      days.push({
        dayNumber: d,
        dateStr,
        avail: getDateAvailability(dateStr)
      });
    }
    return days;
  }, [currentMonth, bookingsDB]);

  const monthLabel = new Date(currentMonth.year, currentMonth.month, 1).toLocaleDateString(
    'en-US',
    { month: 'long', year: 'numeric' }
  );

  // ==========================================
  // AI CONCIERGE & BOOKING AGENT (GEMINI API)
  // ==========================================
  const callGeminiConcierge = async (userMessage) => {
    const apiKey = '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    // Build live snapshot of calendar availability for Oct/Nov 2026 so the AI has 100% accurate live data
    const liveBookingsSnapshot = Object.entries(bookingsDB).map(([date, info]) => ({
      date,
      isWeekend: isWeekendDate(date),
      wholeResortBooked: info.wholeResortBooked,
      bookedStaycationUnits: info.bookedUnits,
      note: info.note
    }));

    const systemInstruction = `You are "The Forts AI Concierge", the official AI booking agent and customer support assistant for "The Forts Riverside Private Resort" (theforts.ph), located near the scenic Angat River and Beltran Street.
Current Date Context: October 2026.

YOUR CAPABILITIES:
1. Answer any inquiries about The Forts Riverside Private Resort, amenities, rooms, directions, house rules, and the exact Cancellation, Refund & Rescheduling Policy.
2. Check real-time availability for any date using the LIVE BOOKINGS DATABASE below.
3. Submit a booking form on your own when the user asks you to book/reserve for them!

RESORT RULES & PRICING:
- Mode A: Whole Resort Booking (Available ANY DAY unless Whole Resort or at least 1 Staycation Unit is already booked on that date).
  Packages:
  1. weekday_promo: "Weekday Promo Day Tour" (₱3,999, Mon–Thu only, Valid until Nov 30, 2026, 8:00 AM–5:00 PM, No Room Included, up to 25 pax).
  2. day_tour: "Riverside Day Tour" (8:00 AM–5:00 PM, ₱8,500 Weekday / ₱10,500 Weekend, includes Complimentary Overlooking Room, up to 30 pax).
  3. night_tour: "Riverside Night Tour" (7:00 PM–6:00 AM, ₱9,500 Weekday / ₱11,500 Weekend, includes Complimentary Overlooking Room, up to 30 pax).
  4. overnight_tour: "Overnight Tour 22 hrs" (2:00 PM–12:00 NN, ₱16,500 Weekday / ₱19,500 Weekend, includes Complimentary Overlooking Room + Full Resort, up to 40 pax).

- Mode B: Staycation Units (STRICTLY WEEKENDS ONLY: Friday, Saturday, Sunday. NO weekday bookings for Staycation).
  - If someone books even 1 Staycation Unit on a date, Whole Resort is automatically blocked on that date.
  - If Whole Resort is booked on a date, all 3 Staycation Units are blocked on that date.
  - Units:
    1. family_room: Unit 1 Family Room (₱3,500/night, up to 6 pax)
    2. barkada_room: Unit 2 Barkada Room (₱4,500/night, up to 10 pax)
    3. cozy_room: Unit 3 Cozy Room (₱2,500/night, up to 4 pax)

CANCELLATION, REFUND & RESCHEDULING POLICY (Client Requirement):
- Reservation & Payment: A 50% down payment is required to secure your booking. The remaining balance is due upon arrival unless otherwise agreed. Bookings are confirmed only after payment verification.
- Cancellation & No-Show: Guest-initiated cancellations are generally non-refundable. No-shows will result in forfeiture of the deposit.
- Rescheduling: One (1) reschedule may be requested at least 7 days before the booking date, subject to availability and management approval. Rate differences may apply.
- Cancellation by Management: Full refund or agreed replacement date.

LIVE BOOKINGS DATABASE (Dates not listed here are completely OPEN!):
${JSON.stringify(liveBookingsSnapshot, null, 2)}

Currently Selected on User's Screen:
- Date: ${selectedDate} (${isWeekendDate(selectedDate) ? 'Weekend' : 'Weekday'})
- Mode: ${bookingMode}

RESPONSE JSON SCHEMA REQUIREMENT:
Always respond in valid JSON with this structure:
{
  "reply": "Your friendly, helpful markdown response to the guest.",
  "uiAction": {
    "type": "NONE" | "CHECK_DATE" | "SUBMIT_BOOKING",
    "dateStr": "YYYY-MM-DD (optional, if switching calendar date or booking)",
    "mode": "whole_resort" | "staycation" (optional),
    "packageId": "weekday_promo" | "day_tour" | "night_tour" | "overnight_tour" (optional),
    "unitIds": ["family_room", "barkada_room", "cozy_room"] (optional array of units to book),
    "guestName": "string (if submitting booking)",
    "guestEmail": "string (if submitting booking)",
    "guestPhone": "string (if submitting booking)",
    "guestCount": 10,
    "paymentMethod": "GCash"
  }
}

IMPORTANT:
- If the user asks you to book or submit a reservation for them and provides (or says to use default/sample details or gives their name & date), set "uiAction.type" to "SUBMIT_BOOKING" and populate the fields (fill in sensible defaults like "guest@theforts.ph" or "0917-555-0199" if they only gave their name and date so the booking succeeds smoothly!).
- If the user asks to check availability on a specific date, set "uiAction.type" to "CHECK_DATE" with "dateStr" so the calendar highlights it for them.`;

    const payload = {
      contents: [
        ...chatMessages.slice(-6).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            reply: { type: 'STRING' },
            uiAction: {
              type: 'OBJECT',
              properties: {
                type: { type: 'STRING' },
                dateStr: { type: 'STRING' },
                mode: { type: 'STRING' },
                packageId: { type: 'STRING' },
                unitIds: { type: 'ARRAY', items: { type: 'STRING' } },
                guestName: { type: 'STRING' },
                guestEmail: { type: 'STRING' },
                guestPhone: { type: 'STRING' },
                guestCount: { type: 'NUMBER' },
                paymentMethod: { type: 'STRING' }
              }
            }
          },
          required: ['reply']
        }
      }
    };

    const delays = [1000, 2000, 4000];
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return JSON.parse(rawText);
        }
      } catch (err) {
        if (attempt === delays.length) {
          return {
            reply:
              'I checked our live system! Remember: Whole Resort bookings are available any day (unless a Staycation unit is booked), while our 3 Staycation Units are available on Weekends (Fri–Sun). You can also grab our ₱3,999 Weekday Promo until Nov 30, 2026!',
            uiAction: { type: 'NONE' }
          };
        }
        await new Promise((r) => setTimeout(r, delays[attempt]));
      }
    }
  };

  const handleSendChat = async (customPrompt) => {
    const textToSend = (customPrompt ?? chatInput).trim();
    if (!textToSend || isAiTyping) return;

    if (!customPrompt) setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    setIsAiTyping(true);

    const aiResult = await callGeminiConcierge(textToSend);
    setIsAiTyping(false);

    let finalReply = aiResult?.reply || 'How else can I assist with your booking at The Forts?';
    const action = aiResult?.uiAction;

    if (action && action.type === 'CHECK_DATE' && action.dateStr) {
      setSelectedDate(action.dateStr);
      const dt = parseDateKey(action.dateStr);
      if (!isNaN(dt)) {
        setCurrentMonth({ year: dt.getFullYear(), month: dt.getMonth() });
      }
      if (action.mode === 'whole_resort' || action.mode === 'staycation') {
        setBookingMode(action.mode);
      }
    } else if (action && action.type === 'SUBMIT_BOOKING') {
      const targetDate = action.dateStr || selectedDate;
      const targetMode = action.mode || bookingMode;
      const targetPkg = action.packageId || selectedPackageId;
      const targetUnits =
        action.unitIds && action.unitIds.length > 0 ? action.unitIds : selectedStaycationUnits;

      setSelectedDate(targetDate);
      setBookingMode(targetMode);
      setAgreedToPolicy(true);

      const bookingResult = executeBookingSubmission({
        dateStr: targetDate,
        mode: targetMode,
        packageId: targetPkg,
        unitIds: targetUnits,
        name: action.guestName || guestName || 'Valued Forts Guest',
        email: action.guestEmail || guestEmail || 'guest@theforts.ph',
        phone: action.guestPhone || guestPhone || '0917-888-3999',
        guests: action.guestCount || guestCount || 12,
        payMethod: action.paymentMethod || 'GCash',
        payRef: 'AI-AGENT-BOOKING',
        notes: 'Booked via The Forts AI Concierge (Policy Acknowledged)',
        bookedVia: 'The Forts AI Concierge Agent'
      });

      if (bookingResult.ok) {
        finalReply += `\n\n✅ **Booking Submitted Successfully!**\n• **Reference Code:** \`${bookingResult.confirmation.bookingCode}\`\n• **Date:** ${bookingResult.confirmation.displayDate}\n• **Package/Units:** ${bookingResult.confirmation.selectionSummary}\n• **Total:** ${formatPHP(bookingResult.confirmation.totalAmount)} (50% Downpayment: **${formatPHP(bookingResult.confirmation.downpaymentAmount)}**)\n\nI have also opened your official **Payment & Confirmation Email Preview** on screen!`;
      } else {
        finalReply += `\n\n⚠️ **Booking Conflict Detected:** ${bookingResult.error}`;
      }
    }

    setChatMessages((prev) => [...prev, { role: 'assistant', text: finalReply }]);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-slate-800 font-sans selection:bg-teal-800 selection:text-white">
      {/* ==========================================
          TOP PROMO ANNOUNCEMENT BAR
      ========================================== */}
      <div className="bg-gradient-to-r from-[#133A36] via-[#1B4D47] to-[#133A36] text-amber-100 text-xs sm:text-sm py-2.5 px-4 border-b border-teal-800/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wider">
              Weekday Promo
            </span>
            <span className="font-medium text-white">
              <strong>₱3,999 Weekday Day Tour</strong> • Valid Until Nov 30, 2026 • No Room Included
            </span>
          </div>
          <button
            onClick={handleBookPromoClick}
            className="text-amber-300 hover:text-white font-semibold underline underline-offset-4 flex items-center gap-1 transition cursor-pointer"
          >
            Book This Promo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ==========================================
          STICKY NAVIGATION BAR
      ========================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#18453B] flex items-center justify-center text-amber-200 shadow-md group-hover:bg-[#1f574b] transition">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#143630] block leading-none">
                The Forts
              </span>
              <span className="text-[11px] uppercase tracking-widest text-stone-500 font-medium">
                Riverside Private Resort
              </span>
            </div>
          </div>

          {/* Airbnb-style Center Quick Filter Pill */}
          <div
            onClick={() => scrollToRef(bookingSectionRef)}
            className="hidden xl:flex items-center bg-stone-100 hover:bg-stone-200/70 border border-stone-300/80 rounded-full px-4 py-2 text-xs font-medium text-stone-700 shadow-2xs cursor-pointer transition gap-3"
          >
            <span className="font-semibold text-[#18453B]">
              {bookingMode === 'whole_resort' ? 'Whole Resort (Any Day)' : 'Staycation (Weekends)'}
            </span>
            <span className="text-stone-300">|</span>
            <span>{formatDisplayDate(selectedDate)}</span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-600">{guestCount} Guests</span>
            <div className="w-7 h-7 rounded-full bg-[#18453B] text-white flex items-center justify-center">
              <CalendarIcon className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-stone-600">
            <button onClick={() => scrollToRef(promoSectionRef)} className="hover:text-[#18453B] transition cursor-pointer">
              Promo
            </button>
            <button onClick={() => scrollToRef(bookingSectionRef)} className="hover:text-[#18453B] transition cursor-pointer">
              Book & Availability
            </button>
            <button onClick={() => scrollToRef(packagesSectionRef)} className="hover:text-[#18453B] transition cursor-pointer">
              Tour Packages
            </button>
            <button onClick={() => scrollToRef(roomsSectionRef)} className="hover:text-[#18453B] transition cursor-pointer">
              Rooms & Amenities
            </button>
            <button onClick={() => scrollToRef(rulesSectionRef)} className="hover:text-[#18453B] transition cursor-pointer">
              House Rules
            </button>
            <button onClick={() => scrollToRef(faqSectionRef)} className="hover:text-[#18453B] transition cursor-pointer">
              FAQs
            </button>
            <button onClick={() => scrollToRef(contactSectionRef)} className="hover:text-[#18453B] transition cursor-pointer">
              Location
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPolicyModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#18453B] px-3 py-2 rounded-xl border border-stone-300 hover:border-[#18453B] transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#18453B]" />
              Booking Policy
            </button>
            <button
              onClick={() => scrollToRef(bookingSectionRef)}
              className="bg-[#18453B] hover:bg-[#11332b] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
            >
              Book Now!
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          HERO SECTION & PHOTO MOSAIC (THE FORTS THEME)
      ========================================== */}
      <section className="relative overflow-hidden pt-6 pb-14 md:py-12 bg-gradient-to-b from-white to-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Title & Location Header (Airbnb Listing Style + The Forts Vibe) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/10 text-[#18453B] text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Private Riverside Sanctuary • Angat River
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#143630] tracking-tight">
                The Forts Riverside Private Resort
              </h1>
              <p className="text-base sm:text-lg text-stone-600 mt-2 max-w-2xl">
                A riverside haven designed for relaxation, fun, and unforgettable memories.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-stone-600">
              <span className="flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                ★ 4.95 · Exclusive Private Resort & Weekend Staycation
              </span>
              <button
                onClick={() => scrollToRef(contactSectionRef)}
                className="flex items-center gap-1 underline hover:text-[#18453B] cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#18453B]" /> Near Angat River & Beltran St.
              </button>
            </div>
          </div>

          {/* Airbnb-Inspired 5-Photo Bento Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden shadow-lg border border-stone-200/80 h-[360px] sm:h-[440px]">
            {/* Main Pool & Shade Sail Visual */}
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85"
                alt="The Forts Swimming Pool with Shade Canopy"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent flex flex-col justify-end p-6">
                <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                  Exclusive Pool & Canopy
                </span>
                <h2 className="text-white text-xl sm:text-2xl font-serif font-bold mt-1">
                  Refreshing Adult & Kiddie Pools
                </h2>
                <p className="text-stone-200 text-xs sm:text-sm mt-1 max-w-md">
                  Blue mosaic tiles, overhead sun-shade sail, and ambient festoon string lights for serene night swimming.
                </p>
              </div>
            </div>

            {/* Golden Sunset Over Angat River */}
            <div className="relative group overflow-hidden bg-stone-900 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80"
                alt="Riverside Balcony Sunset View"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold">
                  Scenic Angat River Sunset Balcony
                </span>
              </div>
            </div>

            {/* Cozy Sunlit Bunk & Family Rooms */}
            <div className="relative group overflow-hidden bg-stone-900 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=700&q=80"
                alt="Cozy & Barkada Rooms"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold">
                  4 Restful Rooms (Overlooking + 3 Staycation Units)
                </span>
              </div>
            </div>

            {/* Function & Kitchen Area */}
            <div className="relative group overflow-hidden bg-stone-900 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80"
                alt="Function & Kitchen Space"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold">
                  Spacious Function Hall & Zero-Corkage Kitchen
                </span>
              </div>
            </div>

            {/* Recreational Court & Garden */}
            <div className="relative group overflow-hidden bg-stone-900 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=700&q=80"
                alt="Recreational Court"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-4">
                <span className="text-white text-xs font-semibold">
                  Badminton Court & Garden Patio
                </span>
                <button
                  onClick={() => scrollToRef(roomsSectionRef)}
                  className="bg-white/90 hover:bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
                >
                  Explore Spaces
                </button>
              </div>
            </div>
          </div>

          {/* Welcome Story Card from The Forts PDF */}
          <div className="mt-10 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#143630]">
                Welcome to The Forts Riverside Private Resort!
              </h2>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                Escape to a relaxing riverside retreat where comfort meets nature. At{' '}
                <strong>The Forts Riverside Private Resort</strong>, we offer a peaceful getaway
                perfect for families, friends, and special gatherings — far from the noise of the
                city.
              </p>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                Surrounded by a calm and refreshing atmosphere, our resort is designed to give you
                privacy, comfort, and memorable experiences. Enjoy exclusive access to our cozy
                accommodations and inviting amenities, making every stay feel special and
                stress-free. Whether you're planning a quiet escape, a fun-filled barkada outing, or
                a meaningful celebration, The Forts Riverside Private Resort is your perfect
                destination to unwind, bond, and create lasting memories.
              </p>
            </div>
            <div className="lg:col-span-4 bg-[#F3F1EC] rounded-2xl p-5 border border-stone-200/80 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#18453B]">
                Two Ways to Book at The Forts
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                  <span>1. Whole Resort Booking</span>
                  <span className="text-[11px] bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full">
                    Any Day
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  100% exclusive access to pools, facilities & Overlooking Room. Choose Day Tour, Night Tour, 22-hr Overnight, or the ₱3,999 Weekday Promo.
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                  <span>2. Staycation Units (3 Units)</span>
                  <span className="text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    Weekends Only
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Book our Family, Barkada, or Cozy Room on weekends (Fri–Sun). Note: When a Staycation Unit is booked, Whole Resort is locked for that date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          DEDICATED SPACE FOR ON-GOING PROMO
      ========================================== */}
      <section ref={promoSectionRef} className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#12352F] via-[#1B4D44] to-[#215E53] text-white p-6 sm:p-10 shadow-xl border border-teal-700/40">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> On-Going Limited Promo
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight">
                Weekday Promo: <span className="text-amber-300">₱3,999 Weekday Day Tour</span>
              </h2>
              <p className="text-teal-100 text-sm sm:text-base max-w-2xl">
                Treat your family or barkada to an exclusive riverside daytime retreat (8:00 AM – 5:00 PM) Mondays through Thursdays! Enjoy full access to our swimming pools, scenic riverside balcony, function area, and outdoor court.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-300" /> Valid Until November 30, 2026
                </span>
                <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-300" /> No Room Included
                </span>
                <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> Subject to Availability (Mon–Thu)
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between bg-black/25 backdrop-blur-xs p-5 rounded-2xl border border-white/15 gap-4">
              <div className="text-left lg:text-right">
                <span className="text-xs uppercase tracking-widest text-teal-200 block">
                  All-In Weekday Day Rate
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 mt-0.5">
                  ₱3,999
                </div>
                <span className="text-xs text-teal-100">
                  Only ₱2,000 (50% Downpayment) to Reserve
                </span>
              </div>
              <button
                onClick={handleBookPromoClick}
                className="w-full lg:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                Book This Promo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          AIRBNB-STYLE INTERACTIVE BOOKING SYSTEM
      ========================================== */}
      <section ref={bookingSectionRef} className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#18453B]">
            Real-Time Availability & Instant Quote
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#143630] mt-1">
            Reserve Your Stay at The Forts
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-1">
            Select your booking type, pick your date on the interactive calendar, and see real-time pricing & availability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (7 Cols): Mode Switcher, Interactive Calendar, Package/Unit Selector */}
          <div className="lg:col-span-7 space-y-8">
            {/* STEP 1: Choose Booking Mode (Whole Resort vs Staycation) */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#18453B] text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  How would you like to book The Forts?
                </h3>
                <span className="text-xs text-stone-500">Mutual-Exclusivity Protected</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Whole Resort Option */}
                <button
                  type="button"
                  onClick={() => setBookingMode('whole_resort')}
                  className={`text-left p-5 rounded-2xl border-2 transition cursor-pointer relative ${
                    bookingMode === 'whole_resort'
                      ? 'border-[#18453B] bg-[#18453B]/5 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-900/10 text-[#18453B]">
                      Available Any Day
                    </span>
                    {bookingMode === 'whole_resort' && (
                      <CheckCircle2 className="w-5 h-5 text-[#18453B]" />
                    )}
                  </div>
                  <div className="font-serif font-bold text-lg text-slate-900 mt-3">
                    Whole Resort Booking
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    100% private access to the entire resort. Choose from Day Tour, Night Tour, 22-hr Overnight, or the ₱3,999 Weekday Promo.
                  </p>
                </button>

                {/* Staycation Units Option */}
                <button
                  type="button"
                  onClick={() => setBookingMode('staycation')}
                  className={`text-left p-5 rounded-2xl border-2 transition cursor-pointer relative ${
                    bookingMode === 'staycation'
                      ? 'border-[#18453B] bg-[#18453B]/5 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      Weekends Only (Fri–Sun)
                    </span>
                    {bookingMode === 'staycation' && (
                      <CheckCircle2 className="w-5 h-5 text-[#18453B]" />
                    )}
                  </div>
                  <div className="font-serif font-bold text-lg text-slate-900 mt-3">
                    Staycation Room Units (1–3)
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Rent 1, 2, or all 3 private air-conditioned rooms (Family, Barkada, Cozy) with shared access to the pool & riverside areas.
                  </p>
                </button>
              </div>
            </div>

            {/* STEP 2: Interactive Availability Calendar */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#18453B] text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Select Your Check-In Date
                </h3>

                {/* Month Navigation */}
                <div className="flex items-center gap-2 bg-stone-100 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth((prev) =>
                        prev.month === 0
                          ? { year: prev.year - 1, month: 11 }
                          : { year: prev.year, month: prev.month - 1 }
                      )
                    }
                    className="p-1.5 rounded-lg hover:bg-white text-stone-700 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-slate-800 px-3 min-w-[140px] text-center">
                    {monthLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth((prev) =>
                        prev.month === 11
                          ? { year: prev.year + 1, month: 0 }
                          : { year: prev.year, month: prev.month + 1 }
                      )
                    }
                    className="p-1.5 rounded-lg hover:bg-white text-stone-700 transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-600 mb-4 pb-3 border-b border-stone-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-400 inline-block"></span>
                  Fully Open
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-400 inline-block"></span>
                  Partial Staycation Booked (Whole Resort Locked)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-rose-100 border border-rose-300 inline-block"></span>
                  Whole Resort Reserved
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-teal-900 text-white inline-block"></span>
                  Selected Date
                </span>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-stone-500 mb-2">
                <div className="text-amber-700">Sun (Wknd)</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div className="text-amber-700">Fri (Wknd)</div>
                <div className="text-amber-700">Sat (Wknd)</div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map((cell, idx) => {
                  if (!cell) {
                    return <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-xl bg-stone-50/50" />;
                  }
                  const { dayNumber, dateStr, avail } = cell;
                  const isSelected = selectedDate === dateStr;
                  const hasPartialStaycation = avail.bookedUnits.length > 0 && !avail.wholeResortBooked;

                  let cellStyle = 'bg-white border-stone-200 hover:border-[#18453B] text-slate-800';
                  let statusLabel = avail.weekend ? 'Wknd Open' : 'Open';

                  if (avail.wholeResortBooked) {
                    cellStyle = 'bg-rose-50/80 border-rose-200 text-rose-900 opacity-80';
                    statusLabel = 'Resort Booked';
                  } else if (hasPartialStaycation) {
                    cellStyle = 'bg-amber-50 border-amber-300 text-amber-950';
                    statusLabel = `${3 - avail.bookedUnits.length} Unit(s) Left`;
                  } else if (avail.canBookWeekdayPromo) {
                    statusLabel = '₱3,999 Promo';
                  }

                  if (isSelected) {
                    cellStyle = 'bg-[#18453B] border-[#18453B] text-white shadow-md scale-[1.02]';
                  }

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-16 sm:h-20 p-1.5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${cellStyle}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs sm:text-sm font-bold">{dayNumber}</span>
                        {avail.weekend && !isSelected && (
                          <span className="text-[9px] px-1 rounded bg-stone-100 text-stone-600 font-semibold">
                            WKND
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[10px] leading-tight font-medium truncate ${
                          isSelected
                            ? 'text-amber-200'
                            : avail.wholeResortBooked
                            ? 'text-rose-700'
                            : hasPartialStaycation
                            ? 'text-amber-800 font-semibold'
                            : 'text-emerald-700'
                        }`}
                      >
                        {statusLabel}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Contextual Date Status Banner */}
              <div className="mt-4 p-4 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-slate-900">
                    Selected: {formatDisplayDate(selectedDate)}
                  </span>{' '}
                  <span className="text-stone-500">
                    ({currentAvailability.weekend ? 'Weekend — Staycation & Whole Resort Eligible' : 'Weekday — Whole Resort Only'})
                  </span>
                  {currentAvailability.note && (
                    <div className="text-xs text-amber-800 font-medium mt-0.5 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 shrink-0" /> {currentAvailability.note}
                    </div>
                  )}
                </div>

                {/* Quick helper if user is in Staycation mode on a Weekday */}
                {bookingMode === 'staycation' && !currentAvailability.weekend && (
                  <button
                    type="button"
                    onClick={jumpToNextAvailableWeekend}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl shadow-2xs transition cursor-pointer shrink-0"
                  >
                    Jump to Next Weekend →
                  </button>
                )}
              </div>
            </div>

            {/* STEP 3: Conditional Selector (Whole Resort Tour Packages OR 3 Staycation Units) */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#18453B] text-white text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  {bookingMode === 'whole_resort'
                    ? 'Select Your Riverside Tour Package'
                    : 'Select Your Weekend Staycation Unit(s)'}
                </h3>
              </div>

              {/* Mutual Exclusivity Alert if Whole Resort is blocked by a Staycation unit */}
              {bookingMode === 'whole_resort' &&
                !currentAvailability.canBookWholeResort &&
                currentAvailability.bookedUnits.length > 0 && (
                  <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm space-y-2">
                      <div className="font-bold">
                        Whole Resort Unavailable on {formatDisplayDate(selectedDate)}
                      </div>
                      <p>
                        Because <strong>{currentAvailability.bookedUnits.length} of our 3 Staycation Units</strong> is already booked on this weekend date, the Whole Resort cannot be rented exclusively. However, you can still book the remaining{' '}
                        <strong>{currentAvailability.availableUnits.length} Staycation Unit(s)</strong>!
                      </p>
                      <button
                        type="button"
                        onClick={() => setBookingMode('staycation')}
                        className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
                      >
                        Switch to Available Staycation Units ({currentAvailability.availableUnits.length} Left)
                      </button>
                    </div>
                  </div>
                )}

              {bookingMode === 'whole_resort' ? (
                <div className="space-y-4">
                  {WHOLE_RESORT_PACKAGES.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    const isWeekendConflict = pkg.weekdayOnly && currentAvailability.weekend;
                    const currentRate = currentAvailability.weekend
                      ? pkg.weekendPrice
                      : pkg.weekdayPrice;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-5 rounded-2xl border-2 transition cursor-pointer ${
                          isSelected
                            ? 'border-[#18453B] bg-[#18453B]/5 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                  pkg.id === 'weekday_promo'
                                    ? 'bg-amber-400 text-slate-950'
                                    : 'bg-stone-200 text-stone-700'
                                }`}
                              >
                                {pkg.badge}
                              </span>
                              <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {pkg.time}
                              </span>
                            </div>
                            <h4 className="text-lg font-serif font-bold text-slate-900 mt-1.5">
                              {pkg.name}
                            </h4>
                          </div>

                          <div className="text-right">
                            {currentRate ? (
                              <>
                                <div className="text-xl font-extrabold text-[#18453B]">
                                  {formatPHP(currentRate)}
                                </div>
                                <span className="text-[11px] text-stone-500">
                                  {currentAvailability.weekend ? 'Weekend Rate' : 'Weekday Rate'}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg inline-block">
                                Mon–Thu Only (₱3,999)
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="mt-3 pt-3 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-[#18453B] flex items-center gap-1">
                            <BedDouble className="w-4 h-4" /> {pkg.roomIncluded}
                          </span>
                          <span className="text-stone-500">Up to {pkg.maxGuests} guests</span>
                        </div>

                        {isWeekendConflict && isSelected && (
                          <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                            <span>
                              This promo is valid Mondays–Thursdays only. Pick a weekday on the calendar!
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookPromoClick();
                              }}
                              className="font-bold underline ml-2 cursor-pointer"
                            >
                              Pick Open Weekday
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* STAYCATION 3 UNITS SELECTOR */
                <div className="space-y-4">
                  {!currentAvailability.weekend && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm flex items-center justify-between gap-3">
                      <div>
                        <strong>Weekday Selected ({formatDisplayDate(selectedDate)}):</strong> Staycation bookings are only allowed on Weekends (Friday, Saturday, Sunday).
                      </div>
                      <button
                        type="button"
                        onClick={jumpToNextAvailableWeekend}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl shrink-0 cursor-pointer"
                      >
                        Select Weekend Date
                      </button>
                    </div>
                  )}

                  {STAYCATION_UNITS.map((unit) => {
                    const isBooked =
                      currentAvailability.wholeResortBooked ||
                      currentAvailability.bookedUnits.includes(unit.id);
                    const isSelected = selectedStaycationUnits.includes(unit.id) && !isBooked;

                    return (
                      <div
                        key={unit.id}
                        onClick={() => !isBooked && toggleStaycationUnit(unit.id)}
                        className={`p-4 sm:p-5 rounded-2xl border-2 transition flex flex-col sm:flex-row gap-4 items-start sm:items-center ${
                          isBooked
                            ? 'border-stone-200 bg-stone-100 opacity-65 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#18453B] bg-[#18453B]/5 cursor-pointer shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white cursor-pointer'
                        }`}
                      >
                        <img
                          src={unit.image}
                          alt={unit.name}
                          className="w-full sm:w-28 h-28 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#18453B]">
                              {unit.beds} • Max {unit.capacity} Pax
                            </span>
                            {isBooked ? (
                              <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                                Already Reserved
                              </span>
                            ) : (
                              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                                Available
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-serif font-bold text-slate-900 mt-0.5">
                            {unit.name}
                          </h4>
                          <p className="text-xs text-stone-600 mt-1">{unit.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {unit.features.map((f) => (
                              <span
                                key={f}
                                className="text-[11px] bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md text-stone-700"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200 flex sm:flex-col items-center sm:items-end justify-between">
                          <div>
                            <div className="text-xl font-extrabold text-[#18453B]">
                              {formatPHP(unit.pricePerNight)}
                            </div>
                            <span className="text-[11px] text-stone-500">per night</span>
                          </div>
                          {!isBooked && (
                            <div
                              className={`mt-2 w-6 h-6 rounded-lg flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-[#18453B] border-[#18453B] text-white'
                                  : 'border-stone-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4" />}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (5 Cols): Sticky Airbnb-Style Price Card + Checkout Form + Policy Hyperlink */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xl">
              {/* Top Price & Status Header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-stone-200">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
                    {pricingSummary.rateType || 'Selected Rate'}
                  </span>
                  <div className="text-3xl font-extrabold text-[#143630] mt-0.5">
                    {pricingSummary.valid ? formatPHP(pricingSummary.total) : 'Unavailable'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> 50% Downpayment
                  </span>
                </div>
              </div>

              {/* Airbnb-Style Summary Box (Date, Mode, Guests) */}
              <div className="mt-4 rounded-2xl border border-stone-300 overflow-hidden text-xs">
                <div className="grid grid-cols-2 border-b border-stone-300 bg-stone-50/60">
                  <div className="p-3 border-r border-stone-300">
                    <span className="font-bold uppercase text-[10px] text-stone-500 block">
                      CHECK-IN DATE
                    </span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">
                      {formatDisplayDate(selectedDate)}
                    </span>
                  </div>
                  <div className="p-3">
                    <span className="font-bold uppercase text-[10px] text-stone-500 block">
                      BOOKING TYPE
                    </span>
                    <span className="font-semibold text-[#18453B] mt-0.5 block">
                      {bookingMode === 'whole_resort' ? 'Whole Resort' : 'Staycation Unit(s)'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white flex items-center justify-between">
                  <div>
                    <span className="font-bold uppercase text-[10px] text-stone-500 block">
                      NUMBER OF GUESTS (MAX {pricingSummary.maxCapacity || 30})
                    </span>
                    <span className="font-semibold text-slate-900">{guestCount} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                      className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100 font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setGuestCount((c) => Math.min(pricingSummary.maxCapacity || 40, c + 1))
                      }
                      className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Breakdown or Conflict Message */}
              {!pricingSummary.valid ? (
                <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs leading-relaxed flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>{pricingSummary.reason}</div>
                </div>
              ) : (
                <div className="mt-4 p-4 rounded-2xl bg-[#F7F6F2] border border-stone-200/90 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 text-sm">{pricingSummary.title}</div>
                  <div className="text-stone-500">{pricingSummary.subtitle}</div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-stone-700">
                    <span>Total Package / Unit Price</span>
                    <span className="font-semibold">{formatPHP(pricingSummary.total)}</span>
                  </div>
                  <div className="flex justify-between text-[#18453B] font-bold text-sm">
                    <span>Required 50% Downpayment Now</span>
                    <span>{formatPHP(pricingSummary.downpayment)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Remaining 50% Balance (Due Upon Arrival)</span>
                    <span>{formatPHP(pricingSummary.balance)}</span>
                  </div>
                </div>
              )}

              {/* Guest Details & Pre-Payment Form */}
              <form onSubmit={handleFormSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Maria Santos"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#18453B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address (for Confirmation) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#18453B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0917-XXX-XXXX"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#18453B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      50% Downpayment Channel
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-[#18453B]"
                    >
                      <option value="GCash">GCash (0917-555-FORTS)</option>
                      <option value="Maya">Maya Wallet</option>
                      <option value="BDO Bank Transfer">BDO Bank Transfer</option>
                      <option value="BPI Bank Transfer">BPI Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Payment Ref. No. (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Last 6 digits / Ref #"
                      value={paymentRefNumber}
                      onChange={(e) => setPaymentRefNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#18453B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Special Requests / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Celebration occasion, arrival time, etc."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#18453B]"
                  />
                </div>

                {/* CLIENT REQUIREMENT: Hyperlinked "booking policy" before payment that opens pop-up agreement + Required Checkbox */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90">
                  <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToPolicy}
                      onChange={(e) => setAgreedToPolicy(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#18453B] rounded cursor-pointer"
                    />
                    <span className="leading-relaxed">
                      I have read and agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsPolicyModalOpen(true);
                        }}
                        className="font-bold text-[#18453B] underline underline-offset-2 hover:text-teal-700 cursor-pointer"
                      >
                        booking policy
                      </button>{' '}
                      (Terms & Conditions before Downpayment, Cancellation, Refund & Rescheduling Policy). *
                    </span>
                  </label>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!pricingSummary.valid}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                    pricingSummary.valid
                      ? 'bg-[#18453B] hover:bg-[#11332b] text-white'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Pay 50% Downpayment ({formatPHP(pricingSummary.downpayment)}) & Confirm
                </button>
              </form>

              <p className="text-[11px] text-center text-stone-500 mt-3">
                Instant Confirmation Email Preview generated immediately after submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          RIVERSIDE TOUR PACKAGES SECTION (FROM PDF)
      ========================================== */}
      <section ref={packagesSectionRef} className="py-14 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#18453B]">
              Whole Resort Exclusive Access
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#143630] mt-1">
              Riverside Tour Packages
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
              Our Riverside Tour Packages offer a simple, heartfelt way to explore the beauty of the
              river while enjoying the comforts of our quiet retreat. Each regular package comes
              with a <strong>complimentary stay in our Overlooking Room</strong>, giving you a cozy
              spot to rest with a beautiful, direct view of the river.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHOLE_RESORT_PACKAGES.filter((p) => p.id !== 'weekday_promo').map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-3xl border border-stone-200 bg-[#F9F8F5] p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#18453B] text-white">
                      {pkg.time}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      Up to {pkg.maxGuests} Pax
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#143630]">{pkg.name}</h3>
                  <p className="text-sm text-stone-600 mt-3 leading-relaxed">{pkg.description}</p>

                  <ul className="mt-5 space-y-2 border-t border-stone-200 pt-4">
                    {pkg.highlights.map((h) => (
                      <li key={h} className="text-xs text-stone-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#18453B] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase text-stone-500 block">
                      Weekday / Weekend
                    </span>
                    <span className="text-lg font-extrabold text-[#18453B]">
                      {formatPHP(pkg.weekdayPrice)} – {formatPHP(pkg.weekendPrice)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingMode('whole_resort');
                      setSelectedPackageId(pkg.id);
                      scrollToRef(bookingSectionRef);
                    }}
                    className="bg-[#18453B] hover:bg-[#11332b] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Select Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SEPARATE SPACE FOR ROOMS, AMENITIES & RESORT FACILITIES
      ========================================== */}
      <section ref={roomsSectionRef} className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ROOMS SHOWCASE */}
        <div>
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#18453B]">
              Restful Riverside Accommodations
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#143630] mt-1">
              Our Rooms
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
              Whether you're planning a quiet escape, a fun-filled barkada outing, or a meaningful
              celebration, The Forts Riverside Private Resort offers comfortable rooms with peaceful
              river views, providing a simple and relaxing space to rest after a day of laughter and
              togetherness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALL_ROOMS_SHOWCASE.map((rm) => (
              <div
                key={rm.name}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs flex flex-col justify-between group"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={rm.image}
                      alt={rm.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      {rm.capacity}
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] font-bold text-[#18453B] uppercase tracking-wider block">
                      {rm.tag}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-slate-900 mt-1">{rm.name}</h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">{rm.description}</p>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => {
                      if (rm.name.includes('Overlooking')) {
                        setBookingMode('whole_resort');
                      } else {
                        setBookingMode('staycation');
                      }
                      scrollToRef(bookingSectionRef);
                    }}
                    className="w-full py-2.5 rounded-xl border border-[#18453B] text-[#18453B] hover:bg-[#18453B] hover:text-white text-xs font-bold transition cursor-pointer"
                  >
                    Check Room Availability
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AMENITIES & RESORT FACILITIES */}
        <div>
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#18453B]">
              Amenities & Inclusions
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#143630] mt-1">
              Resort Facilities & Spaces
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
              Experience a peaceful escape at our humble riverside retreat, featuring a refreshing
              swimming pool, a scenic balcony over the water, and dedicated spaces for recreation or
              gatherings. Guests enjoy full access to our kitchen and function areas, perfect for
              creating a "home away from home" atmosphere right by the river.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AMENITIES_LIST.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs group"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs">
                      <IconComponent className="w-4 h-4 text-[#18453B]" />
                      <span className="text-xs font-bold text-slate-900">{item.subtitle}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-serif font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          HOUSE RULES SECTION
      ========================================== */}
      <section ref={rulesSectionRef} className="py-14 bg-[#EFECE6] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#18453B]">
                Important Guidelines
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#143630] mt-1">
                Resort House Rules
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                To keep The Forts peaceful, safe, and enjoyable for everyone, please observe our house guidelines.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPolicyModalOpen(true)}
              className="self-start md:self-auto bg-white hover:bg-stone-50 text-[#18453B] border border-stone-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> View Full Cancellation & Refund Policy
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOUSE_RULES.map((block) => (
              <div
                key={block.title}
                className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs"
              >
                <h3 className="text-base font-bold text-[#143630] mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#18453B]" />
                  {block.title}
                </h3>
                <ul className="space-y-2">
                  {block.items.map((rule, i) => (
                    <li key={i} className="text-xs sm:text-sm text-stone-600 flex items-start gap-2">
                      <span className="text-[#18453B] font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          FAQs SECTION
      ========================================== */}
      <section ref={faqSectionRef} className="py-14 bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#18453B]">
              Got Questions?
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#143630] mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 overflow-hidden bg-[#F9F8F5]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-[#18453B] cursor-pointer"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#18453B] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          DIRECTIONS, CONTACT & LOCATION SECTION (FROM PDF)
      ========================================== */}
      <section ref={contactSectionRef} className="py-14 bg-[#143630] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                Location & Contact
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                Directions to The Forts Riverside Private Resort
              </h2>
              <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
                Located near the scenic <strong>Angat River and Beltran Street</strong> (Hedro
                Looban / Philadelphia area), The Forts Riverside Private Resort can be accessed
                through private car or public transport. If you need further assistance, feel free
                to contact us — we'll be happy to guide you on your way!
              </p>

              <div className="space-y-3 pt-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>Near Angat River & Beltran Street, Bulacan, Philippines</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>+63 917 555 3999 / (044) 812-3999</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>bookings@theforts.ph • theforts.ph</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <a
                  href="#facebook"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsChatOpen(true);
                  }}
                  className="bg-white text-[#143630] hover:bg-amber-100 font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" /> Message us on Facebook
                </a>
                <a
                  href="#instagram"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsChatOpen(true);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 transition"
                >
                  <Camera className="w-4 h-4" /> @theforts.ph on Instagram
                </a>
              </div>
            </div>

            {/* Interactive Styled Map Visual Matching the PDF Map of Angat River & Beltran St */}
            <div className="lg:col-span-6">
              <div className="bg-[#E5E3DF] rounded-3xl p-3 shadow-2xl border border-white/15 text-slate-800">
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#D4E6D3] border border-stone-300">
                  {/* Stylized River & Road Map SVG inspired by the PDF's Angat River / Beltran St map */}
                  <svg viewBox="0 0 600 340" className="w-full h-full object-cover">
                    <rect width="600" height="340" fill="#E8F0E6" />
                    {/* Greenery blocks */}
                    <path d="M0,0 L600,0 L600,130 L0,90 Z" fill="#C8DFC2" />
                    {/* Scenic Angat River */}
                    <path
                      d="M -20,120 C 140,150 280,85 450,145 C 530,170 580,160 620,180 L 620,60 C 480,30 300,20 -20,45 Z"
                      fill="#76B4D6"
                    />
                    <text
                      x="250"
                      y="90"
                      fill="#1D5B79"
                      fontSize="15"
                      fontWeight="bold"
                      fontStyle="italic"
                    >
                      Angat River
                    </text>

                    {/* Local Roads (Beltran Street & Hedro Looban) */}
                    <path
                      d="M 40,340 L 190,190 L 420,210 L 580,290"
                      stroke="#FFFFFF"
                      strokeWidth="12"
                      fill="none"
                    />
                    <path
                      d="M 190,190 L 290,140"
                      stroke="#F6D57A"
                      strokeWidth="10"
                      fill="none"
                    />
                    <text x="115" y="265" fill="#475569" fontSize="12" fontWeight="bold">
                      Beltran Street
                    </text>
                    <text x="340" y="235" fill="#475569" fontSize="12" fontWeight="bold">
                      Hedro Looban • Philadelphia
                    </text>

                    {/* Pin for The Forts Riverside Private Resort */}
                    <g transform="translate(290, 135)">
                      <circle cx="0" cy="0" r="24" fill="#18453B" fillOpacity="0.2" />
                      <circle cx="0" cy="0" r="10" fill="#B91C1C" stroke="#FFFFFF" strokeWidth="3" />
                    </g>
                    <rect
                      x="185"
                      y="152"
                      width="225"
                      height="32"
                      rx="8"
                      fill="#143630"
                    />
                    <text x="198" y="173" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                      📍 The Forts Riverside Resort
                    </text>
                  </svg>

                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl flex items-center justify-between text-xs shadow-sm">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        The Forts Riverside Private Resort
                      </span>
                      <span className="text-stone-500">
                        Adjacent to Angat River • Accessible via Beltran St.
                      </span>
                    </div>
                    <span className="bg-teal-900 text-white px-3 py-1.5 rounded-lg font-semibold">
                      theforts.ph
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-200 gap-4">
            <div>© 2026 The Forts Riverside Private Resort (theforts.ph). All rights reserved.</div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(true)}
                className="underline hover:text-white cursor-pointer"
              >
                Booking, Cancellation & Refund Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="underline hover:text-white cursor-pointer"
              >
                AI Concierge Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          MODAL 1: CLIENT'S EXACT "BOOKING POLICY" POP-UP AGREEMENT
      ========================================== */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#143630] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="text-lg font-serif font-bold">
                    Booking Policy & Pre-Payment Agreement
                  </h3>
                  <p className="text-xs text-teal-200">
                    1. Terms & Conditions before Downpayment • 2. Cancellation/Refund/Rescheduling
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Exact Client Policy Text */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-stone-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <strong>Important Notice Before Downpayment:</strong> Please review our official
                Terms & Conditions and Cancellation, Refund & Rescheduling Policy below before
                submitting your 50% down payment.
              </div>

              <div className="text-center border-b border-stone-200 pb-3">
                <h4 className="text-base sm:text-lg font-extrabold tracking-wide text-[#143630] uppercase">
                  CANCELLATION, REFUND & RESCHEDULING POLICY
                </h4>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-bold text-slate-900">Reservation & Payment</h5>
                  <p className="mt-1 text-stone-600">
                    A 50% down payment is required to secure your booking. The remaining balance is
                    due upon arrival unless otherwise agreed. Bookings are confirmed only after
                    payment verification.
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900">Cancellation & No-Show</h5>
                  <p className="mt-1 text-stone-600">
                    Guest-initiated cancellations are generally non-refundable. No-shows will result
                    in forfeiture of the deposit. Please contact management for exceptional
                    circumstances.
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900">Rescheduling</h5>
                  <p className="mt-1 text-stone-600">
                    One (1) reschedule may be requested at least 7 days before the booking date,
                    subject to availability and management approval. Rate differences may apply.
                    Late requests may be declined.
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900">Cancellation by Management</h5>
                  <p className="mt-1 text-stone-600">
                    If management cancels and no suitable alternative is available, guests may
                    choose a full refund or an agreed replacement date.
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900">Refunds</h5>
                  <p className="mt-1 text-stone-600">
                    Approved refunds will be processed through the original or mutually agreed
                    payment method, in accordance with applicable consumer protection laws.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
                  <h5 className="font-bold text-slate-900">Acknowledgment</h5>
                  <p className="mt-1 text-stone-700">
                    By confirming a booking, guests acknowledge and agree to these policies.
                  </p>
                </div>
              </div>

              {/* 3. Required Agreement Checkbox inside the Modal */}
              <label className="flex items-center gap-3 p-4 rounded-2xl bg-teal-950/5 border-2 border-[#18453B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToPolicy}
                  onChange={(e) => setAgreedToPolicy(e.target.checked)}
                  className="w-5 h-5 accent-[#18453B] rounded cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-bold text-[#143630]">
                  I have read, understood, and agree to The Forts Riverside Private Resort's Terms & Conditions and Cancellation, Refund & Rescheduling Policy.
                </span>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgreedToPolicy(true);
                  setIsPolicyModalOpen(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#18453B] hover:bg-[#11332b] text-white text-xs font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> I Agree & Continue to Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: PAYMENT & CONFIRMATION EMAIL PREVIEW
      ========================================== */}
      {activeConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 bg-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-emerald-200 font-bold block">
                    Payment & Confirmation Email Sent
                  </span>
                  <h3 className="text-lg font-serif font-bold">
                    Booking Reference: {activeConfirmation.bookingCode}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveConfirmation(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Email Container */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 space-y-1 text-xs">
                <div>
                  <span className="text-stone-500 font-semibold">From:</span> The Forts Reservations
                  &lt;reservations@theforts.ph&gt;
                </div>
                <div>
                  <span className="text-stone-500 font-semibold">To:</span>{' '}
                  {activeConfirmation.guestName} &lt;{activeConfirmation.guestEmail}&gt;
                </div>
                <div>
                  <span className="text-stone-500 font-semibold">Subject:</span> [Confirmed] Your
                  Reservation at The Forts Riverside Private Resort (
                  {activeConfirmation.bookingCode})
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-stone-700">
                  Warm greetings from <strong>The Forts Riverside Private Resort</strong>! Your
                  reservation and 50% down payment have been logged, and your chosen date is now
                  reserved on our live availability calendar.
                </p>

                <div className="rounded-2xl border border-stone-200 overflow-hidden">
                  <div className="bg-[#143630] text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex justify-between">
                    <span>Reservation Details</span>
                    <span>{activeConfirmation.bookedVia}</span>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F9F8F5]">
                    <div>
                      <span className="text-[11px] text-stone-500 block">CHECK-IN DATE</span>
                      <span className="font-bold text-slate-900">
                        {activeConfirmation.displayDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">BOOKING CATEGORY</span>
                      <span className="font-bold text-[#18453B]">{activeConfirmation.mode}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">PACKAGE / UNITS</span>
                      <span className="font-semibold text-slate-900">
                        {activeConfirmation.selectionSummary}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">INCLUSION / SCHEDULE</span>
                      <span className="font-semibold text-slate-900">
                        {activeConfirmation.roomInclusion}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">GUEST DETAILS</span>
                      <span className="font-semibold text-slate-900">
                        {activeConfirmation.guestName} ({activeConfirmation.guestCount} Pax) •{' '}
                        {activeConfirmation.guestPhone}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">PAYMENT CHANNEL</span>
                      <span className="font-semibold text-slate-900">
                        {activeConfirmation.paymentMethod} ({activeConfirmation.paymentRefNumber})
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t border-stone-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Total Booking Amount:</span>
                      <span className="font-bold">{formatPHP(activeConfirmation.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-bold">
                      <span>50% Downpayment Logged:</span>
                      <span>{formatPHP(activeConfirmation.downpaymentAmount)}</span>
                    </div>
                    <div className="flex justify-between text-amber-900 font-semibold">
                      <span>Remaining 50% Balance (Due Upon Arrival):</span>
                      <span>{formatPHP(activeConfirmation.balanceAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
                  <strong>Policy Reminder:</strong> Guest-initiated cancellations are generally
                  non-refundable. One (1) reschedule may be requested at least 7 days before the
                  booking date, subject to availability and management approval.
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Confirmation
              </button>
              <button
                type="button"
                onClick={() => setActiveConfirmation(null)}
                className="px-6 py-2.5 rounded-xl bg-[#18453B] hover:bg-[#11332b] text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          FLOATING AI CONCIERGE & AUTO-BOOKING AGENT
      ========================================== */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isChatOpen ? (
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="bg-[#18453B] hover:bg-[#11332b] text-white px-5 py-3.5 rounded-full shadow-2xl border border-teal-600/40 flex items-center gap-3 transition hover:scale-105 cursor-pointer"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-amber-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold block leading-none">The Forts AI Concierge</span>
              <span className="text-[10px] text-teal-200">Check Dates • Ask Rules • Auto-Book</span>
            </div>
          </button>
        ) : (
          <div className="w-[360px] sm:w-[410px] h-[540px] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="px-5 py-4 bg-[#143630] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-800 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-tight">The Forts AI Booking Agent</h4>
                  <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                    ● Connected to Live Calendar & Booking Form
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F7F6F2]">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-[#18453B] text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-stone-200 shadow-2xs rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-500 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#18453B]" />
                    Checking live resort availability...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-3 py-2 bg-stone-100 border-t border-stone-200 flex gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() =>
                  handleSendChat('Check availability for Sunday Nov 1, 2026 and Saturday Nov 7, 2026')
                }
                className="shrink-0 text-[11px] bg-white hover:bg-teal-50 text-[#18453B] border border-stone-300 px-2.5 py-1 rounded-full font-medium cursor-pointer"
              >
                📅 Check Weekend Availability
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendChat(
                    'Book the ₱3,999 Weekday Promo for me on November 10, 2026 under Alex Rivera (alex@email.com, 09171234567) for 15 guests'
                  )
                }
                className="shrink-0 text-[11px] bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 px-2.5 py-1 rounded-full font-semibold cursor-pointer"
              >
                ⚡ Auto-Book ₱3,999 Promo for Me
              </button>
              <button
                type="button"
                onClick={() => handleSendChat('What is the cancellation and rescheduling policy?')}
                className="shrink-0 text-[11px] bg-white hover:bg-teal-50 text-[#18453B] border border-stone-300 px-2.5 py-1 rounded-full font-medium cursor-pointer"
              >
                📜 Cancellation Policy
              </button>
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask availability or tell me to book for you..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#18453B]"
              />
              <button
                type="submit"
                disabled={isAiTyping}
                className="p-2.5 rounded-xl bg-[#18453B] hover:bg-[#11332b] text-white transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}