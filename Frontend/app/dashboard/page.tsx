"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { ChartContainer } from "@/components/ui/chart"
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
              <div className="text-2xl font-bold">2,345</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">345</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.2%</div>
              <p className="text-xs text-muted-foreground">+4.3% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Content Review Overview</CardTitle>
              <CardDescription>Number of content items reviewed by type</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="99%" height={280}>
                  <RechartsBarChart data={contentReviewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="images" fill="#0088FE" name="Images" />
                    <Bar dataKey="videos" fill="#00C49F" name="Videos" />
                    <Bar dataKey="comments" fill="#FFBB28" name="Comments" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Content Distribution</CardTitle>
              <CardDescription>Distribution of content by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="99%" height={280}>
                  <RechartsPieChart>
                    <Pie
                      data={contentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {contentTypeData.map((entry, index) => (
                        <Pie key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

