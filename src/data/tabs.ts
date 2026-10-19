import type { TabItem } from '../types'

export const tabsHeading = {
  title: 'Plan, automate, collaborate',
  subtitle: 'One workflow, three ways to move work forward.',
}

// Only the "Plan" tab is specified in Figma (card copy, 40% / "Less manual
// work", bar filled to 280 of 420px = 67%). The Automate and Collaborate copy
// and metrics are not in the design; they are sample copy.
export const tabs: TabItem[] = [
  {
    id: 'plan',
    label: 'Plan',
    title: 'Break goals into clear tasks',
    description: 'AI-assisted planning keeps priorities visible and actionable.',
    metric: { value: '40%', label: 'Less manual work', percent: 67 },
  },
  // ASSUMPTION: sample copy, not from Figma
  {
    id: 'automate',
    label: 'Automate',
    title: 'Automate repetitive work',
    description: 'Set rules once and let FlowPilot handle routine steps.',
    metric: { value: '30%', label: 'Fewer repetitive tasks', percent: 30 },
  },
  // ASSUMPTION: sample copy, not from Figma
  {
    id: 'collaborate',
    label: 'Collaborate',
    title: 'Keep everyone aligned',
    description: 'Share plans and updates in one place so the team stays in sync.',
    metric: { value: '25%', label: 'Faster team handoffs', percent: 25 },
  },
]
