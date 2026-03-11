export const siteConfig = {
  name: 'Mahdi Khan',
  shortName: 'Mahdi',
  siteUrl: 'https://mahdikhan.com',
  email: 'mahdi20312.khan@gmail.com',
  profiles: {
    linkedin: 'https://www.linkedin.com/in/mahdi-khaannn/',
    github: 'https://github.com/mahdi-khaannn',
    medium: 'https://medium.com/@mahdi-khaannn',
  },
  content: {
    newsletterTitle: 'The Weekly Synthesis',
    newsletterCadence: 'every Monday',
    rssTitle: 'Mahdi Khan | AI Agents, Orchestration, and Delivery Systems',
    rssDescription:
      'Practitioner-grade essays, breakdowns, and weekly synthesis notes on AI agents, orchestration, evaluation, and public sector delivery.',
  },
  routes: {
    newsletter: '/newsletter',
    blog: '/blog',
    tutorials: '/tags/tutorial',
    about: '/about',
    rss: '/rss.xml',
    sitemap: '/sitemap-index.xml',
  },
} as const;

export const emailHref = `mailto:${siteConfig.email}`;
export const bookingEmailHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent('Booking inquiry')}`;

export const profileLinks = [
  { label: 'LinkedIn', href: siteConfig.profiles.linkedin, external: true },
  { label: 'GitHub', href: siteConfig.profiles.github, external: true },
  { label: 'Medium', href: siteConfig.profiles.medium, external: true },
  { label: 'Email', href: emailHref, external: false },
] as const;

export const footerMetaLinks = [
  { label: 'About', href: siteConfig.routes.about, external: false },
  { label: 'RSS Feed', href: siteConfig.routes.rss, external: false },
  { label: 'Sitemap', href: siteConfig.routes.sitemap, external: false },
  { label: 'Email', href: emailHref, external: false },
] as const;
