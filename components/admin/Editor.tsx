// components/admin/Editor.tsx
"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useId } from "react";

interface RichTextEditorProps {
  value: string;
  onEditorChange: (content: string) => void;
  id?: string;
}

export default function RichTextEditor({
  value,
  onEditorChange,
  id,
}: RichTextEditorProps) {
  const autoId = useId();
  return (
    <Editor
      id={id ?? autoId} // ensure uniqueness
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // API key in .env.local
      value={value}
      init={{
        licenseKey: "gpl",
        height: 300,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
      onEditorChange={onEditorChange}
    />
  );
}
