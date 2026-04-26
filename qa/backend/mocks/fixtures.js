/**
 * Shared test fixtures for Wedplano backend tests.
 * These are plain objects — no live Firebase connection needed.
 */

const { v4: uuidv4 } = require('uuid');

// ─── Users ────────────────────────────────────────────────────────────────────

const mockUser = {
  uid: 'user-uid-001',
  role: 'user',
  name: 'Test User',
  email: 'user@test.com',
  phone: '9876543210',
  profileImage: '',
  passwordHash: '$2a$12$hashedpassword',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const mockPartner = {
  uid: 'partner-uid-001',
  role: 'partner',
  name: 'Test Partner',
  email: 'partner@test.com',
  phone: '9876543211',
  profileImage: '',
  passwordHash: '$2a$12$hashedpassword',
  createdAt: '2026-01-01T00:00:00.000Z',
};

// ─── Venues ───────────────────────────────────────────────────────────────────

const mockVenue = {
  venueId: 'venue-id-001',
  ownerId: mockPartner.uid,
  title: 'Royal Banquet Hall',
  description: 'A grand banquet hall for weddings.',
  venueType: 'banquet',
  capacity: 500,
  city: 'Mumbai',
  address: '123 Wedding Street, Mumbai',
  basePrice: 100000,
  perGuestPrice: 500,
  amenities: ['parking', 'catering', 'decoration'],
  media: [],
  policies: 'No outside food allowed.',
  contactInfo: { phone: '9876543210', email: 'venue@test.com' },
  status: 'active',
  rating: 0,
  reviewCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

// ─── Services ─────────────────────────────────────────────────────────────────

const mockService = {
  serviceId: 'service-id-001',
  venueId: mockVenue.venueId,
  serviceName: 'Photography',
  unitType: 'hour',
  unitPrice: 5000,
  description: 'Professional wedding photography',
  isRequired: false,
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

const mockInactiveService = {
  ...mockService,
  serviceId: 'service-id-002',
  serviceName: 'Videography',
  isActive: false,
};

// ─── Availability ─────────────────────────────────────────────────────────────

const mockAvailableDate = {
  venueId: mockVenue.venueId,
  date: '2026-06-15',
  isAvailable: true,
  isBlocked: false,
  bookingId: null,
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const mockUnavailableDate = {
  ...mockAvailableDate,
  date: '2026-06-20',
  isAvailable: false,
  isBlocked: true,
};

// ─── Booking Requests ─────────────────────────────────────────────────────────

const mockBookingRequest = {
  requestId: 'request-id-001',
  userId: mockUser.uid,
  venueId: mockVenue.venueId,
  ownerId: mockPartner.uid,
  requestedDate: '2026-06-15',
  eventType: 'wedding',
  guestCount: 200,
  foodType: 'veg',
  selectedServices: [{ serviceId: mockService.serviceId, quantity: 3 }],
  pricingBreakdown: [],
  estimatedTotal: 200000,
  message: 'Looking forward to booking your venue.',
  status: 'pending',
  createdAt: '2026-01-10T00:00:00.000Z',
  updatedAt: '2026-01-10T00:00:00.000Z',
};

const mockConfirmedBooking = {
  bookingId: 'booking-id-001',
  requestId: mockBookingRequest.requestId,
  userId: mockUser.uid,
  venueId: mockVenue.venueId,
  ownerId: mockPartner.uid,
  bookingDate: '2026-06-15',
  finalPrice: 200000,
  pricingBreakdown: [],
  bookingStatus: 'confirmed',
  createdAt: '2026-01-11T00:00:00.000Z',
};

// ─── Notifications ────────────────────────────────────────────────────────────

const mockNotification = {
  notificationId: 'notif-id-001',
  userId: mockUser.uid,
  type: 'booking_accepted',
  title: 'Booking Confirmed',
  message: 'Your booking at Royal Banquet Hall has been confirmed.',
  isRead: false,
  createdAt: '2026-01-11T00:00:00.000Z',
};

// ─── Request Payloads ─────────────────────────────────────────────────────────

const registerUserPayload = {
  name: 'New User',
  email: `user_${Date.now()}@test.com`,
  password: 'Password123!',
  phone: '9000000001',
};

const registerPartnerPayload = {
  name: 'New Partner',
  email: `partner_${Date.now()}@test.com`,
  password: 'Password123!',
  phone: '9000000002',
};

const createVenuePayload = {
  title: 'Test Venue',
  description: 'A test venue for automated tests.',
  venueType: 'banquet',
  capacity: 300,
  city: 'Delhi',
  address: '456 Test Road, Delhi',
  basePrice: 80000,
  perGuestPrice: 400,
  amenities: ['parking', 'wifi'],
  policies: 'Standard policies apply.',
  contactInfo: { phone: '9000000003', email: 'testvenue@test.com' },
};

const createBookingPayload = {
  venueId: mockVenue.venueId,
  requestedDate: '2026-06-15',
  eventType: 'wedding',
  guestCount: 150,
  foodType: 'veg',
  selectedServices: [],
  message: 'Test booking request.',
};

module.exports = {
  mockUser,
  mockPartner,
  mockVenue,
  mockService,
  mockInactiveService,
  mockAvailableDate,
  mockUnavailableDate,
  mockBookingRequest,
  mockConfirmedBooking,
  mockNotification,
  registerUserPayload,
  registerPartnerPayload,
  createVenuePayload,
  createBookingPayload,
};
