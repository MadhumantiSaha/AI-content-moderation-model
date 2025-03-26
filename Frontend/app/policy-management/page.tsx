"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Check, Edit, FileText, Info, MoreHorizontal, Plus, Settings, Trash2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import DashboardLayout from "@/components/dashboard-layout"

// Likelihood levels for content classification
type LikelihoodLevel = "UNKNOWN" | "VERY_UNLIKELY" | "UNLIKELY" | "POSSIBLE" | "LIKELY" | "VERY_LIKELY"

// Interface for content classification policy
interface ContentClassification {
  id: string
  name: string
  description: string
  threshold: LikelihoodLevel
  autoFlag: boolean
}

// Sample data for moderation policies
interface Policy {
  id: number
  name: string
  description: string
  category: string
  status: "active" | "draft" | "inactive"
  lastUpdated: string
  rules: {
    id: number
    name: string
    description: string
    severity: "high" | "medium" | "low"
    autoFlag: boolean
    keywords: string[]
  }[]
  contentClassifications?: {
    explicit: ContentClassification
    violence: ContentClassification
  }
}

export default function PolicyManagementPage() {
  const [activePolicies, setActivePolicies] = useState<Policy[]>([])
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false)
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    description: "",
    category: "Content",
    status: "draft",
  })
  const [editingPolicy, setEditingPolicy] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showInfoDialog, setShowInfoDialog] = useState(false)

  useEffect(() => {
    const fetchPolicies = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // In a real app, this would be an actual API call
        // const response = await fetch('http://localhost:3000/api/policies');
        // if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        // const data = await response.json();

        // For demo purposes, we'll simulate an API call with a timeout
        setTimeout(() => {
          const mockData: Policy[] = [
            {
              id: 1,
              name: "Hate Speech Policy",
              description: "Guidelines for identifying and handling hate speech content",
              category: "Content",
              status: "active",
              lastUpdated: "2023-06-01",
              rules: [
                {
                  id: 101,
                  name: "Discriminatory language",
                  description: "Content that discriminates against protected characteristics",
                  severity: "high",
                  autoFlag: true,
                  keywords: ["racial slurs", "discriminatory terms"],
                },
                {
                  id: 102,
                  name: "Threatening content",
                  description: "Content that threatens violence against groups",
                  severity: "high",
                  autoFlag: true,
                  keywords: ["threats", "violence"],
                },
              ],
              contentClassifications: {
                explicit: {
                  id: "explicit-hate",
                  name: "Explicit Content",
                  description: "Detects explicit or adult content in hate speech context",
                  threshold: "POSSIBLE",
                  autoFlag: true,
                },
                violence: {
                  id: "violence-hate",
                  name: "Violent Content",
                  description: "Detects violent imagery or language in hate speech context",
                  threshold: "LIKELY",
                  autoFlag: true,
                },
              },
            },
            {
              id: 2,
              name: "Inappropriate Content Policy",
              description: "Guidelines for identifying and handling inappropriate content",
              category: "Content",
              status: "active",
              lastUpdated: "2023-05-15",
              rules: [
                {
                  id: 201,
                  name: "Adult content",
                  description: "Explicit or suggestive adult content",
                  severity: "medium",
                  autoFlag: true,
                  keywords: ["explicit", "adult"],
                },
                {
                  id: 202,
                  name: "Graphic violence",
                  description: "Excessively violent or graphic content",
                  severity: "high",
                  autoFlag: true,
                  keywords: ["graphic", "violence", "gore"],
                },
              ],
              contentClassifications: {
                explicit: {
                  id: "explicit-inappropriate",
                  name: "Explicit Content",
                  description: "Detects explicit or adult content",
                  threshold: "VERY_LIKELY",
                  autoFlag: true,
                },
                violence: {
                  id: "violence-inappropriate",
                  name: "Violent Content",
                  description: "Detects violent imagery or language",
                  threshold: "LIKELY",
                  autoFlag: true,
                },
              },
            },
            {
              id: 3,
              name: "Spam Policy",
              description: "Guidelines for identifying and handling spam content",
              category: "Behavior",
              status: "active",
              lastUpdated: "2023-04-20",
              rules: [
                {
                  id: 301,
                  name: "Repetitive content",
                  description: "Posting the same content repeatedly",
                  severity: "low",
                  autoFlag: true,
                  keywords: [],
                },
                {
                  id: 302,
                  name: "Unsolicited promotions",
                  description: "Unsolicited promotional content or links",
                  severity: "medium",
                  autoFlag: true,
                  keywords: ["buy now", "discount", "offer", "promotion"],
                },
              ],
              contentClassifications: {
                explicit: {
                  id: "explicit-spam",
                  name: "Explicit Content",
                  description: "Detects explicit content in spam",
                  threshold: "UNLIKELY",
                  autoFlag: false,
                },
                violence: {
                  id: "violence-spam",
                  name: "Violent Content",
                  description: "Detects violent content in spam",
                  threshold: "UNLIKELY",
                  autoFlag: false,
                },
              },
            },
            {
              id: 4,
              name: "Misinformation Policy",
              description: "Guidelines for identifying and handling misinformation",
              category: "Content",
              status: "draft",
              lastUpdated: "2023-06-10",
              rules: [
                {
                  id: 401,
                  name: "Health misinformation",
                  description: "False or misleading health-related claims",
                  severity: "high",
                  autoFlag: false,
                  keywords: ["cure", "miracle treatment"],
                },
              ],
              contentClassifications: {
                explicit: {
                  id: "explicit-misinfo",
                  name: "Explicit Content",
                  description: "Detects explicit content in misinformation",
                  threshold: "UNKNOWN",
                  autoFlag: false,
                },
                violence: {
                  id: "violence-misinfo",
                  name: "Violent Content",
                  description: "Detects violent content in misinformation",
                  threshold: "POSSIBLE",
                  autoFlag: true,
                },
              },
            },
          ]

          setActivePolicies(mockData)
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error fetching policies:", err)
        setError("Failed to load policies. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  const handleAddPolicy = () => {
    const policy = {
      id: Math.max(...activePolicies.map((p) => p.id)) + 1,
      name: newPolicy.name,
      description: newPolicy.description,
      category: newPolicy.category,
      status: newPolicy.status as "active" | "draft" | "inactive",
      lastUpdated: new Date().toISOString().split("T")[0],
      rules: [],
      contentClassifications: {
        explicit: {
          id: `explicit-${newPolicy.name.toLowerCase().replace(/\s+/g, "-")}`,
          name: "Explicit Content",
          description: "Detects explicit or adult content",
          threshold: "UNKNOWN" as LikelihoodLevel,
          autoFlag: false,
        },
        violence: {
          id: `violence-${newPolicy.name.toLowerCase().replace(/\s+/g, "-")}`,
          name: "Violent Content",
          description: "Detects violent imagery or language",
          threshold: "UNKNOWN" as LikelihoodLevel,
          autoFlag: false,
        },
      },
    }

    setActivePolicies([...activePolicies, policy])
    setNewPolicy({
      name: "",
      description: "",
      category: "Content",
      status: "draft",
    })
    setIsAddPolicyOpen(false)
  }

  const togglePolicyStatus = (id: number) => {
    setActivePolicies(
      activePolicies.map((policy) =>
        policy.id === id
          ? {
              ...policy,
              status: policy.status === "active" ? "inactive" : "active",
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : policy,
      ),
    )
  }

  const deletePolicy = (id: number) => {
    setActivePolicies(activePolicies.filter((policy) => policy.id !== id))
  }

  const updateContentClassification = (policyId: number, type: "explicit" | "violence", threshold: LikelihoodLevel) => {
    setActivePolicies(
      activePolicies.map((policy) =>
        policy.id === policyId && policy.contentClassifications
          ? {
              ...policy,
              contentClassifications: {
                ...policy.contentClassifications,
                [type]: {
                  ...policy.contentClassifications[type],
                  threshold,
                  lastUpdated: new Date().toISOString().split("T")[0],
                },
              },
            }
          : policy,
      ),
    )
  }

  const toggleAutoFlag = (policyId: number, type: "explicit" | "violence") => {
    setActivePolicies(
      activePolicies.map((policy) =>
        policy.id === policyId && policy.contentClassifications
          ? {
              ...policy,
              contentClassifications: {
                ...policy.contentClassifications,
                [type]: {
                  ...policy.contentClassifications[type],
                  autoFlag: !policy.contentClassifications[type].autoFlag,
                  lastUpdated: new Date().toISOString().split("T")[0],
                },
              },
            }
          : policy,
      ),
    )
  }

  // Helper function to render likelihood badge
  const renderLikelihoodBadge = (level: LikelihoodLevel) => {
    switch (level) {
      case "UNKNOWN":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            UNKNOWN
          </Badge>
        )
      case "VERY_UNLIKELY":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            VERY UNLIKELY
          </Badge>
        )
      case "UNLIKELY":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            UNLIKELY
          </Badge>
        )
      case "POSSIBLE":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            POSSIBLE
          </Badge>
        )
      case "LIKELY":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            LIKELY
          </Badge>
        )
      case "VERY_LIKELY":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            VERY LIKELY
          </Badge>
        )
      default:
        return <Badge variant="outline">UNKNOWN</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Policy Management</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowInfoDialog(true)}>
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Learn more about policy management</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Dialog open={isAddPolicyOpen} onOpenChange={setIsAddPolicyOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Policy
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Policy</DialogTitle>
                  <DialogDescription>Add a new moderation policy to your platform</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy-name">Policy Name</Label>
                    <Input
                      id="policy-name"
                      placeholder="e.g., Harassment Policy"
                      value={newPolicy.name}
                      onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policy-description">Description</Label>
                    <Textarea
                      id="policy-description"
                      placeholder="Describe the purpose and scope of this policy"
                      value={newPolicy.description}
                      onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="policy-category">Category</Label>
                      <Select
                        value={newPolicy.category}
                        onValueChange={(value) => setNewPolicy({ ...newPolicy, category: value })}
                      >
                        <SelectTrigger id="policy-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Content">Content</SelectItem>
                          <SelectItem value="Behavior">Behavior</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policy-status">Status</Label>
                      <Select
                        value={newPolicy.status}
                        onValueChange={(value) => setNewPolicy({ ...newPolicy, status: value })}
                      >
                        <SelectTrigger id="policy-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPolicyOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPolicy} disabled={!newPolicy.name || !newPolicy.description}>
                    Create Policy
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground">Define and manage content moderation policies</p>
        </div>

        {/* Content Classification Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-800">
              <Settings className="mr-2 h-5 w-5 text-blue-600" />
              Content Classification System
            </CardTitle>
            <CardDescription className="text-blue-700">
              Our AI-powered content classification system helps you automatically detect and moderate problematic
              content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700">
              <p className="mb-2">
                The content classification system uses advanced AI models to analyze images, videos, and text for
                potentially harmful content. Configure thresholds for each policy to determine when content should be
                automatically flagged for review.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white rounded-md p-3 border border-blue-200 shadow-sm">
                  <h3 className="font-medium text-blue-800 flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                    Explicit Content Detection
                  </h3>
                  <p className="text-sm mt-1">
                    Identifies adult, sexual, or inappropriate content in images, videos, and text.
                  </p>
                </div>
                <div className="bg-white rounded-md p-3 border border-blue-200 shadow-sm">
                  <h3 className="font-medium text-blue-800 flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
                    Violence Content Detection
                  </h3>
                  <p className="text-sm mt-1">
                    Identifies violent imagery, threats, or harmful language in user-generated content.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => setShowInfoDialog(true)}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Policies</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {activePolicies.map((policy) => (
                <Card key={policy.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle>{policy.name}</CardTitle>
                        {policy.status === "active" && <Badge className="bg-green-600">Active</Badge>}
                        {policy.status === "draft" && <Badge variant="outline">Draft</Badge>}
                        {policy.status === "inactive" && <Badge variant="secondary">Inactive</Badge>}
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
                          <DropdownMenuItem onClick={() => setEditingPolicy(policy.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Policy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => togglePolicyStatus(policy.id)}>
                            {policy.status === "active" ? (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => deletePolicy(policy.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Policy
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>
                      <div className="flex flex-col gap-1">
                        <span>{policy.description}</span>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="text-xs font-normal">
                            {policy.category}
                          </Badge>
                          <span>•</span>
                          <span>Last updated: {policy.lastUpdated}</span>
                          <span>•</span>
                          <span>{policy.rules.length} rules</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full">
                      {/* Content Classification Section - Highlighted */}
                      <AccordionItem
                        value={`classification-${policy.id}`}
                        className="border-blue-200 shadow-sm rounded-md overflow-hidden"
                      >
                        <AccordionTrigger className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 hover:bg-blue-100 hover:no-underline">
                          <div className="flex items-center gap-2 text-blue-800">
                            <Settings className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium">Content Classification</span>
                            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300">
                              AI-Powered
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-white px-2 pt-4">
                          <div className="space-y-4">
                            {policy.contentClassifications ? (
                              <>
                                {/* Explicit Content Classification */}
                                <Card className="border-blue-200">
                                  <CardHeader className="py-3 bg-gradient-to-r from-red-50 to-pink-50">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <CardTitle className="text-base text-red-800">Explicit Content</CardTitle>
                                        {renderLikelihoodBadge(policy.contentClassifications.explicit.threshold)}
                                      </div>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                              <Info className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="max-w-xs">
                                              Explicit content detection identifies adult, sexual, or inappropriate
                                              content in images, videos, and text.
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="py-4">
                                    <p className="text-sm">{policy.contentClassifications.explicit.description}</p>

                                    <div className="mt-4 space-y-4">
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id={`auto-flag-explicit-${policy.id}`}
                                          checked={policy.contentClassifications.explicit.autoFlag}
                                          onCheckedChange={() => toggleAutoFlag(policy.id, "explicit")}
                                        />
                                        <Label htmlFor={`auto-flag-explicit-${policy.id}`}>Auto-flag content</Label>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor={`threshold-explicit-${policy.id}`}>Likelihood Threshold</Label>
                                        <Select
                                          value={policy.contentClassifications.explicit.threshold}
                                          onValueChange={(value) =>
                                            updateContentClassification(policy.id, "explicit", value as LikelihoodLevel)
                                          }
                                        >
                                          <SelectTrigger id={`threshold-explicit-${policy.id}`}>
                                            <SelectValue placeholder="Select threshold" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="UNKNOWN">UNKNOWN</SelectItem>
                                            <SelectItem value="VERY_UNLIKELY">VERY UNLIKELY</SelectItem>
                                            <SelectItem value="UNLIKELY">UNLIKELY</SelectItem>
                                            <SelectItem value="POSSIBLE">POSSIBLE</SelectItem>
                                            <SelectItem value="LIKELY">LIKELY</SelectItem>
                                            <SelectItem value="VERY_LIKELY">VERY_LIKELY</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="grid grid-cols-5 gap-2 mt-4">
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">VERY UNLIKELY</div>
                                          <div className="h-1.5 bg-green-200 rounded-full"></div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">UNLIKELY</div>
                                          <div className="h-1.5 bg-blue-200 rounded-full"></div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">POSSIBLE</div>
                                          <div className="h-1.5 bg-yellow-200 rounded-full"></div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">LIKELY</div>
                                          <div className="h-1.5 bg-orange-200 rounded-full"></div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">VERY LIKELY</div>
                                          <div className="h-1.5 bg-red-200 rounded-full"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Violence Content Classification */}
                                <Card className="border-blue-200">
                                  <CardHeader className="py-3 bg-gradient-to-r from-orange-50 to-amber-50">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <CardTitle className="text-base text-orange-800">Violence Content</CardTitle>
                                        {renderLikelihoodBadge(policy.contentClassifications.violence.threshold)}
                                      </div>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                              <Info className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="max-w-xs">
                                              Violence content detection identifies violent imagery, threats, or harmful
                                              language in user-generated content.
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="py-4">
                                    <p className="text-sm">{policy.contentClassifications.violence.description}</p>

                                    <div className="mt-4 space-y-4">
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id={`auto-flag-violence-${policy.id}`}
                                          checked={policy.contentClassifications.violence.autoFlag}
                                          onCheckedChange={() => toggleAutoFlag(policy.id, "violence")}
                                        />
                                        <Label htmlFor={`auto-flag-violence-${policy.id}`}>Auto-flag content</Label>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor={`threshold-violence-${policy.id}`}>Likelihood Threshold</Label>
                                        <Select
                                          value={policy.contentClassifications.violence.threshold}
                                          onValueChange={(value) =>
                                            updateContentClassification(policy.id, "violence", value as LikelihoodLevel)
                                          }
                                        >
                                          <SelectTrigger id={`threshold-violence-${policy.id}`}>
                                            <SelectValue placeholder="Select threshold" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="UNKNOWN">UNKNOWN</SelectItem>
                                            <SelectItem value="VERY_UNLIKELY">VERY UNLIKELY</SelectItem>
                                            <SelectItem value="UNLIKELY">UNLIKELY</SelectItem>
                                            <SelectItem value="POSSIBLE">POSSIBLE</SelectItem>
                                            <SelectItem value="LIKELY">LIKELY</SelectItem>
                                            <SelectItem value="VERY_LIKELY">VERY LIKELY</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="grid grid-cols-5 gap-2 mt-4">
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">VERY UNLIKELY</div>
                                          <div className="h-1.5 bg-green-200 rounded-full"></div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">UNLIKELY</div>
                                          <div className="h-1.5 bg-blue-200 rounded-full"></div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">POSSIBLE</div>
                                          <div className="h-1.5 bg-yellow-200 rounded-full"></div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">LIKELY</div>
                                          <div className="h-1.5 bg-orange-200 rounded-full"></div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">VERY LIKELY</div>
                                          <div className="h-1.5 bg-red-200 rounded-full"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                                  <div className="flex items-start gap-3">
                                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                      <h4 className="font-medium text-blue-800 mb-1">
                                        How Content Classification Works
                                      </h4>
                                      <p className="text-sm text-blue-700">
                                        Our AI models analyze content and return a likelihood score for each category.
                                        You can set thresholds to determine when content should be automatically flagged
                                        for review. Higher thresholds mean fewer false positives but may miss some
                                        problematic content.
                                      </p>
                                      <Button
                                        variant="link"
                                        className="p-0 h-auto text-blue-600 text-sm mt-2"
                                        onClick={() => setShowInfoDialog(true)}
                                      >
                                        Learn more about content classification
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                No content classification settings defined for this policy
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Rules Section */}
                      <AccordionItem value={`rules-${policy.id}`}>
                        <AccordionTrigger>
                          <span className="text-sm font-medium">Rules & Keywords</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {policy.rules.length === 0 ? (
                              <div className="text-center py-4 text-muted-foreground">
                                No rules defined for this policy yet
                              </div>
                            ) : (
                              policy.rules.map((rule) => (
                                <Card key={rule.id}>
                                  <CardHeader className="py-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <CardTitle className="text-base">{rule.name}</CardTitle>
                                        {rule.severity === "high" && <Badge variant="destructive">High Severity</Badge>}
                                        {rule.severity === "medium" && <Badge>Medium Severity</Badge>}
                                        {rule.severity === "low" && <Badge variant="outline">Low Severity</Badge>}
                                      </div>
                                      <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit rule</span>
                                      </Button>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="py-0">
                                    <p className="text-sm">{rule.description}</p>

                                    <div className="mt-2 flex items-center gap-2">
                                      <div className="flex items-center space-x-2">
                                        <Switch id={`auto-flag-${rule.id}`} checked={rule.autoFlag} />
                                        <Label htmlFor={`auto-flag-${rule.id}`}>Auto-flag content</Label>
                                      </div>
                                    </div>

                                    {rule.keywords.length > 0 && (
                                      <div className="mt-4">
                                        <Label className="text-xs text-muted-foreground">Keywords</Label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {rule.keywords.map((keyword, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                              {keyword}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))
                            )}

                            <Button variant="outline" className="w-full">
                              <Plus className="mr-2 h-4 w-4" />
                              Add Rule
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View Full Policy
                    </Button>
                    <Button size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Policy
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="active" className="space-y-4 mt-4">
              {activePolicies
                .filter((policy) => policy.status === "active")
                .map((policy) => (
                  <Card key={policy.id}>
                    {/* Same card content as above */}
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle>{policy.name}</CardTitle>
                          <Badge className="bg-green-600">Active</Badge>
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
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Policy
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => togglePolicyStatus(policy.id)}>
                              <X className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => deletePolicy(policy.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Policy
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>
                        <div className="flex flex-col gap-1">
                          <span>{policy.description}</span>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="outline" className="text-xs font-normal">
                              {policy.category}
                            </Badge>
                            <span>•</span>
                            <span>Last updated: {policy.lastUpdated}</span>
                            <span>•</span>
                            <span>{policy.rules.length} rules</span>
                          </div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>{/* Content here */}</CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="draft" className="space-y-4 mt-4">
              {activePolicies
                .filter((policy) => policy.status === "draft")
                .map((policy) => (
                  <Card key={policy.id}>{/* Same card content as above */}</Card>
                ))}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Content Classification Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Content Classification System
            </DialogTitle>
            <DialogDescription>Understanding how our AI-powered content moderation works</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p>
              The Content Classification System is a core component of our moderation platform that uses advanced AI
              models to automatically detect potentially harmful content across images, videos, and text.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Explicit Content Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    This classifier identifies adult, sexual, or inappropriate content in user-generated content. It's
                    trained on a diverse dataset to recognize explicit imagery and text with high accuracy.
                  </p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Likelihood Levels:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          VERY UNLIKELY
                        </Badge>
                        <span>Almost certainly not explicit content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          UNLIKELY
                        </Badge>
                        <span>Probably not explicit content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          POSSIBLE
                        </Badge>
                        <span>Might contain explicit content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">
                          LIKELY
                        </Badge>
                        <span>Probably contains explicit content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          VERY LIKELY
                        </Badge>
                        <span>Almost certainly contains explicit content</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Violence Content Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    This classifier identifies violent imagery, threats, or harmful language in user-generated content.
                    It can detect physical violence, weapons, threats, and other concerning content.
                  </p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Likelihood Levels:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          VERY UNLIKELY
                        </Badge>
                        <span>Almost certainly not violent content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          UNLIKELY
                        </Badge>
                        <span>Probably not violent content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          POSSIBLE
                        </Badge>
                        <span>Might contain violent content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">
                          LIKELY
                        </Badge>
                        <span>Probably contains violent content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          VERY LIKELY
                        </Badge>
                        <span>Almost certainly contains violent content</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-6">
              <h3 className="font-medium text-blue-800 mb-2">Best Practices for Content Classification</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Start with more sensitive thresholds (POSSIBLE or LIKELY) and adjust based on your needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Use auto-flagging for high-confidence detections to reduce manual review workload</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Regularly review flagged content to fine-tune your thresholds</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Consider different thresholds for different types of communities or content</span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowInfoDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

