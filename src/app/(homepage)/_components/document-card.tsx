import { CalendarIcon, DownloadIcon, FileIcon, TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const DocumentCard = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="h-[301px] flex justify-center items-center relative">
        <Image
          fill
          src="https://images.unsplash.com/photo-1706271948813-4d2c904af4d8?q=80&w=741&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="document cover"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />

        <Badge
          className="absolute top-3.5 right-3.5 font-bold"
          variant="secondary"
        >
          PDF
        </Badge>
      </div>
      <div className="p-3 border-t space-y-3">
        <h1 className="text-lg font-bold tracking-tight leading-tight hover:cursor-pointer hover:text-primary">
          <Link href="/1234-1234-1234">Machine Learning Fundamentals</Link>
        </h1>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
          repellat quia nisi adipisci laborum ad iure asperiores labore nulla
          id. Et natus fugit, error inventore impedit similique at velit
          consequatur necessitatibus. Impedit, ea? Earum, architecto quo
          distinctio ipsum quibusdam assumenda ex laudantium quisquam, vitae
          saepe modi quae veniam excepturi quas, fugiat officiis impedit magnam
          sit unde rem nulla doloribus aliquam qui ipsam? Hic soluta a suscipit
          odit, praesentium consequatur fugiat quaerat culpa quia voluptate,
          incidunt natus animi ea sequi ducimus. Deleniti accusamus velit fuga
          iusto voluptatibus voluptas, nulla ratione, itaque earum ipsum ad
          eaque quidem dolor optio quis aliquam molestiae?
        </p>

        <div className="grid grid-cols-2 gap-x-1 gap-y-2 text-xs text-muted-foreground font-medium">
          <p className="flex items-center gap-1.5">
            <DownloadIcon size={12} strokeWidth={2} />
            <span>2.4MB</span>
          </p>
          <p className="flex items-center gap-1.5">
            <FileIcon size={12} strokeWidth={2} />
            <span>45 Pages</span>
          </p>
          <p className="flex items-center gap-1.5">
            <CalendarIcon size={12} strokeWidth={2} />
            <span>2 hours ago</span>
          </p>
          <p className="flex items-center gap-1.5">
            <TagIcon size={12} strokeWidth={2} />
            <span>ML</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
