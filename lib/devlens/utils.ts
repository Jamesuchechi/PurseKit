/**
 * Heuristic-based code language detection.
 */
export function detectCodeLanguage(code: string): string {
  const trimmed = code.trim();

  // ── 1. React & JSX/TSX: must have explicit signals ──
  const isReact =
    /import\s+.*\s+from\s+['"]react['"]/i.test(trimmed) ||
    trimmed.includes("useState") ||
    trimmed.includes("useEffect") ||
    trimmed.includes("useRef") ||
    trimmed.includes("useCallback") ||
    trimmed.includes("useMemo") ||
    /export\s+default\s+function\s+[A-Z]/.test(trimmed) ||
    /const\s+[A-Z][A-Za-z]*\s*=\s*\(/.test(trimmed) ||
    /return\s*\(\s*</.test(trimmed);

  if (isReact) return "react";

  // ── 2. C / C++ (High priority because of #include vs HTML confusion) ──
  if (
    trimmed.includes("#include") ||
    /int\s+main\s*\(/.test(trimmed) ||
    trimmed.includes("std::") ||
    (trimmed.includes("printf(") && !trimmed.includes("console.log")) ||
    trimmed.includes("cout <<")
  ) {
    return "cpp";
  }

  // ── 3. HTML: full documents or tag-heavy snippets ──
  const isHtml =
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.toLowerCase().startsWith("<!doctype") ||
    trimmed.toLowerCase().startsWith("<html") ||
    trimmed.includes("</") ||
    trimmed.includes("/>") ||
    /<[a-z][a-z0-9]*[\s>]/i.test(trimmed);

  if (isHtml) return "html";

  // ── 4. SQL ──
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TRUNCATE|WITH)\s+/i.test(trimmed)) {
    return "sql";
  }

  // ── 5. Java ──
  if (
    trimmed.includes("public class") ||
    trimmed.includes("static void main") ||
    trimmed.includes("System.out.println") ||
    (trimmed.includes("package ") && trimmed.includes(";"))
  ) {
    return "java";
  }

  // ── 6. Python ──
  if (
    trimmed.includes("def ") ||
    (trimmed.includes("import ") && (trimmed.includes(" as ") || trimmed.includes("from "))) ||
    (trimmed.includes("print(") && !trimmed.includes("console.log") && !trimmed.includes(";")) ||
    /^[ \t]*if __name__ == ["']__main__["']\s*:/m.test(trimmed) ||
    /^[ \t]*for [a-zA-Z_]\w* in .+:$/m.test(trimmed)
  ) {
    if (!trimmed.includes("{") && !trimmed.includes("}")) return "python";
  }

  // ── 7. Go ──
  if (
    trimmed.includes("package main") ||
    (trimmed.includes("func ") && (trimmed.includes(`import "fmt"`) || trimmed.includes("fmt.")))
  ) {
    return "go";
  }

  // ── 8. Rust ──
  if (
    trimmed.includes("fn main()") ||
    trimmed.includes("println!") ||
    trimmed.includes("use std::")
  ) {
    return "rust";
  }

  // ── 9. TypeScript ──
  if (
    trimmed.includes("interface ") ||
    (trimmed.includes("type ") && trimmed.includes(" = ")) ||
    /:\s*(string|number|boolean|void|any|never|unknown)\b/.test(trimmed) ||
    /<[A-Z][A-Za-z]*>/.test(trimmed)
  ) {
    return "typescript";
  }

  // ── 10. JavaScript ──
  if (
    trimmed.includes("function") ||
    trimmed.includes("const ") ||
    trimmed.includes("let ") ||
    trimmed.includes("var ") ||
    trimmed.includes("console.log")
  ) {
    return "javascript";
  }

  // ── 11. CSS (Strict fallback) ──
  if (
    trimmed.includes("{") &&
    trimmed.includes("}") &&
    (trimmed.includes(":") || trimmed.includes(";")) &&
    (trimmed.includes(".") || trimmed.includes("#") || /^[a-z,\s*]+\s*\{/im.test(trimmed)) &&
    !trimmed.includes("public ") &&
    !trimmed.includes("class ") &&
    !trimmed.includes("static ") &&
    !trimmed.includes("void ") &&
    !trimmed.includes("package ") &&
    !trimmed.includes("function") &&
    !trimmed.includes("const ") &&
    !trimmed.includes("import ")
  ) {
    return "css";
  }

  return "auto";
}