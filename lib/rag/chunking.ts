/**
 * Legal-aware chunking.
 *
 * Legal documents are structurally organised (sections, articles, chapters,
 * parts, schedules). We try to recognise those headings and chunk on them
 * instead of blind char-count splits:
 *
 * - Short sections are kept whole and grouped up to a soft size.
 * - Very long sections are split into overlapping slices that keep the
 *   section metadata.
 * - Major boundaries (CHAPTER / PART / SCHEDULE) always start a new chunk.
 */

export interface ExtractedPage {
  page: number;
  text: string;
}

export interface ChunkingOptions {
  /** Hard ceiling for a single chunk (characters). */
  maxChunkSize?: number;
  /** Target chunk size for merging small sections (characters). */
  softChunkSize?: number;
  /** Chunks below minChunkSize are merged with a neighbour where possible. */
  minChunkSize?: number;
  /** Overlap (characters) when splitting a long section. */
  overlap?: number;
}

export interface LegalChunk {
  text: string;
  sectionNumber: string | null;
  articleNumber: string | null;
  sectionTitle: string | null;
  pageNumber: number;
  startPage: number;
  endPage: number;
}

interface BlockHeading {
  sectionNumber: string | null;
  articleNumber: string | null;
  sectionTitle: string | null;
  /** CHAPTER / PART / SCHEDULE boundaries always force a new chunk. */
  majorBreak: boolean;
}

interface Block {
  lines: string[];
  heading: BlockHeading | null;
  firstPage: number;
  lastPage: number;
}

const DEFAULTS: Required<ChunkingOptions> = {
  maxChunkSize: 1600,
  softChunkSize: 900,
  minChunkSize: 400,
  overlap: 120,
};

// --- heading detection ------------------------------------------------------

function normalizeLine(line: string): string {
  return line.replace(/\s+/g, " ").trim();
}

function splitInlineBody(rest: string): { title: string; inlineBody: string } {
  const dash = rest.match(/^(.*?)\s*[—–]\s*(.*)$/);
  if (dash && dash[1].trim()) {
    return { title: dash[1].trim(), inlineBody: dash[2].trim() };
  }
  return { title: rest, inlineBody: "" };
}

interface HeadingMatch {
  sectionNumber: string | null;
  articleNumber: string | null;
  sectionTitle: string | null;
  majorBreak: boolean;
  /** text on the same line after an em/en dash — the body of the section. */
  inlineBody: string;
}

function detectHeading(line: string): HeadingMatch | null {
  const text = normalizeLine(line);
  if (!text || text.length > 160) return null;

  // "Article 245. Power to grant pardon."
  const article = text.match(
    /^\s*(?:article|art\.?)\s+([0-9]+(?:[A-Z])?)\b\s*[.)]?\s*(.*)$/i
  );
  if (article) {
    const { title, inlineBody } = splitInlineBody(article[2].trim());
    return {
      sectionNumber: null,
      articleNumber: article[1],
      sectionTitle: title || null,
      majorBreak: false,
      inlineBody,
    };
  }

  // "Section 378. Theft." / "Sec. 154."
  const section = text.match(
    /^\s*(?:section|sec\.?)\s+([0-9]+[A-Za-z]?(?:[-–][A-Za-z]+)?)\b\s*[.)]?\s*(.*)$/i
  );
  if (section) {
    const { title, inlineBody } = splitInlineBody(section[2].trim());
    return {
      sectionNumber: section[1],
      articleNumber: null,
      sectionTitle: title || null,
      majorBreak: false,
      inlineBody,
    };
  }

  // "378. Theft.—Whoever ..." (number-led section, common in codes)
  const numbered = text.match(/^\s*(?:[0-9]{1,4}[A-Z]?)\s*[.)]\s+([A-Z].+)$/);
  if (numbered) {
    const { title, inlineBody } = splitInlineBody(numbered[1].trim());
    if (!inlineBody && (title.length > 120 || /[.;,]/.test(title.replace(/\.$/, "")))) {
      return null; // probably ordinary prose, not a heading
    }
    const num = text.match(/^\s*([0-9]{1,4}[A-Z]?)\s*[.)]/)?.[1] ?? null;
    return {
      sectionNumber: num,
      articleNumber: null,
      sectionTitle: title || null,
      majorBreak: false,
      inlineBody,
    };
  }

  // "CHAPTER I" / "PART II" / "THE FIRST SCHEDULE" / "ORDER 1"
  const major = text.match(
    /^\s*(chapter|part|schedule|the \d+(?:st|nd|rd|th)? schedule|appendix|annexure)\s*([ivxlcdm]+|[0-9]+)?\b[\s.]*\s*(.*)$/i
  );
  if (major) {
    const label = `${
      major[1].trim().toUpperCase()
    }${major[2] ? ` ${major[2].toUpperCase()}` : ""}`;
    const { title, inlineBody } = splitInlineBody(major[3].trim());
    return {
      sectionNumber: null,
      articleNumber: null,
      sectionTitle: title ? `${label} — ${title}` : label,
      majorBreak: true,
      inlineBody,
    };
  }

  return null;
}

