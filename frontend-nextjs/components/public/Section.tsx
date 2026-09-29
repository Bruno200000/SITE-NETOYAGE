export function Section({ id, eyebrow, title, children, tint = false }: { id?: string; eyebrow?: string; title: string; children: React.ReactNode; tint?: boolean }) {
  return (
    <section id={id} className={tint ? "section-band bg-white py-20" : "section-band py-20"}>
      <div className="container-page">
        <div className="reveal-up mx-auto mb-12 max-w-3xl text-center">
          {eyebrow ? <p className="mb-3 text-sm font-black uppercase tracking-widest text-brand-green">{eyebrow}</p> : null}
          <h2 className="text-balance text-3xl font-black text-brand-ink md:text-5xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}
