export type TranscriptRole = "ai" | "human" | "other";

export interface TranscriptTurn {
  role: TranscriptRole;
  text: string;
}

/**
 * Turn a raw call transcript into readable speaker turns.
 * Handles literal "\\n" from stored strings and "AI:" / "Human:" labels.
 */
export function parseCallTranscript(raw: string): TranscriptTurn[] {
  const normalized = String(raw || "")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!normalized) return [];

  const chunks = normalized
    .split(/(?=\b(?:AI|Human)\s*:)/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (chunks.length <= 1 && !/^(?:AI|Human)\s*:/i.test(normalized)) {
    return [{ role: "other", text: normalized }];
  }

  return chunks.map((part) => {
    const match = part.match(/^(AI|Human)\s*:\s*([\s\S]*)$/i);
    if (!match) {
      return { role: "other" as const, text: part };
    }
    const label = match[1].toLowerCase();
    return {
      role: (label === "ai" ? "ai" : "human") as TranscriptRole,
      text: match[2].trim()
    };
  });
}

export function transcriptRoleLabel(role: TranscriptRole): string {
  if (role === "ai") return "Agent";
  if (role === "human") return "Caller";
  return "Note";
}
