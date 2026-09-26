/**
 * Minimal type declaration for pdfjs-dist's legacy ESM build (no bundled types
 * for the `legacy/build/pdf.mjs` subpath). Keep this surface small — we only
 * use text extraction via getDocument/getPage/getTextContent.
 */

declare module "pdfjs-dist/legacy/build/pdf.mjs" {
  export interface TextItem {
    str: string;
    hasEOL: boolean;
  }

  export interface TextContent {
    items: TextItem[];
  }

  export interface Page {
    getTextContent(): Promise<TextContent>;
  }

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(page: number): Promise<Page>;
    destroy(): Promise<void>;
  }

  export interface GetDocumentParams {
    data: Uint8Array;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
  }

  export function getDocument(
    params: GetDocumentParams
  ): { promise: Promise<PDFDocumentProxy> };
}