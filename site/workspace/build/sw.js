if(!self.define){let e,a={};const i=(i,r)=>(i=new URL(i+".js",r).href,a[i]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=a,document.head.appendChild(e)}else e=i,importScripts(i),a()})).then((()=>{let e=a[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,n)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(a[s])return;let d={};const c=e=>i(e,s),l={module:{uri:s},exports:d,require:c};a[s]=Promise.all(r.map((e=>l[e]||c(e)))).then((e=>(n(...e),d)))}}define(["./workbox-f407626e"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-BPvgi06w.css",revision:null},{url:"assets/index-DjiKDBXg.js",revision:null},{url:"favicon.ico",revision:"0a56b8828762227ab9f3e4cd48d0065a"},{url:"favicon.svg",revision:"c7a0663a65382dd9fc459f7388c50a74"},{url:"index.html",revision:"4389de9e8fc76b9e3731d10effefc11f"},{url:"lib/dyCalendarJS-1.2.1/css/dycalendar.css",revision:"9099e7a186aa9341036b1d1e06876e8c"},{url:"lib/dyCalendarJS-1.2.1/css/dycalendar.min.css",revision:"a7f2c46c5f9e7961bf4fc64910ae94c2"},{url:"lib/dyCalendarJS-1.2.1/Gruntfile.js",revision:"f53b1deeeb35f0068644f8441fa4ca8e"},{url:"lib/dyCalendarJS-1.2.1/index-using-jquery.html",revision:"f0e4333459e73e11b70333a54969c935"},{url:"lib/dyCalendarJS-1.2.1/index.html",revision:"fe9e83158eebc8e82423617fbb3912ab"},{url:"lib/dyCalendarJS-1.2.1/js/default.js",revision:"3a8752a693376c2db2342ae8b1acfa95"},{url:"lib/dyCalendarJS-1.2.1/js/dycalendar-jquery.js",revision:"b916a616effe8f517abd9155ac66a1cf"},{url:"lib/dyCalendarJS-1.2.1/js/dycalendar-jquery.min.js",revision:"424f5f7a01506e3329fe6cd3586259d4"},{url:"lib/dyCalendarJS-1.2.1/js/dycalendar.js",revision:"7ced55a6b443cc4a29f6622a54b4019a"},{url:"lib/dyCalendarJS-1.2.1/js/dycalendar.min.js",revision:"93b0efd6cf242fccbd20956568235baf"},{url:"lib/dyCalendarJS-1.2.1/js/jquery.min.js",revision:"c07f2267a050732b752cc3e7a06850ac"},{url:"pwa-128x128.png",revision:"000f4ed923802a868923b09e273c1f23"},{url:"pwa-192x192.png",revision:"a83de451fac4c9c90ddfd0edd0e65914"},{url:"pwa-512x512.png",revision:"49eabff7b1c6efbe72a4e67dc7124a99"},{url:"pwa-650x650.png",revision:"3583c34124eea63570d5a4527acbbc04"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"favicon.ico",revision:"0a56b8828762227ab9f3e4cd48d0065a"},{url:"pwa-128x128.png",revision:"000f4ed923802a868923b09e273c1f23"},{url:"pwa-192x192.png",revision:"a83de451fac4c9c90ddfd0edd0e65914"},{url:"pwa-512x512.png",revision:"49eabff7b1c6efbe72a4e67dc7124a99"},{url:"pwa-650x650.png",revision:"3583c34124eea63570d5a4527acbbc04"},{url:"manifest.webmanifest",revision:"c22a329e70a7e17c88bf05f7f4cb8527"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/jsonplaceholder/,new e.CacheFirst({cacheName:"test-external-api",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
