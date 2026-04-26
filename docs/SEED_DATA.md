# Wedplano Seed Data

Sample data for testing and demonstration purposes.

## Sample Users

### Customer Account
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "test123",
  "phone": "9876543210",
  "role": "user"
}
```

### Venue Partner Accounts

**Partner 1:**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@venues.com",
  "password": "test123",
  "phone": "9876543211",
  "role": "partner"
}
```

**Partner 2:**
```json
{
  "name": "Anita Desai",
  "email": "anita@venues.com",
  "password": "test123",
  "phone": "9876543212",
  "role": "partner"
}
```

## Sample Venues

### Venue 1: Grand Banquet Hall
```json
{
  "title": "Grand Banquet Hall",
  "description": "Luxurious banquet hall perfect for grand weddings. Features elegant interiors, crystal chandeliers, and a spacious dance floor. Can accommodate up to 500 guests comfortably.",
  "venueType": "banquet",
  "capacity": 500,
  "city": "Mumbai",
  "address": "123 Marine Drive, Churchgate, Mumbai 400020",
  "basePrice": 75000,
  "perGuestPrice": 600,
  "amenities": ["Parking", "AC", "WiFi", "Stage", "Sound System", "Lighting", "Valet Parking", "Backup Power"],
  "policies": "Advance booking required. 50% payment at booking. Cancellation allowed 30 days prior with 25% deduction.",
  "contactInfo": {
    "phone": "9876543211",
    "email": "contact@grandbanquet.com"
  }
}
```

**Services for Venue 1:**
```json
[
  {
    "serviceName": "Catering (Vegetarian)",
    "unitType": "plate",
    "unitPrice": 600,
    "description": "Premium vegetarian menu with 5 starters, 3 main courses, desserts",
    "isRequired": false
  },
  {
    "serviceName": "Catering (Non-Vegetarian)",
    "unitType": "plate",
    "unitPrice": 750,
    "description": "Premium non-veg menu with chicken, mutton, fish options",
    "isRequired": false
  },
  {
    "serviceName": "Premium Decoration",
    "unitType": "package",
    "unitPrice": 50000,
    "description": "Floral decoration, stage setup, entrance arch, lighting",
    "isRequired": false
  },
  {
    "serviceName": "Photography Package",
    "unitType": "package",
    "unitPrice": 35000,
    "description": "Professional photography and videography for full day",
    "isRequired": false
  },
  {
    "serviceName": "DJ & Sound System",
    "unitType": "package",
    "unitPrice": 25000,
    "description": "Professional DJ with premium sound and lighting",
    "isRequired": false
  }
]
```

**Available Dates:**
```
2024-12-20, 2024-12-25, 2024-12-31, 2025-01-05, 2025-01-12, 2025-01-19, 2025-01-26, 2025-02-02, 2025-02-09, 2025-02-14, 2025-02-16, 2025-02-23
```

---

### Venue 2: Royal Garden Resort
```json
{
  "title": "Royal Garden Resort",
  "description": "Beautiful outdoor garden venue with lush greenery and scenic views. Perfect for day weddings and outdoor ceremonies. Features a stunning gazebo and water fountain.",
  "venueType": "garden",
  "capacity": 300,
  "city": "Pune",
  "address": "456 Koregaon Park, Pune 411001",
  "basePrice": 60000,
  "perGuestPrice": 500,
  "amenities": ["Parking", "Garden", "Gazebo", "Fountain", "Outdoor Seating", "Changing Rooms", "Catering Kitchen"],
  "policies": "Weather-dependent. Rain backup available. 40% advance payment required.",
  "contactInfo": {
    "phone": "9876543212",
    "email": "info@royalgarden.com"
  }
}
```

**Services for Venue 2:**
```json
[
  {
    "serviceName": "Garden Catering (Veg)",
    "unitType": "plate",
    "unitPrice": 550,
    "description": "Fresh garden-style vegetarian cuisine",
    "isRequired": false
  },
  {
    "serviceName": "Floral Decoration",
    "unitType": "package",
    "unitPrice": 40000,
    "description": "Fresh flower decoration for garden setting",
    "isRequired": false
  },
  {
    "serviceName": "Mandap Setup",
    "unitType": "package",
    "unitPrice": 30000,
    "description": "Traditional wedding mandap with floral decoration",
    "isRequired": false
  },
  {
    "serviceName": "Live Music Band",
    "unitType": "hour",
    "unitPrice": 8000,
    "description": "Professional live band for entertainment",
    "isRequired": false
  }
]
```

