const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads (in production, use cloud storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   GET /api/products
// @desc    Get all products with pagination and filters
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('collection').optional().isString(),
  query('category').optional().isString(),
  query('subcategory').optional().isString(),
  query('status').optional().isIn(['active', 'inactive', 'draft']),
  query('featured').optional().isBoolean(),
  query('search').optional().isString(),
  query('sortBy').optional().isIn(['name', 'price', 'createdAt', 'updatedAt']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
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
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.collection) {
      filter.collection = req.query.collection;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.subcategory) {
      filter.subcategory = req.query.subcategory;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      // Default to active products for public API
      filter.status = 'active';
    }
    
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === 'true';
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Build sort object
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        products,
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get all product categories (legacy endpoint)
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { status: 'active' });
    const subcategories = await Product.distinct('subcategory', { 
      status: 'active',
      subcategory: { $exists: true, $ne: null }
    });

    res.json({
      success: true,
      data: {
        categories,
        subcategories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Admin only - no auth for now)
router.post('/', [
  body('name').isString().isLength({ min: 1, max: 200 }).withMessage('Name is required and must be less than 200 characters'),
  body('description').isString().isLength({ min: 1, max: 1000 }).withMessage('Description is required and must be less than 1000 characters'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('collection').isString().isLength({ min: 1, max: 100 }).withMessage('Collection is required'),
  body('category').isString().isLength({ min: 1, max: 100 }).withMessage('Category is required'),
  body('minimumQuantity').isNumeric().withMessage('Minimum quantity must be a number'),
  body('images').isArray().withMessage('Images must be an array'),
  body('images.*').isString().withMessage('Each image must be a string URL')
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

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin only - no auth for now)
router.put('/:id', [
  body('name').optional().isString().isLength({ min: 1, max: 200 }),
  body('description').optional().isString().isLength({ min: 1, max: 1000 }),
  body('price').optional().isNumeric(),
  body('category').optional().isString().isLength({ min: 1, max: 100 }),
  body('images').optional().isArray(),
  body('images.*').optional().isString()
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

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin only - no auth for now)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/products/:id/status
// @desc    Update product status
// @access  Private (Admin only - no auth for now)
router.patch('/:id/status', [
  body('status').isIn(['active', 'inactive', 'draft'])
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

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product status updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/products/upload-images
// @desc    Upload product images
// @access  Private (Admin only - no auth for now)
router.post('/upload-images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    const uploadedImages = req.files.map((file) => {
      // Return the URL path for the uploaded image
      return `/uploads/products/${file.filename}`;
    });

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: uploadedImages
      }
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images'
    });
  }
});

module.exports = router;
