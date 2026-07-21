import { defineMcp } from "@lovable.dev/mcp-js";
import getProfile from "./tools/get-profile";
import listSkills from "./tools/list-skills";
import listExperience from "./tools/list-experience";
import listCertifications from "./tools/list-certifications";
import listGithubProjects from "./tools/list-github-projects";

export default defineMcp({
  name: "shalev-osher-portfolio",
  title: "Shalev Osher Portfolio",
  version: "0.1.0",
  instructions:
    "Public MCP server for Shalev Osher's portfolio. Use these tools to fetch profile info, skills, work experience, certifications, and public GitHub projects. All tools are read-only and expose only intentionally public information.",
  tools: [getProfile, listSkills, listExperience, listCertifications, listGithubProjects],
});