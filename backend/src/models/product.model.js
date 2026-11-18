import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: String,
      default: 'General',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model('Product', productSchema);
