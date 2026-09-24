// Local smoke test for api/mcp.js: node scripts/test-mcp.mjs
// Calls the Vercel function's default export with real Request objects.
import assert from "node:assert/strict";
import handler from "../api/mcp.js";

const URL_ = "http://localhost/api/mcp";
const PROTOCOL = "2025-06-18";
let id = 0;
let failures = 0;

async function parseBody(res) {
  const body = await res.text();
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/event-stream")) {
    const data = body
      .split("\n")
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trim())
      .filter(Boolean);
    return JSON.parse(data.at(-1));
  }
  return JSON.parse(body);
}

async function rpc(method, params, { protocolHeader = true } = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (protocolHeader) headers["Mcp-Protocol-Version"] = PROTOCOL;
  const res = await handler.fetch(
    new Request(URL_, { method: "POST", headers, body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }) }),
  );
  return { res, json: await parseBody(res) };
}

async function check(name, fn) {
  try {
    const detail = await fn();
    console.log(`PASS  ${name}${detail ? `  (${detail})` : ""}`);
  } catch (err) {
    failures++;
    console.log(`FAIL  ${name}: ${err.message}`);
  }
}

await check("OPTIONS preflight", async () => {
  const res = await handler.fetch(new Request(URL_, { method: "OPTIONS" }));
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  assert.match(res.headers.get("access-control-expose-headers"), /Mcp-Session-Id/);
});

await check("initialize", async () => {
  const { res, json } = await rpc(
    "initialize",
    { protocolVersion: PROTOCOL, capabilities: {}, clientInfo: { name: "test-mcp", version: "0.0.0" } },
    { protocolHeader: false },
  );
  assert.equal(res.status, 200, JSON.stringify(json));
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  assert.equal(res.headers.get("set-cookie"), null);
  assert.equal(json.result.serverInfo.name, "cooperlockridge-portfolio");
  assert.ok(json.result.capabilities.tools);
  return `protocol ${json.result.protocolVersion}, session header ${res.headers.get("mcp-session-id") ?? "none"}`;
});

let tools = [];
await check("tools/list", async () => {
  const { json } = await rpc("tools/list", {});
  tools = json.result.tools;
  const names = tools.map((t) => t.name).sort();
  assert.deepEqual(names, [
    "get_availability",
    "get_contact_info",
    "get_profile_summary",
    "get_project",
    "get_resume_section",
    "list_projects",
  ]);
  for (const t of tools) {
    assert.equal(t.annotations?.readOnlyHint, true, `${t.name} readOnlyHint`);
    assert.ok(t.description.length <= 500, `${t.name} description length`);
    assert.equal(t.inputSchema?.type, "object", `${t.name} inputSchema`);
  }
  return names.join(", ");
});

async function call(name, args, validate) {
  await check(`tools/call ${name}${args && Object.keys(args).length ? " " + JSON.stringify(args) : ""}`, async () => {
    const { json } = await rpc("tools/call", { name, arguments: args ?? {} });
    assert.ok(json.result, JSON.stringify(json.error ?? json));
    assert.notEqual(json.result.isError, true, json.result.content?.[0]?.text);
    const t = json.result.content[0].text;
    assert.doesNotMatch(t, /770|355-4995|Dallas/, "no phone / home town");
    validate(JSON.parse(t));
    return `${t.length} chars`;
  });
}

await call("get_profile_summary", {}, (d) => {
  assert.equal(d.name, "Cooper Lockridge");
  assert.equal(d.location, "Atlanta area");
});
for (const section of ["basics", "work", "education", "projects", "skills"]) {
  await call("get_resume_section", { section }, (d) => assert.ok(d && (Array.isArray(d) ? d.length : d.name)));
}
await call("list_projects", {}, (d) => assert.equal(d.length, 5));
for (const pid of ["software-factory", "siege", "builder-portal", "personal-finance-dashboard", "solidworks-ai"]) {
  await call("get_project", { id: pid }, (d) => {
    assert.equal(d.id, pid);
    assert.ok(d.highlights.length > 0);
  });
}
await call("get_contact_info", {}, (d) => assert.equal(d.email, "Cooperlockridge@gmail.com"));
await call("get_availability", {}, (d) => assert.match(d.status, /2027/));

await check("invalid enum is rejected, not echoed", async () => {
  const bad = "<script>zzz-unknown</script>";
  const { json } = await rpc("tools/call", { name: "get_project", arguments: { id: bad } });
  const failed = json.error || json.result?.isError;
  assert.ok(failed, "expected an error");
  assert.ok(!JSON.stringify(json).includes("zzz-unknown"), "input must not be echoed");
  return json.error ? `JSON-RPC error ${json.error.code}` : "isError result";
});

await check("GET returns non-2xx (stateless server, no SSE stream)", async () => {
  const res = await handler.fetch(new Request(URL_, { method: "GET", headers: { Accept: "text/event-stream" } }));
  assert.ok(res.status >= 400, `status ${res.status}`);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  return `status ${res.status}`;
});

console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
