import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingHearts } from "@/components/FloatingHearts";
import { Sparkles } from "@/components/Sparkles";
import { RunawayNoButton } from "@/components/RunawayNoButton";
import { MusicToggle } from "@/components/MusicToggle";
import { EditableText } from "@/components/EditableText";
import cozyScene from "@/assets/cozy-scene.jpg";
import bgDesktop from "@/assets/cozy-bg-desktop.jpg";
import bgMobile from "@/assets/cozy-bg-mobile.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hey you… I have something to ask 💌" },
      {
        name: "description",
        content: "A little love note just for you — will you go on a date with me? 💕",
      },
      { property: "og:title", content: "Hey you… I have something to ask 💌" },
      {
        property: "og:description",
        content: "A cozy little love note, made just for you.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Quicksand:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Index,
});

const STORAGE_KEY = "date-invite-content-v1";

const DEFAULTS = {
  heading: "Hey Darling … I have something to ask 💌",
  message:
    "You make my world softer, warmer, and a little more magical every day…",
  successTitle: "YAYYY I knew it!!",
  successMessage: "Can't wait 🥺💕 You just made my whole week.",
};

type Content = typeof DEFAULTS;

function Index() {
  const [content, setContent] = useState<Content>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  const [saidYes, setSaidYes] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const openNote = () => {
    setNoteOpen(true);
    requestAnimationFrame(() => {
      document.getElementById("question")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setContent({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {}
  }, [content, hydrated]);

  const update = (key: keyof Content) => (val: string) =>
    setContent((c) => ({ ...c, [key]: val }));

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Responsive cozy cartoon background */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <picture>
          <source media="(min-width: 768px)" srcSet={bgDesktop} />
          <img
            src={bgMobile}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/40" />
      </div>

      <MusicToggle />
      <FloatingHearts />

      {/* Tiny edit hint */}
      <div className="fixed left-5 top-5 z-40 rounded-full border border-rose/30 bg-white/70 px-3 py-1 text-xs text-cocoa shadow-soft backdrop-blur">
        ✨ Tap any text to edit
      </div>

      {/* HERO */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <Sparkles count={10} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 max-w-3xl"
        >
          <motion.img
            src={cozyScene}
            alt="A cute smiling cloud surrounded by hearts"
            width={1024}
            height={1024}
            className="mx-auto mb-6 h-40 w-40 rounded-full object-cover shadow-soft sm:h-56 sm:w-56"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <h1 className="font-display text-4xl leading-tight text-cocoa text-balance sm:text-7xl">
            <EditableText
              value={content.heading}
              onChange={update("heading")}
              ariaLabel="Edit heading"
            />
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-cocoa/80 text-balance sm:text-xl">
            <EditableText
              value={content.message}
              onChange={update("message")}
              multiline
              ariaLabel="Edit romantic message"
            />
          </p>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={openNote}
              className="rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-soft transition hover:scale-105 hover:shadow-glow"
            >
              {noteOpen ? "Scroll to my note 💗" : "Open my little note 💗"}
            </button>
          </div>
        </motion.div>
      </section>

      {/* QUESTION */}
      {noteOpen && (
      <section
        id="question"
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-2xl rounded-[2rem] border border-rose/20 bg-card p-8 shadow-soft backdrop-blur sm:p-14"
        >
          <Sparkles count={6} />
          <p className="font-display text-3xl text-rose sm:text-4xl">A tiny question…</p>
          <h2 className="mt-3 font-display text-4xl text-cocoa text-balance sm:text-6xl">
            Will you go on a date with me? 🥺
          </h2>

          <AnimatePresence mode="wait">
            {!saidYes ? (
              <motion.div
                key="buttons"
                exit={{ opacity: 0, y: -10 }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8"
              >
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSaidYes(true)}
                  className="h-14 w-full max-w-xs rounded-full bg-gradient-to-r from-rose to-blush px-10 text-xl font-bold text-white shadow-soft transition hover:shadow-glow sm:w-56"
                >
                  YES 💖
                </motion.button>
                <RunawayNoButton />
              </motion.div>
            ) : (
              <motion.div
                key="yay"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 14 }}
                className="mt-10"
              >
                <div className="text-7xl">🥰</div>
                <p className="mt-4 font-display text-4xl text-rose sm:text-5xl">
                  <EditableText
                    value={content.successTitle}
                    onChange={update("successTitle")}
                    ariaLabel="Edit success title"
                  />
                </p>
                <p className="mt-2 text-lg text-cocoa/80">
                  <EditableText
                    value={content.successMessage}
                    onChange={update("successMessage")}
                    multiline
                    ariaLabel="Edit success message"
                  />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
      )}

      {/* ENDING */}
      <section className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9 }}
          className="max-w-2xl rounded-[2rem] bg-card/70 p-8 shadow-soft backdrop-blur sm:p-12"
        >
          <div className="mb-6 text-5xl">🌙✨</div>
          <h2 className="font-display text-4xl text-cocoa text-balance sm:text-6xl">
            Pick a date, pick a place…
          </h2>
          <p className="mt-4 font-display text-3xl text-rose sm:text-4xl">
            I&apos;ll be there with my whole heart 💕
          </p>
          <p className="mt-8 text-base text-cocoa/70">
            (made with way too much love, just for you)
          </p>
        </motion.div>
      </section>
    </main>
  );
}
