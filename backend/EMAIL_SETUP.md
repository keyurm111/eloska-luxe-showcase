# Email Configuration Setup

To enable email notifications for new inquiries, you need to configure the following environment variables in your `.env` file:

## Required Environment Variables

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Email (where notifications will be sent)
ADMIN_EMAIL=admin@eloska.com
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

## Testing Email Configuration

You can test the email configuration by making a POST request to:
```
POST http://localhost:5004/api/test-email
```

## Email Templates

The system sends beautifully formatted HTML emails with:
- **Product Inquiries**: Customer details, product information, and message
- **Contact Inquiries**: Customer details, subject, and message  
- **Newsletter Subscriptions**: Subscriber email and details

All emails include:
- Eloska branding and colors
- Professional layout
- Clickable email and phone links
- Timestamp and status information
