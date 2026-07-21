import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_github_projects",
  title: "List GitHub projects",
  description: "Fetch Shalev Osher's public GitHub repositories, sorted by most recently updated.",
  inputSchema: {
    limit: z.number().int().min(1).max(30).optional().describe("Maximum number of repos to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ limit }) => {
    const n = limit ?? 10;
    const res = await fetch(
      `https://api.github.com/users/Shalev-osher/repos?sort=updated&per_page=${n}`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) {
      return { content: [{ type: "text", text: `GitHub API error: ${res.status}` }], isError: true };
    }
    const repos = (await res.json()) as Array<Record<string, unknown>>;
    const compact = repos.map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updated_at: r.updated_at,
      topics: r.topics,
    }));
    return { content: [{ type: "text", text: JSON.stringify(compact) }] };
  },
});