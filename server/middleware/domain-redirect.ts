export default defineEventHandler((event) => {
  const host = getRequestHost(event, { xForwardedHost: true });

  // Exclude local development environments
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('0.0.0.0');
  if (isLocal) {
    return;
  }

  // Redirect any non-canonical domain (vercel.app, workers.dev, www.braveeeeen.com, etc.)
  if (host !== 'braveeeeen.com') {
    const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
    const targetUrl = `https://braveeeeen.com${url.pathname}${url.search}`;
    return sendRedirect(event, targetUrl, 301);
  }
});
