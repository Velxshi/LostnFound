import { Icon } from "@iconify/react";
import { CategoryItemProps } from "@/types/categoryItems.types";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { AnimatePresence, motion } from "motion/react";
interface ModalDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category: CategoryItemProps | null;
}

export default function ModalDelete({ isOpen, onClose, onSuccess, category }: ModalDeleteProps) {
  const [loading, setLoading] = useState(false);
  const handledelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error("Gagal menghapus data, silakan coba lagi", { className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]", position: "top-right" });
      }
    } catch (error) {
      toast.error("Gagal menghapus data, silakan coba lagi", { className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]", position: "top-right" });
    }
    setLoading(false);
  };

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
                <div className="rounded-full bg-[#FFDAD6] flex items-center justify-center w-16 h-16">
                  <Icon icon="mdi:alert" className="text-[#C10007]" width="30" height="30" />
                </div>
                <h3 className="text-[25px] font-bold font-poppins text-dark md:justify-center md:items-center flex">Hapus Kategori?</h3>
                <p className="text-[13px] font-normal font-poppins text-dark text-center">
                  Tindakan ini tidak dapat dibatalkan.
                  <br />
                  Menghapus kategori ini akan <br />
                  mempengaruhi relasi data barang terkait.
                </p>
              </div>
              <form onSubmit={handledelete}>
                <div className="flex flex-col px-8 pt-6">
                  <div className="mb-4 w-full bg-[#F1EDEA] h-18.5 rounded-xl flex items-center justify-start px-8 py-4 gap-4">
                    <div className="w-2 h-10 bg-[#BA1A1A] rounded"></div>
                    <div className="flex flex-col">
                      <p className="font-poppins uppercase font-semibold text-caption text-[#BA1A1A]">Target Penghapusan</p>
                      <p className="font-poppins font-bold text-title2">Kategori: {category?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex  items-center justify-end gap-3 px-8 pb-5">
                  <button
                    onClick={onClose}
                    type="button"
                    className="rounded-xl w-full h-12 px-6 py-2 text-sm font-semibold font-poppins text-dark outline-none focus:outline-none cursor-pointer border border-(--charcoal) hover:scale-105 active:scale-95 transisi"
                  >
                    Batal
                  </button>
                  <button
                    disabled={loading}
                    className="rounded-xl bg-[#BA1A1A] w-full h-12 px-6 py-2 text-sm font-semibold font-poppins text-cream shadow cursor-pointer hover:scale-105 hover:shadow-lg focus:outline-none active:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-900 active:scale-95 transisi flex items-center justify-center gap-3"
                    type="submit"
                  >
                    {loading && <Spinner />}
                    {loading ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
