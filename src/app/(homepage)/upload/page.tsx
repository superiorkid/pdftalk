import { Suspense } from "react";
import UploadNewDocumentForm from "./_components/upload-new-document-form";

const UploadDocumentPage = () => {
  return (
    <div>
      <div className="h-[100px] flex items-center">
        <h1 className="text-xl font-bold tracking-tight">
          Upload New Document
        </h1>
      </div>

      <UploadNewDocumentForm />
    </div>
  );
};

export default UploadDocumentPage;
