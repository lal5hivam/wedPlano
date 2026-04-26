# Wedplano API Documentation

Complete REST API reference for Wedplano backend.

Base URL: `http://localhost:5000/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get the token from login/register responses and store it in localStorage.

---

## Auth Endpoints

### Register User (Customer)

Create a new customer account.

**Endpoint:** `POST /auth/register-user`

**Auth Required:** No

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "uuid-here",
    "role": "user",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "profileImage": "",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Register Partner (Venue Owner)

Create a new venue partner account.

**Endpoint:** `POST /auth/register-partner`

**Auth Required:** No

**Request Body:**
```json
{
  "name": "Venue Owner",
  "email": "owner@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "uuid-here",
    "role": "partner",
    "name": "Venue Owner",
    "email": "owner@example.com",
    "phone": "9876543210",
    "profileImage": "",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Login

Authenticate user or partner.

**Endpoint:** `POST /auth/login`

**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "uuid-here",
    "role": "user",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Get Current User

Get authenticated user details.

**Endpoint:** `GET /auth/me`

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "uid": "uuid-here",
    "role": "user",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Logout

Logout user (client-side token removal).

**Endpoint:** `POST /auth/logout`

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Venue Endpoints

### Create Venue

Create a new venue listing (partner only).

**Endpoint:** `POST /venues`

**Auth Required:** Yes (partner role)

**Request Body:**
```json
{
  "title": "Grand Banquet Hall",
  "description": "Luxurious banquet hall for weddings",
  "venueType": "banquet",
  "capacity": 500,
  "city": "Mumbai",
  "address": "123 Main Street, Andheri",
  "basePrice": 50000,
  "perGuestPrice": 500,
  "amenities": ["Parking", "AC", "WiFi", "Stage"],
  "policies": "Advance booking required. Cancellation 30 days prior.",
  "contactInfo": {
    "phone": "9876543210",
    "email": "contact@venue.com"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "venue": {
    "venueId": "uuid-here",
    "ownerId": "owner-uuid",
    "title": "Grand Banquet Hall",
    "description": "Luxurious banquet hall for weddings",
    "venueType": "banquet",
    "capacity": 500,
    "city": "Mumbai",
    "address": "123 Main Street, Andheri",
    "basePrice": 50000,
    "perGuestPrice": 500,
    "amenities": ["Parking", "AC", "WiFi", "Stage"],
    "media": [],
    "policies": "Advance booking required. Cancellation 30 days prior.",
    "contactInfo": { "phone": "9876543210", "email": "contact@venue.com" },
    "status": "active",
    "rating": 0,
    "reviewCount": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get All Venues

Get all active venues with optional filters.

**Endpoint:** `GET /venues`

**Auth Required:** No

**Query Parameters:**
- `city` (string): Filter by city
- `venueType` (string): Filter by type (banquet, garden, resort, hotel)
- `minPrice` (number): Minimum base price
- `maxPrice` (number): Maximum base price
- `capacity` (number): Minimum capacity
- `search` (string): Search in title and city
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)

**Example:** `GET /venues?city=Mumbai&minPrice=30000&maxPrice=100000&page=1&limit=12`

**Response:** `200 OK`
```json
{
  "success": true,
  "venues": [
    {
      "venueId": "uuid-1",
      "title": "Grand Banquet Hall",
      "city": "Mumbai",
      "basePrice": 50000,
      "capacity": 500,
      "venueType": "banquet",
      "media": [{ "url": "https://...", "resourceType": "image" }],
      "rating": 4.5
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 12
}
```

---

### Get Venue by ID

Get detailed venue information.

**Endpoint:** `GET /venues/:id`

**Auth Required:** No

**Response:** `200 OK`
```json
{
  "success": true,
  "venue": {
    "venueId": "uuid-here",
    "ownerId": "owner-uuid",
    "title": "Grand Banquet Hall",
    "description": "Luxurious banquet hall for weddings",
    "venueType": "banquet",
    "capacity": 500,
    "city": "Mumbai",
    "address": "123 Main Street, Andheri",
    "basePrice": 50000,
    "perGuestPrice": 500,
    "amenities": ["Parking", "AC", "WiFi", "Stage"],
    "media": [
      { "url": "https://...", "publicId": "...", "resourceType": "image" }
    ],
    "policies": "Advance booking required.",
    "contactInfo": { "phone": "9876543210" },
    "status": "active",
    "rating": 4.5,
    "reviewCount": 10,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update Venue

Update venue details (partner only, own venues).

**Endpoint:** `PUT /venues/:id`

**Auth Required:** Yes (partner role, must be owner)

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "basePrice": 60000,
  "amenities": ["Parking", "AC", "WiFi", "Stage", "Valet"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "venue": { /* updated venue object */ }
}
```

---

### Delete Venue

Soft delete a venue (partner only, own venues).

**Endpoint:** `DELETE /venues/:id`

**Auth Required:** Yes (partner role, must be owner)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Venue deleted"
}
```

---

### Get Partner's Venues

Get all venues owned by authenticated partner.

**Endpoint:** `GET /venues/partner/my-venues`

**Auth Required:** Yes (partner role)

**Response:** `200 OK`
```json
{
  "success": true,
  "venues": [
    { /* venue object */ },
    { /* venue object */ }
  ]
}
```

---

## Service Pricing Endpoints

### Add Service to Venue

Add a service/pricing item to a venue.

**Endpoint:** `POST /venues/:id/services`

**Auth Required:** Yes (partner role, must be owner)

**Request Body:**
```json
{
  "serviceName": "Catering (Veg)",
  "unitType": "plate",
  "unitPrice": 500,
  "description": "Vegetarian catering per plate",
  "isRequired": false
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "service": {
    "serviceId": "uuid-here",
    "venueId": "venue-uuid",
    "serviceName": "Catering (Veg)",
    "unitType": "plate",
    "unitPrice": 500,
    "description": "Vegetarian catering per plate",
    "isRequired": false,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get Venue Services

Get all active services for a venue.

**Endpoint:** `GET /venues/:id/services`

**Auth Required:** No

**Response:** `200 OK`
```json
{
  "success": true,
  "services": [
    {
      "serviceId": "uuid-1",
      "venueId": "venue-uuid",
      "serviceName": "Catering (Veg)",
      "unitType": "plate",
      "unitPrice": 500,
      "description": "Vegetarian catering per plate",
      "isRequired": false,
      "isActive": true
    },
    {
      "serviceId": "uuid-2",
      "serviceName": "Decoration",
      "unitType": "package",
      "unitPrice": 25000,
      "isActive": true
    }
  ]
}
```

---

### Update Service

Update a service item.

**Endpoint:** `PUT /services/:serviceId`

**Auth Required:** Yes (partner role, must be venue owner)

**Request Body:**
```json
{
  "unitPrice": 550,
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "service": { /* updated service object */ }
}
```

---

### Delete Service

Soft delete a service item.

**Endpoint:** `DELETE /services/:serviceId`

**Auth Required:** Yes (partner role, must be venue owner)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Service removed"
}
```

---

## Availability Endpoints

### Set Availability

Bulk set available dates for a venue.

**Endpoint:** `POST /venues/:id/availability`

**Auth Required:** Yes (partner role, must be owner)

**Request Body:**
```json
{
  "dates": ["2024-12-25", "2024-12-26", "2024-12-31", "2025-01-01"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "4 dates updated"
}
```

---

### Get Venue Availability

Get all availability records for a venue.

**Endpoint:** `GET /venues/:id/availability`

**Auth Required:** No

**Response:** `200 OK`
```json
{
  "success": true,
  "availability": [
    {
      "venueId": "venue-uuid",
      "date": "2024-12-25",
      "isAvailable": true,
      "isBlocked": false,
      "bookingId": null,
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "venueId": "venue-uuid",
      "date": "2024-12-26",
      "isAvailable": false,
      "isBlocked": true,
      "bookingId": "booking-uuid",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

---

### Update Date Availability

Update a specific date's availability.

**Endpoint:** `PUT /venues/:id/availability/:date`

**Auth Required:** Yes (partner role, must be owner)

**Request Body:**
```json
{
  "isAvailable": false,
  "isBlocked": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Availability updated"
}
```

---

### Remove Date

Remove a date from availability.

**Endpoint:** `DELETE /venues/:id/availability/:date`

**Auth Required:** Yes (partner role, must be owner)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Date removed"
}
```

---

## Booking Endpoints

### Preview Billing

Calculate billing before submitting booking request.

**Endpoint:** `POST /bookings/preview-billing`

**Auth Required:** Yes

**Request Body:**
```json
{
  "venueId": "venue-uuid",
  "guestCount": 200,
  "selectedServices": [
    { "serviceId": "service-uuid-1", "quantity": 200 },
    { "serviceId": "service-uuid-2", "quantity": 1 }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "billing": {
    "breakdown": [
      { "label": "Base Venue Charge", "amount": 50000, "type": "base" },
      { "label": "Per Guest Charge (200 guests × ₹500)", "amount": 100000, "type": "perGuest" },
      { "label": "Catering (Veg) (200 plate × ₹500)", "amount": 100000, "type": "service" },
      { "label": "Decoration (1 package × ₹25000)", "amount": 25000, "type": "service" },
      { "label": "Platform Fee (5%)", "amount": 13750, "type": "fee" },
      { "label": "GST (18%)", "amount": 52275, "type": "tax" }
    ],
    "subtotal": 275000,
    "platformFee": 13750,
    "taxAmount": 52275,
    "grandTotal": 341025
  }
}
```

---

### Create Booking Request

Submit a booking request (user only).

**Endpoint:** `POST /bookings/request`

**Auth Required:** Yes (user role)

**Request Body:**
```json
{
  "venueId": "venue-uuid",
  "requestedDate": "2024-12-25",
  "eventType": "wedding",
  "guestCount": 200,
  "foodType": "veg",
  "selectedServices": [
    { "serviceId": "service-uuid-1", "quantity": 200 },
    { "serviceId": "service-uuid-2", "quantity": 1 }
  ],
  "message": "Looking forward to booking your venue!"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "bookingRequest": {
    "requestId": "uuid-here",
    "userId": "user-uuid",
    "venueId": "venue-uuid",
    "ownerId": "owner-uuid",
    "requestedDate": "2024-12-25",
    "eventType": "wedding",
    "guestCount": 200,
    "foodType": "veg",
    "selectedServices": [
      { "serviceId": "service-uuid-1", "quantity": 200 },
      { "serviceId": "service-uuid-2", "quantity": 1 }
    ],
    "pricingBreakdown": [ /* billing breakdown */ ],
    "estimatedTotal": 341025,
    "message": "Looking forward to booking your venue!",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get User Bookings

Get all booking requests for authenticated user.

**Endpoint:** `GET /bookings/user`

**Auth Required:** Yes (user role)

**Response:** `200 OK`
```json
{
  "success": true,
  "bookings": [
    {
      "requestId": "uuid-1",
      "venueId": "venue-uuid",
      "requestedDate": "2024-12-25",
      "guestCount": 200,
      "estimatedTotal": 341025,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Partner Bookings

Get all booking requests for authenticated partner's venues.

**Endpoint:** `GET /bookings/partner`

**Auth Required:** Yes (partner role)

**Response:** `200 OK`
```json
{
  "success": true,
  "bookings": [
    {
      "requestId": "uuid-1",
      "userId": "user-uuid",
      "venueId": "venue-uuid",
      "requestedDate": "2024-12-25",
      "guestCount": 200,
      "foodType": "veg",
      "estimatedTotal": 341025,
      "message": "Looking forward to booking!",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Accept Booking

Accept a booking request (partner only).

**Endpoint:** `PATCH /bookings/:id/accept`

**Auth Required:** Yes (partner role, must be venue owner)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Booking accepted"
}
```

**Note:** This creates a confirmed booking and marks the date as unavailable.

---

### Reject Booking

Reject a booking request (partner only).

**Endpoint:** `PATCH /bookings/:id/reject`

**Auth Required:** Yes (partner role, must be venue owner)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Booking rejected"
}
```

---

### Cancel Booking

Cancel a booking (user or partner).

**Endpoint:** `PATCH /bookings/:id/cancel`

**Auth Required:** Yes (must be user who made request or venue owner)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Booking cancelled"
}
```

**Note:** If booking was accepted, this frees up the date.

---

## Upload Endpoints

### Upload Venue Media

Upload images/videos for a venue.

**Endpoint:** `POST /uploads/venue-media`

**Auth Required:** Yes (partner role, must be venue owner)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `venueId` (string): Venue ID
- `files` (file[]): Array of image/video files (max 10)

**Response:** `201 Created`
```json
{
  "success": true,
  "media": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "wedplano/venues/abc123",
      "resourceType": "image",
      "uploadedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Delete Venue Media

Delete a media item from venue.

**Endpoint:** `DELETE /uploads/venue-media/:publicId`

**Auth Required:** Yes (partner role, must be venue owner)

**Request Body:**
```json
{
  "venueId": "venue-uuid"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Media deleted"
}
```

---

## Notification Endpoints

### Get Notifications

Get all notifications for authenticated user.

**Endpoint:** `GET /notifications`

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "success": true,
  "notifications": [
    {
      "notificationId": "uuid-1",
      "userId": "user-uuid",
      "type": "booking_accepted",
      "title": "Booking Accepted",
      "message": "Your booking request for 2024-12-25 has been accepted.",
      "isRead": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Mark Notification as Read

Mark a single notification as read.

**Endpoint:** `PATCH /notifications/:id/read`

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Marked as read"
}
```

---

### Mark All Notifications as Read

Mark all user's notifications as read.

**Endpoint:** `PATCH /notifications/read-all`

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Dashboard Endpoints

### Get Partner Dashboard

Get analytics and stats for partner.

**Endpoint:** `GET /dashboard/partner`

**Auth Required:** Yes (partner role)

**Response:** `200 OK`
```json
{
  "success": true,
  "stats": {
    "totalVenues": 3,
    "totalRequests": 15,
    "pendingRequests": 5,
    "acceptedRequests": 8,
    "rejectedRequests": 2,
    "totalRevenue": 2500000
  },
  "venues": [ /* venue objects */ ],
  "recentRequests": [ /* recent booking requests */ ]
}
```

---

### Get User Dashboard

Get stats for user.

**Endpoint:** `GET /dashboard/user`

**Auth Required:** Yes (user role)

**Response:** `200 OK`
```json
{
  "success": true,
  "stats": {
    "totalRequests": 5,
    "pendingRequests": 2,
    "acceptedRequests": 3
  },
  "recentRequests": [ /* recent booking requests */ ]
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Date already booked"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Valid email required" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

- Auth endpoints: 20 requests per 15 minutes
- Other endpoints: 200 requests per 15 minutes

Exceeding limits returns:
```json
{
  "success": false,
  "message": "Too many requests"
}
```

---

## Testing with Postman

1. Import Swagger spec from http://localhost:5000/api/docs
2. Create environment with `baseUrl` = `http://localhost:5000/api`
3. After login, save token to environment variable
4. Use `{{token}}` in Authorization header

---

## Swagger UI

Interactive API documentation available at:
http://localhost:5000/api/docs

Test all endpoints directly from the browser!
