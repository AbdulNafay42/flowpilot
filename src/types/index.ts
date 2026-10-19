export interface NavLink {
  label: string
  href: string // "#section-id"
  mobileLabel?: string // label in the full-screen mobile menu, when it differs
}

export interface TabItem {
  id: string
  label: string
  title: string
  description: string
  metric: { value: string; label: string; percent: number }
}

export interface Testimonial {
  id: string
  quote: string
  desktopLines?: string[] // optional line structure from the desktop design (each line is a block span on lg+)
  author: string
  role: string
}

export interface PricingPlan {
  id: string
  name: string
  monthlyPrice: number | null // null = not provided by design yet
  yearlyPrice: number | null // null = not provided by design yet
  description: string
  features: string[]
  highlighted?: boolean
}

export interface Feature {
  id: string
  title: string
  description: string
  short: string // shorter copy shown at 375px
  icon: { type: 'image'; src: string } | { type: 'glyph'; glyph: string; tone: string }
}

export type BillingPeriod = 'monthly' | 'yearly'
