"use client";

import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  Upload as UploadIcon,
  FileUpload as FileUploadIcon,
  CloudUpload as CloudUploadIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

// Types
import { BulkUploadDeviceData, DeviceType } from "@/lib/types/devices";

interface BulkUploadDeviceDialogProps {
  onSubmit: (data: BulkUploadDeviceData[]) => Promise<void>;
  deviceTypes: DeviceType[];
}

interface ParsedDevice extends BulkUploadDeviceData {
  row: number;
  errors: string[];
}

export function BulkUploadDeviceDialog({
  onSubmit,
  deviceTypes,
}: BulkUploadDeviceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "manual">("file");
  const [parsedDevices, setParsedDevices] = useState<ParsedDevice[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [manualData, setManualData] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = async (file: File) => {
    try {
      const text = await file.text();
      parseCSVData(text);
    } catch (error) {
      toast.error("Failed to read file");
      console.error("File parsing error:", error);
    }
  };

  const parseManualData = () => {
    parseCSVData(manualData);
  };

  const parseCSVData = (csvText: string) => {
    const lines = csvText.trim().split("\n");
    const devices: ParsedDevice[] = [];

    lines.forEach((line, index) => {
      const row = index + 1;
      const columns = line.split(",").map((col) => col.trim());

      if (columns.length < 2) {
        return; // Skip empty or incomplete lines
      }

      const device: ParsedDevice = {
        imei: columns[0] || "",
        deviceType: columns[1] || "",
        sim: columns[2] || undefined,
        imsi: columns[3] || undefined,
        iccid: columns[4] || undefined,
        simProvider: columns[5] || undefined,
        row,
        errors: [],
      };

      // Validation
      if (!device.imei || device.imei.length < 15) {
        device.errors.push("Invalid IMEI (must be at least 15 characters)");
      }
      if (!device.deviceType) {
        device.errors.push("Device type is required");
      }
      if (
        device.deviceType &&
        !deviceTypes.find(
          (dt) => dt.name.toLowerCase() === device.deviceType.toLowerCase()
        )
      ) {
        device.errors.push("Unknown device type");
      }

      devices.push(device);
    });

    setParsedDevices(devices);
  };

  const handleSubmit = async () => {
    const validDevices = parsedDevices.filter(
      (device) => device.errors.length === 0
    );

    if (validDevices.length === 0) {
      toast.error("No valid devices to upload");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(validDevices);
      toast.success(`Successfully uploaded ${validDevices.length} devices!`);
      resetForm();
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to upload devices. Please try again.");
      console.error("Bulk upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setManualData("");
    setParsedDevices([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "IMEI,DeviceType,SIM,IMSI,ICCID,SIMProvider\n123456789012345,GPS Tracker,+1234567890,12345678901234567890,1234567890123456789,Verizon\n";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "device_upload_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const validDevicesCount = parsedDevices.filter(
    (device) => device.errors.length === 0
  ).length;
  const invalidDevicesCount = parsedDevices.filter(
    (device) => device.errors.length > 0
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
        >
          <UploadIcon className="w-4 h-4 mr-2" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Devices</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Mode Selector */}
          <div className="flex space-x-4">
            <Button
              variant={uploadMode === "file" ? "default" : "outline"}
              onClick={() => setUploadMode("file")}
              className="flex-1"
            >
              <FileUploadIcon className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Button
              variant={uploadMode === "manual" ? "default" : "outline"}
              onClick={() => setUploadMode("manual")}
              className="flex-1"
            >
              Manual Entry
            </Button>
          </div>

          {/* Template Download */}
          <div className="text-center">
            <Button variant="ghost" onClick={downloadTemplate} size="sm">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>
          </div>

          {/* File Upload Mode */}
          {uploadMode === "file" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Upload CSV File</Label>
                <div className="mt-2">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  CSV format: IMEI, DeviceType, SIM (optional), IMSI (optional),
                  ICCID (optional), SIMProvider (optional)
                </p>
              </div>
            </div>
          )}

          {/* Manual Entry Mode */}
          {uploadMode === "manual" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-data">Manual Data Entry</Label>
                <Textarea
                  id="manual-data"
                  placeholder="Enter CSV data, one device per line:&#10;123456789012345,GPS Tracker,+1234567890,12345678901234567890,1234567890123456789,Verizon&#10;234567890123456,Vehicle Tracker,+2345678901,,,AT&T"
                  value={manualData}
                  onChange={(e) => setManualData(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
              </div>
              <Button onClick={parseManualData} variant="outline">
                Parse Data
              </Button>
            </div>
          )}

          {/* Preview of Parsed Devices */}
          {parsedDevices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Preview ({parsedDevices.length} devices)</span>
                  <div className="flex space-x-2">
                    {validDevicesCount > 0 && (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        <CheckIcon className="w-3 h-3 mr-1" />
                        {validDevicesCount} valid
                      </Badge>
                    )}
                    {invalidDevicesCount > 0 && (
                      <Badge variant="destructive">
                        <ErrorIcon className="w-3 h-3 mr-1" />
                        {invalidDevicesCount} errors
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {parsedDevices.map((device, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          device.errors.length > 0
                            ? "border-red-200 bg-red-50"
                            : "border-green-200 bg-green-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">
                              Row {device.row}: {device.imei}
                            </div>
                            <div className="text-sm text-gray-600">
                              Type: {device.deviceType}
                              {device.sim && ` | SIM: ${device.sim}`}
                              {device.simProvider &&
                                ` | Provider: ${device.simProvider}`}
                            </div>
                          </div>
                          <div className="ml-2">
                            {device.errors.length === 0 ? (
                              <CheckIcon className="w-5 h-5 text-green-600" />
                            ) : (
                              <ErrorIcon className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        </div>
                        {device.errors.length > 0 && (
                          <div className="mt-2 text-sm text-red-600">
                            {device.errors.map((error, errorIndex) => (
                              <div key={errorIndex}>• {error}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              setIsOpen(false);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || validDevicesCount === 0}
          >
            {isSubmitting
              ? "Uploading..."
              : `Upload ${validDevicesCount} Devices`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
