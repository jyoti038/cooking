import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "music-enabled";
const NOTE_PATTERN = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23];

type WebAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

export function MusicToggle() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const loopRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  // user's saved preference: true = wants music on, false = off, null = not set
  const wantsOnRef = useRef<boolean>(true);

  const stopMusic = useCallback((markOff = true) => {
    if (markOff) wantsOnRef.current = false;
    if (loopRef.current !== null) {
      window.clearInterval(loopRef.current);
      loopRef.current = null;
    }
    masterGainRef.current?.gain.setTargetAtTime(
      0.0001,
      audioContextRef.current?.currentTime ?? 0,
      0.08,
    );
    audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    masterGainRef.current = null;
    setPlaying(false);
  }, []);

  const scheduleNote = useCallback(
    (context: AudioContext, master: GainNode, frequency: number, startsAt: number) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, startsAt);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(850, startsAt);
      gain.gain.setValueAtTime(0.0001, startsAt);
      gain.gain.exponentialRampToValueAtTime(0.055, startsAt + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + 1.35);

      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      oscillator.start(startsAt);
      oscillator.stop(startsAt + 1.45);
    },
    [],
  );

  const scheduleLoop = useCallback(
    (context: AudioContext, master: GainNode) => {
      const now = context.currentTime + 0.05;
      NOTE_PATTERN.forEach((frequency, index) => {
        scheduleNote(context, master, frequency, now + index * 0.62);
        if (index % 2 === 0) {
          scheduleNote(context, master, frequency / 2, now + index * 0.62);
        }
      });
    },
    [scheduleNote],
  );

  const startMusic = useCallback(async () => {
    wantsOnRef.current = true;
    if (audioContextRef.current && masterGainRef.current) {
      await audioContextRef.current.resume();
      setPlaying(true);
      return;
    }

    const AudioContextClass = window.AudioContext || (window as WebAudioWindow).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.5);
    master.connect(context.destination);

    audioContextRef.current = context;
    masterGainRef.current = master;

    scheduleLoop(context, master);
    loopRef.current = window.setInterval(() => scheduleLoop(context, master), 5000);
    await context.resume();
    setPlaying(true);
  }, [scheduleLoop]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) wantsOnRef.current = stored === "true";
    }

    // Only attempt to play if user hasn't turned music off
    if (wantsOnRef.current) {
      const start = () => {
        if (!wantsOnRef.current) return cleanup();
        startMusic().catch(() => undefined);
        cleanup();
      };
      const cleanup = () => {
        window.removeEventListener("pointerdown", start);
        window.removeEventListener("keydown", start);
        window.removeEventListener("touchstart", start);
        window.removeEventListener("click", start);
      };

      startMusic().catch(() => undefined);
      window.addEventListener("pointerdown", start, { once: true });
      window.addEventListener("keydown", start, { once: true });
      window.addEventListener("touchstart", start, { once: true });
      window.addEventListener("click", start, { once: true });

      return () => {
        cleanup();
        stopMusic(false);
      };
    }

    return () => {
      stopMusic(false);
    };
  }, [startMusic, stopMusic]);

  const toggle = () => {
    if (playing) {
      localStorage.setItem(STORAGE_KEY, "false");
      stopMusic();
    } else {
      localStorage.setItem(STORAGE_KEY, "true");
      startMusic().catch(() => undefined);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
      title={playing ? "Pause music" : "Play music"}
      className="fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-rose/30 bg-white/80 text-xl shadow-soft backdrop-blur transition hover:scale-110"
    >
      {playing ? "🔊" : "🎵"}
    </button>
  );
}
