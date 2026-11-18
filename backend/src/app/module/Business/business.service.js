import { Business } from './business.model.js';
import { ApiError } from '../../utils/ApiError.js';
import mongoose from 'mongoose';

const memoryBusinesses = new Map();

export class BusinessService {
  static async createBusiness(ownerId, data) {
    try {
      const business = await Business.create({ ...data, ownerId });
      return business;
    } catch (err) {
      const id = new mongoose.Types.ObjectId().toString();
      const doc = {
        _id: id,
        id,
        ...data,
        ownerId: ownerId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryBusinesses.set(id, doc);
      return doc;
    }
  }

  static async getBusinesses(userId, role) {
    try {
      const query = role === 'Admin' ? {} : { ownerId: userId };
      const list = await Business.find(query).sort({ createdAt: -1 });
      if (list && list.length > 0) return list;
    } catch (err) {}

    return Array.from(memoryBusinesses.values()).filter(
      (b) => role === 'Admin' || b.ownerId === userId.toString()
    );
  }

  static async getBusinessById(id, userId, role) {
    try {
      const business = await Business.findById(id);
      if (business) {
        if (role !== 'Admin' && business.ownerId.toString() !== userId.toString()) {
          throw new ApiError(403, 'Forbidden: You do not own this business profile');
        }
        return business;
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
    }

    if (memoryBusinesses.has(id)) {
      const b = memoryBusinesses.get(id);
      if (role !== 'Admin' && b.ownerId !== userId.toString()) {
        throw new ApiError(403, 'Forbidden: You do not own this business profile');
      }
      return b;
    }

    throw new ApiError(404, 'Business profile not found');
  }

  static async updateBusiness(id, userId, role, updateData) {
    await this.getBusinessById(id, userId, role);

    try {
      const updated = await Business.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      if (updated) return updated;
    } catch (err) {}

    if (memoryBusinesses.has(id)) {
      const current = memoryBusinesses.get(id);
      const updated = { ...current, ...updateData, updatedAt: new Date() };
      memoryBusinesses.set(id, updated);
      return updated;
    }

    throw new ApiError(404, 'Business profile not found');
  }

  static async deleteBusiness(id, userId, role) {
    await this.getBusinessById(id, userId, role);

    try {
      await Business.findByIdAndDelete(id);
    } catch (err) {}

    if (memoryBusinesses.has(id)) {
      memoryBusinesses.delete(id);
    }

    return { id, deleted: true };
  }

  static async connectSocialPage(id, userId, role, socialData) {
    const business = await this.getBusinessById(id, userId, role);

    try {
      business.socialMediaPages.push(socialData);
      await business.save();
      return business;
    } catch (err) {
      if (memoryBusinesses.has(id)) {
        const b = memoryBusinesses.get(id);
        b.socialMediaPages = b.socialMediaPages || [];
        b.socialMediaPages.push({ ...socialData, _id: Date.now().toString(), connectedAt: new Date() });
        memoryBusinesses.set(id, b);
        return b;
      }
      return business;
    }
  }
}
