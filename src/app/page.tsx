"use client";

import MapSection from "@/components/common/MapSection";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  useEffect(() => {
    const val = sessionStorage.getItem("showSuccessToast");
    if (val === "1") {
      setTimeout(() => {
        toast.success("Informasi berhasil terkirim", {
          className: "font-poppins !text-center !bg-[#D9F7E9] !border !border-[#C4C5D5] !rounded-xl !text-[#05DF72] !w-fit !min-w-[200px] !max-w-[90vw]",
          position: "top-right",
        });
      }, 100);
      sessionStorage.removeItem("showSuccessToast");
    } else if (val === "0") {
      setTimeout(() => {
        toast.error("Informasi gagal terkirim, silakan coba lagi", {
          className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]",
          position: "top-right",
        });
      }, 100);
      sessionStorage.removeItem("showErrorToast");
    } else if (val === "done") {
      setTimeout(() => {
        toast.success("Berhasil menandai selesai", {
          className: "font-poppins !text-center !bg-[#D1E7DD] !border !border-[#BADBCC] !rounded-xl !text-[#0F5132] !w-fit !min-w-[200px] !max-w-[90vw]",
          position: "top-right",
        });
      }, 100);
      sessionStorage.removeItem("showSuccessToast");
    }
  }, []);
  return (
    <>
      <MapSection />
    </>
  );
}
