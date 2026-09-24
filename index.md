---
title: "Cooper Lockridge: I build software with AI agents, then prove it right"
canonical_url: https://cooperlockridge.com/
last_updated: 2026-09-23
---

# Cooper Lockridge

**I build software with AI agents, then prove it right.**

Software engineer intern at a fintech company; mechanical engineering senior at Kennesaw State. I direct AI coding agents to ship production software and audit everything they produce. Atlanta area; happy remote or on-site.

- Email: [Cooperlockridge@gmail.com](mailto:Cooperlockridge@gmail.com)
- Resume: [resume.pdf](https://cooperlockridge.com/resume.pdf)
- LinkedIn: [linkedin.com/in/cooperlockridge](https://www.linkedin.com/in/cooperlockridge)
- GitHub: [github.com/cooperlockridge](https://github.com/cooperlockridge)

## Numbers

Numbers I can prove, from production systems:

| Number | What it counts |
| --- | --- |
| 467 | merged PRs, counted live from GitHub |
| 12,040 | tests behind a monotonic CI floor |
| 46 | tools on an MCP server I built |
| ~3 min | PR approval to production |

## Work

### Software Factory

*In production. Claude agents, Node, GitHub*

Any employee clicks Feedback; an agent reproduces the bug, fixes it, and opens a pull request. A human decides what ships. First six reports: five merged PRs, four the same day.

Pipeline: feedback → reproduce → fix + test → human review → production. No reproduction, no fix.

Bug reports are untrusted text, so the pipeline is hardened against prompt injection and fails closed.

### Siege

*Claude skill, multi-agent pipeline*

A skill that turns review into a gauntlet: 41 agents, three adversarial passes, two fixers. Nothing ships on one model's opinion.

Stages: 20 sweep → 8 verify → fixer → 4 adversarial → 8 verify → fixer → ship.

### Builder Partner Portal

*In production. Next.js 16, TypeScript, Supabase, Clerk, Bun*

Multi-tenant B2B platform for a lender's home-builder partners: forward-commitment pricing, e-signed term sheets, and payment flyers. Realtors, builder staff and internal staff share one identity layer. Largest contributor: 251 of 282 merged PRs.

Tenancy is resolved per request from the route, bound to an auth org, and membership-checked before any data is read. Anything unproven gets a 403. Unknown and real tenants return identical responses, so the tenant list can't be enumerated. Signing runs as an event pipeline: embedded invites, a completion webhook, and a reconciler cron that heals missed callbacks. CI enforces a monotonic test floor, so the build fails if the pass count or file count ever drops. 12,040 tests, and the number only goes up.

### Personal Finance Dashboard

*React, TypeScript, Vite*

A weekly paycheck allocator built for one real user. The domain model strictly separates pre-tax and post-tax dollars, so tax math and budget math can never contaminate each other.

### SolidWorks, driven by AI

*Open source, MCP, VBA*

Extended an open-source MCP server so Claude can drive my CAD: modeling, drawings, batch export. I'm an ME student; my homework tooling writes VBA macros for me.

## Mechanical

I'm a mechanical engineer by training: SolidWorks and AutoCAD, 3D printing, reverse engineering, and coursework through machine dynamics, thermodynamics, heat transfer, and strength of materials. That training shows up in my software.

- **The habits transfer.** Unit checks, tolerance thinking, documented assumptions. A free-body diagram and a reconciliation harness are the same instinct: don't trust a result you haven't checked against the physics.
- **I've been your user.** For teams building software that touches the physical world (robotics, manufacturing, CAD and simulation tooling), I'm the engineer on the other side of your product, and I can translate.
- **The proof is above.** The SolidWorks project in my work list is the two sides meeting: AI agents driving real CAD through an MCP server I extended, generating VBA a machinist could read.
- **Requirements are a spec.** Engineering taught me to turn a vague ask into testable design inputs before building. That's the same job as writing a good ticket.

See the work: [CAD & simulation portfolio (PDF)](https://cooperlockridge.com/cad-portfolio.pdf), my CAE final project and flow studies.

## About

| | |
| --- | --- |
| Role | Software Engineer Intern, fintech (Northstar Mortgage Advisors, since April 2025) |
| Education | BS Mechanical Engineering, Kennesaw State, May 2027 |
| Location | Atlanta area; remote or on-site |
| Status | Open to full-time, 2027; software or mechanical |
| Software | TypeScript, Next.js, Supabase, Claude agents |
| Mechanical | SolidWorks (VBA automation), AutoCAD, 3D printing |

## How I work

- **Start with a premortem.** Assume the plan already failed; find out why before committing.
- **Verify at the seam.** Two correct components can still be wrong where they meet. Call the deployed thing on real data.
- **A green test suite is not evidence.** An audit once found 11 real bugs behind 2,673 passing tests. Break the code, watch the test go red, restore it.
- **Reproduce before shipping a hypothesis.** Four wrong diagnostic PRs taught me this one. My bug-fix agent carries it as a hard gate.
- **Make wrong answers loud.** A system that can't be correct yet should warn, never guess.
- **Write down what cost you a day.** The same day is never lost twice.

## Contact

Tell me what you're building. Email is the fastest path. Say what "done" looks like and I'll respond with something useful.

- Email: [Cooperlockridge@gmail.com](mailto:Cooperlockridge@gmail.com)
- LinkedIn: <https://www.linkedin.com/in/cooperlockridge>
- GitHub: <https://github.com/cooperlockridge>
- Resume: <https://cooperlockridge.com/resume.pdf>

## Machine-readable endpoints

- [/index.md](https://cooperlockridge.com/index.md): this page as Markdown
- [/llms.txt](https://cooperlockridge.com/llms.txt): llms.txt index
- [/resume.json](https://cooperlockridge.com/resume.json): JSON Resume 1.0.0
- [/profile.json](https://cooperlockridge.com/profile.json): compact profile summary
- [/resume.pdf](https://cooperlockridge.com/resume.pdf): resume
- [/cad-portfolio.pdf](https://cooperlockridge.com/cad-portfolio.pdf): CAD and simulation portfolio
- `https://cooperlockridge.com/api/mcp`: remote MCP server (Streamable HTTP, read-only tools, no auth)
- [/.well-known/mcp/server-card.json](https://cooperlockridge.com/.well-known/mcp/server-card.json): MCP server card (pre-standard)
