'use client';

import { VivaChat } from '@/components/viva/VivaChat';

export default function AiVivaPage() {
  // Use a mock user id for demo
  const userId = "test-user-id";

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Examiner</h1>
        <p className="text-muted-foreground mt-2">
          Experience an interactive, conversational Viva with dynamic difficulty adjustment.
        </p>
      </div>
      <VivaChat userId={userId} />
    </div>
  );
}
