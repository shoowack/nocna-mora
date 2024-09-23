export function generateSlug(str: string): string {
  // Replace special characters
  const replacements: { [key: string]: string } = {
    ć: "c",
    č: "c",
    š: "s",
    ž: "z",
    đ: "d",
    Ć: "C",
    Č: "C",
    Š: "S",
    Ž: "Z",
    Đ: "D",
  };

  const slug = str
    .replace(/[ćčšžđĆČŠŽĐ]/g, (match) => replacements[match]) // Step 1: Replace special characters
    .replace(/[^a-zA-Z0-9 -]/g, "") // Step 2: Remove invalid characters
    .replace(/\s+/g, "-") // Step 3: Replace spaces with hyphens
    .replace(/-+/g, "-") // Step 4: Replace multiple hyphens with a single hyphen
    .toLowerCase();

  return slug;
}
