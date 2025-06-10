"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { fetchScholarships, deleteScholarship } from "@/lib/redux/features/scholarshipsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar, Building, DollarSign, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function ScholarshipsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { scholarships, loading, error } = useSelector((state: RootState) => state.scholarships)

  useEffect(() => {
    dispatch(fetchScholarships())
  }, [dispatch])

  const handleDeleteScholarship = async (id: string) => {
    if (confirm("Are you sure you want to delete this scholarship?")) {
      dispatch(deleteScholarship(id))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "merit-based":
        return "bg-green-100 text-green-800"
      case "corporate scholarship":
        return "bg-blue-100 text-blue-800"
      case "technology scholarship":
        return "bg-purple-100 text-purple-800"
      case "university scholarship":
        return "bg-orange-100 text-orange-800"
      case "industry scholarship":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading scholarships...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Scholarship Management</h1>
          <p className="text-muted-foreground">Manage available scholarships in Cameroon</p>
        </div>
        <Button asChild>
          <Link href="/scholarships/new">
            <Plus className="mr-2 h-4 w-4" />
            New Scholarship
          </Link>
        </Button>
      </div>

      {error && <div className="rounded-lg bg-destructive/10 p-4 text-destructive">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg line-clamp-2">{scholarship.title}</CardTitle>
                  <CardDescription className="text-sm">{scholarship.provider}</CardDescription>
                </div>
                <Badge className={getTypeColor(scholarship.type)}>{scholarship.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">{scholarship.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{scholarship.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Deadline: {formatDate(scholarship.deadline)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{scholarship.country}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Eligibility Criteria:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {scholarship.eligibility.slice(0, 2).map((criterion, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>{criterion}</span>
                    </li>
                  ))}
                  {scholarship.eligibility.length > 2 && (
                    <li className="text-xs text-muted-foreground">
                      +{scholarship.eligibility.length - 2} more criteria
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/scholarships/${scholarship.id}/edit`}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={scholarship.applicationUrl} target="_blank">
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteScholarship(scholarship.id!)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {scholarships.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No scholarships found</p>
        </div>
      )}
    </div>
  )
}
