import { Content } from './content.model.js';
import { BusinessService } from '../Business/business.service.js';
import { ProductService } from '../Product/product.service.js';
import { GeminiService } from './gemini.service.js';
import { ApiError } from '../../utils/ApiError.js';
import mongoose from 'mongoose';

const memoryContents = new Map();

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

    const aiOutput = await GeminiService.generateSocialPost({
      business,
      product,
      platform,
      tone: tone || business.brandTone,
      marketingGoal,
      language: language || business.preferredLanguage,
    });

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
      const id = new mongoose.Types.ObjectId().toString();
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
  }

  static async updateContent(id, userId, updateData) {
    try {
      const content = await Content.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
      if (content) return content;
    } catch (err) {}

    if (memoryContents.has(id)) {
      const doc = { ...memoryContents.get(id), ...updateData, updatedAt: new Date() };
      memoryContents.set(id, doc);
      return doc;
    }

    throw new ApiError(404, 'Content draft not found');
  }

  static async regenerateContent(id, userId, options = {}) {
    let content = null;
    try {
      content = await Content.findById(id);
    } catch (e) {}

    if (!content && memoryContents.has(id)) {
      content = memoryContents.get(id);
    }

    if (!content) {
      throw new ApiError(404, 'Content draft not found');
    }

    const business = await BusinessService.getBusinessById(content.businessId, userId, 'Admin');
    const product = await ProductService.getProductById(content.productId);

    const aiOutput = await GeminiService.generateSocialPost({
      business,
      product,
      platform: options.platform || content.platform,
      tone: options.tone || content.tone,
      marketingGoal: options.marketingGoal || content.marketingGoal,
      language: options.language || content.language,
    });

    return await this.updateContent(id, userId, {
      generatedCaption: aiOutput.caption,
      hashtags: aiOutput.hashtags,
      callToAction: aiOutput.callToAction,
      version: (content.version || 1) + 1,
    });
  }

  static async getContentHistory({ businessId, platform, status, search, role }) {
    try {
      const query = {};
      if (businessId) query.businessId = businessId;
      if (platform) query.platform = platform;
      if (status) query.status = status;
      if (search) {
        query.generatedCaption = { $regex: search, $options: 'i' };
      }

      const list = await Content.find(query)
        .populate('productId', 'title price category')
        .populate('businessId', 'businessName category')
        .sort({ createdAt: -1 });
      if (list && list.length > 0) return list;
    } catch (err) {}

    let list = Array.from(memoryContents.values());
    if (businessId) list = list.filter((c) => c.businessId === businessId.toString());
    if (platform) list = list.filter((c) => c.platform === platform);
    if (status) list = list.filter((c) => c.status === status);
    if (search) {
      list = list.filter((c) =>
        c.generatedCaption.toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }
}
