export default function Footer() {
  return (
    <footer className="bg-[hsl(var(--background))] px-4 py-6 sm:px-6 font-eczar">
      <div className="flex flex-wrap items-center justify-between gap-6 text-[hsl(var(--muted-foreground))]">
        {/* Left: brand + address */}
        <div className="flex flex-col gap-1">
          <span className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))]">
            OMRGR
          </span>
          <span className="text-xs font-normal">
            TENTH FLOOR . OSCAR BUILDING
            <br />
            JAL EL DIB (METN)
          </span>
        </div>

        {/* Center: Instagram */}
        <div className="order-last sm:order-none w-full sm:w-auto flex justify-center">
          <a
            href="https://www.instagram.com/omrgr_/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[hsl(var(--foreground))] underline underline-offset-2 text-sm"
          >
            Instagram
          </a>
        </div>

        {/* Right: copyright */}
        <div className="flex items-center gap-1.5 text-xs font-normal">
          <span className="text-base leading-none" aria-hidden>©</span>
          <span>OMRGR 2026</span>
        </div>
      </div>
    </footer>
  );
}
