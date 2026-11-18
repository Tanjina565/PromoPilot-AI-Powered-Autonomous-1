import mongoose from 'mongoose';

const socialPageSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ['Facebook', 'Instagram', 'LinkedIn', 'Twitter'],
      required: true,
    },
    pageName: { type: String, required: true },
    pageUrl: { type: String, required: true },
    connected: { type: Boolean, default: true },
    connectedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const businessSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      required: [true, 'Business category is required'],
      enum: [
        'Fashion',
        'Electronics',
        'Food & Beverage',
        'Beauty & Personal Care',
        'Home & Living',
        'Health & Fitness',
        'Technology & Software',
        'Other',
      ],
      default: 'Fashion',
    },
    targetAudience: {
      type: String,
      required: [true, 'Target audience description is required'],
      trim: true,
    },
    brandTone: {
      type: String,
      required: [true, 'Brand tone is required'],
      enum: [
        'Professional',
        'Friendly',
        'Casual',
        'Humorous',
        'Urgent & Sales-driven',
        'Luxurious & Elegant',
      ],
      default: 'Professional',
    },
    preferredLanguage: {
      type: String,
      enum: ['English', 'Bangla'],
      default: 'English',
    },
    contactDetails: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    socialMediaPages: [socialPageSchema],
  },
  {
    timestamps: true,
  }
);

export const Business = mongoose.model('Business', businessSchema);
