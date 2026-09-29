"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaCheckCircle, FaShieldAlt, FaPhoneAlt, FaClock } from "react-icons/fa";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export interface CanadaProvince {
  code: string;
  name: string;
  shortName: string;
  pin?: { x: number; y: number };
  path: string;
  labelPos: { x: number; y: number };
}

// Precise stylized vector paths of Canadian Provinces & Territories
// Designed on a 1000 x 650 coordinate grid
export const CANADA_PROVINCES: CanadaProvince[] = [
  {
    code: "YT",
    name: "Yukon",
    shortName: "Yukon",
    pin: { x: 175, y: 190 },
    labelPos: { x: 175, y: 200 },
    path: "M 130 115 L 210 135 L 230 240 L 195 295 L 140 270 L 120 220 Z"
  },
  {
    code: "NT",
    name: "Territoires du Nord-Ouest",
    shortName: "T.N.-O.",
    pin: { x: 290, y: 190 },
    labelPos: { x: 290, y: 210 },
    path: "M 215 136 L 330 110 L 400 150 L 390 270 L 330 295 L 230 240 Z"
  },
  {
    code: "NU",
    name: "Nunavut",
    shortName: "Nunavut",
    pin: { x: 510, y: 180 },
    labelPos: { x: 510, y: 195 },
    path: "M 340 100 L 440 60 L 530 50 L 610 85 L 680 160 L 600 230 L 570 310 L 460 300 L 400 250 L 410 150 Z"
  },
  {
    code: "BC",
    name: "Colombie-Britannique",
    shortName: "C.-B.",
    pin: { x: 170, y: 390 },
    labelPos: { x: 170, y: 400 },
    path: "M 140 275 L 195 295 L 230 330 L 250 440 L 210 490 L 130 460 L 110 370 Z"
  },
  {
    code: "AB",
    name: "Alberta",
    shortName: "Alberta",
    pin: { x: 275, y: 400 },
    labelPos: { x: 275, y: 410 },
    path: "M 235 330 L 325 330 L 315 485 L 250 480 L 235 330 Z"
  },
  {
    code: "SK",
    name: "Saskatchewan",
    shortName: "Saskatchewan",
    pin: { x: 370, y: 415 },
    labelPos: { x: 370, y: 425 },
    path: "M 328 330 L 418 335 L 410 488 L 320 486 Z"
  },
  {
    code: "MB",
    name: "Manitoba",
    shortName: "Manitoba",
    pin: { x: 470, y: 420 },
    labelPos: { x: 470, y: 430 },
    path: "M 422 338 L 515 342 L 530 405 L 515 490 L 414 489 Z"
  },
  {
    code: "ON",
    name: "Ontario",
    shortName: "Ontario",
    pin: { x: 620, y: 480 },
    labelPos: { x: 620, y: 490 },
    path: "M 520 345 L 610 350 L 685 410 L 700 480 L 665 560 L 590 535 L 525 480 Z"
  },
  {
    code: "QC",
    name: "Québec",
    shortName: "Québec",
    pin: { x: 740, y: 410 },
    labelPos: { x: 740, y: 420 },
    path: "M 620 345 L 755 280 L 830 330 L 840 425 L 810 485 L 755 530 L 690 440 Z"
  },
  {
    code: "NL",
    name: "Terre-Neuve-et-Labrador",
    shortName: "T.-N.-L.",
    pin: { x: 865, y: 350 },
    labelPos: { x: 865, y: 360 },
    path: "M 825 330 L 870 320 L 920 380 L 880 435 L 845 420 Z"
  },
  {
    code: "NB",
    name: "Nouveau-Brunswick",
    shortName: "N.-B.",
    pin: { x: 840, y: 495 },
    labelPos: { x: 840, y: 505 },
    path: "M 815 480 L 855 470 L 865 510 L 825 520 Z"
  },
  {
    code: "PE",
    name: "Île-du-Prince-Édouard",
    shortName: "Î.-P.-É.",
    pin: { x: 885, y: 485 },
    labelPos: { x: 885, y: 480 },
    path: "M 872 478 L 898 478 L 895 492 L 875 490 Z"
  },
  {
    code: "NS",
    name: "Nouvelle-Écosse",
    shortName: "N.-É.",
    pin: { x: 890, y: 525 },
    labelPos: { x: 890, y: 535 },
    path: "M 865 510 L 905 495 L 925 535 L 880 545 Z"
  }
];

interface CanadaInteractiveMapProps {
  overrideTitle?: string;
  overrideSubtitle?: string;
  overrideProvinces?: string;
  overrideMainPin?: string;
  overrideBadge?: string;
  overrideNote?: string;
  overrideColor?: string;
  showDetails?: boolean;
}

