const express = require('express');
const { body, validationResult, query } = require('express-validator');
const NewsletterEmail = require('../models/NewsletterEmail');
// const auth = require('../middleware/auth'); // Removed - no authentication needed
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const nodemailer = require('nodemailer');
const emailService = require('../services/emailService');


const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter (public)
// @access  Public
router.post('/subscribe', [
  body('email').isEmail().withMessage('Please enter a valid email address')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    let newsletterEmail = await NewsletterEmail.findOne({ email });

    if (newsletterEmail) {
      if (newsletterEmail.status === 'active') {
        return res.status(409).json({
          success: false,
          message: 'Email is already subscribed and active'
        });
      } else {
        // Reactivate if previously unsubscribed or bounced
        newsletterEmail.status = 'active';
        newsletterEmail.subscribedAt = new Date();
        newsletterEmail.unsubscribedAt = null;
        await newsletterEmail.save();
        return res.json({
          success: true,
          message: 'Email reactivated successfully'
        });
      }
    }

        newsletterEmail = new NewsletterEmail({ 
          email, 
          status: 'active',
          source: 'website'
        });
        await newsletterEmail.save();

        // Send response immediately without waiting for email
        res.status(201).json({
          success: true,
          message: 'Successfully subscribed to newsletter'
        });

        // Send email notification asynchronously (non-blocking)
        setImmediate(async () => {
          try {
            await emailService.sendNewsletterSubscriptionNotification(newsletterEmail);
            console.log('✅ Newsletter subscription notification sent successfully');
          } catch (emailError) {
            console.log('⚠️ Email notification skipped:', emailError.message);
            // Don't fail the request if email fails
          }
        });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Auth middleware removed - admin panel now works without authentication

// @route   GET /api/newsletter
// @desc    Get all newsletter emails with pagination and filters
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['active', 'unsubscribed', 'bounced']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;


    // Build filter object
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.search) {
      filter.email = { $regex: req.query.search, $options: 'i' };
    }

    // Build sort object
    const sort = { subscribedAt: -1 };

    const [emails, total] = await Promise.all([
      NewsletterEmail.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      NewsletterEmail.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        data: emails,
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get newsletter emails error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/newsletter/:id
// @desc    Get single newsletter email
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const email = await NewsletterEmail.findById(req.params.id);
    
    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    res.json({
      success: true,
      data: email
    });
  } catch (error) {
    console.error('Get newsletter email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/newsletter/:id/status
// @desc    Update email status
// @access  Private
router.patch('/:id/status', [
  body('status').isIn(['active', 'unsubscribed', 'bounced'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { status } = req.body;
    const updateData = { status };

    // If unsubscribing, set unsubscribedAt
    if (status === 'unsubscribed') {
      updateData.unsubscribedAt = new Date();
    }


    const email = await NewsletterEmail.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: email
    });
  } catch (error) {
    console.error('Update email status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/newsletter/bulk-update
// @desc    Bulk update email status
// @access  Private
router.patch('/bulk-update', [
  body('ids').isArray().notEmpty(),
  body('status').isIn(['active', 'unsubscribed', 'bounced'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { ids, status } = req.body;
    const updateData = { status };

    // If unsubscribing, set unsubscribedAt
    if (status === 'unsubscribed') {
      updateData.unsubscribedAt = new Date();
    }

    const result = await NewsletterEmail.updateMany(
      { _id: { $in: ids } },
      updateData
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} emails updated successfully`
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/newsletter/:id
// @desc    Delete newsletter email
// @access  Private
router.delete('/:id', async (req, res) => {
  try {

    const email = await NewsletterEmail.findByIdAndDelete(req.params.id);
    
    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    res.json({
      success: true,
      message: 'Email deleted successfully'
    });
  } catch (error) {
    console.error('Delete email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/newsletter/send
// @desc    Send newsletter to subscribers
// @access  Private
router.post('/send', [
  body('subject').isString().isLength({ min: 1, max: 200 }),
  body('content').isString().isLength({ min: 1, max: 10000 }),
  body('recipients').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { subject, content, recipients } = req.body;

    // Get active subscribers if no specific recipients
    let emailsToSend = recipients;
    if (recipients.length === 0) {
      const activeSubscribers = await NewsletterEmail.find({ status: 'active' }).select('email');
      emailsToSend = activeSubscribers.map(sub => sub.email);
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send emails
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: emailsToSend.join(', '),
      subject: subject,
      html: content
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Newsletter sent to ${emailsToSend.length} subscribers`
    });
  } catch (error) {
    console.error('Send newsletter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send newsletter'
    });
  }
});

// @route   GET /api/newsletter/export
// @desc    Export newsletter emails to CSV
// @access  Private
router.get('/export', async (req, res) => {
  try {
    // Build filter object
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.search) {
      filter.email = { $regex: req.query.search, $options: 'i' };
    }

    const emails = await NewsletterEmail.find(filter).sort({ subscribedAt: -1 }).lean();

    // Create CSV
    const csvWriter = createCsvWriter({
      path: 'temp-newsletter-emails.csv',
      header: [
        { id: 'email', title: 'Email' },
        { id: 'status', title: 'Status' },
        { id: 'subscribedAt', title: 'Subscribed At' },
        { id: 'unsubscribedAt', title: 'Unsubscribed At' },
        { id: 'source', title: 'Source' },
        { id: 'tags', title: 'Tags' }
      ]
    });

    await csvWriter.writeRecords(emails);

    res.download('temp-newsletter-emails.csv', `newsletter-emails-${new Date().toISOString().split('T')[0]}.csv`, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up temp file
      require('fs').unlinkSync('temp-newsletter-emails.csv');
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Export failed'
    });
  }
});

module.exports = router;
