'use client'

import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [isExiting, setIsExiting] = useState(false)
  const [isRemoved, setIsRemoved] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setIsExiting(true), 2000)

    const t2 = setTimeout(() => setIsRemoved(true), 2800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#f7f3f0]/90 overflow-hidden">
      {/* Background */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          isExiting
            ? 'animate-slideUp bg-[#f7f3f0]/70 backdrop-blur-sm'
            : 'bg-[#f7f3f0]'
        }`}
      />

      {/* Splash */}
      {!isRemoved && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-[#f7f3f0] z-50 ${
            isExiting ? 'animate-slideUp' : ''
          }`}
        >
          <div className="text-center animate-fadeIn">
            <img
              src="/assets/logo/mainLogo.png"
              className="w-30 mx-auto mb-4 animate-scaleIn"
            />
            <h1 className="text-[#2848b7] text-2xl font-bold">Lost n Found</h1>
          </div>
        </div>
      )}

      {/* Login */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <img src="/assets/logo/mainLogo.png" className="w-30 md:w-45 mb-10" />

        <h1 className="text-[#2848b7] text-2xl md:text-4xl font-bold mb-6">
          Lost n Found
        </h1>

        <div className="bg-white w-[320px] md:w-105 p-8 rounded-2xl shadow-md flex flex-col items-center gap-8">
          <h2 className="text-lg md:text-xl font-semibold">Selamat Datang</h2>

          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex items-center justify-center gap-3 w-full md:w-75 py-3 px-4 rounded-lg bg-white shadow hover:bg-gray-100 transition"
          >
            <img
              src="/assets/icons/google.png"
              className="w-5 h-5 md:w-6 md:h-6"
            />
            <span className="text-sm md:text-base font-medium">
              Login dengan Google
            </span>
          </button>
        </div>
      </div>

      {/* Animasi */}
      <style jsx>{`
        @keyframes slideUp {
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.8s ease forwards;
        }
      `}</style>
    </div>
  )
}
