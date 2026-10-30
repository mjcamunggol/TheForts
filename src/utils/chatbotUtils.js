export function getLocalFallbackAnswer(userText) {
  const q = userText.toLowerCase();

  if (
    q.includes('staycation') ||
    q.includes('room') ||
    q.includes('vista') ||
    q.includes('cozy') ||
    q.includes('hideout') ||
    q.includes('loft')
  ) {
    return `Here are our 22-Hour Room-Only Staycation rates (2:00 PM – 12:00 NN):\n• THE COZY DEN (2–4 pax): ₱2,000 Weekday | ₱2,500 Wknd/Hol\n• THE VISTA (2–4 pax): ₱2,800 Weekday | ₱3,300 Wknd/Hol\n• THE HIDEOUT (4–6 pax): ₱3,000 Weekday | ₱3,500 Wknd/Hol\n• THE RIVER LOFT (10–15 pax): ₱5,000 Weekday | ₱6,000 Wknd/Hol\n\nAll staycations include free Silog breakfast per registered guest, pool access, kitchen & free LPG use, Wi-Fi, parking, and karaoke until 10 PM!`;
  }
  if (
    q.includes('inclusion') ||
    q.includes('include') ||
    q.includes('breakfast') ||
    q.includes('gas') ||
    q.includes('lpg')
  ) {
    return `Room-Only Staycations include:\n• 22-hour A/C room stay (2PM–12NN)\n• Free Silog breakfast for each registered guest\n• Swimming pool & riverside access\n• Kitchen access + FREE LPG cooking use\n• Wi-Fi, gated parking & karaoke (until 10 PM).\n\nFor Exclusive Resort Bookings, LPG use is an optional +₱400/night add-on.`;
  }
  if (
    q.includes('exclusive') ||
    q.includes('day tour') ||
    q.includes('night tour') ||
    q.includes('whole resort') ||
    q.includes('package')
  ) {
    return `Our Exclusive Resort Packages (Mon–Thu / Fri–Sun & Hol, max 30 guests):\n• Day Tour (8AM–5PM, w/ 1 room): ₱4,500 / ₱5,000 (Oct–Nov Mon–Thu Promo: ₱3,999 w/o room)\n• Night Tour Regular (8PM–5AM, w/ 1 Family Room): ₱7,000 / ₱7,500\n• Short Stay Night Promo (7PM–12MN, no room): ₱4,000 / ₱4,500\n• 22-Hr Stay (4–8 pax, Small Barkada + Family Room): ₱7,999 / ₱8,999\n• 22-Hr Stay (9–15 pax, Barkada Room): ₱10,999 / ₱11,999\n• 22-Hr Stay (16–20 pax, Barkada + Family Room): ₱13,999 / ₱14,999\n• Whole Resort (21–30 pax, all 4 rooms): ₱15,999 / ₱16,499`;
  }
  if (
    q.includes('extra') ||
    q.includes('excess') ||
    q.includes('mattress') ||
    q.includes('add-on') ||
    q.includes('floater') ||
    q.includes('ice') ||
    q.includes('charcoal')
  ) {
    return `Official Add-On & Extra Guest Rates:\n• Staycation Extra Guest: ₱300/person per stay (with pool & Silog breakfast)\n• Extra Single Mattress: ₱150/night (request in advance)\n• Extra Double Mattress: ₱200/night (request in advance)\n• LPG / Cooking Fee (Resort): ₱400/night\n• Pool Floater: ₱75/stay (+₱100 refundable deposit)\n• Ice Box (6 packs): ₱210 | Ice Pack (5kg): ₱35 | Charcoal (Uling): ₱20\n\nAll add-ons except mattresses can be requested in your notes or acquired on the day of your booking!`;
  }
  if (q.includes('event') || q.includes('venue') || q.includes('birthday') || q.includes('reunion')) {
    return `Event Venue Rentals (31–100 pax) are available for:\n• 6 Hours (9:00 AM – 3:00 PM)\n• 8 Hours (9:00 AM – 5:00 PM)\n• 12 Hours (8:00 AM – 8:00 PM)\n\nIncludes Pavilion, designated pool area, and 1 changing/rest room (setup & cleanup included; no overnight sleeping). Select "Events Booking" in our calculator to request a custom quotation!`;
  }
  if (
    q.includes('pay') ||
    q.includes('down') ||
    q.includes('cancel') ||
    q.includes('resched') ||
    q.includes('rule') ||
    q.includes('policy')
  ) {
    return `Booking & House Policies:\n• 50% down payment is required to lock in your dates; 50% balance is paid upon arrival before facility use.\n• Down payments are non-refundable for cancellations/no-shows.\n• 1 reschedule is allowed if requested at least 7 days before check-in.\n• Karaoke is until 10:00 PM, no smoking inside rooms, and no corkage fee on food!`;
  }
  if (q.includes('book') || q.includes('reserve') || q.includes('location') || q.includes('where')) {
    return `We are located beside the scenic Angat River near Beltran Street in Bustos, Bulacan (search "The Forts Riverside Private Resort" on Google Maps/Waze).\n\nTo book or request an event quote, select your dates in our 3-Step Rate Calculator on this page and click "Reserve Selected Dates"!`;
  }

  return `Hi! I can help you with Staycation Room rates (₱2,000–₱6,000 with free Silog breakfast & LPG), Exclusive Resort Packages (₱3,999–₱16,499), Event Venue Rentals (6, 8, or 12 hrs), add-ons, or booking policies. What would you like to know?`;
}
