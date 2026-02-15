import { generateText, Output } from "ai"
import { z } from "zod"
import { findOpportunity, getInteractionsByOpportunity } from "@/lib/store"

const aiAssistSchema = z.object({
  summary: z.array(z.string()).describe("3 bullet points summarizing the relationship state"),
  suggestedNextStep: z.string().describe("A specific, actionable next step to take"),
  urgency: z.string().describe("Low, Medium, or High urgency level"),
})

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const opportunity = findOpportunity(id)

  if (!opportunity) {
    return Response.json({ error: "Opportunity not found" }, { status: 404 })
  }

  const interactions = getInteractionsByOpportunity(id)

  if (interactions.length === 0) {
    return Response.json({
      summary: [
        "No interactions recorded yet",
        "This is a new opportunity with no contact history",
        "Initial outreach is needed",
      ],
      suggestedNextStep: "Send an introductory email or make a discovery call to establish first contact",
      urgency: "Medium",
    })
  }

  const interactionHistory = interactions
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((i) => `[${i.type}] ${new Date(i.timestamp).toLocaleDateString()}: ${i.notes}`)
    .join("\n")

  const prompt = `You are a CRM workflow assistant. Analyze the following opportunity and its interaction history, then provide a strategic summary and recommended next action.

OPPORTUNITY:
- Name: ${opportunity.name}
- Email: ${opportunity.email}
- Status: ${opportunity.status}
- Value: $${opportunity.value.toLocaleString()}
- Created: ${new Date(opportunity.createdAt).toLocaleDateString()}

INTERACTION HISTORY:
${interactionHistory}

Based on this data, provide:
1. Exactly 3 bullet-point summaries of the current relationship state
2. A specific, actionable next step (e.g., "Send follow-up email with pricing breakdown", "Book a meeting to close the deal")
3. An urgency level: Low, Medium, or High`

  try {
    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      output: Output.object({ schema: aiAssistSchema }),
      prompt,
    })

    return Response.json(output)
  } catch (error) {
    console.error("AI assist error:", error)
    return Response.json(
      { error: "Failed to generate AI analysis. Please try again." },
      { status: 500 }
    )
  }
}
