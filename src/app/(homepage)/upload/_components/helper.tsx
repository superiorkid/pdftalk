"use client";

import { Loader2Icon } from "lucide-react";
import dynamic from "next/dynamic";

const UploadNewDocumentForm = dynamic(
  () => import("./upload-new-document-form"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center mt-5">
        <Loader2Icon size={35} strokeWidth={2} className="animate-spin" />
      </div>
    ),
  },
);

const Helper = () => {
  return <UploadNewDocumentForm />;
};

export default Helper;
