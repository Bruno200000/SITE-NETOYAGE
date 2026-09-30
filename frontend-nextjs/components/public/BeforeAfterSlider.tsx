"use client";

import { useEffect, useRef, useState } from "react";
import { FaStar, FaUserCheck } from "react-icons/fa";
import Swal from "sweetalert2";

type BeforeAfterSliderProps = {
  title: string;
  beforeImage: string;
  afterImage: string;
  text?: string;
};


export function BeforeAfterSlider({ title, beforeImage, afterImage, text }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const directionRef = useRef(1);

  // Dynamic comments state
  const [comments, setComments] = useState<CommentItem[]>(() => [
    {
      author: "Client vérifié",
      date: "Récemment",
      message: "Transformation spectaculaire ! L'équipe a été très minutieuse et rapide."
    }
  ]);
  const [showCommentForm, setShowCommentForm] = useState(true);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPosition((current) => {
        if (current >= 78) directionRef.current = -1;
        if (current <= 22) directionRef.current = 1;
        return current + directionRef.current * 1.2;
      });
    }, 55);

    return () => window.clearInterval(timer);
  }, []);


  return (
    <article className="reveal-up overflow-hidden rounded-2xl bg-white shadow-premium ring-1 ring-slate-100 flex flex-col justify-between">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-ink">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${afterImage})` }} />
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${beforeImage})`, clipPath: `inset(0 ${100 - position}% 0 0)` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/40 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-md bg-brand-ink/85 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white backdrop-blur">Avant</span>
          <span className="absolute right-4 top-4 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white">Après</span>
          <div className="absolute inset-y-0 z-10 w-1 bg-white shadow-[0_0_25px_rgba(255,255,255,0.75)]" style={{ left: `${position}%` }}>
            <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white text-brand-ink shadow-premium">
              <span className="text-lg font-black">{"<>"}</span>
            </span>
          </div>
          <input
            aria-label={`Comparer avant et apres : ${title}`}
            className="before-after-range absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
            max="100"
            min="0"
            onChange={(event) => setPosition(Number(event.target.value))}
            type="range"
            value={position}
          />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-black text-brand-ink">{title}</h2>
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
          </div>

          {/* Commentaire de l'équipe / Description des travaux */}
          <div className="mt-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-xs font-black uppercase tracking-wider text-brand-orange flex items-center gap-1.5 mb-1">
              <FaUserCheck /> Commentaires de l&apos;intervention :
            </p>
            <p className="text-sm leading-6 text-slate-700">{text || "Intervention soignée et remise à neuf des surfaces selon nos standards de qualité."}</p>
          </div>
        </div>
      </div>

    </article>
  );
}
