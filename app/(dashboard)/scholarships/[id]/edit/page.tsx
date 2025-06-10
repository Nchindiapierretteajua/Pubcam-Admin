"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { updateScholarship, fetchScholarships } from "@/lib/redux/features/scholarshipsSlice"
import { scholarshipSchema, type ScholarshipFormValues } from "@/lib/schemas/scholarship-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface EditScholarshipPageProps {
  params: {
    id: string
  }
}

export default function EditScholarshipPage({ params }: EditScholarshipPageProps) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const { scholarships } = useSelector((state: RootState) => state.scholarships)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scholarship, setScholarship] = useState<any>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipSchema),
  })

  const {
    fields: eligibilityFields,
    append: appendEligibility,
    remove: removeEligibility,
  } = useFieldArray({
    control,
    name: "eligibility",
  })

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
  })

  useEffect(() => {
    if (scholarships.length === 0) {
      dispatch(fetchScholarships())
    }
  }, [dispatch, scholarships.length])

  useEffect(() => {
    const foundScholarship = scholarships.find((s) => s.id === params.id)
    if (foundScholarship) {
      setScholarship(foundScholarship)
      reset({
        title: foundScholarship.title,
        description: foundScholarship.description,
        provider: foundScholarship.provider,
        amount: foundScholarship.amount,
        deadline: foundScholarship.deadline,
        eligibility: foundScholarship.eligibility,
        requirements: foundScholarship.requirements,
        applicationUrl: foundScholarship.applicationUrl,
        type: foundScholarship.type,
        country: foundScholarship.country,
        imageUrl: foundScholarship.imageUrl || "",
      })
    }
  }, [scholarships, params.id, reset])

  const onSubmit = async (data: ScholarshipFormValues) => {
    setIsSubmitting(true)
    try {
      const cleanedData = {
        ...data,
        eligibility: data.eligibility.filter((item) => item.trim() !== ""),
        requirements: data.requirements.filter((item) => item.trim() !== ""),
      }

      await dispatch(updateScholarship({ id: params.id, scholarshipData: cleanedData }))
      toast({
        title: "Success",
        description: "Scholarship updated successfully",
      })
      router.push("/scholarships")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update scholarship",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const DatePicker = ({
    value,
    onChange,
    placeholder,
  }: { value: string; onChange: (date: string) => void; placeholder: string }) => {
    const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined)

    useEffect(() => {
      setDate(value ? new Date(value) : undefined)
    }, [value])

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
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
              setDate(selectedDate)
              onChange(selectedDate ? selectedDate.toISOString() : "")
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }

  if (!scholarship) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading scholarship...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/scholarships">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Scholarship</h1>
          <p className="text-muted-foreground">Update scholarship details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update the basic details of the scholarship</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Scholarship Title *</Label>
              <Input id="title" placeholder="e.g., Government Excellence Scholarship" {...register("title")} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the scholarship, its purpose, and benefits"
                {...register("description")}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Input id="provider" placeholder="e.g., Ministry of Higher Education" {...register("provider")} />
                {errors.provider && <p className="text-sm text-destructive">{errors.provider.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Input id="type" placeholder="e.g., Merit-based, Need-based" {...register("type")} />
                {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input id="amount" placeholder="e.g., 500,000 FCFA per year" {...register("amount")} />
                {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" {...register("country")} />
                {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Application Deadline *</Label>
              <DatePicker
                value={watch("deadline")}
                onChange={(date) => setValue("deadline", date)}
                placeholder="Select application deadline"
              />
              {errors.deadline && <p className="text-sm text-destructive">{errors.deadline.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationUrl">Application URL *</Label>
              <Input id="applicationUrl" placeholder="https://example.com/apply" {...register("applicationUrl")} />
              {errors.applicationUrl && <p className="text-sm text-destructive">{errors.applicationUrl.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eligibility Criteria</CardTitle>
            <CardDescription>Update who can apply for this scholarship</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {eligibilityFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input placeholder="e.g., Cameroonian nationality" {...register(`eligibility.${index}` as const)} />
                {eligibilityFields.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeEligibility(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendEligibility("")} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Eligibility Criterion
            </Button>
            {errors.eligibility && <p className="text-sm text-destructive">{errors.eligibility.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>Update the documents and requirements needed to apply</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requirementFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input placeholder="e.g., Academic transcripts" {...register(`requirements.${index}` as const)} />
                {requirementFields.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeRequirement(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendRequirement("")} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Requirement
            </Button>
            {errors.requirements && <p className="text-sm text-destructive">{errors.requirements.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Optional additional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input id="imageUrl" placeholder="https://example.com/scholarship-image.jpg" {...register("imageUrl")} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Scholarship"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/scholarships">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
