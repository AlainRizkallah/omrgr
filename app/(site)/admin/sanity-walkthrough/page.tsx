import { readFile } from "fs/promises";
import { join } from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const revalidate = 3600; // cache for 1 hour

export default async function SanityWalkthroughPage() {
  const path = join(process.cwd(), "docs", "SANITY-WALKTHROUGH.md");
  let content: string;
  try {
    content = await readFile(path, "utf-8");
  } catch {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-[hsl(var(--muted-foreground))]">Could not load walkthrough document.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <article className="walkthrough-doc">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
