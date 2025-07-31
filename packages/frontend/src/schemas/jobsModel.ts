import { z } from "zod";

export const jobsModel = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  requirements: z.string(),
  createdAt: z.date(),
  isActive: z.boolean(),
    workMode: z.string().min(1, "חובה לבחור אופן עבודה"),
});


export const jobsFormSchema = jobsModel.omit({ id: true, createdAt: true });

export type FormValues = z.infer<typeof jobsFormSchema>;


export type Job = z.infer<typeof jobsModel>;

export default jobsModel;
