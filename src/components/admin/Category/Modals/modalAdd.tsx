import { useState } from "react";

export default function ModalAdd({ isOpen, onClose, onSuccess }: any) {
  

const [name, setName] = useState("");
const [image, setImage] = useState("");

 const handleSubmit = async (e: any) => {
    e.preventDefault(); 

    const dataCategory = {
      name: name,
      linkImage: image,
    };

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataCategory),
      });

      if (response.ok) {
        if (onSuccess) onSuccess()
        setName("");
        setImage("");
        onClose();
      } else {
        alert("Gagal menyimpan data ke server.");
      }
    } catch (error) {
      console.error("Gagal:", error);
      alert("Terjadi kesalahan koneksi.");
    }
  };
    if (!isOpen) return null;


    return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 bg-opacity-50 p-8 outline-none focus:outline-none">
    <div className=" mx-auto w-full max-w-lg">
        <div className=" flex w-full flex-col rounded-4xl border-0 bg-white shadow-xl outline-none focus:outline-none">
        <div className="flex flex-col rounded-t-4xl gap-1 p-8 pb-0">
            <h3 className="text-[25px] font-bold font-poppins text-slate-800 md:justify-center md:items-center flex">Tambah Kategori</h3>
            <p className="text-[13px] font-normal font-poppins text-slate-800">Tambah Kategori Anda</p>
            </div>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col px-8 pt-6">
            <div className="mb-4">
                <label className="mb-2 block text-sm font-poppins font-bold text-[#2848B7]">
                Nama Kategori
                </label>
                <input
                type="text"
                className="w-full rounded-lg border border-[#9F9F9F] px-3.25 py-2.5 text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 h-12.5"
                placeholder="Contoh: Elektronik"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-poppins font-bold text-[#2848B7]">
                Link Gambar
                </label>
                <input
                type="text"
                className="w-full rounded-lg border border-[#9F9F9F] px-3.25 py-2.5 text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 h-12.5"
                placeholder="Link Gambar"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-end gap-3 px-8 py-5">
                <button
                className="rounded-xl bg-[#2848B7] w-full h-12 px-6 py-2 text-sm font-semibold font-poppins text-white shadow cursor-pointer  hover:bg-blue-700 hover:shadow-lg focus:outline-none active:bg-blue-800 active:scale-95 transition-all duration-150"
                type="submit"
              >
                Simpan Kategori
              </button>
              <button
                className="rounded-xl w-full h-12 px-6 py-2 text-sm font-semibold font-poppins text-[#2848B7] transition-all hover:bg-blue-50 outline-none focus:outline-none cursor-pointer active:scale-95  duration-150"
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