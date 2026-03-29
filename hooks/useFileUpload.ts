"use client";

import * as React from "react";
import { parseCSV, parseJSON, parseExcel, type ParsedData } from "@/lib/csv-parser";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_ROW_COUNT = 50_000;
const SUPPORTED_EXTENSIONS = [".csv", ".json", ".xlsx", ".xls"];

/**
 * Hook for handling file selection and automatic parsing (CSV/JSON/Excel).
 * Enforces: max 10MB, max 50k rows, supported formats only.
 */
export function useFileUpload() {
  const [file, setFile] = React.useState<File | null>(null);
  const [parsedData, setParsedData] = React.useState<ParsedData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Accepts both a ChangeEvent (standard file input) or a raw File (drag-and-drop)
  const upload = async (input: React.ChangeEvent<HTMLInputElement> | File) => {
    let selectedFile: File | undefined;

    if (input instanceof File) {
      selectedFile = input;
    } else {
      selectedFile = input.target.files?.[0];
    }

    if (!selectedFile) return;

    // --- Pre-parse validation ---
    const ext = `.${selectedFile.name.split(".").pop()?.toLowerCase()}`;
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported format "${ext}". Please upload CSV, JSON, or Excel (.xlsx/.xls).`);
      return;
    }

    if (selectedFile.size === 0) {
      setError("The selected file is empty.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError(
        `File is too large (${(selectedFile.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 10 MB.`
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setFile(selectedFile);

    try {
      let result: ParsedData;

      if (ext === ".csv") {
        result = await parseCSV(selectedFile);
      } else if (ext === ".json") {
        const text = await selectedFile.text();
        result = parseJSON(text);
      } else {
        // .xlsx or .xls
        result = await parseExcel(selectedFile);
      }

      // --- Post-parse validation ---
      if (result.data.length === 0) {
        throw new Error("The file contains no data rows.");
      }
      if (result.data.length > MAX_ROW_COUNT) {
        throw new Error(
          `File has ${result.data.length.toLocaleString()} rows. Maximum allowed is ${MAX_ROW_COUNT.toLocaleString()} rows.`
        );
      }
      if (result.columns.length === 0) {
        throw new Error("No columns detected. Ensure the file has a header row.");
      }

      setParsedData(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process file.";
      setError(errorMessage);
      setFile(null);
      setParsedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setParsedData(null);
    setError(null);
  };

  return { file, parsedData, error, isLoading, upload, reset, setParsedData };
}
