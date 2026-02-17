// In-memory JSON data store for CRM Lite
// This simulates a file-based JSON database

export type OpportunityStatus = "New" | "Contacted" | "Follow-Up" | "Won" | "Lost"

export type Opportunity = {
  id: string
  name: string
  email: string
  status: OpportunityStatus
  value: number
  created_at: string
  updated_at: string
}

export type InteractionType = "Phone Call" | "Email Sent" | "Meeting Notes" | "Custom Note"

export type Interaction = {
  id: string
  opportunityId: string
  type: InteractionType
  notes: string
  timestamp: string
}

type Store = {
  opportunities: Opportunity[]
  interactions: Interaction[]
}

// Initialize with seed data
const store: Store = {
  opportunities: [
    {
      id: "opp_1",
      name: "John Doe",
      email: "john@email.com",
      status: "Contacted",
      value: 1200,
      created_at: "2026-01-15T10:00:00Z",
      updated_at: "2026-02-01T14:30:00Z",
    },
    {
      id: "opp_2",
      name: "Jane Smith",
      email: "jane@company.com",
      status: "New",
      value: 4500,
      created_at: "2026-02-05T09:00:00Z",
      updated_at: "2026-02-05T09:00:00Z",
    },
    {
      id: "opp_3",
      name: "Acme Corp",
      email: "deals@acme.com",
      status: "Follow-Up",  
      value: 12000,
      created_at: "2026-01-20T11:00:00Z",
      updated_at: "2026-02-10T16:00:00Z",
    },
    {
      id: "opp_4",
      name: "Sarah Lee",
      email: "sarah@startup.io",
      status: "Won",
      value: 8500,
      created_at: "2025-12-10T08:00:00Z",
      updated_at: "2026-01-30T12:00:00Z",
    },
    {
      id: "opp_5",
      name: "Bob Williams",
      email: "bob@enterprise.co",
      status: "Lost",
      value: 3200,
      created_at: "2026-01-05T15:00:00Z",
      updated_at: "2026-02-08T10:00:00Z",
    },
  ],
  interactions: [
    {
      id: "int_1",
      opportunityId: "opp_1",
      type: "Phone Call",
      notes: "Client interested in our premium plan. Asked about pricing tiers and custom integrations.",
      timestamp: "2026-01-20T10:00:00Z",
    },
    {
      id: "int_2",
      opportunityId: "opp_1",
      type: "Email Sent",
      notes: "Sent detailed pricing breakdown with comparison chart. Highlighted annual discount.",
      timestamp: "2026-01-22T14:00:00Z",
    },
    {
      id: "int_3",
      opportunityId: "opp_1",
      type: "Meeting Notes",
      notes: "Had a 30-min demo call. Client is price-sensitive but impressed with features. Needs to discuss with their team.",
      timestamp: "2026-01-28T11:00:00Z",
    },
    {
      id: "int_4",
      opportunityId: "opp_3",
      type: "Phone Call",
      notes: "Initial discovery call. Acme needs a solution for 200+ employees. Current provider contract ends in March.",
      timestamp: "2026-01-25T09:00:00Z",
    },
    {
      id: "int_5",
      opportunityId: "opp_3",
      type: "Email Sent",
      notes: "Sent enterprise proposal with volume pricing. Included case studies from similar companies.",
      timestamp: "2026-02-02T16:00:00Z",
    },
    {
      id: "int_6",
      opportunityId: "opp_3",
      type: "Custom Note",
      notes: "Decision maker is the CTO. They have budget approval for Q1. Need to follow up before March 1st.",
      timestamp: "2026-02-08T10:00:00Z",
    },
    {
      id: "int_7",
      opportunityId: "opp_4",
      type: "Phone Call",
      notes: "Sarah loved the product demo. Wants to onboard her entire team of 15.",
      timestamp: "2025-12-20T13:00:00Z",
    },
    {
      id: "int_8",
      opportunityId: "opp_4",
      type: "Meeting Notes",
      notes: "Closed the deal! Signed annual contract. Sarah will be our champion for referrals.",
      timestamp: "2026-01-30T12:00:00Z",
    },
  ],
}

// Helper functions for CRUD operations
export function getStore(): Store {
  return store
}

// Opportunity operations
export function getOpportunities(): Opportunity[] {
  return store.opportunities
}

export function findOpportunity(id: string): Opportunity | undefined {
  return store.opportunities.find((o) => o.id === id)
}

export function createOpportunity(data: Omit<Opportunity, "id" | "created_at" | "updated_at">): Opportunity {
  const opportunity: Opportunity = {
    ...data,
    id: `opp_${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  store.opportunities.push(opportunity)
  return opportunity
}

export function updateOpportunity(id: string, data: Partial<Omit<Opportunity, "id" | "created_at">>): Opportunity | undefined {
  const index = store.opportunities.findIndex((o) => o.id === id)
  if (index === -1) return undefined
  store.opportunities[index] = {
    ...store.opportunities[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  return store.opportunities[index]
}

export function deleteOpportunity(id: string): boolean {
  const index = store.opportunities.findIndex((o) => o.id === id)
  if (index === -1) return false
  store.opportunities.splice(index, 1)
  // Also delete related interactions
  store.interactions = store.interactions.filter((i) => i.opportunityId !== id)
  return true
}

// Interaction operations
export function getInteractionsByOpportunity(opportunityId: string): Interaction[] {
  return store.interactions
    .filter((i) => i.opportunityId === opportunityId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function createInteraction(data: Omit<Interaction, "id" | "timestamp">): Interaction {
  const interaction: Interaction = {
    ...data,
    id: `int_${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
  store.interactions.push(interaction)
  return interaction
}

export function deleteInteraction(id: string): boolean {
  const index = store.interactions.findIndex((i) => i.id === id)
  if (index === -1) return false
  store.interactions.splice(index, 1)
  return true
}
