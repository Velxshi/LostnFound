import { Icon } from "@iconify/react";
import Image from "next/image";
import { CardItemProps, Status } from "@/types/reportItems.types";

interface CardProps {
  data: CardItemProps;
  openDetail: (item: CardItemProps) => void;
}

const statusColor: Record<Status, string> = {
  LOST: "bg-[#FF6467]",
  FOUND: "bg-[#FCC800]",
  DONE: "bg-[#05DF72]",
};

export default function CardItem({ data, openDetail }: CardProps) {
  return (
    <div className="flex flex-col relative rounded-xl bg-cream-light pb-3 gap-3 cursor-pointer" onClick={() => openDetail(data)}>
      <div className={`absolute left-3 top-3 rounded-lg ${statusColor[data.status.name]} px-2 py-1 shadow`}>
        <p className="font-jakarta font-bold text-caption text-dark">{data.status.name}</p>
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
