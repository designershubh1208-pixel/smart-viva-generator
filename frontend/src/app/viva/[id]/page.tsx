import { MockViva } from "@/components/viva/MockViva";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function VivaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto focus:outline-none bg-grid-pattern">
        <div className="py-8 px-8">
          <MockViva setId={id} />
        </div>
      </main>
    </div>
  );
}
