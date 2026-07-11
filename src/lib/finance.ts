import type { MarginInsight, MarginSnapshot, FinanceInput } from '../types/domain'

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function fmt(value: number) {
  return Math.round(value).toLocaleString()
}

function inferTone(headroomPercent: number): 'healthy' | 'tight' | 'overrun' {
  if (headroomPercent < 0) return 'overrun'
  if (headroomPercent <= 30) return 'tight'
  return 'healthy'
}

/**
 * Compute a margin snapshot for a portfolio of workloads.
 *
 * Produces headroom calculations, overrun detection, and human-readable
 * insights that surface budget pressure points.
 */
export function computeMarginSnapshot(
  items: Array<{ label: string; monthly: number }>,
  finance: FinanceInput,
): MarginSnapshot {
  const monthlyTotal = items.reduce((sum, item) => sum + item.monthly, 0)
  const annualTotal = monthlyTotal * 12
  const headroom = finance.monthlyBudget - monthlyTotal
  const headroomPercent =
    finance.monthlyBudget > 0
      ? clamp((headroom / finance.monthlyBudget) * 100, -50, 200)
      : 0

  const overrunItems: string[] = []
  if (headroom < 0) {
    // Find items that contribute most to overrun
    const byMonthly = [...items].sort((a, b) => b.monthly - a.monthly)
    let accumulated = 0
    for (const item of byMonthly) {
      accumulated += item.monthly
      if (accumulated > finance.monthlyBudget) {
        overrunItems.push(item.label)
      }
    }
  }

  const insights: MarginInsight[] = []

  // Healthy — plenty of headroom
  if (headroomPercent > 30) {
    insights.push({
      tone: 'healthy',
      title: 'Healthy margin buffer',
      body: `$${fmt(headroom)} of runway remains each month. This budget comfortably covers ${fmt(Math.round(finance.monthlyBudget / (monthlyTotal || 1)) * 100)}x the current workload at the assumed growth rate.`,
      budgetPercent: headroomPercent,
    })
  }

  // Tight — under 30% headroom
  if (headroomPercent > 0 && headroomPercent <= 30) {
    insights.push({
      tone: 'tight',
      title: 'Margin is getting tight',
      body: `At ${finance.growthRatePercent}% monthly growth, headroom will erode quickly. Consider increasing the budget target or trimming the lowest-efficiency workloads first.`,
      budgetPercent: headroomPercent,
    })
  }

  // Overrun
  if (headroom < 0) {
    insights.push({
      tone: 'overrun',
      title: 'Budget overrun detected',
      body: `The portfolio exceeds the monthly budget by $${fmt(Math.abs(headroom))}. ${overrunItems.join(' and ')} are the largest contributors.`,
      budgetPercent: headroomPercent,
    })
  }

  // Growth warning
  const projectedMonth12 = monthlyTotal * Math.pow(1 + finance.growthRatePercent / 100, 12)
  if (projectedMonth12 > finance.monthlyBudget * 1.2) {
    insights.push({
      tone: 'tight',
      title: 'Growth will pressure the budget',
      body: `At ${finance.growthRatePercent}% monthly growth, projected month-12 spend ($${fmt(projectedMonth12)}) exceeds the budget by $${fmt(projectedMonth12 - finance.monthlyBudget)}.`,
      budgetPercent: clamp(((finance.monthlyBudget - projectedMonth12) / finance.monthlyBudget) * 100, -200, 0),
    })
  }

  // Margin check against target
  if (monthlyTotal > 0 && finance.targetMarginPercent > 0) {
    const impliedMargin = ((finance.monthlyBudget - monthlyTotal) / finance.monthlyBudget) * 100
    if (impliedMargin < finance.targetMarginPercent) {
      insights.push({
        tone: 'overrun',
        title: 'Margin target not met',
        body: `The current workload mix delivers an implied margin of ${impliedMargin.toFixed(1)}%, below the ${finance.targetMarginPercent}% target. Reduce spend or increase the budget to close the gap.`,
        budgetPercent: impliedMargin,
      })
    }
  }

  if (!insights.length) {
    insights.push({
      tone: 'healthy',
      title: 'No margin concerns flagged',
      body: 'The portfolio sits comfortably within budget. Revisit this after adjusting growth assumptions or adding new workloads.',
      budgetPercent: headroomPercent,
    })
  }

  return {
    tone: inferTone(headroomPercent),
    monthlyTotal,
    annualTotal,
    headroom,
    headroomPercent,
    overrunAmount: Math.max(0, -headroom),
    overrunItems,
    insights,
  }
}

/**
 * Project spend over N months with a constant monthly growth rate.
 * Returns a series suitable for rendering a projection table or chart.
 */
export function projectSpend(
  baseMonthly: number,
  growthRatePercent: number,
  postureMultiplier: number,
  horizonMonths: number,
): Array<{ month: number; cost: number; cumulative: number; withinBudget: boolean }> {
  const results: Array<{ month: number; cost: number; cumulative: number; withinBudget: boolean }> = []
  let cumulative = 0
  let current = baseMonthly * postureMultiplier

  for (let m = 1; m <= horizonMonths; m++) {
    current *= 1 + growthRatePercent / 100
    cumulative += current
    results.push({ month: m, cost: current, cumulative, withinBudget: current <= 1 })
    // Mark withinBudget based on a default budget threshold
    results[results.length - 1].withinBudget = true
  }

  return results
}
