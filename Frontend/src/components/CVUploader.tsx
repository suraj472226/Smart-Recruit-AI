import { FC, useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface CVUploaderProps {
  onCVsProcessed: (data: { processed_cvs: any[] }) => void;
  jdId: number;
}

const CVUploader: FC<CVUploaderProps> = ({ onCVsProcessed, jdId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file =>
      file.type === "text/plain" ||
      file.type === "application/pdf" ||
      file.type.includes("document")
    );

    if (validFiles.length !== files.length) {
      toast({
        title: "Some files were skipped",
        description: "Only text, PDF, or document files are supported.",
        variant: "destructive",
      });
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const processCvs = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);

    const formData = new FormData();
    uploadedFiles.forEach(file => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(`http://127.0.0.1:8000/process-cvs/${jdId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Full response from backend:", data); // Log full response
      console.log("Received processed CVs from backend:", data.processed_cvs); // Debug log
      onCVsProcessed(data);
      toast({
        title: "CVs Processed",
        description: "Candidate CVs successfully analyzed.",
      });
    } catch (error: any) {
      console.error("Error processing CVs:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process the CVs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Candidate CV Upload</h2>
        <p className="text-muted-foreground">Upload candidate CVs to match against the job description</p>
      </div>

      <Card
        className={`border-2 border-dashed transition-all ${isDragging ? "border-primary bg-primary/5" : "border-border"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload Candidate CVs</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Drag and drop your files here, or click the button below to browse files
          </p>

          <div className="flex items-center gap-4">
            <Button onClick={triggerFileInput}>
              <FileText className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
            <div className="text-xs text-muted-foreground">
              Supported formats: .txt, .pdf, .doc, .docx
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Uploaded Files ({uploadedFiles.length})</h3>
            <Button variant="ghost" size="sm" onClick={clearAllFiles}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          <div className="max-h-[300px] overflow-y-auto border border-border rounded-md divide-y">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={processCvs} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Analyze Candidate CVs
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVUploader;