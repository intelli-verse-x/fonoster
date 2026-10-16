export type ChatTurn = { human?: unknown; ai?: unknown };

function textOf(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) {
    return value
      .map((part) => textOf(part))
      .filter(Boolean)
      .join(" ");
  }
  if (value && typeof value === "object" && "text" in value) {
    return textOf((value as { text: unknown }).text);
  }
  return "";
}

/** One readable line per spoken turn. Capped so the call ledger stays small. */
export function formatCallTranscript(history: ChatTurn[]): string {
  const lines: string[] = [];
  for (const turn of history || []) {
    const human = textOf(turn?.human);
    const ai = textOf(turn?.ai);
    if (human) lines.push(`Human: ${human}`);
    if (ai) lines.push(`AI: ${ai}`);
  }
  return lines.join("\n").slice(0, 12000);
}

export function plainCallMetadata(metadata: unknown): Record<string, string> {
  if (!metadata || typeof metadata !== "object") return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(
    metadata as Record<string, unknown>
  )) {
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim().slice(0, 180);
    }
  }
  return out;
}
