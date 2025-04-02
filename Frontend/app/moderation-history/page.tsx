"use client"

// import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Filter,
  ImageIcon,
  MessageSquare,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ThumbsDown,
  ThumbsUp,
  Video,
  XCircle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import DashboardLayout from "@/components/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

// Updated moderation history interface
interface ModerationItem {
  id: number
  contentId: string
  type: "image" | "video" | "comment"
  title: string
  username: string
  userId: string
  hashtags: string[]
  caption: string
  mediaUrl: string
  moderator: string
  moderatorId: string
  timestamp: string
  action: "approved" | "rejected" | "pending" | "escalated"
  reason: string
  status: "active" | "inactive" | "deleted"
  confidence?: number
  aiDetection?: {
    explicit: number
    violence: number
    spam: number
  }
  platform?: string
  reportCount?: number
}

// Sort options
type SortField = "timestamp" | "username" | "action" | "contentId" | "reportCount"
type SortDirection = "asc" | "desc"

export default function ModerationHistoryPage() {
  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })

  // State for data
  const [moderationHistory, setModerationHistory] = useState<ModerationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null)

  // State for UI
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // State for sorting
  const [sortField, setSortField] = useState<SortField>("timestamp")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // State for selected items
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const filteredHistory = useMemo(() => {
    return moderationHistory.filter((item) => {
      // Filter by search query
      if (
        searchQuery &&
        !item.contentId.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.userId.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.moderator.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.caption.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
        return false

      // Filter by content type
      if (typeFilter !== "all" && item.type !== typeFilter) return false

      // Filter by action
      if (actionFilter !== "all" && item.action !== actionFilter) return false

      // Filter by status
      if (statusFilter !== "all" && item.status !== statusFilter) return false

      // Filter by single date
      if (date) {
        const itemDate = new Date(item.timestamp)
        const filterDate = new Date(date)

        if (
          itemDate.getFullYear() !== filterDate.getFullYear() ||
          itemDate.getMonth() !== filterDate.getMonth() ||
          itemDate.getDate() !== filterDate.getDate()
        )
          return false
      }

      // Filter by date range
      if (dateRange.from || dateRange.to) {
        const itemDate = new Date(item.timestamp)

        if (dateRange.from && itemDate < dateRange.from) return false
        if (dateRange.to) {
          const endDate = new Date(dateRange.to)
          endDate.setHours(23, 59, 59, 999) // End of day
          if (itemDate > endDate) return false
        }
      }

      return true
    })
  }, [moderationHistory, searchQuery, typeFilter, actionFilter, statusFilter, date, dateRange])

  // Fetch data from API
  useEffect(() => {
    const fetchModerationHistory = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // In a real app, this would be an actual API call
        // const response = await fetch('http://localhost:3000/api/moderation-history');
        // if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        // const data = await response.json();

        // For demo purposes, we'll simulate an API call with a timeout
        setTimeout(() => {
          const mockData: ModerationItem[] = [
            {
              id: 1,
              contentId: "IMG-2023-001",
              type: "image",
              title: "Profile picture upload",
              username: "user123",
              userId: "U78901",
              hashtags: ["#profile", "#new", "#summer"],
              caption: "New profile picture for the summer! Enjoying the beach vibes and sunshine.",
              mediaUrl: "https://example.com/images/profile1.jpg",
              moderator: "Alex Johnson",
              moderatorId: "MOD-001",
              timestamp: "2023-06-15T14:30:00",
              action: "approved",
              reason: "Content follows community guidelines",
              status: "active",
              confidence: 0.95,
              aiDetection: {
                explicit: 0.01,
                violence: 0.0,
                spam: 0.02,
              },
              platform: "Web",
              reportCount: 0,
            },
            {
              id: 2,
              contentId: "VID-2023-042",
              type: "video",
              title: "Product demonstration video",
              username: "vendor456",
              userId: "U45678",
              hashtags: ["#product", "#demo", "#newrelease"],
              caption:
                "Check out our latest product features in action! This revolutionary design will change how you work.",
              mediaUrl: "https://example.com/videos/product-demo.mp4",
              moderator: "Sarah Miller",
              moderatorId: "MOD-002",
              timestamp: "2023-06-15T12:45:00",
              action: "rejected",
              reason: "Misleading product claims",
              status: "inactive",
              confidence: 0.88,
              aiDetection: {
                explicit: 0.0,
                violence: 0.01,
                spam: 0.75,
              },
              platform: "Mobile App",
              reportCount: 3,
            },
            {
              id: 3,
              contentId: "CMT-2023-189",
              type: "comment",
              title: "Comment on blog post",
              username: "commenter789",
              userId: "U12345",
              hashtags: [],
              caption:
                "This article is completely wrong and misleading! The author clearly doesn't understand the topic.",
              mediaUrl: "",
              moderator: "Alex Johnson",
              moderatorId: "MOD-001",
              timestamp: "2023-06-14T18:20:00",
              action: "rejected",
              reason: "Violates harassment policy",
              status: "deleted",
              confidence: 0.92,
              aiDetection: {
                explicit: 0.05,
                violence: 0.3,
                spam: 0.1,
              },
              platform: "Web",
              reportCount: 5,
            },
            {
              id: 4,
              contentId: "IMG-2023-052",
              type: "image",
              title: "Event photo upload",
              username: "eventorg101",
              userId: "U23456",
              hashtags: ["#event", "#conference", "#tech"],
              caption: "Amazing turnout at our annual tech conference! Over 1000 attendees this year.",
              mediaUrl: "https://example.com/images/conference.jpg",
              moderator: "James Wilson",
              moderatorId: "MOD-003",
              timestamp: "2023-06-14T10:15:00",
              action: "approved",
              reason: "Content follows community guidelines",
              status: "active",
              confidence: 0.97,
              aiDetection: {
                explicit: 0.0,
                violence: 0.01,
                spam: 0.05,
              },
              platform: "Web",
              reportCount: 0,
            },
            {
              id: 5,
              contentId: "CMT-2023-201",
              type: "comment",
              title: "Product review comment",
              username: "reviewer202",
              userId: "U34567",
              hashtags: ["#review"],
              caption: "Check out this amazing deal I found! Click here: [suspicious link removed]",
              mediaUrl: "",
              moderator: "Sarah Miller",
              moderatorId: "MOD-002",
              timestamp: "2023-06-13T16:30:00",
              action: "rejected",
              reason: "Contains spam/promotional links",
              status: "inactive",
              confidence: 0.89,
              aiDetection: {
                explicit: 0.0,
                violence: 0.0,
                spam: 0.92,
              },
              platform: "Mobile App",
              reportCount: 2,
            },
            {
              id: 6,
              contentId: "VID-2023-067",
              type: "video",
              title: "Tutorial video",
              username: "teacher303",
              userId: "U56789",
              hashtags: ["#tutorial", "#howto", "#learning"],
              caption: "Learn how to master this skill in just 10 minutes! Step-by-step guide for beginners.",
              mediaUrl: "https://example.com/videos/tutorial.mp4",
              moderator: "James Wilson",
              moderatorId: "MOD-003",
              timestamp: "2023-06-13T09:45:00",
              action: "approved",
              reason: "Content follows community guidelines",
              status: "active",
              confidence: 0.96,
              aiDetection: {
                explicit: 0.0,
                violence: 0.0,
                spam: 0.03,
              },
              platform: "Web",
              reportCount: 0,
            },
            {
              id: 7,
              contentId: "IMG-2023-078",
              type: "image",
              title: "Product image",
              username: "seller404",
              userId: "U67890",
              hashtags: ["#product", "#sale", "#discount"],
              caption: "Limited time offer on our bestselling products! 50% off for the next 24 hours only.",
              mediaUrl: "https://example.com/images/product.jpg",
              moderator: "Alex Johnson",
              moderatorId: "MOD-001",
              timestamp: "2023-06-12T14:20:00",
              action: "approved",
              reason: "Content follows community guidelines",
              status: "active",
              confidence: 0.91,
              aiDetection: {
                explicit: 0.0,
                violence: 0.0,
                spam: 0.45,
              },
              platform: "Web",
              reportCount: 0,
            },
            {
              id: 8,
              contentId: "VID-2023-089",
              type: "video",
              title: "Unboxing video",
              username: "techreviewer505",
              userId: "U78901",
              hashtags: ["#unboxing", "#tech", "#newgadget"],
              caption: "Unboxing the latest smartphone - you won't believe what's inside!",
              mediaUrl: "https://example.com/videos/unboxing.mp4",
              moderator: "Sarah Miller",
              moderatorId: "MOD-002",
              timestamp: "2023-06-11T11:30:00",
              action: "pending",
              reason: "Awaiting review",
              status: "active",
              confidence: 0.0,
              aiDetection: {
                explicit: 0.01,
                violence: 0.0,
                spam: 0.1,
              },
              platform: "Mobile App",
              reportCount: 0,
            },
            {
              id: 9,
              contentId: "IMG-2023-095",
              type: "image",
              title: "Artwork submission",
              username: "artist606",
              userId: "U89012",
              hashtags: ["#art", "#digital", "#illustration"],
              caption: "My latest digital artwork. Spent over 40 hours on this piece!",
              mediaUrl: "https://example.com/images/artwork.jpg",
              moderator: "James Wilson",
              moderatorId: "MOD-003",
              timestamp: "2023-06-10T15:45:00",
              action: "approved",
              reason: "Content follows community guidelines",
              status: "active",
              confidence: 0.98,
              aiDetection: {
                explicit: 0.02,
                violence: 0.01,
                spam: 0.0,
              },
              platform: "Web",
              reportCount: 0,
            },
            {
              id: 10,
              contentId: "CMT-2023-215",
              type: "comment",
              title: "Comment on news article",
              username: "newsreader707",
              userId: "U90123",
              hashtags: ["#news", "#opinion"],
              caption: "This is clearly biased reporting. The journalist should be more objective in their coverage.",
              mediaUrl: "",
              moderator: "Alex Johnson",
              moderatorId: "MOD-001",
              timestamp: "2023-06-10T09:15:00",
              action: "escalated",
              reason: "Needs senior moderator review",
              status: "active",
              confidence: 0.65,
              aiDetection: {
                explicit: 0.0,
                violence: 0.15,
                spam: 0.05,
              },
              platform: "Web",
              reportCount: 3,
            },
            {
              id: 11,
              contentId: "VID-2023-102",
              type: "video",
              title: "Gaming livestream highlight",
              username: "gamer808",
              userId: "U01234",
              hashtags: ["#gaming", "#livestream", "#highlights"],
              caption: "Best moments from yesterday's 6-hour livestream! Some epic wins and fails.",
              mediaUrl: "https://example.com/videos/gaming-highlights.mp4",
              moderator: "Sarah Miller",
              moderatorId: "MOD-002",
              timestamp: "2023-06-09T20:30:00",
              action: "approved",
              reason: "Content follows community guidelines",
              status: "active",
              confidence: 0.93,
              aiDetection: {
                explicit: 0.0,
                violence: 0.25,
                spam: 0.01,
              },
              platform: "Mobile App",
              reportCount: 0,
            },
            {
              id: 12,
              contentId: "IMG-2023-110",
              type: "image",
              title: "Meme submission",
              username: "memecreator909",
              userId: "U12345",
              hashtags: ["#meme", "#funny", "#trending"],
              caption: "When you finally understand that one programming concept that's been bugging you for days...",
              mediaUrl: "https://example.com/images/programming-meme.jpg",
              moderator: "James Wilson",
              moderatorId: "MOD-003",
              timestamp: "2023-06-09T14:10:00",
              action: "approved",
              reason: "Content follows community guidelines",
              status: "active",
              confidence: 0.97,
              aiDetection: {
                explicit: 0.0,
                violence: 0.0,
                spam: 0.01,
              },
              platform: "Web",
              reportCount: 0,
            },
          ]

          setModerationHistory(mockData)
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error fetching moderation history:", err)
        setError("Failed to load moderation history. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchModerationHistory()
  }, [])

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to descending
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action: "approve" | "reject" | "delete") => {
    // In a real app, this would call an API
    console.log(`Bulk ${action} for items:`, selectedItems)

    // Update local state for demo
    if (action === "delete") {
      setModerationHistory((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
    } else {
      setModerationHistory((prev) =>
        prev.map((item) =>
          selectedItems.includes(item.id)
            ? {
                ...item,
                action: action === "approve" ? "approved" : "rejected",
                status: action === "approve" ? "active" : "inactive",
              }
            : item,
        ),
      )
    }

    // Clear selections
    setSelectedItems([])
    setSelectAll(false)
  }

  // Handle select all
  useEffect(() => {
    if (selectAll) {
      setSelectedItems(filteredHistory.map((item) => item.id))
    } else if (selectedItems.length === filteredHistory.length) {
      setSelectedItems([])
    }
  }, [selectAll, filteredHistory])

  // Update selectAll when all items are manually selected/deselected
  useEffect(() => {
    if (filteredHistory.length > 0 && selectedItems.length === filteredHistory.length) {
      setSelectAll(true)
    } else if (selectAll && selectedItems.length < filteredHistory.length) {
      setSelectAll(false)
    }
  }, [selectedItems, filteredHistory.length, selectAll])

  // Handle checkbox change
  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  // Sort the filtered history
  const sortedHistory = useMemo(() => {
    return [...filteredHistory].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case "timestamp":
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          break
        case "username":
          comparison = a.username.localeCompare(b.username)
          break
        case "action":
          comparison = a.action.localeCompare(b.action)
          break
        case "contentId":
          comparison = a.contentId.localeCompare(b.contentId)
          break
        case "reportCount":
          comparison = (a.reportCount || 0) - (b.reportCount || 0)
          break
        default:
          comparison = 0
      }

      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [filteredHistory, sortField, sortDirection])

  // Paginate the sorted history
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedHistory.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedHistory, currentPage, itemsPerPage])

  // Calculate total pages
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  // Open media dialog
  const openMediaDialog = (item: ModerationItem) => {
    setSelectedItem(item)
  }

  // Render action badge
  const renderActionBadge = (action: string) => {
    switch (action) {
      case "approved":
        return (
          <Badge className="bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "escalated":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Escalated
          </Badge>
        )
      default:
        return <Badge>{action}</Badge>
    }
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Inactive
          </Badge>
        )
      case "deleted":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Deleted
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null

    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Moderation History</h1>
          <p className="text-muted-foreground">View and search past moderation decisions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine the moderation history results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by ID, title, username..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {isAdvancedFiltersOpen ? "Hide Advanced Filters" : "Advanced Filters"}
                </Button>
              </div>

              {isAdvancedFiltersOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t">
                  <div>
                    <Label className="mb-2 block">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="deleted">Deleted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Single Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          disabled={!!(dateRange.from || dateRange.to)}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                          {date && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 h-4 w-4 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDate(undefined)
                              }}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="mb-2 block">Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          disabled={!!date}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            "Pick a date range"
                          )}
                          {(dateRange.from || dateRange.to) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 h-4 w-4 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDateRange({ from: undefined, to: undefined })
                              }}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={(range) => setDateRange(range ? { from: range.from, to: range.to ?? undefined } : { from: undefined, to: undefined })}
                          numberOfMonths={2}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Moderation Log</CardTitle>
              <CardDescription>{isLoading ? "Loading..." : `${filteredHistory.length} entries found`}</CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number.parseInt(value))
                  setCurrentPage(1) // Reset to first page
                }}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>

              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "grid")}>
                <TabsList className="grid w-[100px] grid-cols-2">
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="rounded-md border border-destructive p-4 my-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              </div>
            ) : (
              <>
                {selectedItems.length > 0 && (
                  <div className="mb-4 p-2 bg-muted rounded-md flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{selectedItems.length}</span> items selected
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleBulkAction("approve")}
                      >
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-destructive hover:bg-destructive/10"
                        onClick={() => handleBulkAction("reject")}
                      >
                        <ThumbsDown className="mr-1 h-3 w-3" />
                        Reject
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => setSelectedItems([])}>
                        Clear
                      </Button>
                    </div>
                  </div>
                )}

                {viewMode === "table" ? (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[30px]">
                            <Checkbox
                              checked={selectAll}
                              onCheckedChange={(checked) => setSelectAll(!!checked)}
                              aria-label="Select all"
                            />
                          </TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Caption</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={7}>
                              <div className="flex justify-center p-4">
                                <Skeleton className="h-8 w-full" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedHistory.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedItems.includes(item.id)}
                                  onCheckedChange={() => handleCheckboxChange(item.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {item.type === "image" ? (
                                    <ImageIcon className="h-3 w-3" />
                                  ) : (
                                    <Video className="h-3 w-3" />
                                  )}
                                  <span className="capitalize">{item.type}</span>
                                </div>
                              </TableCell>
                              <TableCell>{item.username}</TableCell>
                              <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                              <TableCell>
                                {renderActionBadge(item.action)}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {item.caption || "No caption"}
                              </TableCell>
                              <TableCell>{item.reason}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                      Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <Skeleton className="h-40 w-full mb-4" />
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardContent>
                        </Card>
                      ))
                    ) : paginatedHistory.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No moderation history found matching your filters
                      </div>
                    ) : (
                      paginatedHistory.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="relative">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleCheckboxChange(item.id)}
                              className="absolute top-2 left-2 z-10 bg-background/80"
                              aria-label={`Select item ${item.contentId}`}
                            />

                            {item.type === "image" && item.mediaUrl ? (
                              <div
                                className="h-40 bg-muted flex items-center justify-center cursor-pointer"
                                onClick={() => openMediaDialog(item)}
                              >
                                <img
                                  src={item.mediaUrl || "/placeholder.svg?height=160&width=320"}
                                  alt={item.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : item.type === "video" && item.mediaUrl ? (
                              <div
                                className="h-40 bg-muted flex items-center justify-center cursor-pointer relative"
                                onClick={() => openMediaDialog(item)}
                              >
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="rounded-full bg-background/80 p-3">
                                    <Video className="h-6 w-6" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-40 bg-muted flex items-center justify-center">
                                {item.type === "comment" ? (
                                  <div className="p-4 max-h-full overflow-auto">
                                    <MessageSquare className="h-8 w-8 mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground line-clamp-4">{item.caption}</p>
                                  </div>
                                ) : (
                                  <div className="text-center text-muted-foreground">
                                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                                    <p>No media available</p>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="absolute top-2 right-2 flex gap-1">{renderActionBadge(item.action)}</div>
                          </div>

                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium truncate">{item.title}</h3>
                              {item.reportCount !== undefined && item.reportCount > 0 && (
                                <Badge variant={item.reportCount > 3 ? "destructive" : "outline"}>
                                  {item.reportCount} reports
                                </Badge>
                              )}
                            </div>

                            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                              <span className="font-medium">{item.username}</span>
                              <span>•</span>
                              <span>{item.userId}</span>
                            </div>

                            <p className="text-sm mb-2 line-clamp-2" title={item.caption}>
                              {item.caption || <span className="text-muted-foreground italic">No caption</span>}
                            </p>

                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.hashtags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <Separator className="my-2" />

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div>{new Date(item.timestamp).toLocaleString()}</div>
                              <div>{renderStatusBadge(item.status)}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {!isLoading && filteredHistory.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
                  <strong>{Math.min(currentPage * itemsPerPage, filteredHistory.length)}</strong> of{" "}
                  <strong>{filteredHistory.length}</strong> entries
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                    let pageNumber

                    // Calculate which page numbers to show
                    if (totalPages <= 5) {
                      pageNumber = idx + 1
                    } else if (currentPage <= 3) {
                      pageNumber = idx + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + idx
                    } else {
                      pageNumber = currentPage - 2 + idx
                    }

                    return (
                      <Button
                        key={idx}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        className="font-medium"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Media Preview Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Media Preview</DialogTitle>
            <DialogDescription>
              {selectedItem?.title} by {selectedItem?.username} ({selectedItem?.userId})
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedItem?.type === "image" ? (
              <div className="rounded-md overflow-hidden border">
                <img
                  src={selectedItem.mediaUrl || "/placeholder.svg?height=400&width=600"}
                  alt={selectedItem.title}
                  className="w-full object-contain max-h-[500px]"
                />
              </div>
            ) : selectedItem?.type === "video" ? (
              <div className="rounded-md overflow-hidden border">
                <video src={selectedItem.mediaUrl} controls className="w-full max-h-[500px]">
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : selectedItem?.type === "comment" ? (
              <div className="rounded-md border p-4 bg-muted/20">
                <p className="text-lg font-medium mb-2">Comment Content:</p>
                <p className="text-base">{selectedItem.caption}</p>
              </div>
            ) : null}

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Content Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Content ID:</span> {selectedItem?.contentId}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {selectedItem?.type}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {selectedItem?.status}
                    </div>
                    <div>
                      <span className="font-medium">Caption:</span> {selectedItem?.caption}
                    </div>
                    <div>
                      <span className="font-medium">Hashtags:</span>{" "}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedItem?.hashtags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Moderation Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Action:</span> {selectedItem?.action}
                    </div>
                    <div>
                      <span className="font-medium">Reason:</span> {selectedItem?.reason}
                    </div>
                    <div>
                      <span className="font-medium">Moderator:</span> {selectedItem?.moderator} (
                      {selectedItem?.moderatorId})
                    </div>
                    <div>
                      <span className="font-medium">Date & Time:</span>{" "}
                      {selectedItem?.timestamp ? new Date(selectedItem.timestamp).toLocaleString() : ""}
                    </div>
                    <div>
                      <span className="font-medium">Confidence:</span>{" "}
                      {selectedItem?.confidence !== undefined
                        ? `${(selectedItem.confidence * 100).toFixed(1)}%`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {selectedItem?.aiDetection && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">AI Detection Results</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-md border p-2">
                      <div className="text-center mb-1">Explicit Content</div>
                      <div
                        className={`text-center font-bold ${selectedItem.aiDetection.explicit > 0.5 ? "text-destructive" : "text-green-600"}`}
                      >
                        {(selectedItem.aiDetection.explicit * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="rounded-md border p-2">
                      <div className="text-center mb-1">Violence</div>
                      <div
                        className={`text-center font-bold ${selectedItem.aiDetection.violence > 0.5 ? "text-destructive" : "text-green-600"}`}
                      >
                        {(selectedItem.aiDetection.violence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="rounded-md border p-2">
                      <div className="text-center mb-1">Spam</div>
                      <div
                        className={`text-center font-bold ${selectedItem.aiDetection.spam > 0.5 ? "text-destructive" : "text-green-600"}`}
                      >
                        {(selectedItem.aiDetection.spam * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Media URL:{" "}
                  {selectedItem?.mediaUrl ? (
                    <a
                      href={selectedItem.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      {selectedItem.mediaUrl.substring(0, 30)}...
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="flex gap-2">
                  {selectedItem?.mediaUrl && (
                    <Button variant="outline" size="sm" onClick={() => window.open(selectedItem.mediaUrl, "_blank")}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Original
                    </Button>
                  )}
                  <Button variant="default" size="sm" onClick={() => setSelectedItem(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Moderation History</DialogTitle>
            <DialogDescription>Choose your export options</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select defaultValue="csv">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Include Fields</Label>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  Select All
                </Button>
              </div>
              <ScrollArea className="h-32 rounded-md border p-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="field-id" defaultChecked />
                    <Label htmlFor="field-id">Content ID</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="field-type" defaultChecked />
                    <Label htmlFor="field-type">Content Type</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="field-title" defaultChecked />
                    <Label htmlFor="field-title">Title</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="field-username" defaultChecked />
                    <Label htmlFor="field-username">Username</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="field-userid" defaultChecked />
                    <Label htmlFor="field-userid">User ID</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="field-hashtags" defaultChecked />
                    <Label htmlFor="field-hashtags">Hashtags</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="field-caption" defaultChecked />
                    <Label htmlFor="field-caption">Caption</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="field-media" defaultChecked />
                    <Label htmlFor="field-media">Media URL</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="field-action" defaultChecked />
                    <Label htmlFor="field-action">Action</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="field-reason" defaultChecked />
                    <Label htmlFor="field-reason">Reason</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="field-timestamp" defaultChecked />
                    <Label htmlFor="field-timestamp">Timestamp</Label>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // In a real app, this would trigger the export
                console.log("Exporting data...")
                setIsExportDialogOpen(false)
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

