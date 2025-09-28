const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Check if email configuration is available
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email configuration not found. Please set SMTP_USER and SMTP_PASS environment variables.');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  productInquiry: (inquiry) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New Product Inquiry</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Eloska Luxe Showcase</p>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <h2 style="color: #8B0000; margin-top: 0;">Customer Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="mailto:${inquiry.email}" style="color: #8B0000;">${inquiry.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="tel:${inquiry.phone}" style="color: #8B0000;">${inquiry.phone}</a></td>
          </tr>
          ${inquiry.company ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Company:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.company}</td>
          </tr>
          ` : ''}
        </table>

        <h2 style="color: #8B0000; margin-top: 20px;">Product Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">Product Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.productName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Product Code:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.productCode}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Category:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.category}</td>
          </tr>
          ${inquiry.subcategory ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Subcategory:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.subcategory}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Quantity:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.quantity}</td>
          </tr>
        </table>

        <h2 style="color: #8B0000; margin-top: 20px;">Message</h2>
        <div style="background: white; padding: 15px; border-left: 4px solid #8B0000; margin: 10px 0;">
          <p style="margin: 0; line-height: 1.6;">${inquiry.message}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Submitted:</strong> ${new Date(inquiry.createdAt).toLocaleString()}<br>
            <strong>Status:</strong> ${inquiry.status}
          </p>
        </div>
      </div>
      
      <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">This inquiry was submitted through the Eloska Luxe Showcase website.</p>
        <p style="margin: 5px 0 0 0;">Please respond to the customer as soon as possible.</p>
      </div>
    </div>
  `,

  normalInquiry: (inquiry) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New Contact Inquiry</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Eloska Luxe Showcase</p>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <h2 style="color: #8B0000; margin-top: 0;">Customer Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="mailto:${inquiry.email}" style="color: #8B0000;">${inquiry.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="tel:${inquiry.phone}" style="color: #8B0000;">${inquiry.phone}</a></td>
          </tr>
          ${inquiry.company ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Company:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.company}</td>
          </tr>
          ` : ''}
        </table>

        <h2 style="color: #8B0000; margin-top: 20px;">Inquiry Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">Subject:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.subject}</td>
          </tr>
        </table>

        <h2 style="color: #8B0000; margin-top: 20px;">Message</h2>
        <div style="background: white; padding: 15px; border-left: 4px solid #8B0000; margin: 10px 0;">
          <p style="margin: 0; line-height: 1.6;">${inquiry.message}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Submitted:</strong> ${new Date(inquiry.createdAt).toLocaleString()}<br>
            <strong>Status:</strong> ${inquiry.status}
          </p>
        </div>
      </div>
      
      <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">This inquiry was submitted through the Eloska Luxe Showcase website.</p>
        <p style="margin: 5px 0 0 0;">Please respond to the customer as soon as possible.</p>
      </div>
    </div>
  `,

  newsletterSubscription: (email) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New Newsletter Subscription</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Eloska Luxe Showcase</p>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <h2 style="color: #8B0000; margin-top: 0;">Subscriber Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="mailto:${email.email}" style="color: #8B0000;">${email.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Status:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email.status}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Source:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email.source}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Subscribed:</strong> ${new Date(email.subscribedAt).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">This subscription was made through the Eloska Luxe Showcase website.</p>
        <p style="margin: 5px 0 0 0;">The subscriber will receive updates about new products and offers.</p>
      </div>
    </div>
  `
};

// Email service functions
const emailService = {
  // Send product inquiry notification
  sendProductInquiryNotification: async (inquiry) => {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: `"Eloska Luxe Showcase" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || 'admin@eloska.com',
        subject: `New Product Inquiry - ${inquiry.productName}`,
        html: emailTemplates.productInquiry(inquiry)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Product inquiry notification sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send product inquiry notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Send normal inquiry notification
  sendNormalInquiryNotification: async (inquiry) => {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: `"Eloska Luxe Showcase" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || 'admin@eloska.com',
        subject: `New Contact Inquiry - ${inquiry.subject}`,
        html: emailTemplates.normalInquiry(inquiry)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Normal inquiry notification sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send normal inquiry notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Send newsletter subscription notification
  sendNewsletterSubscriptionNotification: async (email) => {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: `"Eloska Luxe Showcase" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || 'admin@eloska.com',
        subject: 'New Newsletter Subscription',
        html: emailTemplates.newsletterSubscription(email)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Newsletter subscription notification sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send newsletter subscription notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Test email configuration
  testEmailConfiguration: async () => {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: `"Eloska Luxe Showcase" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || 'admin@eloska.com',
        subject: 'Email Configuration Test',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #8B0000;">Email Configuration Test</h2>
            <p>This is a test email to verify that the email service is working correctly.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email configuration test successful:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Email configuration test failed:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = emailService;
