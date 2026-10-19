import type { PricingPlan } from '../types'

// Monthly prices and copy are from Figma. Figma shows a Yearly toggle but no
// yearly prices: `yearlyPrice` is monthly x 12 with NO discount, a placeholder
// until the real figures are supplied (TODO(figma)).
export const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'For individuals getting started',
    features: ['Up to 3 projects', 'Basic AI suggestions', 'Community support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 19,
    yearlyPrice: 228,
    description: 'For growing teams',
    features: ['Unlimited projects', 'Advanced AI suggestions', 'Team collaboration', 'Priority support'],
    highlighted: true,
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 49,
    yearlyPrice: 588,
    description: 'For larger organizations',
    features: ['Everything in Pro', 'Advanced automations', 'Custom integrations', 'Dedicated support'],
  },
]
