import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ['Facebook', 'Instagram', 'LinkedIn', 'Twitter'],
    },
    contentType: {
      type: String,
      enum: ['Image', 'Video', 'Carousel', 'Text'],
      default: 'Image',
    },
    postedHour: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
    },
    postedDay: {
      type: String,
      required: true,
    },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    engagementLevel: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

export const Analytics = mongoose.model('Analytics', analyticsSchema);
