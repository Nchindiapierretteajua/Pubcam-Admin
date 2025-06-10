"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { fetchGuides, deleteGuide } from "@/lib/redux/features/guidesSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Users, BookOpen, List } from "lucide-react"
import Link from "next/link"

export default function GuidesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { guides, loading, error } = useSelector((state: RootState) => state.guides)

  useEffect(() => {
    dispatch(fetchGuides())
  }, [dispatch])

  const handleDeleteGuide = async (id: string) => {
    if (confirm("Are you sure you want to delete this guide?")) {
      dispatch(deleteGuide(id))
    }
  }

  const getAudienceBadgeColor = (audience: string) => {
    switch (audience) {
      case "student":
        return "bg-blue-100 text-blue-800"
      case "parent":
        return "bg-green-100 text-green-800"
      case "graduate":
        return "bg-purple-100 text-purple-800"
      case "all":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case "student":
        return "Students"
      case "parent":
        return "Parents"
      case "graduate":
        return "Graduates"
      case "all":
        return "All"
      default:
        return audience
    }
  }

  const groupedGuides = {
    student: guides.filter((guide) => guide.audience === "student"),
    parent: guides.filter((guide) => guide.audience === "parent"),
    graduate: guides.filter((guide) => guide.audience === "graduate"),
    all: guides.filter((guide) => guide.audience === "all"),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading guides...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Guide Management</h1>
          <p className="text-muted-foreground">Manage orientation guides for Cameroonian students</p>
        </div>
        <Button asChild>
          <Link href="/guides/new">
            <Plus className="mr-2 h-4 w-4" />
            New Guide
          </Link>
        </Button>
      </div>

      {error && <div className="rounded-lg bg-destructive/10 p-4 text-destructive">{error}</div>}

      <Tabs defaultValue="student" className="space-y-4">
        <TabsList>
          <TabsTrigger value="student">Students ({groupedGuides.student.length})</TabsTrigger>
          <TabsTrigger value="parent">Parents ({groupedGuides.parent.length})</TabsTrigger>
          <TabsTrigger value="graduate">Graduates ({groupedGuides.graduate.length})</TabsTrigger>
          <TabsTrigger value="all">All ({groupedGuides.all.length})</TabsTrigger>
        </TabsList>

        {Object.entries(groupedGuides).map(([audience, audienceGuides]) => (
          <TabsContent key={audience} value={audience} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {audienceGuides.map((guide) => (
                <Card key={guide.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg line-clamp-2">{guide.title}</CardTitle>
                        <CardDescription className="text-sm">{guide.category}</CardDescription>
                      </div>
                      <Badge className={getAudienceBadgeColor(guide.audience)}>
                        {getAudienceLabel(guide.audience)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">{guide.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <List className="h-4 w-4" />
                        <span>{guide.steps.length} steps</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{getAudienceLabel(guide.audience)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Guide Steps:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {guide.steps.slice(0, 3).map((step, index) => (
                          <li key={step.id} className="flex items-start gap-1">
                            <span className="w-4 h-4 bg-muted rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="line-clamp-1">{step.title}</span>
                          </li>
                        ))}
                        {guide.steps.length > 3 && (
                          <li className="text-xs text-muted-foreground ml-5">+{guide.steps.length - 3} more steps</li>
                        )}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/guides/${guide.id}/edit`}>
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/guides/${guide.id}`}>
                          <BookOpen className="h-3 w-3" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteGuide(guide.id!)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {audienceGuides.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No guides for {getAudienceLabel(audience as any).toLowerCase()} found
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
