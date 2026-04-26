import { Icon } from "@iconify/react";
import Image from "next/image";
import { CardItemProps, Status } from "@/types/report.types";

const statusColor: Record<Status, string> = {
  Lost: "bg-[#FF6467]",
  Found: "bg-[#FCC800]",
  Done: "bg-[#05DF72]",
};
export default function CardItem({ data }: { data: CardItemProps }) {
  return (
    <div className="flex flex-col relative rounded-xl bg-cream-light pb-3 gap-3">
      <div className={`absolute left-3 top-3 rounded-lg ${statusColor[data.status]} px-2 py-1 shadow`}>
        <p className="font-jakarta font-bold text-caption text-dark">{data.status}</p>
      </div>
      <Image src="https://picsum.photos/id/6/5000/3333" alt="profile" className="object-cover rounded-t-xl  w-full h-auto aspect-video" width={167} height={94} />

      <div className="flex flex-col px-3 pb-3 gap-2">
        <h5 className="font-poppins font-bold text-body text-dark">{data.title}</h5>
        <div className="flex gap-1 text-primary">
          <Icon icon="mdi:clock-outline" className="h-full w-auto" />
          <p className="font-jakarta font-medium text-caption">{data.time}</p>
        </div>
      </div>
    </div>
  );
}
