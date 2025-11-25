import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  FileUpload as FileUploadIcon,
  OpenInNew as ExternalLinkIcon,
  Undo as UndoIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

import { Progress } from "../ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";

type Step = "config" | "upload" | "review";

interface BulkUploadWizardProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  configStepContent: React.ReactNode; // Custom content for the config step
  sampleFileName: string;
  sampleDataGenerator: () => string[];
  requiredColumns: readonly string[];
  onCommit: (data: T[]) => void;
  onCancel: () => void;
  parser: (csv: string) => Record<string, string>[];
  validator: (row: Record<string, string>) => { isValid: boolean; errors: string[] };
  mapToCommitData: (row: Record<string, string>) => T;
}

const BulkUploadWizard = <T,>({
  isOpen,
  onOpenChange,
  title,
  description,
  configStepContent,
  sampleFileName,
  sampleDataGenerator,
  requiredColumns,
  onCommit,
  onCancel,
  parser,
  validator,
  mapToCommitData,
}: BulkUploadWizardProps<T>) => {
  const [step, setStep] = useState<Step>("config");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validRows = parsedRows.filter((row) => validator(row).isValid);
  const invalidRows = parsedRows.filter((row) => !validator(row).isValid);

  const downloadSampleFile = () => {
    const sampleData = sampleDataGenerator();
    const blob = new Blob([sampleData.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = sampleFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setLoading(true);
    setFileError(null);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onloadstart = () => setUploadProgress(10);
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 90) + 10; // 10% for start, 90% for read
        setUploadProgress(progress);
      }
    };
    reader.onload = (e) => {
      try {
        const csvContent = String(e.target?.result || "");
        const parsed = parser(csvContent);
        setParsedRows(parsed);
        setUploadProgress(100);
        setStep("review");
      } catch (error) {
        console.error("File parsing error:", error);
        setFileError("Failed to parse file. Please ensure it's a valid CSV.");
        setUploadProgress(0);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setFileError("Failed to read file.");
      setLoading(false);
      setUploadProgress(0);
    };
    reader.readAsText(file);
  };

  const handleCommit = async () => {
    setLoading(true);
    setFileError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const dataToCommit = validRows.map(mapToCommitData);
      onCommit(dataToCommit);
      onOpenChange(false); // Close dialog on successful commit
    } catch (error) {
      setFileError("Failed to import data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("config");
    setLoading(false);
    setFileError(null);
    setParsedRows([]);
    setUploadProgress(0);
    onOpenChange(false);
    onCancel();
  };

  const allColumns = Array.from(
    new Set(parsedRows.flatMap((row) => Object.keys(row)))
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl lg:max-w-6xl bg-background border-border flex flex-col h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUploadIcon fontSize="small" />
            {title}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">{description}</p>
        </DialogHeader>

        {/* Stepper */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between">
            {/* Step 1 - Config */}
            <div
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300",
                step === "config"
                  ? "border-primary bg-primary/10 text-primary shadow-md scale-105"
                  : "border-border bg-background text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
                  step === "config"
                    ? "bg-primary text-background"
                    : "bg-foreground/5 text-foreground"
                )}
              >
                1
              </div>
              <div className="text-center text-xs font-medium">Configure</div>
            </div>

            {/* Connector */}
            <div className="grow h-1 bg-border rounded mx-2">
              <div
                className={cn(
                  "h-full bg-primary rounded transition-all duration-500",
                  ["upload", "review"].includes(step) ? "w-full" : "w-0"
                )}
              />
            </div>

            {/* Step 2 - Upload */}
            <div
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300",
                step === "upload"
                  ? "border-primary bg-primary/10 text-primary shadow-md scale-105"
                  : step === "review"
                  ? "border-success bg-success/10 text-success shadow-md"
                  : "border-border bg-background text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
                  step === "upload"
                    ? "bg-primary text-background"
                    : step === "review"
                    ? "bg-success text-white"
                    : "bg-foreground/5 text-foreground"
                )}
              >
                {step === "review" ? <CheckCircleIcon fontSize="small" /> : "2"}
              </div>
              <div className="text-center text-xs font-medium">Upload</div>
            </div>

            {/* Connector */}
            <div className="grow h-1 bg-border rounded mx-2">
              <div
                className={cn(
                  "h-full bg-primary rounded transition-all duration-500",
                  step === "review" ? "w-full" : "w-0"
                )}
              />
            </div>

            {/* Step 3 - Review */}
            <div
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300",
                step === "review"
                  ? "border-primary bg-primary/10 text-primary shadow-md scale-105"
                  : "border-border bg-background text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
                  step === "review"
                    ? "bg-primary text-background"
                    : "bg-foreground/5 text-foreground"
                )}
              >
                3
              </div>
              <div className="text-center text-xs font-medium">Review</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grow min-h-0 overflow-y-auto p-4 border rounded-md bg-foreground/5">
          {step === "config" && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <FileUploadIcon className="text-primary" fontSize="large" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {configStepContent} {/* Custom config content */}

                {/* Sample File */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <DownloadIcon className="text-accent" />
                    Sample File
                  </Label>
                  <Button
                    variant="outline"
                    onClick={downloadSampleFile}
                    className="w-full gap-2 h-12 border-2 border-dashed border-border hover:border-accent hover:bg-accent/10"
                  >
                    <DownloadIcon fontSize="small" />
                    Download Sample CSV
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Download template with required columns and sample data
                  </p>
                </div>
              </div>

              {/* Required Columns */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">
                  Required Columns:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-primary text-sm">
                  {requiredColumns.map((col, index) => (
                    <div key={col} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/20 rounded text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <span>{col}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === "upload" && (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div
                className="w-full max-w-lg p-8 border-2 border-dashed border-primary/50 rounded-lg text-center cursor-pointer hover:border-primary transition-colors duration-200"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <UploadIcon className="text-primary mb-4" style={{ fontSize: 48 }} />
                <p className="text-lg font-semibold text-foreground">
                  Drag & drop your CSV file here, or click to select
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Only .csv files are supported
                </p>
              </div>
              {loading && (
                <div className="w-full max-w-lg space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-center text-sm text-muted-foreground">
                    Processing file... {uploadProgress}%
                  </p>
                </div>
              )}
              {fileError && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                  <CancelIcon fontSize="small" />
                  {fileError}
                </div>
              )}
            </div>
          )}

          {step === "review" && (
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold">Review Data</h4>
                <div className="flex gap-2">
                  <span className="text-sm text-green-600 font-medium">
                    {validRows.length} Valid
                  </span>
                  <span className="text-sm text-red-600 font-medium">
                    {invalidRows.length} Invalid
                  </span>
                </div>
              </div>
              {fileError && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                  <CancelIcon fontSize="small" />
                  {fileError}
                </div>
              )}
              {parsedRows.length > 0 ? (
                <ScrollArea className="grow border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {allColumns.map((col) => (
                          <TableHead key={col}>{col}</TableHead>
                        ))}
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedRows.map((row, index) => {
                        const { isValid, errors } = validator(row);
                        return (
                          <TableRow
                            key={index}
                            className={cn(
                              !isValid && "bg-red-100/50 hover:bg-red-100/50"
                            )}
                          >
                            {allColumns.map((col) => (
                              <TableCell key={col} className="max-w-[150px] truncate">
                                {row[col] || "-"}
                              </TableCell>
                            ))}
                            <TableCell className="text-right">
                              {isValid ? (
                                <span className="text-green-600">Valid</span>
                              ) : (
                                <span
                                  className="text-red-600 cursor-help"
                                  title={errors.join("\n")}
                                >
                                  Invalid ({errors.length})
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No data to display. Please upload a CSV file.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <DialogFooter className="flex justify-between items-center pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            {step !== "config" && (
              <Button
                variant="outline"
                onClick={() =>
                  setStep(step === "review" ? "upload" : "config")
                }
                disabled={loading}
                className="gap-2"
              >
                <UndoIcon fontSize="small" />
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>

            {step === "config" && (
              <Button
                onClick={() => setStep("upload")}
              >
                Continue
                <ExternalLinkIcon fontSize="small" />
              </Button>
            )}

            {step === "upload" && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <UploadIcon fontSize="small" />
                {loading ? "Uploading..." : "Select File"}
              </Button>
            )}

            {step === "review" && (
              <Button
                onClick={handleCommit}
                disabled={validRows.length === 0 || loading}
                className="gap-2"
              >
                {loading ? (
                  <RefreshIcon fontSize="small" className="animate-spin" />
                ) : (
                  <CheckCircleIcon fontSize="small" />
                )}
                {loading
                  ? "Importing..."
                  : `Import ${validRows.length} Item(s)`}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadWizard;