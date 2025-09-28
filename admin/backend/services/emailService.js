const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send product inquiry notification
const sendProductInquiryNotification = async (inquiry) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || 'admin@eloska.com',
      subject: `New Product Inquiry - ${inquiry.productName}`,
      html: `
        <h2>New Product Inquiry Received</h2>
        <p><strong>Product:</strong> ${inquiry.productName}</p>
        <p><strong>Code:</strong> ${inquiry.productCode}</p>
        <p><strong>Category:</strong> ${inquiry.category}</p>
        <p><strong>Subcategory:</strong> ${inquiry.subcategory || 'N/A'}</p>
        <p><strong>Quantity:</strong> ${inquiry.quantity}</p>
        <hr>
        <p><strong>Customer Details:</strong></p>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone}</p>
        <p><strong>Company:</strong> ${inquiry.company || 'N/A'}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${inquiry.message}</p>
        <hr>
        <p><strong>Submitted:</strong> ${new Date(inquiry.createdAt).toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Product inquiry email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send product inquiry email:', error.message);
    throw error;
  }
};

// Send normal inquiry notification
const sendNormalInquiryNotification = async (inquiry) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || 'admin@eloska.com',
      subject: `New Contact Inquiry - ${inquiry.subject}`,
      html: `
        <h2>New Contact Inquiry Received</h2>
        <p><strong>Subject:</strong> ${inquiry.subject}</p>
        <hr>
        <p><strong>Customer Details:</strong></p>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone}</p>
        <p><strong>Company:</strong> ${inquiry.company || 'N/A'}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${inquiry.message}</p>
        <hr>
        <p><strong>Submitted:</strong> ${new Date(inquiry.createdAt).toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Normal inquiry email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send normal inquiry email:', error.message);
    throw error;
  }
};

// Send newsletter subscription notification
const sendNewsletterSubscriptionNotification = async (data) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || 'admin@eloska.com',
      subject: 'New Newsletter Subscription',
      html: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subscribed:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Newsletter subscription email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send newsletter subscription email:', error.message);
    throw error;
  }
};

module.exports = {
  sendProductInquiryNotification,
  sendNormalInquiryNotification,
  sendNewsletterSubscriptionNotification
};
