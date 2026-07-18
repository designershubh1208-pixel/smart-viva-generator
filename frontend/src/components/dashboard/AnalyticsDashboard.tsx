'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DashboardData {
  overallAccuracy: number;
  weakestSubject: string;
  mostIncorrectTopic: string;
  avgThinkingTimeSec: number;
  confidenceScore: number;
  improvement: string;
  heatmap: { date: string; count: number }[];
}

export function AnalyticsDashboard({ userId }: { userId: string }) {
  const [data, setData] = useState<DashboardData | null>(null);
  
  useEffect(() => {
    fetch(`http://localhost:3001/analytics/${userId}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, [userId]);

  if (!data) {
    return <div className="p-8 text-center animate-pulse">Loading Analytics...</div>;
  }

  // Calculate heatmap color intensity based on count
  const maxCount = Math.max(...data.heatmap.map(h => h.count), 1);
  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-muted';
    const ratio = count / maxCount;
    if (ratio < 0.3) return 'bg-primary/30';
    if (ratio < 0.6) return 'bg-primary/60';
    return 'bg-primary';
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overallAccuracy}%</div>
            <Progress value={data.overallAccuracy} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Thinking Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgThinkingTimeSec} sec</div>
            <p className="text-xs text-muted-foreground mt-2">Per question</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weakest Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.mostIncorrectTopic}</div>
            <p className="text-xs text-muted-foreground mt-2">Subject: {data.weakestSubject}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{data.improvement}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold">Confidence:</span>
              <Progress value={data.confidenceScore} className="h-2 flex-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.heatmap.map((h, i) => (
              <div 
                key={i} 
                title={`${h.count} questions on ${h.date}`}
                className={`w-4 h-4 rounded-sm ${getIntensity(h.count)}`} 
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-muted rounded-sm" />
              <div className="w-3 h-3 bg-primary/30 rounded-sm" />
              <div className="w-3 h-3 bg-primary/60 rounded-sm" />
              <div className="w-3 h-3 bg-primary rounded-sm" />
            </div>
            <span>More</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
