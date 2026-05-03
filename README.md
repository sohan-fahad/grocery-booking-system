# Grocery Booking

A full-stack grocery ordering platform. Customers browse items, add them to a cart, and place orders. Admins manage inventory, categories, and view orders with pagination.

## Quick start

You need **Node.js 20+**, **pnpm**, and **PostgreSQL** running (or use Docker for the database — see [Docker & Makefile](#docker--makefile)).

**Backend** — terminal 1:

```bash
cd grocery-booking-api
cp .env.example .env
pnpm install
pnpm run start:dev
```

**Frontend** — terminal 2:

```bash
cd grocery-booking-web
echo 'NEXT_PUBLIC_API_BASE_URL=http://localhost:5004/api/v1' > .env.local
pnpm install
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001). If your API uses a different port, change `5004` in `.env` and `.env.local` to match.

First time? In `grocery-booking-api`, run `pnpm run seed` for sample categories and items.

---

## Project Structure

```
grocery-booking/
├── grocery-booking-api/   # NestJS REST API
└── grocery-booking-web/   # Next.js frontend
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| API | NestJS 10, TypeORM 0.3, PostgreSQL |
| Web | Next.js 16, React 19, TanStack Query v5 |
| Auth | JWT (Bearer token) |
| Validation | class-validator / class-transformer |
| Styling | Tailwind CSS, shadcn/ui |
| State | Zustand (cart + auth stores) |

---

## Architecture Overview

### API (`grocery-booking-api`)

The API follows an **API Gateway** pattern. All HTTP routes live in `src/app/api-gateway/controllers/` and delegate to domain services. No business logic lives in controllers.

```
src/
├── app/
│   ├── api-gateway/
│   │   └── controllers/
│   │       ├── web/        # Customer-facing endpoints (/web/*)
│   │       └── admin/      # Admin endpoints (/admin/*)
│   ├── modules/            # Feature modules
│   │   ├── order/          # Order + OrderItem entities, service, DTOs
│   │   ├── grocery/        # GroceryItem entity, service, DTOs
│   │   ├── category/       # Category entity, service, DTOs
│   │   ├── user/           # User entity, auth service
│   │   ├── dashboard/      # Aggregate stats for admin dashboard
│   │   ├── file-storage/   # Image upload handling
│   │   └── seed/           # Database seed command
│   ├── base/               # BaseEntity, BaseService, BaseDTO
│   ├── guards/             # AuthGuard (JWT), RolesGuard
│   ├── decorators/         # @AuthUser(), @Roles()
│   ├── helpers/            # JWTHelper, BcryptHelper
│   └── types/              # SuccessResponse, ErrorResponse
└── database/               # TypeORM DataSource config
```

**Route prefixes:**

| Prefix | Guard | Description |
|---|---|---|
| `/web/*` | `AuthGuard` (JWT, role: `user`) | Customer endpoints |
| `/admin/*` | `RolesGuard` (role: `admin`) | Admin endpoints |
| `/auth/*` | Public | Login / register |

**Pagination** is implemented on list endpoints using `page` and `limit` query parameters. The response `meta` field contains `{ total, page, limit }`.

**Order creation** runs inside a TypeORM transaction with pessimistic write locks on each `GroceryItem` to prevent overselling.

---

### Web (`grocery-booking-web`)

```
src/ (app router)
├── app/
│   ├── page.tsx                    # Shop home (product grid)
│   ├── auth/page.tsx               # Login / register
│   ├── checkout/page.tsx           # 2-step checkout
│   ├── orders/page.tsx             # My orders
│   └── dashboard/                  # Admin area
│       ├── page.tsx                # Stats dashboard
│       ├── orders/page.tsx         # Paginated order list
│       ├── orders/[id]/page.tsx    # Order detail
│       ├── items/page.tsx          # Grocery item management
│       └── categories/page.tsx     # Category management
├── components/
│   ├── pages/                      # Page-level components (one per route)
│   └── ui/                         # Reusable shadcn/ui primitives
└── lib/
    ├── hooks/
    │   ├── queries/                # TanStack Query hooks
    │   └── stores/                 # Zustand stores
    ├── services/api/               # HTTP service wrappers
    ├── models/                     # TypeScript entity types + response interfaces
    └── utils/                      # Helpers (session, cn, etc.)
```

**Data fetching** uses TanStack Query hooks (in `lib/hooks/queries/`). Each hook wraps an API service method and handles caching, loading, and error state. This mirrors the pattern in `useMyOrdersQuery.ts`.

**Auth state** is stored in a Zustand store (`useAuthenticationStore`) and hydrated from `localStorage` via `SessionUtils`. Protected pages redirect to `/auth` when no valid token is present.

**Cart state** is a Zustand store (`useShopCartStore`) that persists across page navigations. Checkout reads from the cart and calls `usePlaceOrderMutation`.

---

## Data Models

### Order

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User |
| `status` | enum | `pending` \| `confirmed` \| `delivered` \| `cancelled` |
| `totalAmount` | decimal | Calculated at order time |
| `items` | OrderItem[] | Eagerly loaded |

### OrderItem

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `orderId` | UUID | FK → Order |
| `groceryItemId` | UUID | FK → GroceryItem |
| `quantity` | int | |
| `unitPrice` | decimal | Snapshot of price at order time |

### GroceryItem

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | string | |
| `price` | decimal | |
| `quantity` | int | Inventory stock |
| `categoryId` | UUID | FK → Category |
| `imageId` | UUID | FK → FileStorage (optional) |

---

## API Reference

### Auth

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/auth/register` | `{ name, email, password }` | Register a new user |
| POST | `/auth/login` | `{ email, password }` | Login, returns JWT |

### Customer (`/web/*`, requires JWT)

| Method | Path | Description |
|---|---|---|
| GET | `/web/groceries` | List groceries (paginated) |
| GET | `/web/categories` | List categories |
| POST | `/web/orders` | Place an order |
| GET | `/web/orders/mine` | My orders |
| GET | `/web/orders/:id` | Order detail |

### Admin (`/admin/*`, requires JWT + admin role)

| Method | Path | Query | Description |
|---|---|---|---|
| GET | `/admin/orders` | `page`, `limit`, `status` | List all orders (paginated) |
| GET | `/admin/orders/:id` | | Order detail |
| GET | `/admin/groceries` | `page`, `limit`, `searchTerm`, `categoryId` | List groceries |
| POST | `/admin/groceries` | | Create grocery item |
| PATCH | `/admin/groceries/:id` | | Update grocery item |
| DELETE | `/admin/groceries/:id` | | Delete grocery item |
| GET | `/admin/categories` | `page`, `limit`, `searchTerm` | List categories |
| POST | `/admin/categories` | | Create category |
| GET | `/admin/dashboard/stats` | | Aggregate stats |

---

## Docker & Makefile

All Docker Compose files and the `Makefile` live in **`grocery-booking-api/`**. From that directory you can run `make <target>` after [installing GNU Make](https://www.gnu.org/software/make/) and Docker Desktop (or the Docker Engine + Compose plugin).

### What the Compose files do

| File | Purpose |
|---|---|
| **`docker-compose-dev.yml`** | **Development database only.** Starts PostgreSQL 16 in a container, exposes it on the host as **`localhost:5433`** (mapped to `5432` inside the container). Volume `postgres_dev_data` persists data. The NestJS app is **not** containerized in this setup—you run it with `pnpm start:dev` (or `make dev`) on your machine. |
| **`docker-compose.yml`** | **Production-style stack.** Builds the API image from **`Dockerfile`**, runs it with **Nest in production mode** on host port **`4001`**, and starts a separate Postgres service named `postgres` on the internal Docker network. Uses env vars `DB_*`, `JWT_SECRET`, and `ADMIN_SECRET` from your shell or a `.env` file in the same directory Compose is run from. |

### Dockerfiles

| File | Role |
|---|---|
| **`Dockerfile`** | Multi-stage build: `pnpm install` + `pnpm build`, then a slim runtime image with production dependencies only. Entrypoint: `node dist/main`. Used by `docker-compose.yml` for the `api` service. |
| **`Dockerfile.dev`** | Development image with dev dependencies; intended for running `pnpm run start:dev` inside a container (e.g. if you wire it into Compose yourself). The **default** `make dev` flow does **not** use this file—it only starts Postgres via `docker-compose-dev.yml`. |

### Connecting the dev API to Docker Postgres

When using `docker-compose-dev.yml`, set in `grocery-booking-api/.env`:

- `DB_HOST=localhost`
- `DB_PORT=5433` (host port, not `5432`)
- `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` to match the dev compose file (`postgres` / `postgres` / `grocery_db` by default)

For **Docker Compose production** (`docker-compose.yml`), the API container talks to the `postgres` service by hostname `postgres` on port `5432`; you do not edit `DB_HOST` in the compose file for local prod-style runs—the compose `api` service already sets `DB_HOST: postgres`.

### Makefile targets (`grocery-booking-api/Makefile`)

Run from `grocery-booking-api/` as `make <target>`.

| Target | What it runs |
|---|---|
| **`dev`** | `docker compose -f docker-compose-dev.yml` up (Postgres), then **`pnpm start:dev`** on the host. |
| **`db`** | Only brings up the dev Postgres stack (no Nest). |
| **`db-down`** | Stops the dev Postgres compose project. |
| **`prod`** | `docker compose -f docker-compose.yml` up in detached mode (Postgres + API image). |
| **`prod-build`** | Same as `prod` but forces **`--build`** of the API image. |
| **`down`** | Stops dev compose (`docker-compose-dev.yml`). |
| **`reset`** | Dev: removes volumes and recreates dev Postgres (wipes local dev DB data). |
| **`reset-prod`** | Prod compose down with `-v` (removes prod compose volumes). |
| **`logs`** | Follow logs for dev compose. |
| **`logs-prod`** | Follow logs for the **`api`** service in prod compose. |
| **`restart`** | Restarts services in dev compose. |
| **`install`**, **`build`**, **`start`**, **`debug`** | Passthroughs to `pnpm install`, `pnpm build`, `pnpm start:prod`, `pnpm start:debug`. |
| **`lint`**, **`format`** | `pnpm lint`, `pnpm format`. |
| **`test`**, **`test-watch`**, **`test-cov`**, **`test-e2e`** | Test scripts via pnpm. |

**Typical flows**

- **Local development with Docker DB:** `cd grocery-booking-api && make dev` (ensure `.env` uses `DB_PORT=5433`), then run the web app as in [Web setup](#web-setup) with `NEXT_PUBLIC_API_BASE_URL` pointing at your API port.
- **Full stack in Docker (prod compose):** Configure secrets (`JWT_SECRET`, `ADMIN_SECRET`, DB vars if not using defaults), then `make prod` or `make prod-build`. API base URL for the web app would be `http://localhost:4001` (plus your global API prefix, e.g. `http://localhost:4001/api/v1` if that is how the client is configured).

---

## Key Design Decisions

- **Pessimistic locking on order creation** — each `GroceryItem` row is locked during the transaction to prevent race conditions when multiple users order the same item simultaneously.
- **Price snapshot in OrderItem** — `unitPrice` is stored on the order item at placement time so historical orders are unaffected by future price changes.
- **API Gateway pattern** — controllers are thin; all business logic lives in services. This makes it easy to add new delivery channels (e.g. GraphQL, WebSocket) without touching business logic.
- **TanStack Query for all remote state** — no `useEffect`/`useState` for data fetching; cache invalidation happens automatically on mutations.
