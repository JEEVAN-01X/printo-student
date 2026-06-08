/**
 * mockData.js
 *
 * Mirrors the exact shape of the real API responses from Section 07.
 * When Person A's backend is ready, replace useShopConfig's mock
 * return with a real fetch() call — nothing else in the app changes.
 */

export const MOCK_SHOP_CONFIG = {
  shop_name:            'Printo',
  is_accepting_orders:  true,
  bw_price_per_page:    1.5,
  colour_price_per_page: 10,
}

/**
 * Simulates today's queue summary.
 * GET /orders/queue/today returns an array; length = queue depth.
 * queue_length is derived, not stored — replicate that here.
 */
export const MOCK_QUEUE_SUMMARY = {
  queue_length:         7,   // PENDING + PRINTING orders right now
  avg_minutes_per_job:  4,   // shop owner sets this mentally; we hardcode for Phase 1
}

/**
 * Controls the simulated loading delay (ms).
 * Mirrors the latency of a real Render.com cold-start.
 */
export const MOCK_LOAD_DELAY_MS = 800