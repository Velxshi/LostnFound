// app/admin/layout.tsx
import BottomNavbar from "@/components/admin/navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-[#F7F3F0] w-full flex justify-center">
      <div className="pb-16"> 
        {children}
      </div>
      <BottomNavbar />
    </section>
  );
}