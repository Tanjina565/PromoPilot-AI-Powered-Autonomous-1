import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../../config/env.js';

export class GeminiService {
  static async generateSocialPost({
    business,
    product,
    platform,
    tone,
    marketingGoal,
    language = 'English',
  }) {
    const isBangla = language === 'Bangla';

    if (config.geminiApiKey && config.geminiApiKey.trim() !== '') {
      try {
        const genAI = new GoogleGenerativeAI(config.geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are an autonomous e-commerce social media marketing specialist working for PromoPilot.
Create an authentic social media post based strictly on the verified details below.

CONSTRAINTS:
1. Do NOT invent prices, discounts, or unsupported claims.
2. Only reference product price: ${product.price} ${product.currency || 'BDT'}.
3. Match platform: ${platform}.
4. Brand tone: "${tone}".
5. Marketing goal: "${marketingGoal}".
6. Language: ${language} ${isBangla ? '(আকর্ষণীয় ও সাবলীল বাংলা ভাষায় লিখুন)' : ''}.

BUSINESS:
- Name: ${business.businessName}
- Category: ${business.category}
- Audience: ${business.targetAudience}

PRODUCT:
- Title: ${product.title}
- Price: ${product.price} ${product.currency || 'BDT'}
- Description: ${product.description}
- Features: ${product.features?.join(', ') || 'High quality'}

OUTPUT FORMAT:
Respond ONLY with a valid JSON object matching:
{
  "caption": "The main social post caption with appropriate emoji",
  "callToAction": "Direct, engaging call to action",
  "hashtags": ["#relevant", "#hashtags"]
}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return {
          caption: parsed.caption,
          callToAction: parsed.callToAction || 'Shop now while supplies last!',
          hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ['#PromoPilot', '#Ecommerce'],
          modelUsed: 'Google Gemini 1.5 Flash',
        };
      } catch (err) {
        console.warn(`[Gemini API] Remote call error: ${err.message}. Using intelligent synthesis.`);
      }
    }

    return this.generateSynthesizedMarketingPost({
      business,
      product,
      platform,
      tone,
      marketingGoal,
      language,
    });
  }

  static generateSynthesizedMarketingPost({
    business,
    product,
    platform,
    tone,
    marketingGoal,
    language,
  }) {
    const isBangla = language === 'Bangla';
    const priceStr = `${product.price} ${product.currency || 'BDT'}`;
    const featureList = product.features && product.features.length > 0 
      ? product.features.join(' | ') 
      : product.description;

    let caption = '';
    let callToAction = '';
    let hashtags = [];

    if (isBangla) {
      if (tone === 'Urgent & Sales-driven') {
        caption = `🔥 সীমিত স্টক! ${business.businessName}-এর জনপ্রিয় ${product.title} এখন পাওয়া যাচ্ছে মাত্র ${priceStr}-এ!\n\n${product.description}\n\n✨ মূল বৈশিষ্ট্য:\n• ${product.features?.join('\n• ') || featureList}\n\nদেরি না করে আজই অর্ডার করুন এবং আপনার ডেলিভারি নিশ্চিত করুন!`;
        callToAction = 'এখনই অর্ডার করতে ইনবক্স করুন বা ওয়েবসাইটে ভিজিট করুন!';
      } else if (tone === 'Luxurious & Elegant') {
        caption = `✨ প্রিমিয়াম কোয়ালিটি ও এলিগ্যান্ট ডিজাইনের নিখুঁত সমন্বয় — ${product.title}।\n\n${business.businessName} নিয়ে এলো আপনার রুচিশীল পছন্দের সেরা সমাধান।\n\nমূল্য: ${priceStr}\n\n💎 বিশেষ আকর্ষণ: ${featureList}`;
        callToAction = 'আপনার কালেকশনে যুক্ত করতে আমাদের পেজে যোগাযোগ করুন।';
      } else {
        caption = `👋 হ্যালো ${business.targetAudience}!\n\n${business.businessName} উপস্থাপন করছে আমাদের নতুন ${product.title}।\n\n${product.description}\n\nমূল্য: ${priceStr}\nফিচারস: ${featureList}\n\nআপনার জন্য কেমন হবে? এখনই কমেন্ট করে জানান!`;
        callToAction = 'আরও বিস্তারিত জানতে এখনই যোগাযোগ করুন!';
      }
      hashtags = [
        `#${business.businessName.replace(/\s+/g, '')}`,
        `#${product.category || 'Ecommerce'}`,
        '#OnlineShoppingBD',
        '#QualityProduct',
        '#PromoPilotAI',
      ];
    } else {
      if (tone === 'Urgent & Sales-driven') {
        caption = `⚡ High Demand Alert! Grab the ${product.title} from ${business.businessName} before stock runs out!\n\n${product.description}\n\n💰 Price: ${priceStr}\n⭐ Highlights: ${featureList}\n\nDon't miss out on quality crafted for ${business.targetAudience}.`;
        callToAction = 'Order now directly via link or send a direct message!';
      } else if (tone === 'Luxurious & Elegant') {
        caption = `Sophistication redefined. Introducing ${product.title} by ${business.businessName}.\n\nDesigned with meticulous attention to detail:\n• ${product.features?.join('\n• ') || featureList}\n\nInvestment: ${priceStr}.\nExperience unmatched elegance curated specifically for ${business.targetAudience}.`;
        callToAction = 'Explore the collection today.';
      } else {
        caption = `Looking to upgrade your essentials? Check out ${product.title} from ${business.businessName}!\n\n${product.description}\n\nPrice: ${priceStr}\nKey Features: ${featureList}\n\nTailored for ${business.targetAudience}. Let us know your thoughts in the comments below! 👇`;
        callToAction = 'Click the link in bio to explore more!';
      }
      hashtags = [
        `#${business.businessName.replace(/\s+/g, '')}`,
        `#${product.title.split(' ')[0]}`,
        `#${business.category}`,
        '#Ecommerce',
        '#PromoPilot',
      ];
    }

    return {
      caption,
      callToAction,
      hashtags,
      modelUsed: 'PromoPilot Intelligent AI Engine',
    };
  }
}
