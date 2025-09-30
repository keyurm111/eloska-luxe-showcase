const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  collection: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    enum: ['Mirror Collection', 'Scarfs', 'Bag Fabric']
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Index for better search performance
productCategorySchema.index({ collection: 1, category: 1, subcategory: 1 });
productCategorySchema.index({ isActive: 1 });

// Ensure virtual fields are serialized
productCategorySchema.set('toJSON', { virtuals: true });
productCategorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ProductCategory', productCategorySchema);
