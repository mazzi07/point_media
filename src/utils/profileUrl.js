export function normalizeProfileUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const text = value.trim();
  if (/[\s\\]/.test(text)) return null;
  const hasProtocol = /^[a-z][a-z\d+.-]*:/i.test(text);
  try {
    const url = new URL(hasProtocol ? text : `https://${text}`);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}
