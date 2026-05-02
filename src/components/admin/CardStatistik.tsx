import { Icon } from "@iconify/react";
import CountText from "@/components/ui/count-text";

export default function CardStatistik({ total, label, icon }: { total: number; label: string; icon: string }) {
  return (
    <div className="card w-full h-24.5 md:h-36  bg-cream-light rounded-3xl flex flex-col items-center justify-center gap-2">
      <Icon icon={icon} className="text-title1 md:text-h4 text-primary" />

      <p className="font-poppins text-title2 lg:text-h5 font-bold">
        <CountText target={total} />
      </p>
      <p className="text-caption lg:text-body text-[#B9B6B4] font-poppins">{label}</p>
    </div>
  );
}
