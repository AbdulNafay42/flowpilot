import type { Testimonial } from '../types'

// Figma shows ONE testimonial (Jessica Lee, t1). The brief requires a slider with
// previous/next and an indicator, so t2 and t3 are sample testimonials.
// ASSUMPTION: sample copy, not from Figma.
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'FlowPilot has completely changed how our team works. We’re more organized, more productive, and spend less time on repetitive tasks.',
    desktopLines: [
      'FlowPilot has completely changed how our team works. We’re',
      'more organized, more productive, and spend less time on',
      'repetitive tasks.',
    ],
    author: 'Jessica Lee',
    role: 'Product Manager, Acme Inc.',
  },
  // ASSUMPTION: sample copy, not from Figma
  {
    id: 't2',
    quote: 'Our handoffs are smoother and nothing slips through the cracks anymore.',
    author: 'Alex Morgan',
    role: 'Operations Lead, Northwind',
  },
  // ASSUMPTION: sample copy, not from Figma
  {
    id: 't3',
    quote: 'Setup took minutes, and the whole team was using it by the end of the week.',
    author: 'Sam Patel',
    role: 'Engineering Manager, Globex',
  },
]
