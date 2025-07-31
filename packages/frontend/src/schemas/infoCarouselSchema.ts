import { z } from 'zod';

export const infoCarouselSchema = z.object({
  title: z.string().min(2, 'הכותרת חייבת להכיל לפחות 2 תווים'),
  description: z.string().optional(),
  referenceLinkURL: z
    .string()
    .url('יש להזין כתובת URL תקינה'),
  imageURL: z.any().optional(), 
});

export type InfoCarouselSchemaType = z.infer<typeof infoCarouselSchema>;
