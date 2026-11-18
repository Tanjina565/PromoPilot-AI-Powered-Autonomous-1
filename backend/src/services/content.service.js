import { Content } from '../models/content.model.js';
import { BusinessService } from './business.service.js';
import { ProductService } from './product.service.js';
import { GeminiService } from './gemini.service.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

const DEFAULT_CONTENTS = [
  {
    _id: 'c_panjabi_post_1',
    id: 'c_panjabi_post_1',
    businessId: 'b_aura_1',
    productId: 'p_panjabi_1',
    creatorId: 'seed_owner_1',
    platform: 'Instagram',
    tone: 'Friendly',
    marketingGoal: 'Sales Conversion',
    language: 'Bangla',
    generatedCaption: '✨ ঐতিহ্যের সাথে আধুনিকতার নিখুঁত মেলবন্ধন! Aura Lifestyle BD নিয়ে এলো খাঁটি খাদি কটনের হ্যান্ডলুম পাঞ্জাবি।\n\n১০০% ব্রিদেবল পিওর কটন ফ্যাব্রিকে নিখুঁত মিনিমালিস্ট কাজ — যা আপনাকে দিবে সর্বোচ্চ আরাম ও মার্জিত লুক।\n\nমূল্য: ২৪৫০ BDT\n\nসীমিত স্টক! এখনই ইনবক্স করে আপনার সাইজ অর্ডার করুন।',
    hashtags: ['#AuraLifestyleBD', '#KhadiPanjabi', '#MensFashionBD', '#TraditionalWear', '#PromoPilotAI'],
    callToAction: 'ইনবক্স করুন অথবা ভিজিট করুন auralifestyle.bd!',
    bestPostingTimeSuggestion: '19:00 - 21:00 (Peak Engagement)',
    status: 'Published',
    version: 1,
    createdAt: new Date('2026-01-25T19:00:00Z'),
    updatedAt: new Date('2026-01-25T19:00:00Z'),
  },
  {
    _id: 'c_earbuds_post_2',
    id: 'c_earbuds_post_2',
    businessId: 'b_tech_2',
    productId: 'p_earbuds_3',
    creatorId: 'seed_owner_1',
    platform: 'Facebook',
    tone: 'Professional',
    marketingGoal: 'Brand Awareness',
    language: 'English',
    generatedCaption: '🎧 Silence the noise, elevate your sound. Meet the all-new AcousticPro ANC Wireless Earbuds from ElectroTech Gadgets!\n\nEngineered with 40dB Hybrid Active Noise Cancellation, Bluetooth 5.3 low-latency gaming mode, and an incredible 40-hour total battery reserve.\n\nPrice: 3600 BDT\nSpecial Launch Warranty: 1 Year Official Replacement',
    hashtags: ['#ElectroTechBD', '#WirelessEarbuds', '#ActiveNoiseCancellation', '#GadgetLovers', '#PromoPilotAI'],
    callToAction: 'Order directly on electrotech.com.bd with free nationwide shipping!',
    bestPostingTimeSuggestion: '18:00 - 20:00 (Prime Evening Window)',
    status: 'Saved',
    version: 1,
    createdAt: new Date('2026-01-26T18:30:00Z'),
    updatedAt: new Date('2026-01-26T18:30:00Z'),
  },
];

const memoryContents = new Map(DEFAULT_CONTENTS.map((c) => [c._id, c]));

