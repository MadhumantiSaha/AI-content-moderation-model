"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpDown, Filter, FilterIcon, ImageIcon, MessageSquare, MoreHorizontal, Search, SortAscIcon, ThumbsDown, ThumbsUp, Video } from "lucide-react"
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
import { useContentData } from "@/hooks/useContentData"

interface ContentItem {
  id: number;
  file_type: 'Image' | 'Video' | 'Comment';
  username: string;
  date_and_time: string;
  reason: string;
  caption?: string;
}

export default function ContentReviewPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("all");
  const { data, loading, error } = useContentData();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading content</div>;
  }

  if (!data) {
    return <div>No content available</div>;
  }

  // Filter content based on active tab, search query, and priority filter
  const filteredContent = (data || []).filter((item: ContentItem) => {
    // Filter by content type
    if (activeTab !== "all" && item.file_type !== activeTab) return false

    // Filter by search query
    if (
      searchQuery &&
      !item.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    return true
  })

  let sortedContent = [...filteredContent];

  // Sorting logic
  if (sortOrder === "newest") {
    sortedContent.sort((a, b) => new Date(b.date_and_time).getTime() - new Date(a.date_and_time).getTime());
  } else if (sortOrder === "oldest") {
    sortedContent.sort((a, b) => new Date(a.date_and_time).getTime() - new Date(b.date_and_time).getTime());
  } 

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
                <TabsTrigger value="Image">Images</TabsTrigger>
                <TabsTrigger value="Video">Videos</TabsTrigger>
                <TabsTrigger value="Comment">Comments</TabsTrigger>
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

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Filter by priority" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sort By</SelectItem>
                  <SelectItem value="newest">Newest to oldest</SelectItem>
                  <SelectItem value="oldest">Oldest to newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {sortedContent.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground text-center">No content items match your filters</p>
                </CardContent>
              </Card>
            ) : (
              sortedContent.map((item,index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.file_type === "Image" && <ImageIcon className="h-4 w-4" />}
                        {item.file_type === "Video" && <Video className="h-4 w-4" />}
                        {item.file_type === "Comment" && <MessageSquare className="h-4 w-4" />}
                        <CardTitle className="text-lg">{item.file_type}</CardTitle>
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
                        <span>{item.date_and_time.split(' ')[0]}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Reason for review:</span> {item.reason}
                      </div>

                      {(item.file_type === "Image" || item.file_type === "Video") && (
                        <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-md border bg-muted">
                          <img
                            src={"/placeholder.svg"}     
                            alt={item.username}
                            className="h-full w-full object-cover"
                          />
                          {item.file_type === "Video" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="rounded-full bg-background/80 p-3">
                                <Video className="h-6 w-6" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {item.file_type === "Comment" && <div className="rounded-md border p-3 text-sm">{item.caption}</div>}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(index)}
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
