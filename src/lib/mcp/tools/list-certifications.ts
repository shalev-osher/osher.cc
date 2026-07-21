import { defineTool } from "@lovable.dev/mcp-js";

const certifications = [
  { name: "Certified Hands-On Cyber Security Specialist", issuer: "Kernelios", code: "CHCSS 310", year: "April 2022" },
  { name: "Cyber Defense Practitioner - Diploma", issuer: "Israel Ministry of Economy and Industry", code: "Certificate #1442431", year: "April 2022" },
  { name: "Cyber Defense Practitioner - Grades", issuer: "Israel Ministry of Economy and Industry", code: "Kernelios Ltd.", year: "June 2022" },
  { name: "MCSA: Windows Server 2016", issuer: "Microsoft", code: "Cert #1F7071-E04B87", year: "November 2020", verifyUrl: "https://learn.microsoft.com/he-il/users/shalevosher-6659/transcript/714gcwjmylnq9k7" },
  { name: "Linux Essentials", issuer: "Linux Professional Institute (LPI)", code: "LPI000494064", year: "July 2021", verifyUrl: "https://cs.lpi.org/caf/Xamman/certification/verify/LPI000494064/rafgerhedt" },
];

export default defineTool({
  name: "list_certifications",
  title: "List certifications",
  description: "List professional certifications with issuer, credential code, year, and verification URL when available.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(certifications) }],
  }),
});