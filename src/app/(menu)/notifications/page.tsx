import { BlurFade } from "@/components/ui/blur-fade";
import { Icon } from "@iconify/react";

interface Notification {
  title: string;
  time: string;
  tipe: string;
  isRead: boolean;
}

function CardNotif({ data }: { data: Notification }) {
  return (
    <div className={`flex gap-4 p-5 border-l-8 ${data.isRead ? "border-(--royale)/20" : "border-(--royale)"} rounded-xl bg-cream-light`}>
      <div className={`rounded-xl shrink-0 w-12 h-12 flex items-center justify-center ${data.isRead ? "bg-cream" : "bg-primary-light-hover"}`}>
        <Icon icon={data.tipe === "Hilang" ? "mdi:email" : "material-symbols:person-search"} className={`${data.isRead ? "text-cream-dark" : "text-primary"} w-7 h-6`} />
      </div>

      <div className="flex flex-col gap-8">
        <p className="font-poppins font-medium text-body text-dark md:text-title2">{data.title}</p>

        <div className="flex justify-between items-center">
          <p className="font-jakarta font-medium text-caption text-cream-dark md:text-body">{data.time}</p>

          {data.isRead ? (
            <button className="flex gap-1 items-center text-cream-darker bg-cream rounded-full p-2">
              <Icon icon="ri:check-double-fill" className="h-full w-auto" />
            </button>
          ) : (
            <button className="flex gap-1 items-center text-primary">
              <Icon icon="material-symbols:check" className="h-full w-auto" />
              <p className="font-jakarta font-medium text-caption md:text-body">Tandai Dibaca</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Notif() {
  const itemsNotif = [
    [
      {
        title: "Seseorang mengirim informasi mengenai barangmu yang hilang, cek email sekarang.",
        time: "09:56 AM",
        tipe: "Hilang",
        isRead: true,
      },
      {
        title: "Seseorang mengaku sebagai pemilik dari barang yang Anda temukan, cek email sekarang.",
        time: "09:41 AM",
        tipe: "Ditemukan",
        isRead: false,
      },
    ],
    [
      {
        title: "Seseorang mengirim informasi mengenai barangmu yang hilang, cek email sekarang.",
        time: "03:21 PM",
        tipe: "Hilang",
        isRead: true,
      },
      {
        title: "Seseorang mengaku sebagai pemilik dari barang yang Anda temukan, cek email sekarang.",
        time: "05:41 AM",
        tipe: "Ditemukan",
        isRead: true,
      },
    ],
    [
      {
        title: "Seseorang mengirim informasi mengenai barangmu yang hilang, cek email sekarang.",
        time: "11:41 AM",
        tipe: "Hilang",
        isRead: true,
      },
      {
        title: "Seseorang mengaku sebagai pemilik dari barang yang Anda temukan, cek email sekarang.",
        time: "07:31 AM",
        tipe: "Ditemukan",
        isRead: true,
      },
    ],
  ];

  return (
    <div className="flex flex-col gap-6 items-center">
      <BlurFade delay={0.25} inView>
        <div className="flex flex-col gap-3 max-w-2xl">
          <h4 className="font-poppins font-extrabold text-title2 text-dark md:text-title1">Hari Ini</h4>
          {itemsNotif[0].map((item, index) => (
            <CardNotif data={item} key={index} />
          ))}
        </div>
      </BlurFade>
      <BlurFade delay={0.75} inView>
        <div className="flex flex-col gap-3 max-w-2xl">
          <h4 className="font-poppins font-extrabold text-title2 text-dark md:text-title1">Kemarin</h4>
          {itemsNotif[1].map((item, index) => (
            <CardNotif data={item} key={index} />
          ))}
        </div>
      </BlurFade>
      <BlurFade delay={0.75} inView>
        <div className="flex flex-col gap-3 max-w-2xl">
          <h4 className="font-poppins font-extrabold text-title2 text-dark md:text-title1">Lebih Lama Lagi</h4>
          {itemsNotif[2].map((item, index) => (
            <CardNotif data={item} key={index} />
          ))}
        </div>
      </BlurFade>
    </div>
  );
}
