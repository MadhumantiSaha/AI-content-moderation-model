import { NextResponse } from "next/server"

// Sample moderation history data
const moderationHistory = [
  {
    id: 1,
    contentId: "IMG-2023-001",
    type: "image",
    title: "Profile picture upload",
    username: "user123",
    userId: "U78901",
    hashtags: ["#profile", "#new"],
    caption: "New profile picture for the summer!",
    mediaUrl: "https://example.com/images/profile1.jpg",
    moderator: "mod_alex",
    timestamp: "2023-06-15T14:30:00",
    action: "approved",
    reason: "Content follows community guidelines",
    status: "active",
  },
  {
    id: 2,
    contentId: "VID-2023-042",
    type: "video",
    title: "Product demonstration video",
    username: "vendor456",
    userId: "U45678",
    hashtags: ["#product", "#demo", "#newrelease"],
    caption: "Check out our latest product features in action!",
    mediaUrl: "https://example.com/videos/product-demo.mp4",
    moderator: "mod_sarah",
    timestamp: "2023-06-15T12:45:00",
    action: "rejected",
    reason: "Misleading product claims",
    status: "inactive",
  },
  // More entries...
]

export async function GET() {
  // Simulate a delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(moderationHistory)
}

