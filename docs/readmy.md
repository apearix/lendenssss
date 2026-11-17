# Lenden Project Documentation

Lenden is a personal money-tracking application. Users can create an account, set a password, manage people, record transactions, view balances/activity, export records, change language, and delete their account.

## Project structure

~~~text
Len-Den/
├── docs/                  # Project documentation
├── len-den-nextjs/        # Next.js frontend
└── lenden-backend/        # NestJS API + Prisma + PostgreSQL
~~~

## Technology stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript, JWT authentication
- Database: PostgreSQL with Prisma ORM
- Email OTP: Brevo Transactional Email API

## Local URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Quick start

Open two terminals:

~~~powershell
cd F:\Next_Js\Len-Den\lenden-backend
npm install
npm run start:dev
~~~

~~~powershell
cd F:\Next_Js\Len-Den\len-den-nextjs
npm install
npm run dev
~~~

The backend .env must contain a valid DATABASE_URL, JWT_SECRET, BREVO_API_KEY, BREVO_SENDER_EMAIL, and BREVO_SENDER_NAME. Never commit real API keys or passwords.

## Documentation index

- testing.md — manual and build testing checklist
- project-flow.md — application flow from registration to account deletion
- api.md — backend API reference
- plan-roadmap.md — completed work and future roadmap
