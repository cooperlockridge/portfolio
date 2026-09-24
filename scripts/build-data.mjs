// Generates resume.json (JSON Resume 1.0.0) and profile.json from one set of facts.
// Run: node scripts/build-data.mjs   (no build step on Vercel; commit the outputs)
// Facts come only from index.html and resume.pdf. Keep it that way.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://cooperlockridge.com";
const LAST_MODIFIED = "2026-09-23";

const contact = {
  email: "Cooperlockridge@gmail.com",
  website: SITE,
  github: "https://github.com/cooperlockridge",
  linkedin: "https://www.linkedin.com/in/cooperlockridge",
};

const location = "Atlanta area";

const availability = {
  status: "Open to full-time roles starting 2027",
  start: "2027",
  roleTypes: ["software", "mechanical"],
  workArrangement: "Remote or on-site",
  location,
};

const numbers = [
  { value: "467", label: "merged PRs, counted from GitHub" },
  { value: "2,925", label: "tests, from zero in six weeks" },
  { value: "46", label: "tools on an MCP server he built" },
  { value: "~3 min", label: "PR approval to production" },
];

const projects = [
  {
    id: "software-factory",
    name: "Software Factory",
    oneLine:
      "Any employee clicks Feedback; an agent reproduces the bug, fixes it, and opens a pull request. A human decides what ships.",
    stack: ["Claude agents", "Node", "GitHub"],
    status: "In production",
    details: [
      "Pipeline: feedback, reproduce, fix + test, human review, production. No reproduction means no fix.",
      "First six reports produced five merged PRs, four the same day, deploying to production in about 3 minutes.",
      "Bug reports are treated as untrusted text; the pipeline is hardened against prompt injection and fails closed.",
    ],
  },
  {
    id: "siege",
    name: "Siege",
    oneLine:
      "A Claude skill that turns code review into a multi-agent gauntlet: 41 agents, three adversarial passes, two fixers.",
    stack: ["Claude skill", "Multi-agent pipeline"],
    status: "Built",
    details: [
      "Stages: 20-agent sweep, 8 verify, fixer, 4 adversarial, 8 verify, fixer, ship.",
      "Nothing ships on one model's opinion.",
    ],
  },
  {
    id: "restaurant-time-clock-payroll",
    name: "Restaurant Time Clock & Payroll",
    oneLine:
      "Co-built and deployed a time-clock and payroll product a barbecue restaurant (real paying client) runs payroll on.",
    stack: ["Next.js", "TypeScript", "Supabase", "Vitest"],
    status: "In production for a paying client",
    details: [
      "PIN-entry employee terminal with device enrollment, multi-rate and salaried pay, overtime on combined weekly totals.",
      "Byte-deterministic Excel exports matching the payroll processor's 18-column template.",
      "226-test suite with an approve-and-lock invariant: the export file exists if and only if an approved pay period does.",
      "Commissioned adversarial AI audits that surfaced ~20 real bugs; 16 fixed.",
    ],
  },
  {
    id: "personal-finance-dashboard",
    name: "Personal Finance Dashboard",
    oneLine:
      "A weekly paycheck allocator built for one real user, splitting take-home pay into editable budget envelopes.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    status: "Built for one real user",
    details: [
      "Domain model strictly separates pre-tax and post-tax dollars, so tax math and budget math cannot contaminate each other.",
    ],
  },
  {
    id: "solidworks-ai",
    name: "SolidWorks, driven by AI",
    oneLine:
      "Extended an open-source MCP server so Claude can drive SolidWorks: modeling, drawings, batch export.",
    stack: ["Open-source MCP server", "SolidWorks", "VBA"],
    status: "In use for his own CAD work",
    details: [
      "Part and sketch modeling, drawing creation with dimensions and section views, template application, batch export.",
      "Drives SolidWorks from Claude through its VBA macro layer, generating macros for repetitive modeling and drawing work.",
    ],
  },
];

const skills = [
  {
    name: "Web",
    keywords: ["Next.js 15/16", "React 19", "TypeScript (strict)", "Tailwind CSS", "Node.js", "Bun"],
  },
  {
    name: "Platform",
    keywords: [
      "Supabase/PostgreSQL (RLS, migrations)",
      "Clerk (OAuth, multi-tenant orgs)",
      "Vercel",
      "GitHub Actions",
      "BigQuery",
      "REST/JSON:API",
    ],
  },
  {
    name: "AI tooling",
    keywords: [
      "Claude Code and agent orchestration",
      "MCP servers and clients",
      "Adversarial AI code review",
      "Prompt-injection hardening",
    ],
  },
  {
    name: "Mechanical",
    keywords: ["SolidWorks (VBA automation)", "AutoCAD", "3D printing", "Reverse engineering"],
  },
  {
    name: "Mechanical coursework",
    keywords: ["Machine dynamics", "Thermodynamics", "Heat transfer", "Strength of materials"],
  },
];

const principles = [
  { title: "Start with a premortem.", text: "Assume the plan already failed; find out why before committing." },
  {
    title: "Verify at the seam.",
    text: "Two correct components can still be wrong where they meet. Call the deployed thing on real data.",
  },
  {
    title: "A green test suite is not evidence.",
    text: "An audit once found 11 real bugs behind 2,673 passing tests. Break the code, watch the test go red, restore it.",
  },
  {
    title: "Reproduce before shipping a hypothesis.",
    text: "Four wrong diagnostic PRs taught this one. The bug-fix agent carries it as a hard gate.",
  },
  { title: "Make wrong answers loud.", text: "A system that can't be correct yet should warn, never guess." },
  { title: "Write down what cost you a day.", text: "The same day is never lost twice." },
];

