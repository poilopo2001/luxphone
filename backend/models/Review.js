const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['positive', 'negative'],
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  helpfulCount: {
    type: Number,
    default: 0
  }
});

// Index pour optimiser les recherches par numéro de téléphone
reviewSchema.index({ phoneNumber: 1 });

module.exports = mongoose.model('Review', reviewSchema);
