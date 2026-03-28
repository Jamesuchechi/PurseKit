import Papa from "papaparse";
import * as XLSX from "xlsx";

/**
 * Robust CSV and JSON parsing utility using PapaParse.
 */

export interface ParsedData {
  data: Record<string, unknown>[];
  columns: string[];
  types: Record<string, "string" | "number" | "boolean" | "date">;
}

export function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      // Auto-detect delimiter: comma, semicolon, tab, pipe
      delimitersToGuess: [",", ";", "\t", "|"],
      complete: (results) => {
        const data = results.data as Record<string, unknown>[];
        const columns = results.meta.fields || [];
        if (data.length === 0 || columns.length === 0) {
          reject(new Error("CSV file is empty or has no headers."));
          return;
        }
        const types = inferColumnTypes(data, columns);
        resolve({ data, columns, types });
      },
      error: (error: Error) => reject(error),
    });
  });
}

export function parseJSON(jsonString: string): ParsedData {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      throw new Error("JSON data must be an array of objects.");
    }
    const columns = Object.keys(data[0] || {});
    const types = inferColumnTypes(data, columns);
    return { data, columns, types };
  } catch (error) {
    throw new Error(error instanceof Error ? `Failed to parse JSON: ${error.message}` : "Failed to parse JSON string.");
  }
}

export async function parseExcel(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];
        
        if (jsonData.length === 0) {
          throw new Error("Excel file is empty.");
        }

        const columns = Object.keys(jsonData[0]);
        const types = inferColumnTypes(jsonData, columns);
        resolve({ data: jsonData, columns, types });
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Failed to parse Excel file."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
}

export function inferColumnTypes(data: Record<string, unknown>[], columns: string[]): Record<string, "string" | "number" | "boolean" | "date"> {
  const types: Record<string, "string" | "number" | "boolean" | "date"> = {};

  columns.forEach((col) => {
    const values = data.map((d) => d[col]).filter((v) => v !== null && v !== undefined);
    const firstValue = values[0];

    if (typeof firstValue === "number") {
      types[col] = "number";
    } else if (typeof firstValue === "boolean") {
      types[col] = "boolean";
    } else if (firstValue instanceof Date || (typeof firstValue === "string" && !isNaN(Date.parse(firstValue)) && isNaN(Number(firstValue)))) {
      types[col] = "date";
    } else {
      types[col] = "string";
    }
  });

  return types;
}
