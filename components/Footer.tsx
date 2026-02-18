export default function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 sm:px-6 font-eczar">
      <div className="text-[hsl(var(--muted-foreground))] text-xs">
        Links:{" "}
        <a
          href="https://www.instagram.com/omrgr_/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[hsl(var(--foreground))] underline underline-offset-2"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}