**Available Dates:**
```
2024-12-22, 2024-12-29, 2025-01-08, 2025-01-15, 2025-01-22, 2025-01-29, 2025-02-05, 2025-02-12, 2025-02-19, 2025-02-26
```

---

### Venue 3: Lakeside Palace Hotel
```json
{
  "title": "Lakeside Palace Hotel",
  "description": "Premium 5-star hotel with lakeside views. Elegant ballroom with floor-to-ceiling windows overlooking the lake. Perfect for sophisticated weddings.",
  "venueType": "hotel",
  "capacity": 400,
  "city": "Udaipur",
  "address": "789 Lake Palace Road, Udaipur 313001",
  "basePrice": 120000,
  "perGuestPrice": 800,
  "amenities": ["Parking", "AC", "WiFi", "Lake View", "Luxury Rooms", "Spa", "Pool", "Restaurant", "Valet"],
  "policies": "Minimum 2-day booking required. Accommodation packages available. 60% advance payment.",
  "contactInfo": {
    "phone": "9876543213",
    "email": "events@lakesidepalace.com"
  }
}
```

**Services for Venue 3:**
```json
[
  {
    "serviceName": "Premium Catering (Veg)",
    "unitType": "plate",
    "unitPrice": 900,
    "description": "5-star multi-cuisine vegetarian menu",
    "isRequired": false
  },
  {
    "serviceName": "Premium Catering (Non-Veg)",
    "unitType": "plate",
    "unitPrice": 1100,
    "description": "5-star multi-cuisine with seafood and exotic meats",
    "isRequired": false
  },
  {
    "serviceName": "Luxury Decoration",
    "unitType": "package",
    "unitPrice": 80000,
    "description": "Premium floral and lighting decoration",
    "isRequired": false
  },
  {
    "serviceName": "Cinematic Photography",
    "unitType": "package",
    "unitPrice": 60000,
    "description": "Cinematic video and drone photography",
    "isRequired": false
  },
  {
    "serviceName": "Guest Accommodation",
    "unitType": "room",
    "unitPrice": 8000,
    "description": "Luxury room per night for guests",
    "isRequired": false
  }
]
```

**Available Dates:**
```
2024-12-28, 2025-01-10, 2025-01-17, 2025-01-24, 2025-01-31, 2025-02-07, 2025-02-14, 2025-02-21, 2025-02-28
```

---

### Venue 4: Heritage Haveli
```json
{
  "title": "Heritage Haveli",
  "description": "Traditional Rajasthani haveli with authentic architecture and royal ambiance. Perfect for traditional Indian weddings with cultural touch.",
  "venueType": "resort",
  "capacity": 250,
  "city": "Jaipur",
  "address": "321 Heritage Lane, Jaipur 302001",
  "basePrice": 85000,
  "perGuestPrice": 650,
  "amenities": ["Parking", "Traditional Architecture", "Courtyard", "Royal Decor", "Cultural Performances", "AC Rooms"],
  "policies": "Traditional ceremonies welcome. Advance booking 60 days prior. 50% advance payment.",
  "contactInfo": {
    "phone": "9876543214",
    "email": "bookings@heritagehaveli.com"
  }
}
```

**Services for Venue 4:**
```json
[
  {
    "serviceName": "Rajasthani Catering (Veg)",
    "unitType": "plate",
    "unitPrice": 700,
    "description": "Authentic Rajasthani vegetarian thali",
    "isRequired": false
  },
  {
    "serviceName": "Traditional Decoration",
    "unitType": "package",
    "unitPrice": 45000,
    "description": "Traditional Rajasthani decoration with marigold and lights",
    "isRequired": false
  },
  {
    "serviceName": "Folk Dance Performance",
    "unitType": "hour",
    "unitPrice": 12000,
    "description": "Traditional Rajasthani folk dance troupe",
    "isRequired": false
  },
  {
    "serviceName": "Horse & Baggi Entry",
    "unitType": "package",
    "unitPrice": 20000,
    "description": "Royal entry with decorated horse and baggi",
    "isRequired": false
  }
]
```

**Available Dates:**
```
2024-12-27, 2025-01-03, 2025-01-11, 2025-01-18, 2025-01-25, 2025-02-01, 2025-02-08, 2025-02-15, 2025-02-22
```

---

