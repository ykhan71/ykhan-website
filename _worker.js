export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '') {
      const newUrl = new URL(request.url);
      newUrl.pathname = '/index.html';
      return env.ASSETS.fetch(new Request(newUrl, request));
    }
    return env.ASSETS.fetch(request);
  }
}
