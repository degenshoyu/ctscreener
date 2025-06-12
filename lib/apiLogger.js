export async function logApiCall(name, data) {
  console.log(`📡 [API Proxy] ${name} called with:`, data);
  console.trace("📍 Stack:");
}

