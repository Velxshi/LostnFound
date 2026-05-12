"use client";
import { useSession } from "next-auth/react";
import CardProfile from "@/components/common/profile/CardProfile";
export default function Profile() {
  const { status } = useSession();

  return (
    <div className="flex flex-col p-9 items-center">
      <CardProfile isLoading={status === "loading"} />
    </div>
  );
}
