// Remote MCP server for cooperlockridge.com: POST /api/mcp (Streamable HTTP).
// Read-only, stateless, no auth, no cookies. Data comes from resume.json and profile.json.
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import resume from "../resume.json" with { type: "json" };
import profile from "../profile.json" with { type: "json" };

const SECTIONS = ["basics", "work", "education", "projects", "skills"];
const PROJECT_IDS = profile.projects.map((p) => p.id);

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

const text = (value) => ({
  content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
});

function projectDetail(id) {
  const summary = profile.projects.find((p) => p.id === id);
  const full = resume.projects.find((p) => p.name === summary.name);
  return { ...summary, highlights: full?.highlights ?? [] };
}

const mcpHandler = createMcpHandler(
  (server) => {
    server.registerTool(
      "get_profile_summary",
      {
        title: "Profile summary",
        description:
          "Returns Cooper Lockridge's profile summary: headline, current role, education, location, availability, key numbers, and links.",
        annotations: READ_ONLY,
      },
      async () =>
        text({
          name: profile.name,
          headline: profile.headline,
          currentRole: profile.currentRole,
          education: profile.education,
          location: profile.location,
          availability: profile.availability,
          keyNumbers: profile.keyNumbers,
          links: profile.links,
          lastUpdated: profile.lastUpdated,
        }),
    );

    server.registerTool(
      "get_resume_section",
      {
        title: "Resume section",
        description: `Returns one section of Cooper Lockridge's resume in JSON Resume 1.0.0 format. Sections: ${SECTIONS.join(", ")}.`,
        inputSchema: z.object({ section: z.enum(SECTIONS).describe("Resume section to return") }),
        annotations: READ_ONLY,
      },
      async ({ section }) => text(resume[section]),
    );

    server.registerTool(
      "list_projects",
      {
        title: "List projects",
        description: "Lists Cooper Lockridge's portfolio projects with id, name, one-line description, stack, and status.",
        annotations: READ_ONLY,
      },
      async () => text(profile.projects),
    );

    server.registerTool(
      "get_project",
      {
        title: "Project details",
        description: `Returns details for one portfolio project by id. Ids: ${PROJECT_IDS.join(", ")}.`,
        inputSchema: z.object({ id: z.enum(PROJECT_IDS).describe("Project id from list_projects") }),
        annotations: READ_ONLY,
      },
      async ({ id }) => text(projectDetail(id)),
    );

    server.registerTool(
      "get_contact_info",
      {
        title: "Contact info",
        description: "Returns Cooper Lockridge's public contact details: email, website, GitHub, and LinkedIn.",
        annotations: READ_ONLY,
      },
      async () =>
        text({
          email: profile.contact.email,
          website: profile.links.website,
          github: profile.links.github,
          linkedin: profile.links.linkedin,
          resumePdf: profile.links.resumePdf,
        }),
    );

    server.registerTool(
      "get_availability",
      {
        title: "Availability",
        description: "Returns Cooper Lockridge's job-search status: start timing, role types, work arrangement, and location.",
        annotations: READ_ONLY,
      },
      async () => text(profile.availability),
    );
  },
  { serverInfo: { name: "cooperlockridge-portfolio", version: "1.0.0" } },
);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Max-Age": "86400",
};

async function handle(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  let res;
  try {
    res = await mcpHandler(request);
  } catch {
    res = Response.json(
      { jsonrpc: "2.0", id: null, error: { code: -32603, message: "Internal error" } },
      { status: 500 },
    );
  }
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  headers.delete("Set-Cookie");
  headers.set("Cache-Control", "no-store");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export default { fetch: handle };
