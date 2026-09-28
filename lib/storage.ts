// Only use this if your bucket is PUBLIC.
export function getImageUrl(key: string) {
  if (!key) return "";

  const base = "https://koubarroastery.com";
  const cleanKey = key.startsWith("/") ? key.slice(1) : key;

  return encodeURI(`${base}/${cleanKey}`);
}