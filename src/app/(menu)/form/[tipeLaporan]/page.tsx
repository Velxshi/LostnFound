"use client";

import Kategori from "@/components/common/button/kategori";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ItemDetailResponse } from "@/types/reportItems.types";

function LabelInput({ title }: { title: string }) {
  return <h5 className="font-poppins font-semibold text-body text-cream-darker md:text-title2">{title}</h5>;
}

function WrapperInput({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <label
      id={id}
      className="flex w-full items-center gap-1 rounded-xl bg-cream-light px-5 py-3 text-sm font-medium text-dark  shadow-sm transition-all border border-(--cream-dark)  focus-within:ring-2 focus-within:ring-(--cream-dark) hover:ring-2 hover:ring-(--cream-dark) relative"
      htmlFor={id}
    >
      {children}
    </label>
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

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
        if (!res.ok) throw new Error("Gagal fetch data");
        const data: ItemDetailResponse = await res.json();
        setDetailData(data);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    fetchDetail();

    return () => {
      setDetailData(null);
    };
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (lat && lng) {
      try {
        const response = await fetch(apiType, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

          const roleId = result.roleId;

          if (Number(roleId) === 1) {
            router.replace("/?mode=public");
          } else {
            router.replace("/");
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else if (id) {
      try {
        if (pathname === "/form/informasi") {
          const response = await fetch(apiType, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              locationDetail: formData.lokasiPenemuan,
              dateFound: formData.tanggalPenemuan,
              additionalNote: formData.deskripsi,
            }),
          });
          if (response.ok) {
            const result = await response.json();
            const roleId = result.roleId;
            if (Number(roleId) === 1) {
              router.replace("/?mode=public");
            } else {
              router.replace("/");
            }
          }
        } else if (pathname === "/form/klaim") {
          const response = await fetch(apiType, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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
            const roleId = result.roleId;
            if (Number(roleId) === 1) {
              router.replace("/?mode=public");
            } else {
              router.replace("/");
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  const isHilang = pathname === "/form/hilang" || pathname === "/form/temuan";

  const isInformasi = pathname === "/form/informasi";

  const isKlaim = pathname === "/form/klaim";

  return (
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
                <Kategori
                  onCategoryChange={(cat: string) => {
                    setSelectCategory(cat);
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <LabelInput title="Tanggal Ditemukan" />
                <WrapperInput id="tanggal">
                  <input type="datetime-local" name="tanggalHilang" id="tanggal" className=" w-full" onChange={handleChange} />
                </WrapperInput>
              </div>

              <div className="flex flex-col gap-2">
                <LabelInput title="Deskripsi" />
                <WrapperInput id="deskripsi">
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    className="w-full resize-none  placeholder:font-normal placeholder:text-(--cream-dark)"
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
              {detailData?.data.image && <Image src={detailData?.data.image} alt="Barang" className="aspect-square h-full w-auto rounded-lg" width={64} height={64} loading="lazy" />}

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
                  <Icon icon="mdi:map-marker-outline" className="text-cream-dark " width={24} height={24} />
                  <input type="text" name="lokasiPenemuan" id="lokasi" className=" w-full placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Contoh: Kantin, Perpustakaan" onChange={handleChange} />
                </WrapperInput>
              </div>
              <div className="flex flex-col gap-2">
                <LabelInput title="Tanggal Penemuan" />
                <WrapperInput id="tanggalPenemuan">
                  <input type="datetime-local" name="tanggalPenemuan" id="tanggal" className=" w-full" onChange={handleChange} />
                </WrapperInput>
              </div>
              <div className="flex flex-col gap-2">
                <LabelInput title="Deskripsi" />
                <WrapperInput id="deskripsi">
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    className="w-full resize-none  placeholder:font-normal placeholder:text-(--cream-dark)"
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
                  <input type="text" name="warnaBarang" id="warnaBarang" className=" w-full placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Contoh: biru dongker, hitam" onChange={handleChange} />
                </WrapperInput>
              </div>
              <div className="flex flex-col gap-2">
                <LabelInput title="Lokasi Terakhir" />
                <WrapperInput id="lokasiTerakhir">
                  <Icon icon="mdi:map-marker-outline" className="text-cream-dark " width={24} height={24} />
                  <input type="text" name="lokasiTerakhir" id="lokasiTerakhir" className=" w-full placeholder:font-normal placeholder:text-(--cream-dark)" placeholder="Contoh: Kantin, Perpustakaan" onChange={handleChange} />
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
                <LabelInput title="Deskripsi" />
                <WrapperInput id="deskripsi">
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    className="w-full resize-none  placeholder:font-normal placeholder:text-(--cream-dark)"
                    placeholder="Tambahkan deskripsi yang ingin Anda berikan."
                    rows={6}
                    onChange={handleChange}
                  />
                </WrapperInput>
              </div>
            </>
          )}

          <div className="flex flex-col gap-9 pt-8 items-center w-full">
            <button onClick={handleSubmit} className="bg-primary rounded-lg py-4 text-body text-cream font-jakarta font-bold w-full shadow hover:scale-105 transform-all duration-300 cursor-pointer">
              Laporkan
            </button>

            <p className="font-jakarta font-bold text-title2 text-dark">Batalkan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
