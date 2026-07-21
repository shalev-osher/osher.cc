import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_profile",
  title: "Get profile",
  description: "Return Shalev Osher's professional profile: name, headline, summary, location, and links.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify({
          name: "Shalev Osher",
          headline: "Technical Support & DevOps Specialist",
          summary:
            "Tier 2 Technical Support Specialist at Voicenter with hands-on experience in VoIP, AWS, networking, Linux, and cyber defense. Focused on server administration, API integrations (Kibana), and proactive incident resolution.",
          location: "Israel",
          email: "shalev@osher.cc",
          website: "https://oshercc.lovable.app",
          github: "https://github.com/Shalev-osher",
          linkedin: "https://linkedin.com/in/shalev-osher/",
        }),
      },
    ],
  }),
});