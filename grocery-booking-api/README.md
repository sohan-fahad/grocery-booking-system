# Grocery Booking API

A RESTful API for a grocery booking system built with NestJS, TypeORM, and PostgreSQL. Admins manage grocery inventory and users can browse available items and place orders.

## Tech Stack

- **Framework:** NestJS 10 (TypeScript)
- **Database:** PostgreSQL 16 + TypeORM 0.3
- **Authentication:** JWT (HS512) + bcrypt
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger / OpenAPI at `/docs`
- **Containerization:** Docker + Docker Compose
- **Package Manager:** pnpm

## Project Structure

```
src/
├── main.ts                    # Bootstrap (CORS, validation pipe, Swagger)
├── env.ts                     # Environment config loader
├── swagger.ts                 # Swagger setup
├── app/
│   ├── app.module.ts          # Root module + auth middleware wiring
│   ├── api-gateway/           # Controllers (HTTP layer)
│   │   └── controllers/
│   │       ├── web/           # Public auth endpoints
│   │       ├── admin/         # Admin-only endpoints
│   │       └── user/          # Authenticated user endpoints
│   ├── modules/               # Business logic
│   │   ├── user/
│   │   ├── grocery/
│   │   └── order/
│   ├── guards/                # AuthGuard, RolesGuard
│   ├── decorators/            # @Roles, @AuthUser
│   ├── middlewares/           # JWT auth middleware
│   ├── helpers/               # JWTHelper, BcryptHelper
│   └── base/                  # BaseEntity, BaseService
├── database/                  # TypeORM module
└── shared/                    # Enums, constants, utilities
```

## API Endpoints

### Public — `/api/v1/web/auth`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/web/auth/login` | Login with email & password |
| `POST` | `/web/auth/register` | Register as a regular user |
| `POST` | `/web/auth/register-admin` | Register as admin (requires `x-admin-secret` header) |

### Admin — `/api/v1/admin` _(Bearer token + ADMIN role required)_

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/admin/grocery` | Add a new grocery item |
| `GET` | `/admin/grocery` | List all grocery items |
| `PATCH` | `/admin/grocery/:id` | Update item details |
| `PATCH` | `/admin/grocery/:id/inventory` | Add / subtract / set stock quantity |
| `DELETE` | `/admin/grocery/:id` | Remove an item |

### User — `/api/v1/user` _(Bearer token + USER role required)_

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/user/grocery` | Browse available grocery items |
| `POST` | `/user/orders` | Place an order |
| `GET` | `/user/orders` | List my orders |
| `GET` | `/user/orders/:id` | Get a single order |

## Authentication

Requests to `/admin/*` and `/user/*` routes are protected by an `AuthMiddleware` that validates a JWT Bearer token. Endpoints also enforce role checks via `RolesGuard`.

**Login flow:**
1. `POST /api/v1/web/auth/login` → receive `{ token, user }`
2. Include the token in subsequent requests: `Authorization: Bearer <token>`

## Environment Variables

Copy `environments/example.env` to `environments/development.env` and fill in the values:

```env
PORT=5004
NODE_ENV=development

API_PREFIX=api/v1
API_VERSION=1.0.0
API_TITLE=Grocery Booking API
API_DESCRIPTION=Grocery Booking System

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=grocery_db
DB_SYNCHRONIZE=true
DB_LOGGING=false

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_SALT_ROUNDS=10
JWT_EXPIRES_IN=30d
JWT_REFRESH_EXPIRES_IN=90d

ADMIN_SECRET=admin-secret-dev
```

> **Note:** `ADMIN_SECRET` is required as the `x-admin-secret` header when registering an admin account.

## Getting Started

### Prerequisites

- Node.js >= 16
- pnpm >= 8
- Docker & Docker Compose (for containerized setup)

### Local Development

```bash
# Install dependencies
pnpm install

# Start only the database (PostgreSQL via Docker)
make db

# Start the API in watch mode
pnpm run start:dev
```

The API will be available at `http://localhost:5004` and Swagger docs at `http://localhost:5004/docs`.

### Development with Docker

```bash
# Start DB + run app in watch mode
make dev

# Stop the database
make db-down
```

### Production

```bash
# Build and start all services (API + PostgreSQL)
make prod-build

# Or start already-built images
make prod
```

## Makefile Reference

| Command | Description |
|---------|-------------|
| `make dev` | Start DB + run app in watch mode |
| `make db` | Start PostgreSQL only |
| `make db-down` | Stop PostgreSQL |
| `make prod` | Start production stack |
| `make prod-build` | Build and start production stack |
| `make reset` | Clear volumes and restart |
| `make logs` | Tail container logs |
| `make install` | Install pnpm dependencies |
| `make build` | Compile TypeScript |
| `make lint` | Run ESLint |
| `make format` | Run Prettier |
| `make test` | Run unit tests |
| `make test-cov` | Run tests with coverage |
| `make test-e2e` | Run end-to-end tests |

## Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Auto-generated |
| name | string | |
| email | string | Unique |
| phoneNumber | string | Unique, 11 chars |
| role | enum | `admin` \| `user` |
| password | string | bcrypt hashed, excluded from responses |
| createdAt / updatedAt | timestamp | Auto-managed |
| deletedAt | timestamp | Soft delete |

### GroceryItem

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Auto-generated |
| name | string | |
| description | string | Optional |
| price | decimal(10,2) | |
| quantity | integer | Available stock |
| isActive | boolean | Default `true` |

### Order

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Auto-generated |
| userId | UUID | FK → User |
| totalAmount | decimal(10,2) | Calculated at creation |
| status | enum | `PENDING` \| `CONFIRMED` \| `DELIVERED` \| `CANCELLED` |
| items | OrderItem[] | Eager-loaded, cascade delete |

Creating an order validates stock availability and deducts inventory automatically.

### OrderItem

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Auto-generated |
| orderId | UUID | FK → Order |
| groceryItemId | UUID | FK → GroceryItem |
| quantity | integer | Min 1 |
| unitPrice | decimal(10,2) | Snapshot of price at order time |

## API Documentation

Interactive Swagger UI is available at:

```
http://localhost:5004/docs
```

All endpoints are documented with request/response schemas, required headers, and authentication requirements.

## License

MIT
