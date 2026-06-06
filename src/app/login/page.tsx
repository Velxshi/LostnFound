"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { AnimatePresence, motion } from "motion/react";

export default function LoginPage() {
  const [splashDone, setSplashDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f7f3f0] overflow-hidden">
      {/* Splash Screen */}
      <AnimatePresence>
        {!splashDone && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2848b7]" exit={{ y: "-100%" }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
            {/* Lingkaran dekoratif di background */}
            <motion.div className="absolute w-125 h-125 rounded-full border border-white/10" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1.4, opacity: 1 }} transition={{ duration: 2, ease: "easeOut" }} />
            <motion.div className="absolute w-75 h-75 rounded-full border border-white/10" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1.1, opacity: 1 }} transition={{ duration: 2, delay: 0.1, ease: "easeOut" }} />

            {/* Konten splash */}
            <div className="flex flex-col items-center gap-5 relative">
              <motion.div initial={{ scale: 0.4, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}>
                <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-5 shadow-2xl">
                  <Image alt="logo" src="/assets/logo/Logo.svg" className="w-16 h-16" width={64} height={64} />
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col items-center gap-1"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
                }}
              >
                <motion.h1
                  className="text-white text-3xl font-bold font-poppins tracking-tight"
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  Lost n Found
                </motion.h1>
                <motion.p
                  className="text-white/60 text-sm font-jakarta"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  Temukan yang hilang, kembalikan yang ditemukan
                </motion.p>
              </motion.div>

              {/* Loading dots */}
              <motion.div className="flex gap-1.5 mt-2" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.7 } } }}>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/50"
                    variants={{
                      hidden: { opacity: 0, scale: 0 },
                      visible: {
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                        transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 },
                      },
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Page */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : 24 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="flex flex-col items-center">
          <Image alt="logo" src="/assets/logo/Logo.svg" className="w-28 md:w-40 mb-8" width={120} height={120} />

          <h1 className="text-primary text-2xl md:text-4xl font-bold font-poppins mb-2">Lost n Found</h1>
          <p className="text-cream-dark font-jakarta text-sm md:text-base mb-10">Temukan yang hilang, kembalikan yang ditemukan</p>

          <motion.div
            className="bg-cream-light w-[320px] md:w-105 p-8 rounded-3xl shadow-md flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : 16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          >
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-lg md:text-xl font-semibold font-poppins text-dark">Selamat Datang</h2>
              <p className="text-cream-dark font-jakarta text-caption">Masuk untuk melanjutkan</p>
            </div>

            <motion.button
              onClick={async () => {
                setLoading(true);
                await signIn("google", { callbackUrl: "/" });
                setLoading(false);
              }}
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full md:w-75 py-3 px-4 rounded-xl bg-cream-light shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-cream-light-hover text-primary transisi"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? <Spinner /> : <Image alt="google" src="/assets/icons/google.png" className="w-5 h-5 md:w-6 md:h-6" width={20} height={20} />}
              <span className="text-sm md:text-base font-medium font-poppins">{loading ? "Memproses..." : "Masuk dengan Google"}</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
