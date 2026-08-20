🛒 Shopping Center Management System
A modern Shopping Center Management System built with NestJS, React, React Native, and PostgreSQL.
Designed for small and medium retail shops, supermarkets, minimarkets, pharmacies, and hardware stores to manage inventory, sales, purchases, pricing, customers, suppliers, and reporting from both web and mobile apps.
Table of Contents
• Features
• Technology Stack
• Project Structure
• Prerequisites
• Installation
• Environment Variables
• API Documentation
• Development Roadmap
• Future Enhancements
• Contributing
• License
• Author
Features
Authentication & Access JWT authentication with refresh tokens, role-based access control (RBAC), user management, password reset, and a secured API surface.
Dashboard Sales summary, inventory summary, low-stock alerts, top-selling products, recent transactions, and revenue overview.
Product Management Product master data, categories, brands, units of measure, barcode support, product images, and search.
Inventory Management Stock balance, stock movement, stock adjustment, stock transfer, inventory transactions, inventory valuation, and low-stock notifications.
Purchase Management Suppliers, purchase orders, goods receipt, purchase returns, and purchase history.
Sales Management Point of Sale (POS), sales invoices, sales returns, discounts, multiple payment methods, and receipt printing.
Pricing Purchase price, selling price, wholesale price, promotional pricing, and full price history.
Customer Management Customer registration and history, loyalty program, and credit sales.
Reports Sales, purchase, inventory, profit, product movement, and customer reports.
Notifications Low-stock alerts, expiry alerts, daily sales summaries, and purchase notifications.
Mobile Application Product lookup, barcode scanner, stock inquiry, sales, dashboard, and notifications.
Technology Stack
Layer Stack
Backend NestJS, TypeScript, Prisma ORM, PostgreSQL, JWT Auth, Swagger
Frontend (Web) React, TypeScript, Vite, Material UI, React Query, React Hook Form, Axios
Mobile React Native, Expo, React Query, React Native Paper
Database PostgreSQL

Project Structure
shopping-center-system
│
├── backend
│ ├── prisma
│ ├── src
│ │ ├── common
│ │ ├── config
│ │ ├── database
│ │ ├── modules
│ │ │ ├── auth
│ │ │ ├── users
│ │ │ ├── roles
│ │ │ ├── shops
│ │ │ ├── branches
│ │ │ ├── categories
│ │ │ ├── brands
│ │ │ ├── units
│ │ │ ├── products
│ │ │ ├── suppliers
│ │ │ ├── purchases
│ │ │ ├── inventory
│ │ │ ├── sales
│ │ │ ├── pricing
│ │ │ ├── reports
│ │ │ ├── dashboard
│ │ │ └── settings
│ │ ├── app.module.ts
│ │ └── main.ts
│ └── test
│
├── frontend
│ ├── web
│ └── mobile
│
├── shared # Types/utilities shared across web, mobile, and backend
├── database # Migrations, seeds, schema references
├── docs # Additional documentation
├── docker # Dockerfiles and compose configs for local/prod environments
├── scripts # Setup and maintenance scripts
└── README.md
Prerequisites
• Node.js 18 or later
• npm 9+ (or pnpm/yarn if preferred)
• PostgreSQL 14 or later
• (Optional) Docker & Docker Compose for containerized setup
• (Mobile) Expo CLI and a device/simulator for testing
Installation
Clone the repository
git clone https://github.com/tasirnesa/Shopping-center.git
cd shopping-center-system
Backend
cd backend
npm install
npm run start:dev
Frontend (Web)
cd frontend/web
npm install
npm run dev
Mobile
cd frontend/mobile
npm install
npx expo start
Environment Variables
Create a .env file in backend/ based on the example below:

# PostgreSQL connection string

DATABASE_URL=postgresql://user:password@localhost:5432/shopping_center

# Auth secrets — use long, random values in production

JWT_SECRET=
JWT_REFRESH_SECRET=

# Server

PORT=3000
NODE_ENV=development

# File uploads (product images, receipts, etc.)

UPLOAD_PATH=./uploads

Containerized setup

Docker Compose mirrors the Kubernetes workloads with `frontend`, `backend`, and
`postgres` services. Copy `.env.example` to `.env` and replace its JWT values.
The web application is available at http://localhost:8080 and the API is
available at http://localhost:3000.

```bash
docker compose up --build
```

The Compose configuration applies the Prisma schema at startup and persists both
PostgreSQL data and uploaded files in named Docker volumes. Do not use the
default JWT values outside local development; set `JWT_SECRET` and
`JWT_REFRESH_SECRET` in `docker-compose.yml` or via your deployment tooling.

Kubernetes

The manifests in `k8s/` deploy PostgreSQL, the API, and two web replicas. Build
and publish the images, then replace the placeholder image names in
`k8s/backend.yaml` and `k8s/frontend.yaml` (`ghcr.io/your-org/...`) with your
registry paths and tags.
Update the values in the `shopping-center-secrets` Secret and the hostname in
`k8s/ingress.yaml` before deploying.

```bash
docker build -f backend/Dockerfile -t your-registry/shopping-center-backend:1.0.0 .
docker build -f web/Dockerfile -t your-registry/shopping-center-web:1.0.0 .
kubectl apply -f k8s/
```

The Kubernetes storage claims expect a default StorageClass. For multiple API
replicas, change the uploads claim to storage that supports `ReadWriteMany`, or
move uploads to object storage. The bundled PostgreSQL deployment is suitable
for development or small installations; use a managed PostgreSQL service for
production.
API Documentation
Swagger documentation is generated automatically once the backend is running:
(http://localhost:5173/)

---

Development Roadmap
Phase Scope
1 Authentication, user & role management, shop, branch, category, brand, unit
2 Product management, supplier management, inventory management, stock balance & adjustment
3 Purchase orders, goods receipt, purchase returns
4 Sales, POS, sales returns, receipt printing
5 Reports, dashboard, analytics
6 Mobile app, barcode scanner, notifications, offline support

---

Future Enhancements
• Multi-branch, multi-shop, and multi-warehouse support
• Customer loyalty program expansion
• SMS and email notifications
• AI-based sales prediction and demand forecasting
• Cloud backup
• Multi-currency and multi-language support
• Offline synchronization
Contributing

1. Fork the repository.
2. Create a feature branch (git checkout -b feature/shopping center).
3. Commit your changes with clear messages.
4. Push the branch and open a Pull Request.
   Please open an issue first for major changes, and make sure existing tests pass before submitting a PR.
   License
   This project is licensed under the MIT License.
   Author
   Taye Sirnesa
   tayesirnesa430@gmail.com
   Developed as a scalable, maintainable, production-ready retail management solution for modern shopping centers and retail businesses.
