import { defineTool } from "@lovable.dev/mcp-js";

const experience = [
  {
    company: "Voicenter",
    role: "Technical Support Specialist Tier 2",
    period: "2023 - Present",
    highlights: [
      "Collaborates with Development and DevOps teams via Jira",
      "Supports VIP and standard clients across product suite",
      "Works with API integrations (Kibana), networking, and AWS",
      "Conducts QA on features and servers",
      "Co-developed a troubleshooting tool with Development",
      "Diagnoses live issues across many servers using PRTG",
    ],
  },
  {
    company: "Voicenter",
    role: "Technical Support Specialist - Strategic Customers",
    period: "2021 - 2023",
    highlights: [
      "Supported cloud telephony systems",
      "Wrote guides and presentations, ran apprenticeships",
      "Managed accounts of the largest on-site clients",
      "Worked with ASTERISK and SQL alongside IT/eng/dev",
    ],
  },
  {
    company: "Voicenter",
    role: "Technical Support Engineer Tier 1",
    period: "2021",
    highlights: [
      "Analyzed VoIP networks and computer systems",
      "Resolved VoIP issues via troubleshooting",
      "Improved network security measures and protocols",
      "Provided first-line support via calls, emails, tickets",
    ],
  },
  {
    company: "ILDC",
    role: "Quality Assurance Tester",
    period: "2018 - 2021",
    highlights: [
      "QA in Sagemcom lab for Altice (HOT) products",
      "Daily set-top box quality assurance testing",
    ],
  },
  {
    company: "IDF",
    role: "Military Service",
    period: "2015 - 2018",
    highlights: [
      "Vehicle treatments and test equipment operation",
      "Removed and installed vehicle assemblies per procedure",
    ],
  },
];

export default defineTool({
  name: "list_experience",
  title: "List work experience",
  description: "List Shalev Osher's work history with role, company, period, and key highlights.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(experience) }],
  }),
});