import { ItemDetailResponse, Status } from "@/types/reportItems.types";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import DetailItemSkeleton from "./detailItemSkeleton";

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

  const displayData = detailData;

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
    <div className="fixed inset-0 z-999 flex items-end justify-center md:justify-start h-min-screen">
      <div className="fixed inset-0 bg-[#1e1e1e]/50 backdrop-blur-[2px] transition-opacity" onClick={onClose} />
      <div
        className="relative w-full lg:max-w-md bg-cream-light rounded-t-2xl md:rounded-none shadow-2xl animate-in slide-in-from-bottom md:animate-in md:slide-in-from-left duration-1000 z-10 flex flex-col md:h-screen md:w-125"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-6 pb-12 overflow-y-auto custom-scrollbar">
          {loading ? (
            <DetailItemSkeleton />
          ) : (
            <>
              <div className="w-full aspect-video rounded-2xl overflow-hidden mb-5">
                {displayData?.data.image && <Image src={displayData?.data.image} className="w-full h-full object-cover" alt="image" width={500} height={500} loading="lazy" />}
              </div>

              <div className="flex justify-between items-start gap-4 mb-2">
                <h2 className="text-h5 font-bold font-poppins text-dark">{displayData?.data.title}</h2>
                <span className={`${displayData?.data.status.name ? statusColor[displayData.data.status.name] : ""} flex justify-center items-center font-jakarta font-bold text-dark px-3  py-2 rounded-lg text-body shadow-sm capitalize`}>
                  {displayData?.data.status.name}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-cream-dark font-jakarta font-semibold text-body ">Ditemukan Pada {formatDate(displayData?.data.ditemukanPada ?? "")}</p>

                  <div className="flex flex-row gap-1">
                    <Icon icon="mingcute:time-line" className="text-cream-dark" width="18" height="18" />
                    <p className="text-cream-dark font-jakarta text-body ">Diunggah {displayData?.data.diunggah}</p>
                  </div>
                </div>

                <span className="bg-[#EAEDF8] flex justify-center items-center font-jakarta font-medium text-bold px-3 py-2 rounded-lg text-body shadow-sm capitalize">{displayData?.data.category.name}</span>
              </div>
              <p className="text-dark mt-4 font-jakarta text-caption text-justify">{displayData?.data.desc}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
