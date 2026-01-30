import Link from "next/link";

/**
 * Site header: logo link to home. Kept very thin (minimal height and padding).
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-8 max-w-6xl items-center px-2 sm:px-3">
        <Link
          href="/"
          className="text-xs font-medium text-foreground hover:opacity-80 transition-opacity"
        >
          OMRGR
        </Link>
      </div>
    </header>
  );
}
