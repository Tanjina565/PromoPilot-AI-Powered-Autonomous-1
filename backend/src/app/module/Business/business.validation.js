import { z } from 'zod';

export const createBusinessSchema = z.object({
  body: z.object({
    businessName: z.string().min(2, 'Business name must be at least 2 characters').max(150),
    category: z.enum([
      'Fashion',
      'Electronics',
      'Food & Beverage',
      'Beauty & Personal Care',
      'Home & Living',
      'Health & Fitness',
      'Technology & Software',
      'Other',
    ]),
    targetAudience: z.string().min(3, 'Target audience description is required'),
    brandTone: z.enum([
      'Professional',
      'Friendly',
      'Casual',
      'Humorous',
      'Urgent & Sales-driven',
      'Luxurious & Elegant',
    ]),
    preferredLanguage: z.enum(['English', 'Bangla']).default('English'),
    contactDetails: z
      .object({
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().optional().or(z.literal('')),
        address: z.string().optional().or(z.literal('')),
        website: z.string().url().optional().or(z.literal('')),
      })
      .optional(),
    socialMediaPages: z
      .array(
        z.object({
          platform: z.enum(['Facebook', 'Instagram', 'LinkedIn', 'Twitter']),
          pageName: z.string().min(1, 'Page name is required'),
          pageUrl: z.string().min(1, 'Page URL is required'),
          connected: z.boolean().default(true),
        })
      )
      .optional()
      .default([]),
  }),
});

export const updateBusinessSchema = z.object({
  body: createBusinessSchema.shape.body.partial(),
});

export const connectSocialSchema = z.object({
  body: z.object({
    platform: z.enum(['Facebook', 'Instagram', 'LinkedIn', 'Twitter']),
    pageName: z.string().min(1, 'Page name is required'),
    pageUrl: z.string().min(1, 'Page URL is required'),
  }),
});