export function CanadaInteractiveMap({
  overrideTitle,
  overrideSubtitle,
  overrideProvinces,
  overrideMainPin,
  overrideBadge,
  overrideNote,
  overrideColor,
  showDetails = true
}: CanadaInteractiveMapProps) {
  const siteSettings = useSiteSettings();
  const [hoveredProvince, setHoveredProvince] = useState<CanadaProvince | null>(null);

  const title = overrideTitle || siteSettings.canada_map_title;
  const subtitle = overrideSubtitle || siteSettings.canada_map_subtitle;
  const rawProvinces = overrideProvinces || siteSettings.canada_map_provinces;
  const mainRegion = overrideMainPin || siteSettings.canada_map_main_region;
  const badge = overrideBadge || siteSettings.canada_map_badge;
  const note = overrideNote || siteSettings.canada_map_note;
  const accentColor = overrideColor || siteSettings.canada_map_color;

  const activeCodes = (rawProvinces || "NB,QC,ON,NS,PE")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);

  const isProvinceActive = (code: string) => activeCodes.includes(code.toUpperCase());

  // Count active provinces
  const activeCount = CANADA_PROVINCES.filter((p) => isProvinceActive(p.code)).length;

  return (
    <div className="flex flex-col w-full rounded-xl bg-[#09152b] border border-blue-800/40 p-3.5 sm:p-4 text-white shadow-xl relative overflow-hidden">
      {/* Subtle glowing ambient gradient */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-blue-600/15 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl" />

      {/* Compact Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              <FaShieldAlt className="text-[9px]" /> {badge}
            </span>
            <span className="text-[11px] font-bold text-blue-200/70">
              {activeCount} province{activeCount > 1 ? "s" : ""} active{activeCount > 1 ? "s" : ""}
            </span>
          </div>
          <h3 className="mt-1 text-base sm:text-lg font-black text-white">{title}</h3>
          <p className="text-[11px] text-blue-100/75 line-clamp-1">{subtitle}</p>
        </div>

        {/* Main Base Pin Tag */}
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/15 px-2.5 py-1 text-xs font-bold text-white">
          <FaMapMarkerAlt className="text-brand-orange text-xs animate-bounce" />
          <div>
            <span className="block text-[9px] text-blue-200/70 uppercase">Base principale</span>
            <span className="font-black text-white text-[11px]">{mainRegion}</span>
          </div>
        </div>
      </div>

      {/* Compact Interactive Map Area */}
      <div className="relative my-2 w-full max-w-[420px] mx-auto h-[170px] sm:h-[185px] select-none flex items-center justify-center">
        <svg
          viewBox="100 40 840 530"
          className="w-full h-full filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]"
        >
          {/* Map definitions for glowing active strokes */}
          <defs>
            <filter id="canada-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={accentColor} floodOpacity="0.4" />
            </filter>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0e4b9e" />
              <stop offset="100%" stopColor="#0b2e66" />
            </linearGradient>
            <linearGradient id="mainPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff7a1a" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          {/* Provinces paths */}
          {CANADA_PROVINCES.map((prov) => {
            const active = isProvinceActive(prov.code);
            const isHovered = hoveredProvince?.code === prov.code;

            return (
              <g
                key={prov.code}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredProvince(prov)}
                onMouseLeave={() => setHoveredProvince(null)}
              >
                <path
                  d={prov.path}
                  fill={active ? (isHovered ? "#1763c7" : "url(#activeGrad)") : (isHovered ? "#162847" : "#0d1a33")}
                  stroke={active ? (isHovered ? "#ffffff" : accentColor) : "#1e3357"}
                  strokeWidth={active ? (isHovered ? 2.5 : 1.7) : 1}
                  strokeLinejoin="round"
                  className="transition-all duration-200"
                />
                {/* Short Name Label */}
                <text
                  x={prov.labelPos.x}
                  y={prov.labelPos.y}
                  textAnchor="middle"
                  className={`text-[10px] md:text-[11px] font-black pointer-events-none transition-all ${
                    active ? (isHovered ? "fill-white" : "fill-blue-100") : "fill-slate-500"
                  }`}
                >
                  {prov.shortName}
                </text>
              </g>
            );
          })}

          {/* Pulsing Pin on New Brunswick (Headquarters) */}
          <g transform="translate(842, 495)" className="pointer-events-none">
            {/* Animated radar rings */}
            <circle r="12" fill={accentColor} opacity="0.25" className="animate-ping" />
            <circle r="7" fill={accentColor} opacity="0.45" />
            <circle r="4" fill="#ffffff" stroke={accentColor} strokeWidth="1.5" />
          </g>

          {/* Secondary Pins on other active provinces if Quebec or Ontario are active */}
          {isProvinceActive("QC") && (
            <g transform="translate(745, 410)" className="pointer-events-none">
              <circle r="3.5" fill="#38bdf8" opacity="0.8" />
              <circle r="1.8" fill="#ffffff" />
            </g>
          )}
          {isProvinceActive("ON") && (
            <g transform="translate(620, 480)" className="pointer-events-none">
              <circle r="3.5" fill="#38bdf8" opacity="0.8" />
              <circle r="1.8" fill="#ffffff" />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredProvince && (
          <div
            className="absolute bottom-1 left-1 right-1 sm:right-auto z-30 rounded-lg bg-slate-900/95 p-2 text-xs shadow-xl backdrop-blur-md border border-white/20 sm:min-w-[210px]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-black text-white text-xs">{hoveredProvince.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[9px] font-black uppercase ${
                  isProvinceActive(hoveredProvince.code)
                    ? "bg-green-500/20 text-green-300 border border-green-500/40"
                    : "bg-slate-700/60 text-slate-300"
                }`}
              >
                {isProvinceActive(hoveredProvince.code) ? "Couverte" : "Sur demande"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Active provinces pill list & Note */}
      {showDetails && (
        <div className="relative z-10 border-t border-white/10 pt-2.5 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-bold text-blue-200/70 mr-1">Zones :</span>
            {CANADA_PROVINCES.map((prov) => {
              const active = isProvinceActive(prov.code);
              return (
                <span
                  key={prov.code}
                  className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold transition-all ${
                    active
                      ? "bg-blue-600/30 text-white border border-blue-400/40 shadow-sm"
                      : "bg-white/5 text-slate-500 border border-transparent opacity-50"
                  }`}
                >
                  {active && <FaCheckCircle className="text-[8px] text-green-400" />}
                  {prov.code}
                </span>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px] text-blue-100/75 bg-white/5 rounded-lg p-2 border border-white/5">
            <span className="flex-1 truncate">{note}</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-orange shrink-0">
              <FaClock className="text-[10px]" /> 24h
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
