# Wellcare Pharmacy — Backend Setup Guide

This project uses **Firebase** for Authentication, Firestore (Database), Storage, and Cloud Functions (WhatsApp Alerts).

## 1. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project: `wellcare-pharmacy-76524`.
3. Enable **Authentication** and turn on **Phone Auth**.
4. Enable **Firestore Database** in **Native Mode**.
5. Enable **Cloud Storage**.
6. Switch to **Blaze Plan** (required for Cloud Functions and SMS OTP).

## 2. Environment Variables
Create a `.env.local` file in the root with the following values from your Firebase Project Settings:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wellcare-pharmacy-76524.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wellcare-pharmacy-76524
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wellcare-pharmacy-76524.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_admin_password
```

## 3. Database Seeding
To populate your Firestore with products and categories:
1. Download `service-account.json` from **Project Settings > Service Accounts**.
2. Place it in the project root.
3. Run the following commands:
```bash
npm run seed-categories
npm run seed-products
```

## 4. Cloud Functions (WhatsApp Alerts)
1. Initialize Twilio credentials in Firebase Config:
```bash
firebase functions:config:set twilio.sid="YOUR_SID" twilio.token="YOUR_TOKEN" twilio.from="whatsapp:+14155238886" twilio.to="whatsapp:+919897397532"
```
2. Deploy functions:
```bash
firebase deploy --only functions
```

## 5. Security Rules & Indexes
Deploy Firestore/Storage rules and indexes:
```bash
firebase deploy --only firestore,storage
```

## 6. Admin Dashboard
Access the order management dashboard at:
`https://wellcare-pharmacy-76524.web.app/admin`
Use the password set in `NEXT_PUBLIC_ADMIN_PASSWORD`.
