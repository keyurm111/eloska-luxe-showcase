const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
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
  images: [{
    type: String,
    required: true
  }],
  features: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  specifications: {
    size: String,
    quantity: String,
    finish: String,
    material: String,
    color: String,
    weight: String,
    dimensions: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  minimumQuantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  seoTitle: {
    type: String,
    trim: true,
    maxlength: 200
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ featured: 1, status: 1 });

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toFixed(2)}`;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
