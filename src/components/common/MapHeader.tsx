import { useRouter } from "next/navigation";
import { ProfilePicture } from "../ui/profile-picture";

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
        <div onClick={goToProfile}>
          <ProfilePicture />
        </div>
      </div>
    </div>
  );
}
