"use client";

import * as React from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface AttachedFile {
  name: string;
  content: string;
  size: number;
  type: string;
}

export function useFileAttachment() {
  const [attachments, setAttachments] = React.useState<AttachedFile[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setError(null);

    const newAttachments: AttachedFile[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File ${file.name} exceeds 5MB limit.`);
        continue;
      }
      
      try {
        const isImage = file.type.startsWith("image/");
        let content: string;
        
        if (isImage) {
          content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        } else {
          content = await file.text();
        }

        newAttachments.push({
          name: file.name,
          size: file.size,
          type: file.type,
          content
        });
      } catch {
        setError(`Failed to read ${file.name}`);
      }
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    // reset input
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const clearAttachments = () => setAttachments([]);

  return {
    attachments,
    handleUpload,
    removeAttachment,
    clearAttachments,
    error,
    setError
  };
}
