import { NextResponse } from "next/server"

// Sample policies data
const policies = [
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
  // More policies...
]

export async function GET() {
  // Simulate a delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(policies)
}

