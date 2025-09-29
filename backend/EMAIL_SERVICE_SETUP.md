# Email Service Setup for Render Deployment

## 🚀 Overview
This guide explains how to set up reliable email services for your Eloska backend on Render. The system now supports multiple email providers with automatic fallback.

## 📧 Email Service Priority
1. **Gmail SMTP** (Primary) - Uses your existing Gmail credentials
2. **SendGrid** (Fallback) - Professional email service
3. **Mailgun** (Fallback) - Alternative email service
4. **Console Logging** (Final Fallback) - Always works

## 🔧 Environment Variables for Render

### Required Variables (Already Set)
```env
SMTP_USER=keyur9637@gmail.com
SMTP_PASS=oyvytxxvjhaliphq
NOTIFICATION_EMAIL=keyur9637@gmail.com
```

### Optional Variables (For Better Reliability)
Add these to your Render environment variables:

#### SendGrid (Recommended)
```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

#### Mailgun (Alternative)
```env
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain_here
```

## 🛠️ How to Set Up SendGrid (Recommended)

### Step 1: Create SendGrid Account
1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for a free account (100 emails/day free)
3. Verify your email address

### Step 2: Create API Key
1. Go to Settings → API Keys
2. Click "Create API Key"
3. Choose "Restricted Access"
4. Give it "Mail Send" permissions
5. Copy the API key

### Step 3: Add to Render
1. Go to your Render dashboard
2. Select your backend service
3. Go to Environment tab
4. Add: `SENDGRID_API_KEY=your_api_key_here`
5. Save and redeploy

## 🛠️ How to Set Up Mailgun (Alternative)

### Step 1: Create Mailgun Account
1. Go to [Mailgun.com](https://mailgun.com)
2. Sign up for a free account (5,000 emails/month free)
3. Verify your email address

### Step 2: Get API Credentials
1. Go to Domains section
2. Use the sandbox domain or add your own
3. Copy the API key and domain

### Step 3: Add to Render
1. Go to your Render dashboard
2. Select your backend service
3. Go to Environment tab
4. Add:
   - `MAILGUN_API_KEY=your_api_key_here`
   - `MAILGUN_DOMAIN=your_domain_here`
5. Save and redeploy

## 🔍 Current Email Service Status

### What's Working
- ✅ **Console Logging**: Always works, logs to Render logs
- ✅ **Gmail SMTP**: Should work with your existing credentials
- ⚠️ **SendGrid**: Add API key for better reliability
- ⚠️ **Mailgun**: Add credentials for alternative option

### What Happens When Emails Are Sent
1. **First**: Tries Gmail SMTP (3 different configurations)
2. **Second**: Tries SendGrid (if API key is set)
3. **Third**: Tries Mailgun (if credentials are set)
4. **Final**: Logs to console (always works)

## 📊 Monitoring Email Delivery

### Check Render Logs
1. Go to your Render dashboard
2. Select your backend service
3. Go to Logs tab
4. Look for email-related messages:
   - `✅ Product inquiry notification sent via SMTP`
   - `✅ Product inquiry notification sent via SendGrid`
   - `📧 Using console logging as final fallback`

### Test Email Function
You can test the email service by calling:
```bash
curl -X POST https://your-backend-url.onrender.com/api/test-email
```

## 🚨 Troubleshooting

### Common Issues
1. **SMTP Timeout**: Normal on Render, system will try alternatives
2. **Gmail Blocked**: Use SendGrid or Mailgun instead
3. **No Emails Received**: Check console logs for fallback messages

### Solutions
1. **Add SendGrid**: Most reliable option for Render
2. **Check Spam Folder**: Emails might be filtered
3. **Verify Email Address**: Make sure NOTIFICATION_EMAIL is correct

## 💡 Recommendations

### For Production
1. **Use SendGrid**: Most reliable and professional
2. **Set up proper domain**: For better deliverability
3. **Monitor logs**: Check email delivery status

### For Development
1. **Console logging is fine**: You'll see all emails in logs
2. **Gmail SMTP works locally**: Good for testing
3. **Add SendGrid later**: When ready for production

## 🎯 Quick Setup (5 minutes)

1. **Sign up for SendGrid** (free)
2. **Create API key** with Mail Send permission
3. **Add to Render**: `SENDGRID_API_KEY=your_key`
4. **Redeploy** your backend
5. **Test** by submitting an inquiry

Your email service will now be much more reliable! 🚀
