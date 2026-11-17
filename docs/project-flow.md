# Project Flow: Start to End

## 1. Application start

The Next.js frontend runs on port 3000. It calls the NestJS backend on port 3001 using NEXT_PUBLIC_API_URL.

The backend reads PostgreSQL and Brevo settings from its .env file. Prisma connects the application to the database.

## 2. Registration flow

~~~text
Register page
  → user enters email + mobile
  → frontend calls POST /auth/send-otp
  → backend creates a random 4-digit OTP
  → backend stores the OTP temporarily
  → Brevo sends the OTP to the email
  → user enters the OTP
  → frontend calls POST /auth/verify-otp
  → backend creates/finds the user
  → backend returns a JWT access token
  → frontend stores the session
  → Create password page
  → frontend calls POST /auth/set-password
  → Dashboard
~~~

Registration uses email OTP. The mobile number is stored as profile/contact information and is not used for OTP delivery.

## 3. Authentication

The frontend stores the JWT access token in localStorage or sessionStorage. Every protected API request adds:

~~~http
Authorization: Bearer <access-token>
~~~

The JWT guard validates the token and provides the current user ID to protected controllers.

## 4. Login flow

~~~text
Login page
  → email + password
  → POST /auth/login
  → backend verifies the password hash
  → JWT returned
  → session saved
  → dashboard opened
~~~

Forgot password uses email OTP, then updates the password with POST /auth/reset-password.

## 5. Main app flow

### Dashboard

The dashboard calls /dashboard/summary and shows the user greeting, net balance, receive/pay totals, and recent people.

### People

The People page calls /contacts. A person can be added, edited, viewed, or deleted. Each person has their own transactions.

### Transactions

The Entry page calls /transactions/add-entry. Activity calls /transactions/activity and applies filters on the server.

### Profile

Profile data is loaded from /users/me. Profile updates use PATCH /users/me. Language preference is stored both in the backend and local browser storage.

### Notifications

The Notifications page currently provides the UI empty state. Notification data and a notification API are planned for a future phase.

## 6. Delete account flow

~~~text
Profile
  → Delete account
  → common confirmation modal
  → warning explains permanent deletion
  → user types delete
  → DELETE /users/me
  → user, contacts, and transactions are deleted
  → local session is cleared
  → user returns to welcome page
~~~

Database relations use cascade deletion for the user's contacts and transactions.

## 7. Data model

- User: account, email, phone, password hash, language, app-lock preference
- Contact: a person belonging to a user
- Transaction: money entry connected to both a user and a contact
- EntryType: I_GAVE or I_TOOK
