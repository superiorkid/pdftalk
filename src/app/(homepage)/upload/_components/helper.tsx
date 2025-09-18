"use client";

import dynamic from "next/dynamic";

const UploadNewDocumentForm = dynamic(
  () => import("./upload-new-document-form"),
  { ssr: false },
);

const Helper = () => {
  return <UploadNewDocumentForm />;
};

export default Helper;
