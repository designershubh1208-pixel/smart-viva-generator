"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface HistorySession {
  id: string;
  subject: string;
  topic: string;
  date: string;
  totalQuestions: number;
  score: string;
  status: string;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/history")
      .then(res => res.json())
      .then(data => {
        setSessions(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Practice History</h1>
        <p className="text-muted-foreground">Review your past performance and identify areas for improvement.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground p-4 text-center">Loading history...</div>
          ) : sessions.length === 0 ? (
             <div className="text-muted-foreground p-4 text-center">No practice history available. Generate a viva to begin!</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject / Topic</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      <div>{session.topic}</div>
                      <div className="text-xs text-muted-foreground font-normal">{session.subject}</div>
                    </TableCell>
                    <TableCell>{formatDistanceToNow(new Date(session.date), { addSuffix: true })}</TableCell>
                    <TableCell>{session.score}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.status === 'Completed' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                        {session.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/viva/${session.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        {session.status === 'Completed' ? 'Review' : 'Practice'}
                        <Play className="w-4 h-4 ml-2" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
