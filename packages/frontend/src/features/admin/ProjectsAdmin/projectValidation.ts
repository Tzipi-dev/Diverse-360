// // projectValidation.ts
// import { z } from 'zod';

// export const projectSchema = z.object({
//   title: z.string().min(1, "יש להזין כותרת"),
//   description: z.string().min(1, "יש להזין תיאור"),
//   imageUrl: z.string().url("יש להזין כתובת URL חוקית לתמונה"),
//   linkUrl: z.string().url("יש להזין כתובת URL חוקית לפרויקט"),
//   isActive: z.boolean(),
// });

// export type ProjectFormData = z.infer<typeof projectSchema>;
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(2, 'הכנס שם פרויקט תקין'),
  description: z.string().min(5, 'יש להזין תיאור'),
  imageUrl: z.string().url('יש להזין כתובת תמונה תקינה'),
  linkUrl: z.string().url('יש להזין כתובת קישור תקינה'),
  isActive: z.boolean(),
});
