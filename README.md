# PGAS Test — Departments, Employees, Spendings (PostgreSQL + TanStack)

This repository is a small CRUD + reporting app built for the PGAS technical test.

It covers:

- Authentication + role-based access (Admin/User)
- CRUD for **Departments**, **Employees**, and **Spendings**
- Reporting pages (joined table, value-range report)
- Export report data to **Excel (.xlsx)** and **PDF**

---

## Tech stack (high level)

- **Frontend/Routes:** TanStack Router
- **Data fetching:** TanStack Query
- **Backend:** server routes in the same codebase (TanStack Router server handlers)
- **Database:** PostgreSQL
- **Excel export:** `exceljs`
- **PDF export:** `pdfkit`

---

## Prerequisites

- Bun for the runtime. Any runtime will do, but this project specifically use Bun from start to finish. Also, the script (inside `/script`) utilize Bun's ability to execute TypeScript directly. If you use other runtime, you might need to edit `package.json` and install some kind of adapter to execute .ts file.
- PostgreSQL (local or remote)
- A database user with permission to create tables / run SQL scripts

---

## Setup

### 1) Install dependencies

```bash
bun install
```

### 2) Configure environment variables

Create a `.env` file (or copy from `.env.example` if provided) and fill in the DB connection.

Typical variables (adjust to your project):

- `DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME`

> Note: the exact env var name depends on `#/db/db` implementation.

### 3) Initialize database

Run the SQL scripts (tables + seed) provided in the repo.

```bash
bun run db-setup
```

### 4) Run the app

```bash
bun run dev
```

Open the app in your browser (check terminal output for the URL).

---

## Test accounts

If seed data is included, use the accounts below.

- **Admin**
  - email: `admin@example.com`
  - password: `rahasia02`

- **User**
  - email: `user@example.com`
  - password: `rahasia01`

> If your seed uses different accounts, update this section accordingly.

---

# Task answers / Implementation notes (for PT PGAS)

This section maps the features in this repo to the test requirements.

## 1) Authentication + roles

- Endpoint used by UI: `/api/auth/me`
- UI routes require login; unauthenticated users are redirected / shown a login message.
- `requireUser()` is used on server handlers to protect API routes.
- Role-based restrictions are applied for operations that require admin privileges.

## 2) CRUD (bare query)

CRUD features are implemented for:

- Departments
- Employees
- Spendings

Database operations are done using **raw SQL** via `db.query(...)` with parameters (no ORM helpers for CRUD logic).

## 3) Search (triggered by button/Enter)

To reduce unnecessary requests, search is implemented as "commit search":

- User types into input (local state)
- Search is applied only when pressing **Search** or **Enter**

Search endpoints:

- `/api/departments?search=...` (ILIKE)
- `/api/employees?search=...` (ILIKE)

## 4) Joined spendings report (sorted by spending value ascending)

Report page:

- `/reports/spendings`

API:

- `/api/reports/spendings?sortBy=value&sortDir=asc`

This shows spendings with joined information:

- employee name
- department name
- spending date
- spending value

Sorting is handled by the query (server-side).

## 5) Spending report (2020–2025, filter by month range + value range)

Report page:

- `/reports/spending-value-range`

API:

- `/api/reports/spending-value-range?fromMonth=YYYY-MM&toMonth=YYYY-MM&min=&max=`

The report returns:

- Columns: **date** and **value**
- Period is limited to **2020-01 .. 2025-12** (as required)
- Filters:
  - month range (fromMonth/toMonth)
  - value range (min/max)

The SQL uses:

- `spending_date >= fromDate AND spending_date < toDateExclusive`
- `value >= min` and `value <= max` (when provided)

## 6) Export features (Excel + PDF)

Exports match **exactly what is on** the `/reports/spending-value-range` page with current filters.

### Excel export

- Endpoint: `/api/reports/spending-value-range.xlsx`
- Output: `.xlsx` file with columns **Date** and **Value**

### PDF export

- Endpoint: `/api/reports/spending-value-range/pdf`
- Output: simple table PDF (Date, Value)

---

## Useful routes summary

- CRUD pages:
  - `/departments`
  - `/employees`
  - `/spendings`

- Reports:
  - `/reports/spendings` (joined report)
  - `/reports/spending-value-range` (Ranged filter report)

- Export:
  - `/api/reports/spending-value-range/xlsx`
  - `/api/reports/spending-value-range/pdf`

---

## Notes / Checklist

- [x] Bare query used for DB operations (`db.query` with params)
- [x] Alerts/confirmations for update/delete (UI)
- [x] Join table sorted ascending by spending value (server-side)
- [x] Report covers 2020–2025 and filter works (month range + min/max)
- [x] Excel export works
- [x] PDF export works

---

## Screenshots

Screenshot of query executions and their result store in:

- `screenshots/`

---

## License

Apache-2.0
