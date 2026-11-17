# API Reference

Base URL:

~~~text
http://localhost:3001
~~~

Protected routes require:

~~~http
Authorization: Bearer <JWT>
Content-Type: application/json
~~~

## Authentication

### Send email OTP

~~~http
POST /auth/send-otp
~~~

Request:

~~~json
{ "email": "user@example.com" }
~~~

### Verify OTP

~~~http
POST /auth/verify-otp
~~~

Request:

~~~json
{
  "email": "user@example.com",
  "phoneNumber": "+919876543210",
  "otp": "4821",
  "fullName": "User Name"
}
~~~

Returns a JWT session and user object.

### Login

~~~http
POST /auth/login
~~~

Request:

~~~json
{ "email": "user@example.com", "password": "password123" }
~~~

### Set password

~~~http
POST /auth/set-password
~~~

Protected. Request:

~~~json
{ "password": "password123" }
~~~

### Reset password

~~~http
POST /auth/reset-password
~~~

Request:

~~~json
{
  "email": "user@example.com",
  "otp": "4821",
  "password": "newpassword123"
}
~~~

## Users

All user routes are protected.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /users/me | Get current profile |
| PATCH | /users/me | Update name, language, or app-lock setting |
| DELETE | /users/me | Permanently delete account and related data |

## Contacts / people

All contact routes are protected.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /contacts | List current user's people |
| GET | /contacts/:id | Get one person and transactions |
| POST | /contacts | Add a person |
| PATCH | /contacts/:id | Edit a person |
| DELETE | /contacts/:id | Delete a person |

Example create request:

~~~json
{
  "fullName": "Amit",
  "phoneNumber": "+919876543210",
  "note": "Office"
}
~~~

## Transactions

All transaction routes are protected.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /transactions/add-entry | Add a money entry |
| GET | /transactions/by-contact/:contactId | List entries for a person |
| GET | /transactions/activity | List activity with optional filters |

Example entry:

~~~json
{
  "contactId": "contact-uuid",
  "type": "I_GAVE",
  "amount": 500,
  "date": "2026-11-15",
  "note": "Lunch",
  "dueDate": "2026-11-20"
}
~~~

Activity query examples:

~~~text
GET /transactions/activity
GET /transactions/activity?filter=to_receive
GET /transactions/activity?filter=to_pay&month=2026-11
~~~

## Dashboard and reports

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /dashboard/summary | Dashboard totals and recent data |
| GET | /reports/statement | Statement data |
| GET | /reports/export-records | Export record download URL |

## Error format

The frontend reads the backend message field and displays it to the user:

~~~json
{
  "statusCode": 400,
  "message": "Invalid OTP entered",
  "error": "Bad Request"
}
~~~
