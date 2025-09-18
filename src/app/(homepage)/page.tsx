import { UploadIcon } from "lucide-react";
import Link from "next/link";
import DocumentList from "./_components/document-list";

export default function Home() {
  return (
    <div className="grid grid-cols-5 gap-6 my-5">
      <div className="border-2 h-[475px] border-dashed hover:border-primary p-3.5 rounded-lg flex justify-center flex-col items-center text-center  hover:cursor-pointer hover:bg-zinc-100">
        <Link href="/upload" className="space-y-3">
          <div className="flex items-center flex-col space-y-2.5">
            <UploadIcon size={35} strokeWidth={2} />
            <h1 className="2xl:text-lg font-bold">Upload PDF</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Drop your PDF here or click to browse
          </p>
        </Link>
      </div>
      <DocumentList />
    </div>
  );
}
