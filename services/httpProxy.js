const axios = require('axios');

// User-Agent común para evitar bloqueos
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function proxyRequest(url, options = {}) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        ...options.headers
      },
      timeout: 15000,
      ...options
    });

    return response.data;
  } catch (error) {
    console.error(`Proxy request failed for ${url}:`, error.message);
    throw new Error(`Failed to fetch: ${error.message}`);
  }
}

module.exports = { proxyRequest };