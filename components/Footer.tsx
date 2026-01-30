export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200/50 px-2 py-1 sm:px-3">
      <div className="font-editorial flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] text-zinc-500">
        <p>© {new Date().getFullYear()} Your Name</p>
        <p className="tracking-wide">Instagram · Email · Selected clients (optional)</p>
      </div>
    </footer>
  );
}
  