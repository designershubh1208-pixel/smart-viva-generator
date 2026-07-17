import { TeacherSidebar } from "@/components/layout/TeacherSidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <TeacherSidebar />
      <main className="flex-1 overflow-y-auto focus:outline-none">
        <div className="py-6 px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
