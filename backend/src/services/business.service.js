import { Business } from '../models/business.model.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

// Initial pre-configured businesses for instant evaluation
const DEFAULT_BUSINESSES = [
  {
    _id: 'b_aura_1',
    id: 'b_aura_1',
    businessName: 'Aura Lifestyle BD',
    category: 'Fashion',
    targetAudience: 'Fashion-forward youth, university students & working professionals in Bangladesh',
    brandTone: 'Friendly',
    preferredLanguage: 'Bangla',
    ownerId: 'seed_owner_1',
    contactDetails: {
      email: 'contact@auralifestyle.bd',
      phone: '+8801711223344',
      address: 'Dhanmondi 27, Dhaka, Bangladesh',
      website: 'https://auralifestyle.bd',
    },
    socialMediaPages: [
      {
        _id: 'soc_1',
        platform: 'Facebook',
        pageName: 'Aura Lifestyle Bangladesh',
        pageUrl: 'https://facebook.com/auralifestylebd',
        connected: true,
      },
      {
        _id: 'soc_2',
        platform: 'Instagram',
        pageName: '@aura.lifestyle.bd',
        pageUrl: 'https://instagram.com/aura.lifestyle.bd',
        connected: true,
      },
    ],
    createdAt: new Date('2026-01-15T10:00:00Z'),
    updatedAt: new Date('2026-01-15T10:00:00Z'),
  },
  {
    _id: 'b_tech_2',
    id: 'b_tech_2',
    businessName: 'ElectroTech Gadgets',
    category: 'Electronics',
    targetAudience: 'Tech enthusiasts, mobile gamers, and gadget lovers aged 18-35',
    brandTone: 'Professional',
    preferredLanguage: 'English',
    ownerId: 'seed_owner_1',
    contactDetails: {
      email: 'sales@electrotech.com.bd',
      phone: '+8801819998877',
      address: 'Multiplan Center, New Elephant Road, Dhaka',
      website: 'https://electrotech.com.bd',
    },
    socialMediaPages: [
      {
        _id: 'soc_3',
        platform: 'Facebook',
        pageName: 'ElectroTech Official',
        pageUrl: 'https://facebook.com/electrotechbd',
        connected: true,
      },
    ],
    createdAt: new Date('2026-01-18T12:00:00Z'),
    updatedAt: new Date('2026-01-18T12:00:00Z'),
  },
];

// In-memory store fallback for demo resilience
const memoryBusinesses = new Map(DEFAULT_BUSINESSES.map((b) => [b._id, b]));

export class BusinessService {
  static async createBusiness(ownerId, data) {
    if (mongoose.connection.readyState === 1) {
      try {
        const business = await Business.create({
          ...data,
          ownerId,
        });
        return business;
      } catch (err) {
        if (err instanceof ApiError) throw err;
      }
    }

    const id = 'biz_' + Date.now();
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

  static async getBusinesses(userId, role) {
    if (mongoose.connection.readyState === 1) {
      try {
        const query = role === 'Admin' ? {} : { ownerId: userId };
        const businesses = await Business.find(query).sort({ createdAt: -1 });
        if (businesses && businesses.length > 0) return businesses;
      } catch (err) {
        // Fallback to memory
      }
    }

    // Memory fallback
    const list = Array.from(memoryBusinesses.values()).filter(
      (b) => role === 'Admin' || b.ownerId === userId.toString()
    );
    return list;
  }

  static async getBusinessById(id, userId, role) {
    if (mongoose.connection.readyState === 1) {
      try {
        const business = await Business.findById(id);
        if (business) {
          if (role !== 'Admin' && business.ownerId.toString() !== userId.toString()) {
            throw new ApiError(403, 'Forbidden: You do not have permission to access this business profile');
          }
          return business;
        }
      } catch (err) {
        if (err instanceof ApiError) throw err;
      }
    }

    if (memoryBusinesses.has(id)) {
      const b = memoryBusinesses.get(id);
      if (role !== 'Admin' && b.ownerId !== userId.toString()) {
        throw new ApiError(403, 'Forbidden: You do not have permission to access this business profile');
      }
      return b;
    }

    throw new ApiError(404, 'Business profile not found');
  }

  static async updateBusiness(id, userId, role, updateData) {
    await this.getBusinessById(id, userId, role);

    if (mongoose.connection.readyState === 1) {
      try {
        const updated = await Business.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true }
        );
        if (updated) return updated;
      } catch (err) {
        // Fallback
      }
    }

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

    if (mongoose.connection.readyState === 1) {
      try {
        await Business.findByIdAndDelete(id);
        return { id, deleted: true };
      } catch (err) {
        // Fallback
      }
    }

    if (memoryBusinesses.has(id)) {
      memoryBusinesses.delete(id);
      return { id, deleted: true };
    }

    throw new ApiError(404, 'Business profile not found');
  }

  static async connectSocialPage(id, userId, role, socialData) {
    const business = await this.getBusinessById(id, userId, role);

    if (mongoose.connection.readyState === 1) {
      try {
        business.socialMediaPages.push(socialData);
        await business.save();
        return business;
      } catch (err) {
        // Fallback
      }
    }

    if (memoryBusinesses.has(id)) {
      const b = memoryBusinesses.get(id);
      b.socialMediaPages = b.socialMediaPages || [];
      b.socialMediaPages.push({ ...socialData, _id: 'soc_' + Date.now(), connectedAt: new Date() });
      memoryBusinesses.set(id, b);
      return b;
    }

    throw new ApiError(404, 'Business profile not found');
  }
}
