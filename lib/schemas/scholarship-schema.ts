import { z } from "zod";

export const scholarshipSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  provider: z.string().min(1, "Provider is required"),
  amount: z.string().min(1, "Amount is required"),
  deadline: z.string().min(1, "Deadline is required"),
  eligibility: z
    .array(z.string())
    .min(1, "At least one eligibility criterion is required"),
  requirements: z
    .array(z.string())
    .min(1, "At least one requirement is required"),
  applicationUrl: z.string().url("Application URL must be a valid URL"),
  type: z.string().min(1, "Type is required"),
  country: z.string().min(1, "Country is required"),
  imageUrl: z.string().optional(),
  eligibilityCriteria: z
    .array(z.string())
    .min(1, "At least one eligibility criterion is required"),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  applicationProcess: z.string().min(1, "Application process is required"),
  contactInfo: z.string().min(1, "Contact information is required"),
});

export type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;
