/**
 * Heuristic-based code language detection.
 */
export function detectCodeLanguage(code: string): string {
  const trimmed = code.trim();

  // ── React: must have explicit React signals BEFORE generic HTML check ──
  // A plain HTML file with JS objects ({}) would false-positive on the old
  // curly-brace heuristic, so we require at least one unambiguous React marker.
  const isReact =
    /import\s+.*\s+from\s+['"]react['"]/i.test(trimmed) ||   // import ... from 'react'
    trimmed.includes("useState") ||
    trimmed.includes("useEffect") ||
    trimmed.includes("useRef") ||
    trimmed.includes("useCallback") ||
    trimmed.includes("useMemo") ||
    /export\s+default\s+function\s+[A-Z]/.test(trimmed) ||   // export default function App
    /const\s+[A-Z][A-Za-z]*\s*=\s*\(/.test(trimmed) ||       // const MyComponent = (
    /return\s*\(\s*</.test(trimmed);                          // return ( <JSX

  if (isReact) return "react";

  // ── HTML: full documents or tag-heavy snippets ──
  const isHtml =
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.toLowerCase().startsWith("<!doctype") ||
    trimmed.toLowerCase().startsWith("<html") ||
    // Has closing tags or self-closing — more reliable than bare <>
    trimmed.includes("</") ||
    trimmed.includes("/>") ||
    // Opening tag with attributes e.g. <div class="..."
    /<[a-z][a-z0-9]*[\s>]/i.test(trimmed);

  if (isHtml) return "html";

  // ── CSS ──
  if (
    trimmed.includes("{") &&
    trimmed.includes("}") &&
    (trimmed.includes(":") || trimmed.includes(";")) &&
    (trimmed.includes(".") || trimmed.includes("#") || /^[a-z,\s*]+\s*\{/im.test(trimmed)) &&
    !trimmed.includes("function") &&
    !trimmed.includes("const ") &&
    !trimmed.includes("import ")
  ) {
    return "css";
  }

  // ── Python ──
  if (
    trimmed.includes("def ") ||
    (trimmed.includes("import ") && (trimmed.includes(" as ") || trimmed.includes("from "))) ||
    (trimmed.includes("print(") && !trimmed.includes("console.log")) ||
    /^[ \t]*if __name__ == ["']__main__["']\s*:/m.test(trimmed) ||
    /^[ \t]*for [a-zA-Z_]\w* in .+:$/m.test(trimmed)
  ) {
    if (!trimmed.includes("{") && !trimmed.includes("}")) return "python";
  }

  // ── C / C++ ──
  if (
    trimmed.includes("#include") ||
    /int\s+main\s*\(/.test(trimmed) ||
    trimmed.includes("std::") ||
    (trimmed.includes("printf(") && !trimmed.includes("console.log")) ||
    trimmed.includes("cout <<")
  ) {
    return "cpp";
  }

  // ── Go ──
  if (
    trimmed.includes("package main") ||
    (trimmed.includes("func ") && trimmed.includes(`import "fmt"`))
  ) {
    return "go";
  }

  // ── SQL ──
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TRUNCATE|WITH)\s+/i.test(trimmed)) {
    return "sql";
  }

  // ── Java ──
  if (
    trimmed.includes("public class") ||
    trimmed.includes("static void main") ||
    trimmed.includes("System.out.println")
  ) {
    return "java";
  }

  // ── Rust ──
  if (
    trimmed.includes("fn main()") ||
    trimmed.includes("println!") ||
    trimmed.includes("use std::")
  ) {
    return "rust";
  }

  // ── TypeScript (before JS — more specific) ──
  if (
    trimmed.includes("interface ") ||
    /:\s*(string|number|boolean|void|any|never|unknown)\b/.test(trimmed) ||
    /<[A-Z][A-Za-z]*>/.test(trimmed)   // generic e.g. Array<T>
  ) {
    return "typescript";
  }

  // ── JavaScript ──
  if (
    trimmed.includes("function") ||
    trimmed.includes("const ") ||
    trimmed.includes("let ") ||
    trimmed.includes("var ")
  ) {
    return "javascript";
  }

  return "auto";
}