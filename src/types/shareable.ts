export interface ShareableArtifact {
  version: 1
  scenario: {
    name: string
    systemTokens: number
    userTokens: number
    retrievedTokens: number
    toolTokens: number
    cachedTokens: number
    outputTokens: number
    requestsPerDay: number
    daysPerMonth: number
    activeUsers: number
    useBatch: boolean
    useCaching: boolean
  }
  routingSlots: {
    roleId: string
    roleLabel: string
    note: string
    share: number
    modelId: string
  }[]
  portfolioItems: {
    id: string
    label: string
    monthly: number
    annual: number
    type: 'template' | 'stack'
  }[]
  createdAt: string
}
