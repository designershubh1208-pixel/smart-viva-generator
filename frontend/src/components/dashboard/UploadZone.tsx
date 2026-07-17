"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function UploadZone() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"]
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    // Send upload to backend
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("http://localhost:3001/uploads", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();

      toast.success("Viva Generated Successfully!", {
        description: "Your document has been analyzed and written questions are ready.",
        duration: 5000,
      });
      setFile(null);

      if (data.questionSetId) {
        router.push(`/viva/${data.questionSetId}`);
      }
    } catch {
      toast.error("Upload failed. Make sure the backend is running.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-200",
            isDragActive ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50 bg-card hover:bg-card/80"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <UploadCloud className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload your study material</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Drag and drop your PDF, DOCX, or TXT file here, or click to browse. We&apos;ll generate viva questions instantly.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <File className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-lg">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setFile(null)} disabled={uploading}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={uploading} className="w-full sm:w-auto">
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploading ? "Processing..." : "Generate Viva Questions"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
