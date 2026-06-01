"use client";

import Kategori from "@/components/common/button/kategori";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ItemDetailResponse } from "@/types/reportItems.types";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";

function LabelInput({ title }: { title: string }) {
  return <h5 className="font-poppins font-semibold text-body text-cream-darker md:text-title2">{title}</h5>;
}

function WrapperInput({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <label
      id={id}
      className="flex w-full items-center gap-1 rounded-xl bg-cream-light px-5 py-3 text-sm font-medium text-dark shadow-sm transition-all border border-(--cream-dark) focus-within:ring-2 focus-within:ring-(--cream-dark) hover:ring-2 hover:ring-(--cream-dark) relative"
      htmlFor={id}
    >
      {children}
    </label>
  );
}

function ModalBatal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#1e1e1e]/50 p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}>
          <motion.div
            className="mx-auto w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full flex-col rounded-4xl bg-cream-light shadow-xl">
              <div className="flex flex-col gap-1 p-8 pb-0 justify-center items-center">
                <div className="rounded-full bg-[#FFF3CD] flex items-center justify-center w-16 h-16">
                  <Icon icon="material-symbols:warning-outline" className="text-[#B45309]" width="30" height="30" />
                </div>
                <h3 className="text-[25px] font-bold font-poppins text-dark flex mt-1">Tinggalkan Halaman?</h3>
                <p className="text-[13px] font-normal font-poppins text-dark text-center">Pengisian informasi belum diselesaikan. Anda harus memasukkannya kembali jika meninggalkan halaman.</p>
              </div>
              <div className="flex items-center gap-3 px-8 py-6">
                <button
                  onClick={onClose}
                  className="rounded-xl w-full h-12 px-6 py-2 text-sm font-semibold font-poppins text-dark outline-none focus:outline-none cursor-pointer border border-(--charcoal) hover:scale-105 active:scale-95 transisi"
                >
                  Tidak
                </button>
                <button
                  onClick={onConfirm}
                  className="rounded-xl bg-[#BA1A1A] w-full h-12 px-6 py-2 text-sm font-semibold font-poppins text-cream shadow cursor-pointer hover:scale-105 hover:shadow-lg focus:outline-none active:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-900 active:scale-95 transisi flex items-center justify-center gap-3"
                >
                  Ya
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Reports() {
  const pathname = usePathname();
  const router = useRouter();
  const [selectCategory, setSelectCategory] = useState("");
  const id = useSearchParams().get("id");
  const lat = useSearchParams().get("lat");
  const lng = useSearchParams().get("lng");
  const [detailData, setDetailData] = useState<ItemDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBatalModal, setShowBatalModal] = useState(false);

  const [formData, setFormData] = useState({
    namaBarang: "",
    kategori: "",
    tanggalHilang: "",
    deskripsi: "",
    lokasiPenemuan: "",
    tanggalPenemuan: "",
    warnaBarang: "",
    lokasiTerakhir: "",
    isiBarang: "",
    ciriKhusus: "",
  });

  const isHilang = pathname === "/form/hilang" || pathname === "/form/temuan";
  const isInformasi = pathname === "/form/informasi";
  const isKlaim = pathname === "/form/klaim";

  // Cek apakah minimal satu field terisi
  const hasAnyInput = Object.values(formData).some((v) => v.trim() !== "") || selectCategory !== "";

  // Cek apakah semua field wajib terisi per tipe form
  const isFormValid = (() => {
    if (isHilang) return formData.namaBarang.trim() !== "" && formData.tanggalHilang !== "" && formData.deskripsi.trim() !== "";
    if (isInformasi) return formData.lokasiPenemuan.trim() !== "" && formData.tanggalPenemuan !== "";
    if (isKlaim) return formData.warnaBarang.trim() !== "" && formData.lokasiTerakhir.trim() !== "";
    return false;
  })();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleBatal() {
    if (hasAnyInput) {
      setShowBatalModal(true);
    } else {
      router.back();
    }
  }

  function handleConfirmBatal() {
    setShowBatalModal(false);
    router.push("/");
  }

  // Intercept tombol back browser
  useEffect(() => {
    const handlePopState = () => {
      if (hasAnyInput) {
        window.history.pushState(null, "", window.location.href);
        setShowBatalModal(true);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hasAnyInput]);

  let apiType = "/api/items";
  let type: number | null = null;
  if (pathname === "/form/hilang") type = 1;
  if (pathname === "/form/temuan") type = 2;
  if (pathname === "/form/informasi") apiType = `/api/items/found/${id}`;
  if (pathname === "/form/klaim") apiType = `/api/items/claim/${id}`;

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/items/${id}`);
        if (!res.ok)
          toast.error("Gagal mengambil data, silakan memuat ulang", { className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]", position: "top-right" });
        const data: ItemDetailResponse = await res.json();
        setDetailData(data);
      } catch (error) {
        toast.error("Gagal mengambil data, silakan memuat ulang", { className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]", position: "top-right" });
      }
    };
    fetchDetail();
    return () => setDetailData(null);
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (lat && lng) {
      try {
        const response = await fetch(apiType, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.namaBarang,
            categoryId: Number(selectCategory) || 1,
            desc: formData.deskripsi,
            statusId: type,
            tanggal: formData.tanggalHilang,
            latitude: lat,
            longitude: lng,
          }),
        });
        if (response.ok) {
          const result = await response.json();
          Number(result.roleId) === 1 ? router.replace("/?mode=public") : router.replace("/");
        }
      } catch (err) {
        console.error(err);
      }
    } else if (id) {
      try {
        if (pathname === "/form/informasi") {
          const response = await fetch(apiType, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              locationDetail: formData.lokasiPenemuan,
              dateFound: formData.tanggalPenemuan,
              additionalNote: formData.deskripsi,
            }),
          });
          if (response.ok) {
            const result = await response.json();
            Number(result.roleId) === 1 ? router.replace("/?mode=public") : router.replace("/");
          }
        } else if (pathname === "/form/klaim") {
          const response = await fetch(apiType, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              warnaBarang: formData.warnaBarang,
              lokasiTerakhir: formData.lokasiTerakhir,
              isiBarang: formData.isiBarang,
              ciriKhusus: formData.ciriKhusus,
              pesanTambahan: formData.deskripsi,
            }),
          });
          if (response.ok) {
            const result = await response.json();
            Number(result.roleId) === 1 ? router.replace("/?mode=public") : router.replace("/");
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col gap-6 w-full">
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
                  <Kategori onCategoryChange={(cat: string) => setSelectCategory(cat)} />
                </div>
                <div className="flex flex-col gap-2">
                  <LabelInput title="Tanggal Ditemukan" />
                  <WrapperInput id="tanggal">
                    <input type="datetime-local" name="tanggalHilang" id="tanggal" className="w-full" onChange={handleChange} />
                  </WrapperInput>
                </div>
                <div className="flex flex-col gap-2">
                  <LabelInput title="Deskripsi" />
                  <WrapperInput id="deskripsi">
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      className="w-full resize-none placeholder:font-normal placeholder:text-(--cream-dark)"
                      placeholder="Tambahkan deskripsi yang ingin Anda berikan."
                      rows={6}
                      onChange={handleChange}
                    />
                  </WrapperInput>
                </div>
              </>
            )}

            {(isInformasi || isKlaim) && (
              <div className="flex items-center gap-4 p-4 bg-cream-light border border-(--cream-dark) rounded-xl">
                {detailData?.data.image && <Image src={detailData.data.image} alt="Barang" className="aspect-square h-full w-auto rounded-lg" width={64} height={64} loading="lazy" />}
                <div className="flex flex-col gap-1">
                  <h4 className="font-jakarta font-medium text-caption text-cream-dark">Informasi Barang</h4>
                  <h5 className="font-poppins font-bold text-title2 text-dark">{detailData?.data.title}</h5>
                </div>
              </div>
            )}

            {isInformasi && (
              <>
                <div className="flex flex-col gap-2">
                  <LabelInput title="Lokasi Penemuan" />
                  <WrapperInput id="lokasi">
                    <Icon icon="mdi:map-marker-outline" className="text-cream-dark" width={24} height={24} />
                    <input type="text" name="lokasiPenemuan" id="lokasi" className="w-full placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Contoh: Kantin, Perpustakaan" onChange={handleChange} />
                  </WrapperInput>
                </div>
                <div className="flex flex-col gap-2">
                  <LabelInput title="Tanggal Penemuan" />
                  <WrapperInput id="tanggalPenemuan">
                    <input type="datetime-local" name="tanggalPenemuan" id="tanggal" className="w-full" onChange={handleChange} />
                  </WrapperInput>
                </div>
                <div className="flex flex-col gap-2">
                  <LabelInput title="Deskripsi" />
                  <WrapperInput id="deskripsi">
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      className="w-full resize-none placeholder:font-normal placeholder:text-(--cream-dark)"
                      placeholder="Tambahkan deskripsi yang ingin Anda berikan."
                      rows={6}
                      onChange={handleChange}
                    />
                  </WrapperInput>
                </div>
              </>
            )}

            {isKlaim && (
              <>
                <div className="flex flex-col gap-2">
                  <LabelInput title="Warna Barang" />
                  <WrapperInput id="warnaBarang">
                    <input type="text" name="warnaBarang" id="warnaBarang" className="w-full placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Contoh: biru dongker, hitam" onChange={handleChange} />
                  </WrapperInput>
                </div>
                <div className="flex flex-col gap-2">
                  <LabelInput title="Lokasi Terakhir" />
                  <WrapperInput id="lokasiTerakhir">
                    <Icon icon="mdi:map-marker-outline" className="text-cream-dark" width={24} height={24} />
                    <input type="text" name="lokasiTerakhir" id="lokasiTerakhir" className="w-full placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Contoh: Kantin, Perpustakaan" onChange={handleChange} />
                  </WrapperInput>
                </div>
                <div className="flex flex-col gap-2">
                  <LabelInput title="Isi Barang" />
                  <WrapperInput id="isiBarang">
                    <textarea id="isiBarang" name="isiBarang" className="w-full resize-none placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Contoh: Isi tas (laptop, buku)." rows={6} onChange={handleChange} />
                  </WrapperInput>
                </div>
                <div className="flex flex-col gap-2">
                  <LabelInput title="Ciri Khusus Barang" />
                  <WrapperInput id="ciriKhusus">
                    <textarea
                      id="ciriKhusus"
                      name="ciriKhusus"
                      className="w-full resize-none placeholder:font-normal placeholder:text-(--cream-dark)"
                      placeholder="Contoh: Terdapat lubang dibagian dalam tas"
                      rows={6}
                      onChange={handleChange}
                    />
                  </WrapperInput>
                </div>
                <div className="flex flex-col gap-2">
                  <LabelInput title="Deskripsi" />
                  <WrapperInput id="deskripsi">
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      className="w-full resize-none placeholder:font-normal placeholder:text-(--cream-dark)"
                      placeholder="Tambahkan deskripsi yang ingin Anda berikan."
                      rows={6}
                      onChange={handleChange}
                    />
                  </WrapperInput>
                </div>
              </>
            )}

            <div className="flex gap-9 pt-8 items-center w-full">
              <button
                disabled={loading}
                type="button"
                onClick={handleBatal}
                className="rounded-xl w-full px-6 py-4 text-body font-semibold font-poppins text-[#FB2C36] hover:scale-105 border-[#FB2C36] border focus:outline-none cursor-pointer active:scale-95 transisi disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !isFormValid}
                className="rounded-xl bg-primary w-full h-12 px-6 py-2 text-body font-semibold font-poppins text-cream-light shadow cursor-pointer hover:scale-105 hover:shadow-lg focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100 active:scale-95 transisi flex items-center justify-center gap-3"
              >
                <div className="flex items-center justify-center gap-2">
                  {loading && <Spinner className="size-6 text-cream" />}
                  <span>{loading ? "Memproses..." : isKlaim ? "Klaim" : "Laporkan"}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalBatal isOpen={showBatalModal} onClose={() => setShowBatalModal(false)} onConfirm={handleConfirmBatal} />
    </>
  );
}
