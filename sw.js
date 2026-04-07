const CACHE='liuyao-v2';
const ASSETS=['/','/index.html','/manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(ASSETS.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('api.github.com')||e.request.url.includes('fonts.g'))return;
  e.respondWith(caches.match(e.request).then(c=>{
    if(c)return c;
    return fetch(e.request).then(r=>{
      if(r&&r.status===200&&e.request.method==='GET'){const cl=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,cl));}
      return r;
    }).catch(()=>c);
  }));
});
