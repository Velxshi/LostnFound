import Periodeselect from "@/components/admin/Periodeselect";
import Totlap from "../../../../public/Dashboard-Admin/Totlap.svg";
import Barhil from "../../../../public/Dashboard-Admin/Barhil.svg";
import Bardik from "../../../../public/Dashboard-Admin/Bardik.svg";
import Bardit from "../../../../public/Dashboard-Admin/Bardit.svg";

import CardItem from "@/components/admin/cardItem";

import Image from "next/image";
export default function Dashboard() {   
    
    const totallaporan = 100;
    const baranghilangaktif = 50;
    const barangditemukan = 30;
    const barangdikembalikan = 20;

    return <div className="w-full min-h-screen p-9">
        <div className="container flex flex-col">
            <div>
                <h1 className="font-poppins font-bold text-title1 text-dark md:text-[32px] lg:text-[40px]!">Statistik Laporan</h1>
            </div>

            {/* card statistik */}
            <div className="card-container grid grid-cols-2 lg:grid-cols-4 lg:gap-16 gap-3 mt-3">
                <div className="card w-full h-24.5 md:h-36  bg-[#FEFEFE] rounded-[20px] flex flex-col items-center justify-center gap-2">
                    <div className="logo">
                        <Image src={Totlap} alt="Total Laporan" className=" w-full md:w-6.75 md:h-7.5 lg:w-7.25 lg:h-8.25"/>
                    </div>
                    <p className="font-poppins text-title2 lg:text-[24px] font-bold">{totallaporan}</p>
                    <p className="text-caption lg:text-[14px]! text-[#B9B6B4] font-poppins">Total Laporan</p>
                </div>

                <div className="card w-full h-24.5 md:h-36 bg-[#FEFEFE] rounded-[20px] flex flex-col items-center justify-center gap-2">
                    <div className="logo">
                    <Image src={Barhil} alt="Barang Hilang Aktif" className=" w-full md:w-6.75 md:h-7.5 lg:w-7.25 lg:h-8.25"/>
                    </div>
                    <p className="font-poppins text-title2 lg:text-[24px] font-bold">{baranghilangaktif}</p>
                    <p className="text-caption lg:text-[14px]! text-[#B9B6B4] font-poppins">Barang Hilang Aktif</p>
                </div>

                <div className="card w-full h-24.5 md:h-36 bg-[#FEFEFE] rounded-[20px] flex flex-col items-center justify-center gap-2">
                    <div className="logo">
                    <Image src={Bardit} alt="Barang Ditemukan Aktif" className=" w-full md:w-6.75 md:h-7.5 lg:w-7.25 lg:h-8.25"/>
                    </div>
                    <p className="font-poppins text-title2 lg:text-[24px] font-bold">{barangditemukan}</p>
                    <p className="text-caption lg:text-[14px]! text-[#B9B6B4] font-poppins">Barang Ditemukan Aktif</p>
                </div>

                <div className="card w-full h-24.5 md:h-36 bg-[#FEFEFE] rounded-[20px] flex flex-col items-center justify-center gap-2">
                    <div className="logo ">
                    <Image src={Bardik} alt="Barang Dikembalikan" className=" w-full md:w-6.75 md:h-7.5 lg:w-7.25 lg:h-8.25"/>
                    </div>
                    <p className="font-poppins text-title2 lg:text-[24px] font-bold">{barangdikembalikan}</p>
                    <p className="text-caption lg:text-[14px]! text-[#B9B6B4] font-poppins">Barang Dikembalikan</p>
                </div>
            </div>

            <div className="mt-5 flex flex-row items-center justify-between">
                <h1 className="font-poppins font-bold text-title2 text-dark lg:text-[24px]!">Laporan 7 Hari Terakhir</h1>
                <Periodeselect/>
            </div>

            <div className="mt-3 ">
                <div className="bg-white p-4 rounded-xl shadow-sm h-74.5">
                    <img src='https://www.jaspersoft.com/content/dam/jaspersoft/images/graphics/infographics/column-chart-example.svg' alt='grafik' className="w-full h-full object-contain"/>
                </div>
            </div>

            <div className="mt-5 flex flex-row items-center justify-between">
                <h1 className="font-poppins font-bold text-title2 lg:text-[24px] text-dark">Laporan Terbaru</h1>
                <p className="font-poppins text-[14px] lg:text-title2 font-semibold text-[#2848B7]">Lihat Semua</p>
            </div>

            <div>
                <CardItem/>
            </div>
        </div>
    </div>
}   