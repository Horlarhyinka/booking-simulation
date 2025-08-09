# Property Booking API

A TypeScript-based REST API for managing property listings and bookings.  
Supports adding properties, checking availability, and preventing booking conflicts.

---

## 📂 Project Structure

```
src
├── config
│   ├── db               # Database connection & settings
│   ├── envvars.ts       # Environment variable config
│   └── swagger.ts       # Swagger documentation setup
├── controllers          # Request handlers for API routes
│   ├── booking.ts
│   └── property.ts
├── lib
│   ├── catchAsyncErrors.ts # Error-handling middleware wrapper
│   └── validator.ts        # Request payload validation
├── models               # TypeORM entities
│   ├── booking.ts
│   └── property.ts
├── routes               # API route definitions
│   ├── bookings.ts
│   └── properties.ts
|__ tests                # Test files 
|   |__ booking.test.ts
|   |__ catchAsyncErrors.test.ts
|   |__ property.test.ts
|   |__ validator.test.ts
|
└── index.ts             # Application entry point
```

---

## 🏗 Features

- **Property Management**
  - Add a new property with availability date range
  - List properties (with optional date filter)
  - Store price per night, title, and description

- **Booking Management**
  - Create a booking only if:
    - Dates are valid (`YYYY-MM-DD` format)
    - Dates fall within property availability range
    - No overlap with existing bookings
  - Delete bookings
  - Fetch availability ranges for a property

- **Date Handling**
  - Uses [Luxon](https://moment.github.io/luxon/) for date parsing and validation
  - Dates are stored in UTC for consistency

---

## 📦 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **TypeORM** (Entity-based models)
- **PostgreSQL** (or any TypeORM-supported DB)
- **Luxon** for date handling
- **Swagger** for API documentation

---

## ⚙️ Installation

```bash
# Clone repository
git clone <your-repo-url>
cd property-booking-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file with:

```env
PORT = 5001
HOST = 'http://localhost:5001'
DB_TYPE = 'postgres'
DB_HOST = 'localhost'
DB_PORT =  5432
DB_USERNAME = youruser
DB_PASSWORD = yourpass
DB_NAME = property_booking
```

---

## 📌 API Endpoints

### Properties

#### Add Property
```http
POST /api/properties
Content-Type: application/json

{
  "title": "Spacious 2-bedroom flat",
  "description": "Near city center",
  "price_per_night": 120000,
  "available_from": "2026-01-01",
  "available_to": "2026-01-09"
}
```

#### Get Properties
```http
GET /api/properties?available_on=2026-01-05&page=1&size=10
```

---

### Bookings

#### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "property_id": "property-uuid",
  "user_name": "John Doe",
  "start_date": "2026-01-03",
  "end_date": "2026-01-05"
}
```

#### Delete Booking
```http
DELETE /api/bookings/:id
```

#### Get Property Availability
```http
GET /api/properties/:id/availability
```

---

## 📜 Validation Rules

- **Dates**: Must be in `YYYY-MM-DD` format, valid, and in the future for bookings
- **Property availability**: Bookings must be within the property's available range
- **No overlaps**: Prevents double-booking for the same date range

---

## 📖 Swagger API Documentation

This project uses **Swagger UI** to provide interactive API documentation.

### Run Swagger
1. Start the server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5001/api-docs
   ```
3. You’ll see a fully interactive API explorer:
   - Test endpoints directly in the browser
   - View request/response formats
   - Read descriptions and example payloads

### Swagger Location
Swagger is configured in:
```
src/config/swagger.ts
```
It scans your controller files for `@openapi` comments to build the documentation automatically.

---
