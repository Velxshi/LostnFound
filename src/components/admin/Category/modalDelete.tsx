import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export default function ModalDelete({ isOpen, onClose, onSuccess,category }: any) {
if (!isOpen) return null;




const handledelete = async (e: any) => {
    e.preventDefault();
if (!category) return;


    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        if (onSuccess) onSuccess();
        onClose();
      } else {

        alert(result.message || "Gagal menghapus kategori.");
      }
    } catch (error) {
      console.error("Gagal:", error);
      alert("Terjadi kesalahan koneksi.");
    } 
  };


    return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 bg-opacity-50 p-8 outline-none focus:outline-none">
    <div className=" mx-auto w-full max-w-lg">
        <div className=" flex w-full flex-col rounded-4xl border-0 bg-white shadow-xl outline-none focus:outline-none">
        

        <div className="flex flex-col rounded-t-4xl gap-1 p-8 pb-0 justify-center items-center">
            <div className="rounded-full bg-[#FFDAD6] flex items-center justify-center w-16 h-16">
                <Icon icon="mdi:alert" className="text-[#C10007]" width="30" height="30"/>
            </div>
            <h3 className="text-[25px] font-bold font-poppins text-slate-800 md:justify-center md:items-center flex">Hapus Kategori?</h3>
            <p className="text-[13px] font-normal font-poppins text-slate-800 text-center">Tindakan ini tidak dapat dibatalkan.<br/>
                Menghapus kategori ini akan <br/>
                mempengaruhi relasi data barang terkait.a</p>
            </div>
        <form onSubmit={handledelete}>
            <div className="flex flex-col px-8 pt-6">
            <div className="mb-4 w-full bg-[#F1EDEA] h-18.5 rounded-xl flex items-center justify-start px-8 py-4 gap-4">
                <div className="w-2 h-10 bg-[#BA1A1A] rounded">

                </div>
                    <div className="flex flex-col">
                    <p className="font-poppins uppercase font-semibold text-caption text-[#BA1A1A]">Target Penghapusan</p>
                    <p className="font-poppins font-bold text-title2">Kategori: {category.name}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-end gap-3 px-8 pb-5 p">
                <button
                className="rounded-xl bg-[#BA1A1A] w-full h-12 px-6 py-2 text-sm font-semibold font-poppins text-white shadow cursor-pointer  hover:bg-red-700 hover:shadow-lg focus:outline-none active:bg-red-800 active:scale-95 transition-all duration-150"
                type="submit"
              >
                Hapus
              </button>
              <button
                className="rounded-xl w-full h-12 px-6 py-2 text-sm font-semibold font-poppins text-[#BA1A1A] transition-all hover:bg-red-50 outline-none focus:outline-none cursor-pointer active:scale-95  duration-150"
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