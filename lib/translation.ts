const translationCache = new Map<string, string>();

function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export async function translateToPortuguese(text: string): Promise<string> {
  const normalized = normalizeText(text);
  if (!normalized) return '';

  const cacheKey = normalized.toLowerCase();
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(normalized)}&langpair=en|pt-BR`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Translation request failed');

    const data = await res.json();
    const translated = data?.responseData?.translatedText;

    if (typeof translated === 'string' && translated.trim()) {
      translationCache.set(cacheKey, translated.trim());
      return translated.trim();
    }
  } catch {
    // Silent fallback to original text
  }

  translationCache.set(cacheKey, normalized);
  return normalized;
}
