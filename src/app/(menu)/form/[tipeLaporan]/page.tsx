"use client";

import Kategori from "@/components/admin/reports/kategori";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

function LabelInput({ title }: { title: string }) {
  return <h5 className="font-poppins font-semibold text-body text-cream-darker md:text-title2">{title}</h5>;
}

function WrapperInput({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <label
      className="flex w-full items-center gap-1 rounded-xl bg-cream-light px-5 py-3 text-sm font-medium text-dark  shadow-sm transition-all border border-(--cream-dark)  focus-within:ring-2 focus-within:ring-(--cream-dark) hover:ring-2 hover:ring-(--cream-dark) relative"
      htmlFor={id}
    >
      {children}
    </label>
  );
}

export default function Reports() {
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    namaBarang: "",
    kategori: "",
    tanggalHilang: "",
    catatan: "",
    lokasiDitemukan: "",
    tanggalDitemukan: "",
    warna: "",
    lokasiTerakhir: "",
    isiBarang: "",
    ciriKhusus: "",
    pesanTambahan: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: pathname,
          data: formData,
        }),
      });

      console.log("DATA SIAP DIKIRIM", formData);
    } catch (err) {
      console.error(err);
    }
  }

  const isHilang = pathname === "/form/hilang" || pathname === "/form/temuan";

  const isInformasi = pathname === "/form/informasi";

  const isKlaim = pathname === "/form/klaim";

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          {isHilang && (
            <>
              <div className="flex flex-col gap-2">
                <LabelInput title="Nama Barang" />
                <WrapperInput id="namaBarang">
                  <input id="namaBarang" name="namaBarang" type="text" className="w-full placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Contoh: Macbook Air M2" onChange={handleChange} />
                </WrapperInput>
              </div>
              <div className="flex flex-col gap-2">
                <LabelInput title="Kategori" />
                <Kategori />
              </div>
              <div className="flex flex-col gap-2">
                <LabelInput title="Tanggal Ditemukan" />
                <WrapperInput id="tanggal">
                  <input type="datetime-local" name="tanggal" id="tanggal" className=" w-full" onChange={handleChange} />
                </WrapperInput>
              </div>

              <div className="flex flex-col gap-2">
                <LabelInput title="Catatan" />
                <WrapperInput id="catatan">
                  <textarea id="catatan" name="catatan" className="w-full resize-none  placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Tambahkan catatan yang ingin Anda berikan." rows={6} onChange={handleChange} />
                </WrapperInput>
              </div>
            </>
          )}

          {(isInformasi || isKlaim) && (
            <div className="flex items-center gap-4 p-4 bg-cream-light border border-(--cream-dark) rounded-xl">
              <Image src="https://picsum.photos/id/6/5000/3333" alt="Barang" className="aspect-square h-full w-auto rounded-lg" width={64} height={64} />

              <div className="flex flex-col gap-1">
                <h4 className="font-jakarta font-medium text-caption text-cream-dark">Informasi Barang</h4>
                <h5 className="font-poppins font-bold text-title2 text-dark">Macbook Air M2</h5>
              </div>
            </div>
          )}

          {isInformasi && (
            <>
              <div className="flex flex-col gap-2">
                <LabelInput title="Lokasi Ditemukan" />
                <WrapperInput id="lokasi">
                  <Icon icon="mdi:map-marker-outline" className="text-cream-dark " width={24} height={24} />
                  <input type="text" name="lokasi" id="lokasi" className=" w-full placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Contoh: Kantin, Perpustakaan" onChange={handleChange} />
                </WrapperInput>
              </div>
              <div className="flex flex-col gap-2">
                <LabelInput title="Catatan" />
                <WrapperInput id="catatan">
                  <textarea id="catatan" name="catatan" className="w-full resize-none  placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Tambahkan catatan yang ingin Anda berikan." rows={6} onChange={handleChange} />
                </WrapperInput>
              </div>
            </>
          )}

          {isKlaim && (
            <>
              <div className="flex flex-col gap-2">
                <LabelInput title="Lokasi Ditemukan" />
                <WrapperInput id="lokasi">
                  <Icon icon="mdi:map-marker-outline" className="text-cream-dark " width={24} height={24} />
                  <input type="text" name="lokasi" id="lokasi" className=" w-full placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Contoh: Kantin, Perpustakaan" onChange={handleChange} />
                </WrapperInput>
              </div>
              <div className="flex flex-col gap-2">
                <LabelInput title="Isi Barang" />
                <WrapperInput id="isiBarang">
                  <textarea id="isiBarang" name="isiBarang" className="w-full resize-none  placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Contoh: Isi tas (laptop, buku)." rows={6} onChange={handleChange} />
                </WrapperInput>
              </div>
              <div className="flex flex-col gap-2">
                <LabelInput title="Ciri Khusus Barang" />
                <WrapperInput id="ciriKhusus">
                  <textarea
                    id="ciriKhusus"
                    name="ciriKhusus"
                    className="w-full resize-none  placeholder:font-normal placeholder:text-(--cream-dark)"
                    placeholder="Contoh: Terdapat lubang dibagian dalam tas"
                    rows={6}
                    onChange={handleChange}
                  />
                </WrapperInput>
              </div>

              <div className="flex flex-col gap-2">
                <LabelInput title="Catatan" />
                <WrapperInput id="catatan">
                  <textarea id="catatan" name="catatan" className="w-full resize-none  placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Tambahkan catatan yang ingin Anda berikan." rows={6} onChange={handleChange} />
                </WrapperInput>
              </div>
            </>
          )}

          <div className="flex flex-col gap-9 pt-8 items-center w-full">
            <button type="submit" className="bg-primary rounded-lg py-4 text-body text-cream font-jakarta font-bold w-full shadow">
              Laporkan
            </button>

            <p className="font-jakarta font-bold text-title2 text-dark">Batalkan</p>
          </div>
        </form>
      </div>
    </div>
  );
}
