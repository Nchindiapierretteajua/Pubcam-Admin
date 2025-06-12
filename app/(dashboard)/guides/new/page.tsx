"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/redux/store";
import { createGuide } from "@/lib/redux/features/guidesSlice";
import { guideSchema, type GuideFormValues } from "@/lib/schemas/guide-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, X, ArrowLeft, GripVertical } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function NewGuidePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GuideFormValues>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      audience: "STUDENT",
      steps: [{ id: "step1", title: "", description: "", imageUrl: "" }],
      imageUrl: "",
      lastUpdated: new Date().toISOString().split("T")[0],
    },
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  const onSubmit = async (data: GuideFormValues) => {
    setIsSubmitting(true);
    try {
      // Filter out empty steps and generate IDs
      const cleanedData = {
        ...data,
        steps: data.steps
          .filter(
            (step) => step.title.trim() !== "" && step.description.trim() !== ""
          )
          .map((step, index) => ({
            ...step,
            id: `step${index + 1}`,
          })),
      };

      await dispatch(createGuide(cleanedData));
      toast({
        title: "Success",
        description: "Guide created successfully",
      });
      router.push("/guides");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create guide",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/guides">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Guide</h1>
          <p className="text-muted-foreground">
            Create a step-by-step guide for students
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of the guide
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Guide Title *</Label>
              <Input
                id="title"
                placeholder="e.g., How to Prepare for GCE Exams"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what this guide covers and who it's for"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="e.g., Exams, Admission, Scholarships"
                  {...register("category")}
                />
                {errors.category && (
                  <p className="text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      "audience",
                      value as "STUDENT" | "PARENT" | "GRADUATE" | "ALL"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Students</SelectItem>
                    <SelectItem value="PARENT">Parents</SelectItem>
                    <SelectItem value="GRADUATE">Graduates</SelectItem>
                    <SelectItem value="ALL">All</SelectItem>
                  </SelectContent>
                </Select>
                {errors.audience && (
                  <p className="text-sm text-destructive">
                    {errors.audience.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/guide-image.jpg"
                  {...register("imageUrl")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastUpdated">Last Updated *</Label>
                <Input
                  type="date"
                  id="lastUpdated"
                  {...register("lastUpdated")}
                />
                {errors.lastUpdated && (
                  <p className="text-sm text-destructive">
                    {errors.lastUpdated.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guide Steps</CardTitle>
            <CardDescription>
              Create the step-by-step instructions for this guide
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {stepFields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Step {index + 1}</h4>
                  {stepFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeStep(index)}
                      className="ml-auto"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor={`step-title-${index}`}>Step Title *</Label>
                    <Input
                      id={`step-title-${index}`}
                      placeholder="e.g., Create a Study Plan"
                      {...register(`steps.${index}.title` as const)}
                    />
                    {errors.steps?.[index]?.title && (
                      <p className="text-sm text-destructive">
                        {errors.steps[index]?.title?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`step-description-${index}`}>
                      Step Description *
                    </Label>
                    <Textarea
                      id={`step-description-${index}`}
                      placeholder="Provide detailed instructions for this step"
                      {...register(`steps.${index}.description` as const)}
                    />
                    {errors.steps?.[index]?.description && (
                      <p className="text-sm text-destructive">
                        {errors.steps[index]?.description?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`step-image-${index}`}>
                      Step Image URL (Optional)
                    </Label>
                    <Input
                      id={`step-image-${index}`}
                      placeholder="https://example.com/step-image.jpg"
                      {...register(`steps.${index}.imageUrl` as const)}
                    />
                  </div>
                </div>

                {index < stepFields.length - 1 && <Separator />}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendStep({
                  id: `step${stepFields.length + 1}`,
                  title: "",
                  description: "",
                  imageUrl: "",
                })
              }
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
            {errors.steps && (
              <p className="text-sm text-destructive">{errors.steps.message}</p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Guide"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/guides">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
