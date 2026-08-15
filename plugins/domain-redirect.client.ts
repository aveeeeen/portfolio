export default defineNuxtPlugin(() => {
  if (process.client) {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';

    if (!isLocal && hostname !== 'braveeeeen.com') {
      window.location.replace(`https://braveeeeen.com${window.location.pathname}${window.location.search}${window.location.hash}`);
    }
  }
});
