import Image from "next/image";
import { useSession } from "next-auth/react";

export function ProfilePicture() {
  const { data: session } = useSession();
  return (
    <Image src={session?.user?.image ?? "https://i.pinimg.com/1200x/e3/6b/c6/e36bc6a279e7cc29547dd0bb84d65939.jpg"} alt="profile" className="object-cover rounded-full w-10 h-10 cursor-pointer  md:w-14 md:h-14" width={48} height={48} />
  );
}
