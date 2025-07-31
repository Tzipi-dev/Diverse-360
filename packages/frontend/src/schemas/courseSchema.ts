import { z } from "zod";

export const courseFormSchema = z.object({
  title: z.string().min(1, "שם הקורס חובה"),
  description: z.string().optional(),
  uploadedAt: z.string().min(1, "תאריך חובה"),
  subject: z.string().min(1, "נושא הקורס חובה"),
  lecturer: z.string().min(1, "שם המרצה חובה"),
  isActive: z.boolean(),
  videoFile: z
    .any()
    .optional()
    .refine((files) => {
      if (!files) return true;
      if (files instanceof FileList) return files.length > 0; 
      if (files instanceof File) return true; 
      return false;
    }, { message: "יש לבחור קובץ וידאו" }),
});

export type CourseSchemaType = z.infer<typeof courseFormSchema>;
