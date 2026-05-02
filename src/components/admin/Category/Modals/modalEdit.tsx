import { useEffect, useState } from "react";

export default function ModalEdit({ isOpen, onClose, onSuccess, category }: any) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (category && isOpen) {
      setName(category.name || "");
      setImage(category.linkImage || "");
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleedit = async (e: any) => {
    e.preventDefault();

    const dataCategory = {
      name: name,
      linkImage: image,
    };

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataCategory),
      });

      if (response.ok) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert("Gagal menyimpan data ke server.");
      }
    } catch (error) {
      console.error("Gagal:", error);
      alert("Terjadi kesalahan koneksi.");
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#1e1e1e]/50 bg-opacity-50 p-8 outline-none focus:outline-none">
      <div className=" mx-auto w-full max-w-lg">
        <div className=" flex w-full flex-col rounded-4xl border-0 bg-cream-light shadow-xl outline-none focus:outline-none">
          <div className="flex flex-col rounded-t-4xl gap-1 p-8 pb-0">
            <h3 className="text-h5 font-bold font-poppins text-dark md:justify-center md:items-center flex">Edit Kategori</h3>
            <p className="text-body font-poppins text-dark">Edit Kategori Anda</p>
          </div>
          <form onSubmit={handleedit}>
            <div className="flex flex-col px-8 pt-6">
              <div className="mb-4">
                <label className="mb-2 block text-body font-poppins font-bold text-royale">Nama Kategori</label>
                <input
                  type="text"
                  className="w-full rounded-lg ring ring-(--cream-active) px-3.25 py-2.5 text-cream-active outline-none focus:ring-2 focus:ring-(--royale) h-12.5"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-body font-poppins font-bold text-royale">Link Gambar</label>
                <input
                  type="text"
                  className="w-full rounded-lg ring ring-(--cream-active) px-3.25 py-2.5 text-(--cream-active) outline-none focus:ring-2 focus:ring-(--royale) h-12.5"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-end gap-3 px-8 py-5">
              <button
                className="rounded-xl bg-primary w-full h-12 px-6 py-2 text-body font-semibold font-poppins text-cream-light shadow cursor-pointer  hover:bg-primary-hover hover:shadow-lg focus:outline-none active:bg-primary-active active:scale-95 transition-all duration-150"
                type="submit"
              >
                Simpan Perubahan
              </button>
              <button
                className="rounded-xl w-full h-12 px-6 py-2 text-body font-semibold font-poppins text-primary transition-all hover:bg-primary-hover outline-none focus:outline-none cursor-pointer active:scale-95  duration-150"
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
