"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/lib/redux/store"
import { createExam } from "@/lib/redux/features/examsSlice"
import { examSchema, type ExamFormValues } from "@/lib/schemas/exam-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function NewExamPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: "",
      fullName: "",
      description: "",
      startDate: "",
      endDate: "",
      registrationStartDate: "",
      registrationEndDate: "",
      fees: "",
      eligibility: [""],
      subjects: [""],
      venues: [""],
      documentUrl: "",
      resultDate: "",
      organizingBody: "",
      imageUrl: "",
      level: "secondary",
    },
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
    fields: subjectFields,
    append: appendSubject,
    remove: removeSubject,
  } = useFieldArray({
    control,
    name: "subjects",
  })

  const {
    fields: venueFields,
    append: appendVenue,
    remove: removeVenue,
  } = useFieldArray({
    control,
    name: "venues",
  })

  const onSubmit = async (data: ExamFormValues) => {
    setIsSubmitting(true)
    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...data,
        eligibility: data.eligibility.filter((item) => item.trim() !== ""),
        subjects: data.subjects.filter((item) => item.trim() !== ""),
        venues: data.venues.filter((item) => item.trim() !== ""),
      }

      await dispatch(createExam(cleanedData))
      toast({
        title: "Success",
        description: "Exam created successfully",
      })
      router.push("/exams")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create exam",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Exam</h1>
          <p className="text-muted-foreground">Add a new examination to the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details of the examination</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Exam Name *</Label>
                <Input id="name" placeholder="e.g., GCE O Level" {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select onValueChange={(value) => setValue("level", value as "primary" | "secondary" | "tertiary")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="tertiary">Higher Education</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level && <p className="text-sm text-destructive">{errors.level.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="e.g., General Certificate of Education Ordinary Level"
                {...register("fullName")}
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the examination, its purpose, and target audience"
                {...register("description")}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizingBody">Organizing Body *</Label>
                <Input id="organizingBody" placeholder="e.g., GCE Board Cameroon" {...register("organizingBody")} />
                {errors.organizingBody && <p className="text-sm text-destructive">{errors.organizingBody.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fees">Fees *</Label>
                <Input id="fees" placeholder="e.g., 25,000 FCFA" {...register("fees")} />
                {errors.fees && <p className="text-sm text-destructive">{errors.fees.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Dates</CardTitle>
            <CardDescription>Set the examination and registration dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Registration Start Date *</Label>
                <DatePicker
                  value={watch("registrationStartDate")}
                  onChange={(date) => setValue("registrationStartDate", date)}
                  placeholder="Select registration start date"
                />
                {errors.registrationStartDate && (
                  <p className="text-sm text-destructive">{errors.registrationStartDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Registration End Date *</Label>
                <DatePicker
                  value={watch("registrationEndDate")}
                  onChange={(date) => setValue("registrationEndDate", date)}
                  placeholder="Select registration end date"
                />
                {errors.registrationEndDate && (
                  <p className="text-sm text-destructive">{errors.registrationEndDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Exam Start Date *</Label>
                <DatePicker
                  value={watch("startDate")}
                  onChange={(date) => setValue("startDate", date)}
                  placeholder="Select exam start date"
                />
                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Exam End Date *</Label>
                <DatePicker
                  value={watch("endDate")}
                  onChange={(date) => setValue("endDate", date)}
                  placeholder="Select exam end date"
                />
                {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Result Date (Optional)</Label>
              <DatePicker
                value={watch("resultDate") || ""}
                onChange={(date) => setValue("resultDate", date)}
                placeholder="Select result publication date"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eligibility Criteria</CardTitle>
            <CardDescription>Define who can take this examination</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {eligibilityFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input placeholder="e.g., Form 5 students" {...register(`eligibility.${index}` as const)} />
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
            <CardTitle>Subjects</CardTitle>
            <CardDescription>List the subjects included in this examination</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input placeholder="e.g., Mathematics" {...register(`subjects.${index}` as const)} />
                {subjectFields.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeSubject(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendSubject("")} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
            {errors.subjects && <p className="text-sm text-destructive">{errors.subjects.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Venues</CardTitle>
            <CardDescription>List the locations where this examination will be conducted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {venueFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input placeholder="e.g., Yaoundé" {...register(`venues.${index}` as const)} />
                {venueFields.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeVenue(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendVenue("")} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Venue
            </Button>
            {errors.venues && <p className="text-sm text-destructive">{errors.venues.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Optional additional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documentUrl">Document URL (Optional)</Label>
              <Input id="documentUrl" placeholder="https://example.com/syllabus.pdf" {...register("documentUrl")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input id="imageUrl" placeholder="https://example.com/exam-image.jpg" {...register("imageUrl")} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Exam"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/exams">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
