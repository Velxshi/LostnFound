import Image from "next/image";

export default function MapLegend() {
  const legenda = [
    {
      icon: "/assets/icons/marker-default.svg",
      label: "Laporkan Barang",
    },
    {
      icon: "/assets/icons/marker-lost.svg",
      label: "Barang Hilang",
    },
    {
      icon: "/assets/icons/marker-found.svg",
      label: "Barang Temuan",
    },
    {
      icon: "/assets/icons/marker-self.svg",
      label: "Laporan Saya",
    },
  ];

  return (
    <div className="bg-(--cream) border border-(--charcoal) absolute left-0 bottom-0 flex flex-col justify-center gap-2 py-2 px-3 z-1000">
      <p className="font-jakarta font-semibold text-body text-dark">Detail Peta</p>

      {legenda.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Image src={item.icon} alt="default" width={27} height={32} loading="eager" />
          <p className="font-jakarta text-caption text-dark">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
