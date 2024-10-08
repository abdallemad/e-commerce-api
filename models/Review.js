const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please provide title'],
    trim: true,
    maxlength: 100,
  },
  rating: {
    type: Number,
    required: [true, 'please give rating for the product'],
    default: 4.5,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    required: [true, 'please provide comment'],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true, // Add required if user must be provided
  },
  product: {
    type: mongoose.Types.ObjectId, // Corrected from 'types' to 'type'
    ref: 'Product',
    required: true, // Add required if product must be provided
  },
}, { timestamps: true });

// Fixed index (it should be `user`, not `users`)
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
