export default function AboutPage() {
    return (
      <section className="mx-auto w-full max-w-[1000px] px-3 pb-8 pt-4 sm:px-4 sm:pb-10 sm:pt-6 lg:px-8">
        <h1 className="font-editorial text-[13px] uppercase tracking-[0.16em] text-zinc-900">
          Info
        </h1>
  
        <div className="mt-4 max-w-[70ch] space-y-4 text-sm leading-relaxed text-zinc-700">
          <p>
            Short statement. Keep it sparse. Let the work do the talking.
          </p>
          <p>
            Based in ____. Available for commissions / exhibitions / collaborations (optional).
          </p>
  
          <div className="pt-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
            Instagram · Email · PDF (optional)
          </div>
        </div>
      </section>
    );
  }
  