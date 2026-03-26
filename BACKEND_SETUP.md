# Wellcare Pharmacy — Backend Setup Guide (Supabase)

This project has been migrated from Firebase to **Supabase** for Authentication, Database, Storage, and Real-time updates.

## 1. Supabase Project Setup
1. Go to [Supabase Console](https://supabase.com/).
2. Create a new project: `wellcare-pharmacy`.
3. Go to **SQL Editor** and run the schema provided in the [setup_guide.md](file:///C:/Users/siddh/.gemini/antigravity/brain/7dc28dbb-7275-4e48-8385-93e291b81ec3/setup_guide.md).
4. Go to **Storage** and create a private bucket named `prescriptions`.

## 2. Environment Variables
Create or update your `.env.local` file in the `wellcare` root with these values:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Database Seeding
To populate your Supabase database with products:
1. Open your terminal in the **`wellcare`** folder:
```bash
cd e:/project01/wellcare
```
2. Run the seeding shortcut:
```bash
npm run seed-supabase
```

## 4. API Routes (Serverless)
The project now uses Next.js API routes (in `src/app/api/`) instead of Firebase Cloud Functions. These are deployed automatically when you push to Vercel.

## 5. Admin Dashboard
Access the live order management dashboard at:
`/admin`
Use the password set in `NEXT_PUBLIC_ADMIN_PASSWORD`. Real-time updates are powered by Supabase Postgres Changes