const endpoints = [
  { url: `${SITE}/`, type: "text/html", description: "Portfolio page (HTML)" },
  { url: `${SITE}/index.md`, type: "text/markdown", description: "Full page as Markdown" },
  { url: `${SITE}/llms.txt`, type: "text/plain", description: "llms.txt index" },
  { url: `${SITE}/resume.json`, type: "application/json", description: "JSON Resume 1.0.0" },
  { url: `${SITE}/profile.json`, type: "application/json", description: "Compact profile summary" },
  { url: `${SITE}/resume.pdf`, type: "application/pdf", description: "Resume" },
  { url: `${SITE}/cad-portfolio.pdf`, type: "application/pdf", description: "CAD and simulation portfolio" },
  {
    url: `${SITE}/api/mcp`,
    type: "mcp/streamable-http",
    description: "Remote MCP server: read-only tools, no auth, stateless",
  },
  {
    url: `${SITE}/.well-known/mcp/server-card.json`,
    type: "application/json",
    description: "MCP server card (pre-standard)",
  },
];

const headline = "Software engineer intern and mechanical engineering student who builds software with AI agents, then verifies it.";

// ---------- resume.json (JSON Resume 1.0.0) ----------
const resume = {
  $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  basics: {
    name: "Cooper Lockridge",
    label: "Software Engineer Intern; BS Mechanical Engineering student",
    email: contact.email,
    url: SITE,
    summary:
      "Software engineer intern at a fintech company and mechanical engineering senior at Kennesaw State. Directs AI coding agents to ship production software and audits what they produce. Open to full-time roles starting 2027, software or mechanical; remote or on-site.",
    location: { city: "Atlanta area", region: "GA", countryCode: "US" },
    profiles: [
      { network: "GitHub", username: "cooperlockridge", url: contact.github },
      { network: "LinkedIn", username: "cooperlockridge", url: contact.linkedin },
    ],
  },
  work: [
    {
      name: "Northstar Mortgage Advisors",
      position: "Software Engineer Intern",
      location: "Remote/Hybrid",
      startDate: "2025-04",
      summary: "Software engineering on internal production platforms at a mortgage/fintech company.",
      highlights: [
        "Shipped 413 merged pull requests in a 12-week span across two production Next.js/TypeScript applications; the largest single contributor to the internal platform used daily by ~40 loan officers.",
        "Built a dual-engine mortgage pricing calculator and a reconciliation harness validating every payment and closing-cost line against the loan origination system; root-caused 12 systemic defects to reach 100% reconciliation across a 108-loan production corpus.",
        "Designed and launched a multi-tenant SaaS portal for external homebuilder partners: subdomain tenancy, fail-closed database-level isolation, live rate pricing, e-signature contract pipeline; grew its test suite from 0 to 2,925 in six weeks.",
        "Built a remote MCP server exposing 46 OAuth-authenticated tools with audit logging and rate limiting; refactored the auth layer across 39 routes to accept machine tokens as first-class credentials.",
        "Built the company's software factory: an AI agent pipeline that takes employee bug reports, reproduces them, writes and tests fixes, and opens pull requests for human review. First six reports produced five merged PRs, four same-day, deploying to production in ~3 minutes.",
      ],
    },
    {
      name: "Best Buy",
      position: "Product Flow Specialist",
      location: "Hiram, GA",
      startDate: "2022-10",
      endDate: "2024-12",
      highlights: [
        "Organized merchandise flow and implemented new receiving procedures that sped up intake, stocking, and order fulfillment.",
      ],
    },
  ],
  education: [
    {
      institution: "Kennesaw State University",
      area: "Mechanical Engineering",
      studyType: "Bachelor of Science",
      endDate: "2027-05",
      courses: ["Machine dynamics", "Thermodynamics", "Heat transfer", "Strength of materials"],
    },
  ],
  projects: projects.map((p) => ({
    name: p.name,
    description: p.oneLine,
    highlights: p.details,
    keywords: p.stack,
    url: `${SITE}/#work`,
  })),
  skills: skills.map((s) => ({ name: s.name, keywords: s.keywords })),
  meta: {
    canonical: `${SITE}/resume.json`,
    version: "v1.0.0",
    lastModified: LAST_MODIFIED,
  },
};

// ---------- profile.json ----------
const profile = {
  name: "Cooper Lockridge",
  headline,
  location,
  currentRole: {
    title: "Software Engineer Intern",
    organization: "Northstar Mortgage Advisors",
    since: "2025-04",
    arrangement: "Remote/Hybrid",
  },
  education: {
    degree: "BS Mechanical Engineering",
    institution: "Kennesaw State University",
    expected: "2027-05",
  },
  availability,
  contact: { email: contact.email },
  links: { website: SITE, github: contact.github, linkedin: contact.linkedin, resumePdf: `${SITE}/resume.pdf`, cadPortfolioPdf: `${SITE}/cad-portfolio.pdf` },
  keyNumbers: numbers,
  projects: projects.map(({ id, name, oneLine, stack, status }) => ({ id, name, oneLine, stack, status })),
  skills: Object.fromEntries(skills.map((s) => [s.name, s.keywords])),
  howIWork: principles.map((p) => `${p.title} ${p.text}`),
  machineEndpoints: endpoints,
  lastUpdated: LAST_MODIFIED,
  canonicalUrl: `${SITE}/profile.json`,
};

writeFileSync(join(root, "resume.json"), JSON.stringify(resume, null, 2) + "\n");
writeFileSync(join(root, "profile.json"), JSON.stringify(profile, null, 2) + "\n");
console.log("wrote resume.json and profile.json");
