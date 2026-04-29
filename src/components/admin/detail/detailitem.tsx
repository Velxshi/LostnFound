import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

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
    
    <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose} 
    />
    <div 
        className="relative w-full lg:max-w-md bg-white rounded-t-2xl md:rounded-none shadow-2xl animate-in slide-in-from-bottom md:animate-in md:slide-in-from-left duration-1000 z-10 flex flex-col md:h-screen md:w-125"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex justify-center py-4">
        <div className="h-1.5 w-12 rounded-full bg-gray-200 md:hidden" />
        </div>

        <div className="px-6 pb-12 overflow-y-auto custom-scrollbar">
        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-5">
            <img src={displayData?.image} className="w-full h-full object-cover"  />
        </div>

        <div className="flex justify-between items-start gap-4 mb-2">
            <h2 className="text-2xl font-bold font-poppins text-gray-900 leading-tight">{displayData?.title}</h2>
            <span className="bg-[#FFCE00] flex justify-center items-center font-poppins font-medium text-black px-4 h-8 py-1.5 rounded-lg text-[12px] shadow-sm uppercase">
            {displayData?.status.name}
            </span>
        </div>
        <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
                <div>
                    <p className="text-gray-400 font-poppins font-medium text-sm ">Ditemukan Pada {formatDate(displayData?.ditemukanPada)}</p>
                </div>
                <div className="flex flex-row gap-1 opacity-50">
                    <Icon icon='mingcute:time-line' className="text-gray-400" width="18" height="18"/>                                                          
                    <p className="text-gray-400 font-light font-poppins text-sm ">Diunggah {displayData?.diunggah}</p>
                </div>  
                
            </div>
            
            <div>
                <span className="bg-[#EAEDF8] flex justify-center items-center font-poppins font-medium text-black px-4 h-8 py-1.5 rounded-lg text-[12px] shadow-sm uppercase">
                {displayData?.category.name}
                </span>
            </div>
        </div>
        <p className="text-gray-700 mt-4 font-poppins text-sm text-justify">{displayData?.desc}</p>
        </div>
    </div>
    </div>
);
}