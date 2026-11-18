import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

const DEFAULT_PRODUCTS = [
  {
    _id: 'p_panjabi_1',
    id: 'p_panjabi_1',
    businessId: 'b_aura_1',
    ownerId: 'seed_owner_1',
    title: 'Heritage Khadi Cotton Panjabi',
    description: '100% pure organic handloom khadi cotton with minimalist embroidered collar for casual & festive occasions.',
    category: 'Traditional Menswear',
    price: 2450,
    currency: 'BDT',
    features: ['100% Breathable Cotton', 'Handloom Woven', 'Anti-shrink Finish', 'Mandarin Collar'],
    createdAt: new Date('2026-01-20T11:00:00Z'),
  },
  {
    _id: 'p_kurti_2',
    id: 'p_kurti_2',
    businessId: 'b_aura_1',
    ownerId: 'seed_owner_1',
    title: 'Floral Summer Georgette Kurti',
    description: 'Lightweight, stylish floral print kurti designed for comfortable daily college and office wear.',
    category: 'Womenswear',
    price: 1850,
    currency: 'BDT',
    features: ['Premium Georgette Fabric', 'Vibrant Pastel Dye', 'Available in XS to XXL'],
    createdAt: new Date('2026-01-21T14:30:00Z'),
  },
  {
    _id: 'p_earbuds_3',
    id: 'p_earbuds_3',
    businessId: 'b_tech_2',
    ownerId: 'seed_owner_1',
    title: 'AcousticPro ANC Wireless Earbuds',
    description: 'Active Noise Cancelling True Wireless Earbuds with 40-hour battery life and ultra-low latency gaming mode.',
    category: 'Audio Gadgets',
    price: 3600,
    currency: 'BDT',
    features: ['40dB Active Noise Cancellation', 'Bluetooth 5.3', 'IPX5 Water Resistant', '40Hr Total Playtime'],
    createdAt: new Date('2026-01-22T09:15:00Z'),
  },
];

const memoryProducts = new Map(DEFAULT_PRODUCTS.map((p) => [p._id, p]));

export class ProductService {
  static async createProduct(userId, businessId, data) {
    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.create({
          ...data,
          ownerId: userId,
          businessId,
        });
        return product;
      } catch (err) {
        // Fallback
      }
    }

    const id = 'prod_' + Date.now();
    const doc = {
      _id: id,
      id,
      ...data,
      ownerId: userId.toString(),
      businessId: businessId.toString(),
      createdAt: new Date(),
    };
    memoryProducts.set(id, doc);
    return doc;
  }

  static async getProductsByBusiness(businessId) {
    if (mongoose.connection.readyState === 1) {
      try {
        const products = await Product.find({ businessId }).sort({ createdAt: -1 });
        if (products && products.length > 0) return products;
      } catch (err) {
        // Fallback
      }
    }

    return Array.from(memoryProducts.values()).filter(
      (p) => p.businessId === businessId.toString()
    );
  }

  static async getProductById(id) {
    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findById(id);
        if (product) return product;
      } catch (err) {
        // Fallback
      }
    }

    if (memoryProducts.has(id)) return memoryProducts.get(id);
    throw new ApiError(404, 'Product not found');
  }

  static async deleteProduct(id, userId, role) {
    if (mongoose.connection.readyState === 1) {
      try {
        await Product.findByIdAndDelete(id);
        return { id, deleted: true };
      } catch (err) {
        // Fallback
      }
    }

    memoryProducts.delete(id);
    return { id, deleted: true };
  }
}
