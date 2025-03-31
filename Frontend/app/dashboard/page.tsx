"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { ChartContainer } from "@/components/ui/chart"
import { useDashboardData } from "@/hooks/useDashboardData"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts"

//DATABASE CALL

// Sample data for charts
const contentReviewData = [
  { name: "Mon", images: 65, videos: 45, comments: 120 },
  { name: "Tue", images: 59, videos: 40, comments: 110 },
  { name: "Wed", images: 80, videos: 55, comments: 130 },
  { name: "Thu", images: 81, videos: 56, comments: 135 },
  { name: "Fri", images: 56, videos: 40, comments: 90 },
  { name: "Sat", images: 55, videos: 35, comments: 85 },
  { name: "Sun", images: 40, videos: 30, comments: 70 },
]

const contentTypeData = [
  { name: "Images", value: 45 },
  { name: "Videos", value: 25 },
  { name: "Comments", value: 30 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData()

  // Convert hashtag frequency to chart data format
  const hashtagChartData = data?.hashtag_frequency 
    ? Object.entries(data.hashtag_frequency).map(([name, value]) => ({
        name,
        value
      }))
    : []

  const chartConfig = {
    images: {
      label: "Images",
      color: "hsl(var(--chart-1))",
    },
    videos: {
      label: "Videos",
      color: "hsl(var(--chart-2))",
    },
    comments: {
      label: "Comments",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your content moderation activities</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content Reviewed</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{data?.content_reviewed || 0}</div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{data?.unapproved_status || 0}</div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{data?.approval_rate || 0}%</div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Replace the content distribution chart with hashtag frequency */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Hashtag Distribution</CardTitle>
              <CardDescription>Frequency of hashtags in content</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <ChartContainer className="h-[300px] w-full" config={chartConfig}>
                <ResponsiveContainer width="99%" height={280}>
                  <RechartsBarChart data={hashtagChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0088FE" name="Frequency" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

