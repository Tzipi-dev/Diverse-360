export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
    throw new Error("Invalid vector input to cosineSimilarity: not an array");
  }
  if (vecA.length === 0 || vecB.length === 0) {
    throw new Error("Empty vector input to cosineSimilarity");
  }
  if (vecA.length !== vecB.length) {
    throw new Error("Vector length mismatch in cosineSimilarity");
  }

  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}
