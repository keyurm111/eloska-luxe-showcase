const express = require('express');
const { body, validationResult } = require('express-validator');
const ProductInquiry = require('../models/ProductInquiry');
const auth = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Submit product inquiry (public)
router.post('/submit', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('productName').trim().isLength({ min: 2 }).withMessage('Product name is required'),
  body('productCode').trim().isLength({ min: 1 }).withMessage('Product code is required'),
  body('category').trim().isLength({ min: 2 }).withMessage('Category is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
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

    const inquiry = new ProductInquiry(req.body);
    await inquiry.save();

    // Send response immediately without waiting for email
    res.status(201).json({
      success: true,
      message: 'Product inquiry submitted successfully',
      data: {
        id: inquiry._id,
        status: inquiry.status
      }
    });

    // Send email notification asynchronously (non-blocking)
    setImmediate(async () => {
      try {
        await emailService.sendProductInquiryNotification(inquiry);
        console.log('✅ Product inquiry notification sent successfully');
      } catch (emailError) {
        console.log('⚠️ Email notification skipped:', emailError.message);
        // Don't fail the request if email fails
      }
    });
  } catch (error) {
    console.error('Product inquiry submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit product inquiry'
    });
  }
});

// Get all product inquiries (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const inquiries = await ProductInquiry.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await ProductInquiry.countDocuments(filter);

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
    console.error('Get product inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product inquiries'
    });
  }
});

// Get single product inquiry (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const inquiry = await ProductInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Product inquiry not found'
      });
    }

    res.json({
      success: true,
      data: { inquiry }
    });
  } catch (error) {
    console.error('Get product inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product inquiry'
    });
  }
});

// Update product inquiry status (admin only)
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

    const inquiry = await ProductInquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Product inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Product inquiry updated successfully',
      data: { inquiry }
    });
  } catch (error) {
    console.error('Update product inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product inquiry'
    });
  }
});

// Delete product inquiry (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const inquiry = await ProductInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Product inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Product inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete product inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product inquiry'
    });
  }
});

module.exports = router;
