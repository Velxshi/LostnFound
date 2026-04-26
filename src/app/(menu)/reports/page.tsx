import CardItem from "@/components/common/CardItem";
import { CardItemProps } from "@/types/report.types";

export default function Reports() {
  const data: CardItemProps[] = [
    {
      id: 1,
      title: "Macbook Air M2",
      time: "2 jam yang lalu",
      status: "Lost",
    },
    {
      id: 2,
      title: "Dompet Hitam Kulit",
      time: "5 jam yang lalu",
      status: "Lost",
    },
    {
      id: 3,
      title: "Kunci Motor Honda",
      time: "1 hari yang lalu",
      status: "Found",
    },
    {
      id: 4,
      title: "Tas Ransel Abu",
      time: "3 hari yang lalu",
      status: "Found",
    },
    {
      id: 5,
      title: "AirPods Pro",
      time: "30 menit yang lalu",
      status: "Lost",
    },
    {
      id: 6,
      title: "Botol Minum Tumbler",
      time: "6 jam yang lalu",
      status: "Found",
    },
    {
      id: 7,
      title: "Kartu Mahasiswa",
      time: "2 hari yang lalu",
      status: "Lost",
    },
    {
      id: 8,
      title: "Jaket Hitam Nike",
      time: "4 hari yang lalu",
      status: "Lost",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {data.map((item, index) => (
        <CardItem key={index} data={item} />
      ))}
    </div>
  );
}
