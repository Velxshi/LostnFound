import { BlurFade } from "../ui/blur-fade";
import Periodeselect from "./Dashboard/Periodeselect";
import DetailItem from "./detail/detailitem";
import CardItem from "../common/CardItem";
import { useEffect, useState } from "react";
import { CardItemProps } from "@/types/reportItems.types";
import CardStatistik from "./CardStatistik";

export default function DashboardSection() {
  const [items, setItems] = useState<CardItemProps[]>([]);
  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data.data))
      .catch((err) => console.error("Gagal load reports:", err));
  }, []);

  const totalHilang = items.filter((item) => item.status.name === "LOST").length;

  const totalTemuan = items.filter((item) => item.status.name === "FOUND").length;

  const totalDikembalikan = items.filter((item) => item.status.name === "DONE").length;

  const statistikItem = [
    {
      label: "Total Laporan",
      icon: "tabler:database",
      total: items.length,
    },
    {
      label: "Barang Hilang Aktif",
      icon: "tabler:package",
      total: totalHilang,
    },
    {
      label: "Barang Temuan Aktif",
      icon: "tabler:help-circle",
      total: totalTemuan,
    },
    {
      label: "Barang Dikembalikan",
      icon: "material-symbols:handshake-outline",
      total: totalDikembalikan,
    },
  ];

  const [selectedItem, setSelectedItem] = useState<CardItemProps | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  function openDetail(item: CardItemProps) {
    setSelectedItem(item);
    setPopupOpen(true);
  }

  function closeDetail() {
    setPopupOpen(false);
    setSelectedItem(null);
  }

  return (
    <>
      <div className="container flex flex-col">
        <BlurFade delay={0.15} inView>
          <h1 className="font-poppins font-bold text-title1 text-dark md:text-h4 lg:text-h3">Statistik Laporan</h1>
        </BlurFade>
        <BlurFade delay={0.45} inView>
          <div className="card-container grid grid-cols-2 lg:grid-cols-4 lg:gap-16 gap-3 mt-3">
            {statistikItem.map((item) => (
              <CardStatistik key={item.label} icon={item.icon} label={item.label} total={item.total} />
            ))}
          </div>
        </BlurFade>
        <BlurFade delay={0.55} inView>
          <div className="mt-5 flex flex-row items-center justify-between">
            <h1 className="font-poppins font-bold text-title2 text-dark  lg:text-h5">Laporan 7 Hari Terakhir</h1>
            <Periodeselect />
          </div>

          <div className="mt-3">
            <div className="bg-white p-4 rounded-xl shadow-sm h-74.5">
              <img src="https://www.jaspersoft.com/content/dam/jaspersoft/images/graphics/infographics/column-chart-example.svg" alt="grafik" className="w-full h-full object-contain" />
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.55} inView>
          <div className="mt-5 flex flex-row items-center justify-between">
            <h1 className="font-poppins font-bold text-title2 lg:text-h5 text-dark">Laporan Terbaru</h1>
            <a href="/admin/report" className="font-poppins text-body lg:text-title2 font-semibold text-[#2848B7]">
              Lihat Semua
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {items.map((item) => (
              <CardItem data={item} key={item.id} openDetail={openDetail} />
            ))}
          </div>
        </BlurFade>

        <DetailItem isOpen={popupOpen} onClose={closeDetail} item={selectedItem} />
      </div>
    </>
  );
}
