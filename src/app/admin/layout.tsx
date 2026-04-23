// app/admin/layout.tsx
import SidebarNavbar from "@/components/admin/navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-[#F7F3F0] w-full flex justify-center">
      <SidebarNavbar />
      <div className="pb-26 lg:ml-64 lg:pb-0
        min-h-screen"> 
        {children}
      </div>
    
    </section>
  );
}