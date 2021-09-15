export function isRelativeUrl(url: string) {
   const r = new RegExp('^(?:[a-z]+:)?//', 'i');
   return !r.test(url);
}
