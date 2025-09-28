const express = require('express');
const { body, validationResult } = require('express-validator');
const NormalInquiry = require('../models/NormalInquiry');
const auth = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Submit normal inquiry (public)
router.post('/submit', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
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

    const inquiry = new NormalInquiry(req.body);
    await inquiry.save();

    // Send response immediately without waiting for email
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: {
        id: inquiry._id,
        status: inquiry.status
      }
    });

    // Send email notification asynchronously (non-blocking)
    setImmediate(async () => {
      try {
        await emailService.sendNormalInquiryNotification(inquiry);
        console.log('✅ Normal inquiry notification sent successfully');
      } catch (emailError) {
        console.log('⚠️ Email notification skipped:', emailError.message);
        // Don't fail the request if email fails
      }
    });
  } catch (error) {
    console.error('Normal inquiry submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry'
    });
  }
});

// Get all normal inquiries (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const inquiries = await NormalInquiry.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await NormalInquiry.countDocuments(filter);

    res.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get normal inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch normal inquiries'
    });
  }
});

// Get single normal inquiry (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const inquiry = await NormalInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Normal inquiry not found'
      });
    }

    res.json({
      success: true,
      data: { inquiry }
    });
  } catch (error) {
    console.error('Get normal inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch normal inquiry'
    });
  }
});

// Update normal inquiry status (admin only)
router.put('/:id', auth, [
  body('status').isIn(['pending', 'processing', 'completed', 'cancelled']),
  body('adminNotes').optional().trim()
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

    const inquiry = await NormalInquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Normal inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Normal inquiry updated successfully',
      data: { inquiry }
    });
  } catch (error) {
    console.error('Update normal inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update normal inquiry'
    });
  }
});

// Delete normal inquiry (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const inquiry = await NormalInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Normal inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Normal inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete normal inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete normal inquiry'
    });
  }
});

module.exports = router;
