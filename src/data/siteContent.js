import { Clock, Users, Sun, Utensils, Car, Waves, ShieldCheck, AlertCircle, Trees, Mic2, Coffee } from 'lucide-react';
import { FALLBACK_IMAGES, SITE_IMAGES } from './bookingData.js';

export const AMENITIES_GALLERY = [
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

export const STAYCATION_POLICIES_PDF = [
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
      'Kitchen use and LPG are included for Staycation bookings (optional +₱400 add-on for Exclusive Resort packages).',
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

export const PAYMENT_CANCELLATION_PDF = [
  {
    title: '1. Reservation Hold & 50% Down Payment',
    items: [
      'Submitting a reservation on the website places a temporary 24-hour hold on your selected dates. Unpaid holds automatically expire after 24 hours.',
      'A 50% down payment (DP) is required within 24 hours to officially lock in your booking (send proof of payment and your Reference ID to our official Facebook page).',
      'For Events Bookings, custom quotations are finalized directly with management before settling the 50% down payment. The remaining 50% balance is payable upon arrival.'
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

export const REVIEWS_DATA = [
  {
    id: 'rev-1',
    name: 'Joe Baluyut',
    stayType: 'Google Review',
    date: 'October 2025',
    rating: 5,
    highlight: 'Love the river view!',
    comment:
      'Recommended for family and friends events. Super fun!'
  },
  {
    id: 'rev-2',
    name: 'Zyrah Red',
    stayType: 'Google Review',
    date: 'September 2025',
    rating: 5,
    highlight: 'Place is huge with good ambiance.',
    comment:
      'Nice Place to visit with your Family & Friends.'
  },
  {
    id: 'rev-3',
    name: 'Mary Christine Recto',
    stayType: 'Facebook Review',
    date: 'September 2026',
    rating: 5,
    highlight: 'Would definitely come back!',
    comment:
      'Clean place, nice staff, and a relaxing stay. '
  },
  {
    id: 'rev-4',
    name: 'Therese David',
    stayType: 'Facebook Review',
    date: 'July 2025',
    rating: 5,
    highlight: 'Whether you’re looking to unwind, reconnect, or simply escape the noise of the city—this resort is worth every peso.',
    comment:
      'Highly recommended 👌 Just had the most amazing stay with our SFC Family at this private resort! From the moment we arrived, we were welcomed with warmth. Ideal for family getaways, barkada trips, or even quiet solo retreats.'
  }
];

export const FAQS_DATA = [
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
