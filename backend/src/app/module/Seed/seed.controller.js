import { AuthService } from '../Auth/auth.service.js';
import { BusinessService } from '../Business/business.service.js';
import { ProductService } from '../Product/product.service.js';
import { ContentService } from '../Content/content.service.js';
import { RecommendationService } from '../Recommendation/recommendation.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const seedDemoData = asyncHandler(async (req, res) => {
  let ownerUser;
  try {
    const ownerRes = await AuthService.register({
      name: 'Rahim Ahmed (Owner)',
      email: 'owner@promopilot.com',
      password: 'password123',
      role: 'Business Owner',
    });
    ownerUser = ownerRes.user;
  } catch (e) {
    try {
      const loginRes = await AuthService.login({ email: 'owner@promopilot.com', password: 'password123' });
      ownerUser = loginRes.user;
    } catch (err) {
      ownerUser = { _id: 'seed_owner_1', id: 'seed_owner_1', name: 'Rahim Ahmed', role: 'Business Owner' };
    }
  }

  let adminUser;
  try {
    const adminRes = await AuthService.register({
      name: 'Farhana Kabir (Admin)',
      email: 'admin@promopilot.com',
      password: 'admin123',
      role: 'Admin',
    });
    adminUser = adminRes.user;
  } catch (e) {
    try {
      const loginRes = await AuthService.login({ email: 'admin@promopilot.com', password: 'admin123' });
      adminUser = loginRes.user;
    } catch (err) {
      adminUser = { _id: 'seed_admin_1', id: 'seed_admin_1', name: 'Farhana Kabir', role: 'Admin' };
    }
  }

  const ownerId = ownerUser._id || ownerUser.id;

  const business1 = await BusinessService.createBusiness(ownerId, {
    businessName: 'Aura Lifestyle BD',
    category: 'Fashion',
    targetAudience: 'Fashion-forward youth, university students & working professionals in Bangladesh',
    brandTone: 'Friendly',
    preferredLanguage: 'Bangla',
    contactDetails: {
      email: 'contact@auralifestyle.bd',
      phone: '+8801711223344',
      address: 'Dhanmondi 27, Dhaka, Bangladesh',
      website: 'https://auralifestyle.bd',
    },
    socialMediaPages: [
      {
        platform: 'Facebook',
        pageName: 'Aura Lifestyle Bangladesh',
        pageUrl: 'https://facebook.com/auralifestylebd',
        connected: true,
      },
      {
        platform: 'Instagram',
        pageName: '@aura.lifestyle.bd',
        pageUrl: 'https://instagram.com/aura.lifestyle.bd',
        connected: true,
      },
    ],
  });

  const business2 = await BusinessService.createBusiness(ownerId, {
    businessName: 'ElectroTech Gadgets',
    category: 'Electronics',
    targetAudience: 'Tech enthusiasts, mobile gamers, and gadget lovers aged 18-35',
    brandTone: 'Professional',
    preferredLanguage: 'English',
    contactDetails: {
      email: 'sales@electrotech.com.bd',
      phone: '+8801819998877',
      address: 'Multiplan Center, New Elephant Road, Dhaka',
      website: 'https://electrotech.com.bd',
    },
    socialMediaPages: [
      {
        platform: 'Facebook',
        pageName: 'ElectroTech Official',
        pageUrl: 'https://facebook.com/electrotechbd',
        connected: true,
      },
    ],
  });

  const b1Id = business1._id || business1.id;
  const b2Id = business2._id || business2.id;

  const prod1 = await ProductService.createProduct(ownerId, b1Id, {
    title: 'Heritage Khadi Cotton Panjabi',
    description: '100% pure organic handloom khadi cotton with minimalist embroidered collar for casual & festive occasions.',
    category: 'Traditional Menswear',
    price: 2450,
    currency: 'BDT',
    features: ['100% Breathable Cotton', 'Handloom Woven', 'Anti-shrink Finish', 'Mandarin Collar'],
  });

  const prod2 = await ProductService.createProduct(ownerId, b1Id, {
    title: 'Floral Summer Georgette Kurti',
    description: 'Lightweight, stylish floral print kurti designed for comfortable daily college and office wear.',
    category: 'Womenswear',
    price: 1850,
    currency: 'BDT',
    features: ['Premium Georgette Fabric', 'Vibrant Pastel Dye', 'Available in XS to XXL'],
  });

  const prod3 = await ProductService.createProduct(ownerId, b2Id, {
    title: 'AcousticPro ANC Wireless Earbuds',
    description: 'Active Noise Cancelling True Wireless Earbuds with 40-hour battery life and ultra-low latency gaming mode.',
    category: 'Audio Gadgets',
    price: 3600,
    currency: 'BDT',
    features: ['40dB Active Noise Cancellation', 'Bluetooth 5.3', 'IPX5 Water Resistant', '40Hr Total Playtime'],
  });

  const p1Id = prod1._id || prod1.id;
  const p3Id = prod3._id || prod3.id;

  const content1 = await ContentService.generateContent({
    userId: ownerId,
    businessId: b1Id,
    productId: p1Id,
    platform: 'Instagram',
    tone: 'Friendly',
    marketingGoal: 'Sales Conversion',
    language: 'Bangla',
  });

  const content2 = await ContentService.generateContent({
    userId: ownerId,
    businessId: b2Id,
    productId: p3Id,
    platform: 'Facebook',
    tone: 'Professional',
    marketingGoal: 'Brand Awareness',
    language: 'English',
  });

  const c1Id = content1._id || content1.id;
  const analyticsData = [
    {
      businessId: b1Id,
      contentId: c1Id,
      platform: 'Instagram',
      contentType: 'Video',
      postedHour: 19,
      postedDay: 'Friday',
      likes: 620,
      comments: 78,
      shares: 95,
      impressions: 9800,
      engagementRate: 8.1,
      engagementLevel: 'High',
    },
    {
      businessId: b1Id,
      contentId: c1Id,
      platform: 'Facebook',
      contentType: 'Carousel',
      postedHour: 20,
      postedDay: 'Thursday',
      likes: 410,
      comments: 52,
      shares: 44,
      impressions: 7200,
      engagementRate: 7.0,
      engagementLevel: 'High',
    },
    {
      businessId: b1Id,
      contentId: c1Id,
      platform: 'Instagram',
      contentType: 'Image',
      postedHour: 14,
      postedDay: 'Monday',
      likes: 180,
      comments: 14,
      shares: 8,
      impressions: 4500,
      engagementRate: 4.5,
      engagementLevel: 'Medium',
    },
  ];

  for (const item of analyticsData) {
    await RecommendationService.recordAnalytics(item);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ownerCredentials: { email: 'owner@promopilot.com', password: 'password123' },
        adminCredentials: { email: 'admin@promopilot.com', password: 'admin123' },
        businessesCreated: 2,
        productsCreated: 3,
        contentsCreated: 2,
        analyticsCreated: 3,
      },
      'Demo dataset seeded successfully! You can login with the provided credentials.'
    )
  );
});
