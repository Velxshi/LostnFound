// app/admin/layout.tsx
import SidebarNavbar from "@/components/admin/navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-[#F7F3F0] min-w-screen flex flex-col lg:flex-row">
      <SidebarNavbar />
      <div className="flex-1 min-h-screen w-full pb-24"> 
        {children}
      </div>
    
    </section>
  );
}