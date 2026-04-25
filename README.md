# Credit Dost Franchise Management Platform

A full-stack MERN application for managing franchise partnerships with credit verification capabilities.

## Features

- Franchise user registration and authentication
- Package purchasing with Razorpay integration
- KYC verification workflow
- Credit checking with Surepass integration
- Admin dashboard for managing franchises, packages, leads, and payouts
- Referral program
- Responsive UI with Material-UI components

## Tech Stack

- **Frontend**: React 19, Vite, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Payments**: Razorpay
- **Credit Checks**: Surepass API
- **File Storage**: AWS S3
- **Email**: Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Razorpay account
- Surepass account
- AWS S3 bucket (for document storage)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration values.

5. Run the seed script to create an admin user and sample packages:
   ```
   npm run seed
   ```

6. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. From the root directory, install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration values.

4. Start the frontend development server:
   ```
   npm run dev
   ```

## Environment Variables

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/franchise_management?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Server
PORT=5000

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Surepass
SUREPASS_API_KEY=your_surepass_api_key

# AWS S3 (for document uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
# Frontend Environment Variables

# API URL
REACT_APP_API_URL=https://reactbackend.creditdost.co.in/api

# Razorpay Key (for frontend checkout)
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Available Scripts

### Backend

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run seed` - Seed database with initial data

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
.
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── tests/
│   ├── server.js
│   └── ...
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── common/
│   │   └── franchise/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
└── ...
```

## Role-Based Access Control

The application has three user roles:

1. **Public** - Unauthenticated users can register
2. **Franchise User** - Authenticated franchise partners with access to franchise dashboard
3. **Admin** - Administrators with full access to admin dashboard

## Development

### Testing

Backend tests are written with Jest and can be run with:
```
cd Backend
npm test
```

### API Endpoints

The backend API is organized into the following routes:

- `/api/auth` - Authentication endpoints
- `/api/packages` - Package management
- `/api/payments` - Payment processing
- `/api/kyc` - KYC verification
- `/api/franchises` - Franchise management
- `/api/credit` - Credit checking
- `/api/admin` - Admin dashboard
- `/api/dashboard` - Franchise dashboard

## Deployment

### Backend

1. Set environment variables on your deployment platform
2. Run `npm start` to start the production server

### Frontend

1. Build the frontend:
   ```
   npm run build
   ```
2. Deploy the `dist/` folder to your hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## Rate Limiting Configuration

The application includes built-in rate limiting for SurePass API calls to prevent 429 (Too Many Requests) errors. You can configure the following environment variables:

```
# SurePass API Rate Limiting
SUREPASS_MIN_DELAY_MS=1500                    # Minimum delay between requests in milliseconds (default: 1500)
SUREPASS_MAX_REQUESTS_PER_WINDOW=20           # Maximum requests per time window (default: 20)
SUREPASS_RATE_LIMIT_WINDOW_MS=60000           # Time window in milliseconds (default: 60000 = 1 minute)
```

These settings help distribute API calls evenly and prevent hitting SurePass rate limits during high-traffic periods.

## License

This project is licensed under the MIT License.