// --- block building ---------------------------------------------------------

function buildBlocks(pages: ExtractedPage[]): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;

  const ensureBlock = (page: number): Block => {
    if (!current) {
      current = { lines: [], heading: null, firstPage: page, lastPage: page };
    }
    current.lastPage = page;
    return current;
  };

  for (const page of pages) {
    const text = page.text
      .normalize("NFKC")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    if (!text) continue;

    for (const rawLine of text.split("\n")) {
      const line = normalizeLine(rawLine);
      if (!line) continue;

      const heading = detectHeading(line);
      if (heading) {
        if (current && current.lines.length > 0) {
          blocks.push(current);
        }
        current = {
          lines: [],
          heading: {
            sectionNumber: heading.sectionNumber,
            articleNumber: heading.articleNumber,
            sectionTitle: heading.sectionTitle,
            majorBreak: heading.majorBreak,
          },
          firstPage: page.page,
          lastPage: page.page,
        };
        if (heading.inlineBody) {
          current.lines.push(heading.inlineBody);
        }
        continue;
      }

      ensureBlock(page.page).lines.push(line);
    }
  }

  if (current && current.lines.length > 0) blocks.push(current);
  return blocks;
}

function joinLines(lines: string[]): string {
  return lines.join(" ").replace(/\s+/g, " ").trim();
}

/** Expand long dashes and tighten whitespace for embedding-friendly text. */
export function cleanChunkText(text: string): string {
  return text.replace(/[—–]/g, " - ").replace(/\s+/g, " ").trim();
}

function blockText(block: Block): string {
  return joinLines(block.lines);
}

// --- chunk assembly ---------------------------------------------------------

export function chunkLegalText(
  pages: ExtractedPage[],
  options: ChunkingOptions = {}
): LegalChunk[] {
  const opts = { ...DEFAULTS, ...options };
  const blocks = buildBlocks(pages);
  const chunks: LegalChunk[] = [];

  let currentLines: string[] = [];
  let currentHeading: BlockHeading | null = null;
  let currentStartPage = 0;
  let currentEndPage = 0;

  const currentLength = () => {
    let n = 0;
    for (const line of currentLines) n += line.length + 1;
    return n;
  };

  const flush = () => {
    if (currentLines.length === 0) return;
    const text = joinLines(currentLines);
    if (text.length === 0) return;
    chunks.push({
      text,
      sectionNumber: currentHeading?.sectionNumber ?? null,
      articleNumber: currentHeading?.articleNumber ?? null,
      sectionTitle: currentHeading?.sectionTitle ?? null,
      pageNumber: currentStartPage,
      startPage: currentStartPage,
      endPage: currentEndPage,
    });
    currentLines = [];
    currentHeading = null;
    currentStartPage = 0;
    currentEndPage = 0;
  };

  // Emit overlapping slices of a block that is longer than maxChunkSize.
  const pushBlockSplit = (block: Block) => {
    const headingLines: string[] = [];
    if (block.heading?.sectionTitle) headingLines.push(block.heading.sectionTitle);
    const headingPrefix = headingLines.length ? `${headingLines.join(" - ")}. ` : "";
    const body = blockText(block);

    const sliceSize = opts.softChunkSize;
    const step = Math.max(sliceSize - opts.overlap, 200);

    let start = 0;
    let index = 0;
    while (start < body.length) {
      const slice = body.slice(start, start + sliceSize);
      if (!slice.trim()) break;
      chunks.push({
        text: cleanChunkText(index === 0 ? `${headingPrefix}${slice}` : slice),
        sectionNumber: block.heading?.sectionNumber ?? null,
        articleNumber: block.heading?.articleNumber ?? null,
        sectionTitle: block.heading?.sectionTitle ?? null,
        pageNumber: block.firstPage,
        startPage: block.firstPage,
        endPage: block.lastPage,
      });
      start += step;
      index += 1;
    }
  };

  for (const block of blocks) {
    const len = blockText(block).length;

    if (block.heading?.majorBreak && currentLines.length > 0) {
      flush();
    }

    if (len > opts.maxChunkSize) {
      flush();
      pushBlockSplit(block);
      continue;
    }

    if (
      currentLines.length > 0 &&
      currentLength() + len > opts.maxChunkSize
    ) {
      flush();
    }

    if (currentLines.length === 0) {
      currentStartPage = block.firstPage;
      currentEndPage = block.lastPage;
      const identifying =
        block.heading?.sectionNumber ||
        block.heading?.articleNumber ||
        block.heading?.majorBreak;
      currentHeading = block.heading && identifying ? block.heading : null;
    }

    currentLines.push(blockText(block));
    currentEndPage = block.lastPage;

    // Soft-merge: flush when past the soft target so chunks stay bounded.
    if (currentLength() >= opts.softChunkSize) {
      flush();
    }
  }

  flush();
  return chunks.map((c) => ({ ...c, text: cleanChunkText(c.text) }));
}