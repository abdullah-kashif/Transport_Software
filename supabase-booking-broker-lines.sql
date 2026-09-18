-- Apply before deploying the multi-row booking Trucker/Broker update.
-- Adds nullable broker_lines JSONB column; existing single-row columns and data remain intact.
alter table public.bookings
  add column if not exists broker_lines jsonb;

-- Example JSON structure stored in broker_lines:
-- [
--   {
--     "truckerBroker": "Al-Madina Goods",
--     "brokerAmount": 45000,
--     "brokerPaymentDetails": "IBFT-9921448",
--     "brokerPaymentDate": "2026-09-18",
--     "brokerProfitLoss": 56000
--   }
-- ]
