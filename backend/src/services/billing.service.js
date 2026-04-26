/**
 * Billing Calculator Service
 * Computes the estimated total based on host-defined unit prices
 * and user-selected quantities/options.
 */

const PLATFORM_FEE_PERCENT = 5; // 5% platform fee
const TAX_PERCENT = 18; // 18% GST

/**
 * @param {Object} venue - venue document with basePrice
 * @param {Array} services - venueServices documents
 * @param {Array} selectedServices - user selections: [{ serviceId, quantity, option }]
 * @param {number} guestCount
 * @returns {Object} pricingBreakdown + estimatedTotal
 */
const calculateBilling = (venue, services, selectedServices, guestCount) => {
  const breakdown = [];
  let subtotal = 0;

  // Base venue charge
  const baseCharge = Number(venue.basePrice) || 0;
  breakdown.push({ label: 'Base Venue Charge', amount: baseCharge, type: 'base' });
  subtotal += baseCharge;

  // Per-guest charge if venue defines it
  if (venue.perGuestPrice && guestCount) {
    const guestCharge = Number(venue.perGuestPrice) * Number(guestCount);
    breakdown.push({
      label: `Per Guest Charge (${guestCount} guests × ₹${venue.perGuestPrice})`,
      amount: guestCharge,
      type: 'perGuest',
    });
    subtotal += guestCharge;
  }

  // Selected add-on services
  for (const sel of selectedServices) {
    const service = services.find((s) => s.serviceId === sel.serviceId);
    if (!service || !service.isActive) continue;

    const qty = Number(sel.quantity) || 1;
    const unitPrice = Number(service.unitPrice) || 0;
    const lineTotal = unitPrice * qty;

    breakdown.push({
      label: `${service.serviceName} (${qty} ${service.unitType || 'unit'} × ₹${unitPrice})`,
      amount: lineTotal,
      type: 'service',
      serviceId: sel.serviceId,
      quantity: qty,
      unitPrice,
    });
    subtotal += lineTotal;
  }

  const platformFee = Math.round((subtotal * PLATFORM_FEE_PERCENT) / 100);
  const taxAmount = Math.round(((subtotal + platformFee) * TAX_PERCENT) / 100);
  const grandTotal = subtotal + platformFee + taxAmount;

  breakdown.push({ label: `Platform Fee (${PLATFORM_FEE_PERCENT}%)`, amount: platformFee, type: 'fee' });
  breakdown.push({ label: `GST (${TAX_PERCENT}%)`, amount: taxAmount, type: 'tax' });

  return {
    breakdown,
    subtotal,
    platformFee,
    taxAmount,
    grandTotal,
  };
};

module.exports = { calculateBilling };
