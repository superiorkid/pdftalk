"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFileUpload } from "@/hooks/use-file-upload";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  MAX_SIZE_IN_MB,
  MAX_UPLOAD_SIZE,
  type TUploadDocumentSchema,
  uploadDocumentSchema,
} from "./upload-document-schema";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const UploadNewDocumentForm = () => {
  const router = useRouter();

  const form = useForm<TUploadDocumentSchema>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      title: "",
      description: "",
      file: undefined,
      cover: undefined,
    },
  });

  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "application/pdf",
    maxSize: MAX_UPLOAD_SIZE,
    onFilesAdded(addedFiles) {
      const file = addedFiles.at(0)?.file;
      form.setValue("file", file as File);
    },
  });

  const onSubmit = (values: TUploadDocumentSchema) => {
    console.log(values);
  };

  useEffect(() => {
    const generateCover = async () => {
      if (!files[0]?.file) {
        form.setValue("cover", undefined);
        return;
      }

      const file = files[0].file;
      const pdf = await pdfjs.getDocument({
        url: URL.createObjectURL(file as File),
      }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const coverBase64 = canvas.toDataURL("image/png");
      const res = await fetch(coverBase64);
      const blob = await res.blob();
      const coverFile = new File([blob], "cover.png", { type: "image/png" });

      form.setValue("cover", coverFile);
    };

    generateCover();
  }, [files, form]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex gap-12">
            <div className="relative aspect-square w-[402px]">
              {/** biome-ignore lint/a11y/useFocusableInteractive: <explanation> */}
              {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
              {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
              <div
                role="button"
                onClick={openFileDialog}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px] h-full"
              >
                <input
                  {...getInputProps()}
                  className="sr-only"
                  aria-label="Upload file"
                />
                {files[0]?.file ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white">
                    <Document file={files[0].file}>
                      <Page pageNumber={1} width={250} />
                    </Document>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                    <div
                      className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                      aria-hidden="true"
                    >
                      <ImageUpIcon className="size-4 opacity-60" />
                    </div>
                    <p className="mb-1.5 text-sm font-medium">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Max size: {MAX_SIZE_IN_MB}MB
                    </p>
                  </div>
                )}
              </div>
              {files[0]?.file && (
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                    onClick={() => removeFile(files[0]?.id)}
                    aria-label="Remove file"
                  >
                    <XIcon className="size-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              variant="destructive"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UploadNewDocumentForm;
