import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root w-full min-h-screen bg-[#0a0a0a] text-white">
      {children}
    </div>
  );
}
