import React from "react";
import { Stack, Card, Text } from "@sanity/ui";
import { PortableText } from "@portabletext/react";
import type { ObjectInputProps } from "sanity";

const FONT_STYLES: Record<string, string> = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "system-ui, -apple-system, sans-serif",
};

const FONT_SIZES: Record<string, string> = {
  sm: "14px",
  base: "16px",
  lg: "18px",
};

const PT_BLOCK = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => <p style={{ margin: "0 0 0.75rem" }}>{children}</p>,
    h1: ({ children }: { children?: React.ReactNode }) => <h2 style={{ margin: "1rem 0 0.5rem", fontSize: "1.5rem", fontWeight: 600 }}>{children}</h2>,
    h2: ({ children }: { children?: React.ReactNode }) => <h3 style={{ margin: "0.75rem 0 0.35rem", fontSize: "1.25rem", fontWeight: 600 }}>{children}</h3>,
    h3: ({ children }: { children?: React.ReactNode }) => <h4 style={{ margin: "0.5rem 0 0.25rem", fontSize: "1.1rem", fontWeight: 600 }}>{children}</h4>,
    h4: ({ children }: { children?: React.ReactNode }) => <h5 style={{ margin: "0.5rem 0 0.25rem", fontSize: "1rem", fontWeight: 600 }}>{children}</h5>,
    blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote style={{ margin: "0.5rem 0", paddingLeft: "1rem", borderLeft: "3px solid #ccc", fontStyle: "italic" }}>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>{children}</ul>,
    number: ({ children }: { children?: React.ReactNode }) => <ol style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
    number: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => <strong>{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => <a href={value?.href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>{children}</a>,
    code: ({ children }: { children?: React.ReactNode }) => <code style={{ fontFamily: "monospace", fontSize: "0.9em", background: "#eee", padding: "0.1em 0.3em", borderRadius: "3px" }}>{children}</code>,
  },
};

export function GalleryLayoutBlockTextInput(props: ObjectInputProps) {
  const value = props.value as { font?: string; textSize?: string; body?: unknown } | undefined;
  const font = value?.font ?? "serif";
  const textSize = value?.textSize ?? "base";
  const body = value?.body;
  const hasBody = Array.isArray(body) && body.length > 0;

  const previewStyle: React.CSSProperties = {
    fontFamily: FONT_STYLES[font] ?? FONT_STYLES.serif,
    fontSize: FONT_SIZES[textSize] ?? FONT_SIZES.base,
    lineHeight: 1.6,
  };

  return (
    <Stack space={4}>
      {props.renderDefault(props)}
      <Card padding={3} radius={2} shadow={1} tone="transparent" border>
        <Stack space={3}>
          <Text size={1} weight="semibold" muted>
            Site preview (font &amp; size)
          </Text>
          {hasBody ? (
            <div style={previewStyle}>
              <PortableText value={body as object} components={PT_BLOCK} />
            </div>
          ) : (
            <Text size={1} muted>
              Add content above to see preview.
            </Text>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
