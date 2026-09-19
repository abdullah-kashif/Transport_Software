-- ==============================================================================
-- GTLS Transport: Add container_ref to booking_brokers table
-- Run this ONCE in the Supabase SQL Editor as postgres or on your VPS PostgreSQL.
-- Safe & Idempotent (IF NOT EXISTS): Will not break or duplicate any existing data.
-- ==============================================================================

alter table public.booking_brokers
  add column if not exists container_ref text default 'all';
