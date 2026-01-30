export default function ContactPage() {
    return (
      <section className="mx-auto w-full max-w-[1000px] px-3 pb-8 pt-4 sm:px-4 sm:pb-10 sm:pt-6 lg:px-8">
        <h1 className="font-editorial text-[13px] uppercase tracking-[0.16em] text-zinc-900">
          Contact
        </h1>
  
        <div className="mt-4 space-y-3 text-sm text-zinc-700">
          <p className="max-w-[70ch]">
            For inquiries, exhibitions, commissions, or representation.
          </p>
  
          <div className="space-y-3">
            <a className="block min-h-[44px] py-2 text-zinc-900 hover:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400" href="mailto:you@example.com">
              you@example.com
            </a>
            <a className="block min-h-[44px] py-2 text-zinc-900 hover:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400" href="https://instagram.com/" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </section>
    );
  }
  