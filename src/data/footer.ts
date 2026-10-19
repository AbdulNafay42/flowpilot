// Footer content, from Figma: logo, copyright and three legal links (Privacy,
// Terms, Security). The brief also lists a short description and social links;
// Figma has neither, so the description was removed on request and social
// links stay empty until icons/URLs are supplied (TODO(figma)). Link targets
// are not in the design, so they go to the top.
export const footerContent = {
  linkGroups: [
    {
      label: 'Legal',
      links: [
        { label: 'Privacy', href: '#top' },
        { label: 'Terms', href: '#top' },
        { label: 'Security', href: '#top' },
      ],
    },
  ],
  socialLinks: [] as { label: string; href: string }[],
}
