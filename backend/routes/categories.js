const express = require('express');
const { body, validationResult } = require('express-validator');
const ProductCategory = require('../models/ProductCategory');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories organized by collection
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await ProductCategory.find({ isActive: true })
      .sort({ collection: 1, category: 1, subcategory: 1 });

    // Organize by collection
    const organizedCategories = {
      'Mirror Collection': {
        categories: []
      },
      'Scarfs': {
        categories: []
      },
      'Bag Fabric': {
        categories: []
      }
    };

    categories.forEach(item => {
      if (!organizedCategories[item.collection]) {
        organizedCategories[item.collection] = { categories: [] };
      }

      let category = organizedCategories[item.collection].categories.find(
        cat => cat.name === item.category
      );

      if (!category) {
        category = {
          name: item.category,
          subcategories: []
        };
        organizedCategories[item.collection].categories.push(category);
      }

      if (item.subcategory) {
        category.subcategories.push(item.subcategory);
      }
    });

    res.json({
      success: true,
      data: organizedCategories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/collections
// @desc    Get all collections
// @access  Public
router.get('/collections', async (req, res) => {
  try {
    const collections = ['Mirror Collection', 'Scarfs', 'Bag Fabric'];
    res.json({
      success: true,
      data: collections
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/:collection
// @desc    Get categories for a specific collection
// @access  Public
router.get('/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    
    const categories = await ProductCategory.find({ 
      collection: collection,
      isActive: true 
    }).sort({ category: 1, subcategory: 1 });

    const organizedCategories = {};
    categories.forEach(item => {
      if (!organizedCategories[item.category]) {
        organizedCategories[item.category] = [];
      }
      if (item.subcategory) {
        organizedCategories[item.category].push(item.subcategory);
      }
    });

    res.json({
      success: true,
      data: organizedCategories
    });
  } catch (error) {
    console.error('Get collection categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/categories
// @desc    Create new category or subcategory
// @access  Private (Admin only - no auth for now)
router.post('/', [
  body('collection').isString().isLength({ min: 1, max: 100 }),
  body('category').isString().isLength({ min: 1, max: 100 }),
  body('subcategory').optional().isString().isLength({ max: 100 }),
  body('isActive').optional().isBoolean(),
  body('sortOrder').optional().isNumeric()
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

    const { collection, category, subcategory, isActive = true, sortOrder = 0 } = req.body;

    // Check if category already exists
    const existingCategory = await ProductCategory.findOne({
      collection,
      category,
      subcategory: subcategory || null
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    const newCategory = new ProductCategory({
      collection,
      category,
      subcategory: subcategory || undefined,
      isActive,
      sortOrder
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin only - no auth for now)
router.put('/:id', [
  body('collection').optional().isString().isLength({ min: 1, max: 100 }),
  body('category').optional().isString().isLength({ min: 1, max: 100 }),
  body('subcategory').optional().isString().isLength({ max: 100 }),
  body('isActive').optional().isBoolean(),
  body('sortOrder').optional().isNumeric()
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

    const category = await ProductCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category (soft delete)
// @access  Private (Admin only - no auth for now)
router.delete('/:id', async (req, res) => {
  try {
    const category = await ProductCategory.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/subcategories/suggestions
// @desc    Get subcategory suggestions for a specific collection and category
// @access  Public
router.get('/subcategories/suggestions', async (req, res) => {
  try {
    const { collection, category } = req.query;
    
    if (!collection || !category) {
      return res.status(400).json({
        success: false,
        message: 'Collection and category are required'
      });
    }

    // Get all subcategories for the specific collection and category
    const subcategories = await ProductCategory.find({
      collection: collection,
      category: category,
      subcategory: { $exists: true, $ne: null, $ne: '' },
      isActive: true
    }).distinct('subcategory');

    res.json({
      success: true,
      data: subcategories.sort()
    });
  } catch (error) {
    console.error('Get subcategory suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
