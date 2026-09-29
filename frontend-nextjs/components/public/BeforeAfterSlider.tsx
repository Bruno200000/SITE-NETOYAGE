"use client";

import { useEffect, useRef, useState } from "react";
import { FaComment, FaPaperPlane, FaQuoteLeft, FaStar, FaUserCheck } from "react-icons/fa";
import Swal from "sweetalert2";

type BeforeAfterSliderProps = {
  title: string;
  beforeImage: string;
  afterImage: string;
  text?: string;
};

type CommentItem = {
  author: string;
  date: string;
  message: string;
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
  const [showCommentForm, setShowCommentForm] = useState(false);
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

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      author: authorName.trim() || "Visiteur",
      date: "À l'instant",
      message: commentText.trim()
    };

    setComments((prev) => [newComment, ...prev]);
    setAuthorName("");
    setCommentText("");
    setShowCommentForm(false);

    Swal.fire({
      icon: "success",
      title: "Merci pour votre commentaire !",
      text: "Votre avis a été ajouté avec succès sous cette réalisation.",
      confirmButtonColor: "#ff7a1a",
      timer: 3000
    });
  }

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

      {/* Section Commentaires sous la réalisation */}
      <div className="border-t border-slate-100 bg-slate-50/70 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FaComment className="text-brand-orange" /> Commentaires &amp; Avis ({comments.length})
          </h3>
          <button
            type="button"
            onClick={() => setShowCommentForm((prev) => !prev)}
            className="text-xs font-bold text-brand-orange hover:text-orange-700 transition"
          >
            {showCommentForm ? "Fermer" : "+ Laisser un commentaire"}
          </button>
        </div>

        {/* Comment form */}
        {showCommentForm ? (
          <form onSubmit={handleAddComment} className="mt-4 rounded-xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Votre nom ou prénom</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex. Patrick, Propriétaire"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Votre commentaire *</label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Partagez votre avis ou posez une question sur cette transformation..."
                rows={2}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-orange"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-600 transition"
            >
              <FaPaperPlane className="text-[10px]" /> Publier mon commentaire
            </button>
          </form>
        ) : null}

        {/* Comments list */}
        <div className="mt-3 space-y-2.5">
          {comments.map((c, idx) => (
            <div key={`${c.author}-${idx}`} className="rounded-xl bg-white p-3.5 border border-slate-100 text-xs shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="font-bold text-brand-navy flex items-center gap-1">
                  <FaQuoteLeft className="text-[10px] text-brand-orange/60" /> {c.author}
                </span>
                <span className="text-[10px] text-slate-400">{c.date}</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-3.5 border-l-2 border-brand-orange/40">{c.message}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
