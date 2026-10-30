import { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Bath,
  BedDouble,
  Calendar as CalendarIcon,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  Flame,
  Heart,
  HelpCircle,
  Info,
  Keyboard,
  MapPin,
  Maximize2,
  Menu,
  Minus,
  Phone,
  Plus,
  Quote,
  RotateCcw,
  Sparkles,
  Star,
  Users,
  Waves,
  X
} from 'lucide-react';
import {
  BOOKING_TYPES,
  FALLBACK_IMAGES,
  PACKAGES_DATA,
  ROOMS_DATA,
  SITE_IMAGES
} from './data/bookingData.js';
import {
  AMENITIES_GALLERY,
  FAQS_DATA,
  PAYMENT_CANCELLATION_PDF,
  REVIEWS_DATA,
  STAYCATION_POLICIES_PDF
} from './data/siteContent.js';
import {
  addDaysToKey,
  buildMonthDaysMondayFirst,
  diffDaysBetweenKeys,
  formatPHP,
  formatReadableDate,
  formatSlashDate,
  getDayRateInfo,
  toDateKey
} from './utils/dateUtils.js';
import {
  FacebookIcon,
  InstagramIcon
} from './components/SocialIcons.jsx';
import FortsAIChatbot from './components/FortsAIChatbot.jsx';
import { FortsBrandLogo, SmartResortImage } from './components/SiteImages.jsx';
import { BOOKING_SCRIPT_URL } from './config.js';

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLightboxAmenity, setActiveLightboxAmenity] = useState(null);

  // Maximum Extra Limits
  const MAX_ADDITIONAL_HEADS = 60;
  const MAX_EXTRA_MATTRESSES = 60;

  // Live Bookings from Google Sheets
  const [sheetBookings, setSheetBookings] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  // Additional Form States for On-Site Submission
  const [guestEmail, setGuestEmail] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSubmitResult, setBookingSubmitResult] = useState(null);

  // Copied Payment Number State
  const [copiedPayment, setCopiedPayment] = useState(null);

  const handleCopyPayment = (text, type) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedPayment(type);
      setTimeout(() => setCopiedPayment(null), 2000);
    }
  };

  // Fetch live availability from Google Sheets
  const fetchSheetAvailability = async () => {
    if (!BOOKING_SCRIPT_URL || BOOKING_SCRIPT_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
      setLoadingAvailability(false);
      return;
    }
    try {
      setLoadingAvailability(true);
      const res = await fetch(BOOKING_SCRIPT_URL);
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.bookings)) {
        setSheetBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to load sheet availability:', err);
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    fetchSheetAvailability();
  }, []);

  // Submit reservation directly to Google Sheets + Send Emails
  const handleSubmitDirectBooking = async (e) => {
    e.preventDefault();
    if (!guestName.trim() || !guestContact.trim()) return;

    setIsSubmittingBooking(true);
    setBookingSubmitResult(null);

    const occupiedDates = selectedPackage.isOvernightMultiDay
      ? priceBreakdown.nightlyDetails.map((n) => n.dateKey)
      : [checkInDateKey];

    const savedDownPayment50 = priceBreakdown.downPayment50;
    const isEventBooking = Boolean(selectedPackage.isEvent);

    // Determine exact check-in and check-out times (including event schedule hours)
    const activeCheckInTime = isEventBooking
      ? eventTimePreference.includes('8:00 AM')
        ? '8:00 AM'
        : '9:00 AM'
      : selectedPackage.checkInTime || '2:00 PM';

    const activeCheckOutTime = isEventBooking
      ? eventTimePreference.includes('3:00 PM')
        ? '3:00 PM'
        : eventTimePreference.includes('8:00 PM')
        ? '8:00 PM'
        : '5:00 PM'
      : selectedPackage.checkOutTime || '12:00 NN';

    const payload = {
      category: selectedBookingType,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      timeSlot:
        selectedPackage.timeSlot || (selectedPackage.isOvernightMultiDay ? 'overnight' : 'day'),
      checkInDate: checkInDateKey,
      checkOutDate: checkOutDateKey,
      checkInTime: activeCheckInTime,
      checkOutTime: activeCheckOutTime,
      occupiedDates: occupiedDates,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestContact.trim(),
      guestCount: guestCount,
      totalRate: isEventBooking ? 0 : priceBreakdown.total,
      downPayment50: isEventBooking ? 0 : savedDownPayment50,
      notes: [
        `Time: ${activeCheckInTime} – ${activeCheckOutTime}`,
        isEventBooking ? `Event Duration: ${eventTimePreference}` : '',
        extraSingleMattresses > 0 ? `${extraSingleMattresses}x Single Mattress` : '',
        extraDoubleMattresses > 0 ? `${extraDoubleMattresses}x Double Mattress` : '',
        includeGasFee && !selectedPackage.gasIncluded && !isEventBooking
          ? `Add LPG (+₱${400 * priceBreakdown.nightsCount})`
          : '',
        paymentRef && !isEventBooking ? `GCash/Bank Ref: ${paymentRef}` : '',
        guestNotes
      ]
        .filter(Boolean)
        .join(' | ')
    };

    try {
      const response = await fetch(BOOKING_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.status === 'success') {
        setBookingSubmitResult({
          status: 'success',
          bookingId: result.bookingId,
          isEvent: isEventBooking,
          downPayment50: savedDownPayment50,
          message: isEventBooking
            ? 'Your event inquiry has been recorded! Please coordinate with us to finalize your custom quotation.'
            : 'Your reservation hold has been recorded! Please complete your 50% down payment within 24 hours.'
        });
        setSelectedDates([]);
        fetchSheetAvailability();
      } else {
        setBookingSubmitResult({
          status: 'error',
          message: result.message || 'Unable to submit booking. Please try again.'
        });
      }
    } catch (error) {
      setBookingSubmitResult({
        status: 'error',
        message: 'Network error while connecting to booking server. Please try again.'
      });
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const [activeWizardStep, setActiveWizardStep] = useState(1);

  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [selectedBookingType, setSelectedBookingType] = useState('staycation');
  const [selectedPackageId, setSelectedPackageId] = useState('staycation-vista');

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

  const [guestCount, setGuestCount] = useState(4);
  const [extraSingleMattresses, setExtraSingleMattresses] = useState(0);
  const [extraDoubleMattresses, setExtraDoubleMattresses] = useState(0);
  const [includeGasFee, setIncludeGasFee] = useState(false);
  const [extendedHours, setExtendedHours] = useState(0);
  const [eventTimePreference, setEventTimePreference] = useState(
    '8 Hours (9:00 AM – 5:00 PM)'
  );
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [guestNotes, setGuestNotes] = useState('');

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

  const secondMonthYear = useMemo(() => {
    if (currentMonth === 11) {
      return { month: 0, year: currentYear + 1 };
    }
    return { month: currentMonth + 1, year: currentYear };
  }, [currentMonth, currentYear]);

// Helper: Infers timeSlot ('day' | 'night' | 'overnight' | 'event') from packageId/category/packageName
  const getPackageTimeSlot = (pkgId, category, pkgName = '') => {
    const id = String(pkgId || '').trim().toLowerCase();
    const cat = String(category || '').trim().toLowerCase();
    const name = String(pkgName || '').trim().toLowerCase();

    if (cat === 'events' || id.startsWith('event-') || name.includes('event')) return 'event';
    if (id.startsWith('day-tour') || name.includes('day tour')) return 'day';
    if (id.startsWith('night-tour') || name.includes('night tour') || name.includes('short stay')) return 'night';
    return 'overnight';
  };

  // Time-aware date blocking check
  const getDateBookingStatus = (dateKey, pkg) => {
    if (!sheetBookings || sheetBookings.length === 0) {
      return { isBlocked: false, statusLabel: null };
    }

    const cleanTargetDate = dateKey.trim();
    const nextDayDate = addDaysToKey(cleanTargetDate, 1);
    const currentSlot = pkg.timeSlot || getPackageTimeSlot(pkg.id, pkg.category, pkg.name);

    for (const b of sheetBookings) {
      const status = String(b.status || '').trim();
      if (status !== 'Reserved' && status !== 'Booked' && status !== 'Inquiry') continue;
      if (!b.occupiedDates || !Array.isArray(b.occupiedDates)) continue;

      const existingSlot =
        b.timeSlot || getPackageTimeSlot(b.packageId, b.category, b.packageName);

      // Rule 1A: Existing booking is Overnight (checks out at 12:00 NN on b.checkOutDate).
      // Block Day Tours (8 AM) and Events (8/9 AM) on that check-out date!
      if (
        existingSlot === 'overnight' &&
        b.checkOutDate &&
        b.checkInDate &&
        b.checkOutDate.trim() === cleanTargetDate &&
        b.checkInDate.trim() !== cleanTargetDate
      ) {
        if (currentSlot === 'day' || currentSlot === 'event') {
          return { isBlocked: true, statusLabel: status };
        }
        continue;
      }

      // Rule 1B (THE NOV 26–27 FIX): If the user is viewing an OVERNIGHT package on cleanTargetDate (e.g. Nov 26),
      // they will not check out until 12:00 NN the NEXT day (nextDayDate, e.g. Nov 27).
      // Therefore, if nextDayDate has a morning Day Tour (8 AM) or Event (8/9 AM), cleanTargetDate MUST be blocked!
      if (
        currentSlot === 'overnight' &&
        (existingSlot === 'day' || existingSlot === 'event') &&
        b.occupiedDates.some((d) => d.trim() === nextDayDate)
      ) {
        return {
          isBlocked: true,
          statusLabel: `${status} (8AM ${existingSlot === 'day' ? 'Day Tour' : 'Event'} next morning)`
        };
      }

      // Check if this booking actually occupies cleanTargetDate
      const isDateBlocked = b.occupiedDates.some((d) => d.trim() === cleanTargetDate);
      if (!isDateBlocked) continue;

      // Rule 2: Day Tour (8AM–5PM) and Night Tour (7PM/8PM–5AM) do NOT overlap on the same date!
      if (
        (existingSlot === 'day' && currentSlot === 'night') ||
        (existingSlot === 'night' && currentSlot === 'day')
      ) {
        continue;
      }

      const existingCategory = String(b.category || '').trim().toLowerCase();
      const currentCategory = String(pkg.category || '').trim().toLowerCase();

      const isExistingExclusive = existingCategory === 'resort' || existingCategory === 'events';
      const isCurrentExclusive = currentCategory === 'resort' || currentCategory === 'events';

      if (isExistingExclusive || isCurrentExclusive) {
        return { isBlocked: true, statusLabel: status };
      }

      if (String(b.packageId).trim() === String(pkg.id).trim()) {
        return { isBlocked: true, statusLabel: status };
      }
    }
    return { isBlocked: false, statusLabel: null };
  };

  const firstMonthCells = useMemo(
    () =>
      buildMonthDaysMondayFirst(
        currentYear,
        currentMonth,
        selectedPackage,
        customHolidays,
        today
      ).map((cell) =>
        cell
          ? { ...cell, ...getDateBookingStatus(cell.dateKey, selectedPackage) }
          : null
      ),
    [currentYear, currentMonth, selectedPackage, customHolidays, today, sheetBookings]
  );

  const secondMonthCells = useMemo(
    () =>
      buildMonthDaysMondayFirst(
        secondMonthYear.year,
        secondMonthYear.month,
        selectedPackage,
        customHolidays,
        today
      ).map((cell) =>
        cell
          ? { ...cell, ...getDateBookingStatus(cell.dateKey, selectedPackage) }
          : null
      ),
    [secondMonthYear, selectedPackage, customHolidays, today, sheetBookings]
  );

  const handleDayClick = (dayItem) => {
    if (!dayItem || dayItem.isPast) return;

    setDateLimitNotice('');

    if (!selectedPackage.isOvernightMultiDay) {
      setSelectedDates([dayItem.dateKey]);
      return;
    }

    if (selectedDates.length !== 1) {
      setSelectedDates([dayItem.dateKey]);
      return;
    }

    const startKey = selectedDates[0];
    const diff = diffDaysBetweenKeys(startKey, dayItem.dateKey);

    if (diff === 0) {
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

    setSelectedDates([dayItem.dateKey]);
  };

  const handleClearDates = () => {
    setDateLimitNotice('');
    setSelectedDates([]);
  };

  useEffect(() => {
    if (!sheetBookings.length || !selectedDates.length) return;

    const nightsCount = selectedPackage.isOvernightMultiDay
      ? Math.max(1, selectedDates.length - 1)
      : 1;

    const hasBlockedNight = Array.from({ length: nightsCount }, (_, i) =>
      addDaysToKey(selectedDates[0], i)
    ).some((dateKey) => getDateBookingStatus(dateKey, selectedPackage).isBlocked);

    if (hasBlockedNight) {
      setSelectedDates([]);
    }
  }, [sheetBookings, selectedPackage, selectedDates]);

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

    const nightlyDetails = nightKeysToCharge.map((k, idx) => {
      const rateInfo = getDayRateInfo(k, selectedPackage, customHolidays);
      const bookingStatus = getDateBookingStatus(k, selectedPackage);
      return {
        nightNumber: idx + 1,
        dateKey: k,
        ...rateInfo,
        isBlocked: bookingStatus.isBlocked,
        available: rateInfo.available && !bookingStatus.isBlocked
      };
    });

    // Prevent an Overnight stay from checking out at 12:00 NN on a date that already has an 8AM Day Tour or Event
    const checkoutDateForOvernight = isMultiDay
      ? addDaysToKey(selectedDates[0], nightsCount)
      : null;

    const hasCheckoutMorningClash =
      isMultiDay &&
      checkoutDateForOvernight &&
      sheetBookings.some((b) => {
        if (b.status !== 'Reserved' && b.status !== 'Booked' && b.status !== 'Inquiry') return false;
        const bSlot = b.timeSlot || getPackageTimeSlot(b.packageId, b.category);
        if (bSlot !== 'day' && bSlot !== 'event') return false;
        return (
          Array.isArray(b.occupiedDates) &&
          b.occupiedDates.some((d) => d.trim() === checkoutDateForOvernight)
        );
      });

    const allAvailable = nightlyDetails.every((n) => n.available) && !hasCheckoutMorningClash;
    const hasWeekendStaycationWarning =
      selectedPackage.category === 'staycation' && nightlyDetails.some((n) => n.isPeakDay);

    const baseRate = nightlyDetails.reduce((sum, n) => sum + (n.rate || 0), 0);
    const excessGuests = Math.max(0, guestCount - selectedPackage.maxPax);

    const excessFee =
      selectedPackage.category === 'staycation'
        ? excessGuests * selectedPackage.excessFeePerHead
        : excessGuests * selectedPackage.excessFeePerHead * nightsCount;

    const mattressFeePerNight = extraSingleMattresses * 150 + extraDoubleMattresses * 200;
    const mattressFee = mattressFeePerNight * nightsCount;

    // PDF Memo: LPG/cooking fee is P400 per night
    const gasFee = selectedPackage.gasIncluded
      ? 0
      : includeGasFee
      ? selectedPackage.gasFeeOption * nightsCount
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
    customHolidays,
    sheetBookings
  ]);

  const checkInDateKey = selectedDates[0] || '';
  const checkOutDateKey = useMemo(() => {
    if (!selectedDates.length) return '';
    if (!selectedPackage.isOvernightMultiDay) return selectedDates[0];
    if (selectedDates.length >= 2) return selectedDates[selectedDates.length - 1];
    return addDaysToKey(selectedDates[0], 1);
  }, [selectedDates, selectedPackage]);

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

  const generateSummaryText = () => {
    const bookingCategoryName = activeBookingTypeObj.title;
    const dateSummary = selectedPackage.isOvernightMultiDay
      ? `${formatReadableDate(checkInDateKey)} (${
          selectedPackage.checkInTime || '2:00 PM'
        }) to ${formatReadableDate(checkOutDateKey)} (${
          selectedPackage.checkOutTime || '12:00 NN'
        }) — ${priceBreakdown.stayDurationLabel}`
      : `${formatReadableDate(checkInDateKey)} (${
          selectedPackage.isEvent ? eventTimePreference : selectedPackage.duration
        })`;

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
              ? `Yes (+Php ${priceBreakdown.gasFee})`
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
      'Official Website: https://theforts.pages.dev'
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

  const renderCleanMonthGrid = (cells) => {
    return (
      <div>
        <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 pb-3">
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
          <div>Su</div>
        </div>

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

            // Allow clicking a date as the 12:00 NN Check-Out day of an overnight stay
            // ONLY if all preceding nights are available AND the check-out date has NO morning Day Tour or Event
            const canSelectAsCheckout =
              selectedPackage.isOvernightMultiDay &&
              selectedDates.length === 1 &&
              (() => {
                const diff = diffDaysBetweenKeys(selectedDates[0], dayItem.dateKey);
                if (diff <= 0 || diff > 2) return false;
                for (let i = 0; i < diff; i++) {
                  const nightKey = addDaysToKey(selectedDates[0], i);
                  if (getDateBookingStatus(nightKey, selectedPackage).isBlocked) return false;
                }
                const hasMorningClashOnCheckout = sheetBookings.some((b) => {
                  const status = String(b.status || '').trim();
                  if (status !== 'Reserved' && status !== 'Booked' && status !== 'Inquiry') return false;
                  const bSlot =
                    b.timeSlot || getPackageTimeSlot(b.packageId, b.category, b.packageName);
                  if (bSlot !== 'day' && bSlot !== 'event') return false;
                  return (
                    Array.isArray(b.occupiedDates) &&
                    b.occupiedDates.some((d) => d.trim() === dayItem.dateKey.trim())
                  );
                });
                return !hasMorningClashOnCheckout;
              })();

            return (
              <div
                key={dayItem.dateKey}
                className="relative h-10 sm:h-11 flex items-center justify-center"
              >
                {isSelected && !isSingleSelection && (
                  <div
                    className={`absolute inset-y-0.5 bg-[#F5EFE6] transition-all duration-300 ${
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
                  disabled={dayItem.isPast || (dayItem.isBlocked && !canSelectAsCheckout)}
                  onClick={() => handleDayClick(dayItem)}
                  title={
                    dayItem.isBlocked && !canSelectAsCheckout
                      ? `${dayItem.statusLabel} (${selectedPackage.shortName} unavailable)`
                      : canSelectAsCheckout && dayItem.isBlocked
                      ? 'Available for 12:00 NN Check-Out'
                      : dayItem.holidayName
                      ? `${dayItem.holidayName} (Holiday Rate Applies)`
                      : undefined
                  }
                  className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm transition-all duration-200 select-none ${
                    dayItem.isPast
                      ? 'text-slate-300 line-through cursor-not-allowed font-normal'
                      : dayItem.isBlocked && !isStart && !isEnd && !canSelectAsCheckout
                      ? 'bg-rose-50 text-rose-300 line-through cursor-not-allowed font-normal'
                      : isStart || isEnd
                      ? 'bg-[#0B3553] text-white font-bold shadow-md ring-2 ring-[#C8AD7F] cursor-pointer scale-105'
                      : isMiddle
                      ? 'bg-[#0B3553]/15 text-[#0B3553] font-bold cursor-pointer'
                      : 'hover:border hover:border-[#0B3553] hover:scale-105 active:scale-95 text-slate-700 font-semibold cursor-pointer'
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
      {/* ==========================================
          TOP ANNOUNCEMENT BAR
      ========================================== */}
      <div className="bg-[#0B3553] text-white text-xs sm:text-sm py-2.5 px-4 text-center border-b border-[#C8AD7F]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#F5EFE6]">
            <Sparkles className="w-3.5 h-3.5 text-[#C8AD7F] animate-pulse" />
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3.5 group">
            <FortsBrandLogo className="w-12 h-12 group-hover:scale-105 transition-transform duration-300" />
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
              className="inline-flex items-center gap-2 bg-[#0B3553] hover:bg-[#16486B] active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-[#F5EFE6]" />
              Book Now!
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-[#0B3553] hover:bg-[#F5EFE6] active:scale-95 transition-all"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1.5 animate-step-enter">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium transition-colors"
            >
              Home
            </a>
            <a
              href="#booking-calendar"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8] font-bold"
            >
              Calendar & Rate Calculator
            </a>
            <a
              href="#rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium transition-colors"
            >
              Rooms
            </a>
            <a
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium transition-colors"
            >
              Packages & Rates
            </a>
            <a
              href="#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium transition-colors"
            >
              Amenities
            </a>
            <a
              href="#rules"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium transition-colors"
            >
              Policies & Rules
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium transition-colors"
            >
              Guest Reviews
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F5EFE6] font-medium transition-colors"
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
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3553]/25 via-[#0B3553]/20 to-[#0B3553]/15" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-22 animate-step-enter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5EFE6]/15 border border-[#E6DBC8]/40 text-[#F5EFE6] text-xs sm:text-sm font-medium mb-6 backdrop-blur-xs">
                <MapPin className="w-4 h-4 text-[#C8AD7F]" />
                Bustos, Bulacan
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-brand-serif font-bold tracking-tight leading-[1.08] text-white">
                The Forts Riverside
                <span className="block text-lg sm:text-2xl font-sans font-bold tracking-[0.26em] uppercase text-[#E6DBC8] mt-3">
                  Private Resort
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-100 leading-relaxed max-w-2xl">
                Unwind by the scenic Angat River. Book a <strong>22-Hour Room-Only Staycation</strong>{' '}
                or reserve the <strong>Whole Resort Exclusively</strong> for your family and barkada.
              </p>

              <div className="mt-20 flex flex-wrap items-center gap-3.5">
                <a
                  href="#booking-calendar"
                  className="inline-flex items-center gap-2.5 bg-[#F5EFE6] hover:bg-white active:scale-95 text-[#0B3553] font-bold px-6 py-4 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-sm sm:text-base"
                >
                  <CalendarIcon className="w-5 h-5 text-[#0B3553]" />
                  See Availability
                </a>
                <a
                  href="#rooms"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold px-6 py-4 rounded-xl border border-white/25 backdrop-blur-xs hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
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
              View your all-in price rates and availability with your preferred booking dates!
            </p>
          </div>

          {/* ==========================================
              RETRACTED MINIMAL ICON BAR (VISIBLE IN STEP 2 & STEP 3)
          ========================================== */}
          {activeWizardStep > 1 && (
            <div className="mb-6 bg-[#FAF8F5] border border-[#E6DBC8] rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs animate-step-enter">
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
                        className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
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

              {activeWizardStep === 3 && (
                <div className="flex items-center gap-2.5 flex-wrap animate-fade-in">
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
                          className={`h-9 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
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
                className="text-xs font-semibold text-slate-500 hover:text-[#0B3553] active:scale-95 flex items-center gap-1 ml-auto transition-all cursor-pointer"
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
            <div className="max-w-4xl mx-auto bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[#E6DBC8] shadow-xs animate-step-enter">
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
                      className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-[#0B3553] text-white border-[#0B3553] shadow-md'
                          : 'bg-white hover:bg-[#F5EFE6]/60 text-slate-800 border-[#E6DBC8] hover:border-[#0B3553] hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div
                            className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-105 ${
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
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-6 border border-[#E6DBC8] shadow-xs animate-step-enter">
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
                      className={`text-left p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-[#0B3553] text-white border-[#0B3553] shadow-sm ring-2 ring-[#C8AD7F]'
                          : 'bg-white hover:bg-[#F5EFE6]/50 text-slate-800 border-slate-200 hover:border-[#0B3553]/50 hover:shadow-md'
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
                          <span>Request Quotation →</span>
                        ) : (
                          <span>
                            {formatPHP(pkg.weekdayRate)} – {formatPHP(pkg.weekendRate)}
                          </span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-step-enter">
              {/* LEFT 7 COLUMNS: AIRBNB SCREENSHOT-STYLE 2-MONTH CALENDAR CARD */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6DBC8] shadow-sm p-6 sm:p-8">
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
                        ? `${formatReadableDate(checkInDateKey)} (${
                            selectedPackage.checkInTime || '2:00 PM'
                          }) – ${formatReadableDate(checkOutDateKey)} (${
                            selectedPackage.checkOutTime || '12:00 NN'
                          })`
                        : `${formatReadableDate(checkInDateKey)} (${
                            selectedPackage.isEvent ? eventTimePreference : selectedPackage.timeLabel
                          })`}
                    </p>
                  </div>

                  {/* Twin Bordered CHECK-IN / CHECK-OUT Input Boxes */}
                  <div className="grid grid-cols-2 border border-[#E6DBC8] rounded-xl overflow-hidden bg-white shrink-0 min-w-[270px] sm:min-w-[300px]">
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

                {dateLimitNotice && (
                  <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-between gap-2 animate-step-enter">
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
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={goToPreviousMonth}
                        className="p-1.5 rounded-full hover:bg-[#F5EFE6] active:scale-90 text-[#0B3553] transition-all cursor-pointer"
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
                          className="p-1.5 rounded-full hover:bg-[#F5EFE6] active:scale-90 text-[#0B3553] transition-all cursor-pointer"
                          aria-label="Next Month"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="hidden md:block w-7" />
                    </div>
                    {renderCleanMonthGrid(firstMonthCells)}
                  </div>

                  <div className="hidden md:block">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-7" />
                      <h4 className="text-sm sm:text-base font-bold text-[#0B3553]">
                        {monthNames[secondMonthYear.month]} {secondMonthYear.year}
                      </h4>
                      <button
                        type="button"
                        onClick={goToNextMonth}
                        className="p-1.5 rounded-full hover:bg-[#F5EFE6] active:scale-90 text-[#0B3553] transition-all cursor-pointer"
                        aria-label="Next Month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    {renderCleanMonthGrid(secondMonthCells)}
                  </div>
                </div>

                {/* Bottom Bar: Keyboard Icon + Clear Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Keyboard className="w-4 h-4 text-slate-400" />
                    <span>
                    {selectedPackage.isOvernightMultiDay
                      ? 'Select up to 3 Days & 2 Nights (Max 2 nights)'
                      : 'Day Tours & Events cannot be booked on the same day as a 12:00 NN Check-Out.'}
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
                    {selectedPackage.isEvent ? eventTimePreference : priceBreakdown.stayDurationLabel}
                  </p>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  {priceBreakdown.hasWeekendStaycationWarning && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 animate-step-enter">
                      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-950">
                          Weekend / Holiday Room-Only Policy:
                        </strong>
                        Weekend/Holiday rate (
                        {formatPHP(selectedPackage.weekendRate)}/night) and open{' '}
                        <strong>7 days before the target date</strong> if no whole-resort booking is
                        confirmed.
                      </div>
                    </div>
                  )}

                  {selectedPackage.isEvent ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-[#0B3553]">
                            Estimated Number of Event Guests
                          </label>
                          <span className="text-[11px] text-slate-500">
                            31–100 Pax (Max +{MAX_ADDITIONAL_HEADS} extra)
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#E6DBC8]">
                          <span className="text-xs text-slate-600 pl-1">Expected Attendance:</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={guestCount <= 31}
                              onClick={() => setGuestCount(Math.max(31, guestCount - 5))}
                              className="w-8 h-8 rounded-lg bg-[#F5EFE6] disabled:opacity-40 text-[#0B3553] active:scale-90 flex items-center justify-center font-bold transition-transform cursor-pointer"
                            >
                              -5
                            </button>
                            <span className="w-16 text-center font-bold text-sm text-[#0B3553]">
                              {guestCount} Pax
                            </span>
                            <button
                              type="button"
                              disabled={guestCount >= selectedPackage.maxPax + MAX_ADDITIONAL_HEADS}
                              onClick={() =>
                                setGuestCount(
                                  Math.min(selectedPackage.maxPax + MAX_ADDITIONAL_HEADS, guestCount + 5)
                                )
                              }
                              className="w-8 h-8 rounded-lg bg-[#F5EFE6] disabled:opacity-40 text-[#0B3553] active:scale-90 flex items-center justify-center font-bold transition-transform cursor-pointer"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B3553] mb-1.5">
                          Select Event Duration & Schedule (Setup & Cleanup Included)
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            '6 Hours (9:00 AM – 3:00 PM)',
                            '8 Hours (9:00 AM – 5:00 PM)',
                            '12 Hours (8:00 AM – 8:00 PM)'
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

                      <div className="p-3.5 rounded-xl bg-white border border-[#E6DBC8] text-xs text-slate-600 space-y-1.5">
                        <p className="font-bold text-[#0B3553]">Event Venue Inclusions & Rules:</p>
                        <p>
                          • Includes Pavilion, designated pool area & 1 changing/rest room (strictly
                          for changing/resting; no overnight sleeping).
                        </p>
                        <p>
                          • Terrace is for viewing only (no event setup, dining, or gathering).
                        </p>
                        <p>
                          • Custom quotation is provided by management based on guest tier & duration.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3.5">
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
                              disabled={guestCount <= 1}
                              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                              className="w-8 h-8 rounded-lg bg-white border border-[#E6DBC8] disabled:opacity-40 flex items-center justify-center hover:bg-[#F5EFE6] active:scale-90 transition-all cursor-pointer"
                              aria-label="Decrease guests"
                            >
                              <Minus className="w-4 h-4 text-[#0B3553]" />
                            </button>
                            <span className="w-9 text-center font-bold text-sm text-[#0B3553]">
                              {guestCount}
                            </span>
                            <button
                              type="button"
                              disabled={guestCount >= selectedPackage.maxPax + MAX_ADDITIONAL_HEADS}
                              onClick={() =>
                                setGuestCount(
                                  Math.min(selectedPackage.maxPax + MAX_ADDITIONAL_HEADS, guestCount + 1)
                                )
                              }
                              className="w-8 h-8 rounded-lg bg-white border border-[#E6DBC8] disabled:opacity-40 flex items-center justify-center hover:bg-[#F5EFE6] active:scale-90 transition-all cursor-pointer"
                              aria-label="Increase guests"
                            >
                              <Plus className="w-4 h-4 text-[#0B3553]" />
                            </button>
                          </div>
                        </div>

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
                                  disabled={extraSingleMattresses <= 0}
                                  onClick={() =>
                                    setExtraSingleMattresses(Math.max(0, extraSingleMattresses - 1))
                                  }
                                  className="w-7 h-7 rounded-lg bg-white border border-[#E6DBC8] disabled:opacity-40 flex items-center justify-center hover:bg-[#F5EFE6] active:scale-90 transition-all cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5 text-[#0B3553]" />
                                </button>
                                <span className="w-6 text-center font-bold text-xs text-[#0B3553]">
                                  {extraSingleMattresses}
                                </span>
                                <button
                                  type="button"
                                  disabled={
                                    extraSingleMattresses + extraDoubleMattresses >= MAX_EXTRA_MATTRESSES
                                  }
                                  onClick={() =>
                                    setExtraSingleMattresses(
                                      Math.min(MAX_EXTRA_MATTRESSES, extraSingleMattresses + 1)
                                    )
                                  }
                                  className="w-7 h-7 rounded-lg bg-white border border-[#E6DBC8] disabled:opacity-40 flex items-center justify-center hover:bg-[#F5EFE6] active:scale-90 transition-all cursor-pointer"
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
                                  disabled={extraDoubleMattresses <= 0}
                                  onClick={() =>
                                    setExtraDoubleMattresses(Math.max(0, extraDoubleMattresses - 1))
                                  }
                                  className="w-7 h-7 rounded-lg bg-white border border-[#E6DBC8] disabled:opacity-40 flex items-center justify-center hover:bg-[#F5EFE6] active:scale-90 transition-all cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5 text-[#0B3553]" />
                                </button>
                                <span className="w-6 text-center font-bold text-xs text-[#0B3553]">
                                  {extraDoubleMattresses}
                                </span>
                                <button
                                  type="button"
                                  disabled={
                                    extraSingleMattresses + extraDoubleMattresses >= MAX_EXTRA_MATTRESSES
                                  }
                                  onClick={() =>
                                    setExtraDoubleMattresses(
                                      Math.min(MAX_EXTRA_MATTRESSES, extraDoubleMattresses + 1)
                                    )
                                  }
                                  className="w-7 h-7 rounded-lg bg-white border border-[#E6DBC8] disabled:opacity-40 flex items-center justify-center hover:bg-[#F5EFE6] active:scale-90 transition-all cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5 text-[#0B3553]" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-[#E6DBC8]/70">
                          <div>
                            <span className="text-sm font-bold text-[#0B3553] flex items-center gap-1.5">
                              <Flame className="w-4 h-4 text-[#8A6D3B]" />
                              Kitchen & LPG Cooking Use
                            </span>
                            <p className="text-xs text-slate-500">
                              {selectedPackage.gasIncluded
                                ? 'Included Free with Staycation'
                                : 'Optional (+₱400/night)'}
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
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
                                includeGasFee
                                  ? 'bg-[#0B3553] text-white border-[#0B3553]'
                                  : 'bg-white text-[#0B3553] border-[#E6DBC8] hover:bg-[#F5EFE6]'
                              }`}
                            >
                              {includeGasFee ? 'Added (+₱400/n)' : 'Add +₱400/n'}
                            </button>
                          )}
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-[#E6DBC8] text-[11px] text-slate-600 leading-relaxed">
                          💡 <strong>Other Add-Ons</strong> can be
                          requested in your booking notes or acquired on the day of your booking.
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#0B3553] text-white space-y-2 transition-all">
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
                            <span>Kitchen LPG Use (₱400 × {priceBreakdown.nightsCount}n)</span>
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

                  <button
                    type="button"
                    disabled={!priceBreakdown.available}
                    onClick={() => setBookingModalOpen(true)}
                    className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all duration-200 ${
                      priceBreakdown.available
                        ? 'bg-[#1D5B8C] hover:bg-[#0B3553] hover:-translate-y-0.5 active:scale-98 text-white cursor-pointer'
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
          OFFICIAL 4 STAYCATION ROOMS
      ========================================== */}
      <section id="rooms" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E6DBC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0B3553] bg-[#F5EFE6] border border-[#E6DBC8] px-3.5 py-1.5 rounded-full mb-3">
              <BedDouble className="w-3.5 h-3.5 text-[#0B3553]" />
              Explore our Accomodations
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
                className="bg-white rounded-2xl border border-[#E6DBC8] overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
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
          PACKAGES & OFFICIAL STAYCATION RATE TABLE
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

          <div className="mb-16 bg-[#FAF8F5] rounded-3xl border border-[#E6DBC8] overflow-hidden shadow-xs">
            <div className="p-6 sm:p-8 bg-[#0B3553] text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C8AD7F]">
                   22-Hour Stay • Check-in 2:00 PM • Check-out 12:00 NN
                </span>
                <h3 className="text-2xl sm:text-3xl font-brand-serif font-bold mt-1">
                  Room-Only Staycation Rates
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Silog breakfast, swimming pool access, kitchen &amp; LPG use, Wi-Fi, parking &amp;
                  karaoke are included.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white rounded-2xl overflow-hidden border border-[#E6DBC8]">
                  <thead>
                    <tr className="bg-[#F5EFE6] text-[#0B3553] text-xs font-extrabold uppercase">
                      <th className="py-3.5 px-4 border-b border-[#E6DBC8]">Room</th>
                      <th className="py-3.5 px-4 border-b border-[#E6DBC8]">Weekday</th>
                      <th className="py-3.5 px-4 border-b border-[#E6DBC8]">Wkend / Hol</th>
                      <th className="py-3.5 px-4 border-b border-[#E6DBC8] text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    <tr className="hover:bg-[#FAF8F5] transition-colors">
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
                    <tr className="hover:bg-[#FAF8F5] transition-colors">
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
                    <tr className="hover:bg-[#FAF8F5] transition-colors">
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
                    <tr className="hover:bg-[#FAF8F5] transition-colors">
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

              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-[#E6DBC8] p-5 space-y-3">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#0B3553] border-b border-slate-100 pb-2">
                    Official Add-Ons & Extra Charges
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Extra Staycation Guest (w/ pool &amp; Silog)</span>
                      <span className="font-bold text-[#0B3553]">₱300 / person</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Extra Single Mattress (Request in advance)</span>
                      <span className="font-bold text-[#0B3553]">₱150 / night</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Extra Double Mattress (Request in advance)</span>
                      <span className="font-bold text-[#0B3553]">₱200 / night</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">LPG / Cooking Fee (Free on Staycation)</span>
                      <span className="font-bold text-[#0B3553]">₱400 / night</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pool Floater (+₱100 refundable deposit)</span>
                      <span className="font-bold text-[#0B3553]">₱75 / stay</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ice Box (6 packs) / Ice Pack (5kg)</span>
                      <span className="font-bold text-[#0B3553]">₱210 / ₱35</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Charcoal (Uling)</span>
                      <span className="font-bold text-[#0B3553]">₱20</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8A6D3B] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E6DBC8] leading-relaxed">
                    <strong>Note:</strong> Extra mattresses must be requested in advance. Other add-ons may be requested
                    in your booking notes or acquired on the day of your booking!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl sm:text-3xl font-brand-serif font-bold text-[#0B3553] mb-6">
                Exclusive Resort Packages (Day Tour, Night Tour &amp; 22-Hr Overnight)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PACKAGES_DATA.filter((p) => p.category === 'resort').map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-2xl border border-slate-200 bg-white hover:border-[#0B3553]/40 p-5 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
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
                      className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[#0B3553] hover:bg-[#16486B] active:scale-98 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
                  className="group bg-white rounded-2xl border border-[#E6DBC8] overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
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
          OFFICIAL STAYCATION POLICIES, HOUSE RULES & PAYMENT TERMS
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {STAYCATION_POLICIES_PDF.map((policy) => {
              const IconComp = policy.icon;
              return (
                <div
                  key={policy.num}
                  className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6DBC8] shadow-2xs hover:shadow-md transition-shadow duration-300"
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
                className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E6DBC8] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative"
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
                  className="inline-flex items-center gap-2 bg-[#0B3553] hover:bg-[#16486B] active:scale-95 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all"
                >
                  <MapPin className="w-4 h-4 text-[#F5EFE6]" />
                  Open in Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-[#E6DBC8] shadow-xs bg-[#FAF8F5] relative h-72 sm:h-80 flex flex-col justify-between p-6">
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
                  className="bg-white rounded-2xl border border-[#E6DBC8] overflow-hidden transition-all duration-200"
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
                      <ChevronUp className="w-5 h-5 text-[#1D5B8C] shrink-0 transition-transform" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-step-enter">
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/15">
            {/* COLUMN 1: Brand & Contact Info */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-3.5">
                <img
                  src="/logo.png"
                  alt="The Forts Logo"
                  className="w-12 h-12 rounded-full object-contain shadow-sm bg-[#FAF8F5]"
                />
                <div className="text-left">
                  <span className="block text-2xl font-brand-serif font-bold text-white leading-none">
                    The Forts Riverside
                  </span>
                  <span className="block text-[10px] font-bold tracking-[0.28em] uppercase text-[#E6DBC8] mt-1">
                    Private Resort
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-sm leading-relaxed text-center md:text-left">
                A peaceful riverside haven designed for relaxation, fun, and unforgettable memories.
              </p>

              <div className="space-y-3 text-sm">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=The+Forts+Riverside+Bustos+Bulacan"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center md:justify-start gap-2.5 hover:text-white transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#C8AD7F]" />
                  Bustos, Bulacan
                </a>
                <a
                  href="tel:+639605038082"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center md:justify-start gap-2.5 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#C8AD7F]" />
                  +63 960 503 8082
                </a>
                <a
                  href="https://www.facebook.com/theforts.ph/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center md:justify-start gap-2.5 hover:text-white transition-colors"
                >
                  <FacebookIcon className="w-4 h-4 text-[#C8AD7F]" />
                  facebook.com/theforts.ph
                </a>
                <a
                  href="https://instagram.com/theforts.ph"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center md:justify-start gap-2.5 hover:text-white transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 text-[#C8AD7F]" />
                  @theforts.ph
                </a>
              </div>
            </div>

            {/* COLUMN 2: Quick Links */}
            <div className="md:col-span-3 space-y-2 text-sm text-center md:text-left">
              <h4 className="font-bold text-[#F5EFE6] uppercase tracking-wider text-xs mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#booking-calendar" className="hover:text-white transition-colors">
                    Rate Calculator
                  </a>
                </li>
                <li>
                  <a href="#rooms" className="hover:text-white transition-colors">
                    Rooms
                  </a>
                </li>
                <li>
                  <a href="#packages" className="hover:text-white transition-colors">
                    Packages & Rates
                  </a>
                </li>
                <li>
                  <a href="#amenities" className="hover:text-white transition-colors">
                    Amenities
                  </a>
                </li>
                <li>
                  <a href="#rules" className="hover:text-white transition-colors">
                    Policies & Rules
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: Direct On-Site Booking CTA */}
            <div className="md:col-span-4 space-y-3 text-sm text-center md:text-left flex flex-col items-center md:items-start">
              <h4 className="font-bold text-[#F5EFE6] uppercase tracking-wider text-xs mb-1">
                Direct Online Booking
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
                Ready to lock in your dates or inquire about an event? Use our 3-Step calculator to
                reserve directly on our website:
              </p>
              <a
                href="#booking-calendar"
                className="inline-flex items-center justify-center gap-2 bg-[#F5EFE6] hover:bg-white active:scale-95 text-[#0B3553] font-bold text-xs px-4 py-3 rounded-xl transition-all mt-2"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Book or Inquire Now
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 The Forts Riverside Private Resort | theforts.pages.dev</p>
            <p className="flex items-center gap-1">
              Designed with <Heart className="w-3.5 h-3.5 text-[#C8AD7F] fill-current" /> for
              unforgettable riverside memories
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E6DBC8] animate-modal-pop"
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
                className="absolute top-4 right-4 p-2 rounded-full bg-[#0B3553]/90 text-white hover:bg-[#0B3553] active:scale-95 transition-all cursor-pointer"
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
          DIRECT ON-SITE RESERVATION FORM MODAL
      ========================================== */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E6DBC8] shadow-2xl overflow-hidden animate-modal-pop">
            <div className="p-5 sm:p-6 bg-[#0B3553] text-white border-b-2 border-[#C8AD7F] flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#E6DBC8] font-bold">
                  {selectedPackage.isEvent
                    ? 'Event Quotation Inquiry'
                    : 'Direct Online Reservation'}
                </span>
                <h3 className="text-xl font-brand-serif font-bold mt-0.5">
                  {selectedPackage.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBookingModalOpen(false);
                  setBookingSubmitResult(null);
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSubmitResult?.status === 'success' ? (
              <div className="p-6 sm:p-8 text-center space-y-4 animate-step-enter">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-success-pop">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="inline-block text-xs font-extrabold uppercase tracking-widest bg-[#F5EFE6] text-[#0B3553] border border-[#E6DBC8] px-3.5 py-1 rounded-full">
                  Ref ID: {bookingSubmitResult.bookingId}
                </span>

                {bookingSubmitResult.isEvent ? (
                  /* --- EVENT INQUIRY CONFIRMATION VIEW (NO PAYMENT BOX) --- */
                  <>
                    <h4 className="text-2xl font-brand-serif font-bold text-[#0B3553]">
                      Event Inquiry Recorded!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      We have logged your event details in our system. Because event packages are
                      customized to your guest count and schedule, please coordinate directly with
                      the resort owner for your price quotation.
                    </p>

                    <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E6DBC8] text-left text-xs sm:text-sm shadow-inner space-y-3">
                      <p className="font-bold text-[#0B3553] border-b border-[#E6DBC8] pb-2">
                        How to Coordinate Your Event Quotation
                      </p>

                      <div className="space-y-2.5 text-slate-600">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Phone className="w-4 h-4 text-[#0B3553] shrink-0" />
                          <span>
                            <strong>Call / Text / Viber:</strong>
                          </span>
                          <span className="font-mono font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                            0960 503 8082
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyPayment('09605038082', 'phone')}
                            className="ml-auto p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 hover:bg-[#F5EFE6] hover:text-[#0B3553] active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                            title="Copy Mobile Number"
                          >
                            {copiedPayment === 'phone' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <FacebookIcon className="w-4 h-4 text-[#0B3553] shrink-0" />
                          <span>
                            <strong>Facebook Messenger:</strong>
                          </span>
                          <a
                            href="https://www.facebook.com/theforts.ph/"
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-[#1D5B8C] underline hover:text-[#0B3553]"
                          >
                            facebook.com/theforts.ph
                          </a>
                        </div>
                      </div>

                      <div className="mt-2 text-[11px] sm:text-xs text-[#0B3553] font-semibold bg-[#F5EFE6] p-3 rounded-lg border border-[#E6DBC8] leading-relaxed">
                        💡 <strong>Next Step:</strong> Send us a message with your Reference ID (
                        <strong>{bookingSubmitResult.bookingId}</strong>) so we can discuss your
                        event requirements, finalize your rate, and manually update your booking
                        status!
                      </div>
                    </div>
                  </>
                ) : (
                  /* --- STANDARD STAYCATION / RESORT PAYMENT VIEW --- */
                  <>
                    <h4 className="text-2xl font-brand-serif font-bold text-[#0B3553]">
                      Dates Reserved for 24 Hours!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Your dates are now crossed out on our calendar. To officially lock in your
                      booking, please settle the{' '}
                      <strong>
                        50% Down Payment (
                        {formatPHP(
                          bookingSubmitResult.downPayment50 ?? priceBreakdown.downPayment50
                        )}
                        )
                      </strong>{' '}
                      within 24 hours.
                    </p>

                    <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E6DBC8] text-left text-xs sm:text-sm shadow-inner">
                      <p className="font-bold text-[#0B3553] border-b border-[#E6DBC8] pb-2 mb-3">
                        Payment Details
                      </p>

                      <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                        <img
                          src="/gcash-qr.png"
                          alt="GCash QR Code"
                          className="w-32 h-32 object-cover rounded-lg shadow-sm border border-slate-200 bg-white p-1"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />

                        <div className="space-y-3 text-slate-600 w-full">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="m-0 shrink-0">
                              <strong>GCash:</strong>
                            </p>
                            <span className="font-mono font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                              0960 503 8082
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              (Therese Fortin)
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyPayment('09605038082', 'gcash')}
                              className="ml-auto sm:ml-1 p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 hover:bg-[#F5EFE6] hover:text-[#0B3553] active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                              title="Copy GCash Number"
                            >
                              {copiedPayment === 'gcash' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="m-0 shrink-0">
                              <strong>BDO Bank:</strong>
                            </p>
                            <span className="font-mono font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                              Coming Soon
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              (...)
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyPayment('001234567890', 'bdo')}
                              className="ml-auto sm:ml-1 p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 hover:bg-[#F5EFE6] hover:text-[#0B3553] active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                              title="Copy Account Number"
                            >
                              {copiedPayment === 'bdo' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="mt-2 text-[10px] sm:text-xs text-rose-700 font-bold bg-rose-50 p-2 rounded border border-rose-100 leading-relaxed">
                            ⚠️ Please include your Reference ID (
                            <strong>{bookingSubmitResult.bookingId}</strong>) in your transfer
                            notes!
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-600 pt-4 mt-4 border-t border-[#E6DBC8] leading-relaxed">
                        Once paid, send your screenshot & Ref ID to our Facebook page (
                        <strong>facebook.com/theforts.ph</strong>).
                      </p>
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setBookingModalOpen(false);
                    setBookingSubmitResult(null);
                  }}
                  className="w-full py-3.5 mt-2 rounded-xl bg-[#0B3553] hover:bg-[#16486B] active:scale-98 text-white font-bold text-sm cursor-pointer shadow-md transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitDirectBooking}
                className="p-5 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto"
              >
                {bookingSubmitResult?.status === 'error' && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-step-enter">
                    {bookingSubmitResult.message}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0B3553] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B3553] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0B3553] mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={guestContact}
                      onChange={(e) => setGuestContact(e.target.value)}
                      placeholder="0917 XXX XXXX"
                      className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B3553] transition-colors"
                    />
                  </div>
                </div>

                <div
                  className={`grid grid-cols-1 ${
                    selectedPackage.isEvent ? '' : 'sm:grid-cols-2'
                  } gap-3`}
                >
                  <div>
                    <label className="block text-xs font-bold text-[#0B3553] mb-1">
                      Email Address (For Confirmation) *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="juan@email.com"
                      className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B3553] transition-colors"
                    />
                  </div>
                  {!selectedPackage.isEvent && (
                    <div>
                      <label className="block text-xs font-bold text-[#0B3553] mb-1">
                        GCash / Bank Ref # (If paid)
                      </label>
                      <input
                        type="text"
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                        placeholder="Optional (or pay within 24h)"
                        className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B3553] transition-colors"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B3553] mb-1">
                    {selectedPackage.isEvent
                      ? 'Event Details / Requested Add-Ons (Optional)'
                      : 'Requested Add-Ons / Special Notes (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={guestNotes}
                    onChange={(e) => setGuestNotes(e.target.value)}
                    placeholder={
                      selectedPackage.isEvent
                        ? 'e.g., Catering setup, floaters, ice box, charcoal...'
                        : 'e.g., Pool floater, ice box, charcoal, arrival time (or acquire on booking day)...'
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B3553] transition-colors"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6DBC8] text-xs sm:text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selected Dates:</span>
                    <span className="font-bold text-[#0B3553] text-right">
                      {selectedPackage.isOvernightMultiDay
                        ? `${formatReadableDate(checkInDateKey)} (${
                            selectedPackage.checkInTime || '2:00 PM'
                          }) → ${formatReadableDate(checkOutDateKey)} (${
                            selectedPackage.checkOutTime || '12:00 NN'
                          })`
                        : `${formatReadableDate(checkInDateKey)} (${
                            selectedPackage.isEvent
                              ? eventTimePreference
                              : selectedPackage.timeLabel
                          })`}
                    </span>
                  </div>
                  {selectedPackage.isEvent && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Preferred Schedule:</span>
                      <span className="font-semibold text-slate-800 text-right">
                        {eventTimePreference}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      {selectedPackage.isEvent ? 'Estimated Guests:' : 'Registered Guests:'}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedPackage.isEvent
                        ? `${guestCount} Pax`
                        : `${guestCount} Pax (${priceBreakdown.excessGuests} extra)`}
                    </span>
                  </div>
                  {!selectedPackage.isEvent ? (
                    <>
                      <div className="pt-2 border-t border-[#E6DBC8] flex justify-between items-baseline">
                        <span className="font-bold text-[#0B3553]">Total Computed Rate:</span>
                        <span className="text-xl font-brand-serif font-extrabold text-[#0B3553]">
                          {formatPHP(priceBreakdown.total)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-[#8A6D3B] font-bold">
                        <span>Required 50% Down Payment (24-Hr Hold):</span>
                        <span>{formatPHP(priceBreakdown.downPayment50)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="pt-2 border-t border-[#E6DBC8] flex justify-between items-center text-xs text-[#8A6D3B] font-bold">
                      <span>Rate Status:</span>
                      <span>Custom Quotation (To be discussed with Owner)</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#0B3553] hover:bg-[#16486B] active:scale-98 disabled:bg-slate-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmittingBooking
                    ? 'Submitting...'
                    : selectedPackage.isEvent
                    ? 'Submit Event Inquiry'
                    : 'Submit Reservation & Hold Dates'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <FortsAIChatbot />
    </div>
  );
}