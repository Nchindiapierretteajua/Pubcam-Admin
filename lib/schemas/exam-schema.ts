import { z } from "zod"

export const examSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fullName: z.string().min(1, "Full name is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  registrationStartDate: z.string().min(1, "Registration start date is required"),
  registrationEndDate: z.string().min(1, "Registration end date is required"),
  fees: z.string().min(1, "Fees are required"),
  eligibility: z.array(z.string()).min(1, "At least one eligibility criterion is required"),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  venues: z.array(z.string()).min(1, "At least one venue is required"),
  documentUrl: z.string().optional(),
  resultDate: z.string().optional(),
  organizingBody: z.string().min(1, "Organizing body is required"),
  imageUrl: z.string().optional(),
  level: z.enum(["primary", "secondary", "tertiary"]),
})

export type ExamFormValues = z.infer<typeof examSchema>
