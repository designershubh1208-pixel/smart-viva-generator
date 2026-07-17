"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Users, FileStack, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const questionBanks = [
  { id: "1", title: "Computer Networks Unit 1", questions: 50, author: "System", date: "2023-10-25" },
  { id: "2", title: "DBMS Complete Syllabus", questions: 120, author: "Dr. Smith", date: "2023-10-24" },
  { id: "3", title: "OS Scheduling Algorithms", questions: 35, author: "Dr. Smith", date: "2023-10-22" },
];

export default function TeacherOverview() {
  const handleExport = (id: string) => {
    // Simulating print dialog for PDF generation
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto print:p-0">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Manage question banks, track student analytics, and export materials.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 print:hidden">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Total Question Banks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold">12</span>
              <FileStack className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold">148</span>
              <Users className="w-8 h-8 text-secondary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Avg. Class Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold">76%</span>
              <TrendingUp className="w-8 h-8 text-accent/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardHeader className="print:hidden">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Recent Question Banks</CardTitle>
              <CardDescription>Generated sets available for export</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search banks..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right print:hidden">Export</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questionBanks.map((bank) => (
                <TableRow key={bank.id}>
                  <TableCell className="font-medium">{bank.title}</TableCell>
                  <TableCell>{bank.author}</TableCell>
                  <TableCell>{bank.questions}</TableCell>
                  <TableCell>{bank.date}</TableCell>
                  <TableCell className="text-right print:hidden">
                    <Button variant="outline" size="sm" onClick={() => handleExport(bank.id)}>
                      <Download className="w-4 h-4 mr-2" />
                      PDF / DOCX
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
