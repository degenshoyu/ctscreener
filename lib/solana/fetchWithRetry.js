// lib/solana/fetchWithRetry.js

export async function fetchWithRetry(
  url,
  options = {},
  retries = 3,
  timeoutMs = 10000,
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      clearTimeout(id);
      console.error(`❌ Attempt ${attempt} failed: ${err}`);
      if (attempt === retries) throw err;

      const backoff = 2000 * attempt;
      console.log(`⏳ Retrying in ${backoff}ms...`);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
}
