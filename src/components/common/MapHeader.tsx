import Image from "next/image";
import { useRouter } from "next/navigation";

function FilterButton({ title }: { title: string }) {
  return (
    <button className="w-fit p-2.5 rounded-2xl bg-cream-light font-jakarta text-caption shadow h-fit cursor-pointer hover:scale-105 transition-all duration-300">
      <p>{title}</p>
    </button>
  );
}

export default function MapHeader() {
  const router = useRouter();

  function goToProfile() {
    router.push("/profile");
  }

  return (
    <div className=" flex justify-between absolute h-fit top-6 left-6 right-6 z-1000 items-center md:top-9 md:left-9 md:right-9">
      <div className="flex gap-2 text-cream-darker">
        <FilterButton title="Laporan Saya" />
        <FilterButton title="Hilang" />
        <FilterButton title="Temuan" />
      </div>

      <div className="flex hover:ring-4 hover:ring-(--royale) transition-all duration-300 rounded-full ">
        <Image src="https://i.pinimg.com/1200x/e3/6b/c6/e36bc6a279e7cc29547dd0bb84d65939.jpg" alt="profile" className="object-cover rounded-full w-10 h-10 cursor-pointer  md:w-14 md:h-14" width={40} height={40} onClick={goToProfile} />
      </div>
    </div>
  );
}
