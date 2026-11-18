import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ['Facebook', 'Instagram', 'LinkedIn', 'Twitter'],
    },
    tone: {
      type: String,
      required: true,
    },
    marketingGoal: {
      type: String,
      required: true,
      enum: [
        'Brand Awareness',
        'Lead Generation',
        'Sales Conversion',
        'Engagement',
        'Product Launch',
      ],
    },
    language: {
      type: String,
      enum: ['English', 'Bangla'],
      default: 'English',
    },
    generatedCaption: {
      type: String,
      required: true,
    },
    hashtags: [
      {
        type: String,
      },
    ],
    callToAction: {
      type: String,
      default: '',
    },
    bestPostingTimeSuggestion: {
      type: String,
      default: 'Wednesday 18:00 - 20:00',
    },
    status: {
      type: String,
      enum: ['Draft', 'Saved', 'Published'],
      default: 'Draft',
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Content = mongoose.model('Content', contentSchema);
