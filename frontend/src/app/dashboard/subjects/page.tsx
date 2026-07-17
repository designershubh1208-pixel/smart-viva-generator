"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface SubjectData {
  id: string;
  name: string;
  description: string;
  questionSetsCount: number;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/subjects")
      .then(res => res.json())
      .then(data => {
        setSubjects(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subjects & Question Banks</h1>
        <p className="text-muted-foreground">Browse all available question sets by subject.</p>
      </div>
      
      {isLoading ? (
        <div className="text-muted-foreground">Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div className="text-muted-foreground bg-card p-6 rounded-xl border text-center">
          No subjects found. Upload a document to generate your first subject!
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {subject.name}
                </CardTitle>
                <CardDescription>{subject.questionSetsCount} Question Banks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{subject.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
