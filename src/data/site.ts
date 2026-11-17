/**
 * Single source of truth for school-wide facts.
 * Every value here is taken from the published gulfflowerschool.com site
 * (see /research/gulf-flower-school). Items still awaiting the school's
 * confirmation are marked `// CONFIRM:` so they are easy to find.
 */

export const site = {
  name: 'Gulf Flower Schools',
  shortName: 'Gulf Flower',
  legalName: 'Gulf Flower International Schools Limited', // CONFIRM: only mention is the Head Teacher's message
  url: 'https://www.gulfflowerschool.com',
  founded: 1998,
  tagline: 'An institution with class',
  locality: 'Oworonshoki',
  lga: 'Kosofe LGA',
  region: 'Lagos State',
  country: 'Nigeria',
  description:
    'Gulf Flower Schools is a day and boarding school in Oworonshoki, Lagos, teaching children from pre-school and nursery through primary to senior secondary since 1998.',
  vision: 'To produce the totally upright children in the society.',
  mission: 'To instill moral values through academic pursuit in the society.',
  email: 'gulfflowersignatures@gmail.com',
  // Admission status as published on the current site (no session or date given). CONFIRM before each session.
  admissionNotice: 'Admission is open for registration',
};

/** Phone numbers exactly as published. The site does not say which office each number serves. */
export const phones = [
  '08122998550',
  '08090529833',
  '08127261707', // CONFIRM: the legacy thank-you page shows 08127261207
  '08170394794',
  '08032339175',
];

export const formatPhone = (n: string) => n.replace(/^(\d{4})(\d{3})(\d{4})$/, '$1 $2 $3');
export const telHref = (n: string) => `tel:+234${n.replace(/^0/, '')}`;

export const campuses = [
  {
    id: 'one',
    name: 'Gulf Flower One',
    school: 'Nursery & Primary School',
    street: '6 Atanda Alonge Street',
    area: 'by Miyaki Junction, Oworonshoki, Lagos',
    mapQuery: 'Gulf Flower nursery and primary school, Oworonshoki, Lagos',
    href: '/schools/nursery-primary/',
  },
  {
    id: 'two',
    name: 'Gulf Flower Two',
    school: 'High School (GFHS)',
    street: '1 Gulf Flower Close',
    area: 'by Miyaki Junction, Oworonshoki, Lagos',
    mapQuery: 'Gulf Flower International School, Oworonshoki, Lagos',
    href: '/schools/high-school/',
  },
] as const;

export const mapsLink = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/** Google Maps embed used on the current site (place: "Gulf Flower International School"). */
export const mapEmbed =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.8359020629196!2d3.4037081147708315!3d6.542395895267973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d392204c4b1%3A0x35bf05585a35760d!2sGulf%20Flower%20International%20School!5e0!3m2!1sen!2sng!4v1682206617415!5m2!1sen!2sng';

/**
 * Social handles are published as plain text (@gulfflowerschool). The account URLs
 * have not been confirmed as the school's, so `url` stays null and the handle is shown
 * as text. Add the verified URL to turn each one into a link.
 */
export const social = [
  { name: 'Facebook', handle: '@gulfflowerschool', url: null as string | null },
  { name: 'Instagram', handle: '@gulfflowerschool', url: null as string | null },
  { name: 'X (Twitter)', handle: '@gulfflowerschool', url: null as string | null },
];

/** No WhatsApp number is published. Set e.g. '2348122998550' to enable the WhatsApp button. */
export const whatsapp: string | null = null;

/** Portals linked from the current site's navigation. */
export const portals = [
  {
    name: 'High School Portal',
    provider: 'Abacus Bells',
    url: 'https://gulfflowercollege.abacusbells.com/',
    for: 'Gulf Flower High School (secondary) school portal.',
  },
  {
    name: 'Primary School Portal',
    provider: 'Abacus Bells',
    url: 'https://gulfflowerprimary.abacusbells.com/',
    for: 'Gulf Flower nursery and primary school portal.',
  },
  {
    name: 'DatPortal',
    provider: 'Datreport',
    url: 'https://datreport.vercel.app/',
    for: 'Secondary exam and results portal, organised by class (JSS1–SS3).',
  },
];

/**
 * Form delivery. The current site already relays its contact form through
 * formsubmit.co to the school's Gmail address, so the new forms use the same
 * relay (AJAX endpoint). The first submission triggers a one-time activation
 * email that the school must confirm before messages are delivered.
 */
export const forms = {
  endpoint: `https://formsubmit.co/ajax/${site.email}`,
};

export type NavItem = { label: string; href: string; children?: { label: string; href: string; note: string }[] };

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about/',
    children: [
      { label: 'Our story', href: '/about/', note: 'Since 1998 in Oworonshoki' },
      { label: 'Leadership', href: '/leadership/', note: 'Messages from the team' },
    ],
  },
  {
    label: 'Our Schools',
    href: '/schools/',
    children: [
      { label: 'Nursery & Primary', href: '/schools/nursery-primary/', note: 'Pre-age to Basic 6 · Gulf Flower One' },
      { label: 'High School', href: '/schools/high-school/', note: 'JSS1 to SS3 · Gulf Flower Two' },
    ],
  },
  { label: 'Campus Life', href: '/campus-life/' },
  { label: 'Admissions', href: '/admissions/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Contact', href: '/contact/' },
];
