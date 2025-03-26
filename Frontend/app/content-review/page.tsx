"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Filter, ImageIcon, MessageSquare, MoreHorizontal, Search, ThumbsDown, ThumbsUp, Video } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DashboardLayout from "@/components/dashboard-layout"

// Sample data for content items
const contentItems = [
  {
    id: 1,
    type: "image",
    title: "Profile picture upload",
    username: "user123",
    timestamp: "2 hours ago",
    priority: "high",
    reason: "Potentially inappropriate content",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    type: "video",
    title: "Product demonstration video",
    username: "vendor456",
    timestamp: "3 hours ago",
    priority: "medium",
    reason: "Reported by multiple users",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    type: "comment",
    title: "Comment on blog post",
    username: "commenter789",
    timestamp: "5 hours ago",
    priority: "low",
    reason: "Contains flagged keywords",
    content:
      "This product is absolutely terrible! I can't believe anyone would buy this garbage. The company should be ashamed!",
  },
  {
    id: 4,
    type: "image",
    title: "Event photo upload",
    username: "eventorg101",
    timestamp: "6 hours ago",
    priority: "medium",
    reason: "User reported content",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    type: "comment",
    title: "Product review comment",
    username: "reviewer202",
    timestamp: "8 hours ago",
    priority: "low",
    reason: "Automated flag - suspicious links",
    content: "Check out this amazing deal I found! Click here: [suspicious link removed]",
  },
]

export default function ContentReviewPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filter content based on active tab, search query, and priority filter
  const filteredContent = contentItems.filter((item) => {
    // Filter by content type
    if (activeTab !== "all" && item.type !== activeTab) return false

    // Filter by search query
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    // Filter by priority
    if (priorityFilter !== "all" && item.priority !== priorityFilter) return false

    return true
  })

  const handleApprove = (id: number) => {
    console.log(`Approved content with ID: ${id}`)
    // In a real app, you would call an API to update the content status
  }

  const handleReject = (id: number) => {
    console.log(`Rejected content with ID: ${id}`)
    // In a real app, you would call an API to update the content status
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Content Review</h1>
          <p className="text-muted-foreground">Review and moderate flagged content</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="image">Images</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="comment">Comments</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search content..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by priority" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredContent.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground text-center">No content items match your filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredContent.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.type === "image" && <ImageIcon className="h-4 w-4" />}
                        {item.type === "video" && <Video className="h-4 w-4" />}
                        {item.type === "comment" && <MessageSquare className="h-4 w-4" />}
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {item.priority === "high" && <Badge variant="destructive">High Priority</Badge>}
                        {item.priority === "medium" && <Badge>Medium Priority</Badge>}
                        {item.priority === "low" && <Badge variant="outline">Low Priority</Badge>}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Escalate to team lead</DropdownMenuItem>
                          <DropdownMenuItem>Add to watchlist</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src="/placeholder.svg?height=20&width=20" alt={item.username} />
                          <AvatarFallback>{item.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{item.username}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Reason for review:</span> {item.reason}
                      </div>

                      {(item.type === "image" || item.type === "video") && (
                        <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-md border bg-muted">
                          <img
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                          {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="rounded-full bg-background/80 p-3">
                                <Video className="h-6 w-6" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {item.type === "comment" && <div className="rounded-md border p-3 text-sm">{item.content}</div>}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(item.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

