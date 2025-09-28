const mongoose = require('mongoose');

const productInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  productName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  productCode: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
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
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 10000
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productInquirySchema.index({ email: 1 });
productInquirySchema.index({ status: 1 });
productInquirySchema.index({ category: 1 });
productInquirySchema.index({ createdAt: -1 });
productInquirySchema.index({ name: 'text', productName: 'text', message: 'text' });

module.exports = mongoose.model('ProductInquiry', productInquirySchema);
