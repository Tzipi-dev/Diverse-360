import { z } from 'zod';

export const logoCarouselSchema = z.object({
  name: z.string().min(2, 'שם החברה חייבת להכיל לפחות 2 תווים'),
  imageURL: z.any().optional(), 
});

export type LogoCarouselSchemaType = z.infer<typeof logoCarouselSchema>;
