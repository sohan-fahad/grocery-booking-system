# Grocery Booking — Web

Customer-facing storefront and admin dashboard for the Grocery Booking product. Built with the Next.js App Router and talks to the `grocery-booking-api` backend.

## Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Data:** TanStack Query for server state
- **Client state:** Zustand (auth session, persisted shop cart)
- **UI:** Tailwind CSS 4, Radix / shadcn-style primitives, Lucide icons
- **Forms & validation:** React Hook Form, Zod

## Prerequisites

- Node.js compatible with Next 16 (see Next.js docs for current LTS guidance)
- The API running and reachable (see environment below)

## Environment

Create a `.env` (or `.env.local`) in this directory:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Origin + global API prefix, no trailing slash. With the API’s default [`.env.example`](../grocery-booking-api/.env.example) (`PORT=5004`, `API_PREFIX=api/v1`), use `http://localhost:5004/api/v1`. |

The app reads this from `lib/env.ts` as `ENV.API_BASE_URL`. Requests append paths such as `/web/...` and `/admin/...` on top of that base.

## Scripts

```bash
npm install
npm run dev      # dev server — http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

## Routes (overview)

| Area | Path | Notes |
| --- | --- | --- |
| Shop | `/` | Browse items, cart sidebar, search & categories |
| Auth | `/auth`, `/auth/register` | Sign in / register |
| Checkout | `/checkout` | Place order (expects a signed-in **user** role) |
| My orders | `/orders` | Shopper order history |
| Admin | `/dashboard`, `/dashboard/categories`, `/dashboard/items`, `/dashboard/orders` | Back-office (admin role) |

## Project layout

- `app/` — routes, layouts, global providers
- `components/` — page-level UI under `components/pages/`, shared layout and UI primitives
- `lib/` — API clients, React Query hooks, Zustand stores, env, utilities

This replaces the default create-next-app README; for generic Next.js topics, see [nextjs.org/docs](https://nextjs.org/docs).
