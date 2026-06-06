"use client";
import { ItemDetailResponse, Status } from "@/types/reportItems.types";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import DetailItemSkeleton from "./detailItemSkeleton";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { AnimatePresence, motion } from "motion/react";
import "leaflet/dist/leaflet.css";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const MapItem = dynamic(() => import("@/components/common/MapItem"), {
  ssr: false,
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id: number | null;
};

export default function DetailItem({ isOpen, onClose, id }: Props) {
  const [detailData, setDetailData] = useState<ItemDetailResponse | null>(null);
  const [loading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !id) return;

    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/items/${id}`);
        if (!res.ok)
          toast.error("Gagal mengambil data, silakan memuat ulang", {
            className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]",
            position: "top-right",
          });
        const data: ItemDetailResponse = await res.json();
        setDetailData(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Gagal mengambil data, silakan memuat ulang", {
          className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]",
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();

    return () => {
      setDetailData(null);
    };
  }, [isOpen, id]);

  function buttonText() {
    if (detailData?.data.status.name === "SELESAI") return null;
    if (detailData?.data.isMe) return "Tandai Selesai";
    return detailData?.data.status.name === "HILANG" ? "Kirim Informasi Penemuan" : "Klaim Barang";
  }

  function handleButton() {
    const text = buttonText();
    if (!text) return;

    setIsLoading(true);
    if (text === "Tandai Selesai") {
      fetch(`/api/items/${id}/done`, { method: "PATCH" })
        .then((res) => {
          if (!res.ok)
            toast.error("Gagal menandai selesai", {
              className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]",
              position: "top-right",
            });
          onClose();
          toast.success("Berhasil menandai selesai", {
            className: "font-poppins !text-center !bg-[#D1E7DD] !border !border-[#BADBCC] !rounded-xl !text-[#0F5132] !w-fit !min-w-[200px] !max-w-[90vw]",
            position: "top-right",
          });
          setTimeout(() => {
            window.location.reload();
          }, 800);
        })
        .catch((err) => console.error(err));
      return;
    }

    if (text === "Kirim Informasi Penemuan") {
      router.push(`/form/informasi?id=${id}`);
      return;
    } else if (text === "Klaim Barang") {
      router.push(`/form/klaim?id=${id}`);
    }

    setIsLoading(false);
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && id && (
        <div className="fixed inset-0 z-1001 flex items-end justify-center md:justify-start h-min-screen">
          <motion.div className="fixed inset-0 bg-[#1e1e1e]/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose} />

          {/* Mobile: slide from bottom */}
          <motion.div
            layout
            className="md:hidden w-full bg-cream-light rounded-t-2xl shadow-2xl z-10 flex flex-col justify-between p-6 gap-10"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <PanelContent loading={loading} detailData={detailData} formatDate={formatDate} buttonText={buttonText} handleButton={handleButton} pathname={pathname} />
          </motion.div>

          {/* Desktop: slide from left */}
          <motion.div
            className="hidden md:flex w-125 bg-cream-light shadow-2xl z-10 flex-col justify-between md:h-screen p-6 gap-10"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <PanelContent loading={loading} detailData={detailData} formatDate={formatDate} buttonText={buttonText} handleButton={handleButton} pathname={pathname} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

type PanelContentProps = {
  loading: boolean;
  detailData: ItemDetailResponse | null;
  formatDate: (date: string) => string;
  buttonText: () => string | null;
  handleButton: () => void;
  pathname: string;
};

function PanelContent({ loading, detailData, formatDate, buttonText, handleButton, pathname }: PanelContentProps) {
  const statusColor: Record<Status, string> = {
    HILANG: "bg-[#FF6467]",
    TEMUAN: "bg-[#FCC800]",
    SELESAI: "bg-[#05DF72]",
  };

  if (loading) return <DetailItemSkeleton />;

  return (
    <>
      <div className="overflow-y-auto custom-scrollbar">
        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-5">
          {detailData?.data.image && <Image src={detailData.data.image} className="w-full h-full object-cover" alt="image" width={500} height={500} loading="eager" />}
        </div>

        <div className="flex justify-between items-start gap-4 mb-2">
          <h2 className="text-title1 md:text-h5 font-bold font-poppins text-dark">{detailData?.data.title}</h2>
          <span
            className={`${detailData?.data.status.name ? statusColor[detailData.data.status.name] : ""} flex justify-center items-center font-jakarta font-bold text-dark px-3 py-2 rounded-lg text-caption md:text-body shadow-sm capitalize`}
          >
            {detailData?.data.status.name}
          </span>
        </div>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-cream-dark font-jakarta font-semibold text-caption md:text-body">Ditemukan Pada {formatDate(detailData?.data.ditemukanPada ?? "")}</p>
            <div className="flex flex-row gap-1">
              <Icon icon="mingcute:time-line" className="text-cream-dark" width="18" height="18" />
              <p className="text-cream-dark font-jakarta text-caption md:text-body">Diunggah {detailData?.data.diunggah}</p>
            </div>
          </div>
          <span className="bg-[#EAEDF8] flex justify-center items-center font-jakarta font-medium text-bold px-3 py-2 rounded-lg text-caption md:text-body shadow-sm capitalize">{detailData?.data.category.name}</span>
        </div>

        <p className="text-dark mt-4 font-jakarta text-caption text-justify">{detailData?.data.desc}</p>

        {(pathname === "/reports" || pathname === "/admin/reports" || pathname === "/admin") && (
          <div className="w-full h-48 min-h-48 rounded-2xl overflow-hidden shadow-sm border border-gray-200 mt-2 z-0">
            <MapItem lat={detailData?.data.latitude ?? 0} lng={detailData?.data.longitude ?? 0} status={detailData?.data.status.name ?? "LOST"} isMe={detailData?.data.isMe ?? false} />
          </div>
        )}
      </div>

      {buttonText() && (
        <button
          disabled={loading}
          className="w-full bg-primary shadow rounded-lg flex items-center justify-center py-3 hover:scale-105 transisi cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          onClick={handleButton}
        >
          <div className="flex items-center justify-center gap-2">
            {loading && <Spinner className="size-6 text-cream" />}
            <p className="font-jakarta font-bold text-body md:text-title2 text-cream">{loading ? "Memproses..." : buttonText()}</p>
          </div>
        </button>
      )}
    </>
  );
}
