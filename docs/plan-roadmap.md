# Lenden Plan and Roadmap

## Current release status

### Completed

- Email-based registration OTP
- Four-box, 4-digit OTP UI
- Password creation after registration
- Email/password login
- Forgot password flow
- Password visibility eye icon
- Dashboard, People, Activity, Entry, Profile screens
- Add, edit, and delete people
- Common delete confirmation modal
- Logout confirmation modal
- Delete account confirmation with delete text verification
- Account cascade deletion for people and transactions
- Brevo transactional email integration
- English/Hindi language selection
- Disabled App Lock option
- Notifications page UI
- Empty states for People and Activity
- Dashboard logo update
- Export records entry point

## Phase 1: Stabilize testing

- Test all auth flows with real Brevo emails.
- Add OTP expiry and resend cooldown.
- Add rate limiting for OTP requests.
- Improve server-side validation and consistent error messages.
- Add automated API tests for auth, contacts, transactions, and account deletion.
- Remove any unused legacy SMTP configuration.

## Phase 2: Production readiness

- Use separate development and production environment variables.
- Rotate any exposed API keys and keep secrets out of Git.
- Add production PostgreSQL and migration workflow.
- Configure Brevo sender/domain authentication.
- Add structured logging and error monitoring.
- Add CORS, secure cookies/token strategy, and request throttling.
- Add backups and account recovery policy.

## Phase 3: Product features

- Notifications backed by database and API.
- Transaction reminders and due-date notifications.
- Search and sorting for People and Activity.
- Better reports with date range and PDF/CSV export.
- Profile avatar support.
- Fully translated validation, error, and confirmation messages.

## Phase 4: App security

- Optional App Lock using device PIN or biometric authentication.
- Refresh tokens and session management.
- Login activity and active-session logout.
- Password reset abuse protection.
- Audit trail for account and transaction changes.

## Phase 5: Deployment

- Deploy backend API and PostgreSQL.
- Deploy Next.js frontend.
- Set production NEXT_PUBLIC_API_URL.
- Configure HTTPS and custom domain.
- Configure production Brevo sender.
- Run smoke tests after deployment.
- Monitor email delivery, API errors, database health, and performance.

## Definition of done for production

- All builds pass.
- No secrets are committed.
- Registration and password recovery work with real email.
- Database migrations are repeatable.
- Destructive actions are confirmed and tested.
- API errors are logged without exposing sensitive data.
- Backup and rollback plans are documented.
