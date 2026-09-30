import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function PageHero({ eyebrow, title, text, image, ctaHref, ctaLabel }: PageHeroProps) {
  return (
    <section className="relative isolate min-h-[440px] overflow-hidden bg-brand-ink text-white">
      <div className="kenburns absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/98 via-brand-ink/95 to-brand-ink/84" />
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,122,26,0.12),transparent_38%),radial-gradient(circle_at_78%_20%,rgba(22,163,74,0.12),transparent_24%)]" />
      <div className="container-page relative flex min-h-[440px] items-center justify-center py-16">
        <div className="reveal-up mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-brand-mint backdrop-blur">
            {eyebrow}
          </p>
          <h1 className="text-balance text-4xl font-black leading-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] md:text-6xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-white/90 drop-shadow-[0_3px_14px_rgba(0,0,0,0.45)]">{text}</p>
          {ctaHref && ctaLabel ? (
            <Link href={ctaHref} className="mt-8 inline-flex items-center gap-3 rounded-md bg-brand-orange px-6 py-4 text-sm font-black text-white shadow-glow transition hover:-translate-y-1 hover:bg-orange-600">
              {ctaLabel} <FaArrowRight />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
