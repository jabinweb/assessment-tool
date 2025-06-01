# Assessment Tool

## Gmail SMTP Setup

To enable email authentication, you need to set up Gmail SMTP with an App Password:

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Navigate to Security
- Enable 2-Step Verification if not already enabled

### 2. Generate App Password
- In Google Account settings, go to Security
- Under "Signing in to Google", click "App passwords"
- Select "Mail" as the app
- Copy the 16-character password generated

### 3. Environment Variables
Add these to your `.env.local` file:

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
```

**Important**: Use the App Password (16 characters) as `EMAIL_SERVER_PASSWORD`, NOT your regular Gmail password.

### 4. Alternative Email Providers
If you prefer not to use Gmail, you can use:
- **SendGrid**: More reliable for production
- **Mailgun**: Good for developers
- **Resend**: Modern email API
- **AWS SES**: Cost-effective for high volume

## Installation

```bash
npm install
npx prisma db push
npm run dev
```
