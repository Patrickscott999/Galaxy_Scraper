# React App with Auth & Stripe

A React application built with Next.js that includes authentication and Stripe payment processing. This serves as a base application that you can build upon for your own projects.

## Features

- **User Authentication**
  - Login
  - Signup
  - Logout
  - Profile management

- **Payment Processing**
  - Stripe integration
  - Payment form
  - Secure payment processing

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Firebase (Authentication, Firestore)
- Stripe (Payment processing)
- Radix UI (Component library)

## Getting Started

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up environment variables (see below)
4. Run the development server
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

### Firebase Configuration

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Stripe Configuration

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
```

## Project Structure

```
/app                   # Next.js app directory
  /api                 # API routes
    /create-payment-intent # Stripe payment intent API
  /auth                # Authentication pages
    /login             # Login page
    /signup            # Signup page
  /dashboard           # Dashboard page (protected)
  
/components            # React components
  /auth                # Authentication components
  /payment             # Payment components
  /ui                  # UI components
  
/lib                   # Utility functions and services
  firebase.ts          # Firebase configuration
  authContext.tsx      # Authentication context
  stripe.ts            # Stripe configuration
```

## Usage

- Visit `/` to see the home page
- Go to `/auth/login` to log in
- Go to `/auth/signup` to create a new account
- After authentication, you'll be redirected to `/dashboard`

## Development Notes

- The application includes fallbacks for when Firebase and Stripe credentials are not configured, allowing for development without actual API keys.
- The UI is built with Tailwind CSS and Radix UI components for a modern and responsive design.
- Authentication is handled through Firebase Authentication.
- Payment processing uses Stripe's Elements and Payment Intents API.

## License

MIT
