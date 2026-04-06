import type { CollectionBeforeChangeHook } from "payload"

/**
 * Extracts plain text from Lexical richText JSON for PostgreSQL full-text search indexing.
 */
function extractTextFromLexical(node: Record<string, unknown>): string {
  if (!node) return ""

  let text = ""

  if (typeof node.text === "string") {
    text += node.text
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      text += " " + extractTextFromLexical(child as Record<string, unknown>)
    }
  }

  if (node.type === "paragraph" || node.type === "heading") {
    text += "\n"
  }

  return text
}

export const extractPlainTextFromTranscription: CollectionBeforeChangeHook = ({ data }) => {
  if (data.transcription) {
    const root =
      typeof data.transcription === "string" ? JSON.parse(data.transcription) : data.transcription

    data.transcriptionPlain = extractTextFromLexical(root.root || root)
      .replace(/\s+/g, " ")
      .trim()
  }

  return data
}
