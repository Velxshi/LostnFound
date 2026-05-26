import { Icon } from "@iconify/react";
import CountText from "@/components/ui/count-text";

export default function CardStatistik({ total, label, icon }: { total: number; label: string; icon: string }) {
  return (
    <div className="card w-full h-24.5 md:h-36  bg-cream-light rounded-3xl flex flex-col items-center justify-center gap-2">
      <Icon icon={icon} className="text-title1 md:text-h4 text-primary" />

      <p className="font-poppins text-title2 lg:text-h5 font-bold text-dark">
        <CountText target={total} />
      </p>
      <p className="text-caption text-center md:text-body text-cream-dark font-poppins">{label}</p>
    </div>
  );
}
