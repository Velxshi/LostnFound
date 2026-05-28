'use client'

import Link from "next/link"; // Import Link dari Next.js
import CardBantuan from "./Bantuan/cardbantuan";
import ContactCard from "./Bantuan/contact";
import SearchComponent from "./button/Search";

export default function PusatBantuan() {
  const dataBantuan = [
    {
      title: "Cara Melapor",
      description: "Langkah mudah mengunggah barang yang Anda temukan.",
      icon: "lucide:square-pen",
      link: "/bantuan/cara-melapor", 
    },
    {
      title: "Data barang yang kita laporkan?",
      description: "Bagaimana cara melihat data barang yang kita laporkan?",
      icon: "line-md:question-square",
      link: "/bantuan/data-laporan",
    },
    {
      title: "Kehilangan Barang",
      description: "Bagaimana jika kita kehilangan barang dan ada orang lain yang sudah melaporkan temuan barang anda?",
      icon: "lucide:shield-question",
      link: "/bantuan/kehilangan-barang",
    },
    {
      title: "Menemukan Barang",
      description: "Bagaimana jika ada orang yang kehilangan barang dan kita menemukan barangnya persis di tempat pelapor melaporkannya di map?",
      icon: "material-symbols:verified-outline",
      link: "/bantuan/menemukan-barang",
    },
  ];

  return (
    <div className="flex flex-col p-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-2 items-start">
        <h1 className="text-[36px] font-semibold font-poppins">Pusat Bantuan</h1>
        <p className="text-[14px] font-poppins text-gray-600">
          Punya pertanyaan atau butuh bantuan? Tim kami siap membantu Anda.
        </p>
      </div>

      <div className="mt-7">
        <SearchComponent placeholder="Search." onSearch={() => {}} />
      </div>


      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {dataBantuan.map((item, index) => (
        
          <Link href={item.link} key={index} className="w-full flex">
            <CardBantuan 
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <ContactCard />
      </div>
    </div>
  );
}