import Link from "next/link";
import type { IconType } from "react-icons";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  icon?: IconType;
  variant?: "primary" | "secondary" | "ghost" | "orange" | "dark";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({ href, children, icon: Icon, variant = "primary", type = "button", disabled = false, onClick }: ButtonProps) {
  const classes = {
    primary: "bg-brand-blue text-white hover:bg-brand-navy",
    secondary: "bg-brand-green text-white hover:bg-emerald-700",
    ghost: "bg-white text-brand-navy hover:bg-brand-sky",
    orange: "bg-brand-orange text-white shadow-glow hover:bg-orange-600",
    dark: "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
  }[variant];
  const className = `focus-ring inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-bold transition disabled:pointer-events-none disabled:opacity-60 ${classes}`;
  const content = (
    <>
      {Icon ? <Icon aria-hidden /> : null}
      {children}
    </>
  );
  if (href) return <Link className={className} href={href}>{content}</Link>;
  return (
    <button className={className} disabled={disabled} onClick={onClick} type={type}>
      {content}
    </button>
  );
}
