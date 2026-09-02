export function sampleData() {
  return {
    basic: {
      fullName: 'Alex Morgan',
      jobTitle: 'Senior Product Engineer',
      email: 'alex.morgan@example.com',
      phone: '+1 (415) 555-0134',
      location: 'San Francisco, CA',
      avatar: '',
      linkedin: 'linkedin.com/in/alexmorgan',
      portfolio: 'alexmorgan.dev',
      summary:
        'Product-minded software engineer with 8+ years building accessible, high-traffic web applications. Led cross-functional teams to ship design systems and real-time dashboards used by 2M+ monthly users. Passionate about performance budgets, clean spatial hierarchy, and mentoring early-career engineers.',
    },
    experience: [
      {
        id: 'exp1',
        role: 'Senior Frontend Engineer',
        company: 'Nebula Labs',
        location: 'San Francisco, CA (Remote)',
        startDate: '2021-03',
        endDate: '',
        current: true,
        bullets: [
          'Led a squad of 5 engineers to rebuild the analytics dashboard in React + TypeScript, cutting initial load time by 62% and lifting Lighthouse performance scores from 58 to 94.',
          'Introduced a token-based design system with Storybook that removed 1,400+ lines of duplicated CSS and reduced UI hand-off time by 40%.',
          'Partnered with product and data science to ship real-time event streams over WebSockets, driving an 18% increase in weekly active users.',
          'Mentored 4 junior engineers; 2 were promoted within 18 months and 1 now leads the onboarding curriculum.',
        ],
      },
      {
        id: 'exp2',
        role: 'Frontend Engineer',
        company: 'Brightwave',
        location: 'Portland, OR',
        startDate: '2018-06',
        endDate: '2021-02',
        current: false,
        bullets: [
          'Built customer-facing checkout flows with React, GraphQL and Stripe processing $12M+ in annualized revenue with 99.98% uptime SLA.',
          'Improved conversion funnel by 11% through A/B-tested performance and UX changes across mobile and desktop.',
          'Wrote and maintained an end-to-end test suite (Playwright + Jest) that cut production regressions by half.',
        ],
      },
      {
        id: 'exp3',
        role: 'Software Engineer Intern',
        company: 'CampusMap Co.',
        location: 'Seattle, WA',
        startDate: '2017-06',
        endDate: '2017-09',
        current: false,
        bullets: [
          'Shipped an indoor campus-navigation prototype using Leaflet + Node.js used in a 300-student pilot.',
          'Automated venue-data ingestion from PDFs into Postgres, saving staff ~6 hours of manual work weekly.',
        ],
      },
    ],
    education: [
      {
        id: 'edu1',
        degree: 'B.S. in Computer Science',
        school: 'University of Washington',
        gradYear: '2019',
        focus: 'Minor in Mathematics · Dean’s List (4 terms)',
      },
    ],
    websites: [
      { id: 'w1', label: 'Portfolio', url: 'alexmorgan.dev' },
      { id: 'w2', label: 'GitHub', url: 'github.com/alexmorgan' },
      { id: 'w3', label: 'LinkedIn', url: 'linkedin.com/in/alexmorgan' },
    ],
    skillGroups: [
      { id: 'sg1', label: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'GraphQL', 'SQL'] },
      { id: 'sg2', label: 'Frameworks & Libraries', items: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Redux', 'Framer Motion'] },
      { id: 'sg3', label: 'Tools & Platforms', items: ['AWS', 'Docker', 'Vite', 'Jest', 'Playwright', 'GitHub Actions', 'Storybook'] },
    ],
    hobbies: [
      { id: 'h1', name: 'Open-Source Maintainer' },
      { id: 'h2', name: 'Marathon Running' },
      { id: 'h3', name: 'Specialty Coffee Brewing' },
    ],
    projects: [
      {
        id: 'prj1',
        name: 'atlas-ui — open-source component library',
        link: 'github.com/alexmorgan/atlas-ui',
        description:
          'Accessible React component library (1.4k GitHub stars). Ships with full a11y coverage, dark mode tokens and a CLI scaffold generator.',
      },
      {
        id: 'prj2',
        name: 'Nomad Salary Explorer',
        link: 'nomadsalaries.dev',
        description:
          'Interactive map comparing cost-of-living and tech salaries across 60+ cities; averages 12k monthly sessions.',
      },
    ],
    certifications: [
      { id: 'cer1', name: 'AWS Certified Developer — Associate', issuer: 'Amazon Web Services', year: '2024' },
      { id: 'cer2', name: 'Meta Front-End Developer Professional Certificate', issuer: 'Meta / Coursera', year: '2022' },
    ],
    visibility: {
      experience: true,
      education: true,
      websites: true,
      skills: true,
      hobbies: true,
      projects: true,
      certifications: true,
    },
    templateId: 'ats-studio',
    formatting: {
      fontFamily: 'Poppins',
      fontWeight: '400',
      fontSize: 10.5,
      accentColor: '#244CEC',
      textColor: '#1A1A1A',
      textAlign: 'left',
      lineHeight: 140,
      letterSpacing: 0,
      canvasDimensions: 'A4',
      canvasShape: 'sharp',
      canvasShadow: 'subtle',
      canvasOutline: 'none',
    },
  }
}
