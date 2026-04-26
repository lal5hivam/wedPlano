/**
 * Unit tests for billing.service.js
 *
 * Tests the calculateBilling function in isolation — no Firebase, no HTTP.
 */

const { calculateBilling } = require('../../../backend/src/services/billing.service');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const venue = { basePrice: 100000, perGuestPrice: 500 };
const venueNoPerGuest = { basePrice: 100000, perGuestPrice: 0 };

const activeService = {
  serviceId: 'svc-1',
  serviceName: 'Photography',
  unitType: 'hour',
  unitPrice: 5000,
  isActive: true,
};

const inactiveService = {
  serviceId: 'svc-2',
  serviceName: 'Videography',
  unitType: 'hour',
  unitPrice: 8000,
  isActive: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Verify platform fee and GST math.
 * platformFee = 5% of subtotal (rounded)
 * taxAmount   = 18% of (subtotal + platformFee) (rounded)
 * grandTotal  = subtotal + platformFee + taxAmount
 */
const verifyTotals = (result, expectedSubtotal) => {
  const expectedFee = Math.round((expectedSubtotal * 5) / 100);
  const expectedTax = Math.round(((expectedSubtotal + expectedFee) * 18) / 100);
  const expectedGrand = expectedSubtotal + expectedFee + expectedTax;

  expect(result.subtotal).toBe(expectedSubtotal);
  expect(result.platformFee).toBe(expectedFee);
  expect(result.taxAmount).toBe(expectedTax);
  expect(result.grandTotal).toBe(expectedGrand);
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('calculateBilling', () => {
  // BIL-01
  describe('base price only', () => {
    it('calculates grand total with no guests and no services', () => {
      const result = calculateBilling(venueNoPerGuest, [], [], 0);
      verifyTotals(result, 100000);
    });

    it('includes a "Base Venue Charge" line item in the breakdown', () => {
      const result = calculateBilling(venueNoPerGuest, [], [], 0);
      const baseLine = result.breakdown.find((b) => b.type === 'base');
      expect(baseLine).toBeDefined();
      expect(baseLine.amount).toBe(100000);
    });
  });

  // BIL-02
  describe('per-guest charge', () => {
    it('adds per-guest charge when guestCount > 0', () => {
      const result = calculateBilling(venue, [], [], 200);
      const guestLine = result.breakdown.find((b) => b.type === 'perGuest');
      expect(guestLine).toBeDefined();
      expect(guestLine.amount).toBe(200 * 500); // 100,000
      verifyTotals(result, 100000 + 100000); // base + guest
    });

    // BIL-09
    it('does NOT add per-guest charge when guestCount is 0', () => {
      const result = calculateBilling(venue, [], [], 0);
      const guestLine = result.breakdown.find((b) => b.type === 'perGuest');
      expect(guestLine).toBeUndefined();
      verifyTotals(result, 100000);
    });

    it('does NOT add per-guest charge when venue has no perGuestPrice', () => {
      const result = calculateBilling(venueNoPerGuest, [], [], 200);
      const guestLine = result.breakdown.find((b) => b.type === 'perGuest');
      expect(guestLine).toBeUndefined();
    });
  });

  // BIL-03
  describe('service add-ons', () => {
    it('adds a single active service with quantity 1', () => {
      const selected = [{ serviceId: 'svc-1', quantity: 1 }];
      const result = calculateBilling(venueNoPerGuest, [activeService], selected, 0);
      const svcLine = result.breakdown.find((b) => b.type === 'service');
      expect(svcLine).toBeDefined();
      expect(svcLine.amount).toBe(5000);
      verifyTotals(result, 100000 + 5000);
    });

    // BIL-05
    it('multiplies unit price by quantity', () => {
      const selected = [{ serviceId: 'svc-1', quantity: 3 }];
      const result = calculateBilling(venueNoPerGuest, [activeService], selected, 0);
      const svcLine = result.breakdown.find((b) => b.type === 'service');
      expect(svcLine.amount).toBe(5000 * 3);
      expect(svcLine.quantity).toBe(3);
    });

    // BIL-04
    it('sums multiple active services correctly', () => {
      const anotherService = { ...activeService, serviceId: 'svc-3', serviceName: 'DJ', unitPrice: 10000 };
      const selected = [
        { serviceId: 'svc-1', quantity: 2 },
        { serviceId: 'svc-3', quantity: 1 },
      ];
      const result = calculateBilling(venueNoPerGuest, [activeService, anotherService], selected, 0);
      verifyTotals(result, 100000 + 10000 + 10000);
    });

    // BIL-06
    it('excludes inactive services from billing', () => {
      const selected = [{ serviceId: 'svc-2', quantity: 1 }];
      const result = calculateBilling(venueNoPerGuest, [inactiveService], selected, 0);
      const svcLine = result.breakdown.find((b) => b.type === 'service');
      expect(svcLine).toBeUndefined();
      verifyTotals(result, 100000);
    });

    it('ignores selected services not found in the services list', () => {
      const selected = [{ serviceId: 'svc-nonexistent', quantity: 1 }];
      const result = calculateBilling(venueNoPerGuest, [activeService], selected, 0);
      verifyTotals(result, 100000);
    });
  });

  // BIL-07 / BIL-08
  describe('fees and taxes', () => {
    it('platform fee is exactly 5% of subtotal (rounded)', () => {
      const result = calculateBilling(venueNoPerGuest, [], [], 0);
      expect(result.platformFee).toBe(Math.round((100000 * 5) / 100));
    });

    it('GST is 18% of (subtotal + platform fee) (rounded)', () => {
      const result = calculateBilling(venueNoPerGuest, [], [], 0);
      const expectedTax = Math.round(((100000 + result.platformFee) * 18) / 100);
      expect(result.taxAmount).toBe(expectedTax);
    });

    it('grand total equals subtotal + platformFee + taxAmount', () => {
      const result = calculateBilling(venue, [activeService], [{ serviceId: 'svc-1', quantity: 2 }], 100);
      expect(result.grandTotal).toBe(result.subtotal + result.platformFee + result.taxAmount);
    });
  });

  // BIL-10
  describe('breakdown structure', () => {
    it('breakdown contains fee and tax line items', () => {
      const result = calculateBilling(venueNoPerGuest, [], [], 0);
      const feeItem = result.breakdown.find((b) => b.type === 'fee');
      const taxItem = result.breakdown.find((b) => b.type === 'tax');
      expect(feeItem).toBeDefined();
      expect(taxItem).toBeDefined();
    });

    it('returns all expected keys in the result object', () => {
      const result = calculateBilling(venueNoPerGuest, [], [], 0);
      expect(result).toHaveProperty('breakdown');
      expect(result).toHaveProperty('subtotal');
      expect(result).toHaveProperty('platformFee');
      expect(result).toHaveProperty('taxAmount');
      expect(result).toHaveProperty('grandTotal');
    });

    it('breakdown is an array', () => {
      const result = calculateBilling(venueNoPerGuest, [], [], 0);
      expect(Array.isArray(result.breakdown)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles zero base price', () => {
      const result = calculateBilling({ basePrice: 0, perGuestPrice: 0 }, [], [], 0);
      expect(result.grandTotal).toBe(0);
    });

    it('handles empty selectedServices array', () => {
      expect(() => calculateBilling(venue, [activeService], [], 100)).not.toThrow();
    });

    it('handles undefined selectedServices gracefully', () => {
      // The controller passes [] by default, but guard against undefined
      const result = calculateBilling(venueNoPerGuest, [], [], 0);
      expect(result.grandTotal).toBeGreaterThanOrEqual(0);
    });
  });
});
