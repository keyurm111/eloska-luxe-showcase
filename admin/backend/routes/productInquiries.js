const express = require('express');
const { body, validationResult, query } = require('express-validator');
const ProductInquiry = require('../models/ProductInquiry');
const auth = require('../middleware/auth');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const emailService = require('../services/emailService');


const router = express.Router();

// @route   POST /api/product-inquiries/submit
// @desc    Submit a new product inquiry (public)
// @access  Public
router.post('/submit', [
  body('name').isString().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('phone').isString().isLength({ min: 1, max: 20 }).withMessage('Phone is required and must be less than 20 characters'),
  body('company').optional().isString().isLength({ max: 100 }).withMessage('Company name must be less than 100 characters'),
  body('productName').isString().isLength({ min: 1, max: 200 }).withMessage('Product name is required and must be less than 200 characters'),
  body('productCode').isString().isLength({ min: 1, max: 50 }).withMessage('Product code is required and must be less than 50 characters'),
  body('category').isString().isLength({ min: 1, max: 100 }).withMessage('Category is required and must be less than 100 characters'),
  body('subcategory').optional().isString().isLength({ max: 100 }).withMessage('Subcategory must be less than 100 characters'),
  body('quantity').isInt({ min: 1, max: 10000 }).withMessage('Quantity must be between 1 and 10000'),
  body('message').isString().isLength({ min: 1, max: 1000 }).withMessage('Message is required and must be less than 1000 characters')
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

    const { name, email, phone, company, productName, productCode, category, subcategory, quantity, message } = req.body;

    const inquiry = new ProductInquiry({
      name,
      email,
      phone,
      company,
      productName,
      productCode,
      category,
      subcategory,
      quantity,
      message,
      status: 'pending'
    });

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
    console.error('Submit product inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Apply auth middleware to all other routes
router.use(auth);

// @route   GET /api/product-inquiries
// @desc    Get all product inquiries with pagination and filters
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'processing', 'completed', 'cancelled']),
  query('category').optional().isString(),
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
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Build sort object
    const sort = { createdAt: -1 };

    const [inquiries, total] = await Promise.all([
      ProductInquiry.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductInquiry.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        data: inquiries,
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get product inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/product-inquiries/:id
// @desc    Get single product inquiry
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await ProductInquiry.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Get product inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/product-inquiries/:id/status
// @desc    Update inquiry status
// @access  Private
router.patch('/:id/status', [
  body('status').isIn(['pending', 'processing', 'completed', 'cancelled']),
  body('adminNotes').optional().isString().isLength({ max: 500 })
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

    const { status, adminNotes } = req.body;


    const inquiry = await ProductInquiry.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(adminNotes && { adminNotes })
      },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/product-inquiries/:id
// @desc    Delete product inquiry
// @access  Private
router.delete('/:id', async (req, res) => {
  try {

    const inquiry = await ProductInquiry.findByIdAndDelete(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/product-inquiries/export
// @desc    Export product inquiries to CSV
// @access  Private
router.get('/export', async (req, res) => {
  try {
    // Build filter object
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const inquiries = await ProductInquiry.find(filter).sort({ createdAt: -1 }).lean();

    // Create CSV
    const csvWriter = createCsvWriter({
      path: 'temp-product-inquiries.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'company', title: 'Company' },
        { id: 'productName', title: 'Product Name' },
        { id: 'productCode', title: 'Product Code' },
        { id: 'category', title: 'Category' },
        { id: 'subcategory', title: 'Subcategory' },
        { id: 'quantity', title: 'Quantity' },
        { id: 'message', title: 'Message' },
        { id: 'status', title: 'Status' },
        { id: 'adminNotes', title: 'Admin Notes' },
        { id: 'createdAt', title: 'Created At' }
      ]
    });

    await csvWriter.writeRecords(inquiries);

    res.download('temp-product-inquiries.csv', `product-inquiries-${new Date().toISOString().split('T')[0]}.csv`, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up temp file
      require('fs').unlinkSync('temp-product-inquiries.csv');
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
