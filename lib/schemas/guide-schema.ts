import { z } from "zod"

const guideStepSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().optional(),
})

export const guideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  audience: z.enum(["student", "parent", "graduate", "all"]),
  steps: z.array(guideStepSchema).min(1, "At least one step is required"),
  imageUrl: z.string().optional(),
})

export type GuideFormValues = z.infer<typeof guideSchema>
export type GuideStepFormValues = z.infer<typeof guideStepSchema>
