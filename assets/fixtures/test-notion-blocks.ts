export const testNotionBlocks = [
  {
    id: "heading-test",
    type: "heading_1",
    has_children: false,
    children: [],
    heading_1: {
      rich_text: [
        {
          type: "text",
          text: { content: "Notion Code Block Syntax Highlighting & Mermaid Test" },
          plain_text: "Notion Code Block Syntax Highlighting & Mermaid Test",
          annotations: { bold: true, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
        }
      ],
      color: "default",
      is_toggleable: false
    }
  },
  {
    id: "block-mermaid",
    type: "code",
    has_children: false,
    children: [],
    code: {
      caption: [
        {
          type: "text",
          text: { content: "Figure 1: Mermaid Sequence Diagram" },
          plain_text: "Figure 1: Mermaid Sequence Diagram",
          annotations: { bold: false, italic: true, strikethrough: false, underline: false, code: false, color: "default" }
        }
      ],
      language: "mermaid",
      rich_text: [
        {
          type: "text",
          text: {
            content: `sequenceDiagram
    autonumber
    Client->>Server: HTTP GET /api/article/123
    Server->>Notion API: fetchBlocks(123)
    Notion API-->>Server: NotionBlock[]
    Server->>Server: parseBlocksToHtml()
    Server-->>Client: 200 OK (Parsed HTML)
    Client->>Mermaid.js: renderMermaid()`
          },
          plain_text: `sequenceDiagram
    autonumber
    Client->>Server: HTTP GET /api/article/123
    Server->>Notion API: fetchBlocks(123)
    Notion API-->>Server: NotionBlock[]
    Server->>Server: parseBlocksToHtml()
    Server-->>Client: 200 OK (Parsed HTML)
    Client->>Mermaid.js: renderMermaid()`,
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
        }
      ]
    }
  },
  {
    id: "block-typescript",
    type: "code",
    has_children: false,
    children: [],
    code: {
      caption: [
        {
          type: "text",
          text: { content: "TypeScript Code Example" },
          plain_text: "TypeScript Code Example",
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
        }
      ],
      language: "typescript",
      rich_text: [
        {
          type: "text",
          text: {
            content: `interface ArticleResponse<T> {
  id: string;
  title: string;
  data: T;
  createdAt: Date;
}

export async function fetchArticle<T>(id: string): Promise<ArticleResponse<T>> {
  const res = await fetch(\`/api/article/\${id}\`);
  if (!res.ok) {
    throw new Error(\`Failed to fetch article: \${res.statusText}\`);
  }
  return await res.json();
}`
          },
          plain_text: `interface ArticleResponse<T> {
  id: string;
  title: string;
  data: T;
  createdAt: Date;
}

export async function fetchArticle<T>(id: string): Promise<ArticleResponse<T>> {
  const res = await fetch(\`/api/article/\${id}\`);
  if (!res.ok) {
    throw new Error(\`Failed to fetch article: \${res.statusText}\`);
  }
  return await res.json();
}`,
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
        }
      ]
    }
  },
  {
    id: "block-markdown",
    type: "code",
    has_children: false,
    children: [],
    code: {
      caption: [
        {
          type: "text",
          text: { content: "Markdown Code Example" },
          plain_text: "Markdown Code Example",
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
        }
      ],
      language: "markdown",
      rich_text: [
        {
          type: "text",
          text: {
            content: `# Portfolio Features

Here is a list of key features:

- **Notion Integration**: Fetch and parse blocks seamlessly.
- *Mermaid Diagrams*: Dynamic client-side rendering.
- Code Highlighting: Powered by \`highlight.js\`.

> "Simplicity is prerequisite for reliability." - Edsger W. Dijkstra`
          },
          plain_text: `# Portfolio Features

Here is a list of key features:

- **Notion Integration**: Fetch and parse blocks seamlessly.
- *Mermaid Diagrams*: Dynamic client-side rendering.
- Code Highlighting: Powered by \`highlight.js\`.

> "Simplicity is prerequisite for reliability." - Edsger W. Dijkstra`,
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
        }
      ]
    }
  },
  {
    id: "block-haskell",
    type: "code",
    has_children: false,
    children: [],
    code: {
      caption: [
        {
          type: "text",
          text: { content: "Haskell Code Example" },
          plain_text: "Haskell Code Example",
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
        }
      ],
      language: "haskell",
      rich_text: [
        {
          type: "text",
          text: {
            content: `-- Fibonacci sequence in Haskell
fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

quicksort :: Ord a => [a] -> [a]
quicksort []     = []
quicksort (p:xs) = quicksort lesser ++ [p] ++ quicksort greater
  where
    lesser  = filter (<= p) xs
    greater = filter (> p) xs`
          },
          plain_text: `-- Fibonacci sequence in Haskell
fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

quicksort :: Ord a => [a] -> [a]
quicksort []     = []
quicksort (p:xs) = quicksort lesser ++ [p] ++ quicksort greater
  where
    lesser  = filter (<= p) xs
    greater = filter (> p) xs`,
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
        }
      ]
    }
  },
  {
    id: "block-python",
    type: "code",
    has_children: false,
    children: [],
    code: {
      caption: [
        {
          type: "text",
          text: { content: "Python Code Example" },
          plain_text: "Python Code Example",
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
        }
      ],
      language: "python",
      rich_text: [
        {
          type: "text",
          text: {
            content: `from dataclasses import dataclass
import asyncio

@dataclass
class Article:
    id: str
    title: str
    tags: list[str]

async def process_articles(articles: list[Article]) -> list[str]:
    # Filter and format article titles
    titles = [f"Item: {a.title.strip()}" for a in articles if "featured" in a.tags]
    await asyncio.sleep(0.1)
    return titles`
          },
          plain_text: `from dataclasses import dataclass
import asyncio

@dataclass
class Article:
    id: str
    title: str
    tags: list[str]

async def process_articles(articles: list[Article]) -> list[str]:
    # Filter and format article titles
    titles = [f"Item: {a.title.strip()}" for a in articles if "featured" in a.tags]
    await asyncio.sleep(0.1)
    return titles`,
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
        }
      ]
    }
  }
];
