"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Check,
  Code,
  Copy,
  Eye,
  EyeOff,
  Key,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Info,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import DashboardLayout from "@/components/dashboard-layout"

// Sample data for API keys
const apiKeys = [
  {
    id: 1,
    name: "Production API Key",
    key: "mod_prod_a1b2c3d4e5f6g7h8i9j0",
    created: "2023-05-10",
    lastUsed: "2023-06-14",
    status: "active",
    permissions: ["read", "write", "moderate"],
    rateLimit: 1000,
  },
  {
    id: 2,
    name: "Development API Key",
    key: "mod_dev_z9y8x7w6v5u4t3s2r1q0",
    created: "2023-05-15",
    lastUsed: "2023-06-13",
    status: "active",
    permissions: ["read", "write"],
    rateLimit: 500,
  },
  {
    id: 3,
    name: "Testing API Key",
    key: "mod_test_j1k2l3m4n5o6p7q8r9s0",
    created: "2023-06-01",
    lastUsed: "2023-06-10",
    status: "inactive",
    permissions: ["read"],
    rateLimit: 100,
  },
]

// Sample integration code snippets
const integrationSnippets = {
  javascript: `// JavaScript Integration Example
const apiKey = 'YOUR_API_KEY';

// Function to moderate content
async function moderateContent(content, type) {
  const response = await fetch('https://api.moderationplatform.com/v1/moderate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${apiKey}\`
    },
    body: JSON.stringify({
      content,
      type // 'image', 'video', or 'text'
    })
  });
  
  return await response.json();
}

// Example usage
const result = await moderateContent('https://example.com/image.jpg', 'image');
console.log(result.approved ? 'Content approved' : 'Content rejected');`,

  python: `# Python Integration Example
import requests

api_key = 'YOUR_API_KEY'

def moderate_content(content, content_type):
    url = 'https://api.moderationplatform.com/v1/moderate'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }
    payload = {
        'content': content,
        'type': content_type  # 'image', 'video', or 'text'
    }
    
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

# Example usage
result = moderate_content('https://example.com/image.jpg', 'image')
print('Content approved' if result['approved'] else 'Content rejected')`,

  curl: `# cURL Integration Example
curl -X POST https://api.moderationplatform.com/v1/moderate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "content": "https://example.com/image.jpg",
    "type": "image"
  }'`,
}

