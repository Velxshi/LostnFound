import { Spinner } from "@/components/ui/spinner";
import { CategoryItemProps } from "@/types/categoryItems.types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  useEffect(() => {
    if (isEdit && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(category.name || "");
      setImage(category.linkImage || "");
    } else if (!isEdit && isOpen) {
      setName("");
      setImage("");
    }
  }, [category, isEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataCategory = { name, linkImage: image };

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
        toast.error("Gagal menyimpan data, silakan coba lagi", { className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]", position: "top-right" });
      }
    } catch (error) {
      toast.error("Gagal menyimpan data, silakan coba lagi", { className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]", position: "top-right" });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#1e1e1e]/50 bg-opacity-50 p-8 outline-none focus:outline-none" onClick={onClose}>
      <div className="mx-auto w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
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
                  className="w-full rounded-lg ring ring-(--cream-active) px-3.25 py-2.5 text-primary placeholder:text-(--cream-active) outline-none focus:ring-2 focus:ring-(--royale) h-12.5"
                  placeholder="Contoh: Elektronik"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-body font-poppins font-bold text-royale">Link Gambar</label>
                <input
                  type="text"
                  className="w-full rounded-lg ring ring-(--cream-active) px-3.25 py-2.5 placeholder:text-(--cream-active) text-primary outline-none focus:ring-2 focus:ring-(--royale) h-12.5"
                  placeholder="Link Gambar"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-end gap-3 px-8 py-5">
              <button
                disabled={loading}
                className="rounded-xl bg-primary w-full h-12 px-6 py-2 text-body font-semibold font-poppins text-cream-light shadow cursor-pointer hover:bg-primary-hover hover:shadow-lg focus:outline-none active:bg-primary-active active:scale-95 transisi flex items-center justify-center gap-3"
                type="submit"
              >
                {loading && <Spinner />}
                {loading ? "Menyimpan data..." : isEdit ? "Simpan Perubahan" : "Simpan Kategori"}
              </button>
              <button
                disabled={loading}
                className="rounded-xl w-full h-12 px-6 py-2 text-body font-semibold font-poppins text-primary  hover:bg-primary-hover outline-none focus:outline-none cursor-pointer active:scale-95 transisi"
                type="button"
                onClick={onClose}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
