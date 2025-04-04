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
  Sector,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts"

//DATABASE CALL

// Sample data for charts
interface HashtagFrequencyItem {
  hashtag: string;
  count: number;
}

interface HashtagFrequency {
  most_used: HashtagFrequencyItem[];
}

interface Data {
  content_reviewed: number;
  unapproved_status: number;
  approval_rate: number;
  hashtag_frequency: HashtagFrequency;
  image_count: number;
  video_count: number;
}

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  title: string;
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  title,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData(); // Explicit type here

  const hashtagBarChartData = Array.isArray(data?.hashtag_frequency?.most_used)
    ? data.hashtag_frequency.most_used.map((item) => ({
        name: item.hashtag,
        value: item.count,
      }))
    : [];

    //interface for piechart data
    interface PieChartDataItem {
      name: string;
      value: number;
    }

  // Pie chart data
  const PieChartData: PieChartDataItem[] = [
    { name: 'Images', value: data?.image_count || 0 },
    { name: 'Videos', value: data?.video_count || 0 },
  ];

    const COLORS = [ '#FF8042', '#00C49F', '#FFBB28','#0088FE'];

  const RADIAN = Math.PI / 180;


  
  const chartConfig = {
    images: {
      label: "Images",
      color: "hsl(var(--chart-1))",
    },
    videos: {
      label: "Videos",
      color: "hsl(var(--chart-2))",
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

        <div className="flex ">
          
  {/* Card for Hashtag Distribution Bar Chart */}
  
  <Card className="col-span-4 md:col-span-3 w-[65%]">
    <CardHeader>
      <CardTitle>Hashtag Distribution</CardTitle>
      <CardDescription>Frequency of hashtags in content</CardDescription>
    </CardHeader>
    <CardContent className="p-0 overflow-hidden">
      <ChartContainer className="h-[300px] w-full" config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={hashtagBarChartData}>
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

  {/* Card for Pie Chart */}
  
  <Card className="col-span-4 md:col-span-3 w-[35%]">
    <CardHeader>
      <CardTitle>Content Type Distribution</CardTitle>
      <CardDescription>Distribution of content types</CardDescription>
    </CardHeader>
    <CardContent className="p-0 overflow-hidden">
      <ChartContainer className="h-[300px] w-full" config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart width={400} height={400}>
          <Pie
            data={PieChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {PieChartData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend 
            verticalAlign="bottom"
            align="center"
            payload={[
              { value: 'Images', type: 'circle', color: COLORS[0] },
              { value: 'Videos', type: 'circle', color: COLORS[1] },
            ]}
          />
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
