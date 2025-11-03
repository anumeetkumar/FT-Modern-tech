import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  computeStatus,
  csvEscape,
  daysUntil,
  DEV_runCSVTests,
  FileKindIcon,
  formatBytes,
  formatDate,
  TagInput,
} from "@/lib/utils/superadmin/adminstrator";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  DOC_TYPE_OPTIONS,
  DocumentItem,
  FileKind,
} from "@/lib/types/superadmin";
import { cn } from "@/lib/utils"; // optional helper if you have it
import CloudUploadIcon from "@mui/icons-material/CloudUpload";


interface AddEditDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  openViewer: boolean;
  setOpenViewer: (open: boolean) => void;
  viewerDoc: DocumentItem | null;
  setViewerDoc: (doc: DocumentItem | null) => void;
  editingDocId: string | null;
  setEditingDocId: (id: string | null) => void;
  formName: string;
  setFormName: (name: string) => void;
  formExpiry: Date | undefined;
  setFormExpiry: (date: Date | undefined) => void;
  formTags: string[];
  setFormTags: (tags: string[]) => void;
  formFile: File | null;
  setFormFile: (file: File | null) => void;
  formNotes: string;
  setFormNotes: (notes: string) => void;
  formDocType: DocumentItem["docType"];
  setFormDocType: (type: DocumentItem["docType"]) => void;
  setDocs: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  resetForm: () => void;
  openView: (doc: DocumentItem) => void;

}

