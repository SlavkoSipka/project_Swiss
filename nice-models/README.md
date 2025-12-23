# 🌟 Nice Models - Premium Escort Portal

Modern, full-featured escort portal built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

### 🎯 Core Features (MVP - ✅ COMPLETED)
- ✅ **Modern Landing Page** - Hero section, search bar, categories, featured profiles
- ✅ **Advanced Search & Filters** - Filter by location, category, price, age, services
- ✅ **Profile Listings** - Grid view with cards, sorting, pagination
- ✅ **Detailed Profile Pages** - Full profile with gallery, reviews, contact info, availability
- ✅ **Authentication System** - Login/Register with Supabase Auth
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Photo Gallery** - Lightbox with navigation
- ✅ **Reviews & Ratings** - 5-star rating system with comments
- ✅ **Contact Features** - Call, WhatsApp, messaging, booking buttons

### 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React Icons
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Deployment:** Vercel (recommended)

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)

### 1. Clone & Install

```bash
cd nice-models
npm install
```

### 2. Environment Setup

Create `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ykzqjwqomaeuppubofid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_59LDwQCZ_WDDMKseQplCwA_-Llwv06w
```

### 3. Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# Copy content from ../database_schema_extended.sql
# Paste and execute in Supabase SQL Editor
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nice-models/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── search/            # Search & listings
│   │   ├── profile/[id]/      # Profile detail pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Register page
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── home/              # Landing page components
│   │   ├── search/            # Search filters, profile grid
│   │   ├── profile/           # Profile page components
│   │   └── auth/              # Login/Register forms
│   ├── lib/
│   │   └── supabase/          # Supabase client setup
│   └── types/
│       └── database.types.ts  # TypeScript types
├── public/                     # Static assets
├── .env.local                 # Environment variables
└── package.json
```

## 🎨 Pages Overview

### 1. **Landing Page** (`/`)
- Hero section with search
- Quick stats (online models, verified, etc.)
- Category cards (Escorts, Trans, VIP, etc.)
- Featured profiles
- Popular locations
- CTA sections

### 2. **Search Page** (`/search`)
- Advanced filter sidebar
  - Category, Location, Age, Price
  - Services checkboxes
  - Verified only toggle
- Profile grid with cards
- Sorting options
- Pagination

### 3. **Profile Page** (`/profile/[id]`)
- Profile header (name, age, location, verified badge)
- Quick stats (age, height, languages, price)
- Photo gallery with lightbox
- About section
- Services offered
- Languages spoken
- Reviews & ratings
- Sidebar with:
  - Pricing table
  - Contact buttons (Call, WhatsApp, Message, Book)
  - Availability schedule
  - Safety notice
- Similar profiles section

### 4. **Auth Pages** (`/login`, `/register`)
- Email/password authentication
- Social login buttons (Google, Facebook)
- Role selection (Client/Model)
- Form validation
- Error handling

## 🗄️ Database Schema

### Main Tables:
- `profiles` - User profiles (clients & models)
- `model_details` - Extended model information
- `photos` - Photo gallery
- `videos` - Video gallery
- `reviews` - Reviews & ratings
- `favorites` - User favorites
- `messages` - Direct messaging
- `bookings` - Appointment bookings
- `city_tours` - Model tours
- `jobs` - Job postings
- `rentals` - Property rentals
- `categories` - Profile categories
- `languages` - Languages spoken
- `availability` - Working hours
- `notifications` - User notifications

See `../database_schema_extended.sql` for full schema.

## 🔐 Authentication

Supabase Auth is integrated with:
- Email/password signup/login
- Social OAuth (Google, Facebook) - ready to configure
- Row Level Security (RLS) policies
- Protected routes (coming soon)

## 🎯 Next Steps (Phase 2)

### Features to Implement:
- [ ] **Dashboard** - User/Model dashboard
- [ ] **Messages** - Real-time messaging system
- [ ] **Bookings** - Appointment booking system
- [ ] **Favorites** - Save favorite profiles
- [ ] **Reviews** - Write and manage reviews
- [ ] **Photo Upload** - Upload profile photos
- [ ] **Video Gallery** - Upload and display videos
- [ ] **Stories** - 24h stories feature
- [ ] **City Tours** - Tour management
- [ ] **Jobs & Rentals** - Job/rental listings
- [ ] **Admin Panel** - Content moderation
- [ ] **Notifications** - Real-time notifications
- [ ] **Multi-language** - i18n support
- [ ] **SEO Optimization** - Meta tags, sitemap
- [ ] **Analytics** - User behavior tracking

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

```bash
npm run build  # Test production build locally
```

## 📝 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change color scheme:
```ts
colors: {
  primary: '#ec4899',  // pink-500
  secondary: '#9333ea', // purple-600
}
```

### Branding
- Logo: Update in `src/components/layout/Header.tsx`
- Favicon: Replace `public/favicon.ico`
- Meta tags: Update in `src/app/layout.tsx`

## 📄 License

This project is for educational purposes. Make sure to comply with local laws and regulations when deploying an escort portal.

## 🤝 Support

For issues or questions:
1. Check Supabase dashboard for database errors
2. Check browser console for frontend errors
3. Review Next.js documentation: https://nextjs.org/docs

---

**Built with ❤️ using Next.js 14 & Supabase**
