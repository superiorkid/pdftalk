import z from "zod";

export const MAX_SIZE_IN_MB = 10;
export const MAX_UPLOAD_SIZE = 1024 * 1024 * MAX_SIZE_IN_MB;
export const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const uploadDocumentSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_UPLOAD_SIZE,
      "File size must be less than 10MB",
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "File must be a PDF",
    ),
  cover: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      "Cover must be less than 2MB",
    )
    .refine(
      (file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type),
      "Cover must be an image (PNG, JPG, or WebP)",
    )
    .optional(),
});
export type TUploadDocumentSchema = z.infer<typeof uploadDocumentSchema>;
