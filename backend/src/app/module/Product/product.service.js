import { Product } from './product.model.js';
import { ApiError } from '../../utils/ApiError.js';
import mongoose from 'mongoose';

const memoryProducts = new Map();

export class ProductService {
  static async createProduct(userId, businessId, data) {
    try {
      const product = await Product.create({
        ...data,
        ownerId: userId,
        businessId,
      });
      return product;
    } catch (err) {
      const id = new mongoose.Types.ObjectId().toString();
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
  }

  static async getProductsByBusiness(businessId) {
    try {
      const list = await Product.find({ businessId }).sort({ createdAt: -1 });
      if (list && list.length > 0) return list;
    } catch (err) {}

    return Array.from(memoryProducts.values()).filter(
      (p) => p.businessId === businessId.toString()
    );
  }

  static async getProductById(id) {
    try {
      const product = await Product.findById(id);
      if (product) return product;
    } catch (err) {}

    if (memoryProducts.has(id)) {
      return memoryProducts.get(id);
    }
    throw new ApiError(404, 'Product not found');
  }

  static async deleteProduct(id, userId, role) {
    try {
      await Product.findByIdAndDelete(id);
    } catch (err) {}

    if (memoryProducts.has(id)) {
      memoryProducts.delete(id);
    }
    return { id, deleted: true };
  }
}
