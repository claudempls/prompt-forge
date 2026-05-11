-- Migration: Add Stripe columns to profiles + model_used to prompt_history
-- Run this in the Supabase SQL editor if you already have the tables created

alter table public.profiles
  add column if not exists stripe_customer_id     text unique,
  add column if not exists stripe_subscription_id text;

alter table public.prompt_history
  add column if not exists model_used text;

-- Allow service-role to update any profile (for Stripe webhook)
-- (service-role bypasses RLS by default — no extra policy needed)
