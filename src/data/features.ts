import featurePlan from '../assets/icons/feature-plan.svg'
import featureTeam from '../assets/icons/feature-team.svg'
import type { Feature } from '../types'

// Copy from Figma. `short` is the shorter 375px wording. Icons: the blue and
// green tiles are Figma SVG assets; the violet "AI" and orange gear tiles are
// text glyphs in the design.
export const features: Feature[] = [
  {
    id: 'planning',
    title: 'Smart Task Planning',
    description: 'Automatically break down goals into actionable tasks with AI.',
    short: 'Break goals into actionable tasks.',
    icon: { type: 'image', src: featurePlan },
  },
  {
    id: 'suggestions',
    title: 'AI Suggestions',
    description: 'Get intelligent suggestions to improve your workflow.',
    short: 'Get intelligent workflow suggestions.',
    icon: { type: 'glyph', glyph: 'AI', tone: 'bg-tile-violet' },
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Keep everyone aligned with real-time updates.',
    short: 'Keep everyone aligned in real time.',
    icon: { type: 'image', src: featureTeam },
  },
  {
    id: 'workflows',
    title: 'Automated Workflows',
    description: 'Save time by automating repetitive tasks.',
    short: 'Automate repetitive work.',
    icon: { type: 'glyph', glyph: '⚙', tone: 'bg-tile-orange' },
  },
]
