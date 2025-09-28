const express = require('express');
const { body, validationResult } = require('express-validator');
const NewsletterEmail = require('../models/NewsletterEmail');
const auth = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Subscribe to newsletter (public)
router.post('/subscribe', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Check if email already exists
    const existingEmail = await NewsletterEmail.findOne({ email });
    if (existingEmail) {
      if (existingEmail.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed'
        });
      } else {
        // Reactivate subscription
        existingEmail.status = 'active';
        existingEmail.subscribedAt = new Date();
        existingEmail.unsubscribedAt = undefined;
        await existingEmail.save();
      }
    } else {
      // Create new subscription
      const newsletterEmail = new NewsletterEmail({ email });
      await newsletterEmail.save();
    }

    // Send response immediately without waiting for email
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

    // Send email notification asynchronously (non-blocking)
    setImmediate(async () => {
      try {
        await emailService.sendNewsletterSubscriptionNotification({ email });
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
      message: 'Failed to subscribe to newsletter'
    });
  }
});

// Get all newsletter emails (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.email = { $regex: search, $options: 'i' };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const emails = await NewsletterEmail.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await NewsletterEmail.countDocuments(filter);

    res.json({
      success: true,
      data: {
        emails,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get newsletter emails error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch newsletter emails'
    });
  }
});

// Get single newsletter email (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const email = await NewsletterEmail.findById(req.params.id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter email not found'
      });
    }

    res.json({
      success: true,
      data: { email }
    });
  } catch (error) {
    console.error('Get newsletter email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch newsletter email'
    });
  }
});

// Update newsletter email status (admin only)
router.put('/:id', auth, [
  body('status').isIn(['active', 'unsubscribed', 'bounced']),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updateData = { ...req.body };
    if (updateData.status === 'unsubscribed') {
      updateData.unsubscribedAt = new Date();
    }

    const email = await NewsletterEmail.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter email not found'
      });
    }

    res.json({
      success: true,
      message: 'Newsletter email updated successfully',
      data: { email }
    });
  } catch (error) {
    console.error('Update newsletter email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update newsletter email'
    });
  }
});

// Delete newsletter email (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const email = await NewsletterEmail.findByIdAndDelete(req.params.id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter email not found'
      });
    }

    res.json({
      success: true,
      message: 'Newsletter email deleted successfully'
    });
  } catch (error) {
    console.error('Delete newsletter email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete newsletter email'
    });
  }
});

module.exports = router;
