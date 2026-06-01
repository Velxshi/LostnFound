import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@iconify/react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { signOut } from "next-auth/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalLogout({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOut({ callbackUrl: "/login", redirect: true });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-[#1e1e1e]/50 p-8 outline-none focus:outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="mx-auto w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full flex-col rounded-4xl border-0 bg-cream-light shadow-xl outline-none focus:outline-none">
              <div className="flex flex-col rounded-t-4xl gap-1 p-8 pb-0 justify-center items-center">
                <h3 className="text-h5 font-bold font-poppins text-dark flex mt-1">Keluar dari akun?</h3>
                <p className="text-body font-normal font-poppins text-dark text-center">Anda akan diarahkan kembali ke halaman masuk.</p>
              </div>
              <div className="flex flex-row items-center justify-end gap-3 px-8 py-6">
                <button
                  disabled={loading}
                  onClick={onClose}
                  className="rounded-xl w-full h-12 px-6 py-2 text-body font-semibold font-poppins text-[#FB2C36] hover:scale-105 border-[#FB2C36] border focus:outline-none cursor-pointer active:scale-95 transisi"
                >
                  Batal
                </button>
                <button
                  disabled={loading}
                  onClick={handleLogout}
                  className="rounded-xl bg-primary w-full h-12 px-6 py-2 text-body font-semibold font-poppins text-cream-light shadow cursor-pointer hover:scale-105 hover:shadow-lg focus:outline-none disabled:cursor-not-allowed disabled:bg-(--royale-dark) active:scale-95 transisi flex items-center justify-center gap-3"
                >
                  {loading && <Spinner />}
                  {loading ? "Keluar..." : "Ya"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