const AddEditDialog = ({
  openDialog,
  setOpenDialog,
  editingDocId,
  formName,
  setFormName,
  formExpiry,
  setFormExpiry,
  formTags,
  setFormTags,
  formFile,
  setFormFile,
  formNotes,
  setFormNotes,
  formDocType,
  setFormDocType,
  openView,
  setDocs,
  resetForm
}: AddEditDialogProps) => {


  const DropZone = () => {
    const [hover, setHover] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current?.click();
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setFormFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    function onDropFiles(files: FileList | null) {
      if (!files || !files.length) return;
      const f = files[0];
      setFormFile(f);
      if (!formName) setFormName(f.name);
    }

    function inferFileKind(file?: File | null): FileKind {
      if (!file) return "other";
      const mime = file.type;
      if (mime.includes("pdf")) return "pdf";
      if (mime.includes("image")) return "image";
      if (mime.includes("word") || file.name.endsWith(".docx")) return "doc";
      return "other";
    }



    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          onDropFiles(e.dataTransfer.files);
        }}
        className={cn(
          "group flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-8 text-center transition-all",
          hover
            ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-800"
            : "border-neutral-300 dark:border-neutral-600"
        )}
      >
        <CloudUploadIcon className="h-7 w-7 text-neutral-900 dark:text-neutral-100" />
        <div className="text-sm text-neutral-800 dark:text-neutral-200">
          Drag & drop your file here
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          PDF, Images, DOCX — up to 50 MB
        </div>

        {!formFile ? (
          <div className="mt-1 flex items-center justify-center">
            <button
              type="button"
              onClick={handleButtonClick}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100"
            >
              <UploadFileIcon className="h-4 w-4" />
              Choose file
            </button>
          </div>
        ) : (
          <div className="mt-1 flex items-center justify-center">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-700">
                  <FileKindIcon kind={inferFileKind(formFile)} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-neutral-800 truncate max-w-[150px] dark:text-neutral-200">
                    {formFile.name}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatBytes(formFile.size)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-red-100 hover:text-red-600 transition-colors dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-red-900 dark:hover:text-red-400"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <input
          aria-label="Upload file"
          ref={fileInputRef}
          type="file"
          onChange={(e) => onDropFiles(e.target.files)}
          className="hidden"
        />
      </div>
    );
  };

      function saveDoc() {
      if (!formName.trim()) return alert("Please provide a document name.");
      if (!formDocType) return alert("Please select a Document Type.");

      const base: Partial<DocumentItem> = {
        name: formName.trim(),
        expiry: formExpiry ?? null,
        tags: formTags,
        docType: formDocType,
      };
       function inferFileKind(file?: File | null): FileKind {
      if (!file) return "other";
      const mime = file.type;
      if (mime.includes("pdf")) return "pdf";
      if (mime.includes("image")) return "image";
      if (mime.includes("word") || file.name.endsWith(".docx")) return "doc";
      return "other";
    }

      if (editingDocId) {
        setDocs((prev) =>
          prev.map((d) => {
            if (d.id !== editingDocId) return d;
            let url = d.url;
            let size = d.size;
            let fileKind = d.fileKind;
            let version = d.version;
            if (formFile) {
              url = URL.createObjectURL(formFile);
              size = formFile.size;
              fileKind = inferFileKind(formFile);
              version = d.version + 1;
            }
            const expiry = base.expiry ?? null;
            return {
              ...d,
              name: base.name!,
              tags: base.tags!,
              url,
              size,
              fileKind,
              version,
              expiry,
              docType: base.docType!,
              status: computeStatus(expiry),
            };
          })
        );
      } else {
        if (!formFile) return alert("Please upload a file.");
        const fileKind = inferFileKind(formFile);
        const url = URL.createObjectURL(formFile);
        const expiry = base.expiry ?? null;
        const newDoc: DocumentItem = {
          id: crypto.randomUUID(),
          name: base.name!,
          tags: base.tags!,
          fileKind,
          size: formFile.size,
          uploadedAt: new Date(),
          expiry,
          status: computeStatus(expiry),
          version: 1,
          url,
          docType: base.docType!,
        };
        setDocs((prev) => [newDoc, ...prev]);

        // Show preview after upload
        setTimeout(() => {
          openView(newDoc);
        }, 100);
      }

      setOpenDialog(false);
      resetForm();
    }
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-2xl dark:bg-neutral-900 dark:border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-900 dark:text-neutral-100">
            {editingDocId ? "Edit Document" : "Add Document"}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 dark:text-neutral-400">
            Document Type, name, file, expiry, tags — clean and compliant.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-neutral-800 dark:text-neutral-200">
                Document Type
              </Label>
              <Select
                value={formDocType}
                onValueChange={(v) =>
                  setFormDocType(v as DocumentItem["docType"])
                }
              >
                <SelectTrigger className="rounded-xl border-neutral-300 text-neutral-900 focus-visible:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="z-[99999] rounded-2xl border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900">
                  {DOC_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="doc-name"
                className="text-neutral-800 dark:text-neutral-200"
              >
                Name
              </Label>
              <div className="flex items-center gap-2">
                <DriveFileRenameOutlineIcon className="text-neutral-700 dark:text-neutral-400" />
                <Input
                  id="doc-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Insurance Policy 2025.pdf"
                  className="rounded-xl border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-800 dark:text-neutral-200">
                Expiry (optional)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl border-neutral-300 text-left font-normal text-neutral-900 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <CalendarMonthIcon className="mr-2" />
                    {formExpiry ? (
                      formatDate(formExpiry)
                    ) : (
                      <span className="text-neutral-400 dark:text-neutral-500">
                        Select date
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="z-[99999] w-auto rounded-2xl border-neutral-200 p-0 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <Calendar
                    mode="single"
                    selected={formExpiry}
                    onSelect={setFormExpiry}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-800 dark:text-neutral-200">
                Tags
              </Label>
              <TagInput value={formTags} onChange={setFormTags} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-neutral-800 dark:text-neutral-200">
                Upload
              </Label>
              <DropZone />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-800 dark:text-neutral-200">
                Notes (optional)
              </Label>
              <Textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Any context for admins…"
                className="min-h-[88px] rounded-xl border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpenDialog(false);
              resetForm();
            }}
            className="rounded-xl border-neutral-300 text-neutral-900 hover:bg-white dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
          >
            Cancel
          </Button>
          <Button
            onClick={saveDoc}
            className="rounded-xl bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100"
          >
            {editingDocId ? "Save changes" : "Add document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditDialog;
