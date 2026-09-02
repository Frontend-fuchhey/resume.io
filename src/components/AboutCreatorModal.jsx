import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  ExternalLink,
  Code2,
  Shield,
  Sparkles,
} from "lucide-react";
import shrawanImg from "../../assets/shrawan.jpg";

const SOCIALS = [
  {
    label: "GitHub",
    icon: Github,
    href: "https://github.com/Frontend-fuchhey",
    color: "#1A1A1A",
  },
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/shrawan-karki-187706428/",
    color: "#0A66C2",
  },
  {
    label: "Twitter",
    icon: Twitter,
    href: "https://x.com/pratyushkarki6",
    color: "#1DA1F2",
  },
  {
    label: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/pratyush.karki.59180",
    color: "#1877F2",
  },
  {
    label: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/prasar_7/",
    color: "#E1306C",
  },
  {
    label: "Email",
    icon: Mail,
    href: "mailto:pratyushkarki6@gmail.com",
    color: "#FF5E1A",
  },
];

const HIGHLIGHTS = [
  { icon: Code2, text: "Full-Stack Developer" },
  { icon: Sparkles, text: "Tech Creator" },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.93, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 24, stiffness: 320 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

export function AboutCreatorModal({ open, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          key="about-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={(e) => e.target === overlayRef.current && onClose()}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-4"
          style={{
            backgroundColor: "rgba(26,26,26,0.50)",
            backdropFilter: "blur(6px)",
          }}
          aria-modal="true"
          role="dialog"
          aria-label="About Creator"
        >
          <motion.div
            key="about-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full overflow-hidden rounded-2xl bg-white shadow-[0_32px_80px_rgba(26,26,26,0.20)] border border-[#E8E4DC]"
            style={{
              fontFamily: "'Poppins', sans-serif",
              maxWidth: 560,
              maxHeight: "90vh",
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close about creator dialog"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E2DC] bg-[#FBF9F5] text-[#666055] transition-all hover:border-[#FF5E1A] hover:text-[#FF5E1A] hover:bg-[#FFF3EB]"
            >
              <X size={16} />
            </button>

            {/* Single-screen, non-scrolling layout */}
            <div className="flex flex-col px-6 pt-5 pb-5">
              {/* ── HEADER: crisp avatar + name/badges ── */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar — natural aspect ratio, crisp rendering */}
                <div
                  className="flex-shrink-0 overflow-hidden rounded-xl border border-[#E8E4DC] shadow-sm"
                  style={{ lineHeight: 0 }}
                >
                  <img
                    src={shrawanImg}
                    alt="Shrawan Karki"
                    style={{
                      height: 88,
                      width: "auto",
                      display: "block",
                      objectFit: "cover",
                      objectPosition: "center top",
                      imageRendering: "-webkit-optimize-contrast",
                    }}
                    draggable={false}
                  />
                </div>

                {/* Name + role + badges */}
                <div className="min-w-0 pt-0.5">
                  <h2
                    className="text-[22px] leading-snug mb-0.5"
                    style={{
                      fontFamily: "'Courgette', cursive",
                      color: "#1A1A1A",
                    }}
                  >
                    Crafted by{" "}
                    <span style={{ color: "#FF5E1A" }}>Shrawan Karki</span>
                  </h2>

                  <p className="text-[12px] font-medium text-[#555047] mb-0.5">
                    Developer, Security Enthusiast &amp; Tech Creator
                  </p>

                  <p className="text-[10px] text-gray-400 mb-2.5">
                    resume.io &mdash; ATS Resume Studio
                  </p>

                  {/* Highlight badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                      <span
                        key={text}
                        className="inline-flex items-center gap-1 rounded-full border border-[#E5E2DC] bg-[#FBF9F5] px-2.5 py-0.5 text-[10px] font-semibold text-[#666055]"
                      >
                        <Icon size={10} className="text-[#FF5E1A]" />
                        {text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="h-px bg-[#F0EDE8] mb-3.5" />

              {/* ── Bio card ── */}
              <div className="rounded-xl border border-[#F0EDE8] bg-[#FBF9F5] p-3.5 mb-3.5">
                <p className="text-[12px] leading-relaxed text-[#4A4640]">
                  <strong className="font-semibold text-[#1A1A1A]">
                    Shrawan Karki
                  </strong>{" "}
                  is the sole creator behind this{" "}
                  <span className="font-semibold text-[#FF5E1A]">
                    ATS Resume Builder
                  </span>{" "}
                  &mdash; built to eliminate layout friction that causes resumes
                  to fail automated screeners.
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-[#4A4640]">
                  Clean single-column structure, real-time 3-pane canvas
                  editing, strict vector-text PDF export, and a human-centered
                  wizard &mdash; all powered by the belief that{" "}
                  <em className="italic text-[#1A1A1A]">
                    great tooling should feel invisible.
                  </em>
                </p>
              </div>

              {/* ── CTA Button ── */}
              <a
                href="https://shrawankarki.com.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="group mb-3.5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-[0_8px_24px_rgba(255,94,26,0.36)] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,#FF5E1A 0%,#FF7A40 100%)",
                }}
              >
                <ExternalLink
                  size={14}
                  className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                />
                Visit Live Portfolio
              </a>

              {/* ── Divider ── */}
              <div className="h-px bg-[#F0EDE8] mb-3" />

              {/* ── Connect label ── */}
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9E988E]">
                Connect
              </p>

              {/* ── Social row: all 6 icons in one line ── */}
              <div className="grid grid-cols-6 gap-2 mb-3.5">
                {SOCIALS.map(({ label, icon: Icon, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    title={label}
                    className="group flex flex-col items-center gap-1 rounded-xl border border-[#E5E2DC] bg-[#FBF9F5] py-2 text-center transition-all hover:border-[#FF5E1A]/40 hover:bg-[#FFF3EB] hover:shadow-sm active:scale-[0.97]"
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${color}18` }}
                    >
                      <Icon size={13} style={{ color }} />
                    </span>
                    <span className="text-[9px] font-semibold text-[#666055]">
                      {label}
                    </span>
                  </a>
                ))}
              </div>

              {/* ── Footer ── */}
              <p className="text-center text-[10px] text-[#C0BAB2]">
                Built with love in Nepal &middot; resume.io v1.0
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
