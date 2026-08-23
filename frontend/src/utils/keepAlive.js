/**
 * VVK Portfolio — Render Backend Heartbeat & Keep-Alive Helper
 * Automatically pre-warms and keeps Render backend active.
 */

export function initBackendKeepAlive() {
  const apiBase = import.meta.env.VITE_API_URL;
  if (!apiBase) return;

  const pingBackend = async () => {
    try {
      await fetch(`${apiBase}/health`, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Cache-Control': 'no-cache' }
      });
    } catch {
      // Quiet background failure handling
    }
  };

  // 1. Pre-warm immediately upon website load
  pingBackend();

  // 2. Heartbeat every 14 minutes (840,000 ms) to stay under Render's 15-minute idle threshold
  const intervalId = setInterval(pingBackend, 14 * 60 * 1000);

  return () => clearInterval(intervalId);
}
