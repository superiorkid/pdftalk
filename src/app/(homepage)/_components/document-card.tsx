import type { Prisma } from "@prisma/client";
import { formatDistance } from "date-fns";
import { CalendarIcon, DownloadIcon, FileIcon, TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface DocumentCardProps {
  document: Prisma.DocumentGetPayload<{ include: { category: true } }>;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  const isAvailable = document.status === "READY";

  return (
    <div
      className={`group border rounded-xl overflow-hidden bg-white shadow-sm transition-shadow ${
        isAvailable ? "hover:shadow-lg" : "opacity-50 cursor-not-allowed"
      }`}
      aria-disabled={!isAvailable}
    >
      <div className="relative h-[301px] overflow-hidden">
        {document.coverPath ? (
          <Image
            fill
            src={`/api/documents/${document.id}/cover`}
            alt={`${document.title} cover`}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform ${isAvailable ? "group-hover:scale-105" : ""}`}
          />
        ) : (
          <FileIcon size={35} strokeWidth={2} />
        )}

        <Badge
          className="absolute top-3 left-3 font-semibold px-2.5 py-1.5 rounded-lg"
          variant="secondary"
        >
          PDF
        </Badge>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <h1 className="text-lg font-semibold leading-tight tracking-tight hover:text-primary transition-colors line-clamp-1">
          {isAvailable ? (
            <Link href={`/documents/${document.id}`}>{document.title}</Link>
          ) : (
            <span title="Document is not available">{document.title}</span>
          )}
        </h1>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {document.descrption || "No description provided"}
        </p>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-muted-foreground font-medium">
          <p className="flex items-center gap-1.5">
            <DownloadIcon size={13} strokeWidth={2} />
            <span>
              {new Intl.NumberFormat("en", {
                style: "unit",
                unit: "megabyte",
                unitDisplay: "short",
                maximumFractionDigits: 2,
              }).format(document.fileSize / (1024 * 1024))}
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <FileIcon size={13} strokeWidth={2} />
            <span>
              {document.pageCount} Page{document.pageCount > 1 && "s"}
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <CalendarIcon size={13} strokeWidth={2} />
            <span>
              {formatDistance(new Date(document.createdAt), new Date(), {
                addSuffix: true,
              })}
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <TagIcon size={13} strokeWidth={2} />
            <span>{document.category.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
