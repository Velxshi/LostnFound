'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen bg-[#f7f3f0] overflow-hidden flex flex-col items-center justify-center text-center px-4">
      {/* Decorative background circles — same as splash screen */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full border border-[#2848b7]/10"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1.4, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full border border-[#2848b7]/10"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.1, ease: 'easeOut' }}
      />

      {/* Main content */}
      <motion.div
        className="flex flex-col items-center relative"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
          },
        }}
      >
        {/* Logo */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.4, rotate: -12 },
            visible: {
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: { type: 'spring', stiffness: 260, damping: 18 },
            },
          }}
          className="mb-6"
        >
          <Image
            alt="logo"
            src="/assets/logo/Logo.svg"
            className="w-20 md:w-28"
            width={112}
            height={112}
          />
        </motion.div>

        {/* 404 number */}
        <motion.h1
          className="text-[#2848b7] text-8xl md:text-9xl font-bold font-poppins tracking-tight leading-none mb-2"
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          className="text-[#2848b7] text-xl md:text-2xl font-semibold font-poppins mb-2"
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          Halaman Tidak Ditemukan
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-[#a89880] font-jakarta text-sm md:text-base mb-10"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          Halaman yang kamu cari tidak tersedia.
        </motion.p>

        {/* Card */}
        <motion.div
          className="bg-[#eee8e1] w-[320px] md:w-[420px] p-8 rounded-3xl shadow-md flex flex-col items-center gap-6"
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-lg md:text-xl font-semibold font-poppins text-[#1a1a1a]">
              Kembali ke halaman utama
            </h3>
            <p className="text-[#a89880] font-jakarta text-sm">
              Halaman ini tidak ada atau sudah dipindahkan.
            </p>
          </div>

          {/* Back to Home button */}
          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 w-full md:w-[300px] py-3 px-4 rounded-xl bg-[#2848b7] text-white cursor-pointer hover:bg-[#1f3a9e] transition-colors duration-200 shadow"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            <span className="text-sm md:text-base font-medium font-poppins">
              Kembali ke Beranda
            </span>
          </motion.button>
        </motion.div>

        {/* Animated dots — same as splash */}
        <motion.div
          className="flex gap-1.5 mt-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.8 },
            },
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#2848b7]/40"
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: {
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                  transition: {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.15,
                  },
                },
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
