# Testing Guide

## 1. Start the project

Terminal 1:

~~~powershell
cd F:\Next_Js\Len-Den\lenden-backend
npm run start:dev
~~~

Terminal 2:

~~~powershell
cd F:\Next_Js\Len-Den\len-den-nextjs
npm run dev
~~~

Open http://localhost:3000.

## 2. Environment checks

Backend .env should contain:

~~~env
PORT=3001
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_long_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_brevo_sender_email
BREVO_SENDER_NAME=Lenden
~~~

The sender email must be verified in Brevo. Restart the backend after changing .env.

## 3. Registration test

1. Open /register.
2. Enter a valid email and 10-digit mobile number.
3. Click the OTP button.
4. Confirm that a random 4-digit OTP arrives in the email Inbox or Spam folder.
5. Enter the received OTP in the four boxes.
6. Create a password of at least 8 characters.
7. Confirm that the app redirects to the dashboard.

The old test OTP 1234 is not valid anymore. Only the latest email OTP should work.

## 4. Login and password tests

- Login with the registered email and password.
- Try a wrong password and confirm an error is shown.
- Open Forgot password.
- Request a new email OTP.
- Enter the OTP and set a new password.
- Login with the new password.
- Check that password text is hidden and the eye icon toggles visibility.

## 5. People and transaction tests

- Add a person.
- Confirm the person appears on the People page.
- Open the person and verify the three-dot menu.
- Edit the person and return using Back; confirm the menu is closed.
- Delete the person using the common confirmation modal.
- Add a money entry.
- Verify the dashboard balance and Activity page update.
- Test All, To receive, and To pay filters.

## 6. Profile tests

- Edit profile name.
- Change English/Hindi language and verify shared labels update.
- Confirm App lock is disabled.
- Open Notifications page.
- Test Logout confirmation.
- Open Delete account, read the warning, type delete, and confirm the button is enabled.

Do not confirm account deletion on a real account unless permanent deletion is intended.

## 7. Build checks

~~~powershell
cd F:\Next_Js\Len-Den\lenden-backend
npm run build
~~~

~~~powershell
cd F:\Next_Js\Len-Den\len-den-nextjs
npm run build
~~~

## 8. Common problems

### Unable to send verification email

- Confirm BREVO_SENDER_EMAIL is a verified Brevo sender.
- Confirm BREVO_API_KEY is valid and has transactional email access.
- Confirm the backend .env lines are separate; do not join two variables on one line.
- Restart the backend.
- Check the backend terminal for the Brevo response.

### Database error

- Confirm PostgreSQL is running.
- Check DATABASE_URL.
- Run npx prisma generate in the backend folder.

### Frontend cannot reach API

Confirm len-den-nextjs/.env.local contains:

~~~env
NEXT_PUBLIC_API_URL=http://localhost:3001
~~~