export default function ApiManagementPage() {
  const [activeKeys, setActiveKeys] = useState(apiKeys)
  const [showKeys, setShowKeys] = useState<Record<number, boolean>>({})
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false)
  const [newKey, setNewKey] = useState({
    name: "",
    permissions: ["read"],
    rateLimit: 100,
  })
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [copiedSnippet, setCopiedSnippet] = useState(false)
  const [copiedKey, setCopiedKey] = useState<number | null>(null)

  const toggleKeyVisibility = (id: number) => {
    setShowKeys({
      ...showKeys,
      [id]: !showKeys[id],
    })
  }

  const copyToClipboard = (text: string, type: "key" | "snippet", id?: number) => {
    navigator.clipboard.writeText(text)

    if (type === "key" && id) {
      setCopiedKey(id)
      setTimeout(() => setCopiedKey(null), 2000)
    } else if (type === "snippet") {
      setCopiedSnippet(true)
      setTimeout(() => setCopiedSnippet(false), 2000)
    }
  }

  const handleAddKey = () => {
    const key = {
      id: Math.max(...activeKeys.map((k) => k.id)) + 1,
      name: newKey.name,
      key: `mod_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "-",
      status: "active",
      permissions: newKey.permissions,
      rateLimit: newKey.rateLimit,
    }

    setActiveKeys([...activeKeys, key])
    setNewKey({
      name: "",
      permissions: ["read"],
      rateLimit: 100,
    })
    setIsAddKeyOpen(false)

    // Automatically show the new key
    setShowKeys({
      ...showKeys,
      [key.id]: true,
    })
  }

  const toggleKeyStatus = (id: number) => {
    setActiveKeys(
      activeKeys.map((key) =>
        key.id === id
          ? {
              ...key,
              status: key.status === "active" ? "inactive" : "active",
            }
          : key,
      ),
    )
  }

  const deleteKey = (id: number) => {
    setActiveKeys(activeKeys.filter((key) => key.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">API & Key Management</h1>
            <Dialog open={isAddKeyOpen} onOpenChange={setIsAddKeyOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate New API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key for integrating with the moderation platform
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input
                      id="key-name"
                      placeholder="e.g., Production API Key"
                      value={newKey.name}
                      onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="permission-read"
                          checked={newKey.permissions.includes("read")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewKey({
                                ...newKey,
                                permissions: [...newKey.permissions, "read"],
                              })
                            } else {
                              setNewKey({
                                ...newKey,
                                permissions: newKey.permissions.filter((p) => p !== "read"),
                              })
                            }
                          }}
                        />
                        <Label htmlFor="permission-read">Read (View content)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="permission-write"
                          checked={newKey.permissions.includes("write")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewKey({
                                ...newKey,
                                permissions: [...newKey.permissions, "write"],
                              })
                            } else {
                              setNewKey({
                                ...newKey,
                                permissions: newKey.permissions.filter((p) => p !== "write"),
                              })
                            }
                          }}
                        />
                        <Label htmlFor="permission-write">Write (Submit content)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="permission-moderate"
                          checked={newKey.permissions.includes("moderate")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewKey({
                                ...newKey,
                                permissions: [...newKey.permissions, "moderate"],
                              })
                            } else {
                              setNewKey({
                                ...newKey,
                                permissions: newKey.permissions.filter((p) => p !== "moderate"),
                              })
                            }
                          }}
                        />
                        <Label htmlFor="permission-moderate">Moderate (Approve/reject content)</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                    <Select
                      value={newKey.rateLimit.toString()}
                      onValueChange={(value) => setNewKey({ ...newKey, rateLimit: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="rate-limit">
                        <SelectValue placeholder="Select rate limit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 requests/minute</SelectItem>
                        <SelectItem value="500">500 requests/minute</SelectItem>
                        <SelectItem value="1000">1000 requests/minute</SelectItem>
                        <SelectItem value="5000">5000 requests/minute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddKeyOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddKey} disabled={!newKey.name}>
                    Generate Key
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground">Manage API keys and integration snippets</p>
        </div>

        <Tabs defaultValue="keys">
          <TabsList>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="integration">Integration Snippets</TabsTrigger>
            <TabsTrigger value="documentation">API Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="space-y-4 mt-4">
            {activeKeys.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Key className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center mb-4">No API keys found</p>
                  <Button onClick={() => setIsAddKeyOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate API Key
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeKeys.map((key) => (
                <Card key={key.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle>{key.name}</CardTitle>
                        {key.status === "active" ? (
                          <Badge className="bg-green-600">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
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
                          <DropdownMenuItem onClick={() => toggleKeyStatus(key.id)}>
                            {key.status === "active" ? (
                              <>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Deactivate Key
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Activate Key
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Regenerate Key
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteKey(key.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Key
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span>Created: {key.created}</span>
                          <span>•</span>
                          <span>Last used: {key.lastUsed}</span>
                          <span>•</span>
                          <span>Rate limit: {key.rateLimit} req/min</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">API Key</Label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Input
                              readOnly
                              value={showKeys[key.id] ? key.key : "•".repeat(key.key.length)}
                              className="pr-20 font-mono text-sm"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleKeyVisibility(key.id)}
                              >
                                {showKeys[key.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                <span className="sr-only">{showKeys[key.id] ? "Hide" : "Show"} API key</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(key.key, "key", key.id)}
                              >
                                {copiedKey === key.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                <span className="sr-only">Copy API key</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Permissions</Label>
                        <div className="flex flex-wrap gap-1">
                          {key.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary" className="capitalize">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="integration" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Snippets</CardTitle>
                <CardDescription>Code examples to integrate with the moderation API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label>Language:</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="curl">cURL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative">
                    <div className="rounded-md border bg-muted">
                      <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
                        <div className="text-sm font-medium">{selectedLanguage}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1"
                          onClick={() =>
                            copyToClipboard(
                              integrationSnippets[selectedLanguage as keyof typeof integrationSnippets],
                              "snippet",
                            )
                          }
                        >
                          {copiedSnippet ? (
                            <>
                              <Check className="h-3 w-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="p-4 overflow-x-auto">
                        <pre className="text-sm">
                          <code>{integrationSnippets[selectedLanguage as keyof typeof integrationSnippets]}</code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4 bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Usage Instructions</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Replace <code>YOUR_API_KEY</code> with your actual API key. The API accepts content in the form of
                      URLs or base64-encoded strings for images and videos, and plain text for comments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhook Integration</CardTitle>
                <CardDescription>Receive moderation results via webhooks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook-url"
                        placeholder="https://your-app.com/api/moderation-webhook"
                        className="flex-1"
                      />
                      <Button>Save</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Webhook Events</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="event-content-approved" />
                        <Label htmlFor="event-content-approved">Content Approved</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="event-content-rejected" />
                        <Label htmlFor="event-content-rejected">Content Rejected</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="event-content-flagged" />
                        <Label htmlFor="event-content-flagged">Content Flagged</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="event-policy-updated" />
                        <Label htmlFor="event-policy-updated">Policy Updated</Label>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4 bg-muted/50">
                    <h3 className="text-sm font-medium mb-2">Webhook Payload Example</h3>
                    <pre className="text-xs overflow-x-auto">
                      <code>{`{
  "event": "content.approved",
  "timestamp": "2023-06-15T14:30:00Z",
  "content": {
    "id": "cont_123456789",
    "type": "image",
    "url": "https://example.com/image.jpg"
  },
  "moderation": {
    "decision": "approved",
    "confidence": 0.95,
    "moderator": "auto",
    "policy": "Inappropriate Content Policy"
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>Reference documentation for the moderation API</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="authentication">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        <span>Authentication</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm">All API requests must include your API key in the Authorization header:</p>
                      <pre className="text-xs p-3 rounded-md bg-muted">
                        <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
                      </pre>
                      <p className="text-sm">Keep your API keys secure and do not expose them in client-side code.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="endpoints">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        <span>API Endpoints</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium mb-2">POST /v1/moderate</h3>
                          <p className="text-sm mb-2">Submit content for moderation.</p>
                          <div className="rounded-md border p-3 bg-muted/50">
                            <h4 className="text-xs font-medium mb-1">Request Body</h4>
                            <pre className="text-xs">
                              <code>{`{
  "content": "https://example.com/image.jpg", // URL or base64 string
  "type": "image", // "image", "video", or "text"
  "async": false, // Set to true for webhook response
  "callback_url": "https://your-app.com/webhook" // Optional
}`}</code>
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">GET /v1/moderation/:id</h3>
                          <p className="text-sm mb-2">Get the status of a moderation request.</p>
                          <div className="rounded-md border p-3 bg-muted/50">
                            <h4 className="text-xs font-medium mb-1">Response</h4>
                            <pre className="text-xs">
                              <code>{`{
  "id": "mod_123456789",
  "status": "completed", // "pending", "completed", "failed"
  "result": {
    "approved": true,
    "confidence": 0.95,
    "categories": {
      "adult": 0.01,
      "violence": 0.02,
      "hate": 0.01
    }
  }
}`}</code>
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">GET /v1/policies</h3>
                          <p className="text-sm mb-2">List all moderation policies.</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">POST /v1/policies</h3>
                          <p className="text-sm mb-2">Create a new moderation policy.</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="rate-limits">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Rate Limits</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm">
                        API rate limits are applied on a per-key basis. The current rate limits are:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Standard tier: 100 requests per minute</li>
                        <li>Professional tier: 500 requests per minute</li>
                        <li>Enterprise tier: 1,000+ requests per minute</li>
                      </ul>
                      <p className="text-sm">Rate limit headers are included in all API responses:</p>
                      <pre className="text-xs p-3 rounded-md bg-muted">
                        <code>{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623766800`}</code>
                      </pre>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="errors">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Error Handling</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm">The API uses standard HTTP status codes to indicate success or failure:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>200 - OK: The request was successful</li>
                        <li>400 - Bad Request: Invalid request parameters</li>
                        <li>401 - Unauthorized: Invalid or missing API key</li>
                        <li>403 - Forbidden: Insufficient permissions</li>
                        <li>429 - Too Many Requests: Rate limit exceeded</li>
                        <li>500 - Internal Server Error: Something went wrong on our end</li>
                      </ul>
                      <div className="rounded-md border p-3 bg-muted/50">
                        <h4 className="text-xs font-medium mb-1">Error Response Format</h4>
                        <pre className="text-xs">
                          <code>{`{
  "error": {
    "code": "invalid_content_type",
    "message": "The provided content type is not supported",
    "status": 400
  }
}`}</code>
                        </pre>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Code className="mr-2 h-4 w-4" />
                  View Full API Documentation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

