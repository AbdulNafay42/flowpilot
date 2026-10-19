import type { NavLink } from '../types'

// Labels and order follow the Figma header. Section ids are fixed by the page
// structure. Figma lists "FAQ" but the brief defines no FAQ section, so it
// points at the contact form (the mobile menu labels it "FAQ & Contact").
export const navLinks: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#contact', mobileLabel: 'FAQ & Contact' },
]
