import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const statusColor: Record<Status, string> = {
  LOST: "bg-[#FF6467]",
  FOUND: "bg-[#FCC800]",
  DONE: "bg-[#05DF72]",
};

export default function DetailItem({ isOpen, onClose, item }: any) {
  const [detailData, setDetailData] = useState<any>(null);

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
    if (isOpen && item?.id) {
      const FetchDetail = async () => {
        const res = await fetch(`/api/items/${item.id}`);
        const data = await res.json();
        setDetailData(data.data || data);
      };
      FetchDetail();
    } else if (!isOpen) {
      setDetailData(null);
    }
  }, [isOpen, item?.id]);
  if (!isOpen || !item) return null;

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
        <div className="flex justify-center py-4">
          <div className="h-1.5 w-12 rounded-full bg-gray-200 md:hidden" />
        </div>

        <div className="px-6 pb-12 overflow-y-auto custom-scrollbar">
          <div className="w-full aspect-video rounded-2xl overflow-hidden mb-5">{displayData?.image && <Image src={displayData?.image} className="w-full h-full object-cover" alt="image" width={500} height={500} loading="lazy" />}</div>

          <div className="flex justify-between items-start gap-4 mb-2">
            <h2 className="text-h5 font-bold font-poppins text-gray-900 leading-tight">{displayData?.title}</h2>
            <span className={`${statusColor[displayData?.status.name]} flex justify-center items-center font-jakarta font-bold text-dark px-4 h-8 py-1.5 rounded-lg text-body shadow-sm uppercase`}>{displayData?.status.name}</span>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-cream-dark font-jakarta font-semibold text-body ">Ditemukan Pada {formatDate(displayData?.ditemukanPada)}</p>
              </div>
              <div className="flex flex-row gap-1 opacity-50">
                <Icon icon="mingcute:time-line" className="text-cream-dark" width="18" height="18" />
                <p className="text-cream-dark  font-jakarta text-body ">Diunggah {displayData?.diunggah}</p>
              </div>
            </div>

            <div>
              <span className="bg-[#EAEDF8] flex justify-center items-center font-jakarta font-medium text-bold px-4 h-8 py-1.5 rounded-lg text-body shadow-sm uppercase">{displayData?.category.name}</span>
            </div>
          </div>
          <p className="text-dark mt-4 font-jakarta text-caption text-justify">{displayData?.desc}</p>
        </div>
      </div>
    </div>
  );
}
