import { Spinner } from "@/components/ui/spinner";
import { CategoryItemProps } from "@/types/categoryItems.types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: CategoryItemProps | null;
};

export default function CategoryModal({ isOpen, onClose, onSuccess, category }: Props) {
  const isEdit = !!category;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});

  useEffect(() => {
    if (isEdit && isOpen) {
      setErrors({});
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(category.name || "");
      setImage(category.linkImage || "");
    } else if (!isEdit && isOpen) {
      setErrors({});

      setName("");
      setImage("");
    }
  }, [category, isEdit, isOpen]);

  const isDirty = isEdit ? name !== (category?.name || "") || image !== (category?.linkImage || "") : name !== "" || image !== "";

  const handleClose = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };

  const validate = () => {
    const newErrors: { name?: string; image?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Nama kategori wajib diisi";
    } else if (name.trim().length < 2) {
      newErrors.name = "Nama kategori minimal 2 karakter";
    } else if (name.trim().length > 50) {
      newErrors.name = "Nama kategori maksimal 50 karakter";
    }

    if (!image.trim()) {
      newErrors.image = "Link gambar wajib diisi";
    } else {
      try {
        new URL(image.trim());
      } catch {
        newErrors.image = "Format link gambar tidak valid";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return; // stop kalau validasi gagal

    const dataCategory = { name: name.trim(), linkImage: image.trim() };

    try {
      setLoading(true);
      const response = await fetch(isEdit ? `/api/categories/${category.id}` : "/api/categories", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataCategory),
      });

      if (response.ok) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const data = await response.json().catch(() => null);
        const message = data?.message || "Gagal menyimpan data, silakan coba lagi";
        toast.error(message, {
          className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]",
          position: "top-right",
        });
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan, silakan coba lagi", {
        className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]",
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-[#1e1e1e]/50 p-8 outline-none focus:outline-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
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
                <div className="flex flex-col rounded-t-4xl gap-1 p-8 pb-0">
                  <h3 className="text-h5 font-bold font-poppins text-dark md:justify-center md:items-center flex">{isEdit ? "Edit Kategori" : "Tambah Kategori"}</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col px-8 pt-6">
                    <div className="mb-4">
                      <label className="mb-2 block text-body font-poppins font-bold text-royale">Nama Kategori</label>
                      <input
                        type="text"
                        className={`w-full rounded-lg ring px-3.25 py-2.5 text-primary placeholder:text-(--cream-active) outline-none focus:ring-2 h-12.5 ${
                          errors.name ? "ring-[#BA1A1A] focus:ring-[#BA1A1A]" : "ring-(--cream-active) focus:ring-(--royale)"
                        }`}
                        placeholder="Contoh: Elektronik"
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        value={name}
                      />
                      {errors.name && <p className="mt-1 text-sm font-poppins text-[#BA1A1A]">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                      <label className="mb-2 block text-body font-poppins font-bold text-royale">Link Gambar</label>
                      <input
                        type="text"
                        className={`w-full rounded-lg ring px-3.25 py-2.5 placeholder:text-(--cream-active) text-primary outline-none focus:ring-2 h-12.5 ${
                          errors.image ? "ring-[#BA1A1A] focus:ring-[#BA1A1A]" : "ring-(--cream-active) focus:ring-(--royale)"
                        }`}
                        placeholder="Link Gambar"
                        value={image}
                        onChange={(e) => {
                          setImage(e.target.value);
                          if (errors.image) setErrors((prev) => ({ ...prev, image: undefined }));
                        }}
                      />
                      {errors.image && <p className="mt-1 text-sm font-poppins text-[#BA1A1A]">{errors.image}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 px-8 py-5">
                    <button
                      disabled={loading}
                      type="button"
                      onClick={handleClose}
                      className="rounded-xl w-full h-12 px-6 py-2 text-body font-semibold font-poppins text-[#FB2C36] hover:scale-105 border-[#FB2C36] border focus:outline-none cursor-pointer active:scale-95 transisi"
                    >
                      Batal
                    </button>
                    <button
                      disabled={loading}
                      type="submit"
                      className="rounded-xl bg-primary w-full h-12 px-6 py-2 text-body font-semibold font-poppins text-cream-light shadow cursor-pointer hover:scale-105 hover:shadow-lg focus:outline-none disabled:cursor-not-allowed disabled:bg-(--royale-dark) active:scale-95 transisi flex items-center justify-center gap-3"
                    >
                      {loading && <Spinner />}
                      {loading ? "Menyimpan data..." : isEdit ? "Simpan Perubahan" : "Simpan Kategori"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-10000 flex items-center justify-center bg-[#1e1e1e]/50 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              className="mx-auto w-full max-w-sm bg-cream-light rounded-3xl p-8 flex flex-col gap-4 shadow-xl"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-1">
                <h4 className="font-poppins font-bold text-title2 text-dark">Tutup tanpa menyimpan?</h4>
                <p className="font-jakarta text-body text-cream-dark">Perubahan yang belum disimpan akan hilang.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="w-full h-11 rounded-xl border border-primary text-primary font-poppins font-semibold text-body cursor-pointer hover:scale-105 active:scale-95 transisi">
                  Kembali
                </button>
                <button onClick={handleConfirmClose} className="w-full h-11 rounded-xl bg-[#BA1A1A] text-white font-poppins font-semibold text-body cursor-pointer hover:bg-red-700 active:scale-95 transisi">
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
