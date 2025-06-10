"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { fetchExams, deleteExam } from "@/lib/redux/features/examsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Calendar, MapPin, Users, DollarSign } from "lucide-react"
import Link from "next/link"

export default function ExamsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { exams, loading, error } = useSelector((state: RootState) => state.exams)

  useEffect(() => {
    dispatch(fetchExams())
  }, [dispatch])

  const handleDeleteExam = async (id: string) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      dispatch(deleteExam(id))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "primary":
        return "bg-green-100 text-green-800"
      case "secondary":
        return "bg-blue-100 text-blue-800"
      case "tertiary":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const groupedExams = {
    secondary: exams.filter((exam) => exam.level === "secondary"),
    primary: exams.filter((exam) => exam.level === "primary"),
    tertiary: exams.filter((exam) => exam.level === "tertiary"),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading exams...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exam Management</h1>
          <p className="text-muted-foreground">Manage available exams in Cameroon</p>
        </div>
        <Button asChild>
          <Link href="/exams/new">
            <Plus className="mr-2 h-4 w-4" />
            New Exam
          </Link>
        </Button>
      </div>

      {error && <div className="rounded-lg bg-destructive/10 p-4 text-destructive">{error}</div>}

      <Tabs defaultValue="secondary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="secondary">Secondary ({groupedExams.secondary.length})</TabsTrigger>
          <TabsTrigger value="primary">Primary ({groupedExams.primary.length})</TabsTrigger>
          <TabsTrigger value="tertiary">Higher ({groupedExams.tertiary.length})</TabsTrigger>
        </TabsList>

        {Object.entries(groupedExams).map(([level, levelExams]) => (
          <TabsContent key={level} value={level} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {levelExams.map((exam) => (
                <Card key={exam.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{exam.name}</CardTitle>
                        <CardDescription className="text-sm">{exam.fullName}</CardDescription>
                      </div>
                      <Badge className={getLevelBadgeColor(exam.level)}>
                        {exam.level === "secondary" ? "Secondary" : exam.level === "primary" ? "Primary" : "Higher"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{exam.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.fees}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.organizingBody}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {exam.venues.slice(0, 2).join(", ")}
                          {exam.venues.length > 2 && ` +${exam.venues.length - 2} more`}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/exams/${exam.id}/edit`}>
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExam(exam.id!)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {levelExams.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No {level === "secondary" ? "secondary" : level === "primary" ? "primary" : "higher"} level exams
                  found
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
