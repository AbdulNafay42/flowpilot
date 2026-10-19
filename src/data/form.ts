// Values from the brief's contact form spec.
export const teamSizes = ['1-10', '11-50', '51-200', '200+'] as const
export const demoTimes = ['Morning', 'Afternoon', 'Evening'] as const
export const MESSAGE_MIN = 20
export const MESSAGE_MAX = 300
export const SUBMIT_DELAY_MS = 1000
export const SUCCESS_MESSAGE = 'Thanks! Our team will contact you shortly.'

// Figma's 375px form labels the options as "1 - 10 members". The option values
// stay the brief's (1-10, 11-50, 51-200, 200+); only the visible label is formatted.
// Labels for sizes other than 1-10 follow the same pattern (not shown in Figma).
export const teamSizeLabel = (size: (typeof teamSizes)[number]) =>
  `${size.replace('-', ' - ')} members`

// The 375px design shows Team Size already set to the first option.
export const MOBILE_DEFAULT_TEAM_SIZE = teamSizes[0]
