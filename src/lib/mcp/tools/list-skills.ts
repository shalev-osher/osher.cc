import { defineTool } from "@lovable.dev/mcp-js";

const skills = [
  { area: "Server Management", details: "Linux/Windows server administration, monitoring with PRTG, incident response" },
  { area: "Networking", details: "VoIP, TCP/IP, DNS, routing, troubleshooting production networks" },
  { area: "Databases", details: "SQL, query analysis, data investigation for support cases" },
  { area: "Cloud", details: "Amazon Web Services (AWS) — EC2, S3, networking, monitoring" },
  { area: "Cyber Defense", details: "Certified Cyber Defense Practitioner (Kernelios / Ministry of Economy)" },
  { area: "Technical Support", details: "Tier 2 support, VIP customers, API integrations via Kibana, QA testing" },
];

export default defineTool({
  name: "list_skills",
  title: "List skills",
  description: "List the core technical skill areas with a short description for each.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(skills) }],
  }),
});