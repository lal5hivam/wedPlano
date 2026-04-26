# Wedplano — Wedding Venue Booking Platform

A complete full-stack web application for wedding venue booking with role-based authentication, real-time availability management, and transparent pricing.

## Features

### For Customers (Users)
- Browse and search wedding venues
- Filter by city, price, capacity, venue type
- View detailed venue information with gallery
- Check real-time date availability
- Configure service requirements (guests, food, add-ons)
- See automatic billing calculation before booking
- Submit booking requests
- Track booking status
- Cancel bookings

### For Venue Partners
- Create and manage venue listings
- Upload venue images/videos
- Define service pricing (per guest, catering, decoration, etc.)
- Manage availability calendar
- Receive and manage booking requests
- Accept/reject bookings
- View analytics and revenue dashboard

## Tech Stack

### Backend
- Node.js + Express.js
- Firebase Admin SDK + Firestore
- JWT Authentication
- Cloudinary for media storage
- Swagger/OpenAPI documentation
- bcryptjs, multer, helmet, express-rate-limit

### Frontend
- React.js + Vite
- React Router
- Context API for state management
- Axios for API calls
- Minimal CSS with custom design system

## Project Structure

```
wedplano/
├── backend/
│   ├── src/
│   │   ├── config/          # Firebase, Cloudinary, Swagger config
│   │   ├── controllers/     # Business logic
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── services/        # Billing, notifications
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Page components
│   │   ├── styles/          # Global styles
│   │   ├── utils/           # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── SETUP.md             # Detailed setup guide
│   ├── API.md               # API documentation
│   └── DEPLOYMENT.md        # Deployment guide
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase project
- Cloudinary account (free tier)

### Installation

1. Clone the repository
2. Set up backend (see [SETUP.md](docs/SETUP.md))
3. Set up frontend (see [SETUP.md](docs/SETUP.md))
4. Configure environment variables
5. Start development servers

## Documentation

- [Complete Setup Guide](docs/SETUP.md) - Step-by-step installation
- [API Documentation](docs/API.md) - All endpoints with examples
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment

## Key Features Explained

### Billing System
- Host defines all unit prices for services
- User selects quantities and options
- System automatically calculates:
  - Base venue charge
  - Per-guest charges
  - Service add-ons
  - Platform fee (5%)
  - GST (18%)
  - Grand total
- Billing preview shown before booking submission

### Booking Flow
1. Partner creates venue and defines services/pricing
2. Partner publishes available dates
3. User browses venues and selects one
4. User picks date and configures requirements
5. System shows billing breakdown
6. User submits booking request (status: pending)
7. Partner receives notification
8. Partner accepts/rejects request
9. If accepted: date becomes unavailable, booking confirmed
10. If rejected: date remains available

### Race Condition Protection
- Firestore transactions prevent double bookings
- Server-side validation ensures data integrity
- Dates locked only after acceptance

## License

MIT License - Free for educational and commercial use

## Support

For issues or questions, please open a GitHub issue.
