import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  // In dev, bypass Next.js fetch cache so router.refresh() always re-fetches from Notion
  fetch: process.env.NODE_ENV === "development"
    ? (url, init) => fetch(url, { ...init, cache: "no-store" })
    : undefined,
});

export default notion;
