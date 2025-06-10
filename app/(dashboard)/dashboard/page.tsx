"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { fetchDashboardData } from "@/lib/redux/features/dashboardSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, GraduationCap, BookOpen, Calendar } from "lucide-react"

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { totalExams, totalScholarships, totalGuides, recentExams, recentScholarships, recentGuides, loading } =
    useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardData())
  }, [dispatch])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-heading">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-blue">{loading ? "..." : totalExams}</div>
            <p className="text-xs text-muted-foreground">Exams available on the platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-heading">Total Scholarships</CardTitle>
            <GraduationCap className="h-4 w-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-blue">{loading ? "..." : totalScholarships}</div>
            <p className="text-xs text-muted-foreground">Scholarships available on the platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-heading">Total Guides</CardTitle>
            <BookOpen className="h-4 w-4 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-blue">{loading ? "..." : totalGuides}</div>
            <p className="text-xs text-muted-foreground">Guides available on the platform</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="exams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="exams">Recent Exams</TabsTrigger>
          <TabsTrigger value="scholarships">Recent Scholarships</TabsTrigger>
          <TabsTrigger value="guides">Recent Guides</TabsTrigger>
        </TabsList>
        <TabsContent value="exams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Recent Exams</CardTitle>
              <CardDescription>Recently added or updated exams on the platform</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y rounded-md border">
                {loading ? (
                  <div className="p-4 text-center">Loading...</div>
                ) : recentExams && recentExams.length > 0 ? (
                  recentExams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4">
                      <div className="grid gap-1">
                        <p className="font-medium">{exam.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">No recent exams found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scholarships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Recent Scholarships</CardTitle>
              <CardDescription>Recently added or updated scholarships on the platform</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y rounded-md border">
                {loading ? (
                  <div className="p-4 text-center">Loading...</div>
                ) : recentScholarships && recentScholarships.length > 0 ? (
                  recentScholarships.map((scholarship) => (
                    <div key={scholarship.id} className="flex items-center justify-between p-4">
                      <div className="grid gap-1">
                        <p className="font-medium">{scholarship.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Deadline: {formatDate(scholarship.deadline)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">No recent scholarships found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="guides" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Recent Guides</CardTitle>
              <CardDescription>Recently added or updated guides on the platform</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y rounded-md border">
                {loading ? (
                  <div className="p-4 text-center">Loading...</div>
                ) : recentGuides && recentGuides.length > 0 ? (
                  recentGuides.map((guide) => (
                    <div key={guide.id} className="flex items-center justify-between p-4">
                      <div className="grid gap-1">
                        <p className="font-medium">{guide.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Last updated: {formatDate(guide.lastUpdated)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">No recent guides found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
