# WEAR AURA — Setup Guide

## Step 1: Supabase Project

1. Go to supabase.com → New Project
2. Copy Project URL and anon key
3. Copy service_role key (Settings → API)

## Step 2: Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
ADMIN_PASSWORD=choose-a-strong-password
```

## Step 3: Database Schema

Run `supabase/schema.sql` in Supabase SQL Editor (SQL Editor tab)

## Step 4: Storage Bucket

In Supabase dashboard:
1. Go to Storage
2. Create new bucket: `product-images`
3. Set as **Public**
4. Policy: Allow authenticated and anon uploads (or just set anon insert policy)

## Step 5: Update Payment Details

Open `lib/config.ts` and replace:
- Easypaisa number
- JazzCash number
- Bank account details
- WhatsApp number (format: 923XXXXXXXXX)
- Instagram/TikTok handles

## Step 6: Deploy to Vercel

```bash
npx vercel
```

Or connect GitHub repo at vercel.com

Add all .env.local variables in Vercel dashboard → Settings → Environment Variables

## Step 7: Custom Domain

In Vercel → Settings → Domains → Add `wearaura.space`

---

## Admin Panel

Go to `/admin` → Login with your ADMIN_PASSWORD → Add products, view orders

## Pages

- `/` — Home
- `/shop` — All products
- `/product/[slug]` — Product detail
- `/checkout` — Checkout
- `/order/[id]` — Order confirmation
- `/admin` — Admin panel (password protected)
