import { DEFAULT_PH_HOLIDAYS } from '../data/bookingData.js';

export const formatPHP = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return `₱${amount.toLocaleString('en-PH')}`;
};

export const toDateKey = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

export const parseDateKey = (dateKey) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDaysToKey = (dateKey, daysToAdd) => {
  const d = parseDateKey(dateKey);
  d.setDate(d.getDate() + daysToAdd);
  return toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
};

export const diffDaysBetweenKeys = (startKey, endKey) => {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
};

export const formatReadableDate = (dateKey) => {
  if (!dateKey) return '';
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatSlashDate = (dateKey) => {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  return `${m}/${d}/${y}`;
};

export const getDayRateInfo = (dateKey, pkg, customHolidays) => {
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

export const buildMonthDaysMondayFirst = (year, month, selectedPackage, customHolidays, today) => {
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
