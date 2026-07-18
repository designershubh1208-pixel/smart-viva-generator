"use client";

import { useState, useEffect } from "react";
import { UploadZone } from "@/components/dashboard/UploadZone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Brain, Clock } from "lucide-react";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface DashboardStats {
  recentSets: Array<{
    id: string;
    title: string;
    questions: number;
    difficulty: string;
    createdAt: string;
  }>;
  quickStats: {
    averageScore: number;
    topicsMastered: number;
  };
  weakTopics: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/dashboard/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Ready for your next viva? Upload new material or continue practicing.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>New Generation</CardTitle>
            <CardDescription>Upload files to extract topics and generate viva questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadZone />
          </CardContent>
        </Card>

        <AnalyticsDashboard userId="test-user-id" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Question Sets</h2>
        </div>
        
        {!stats ? (
          <div className="text-muted-foreground">Loading recent sets...</div>
        ) : stats.recentSets.length === 0 ? (
          <div className="text-muted-foreground bg-card p-6 rounded-xl border text-center">
            You haven't generated any viva sets yet. Upload a document above to get started!
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stats.recentSets.map((set, i) => (
              <Card key={set.id} onClick={() => router.push(`/viva/${set.id}`)} className="hover:border-primary/50 transition-colors group cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2" title={set.title}>{set.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4">
                    <span className="flex items-center"><Brain className="w-4 h-4 mr-1"/> {set.questions} Qs</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {formatDistanceToNow(new Date(set.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary">
                      {set.difficulty}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
