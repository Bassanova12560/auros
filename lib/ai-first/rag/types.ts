export type RagChunkType =
  | "summary"
  | "fact"
  | "faq"
  | "intent"
  | "keyword"
  | "jurisdiction";

export type RagChunk = {
  id: string;
  pageId: string;
  path: string;
  title: string;
  chunkType: RagChunkType;
  text: string;
  canonicalUrl: string;
  machineUrl: string;
};

export type RagSearchHit = RagChunk & {
  score: number;
};

export type RagSource = {
  pageId: string;
  path: string;
  title: string;
  canonicalUrl: string;
  machineUrl: string;
  score: number;
  chunkCount: number;
};

export type RagQueryInput = {
  query: string;
  limit?: number;
  contentTypes?: string[];
  minScore?: number;
};

export type RagResponse = {
  query: string;
  generatedAt: string;
  catalogVersion: string;
  endpoint: string;
  /** Pre-formatted context block for LLM prompt injection. */
  context: string;
  results: RagSearchHit[];
  sources: RagSource[];
  meta: {
    corpusChunks: number;
    algorithm: "bm25";
    disclaimer: string;
  };
};
