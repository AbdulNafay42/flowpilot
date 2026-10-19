// Hero copy and the dashboard mockup content, from Figma. `short` is the
// abbreviated label the 375px design uses.
export const heroContent = {
  badgeTag: 'New',
  badgeText: 'AI-powered workflow for modern teams ›',
  headline: ['Work smarter.', 'Let AI handle the', 'repetitive work.'],
  subtitle: 'FlowPilot helps modern teams plan work, automate repetitive tasks, and keep everyone aligned.',
  trustNotes: ['No credit card required', 'Set up in minutes', 'Trusted by 10,000+ teams'],
}

export type TaskStatus = 'In Progress' | 'Completed' | 'Upcoming'

export const dashboard = {
  // Sidebar tabs. Figma designs only the Overview panel. Tasks reuses the task list
  // below; the other panels show a neutral placeholder (TODO(figma)).
  sidebar: [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'automations', label: 'Automations' },
    { id: 'team', label: 'Team' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ],
  tasksIntro: 'Everything on your plate today.',
  emptyPanelText: 'Nothing to show here yet.',
  greeting: 'Good morning, Sarah!',
  intro: "Here's what is happening with your team today.",
  tasksHeading: "Today's Tasks",
  stats: [
    { value: '12', label: 'Active Tasks', short: 'Active Tasks' },
    { value: '4', label: 'AI Suggestions', short: 'AI Suggest.' },
    { value: '85%', label: 'Project Progress', short: 'Progress' },
  ],
  tasks: [
    { name: 'Design landing page', short: 'Design landing page', status: 'In Progress' as TaskStatus },
    { name: 'Update documentation', short: 'Update docs', status: 'Completed' as TaskStatus },
    { name: 'Team sync meeting', short: 'Team sync', status: 'Upcoming' as TaskStatus },
    { name: 'Review pull requests', short: 'Review PRs', status: 'Upcoming' as TaskStatus },
  ],
}
