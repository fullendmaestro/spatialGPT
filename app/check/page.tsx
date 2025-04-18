// app/sidebar/page.tsx
import { BookText, FileText, Flag, RefreshCcw } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="h-screen w-16 bg-white border-r flex flex-col items-center py-4 space-y-6">
      <SidebarItem icon={<FileText size={18} />} label="Description" active />
      <SidebarItem icon={<BookText size={18} />} label="Editorial" />
      <SidebarItem icon={<Flag size={18} />} label="Solutions" />
      <SidebarItem icon={<RefreshCcw size={18} />} label="Submissions" />
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`group flex flex-col items-center space-y-1 cursor-pointer ${
        active ? "text-black font-semibold" : "text-gray-500"
      } hover:text-black`}
    >
      <div
        className={`rounded p-1 ${
          active ? "bg-blue-100 text-blue-600" : "group-hover:bg-gray-100"
        }`}
      >
        {icon}
      </div>
      <span className="text-xs rotate-90 whitespace-nowrap">{label}</span>
    </div>
  );
}
