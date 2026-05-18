import { ItemDetailResponse, Status } from "@/types/reportItems.types";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import DetailItemSkeleton from "./detailItemSkeleton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
const statusColor: Record<Status, string> = {
  LOST: "bg-[#FF6467]",
  FOUND: "bg-[#FCC800]",
  DONE: "bg-[#05DF72]",
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id: number | null;
};

export default function DetailItem({ isOpen, onClose, id }: Props) {
  const [detailData, setDetailData] = useState<ItemDetailResponse | null>(null);
  const [loading, setIsLoading] = useState(true);
  const router = useRouter();

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
        if (!res.ok) throw new Error("Gagal fetch data");
        const data: ItemDetailResponse = await res.json();
        setDetailData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();

    return () => {
      setDetailData(null);
    };
  }, [isOpen, id]);
  if (!isOpen || !id) return null;

  function buttonText() {
    if (detailData?.data.status.name === "DONE") return null;
    if (detailData?.data.isMe) return "Tandai Selesai";
    return detailData?.data.status.name === "LOST" ? "Kirim Informasi Penemuan" : "Klaim Barang";
  }

  function handleButton() {
    const text = buttonText();
    if (!text) return;

    setIsLoading(true);
    if (text === "Tandai Selesai") {
      fetch(`/api/items/${id}/done`, { method: "PATCH" })
        .then((res) => {
          if (!res.ok) throw new Error("Gagal tandai selesai");
          onClose();
          toast.success("Berhasil menandai selesai", { className: "font-poppins !text-center !bg-[#D1E7DD] !border !border-[#BADBCC] !rounded-xl !text-[#0F5132] !w-fit !min-w-[200px] !max-w-[90vw]", position: "top-right" });

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
    <div className="fixed inset-0 z-1001 flex items-end justify-center md:justify-start h-min-screen">
      <div className="fixed inset-0 bg-[#1e1e1e]/50 backdrop-blur-[2px] transition-opacity" onClick={onClose} />
      <div
        className=" w-full lg:max-w-md bg-cream-light rounded-t-2xl md:rounded-none shadow-2xl animate-in slide-in-from-bottom md:animate-in md:slide-in-from-left duration-1000 z-10 flex flex-col justify-between md:h-screen md:w-125 p-6 gap-10"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <DetailItemSkeleton />
        ) : (
          <>
            <div className=" overflow-y-auto custom-scrollbar">
              <div className="w-full aspect-video rounded-2xl overflow-hidden mb-5">
                {detailData?.data.image && <Image src={detailData?.data.image} className="w-full h-full object-cover" alt="image" width={500} height={500} loading="lazy" />}
              </div>

              <div className="flex justify-between items-start gap-4 mb-2">
                <h2 className="text-title1 md:text-h5 font-bold font-poppins text-dark">{detailData?.data.title}</h2>
                <span
                  className={`${detailData?.data.status.name ? statusColor[detailData.data.status.name] : ""} flex justify-center items-center font-jakarta font-bold text-dark px-3  py-2 rounded-lg text-caption md:text-body shadow-sm capitalize`}
                >
                  {detailData?.data.status.name}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-cream-dark font-jakarta font-semibold text-caption md:text-body ">Ditemukan Pada {formatDate(detailData?.data.ditemukanPada ?? "")}</p>

                  <div className="flex flex-row gap-1">
                    <Icon icon="mingcute:time-line" className="text-cream-dark" width="18" height="18" />
                    <p className="text-cream-dark font-jakarta text-caption md:text-body ">Diunggah {detailData?.data.diunggah}</p>
                  </div>
                </div>

                <span className="bg-[#EAEDF8] flex justify-center items-center font-jakarta font-medium text-bold px-3 py-2 rounded-lg text-caption md:text-body shadow-sm capitalize">{detailData?.data.category.name}</span>
              </div>
              <p className="text-dark mt-4 font-jakarta text-caption text-justify">{detailData?.data.desc}</p>
            </div>

            {buttonText() && (
              <button
                disabled={loading}
                className="w-full bg-primary shadow rounded-lg flex items-center justify-center py-3 hover:scale-105 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                onClick={handleButton}
              >
                <div className="flex items-center justify-center gap-2">
                  {loading && <Spinner className="size-6 text-cream" />}
                  <p className="font-jakarta font-bold text-body md:text-title2 text-cream">{loading ? "Memproses..." : buttonText()}</p>
                </div>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
