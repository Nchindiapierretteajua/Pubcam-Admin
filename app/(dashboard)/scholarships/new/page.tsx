"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/redux/store";
import { createScholarship } from "@/lib/redux/features/scholarshipsSlice";
import {
  scholarshipSchema,
  type ScholarshipFormValues,
} from "@/lib/schemas/scholarship-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function NewScholarshipPage() {
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
  } = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      title: "",
      description: "",
      provider: "",
      amount: "",
      deadline: "",
      requirements: [""],
      applicationUrl: "",
      type: "",
      country: "Cameroon",
      imageUrl: "",
      eligibilityCriteria: [""],
      benefits: [""],
      applicationProcess: "",
      contactInfo: "",
    },
  });

  const {
    fields: eligibilityFields,
    append: appendEligibility,
    remove: removeEligibility,
  } = useFieldArray({
    control,
    name: "eligibilityCriteria",
  });

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control,
    name: "benefits",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
  });

  const onSubmit = async (data: ScholarshipFormValues) => {
    setIsSubmitting(true);
    try {
      const cleanedData = {
        ...data,
        eligibilityCriteria: data.eligibilityCriteria.filter(
          (item) => item.trim() !== ""
        ),
        benefits: data.benefits.filter((item) => item.trim() !== ""),
        requirements: data.requirements.filter((item) => item.trim() !== ""),
      };

      await dispatch(createScholarship(cleanedData));
      toast({
        title: "Success",
        description: "Scholarship created successfully",
      });
      router.push("/scholarships");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create scholarship",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const DatePicker = ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (date: string) => void;
    placeholder: string;
  }) => {
    const [date, setDate] = useState<Date | undefined>(
      value ? new Date(value) : undefined
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              onChange(selectedDate ? selectedDate.toISOString() : "");
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/scholarships">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Scholarship</h1>
          <p className="text-muted-foreground">
            Add a new scholarship opportunity
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of the scholarship
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Scholarship Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Government Excellence Scholarship"
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
                placeholder="Describe the scholarship, its purpose, and benefits"
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
                <Label htmlFor="provider">Provider *</Label>
                <Input
                  id="provider"
                  placeholder="e.g., Ministry of Higher Education"
                  {...register("provider")}
                />
                {errors.provider && (
                  <p className="text-sm text-destructive">
                    {errors.provider.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Input
                  id="type"
                  placeholder="e.g., Merit-based, Need-based"
                  {...register("type")}
                />
                {errors.type && (
                  <p className="text-sm text-destructive">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  placeholder="e.g., 500,000 FCFA per year"
                  {...register("amount")}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" {...register("country")} />
                {errors.country && (
                  <p className="text-sm text-destructive">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Application Deadline *</Label>
              <DatePicker
                value={watch("deadline")}
                onChange={(date) => setValue("deadline", date)}
                placeholder="Select application deadline"
              />
              {errors.deadline && (
                <p className="text-sm text-destructive">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationUrl">Application URL *</Label>
              <Input
                id="applicationUrl"
                placeholder="https://example.com/apply"
                {...register("applicationUrl")}
              />
              {errors.applicationUrl && (
                <p className="text-sm text-destructive">
                  {errors.applicationUrl.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eligibility & Benefits</CardTitle>
            <CardDescription>
              Specify eligibility criteria and benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Eligibility Criteria *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendEligibility("")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Criterion
                </Button>
              </div>
              {eligibilityFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    placeholder="Enter eligibility criterion"
                    {...register(`eligibilityCriteria.${index}`)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeEligibility(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {errors.eligibilityCriteria && (
                <p className="text-sm text-destructive">
                  {errors.eligibilityCriteria.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Benefits *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendBenefit("")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Benefit
                </Button>
              </div>
              {benefitFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    placeholder="Enter benefit"
                    {...register(`benefits.${index}`)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeBenefit(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {errors.benefits && (
                <p className="text-sm text-destructive">
                  {errors.benefits.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>
              List the documents and requirements needed to apply
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requirementFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  placeholder="e.g., Academic transcripts"
                  {...register(`requirements.${index}` as const)}
                />
                {requirementFields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeRequirement(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendRequirement("")}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Requirement
            </Button>
            {errors.requirements && (
              <p className="text-sm text-destructive">
                {errors.requirements.message}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Provide detailed information about the scholarship
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="applicationProcess">Application Process *</Label>
              <Textarea
                id="applicationProcess"
                placeholder="Step-by-step application process"
                {...register("applicationProcess")}
              />
              {errors.applicationProcess && (
                <p className="text-sm text-destructive">
                  {errors.applicationProcess.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information *</Label>
              <Textarea
                id="contactInfo"
                placeholder="Contact details for inquiries"
                {...register("contactInfo")}
              />
              {errors.contactInfo && (
                <p className="text-sm text-destructive">
                  {errors.contactInfo.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Scholarship"}
          </Button>
        </div>
      </form>
    </div>
  );
}