export class ContentService {
  static async generateContent({
    userId,
    businessId,
    productId,
    platform,
    tone,
    marketingGoal,
    language,
  }) {
    const business = await BusinessService.getBusinessById(businessId, userId, 'Admin');
    const product = await ProductService.getProductById(productId);

    if (!product) {
      throw new ApiError(404, 'Selected product does not exist');
    }

    // Call Gemini Service
    const aiOutput = await GeminiService.generateSocialPost({
      business,
      product,
      platform,
      tone: tone || business.brandTone,
      marketingGoal,
      language: language || business.preferredLanguage,
    });

    if (mongoose.connection.readyState === 1) {
      try {
        const content = await Content.create({
          businessId,
          productId,
          creatorId: userId,
          platform,
          tone: tone || business.brandTone,
          marketingGoal,
          language: language || business.preferredLanguage,
          generatedCaption: aiOutput.caption,
          hashtags: aiOutput.hashtags,
          callToAction: aiOutput.callToAction,
          bestPostingTimeSuggestion: '18:00 - 20:00 (Peak Engagement)',
          status: 'Draft',
          version: 1,
        });
        return content;
      } catch (err) {
        // Fallback
      }
    }

    const id = 'cont_' + Date.now();
    const doc = {
      _id: id,
      id,
      businessId: businessId.toString(),
      productId: productId.toString(),
      creatorId: userId.toString(),
      platform,
      tone: tone || business.brandTone,
      marketingGoal,
      language: language || business.preferredLanguage,
      generatedCaption: aiOutput.caption,
      hashtags: aiOutput.hashtags,
      callToAction: aiOutput.callToAction,
      bestPostingTimeSuggestion: '18:00 - 20:00 (Peak Engagement)',
      status: 'Draft',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryContents.set(id, doc);
    return doc;
  }

  static async updateContent(id, userId, role, updateData) {
    if (mongoose.connection.readyState === 1) {
      try {
        const updated = await Content.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true }
        );
        if (updated) return updated;
      } catch (err) {
        // Fallback
      }
    }

    if (memoryContents.has(id)) {
      const current = memoryContents.get(id);
      const updated = { ...current, ...updateData, updatedAt: new Date() };
      memoryContents.set(id, updated);
      return updated;
    }

    throw new ApiError(404, 'Content item not found');
  }

  static async regenerateContent(id, userId, role, { tone, marketingGoal, language }) {
    let content = null;
    if (mongoose.connection.readyState === 1) {
      try {
        content = await Content.findById(id);
      } catch (e) {}
    }
    if (!content && memoryContents.has(id)) {
      content = memoryContents.get(id);
    }
    if (!content) {
      throw new ApiError(404, 'Original content not found');
    }

    const business = await BusinessService.getBusinessById(content.businessId, userId, role);
    const product = await ProductService.getProductById(content.productId);

    const aiOutput = await GeminiService.generateSocialPost({
      business,
      product,
      platform: content.platform,
      tone: tone || content.tone,
      marketingGoal: marketingGoal || content.marketingGoal,
      language: language || content.language,
    });

    const updatePayload = {
      generatedCaption: aiOutput.caption,
      hashtags: aiOutput.hashtags,
      callToAction: aiOutput.callToAction,
      tone: tone || content.tone,
      marketingGoal: marketingGoal || content.marketingGoal,
      language: language || content.language,
      version: (content.version || 1) + 1,
      updatedAt: new Date(),
    };

    return await this.updateContent(id, userId, role, updatePayload);
  }

  static async getContentHistory({ businessId, platform, status, search, page = 1, limit = 20 }) {
    if (mongoose.connection.readyState === 1) {
      try {
        const query = {};
        if (businessId) query.businessId = businessId;
        if (platform && platform !== 'All') query.platform = platform;
        if (status && status !== 'All') query.status = status;
        if (search) {
          query.$or = [
            { generatedCaption: { $regex: search, $options: 'i' } },
            { hashtags: { $in: [new RegExp(search, 'i')] } },
          ];
        }

        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const [docs, total] = await Promise.all([
          Content.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit, 10))
            .populate('productId', 'title price category')
            .populate('businessId', 'businessName category'),
          Content.countDocuments(query),
        ]);

        if (docs && docs.length > 0) {
          return {
            items: docs,
            pagination: {
              page: parseInt(page, 10),
              limit: parseInt(limit, 10),
              total,
              pages: Math.ceil(total / parseInt(limit, 10)),
            },
          };
        }
      } catch (err) {
        // Fallback
      }
    }

    let items = Array.from(memoryContents.values());
    if (businessId) {
      items = items.filter((c) => c.businessId === businessId.toString());
    }
    if (platform && platform !== 'All') {
      items = items.filter((c) => c.platform === platform);
    }
    if (status && status !== 'All') {
      items = items.filter((c) => c.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.generatedCaption?.toLowerCase().includes(q) ||
          c.hashtags?.some((h) => h.toLowerCase().includes(q))
      );
    }

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      items,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total: items.length,
        pages: Math.ceil(items.length / parseInt(limit, 10)) || 1,
      },
    };
  }
}
