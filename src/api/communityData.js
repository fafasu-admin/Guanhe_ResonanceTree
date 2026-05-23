export const RESONANCE_FORMULA = Object.freeze({
  validPost: 10,
  validComment: 3,
  like: 1,
  favorite: 2
});

export function calculateResonance(stats) {
  return (
    stats.posts * RESONANCE_FORMULA.validPost +
    stats.validComments * RESONANCE_FORMULA.validComment +
    stats.likes * RESONANCE_FORMULA.like +
    stats.favorites * RESONANCE_FORMULA.favorite
  );
}

export async function fetchCommunityData() {
  const response = await fetch("data/community-mock.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("无法读取世界复原图数据");
  }
  return response.json();
}

export async function fetchCommunityDataFromApi() {
  console.info("[community data placeholder] Replace this method with 光核 API or crawler output.");
  return fetchCommunityData();
}