### Venue 5: Skyline Terrace
```json
{
  "title": "Skyline Terrace",
  "description": "Modern rooftop venue with panoramic city views. Perfect for contemporary weddings and evening receptions. Features glass walls and ambient lighting.",
  "venueType": "banquet",
  "capacity": 200,
  "city": "Bangalore",
  "address": "555 MG Road, Bangalore 560001",
  "basePrice": 55000,
  "perGuestPrice": 550,
  "amenities": ["Parking", "AC", "WiFi", "City View", "Modern Decor", "Bar", "Elevator", "Rooftop"],
  "policies": "Evening slots only. Music until 11 PM. 40% advance payment required.",
  "contactInfo": {
    "phone": "9876543215",
    "email": "events@skylineterrace.com"
  }
}
```

**Services for Venue 5:**
```json
[
  {
    "serviceName": "Contemporary Catering (Veg)",
    "unitType": "plate",
    "unitPrice": 600,
    "description": "Modern fusion vegetarian cuisine",
    "isRequired": false
  },
  {
    "serviceName": "Contemporary Catering (Non-Veg)",
    "unitType": "plate",
    "unitPrice": 700,
    "description": "Modern fusion with international options",
    "isRequired": false
  },
  {
    "serviceName": "Minimal Chic Decoration",
    "unitType": "package",
    "unitPrice": 35000,
    "description": "Modern minimalist decoration with LED lighting",
    "isRequired": false
  },
  {
    "serviceName": "Premium Bar Service",
    "unitType": "package",
    "unitPrice": 40000,
    "description": "Full bar with bartender and premium liquor",
    "isRequired": false
  },
  {
    "serviceName": "DJ & LED Setup",
    "unitType": "package",
    "unitPrice": 30000,
    "description": "Professional DJ with LED wall and lighting",
    "isRequired": false
  }
]
```

**Available Dates:**
```
2024-12-21, 2024-12-30, 2025-01-06, 2025-01-13, 2025-01-20, 2025-01-27, 2025-02-03, 2025-02-10, 2025-02-17, 2025-02-24
```

---

## Sample Booking Scenarios

### Scenario 1: Simple Booking
- **Venue:** Grand Banquet Hall
- **Date:** 2024-12-25
- **Guests:** 200
- **Food:** Vegetarian
- **Services:** Catering (Veg) - 200 plates
- **Estimated Total:** ₹341,025

### Scenario 2: Full Package Booking
- **Venue:** Royal Garden Resort
- **Date:** 2025-01-15
- **Guests:** 250
- **Food:** Vegetarian
- **Services:**
  - Garden Catering (Veg) - 250 plates
  - Floral Decoration - 1 package
  - Mandap Setup - 1 package
  - Live Music Band - 4 hours
- **Estimated Total:** ₹485,775

### Scenario 3: Luxury Booking
- **Venue:** Lakeside Palace Hotel
- **Date:** 2025-02-14
- **Guests:** 300
- **Food:** Both
- **Services:**
  - Premium Catering (Veg) - 200 plates
  - Premium Catering (Non-Veg) - 100 plates
  - Luxury Decoration - 1 package
  - Cinematic Photography - 1 package
  - Guest Accommodation - 20 rooms
- **Estimated Total:** ₹1,247,850

---

## How to Use Seed Data

### Manual Entry (Recommended for Testing)

1. Register partner accounts using the signup page
2. Login as each partner
3. Create venues with the provided data
4. Add services for each venue
5. Set availability dates
6. Register customer account
7. Test booking flow

### Automated Seeding (Optional)

Create a seed script in `backend/scripts/seed.js`:

```javascript
// This is a reference - implement if needed
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  // Create users
  // Create venues
  // Create services
  // Set availability
}

seedDatabase();
```

---

## Testing Checklist

Using the seed data, test:

- [ ] User registration and login
- [ ] Partner registration and login
- [ ] Venue creation
- [ ] Service addition
- [ ] Availability management
- [ ] Venue browsing and filtering
- [ ] Venue detail view
- [ ] Billing calculation
- [ ] Booking request submission
- [ ] Booking acceptance
- [ ] Booking rejection
- [ ] Booking cancellation
- [ ] Notifications
- [ ] Dashboard statistics

---

## Notes

- All passwords in seed data are `test123` for easy testing
- Phone numbers are fictional
- Email addresses use example.com domain
- Prices are in Indian Rupees (₹)
- Dates are in YYYY-MM-DD format
- Adjust dates to future dates when testing
