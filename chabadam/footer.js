/* Footer loader - chabadam.org (Chabad of Allen-McKinney)
   The ONLY line in this site's ChabadOne footer that points here:
     <script src="https://virtualshliach.github.io/footer-code/chabadam/footer.js"></script>
   This file decides which project files (if any) to load on each page.
   EVERY: loaded on every page of the site (the site redesign).
   PAGES: loaded only on one page id (aid), like other sites' event pages.
   Bump V whenever any project file in this folder changes (forces fresh copies). */
(function () {
  'use strict';
  var SITE = 'chabadam';
  var V = '2026-10-29a';

  /* Site redesign. While LIVE is false only browsers that opened the site with
     ?preview=1 see it (remembered in that browser; ?preview=0 turns it off).
     Visitors see the current site. Set LIVE to true to switch everyone over. */
  var LIVE = false;
  var EVERY = [
    { file: 'layout.js', homeCover: true }
  ];

  /* page id (aid) -> project. file: name in this folder.
     cover: background color to hold the page while the project loads (optional).
     onResponse: also load on the form's thank-you (response) page (optional). */
  var PAGES = {
    /* '1234567': { file: 'project-name.js', cover: '#ffffff' } */
  };

  var href = window.location.href;
  var isResponse = href.indexOf('ArticleCcoResponse') > -1;
  var PREVIEW_KEY = 'fc-' + SITE + '-preview';

  function previewOn() {
    var q = /[?&]preview=([01])(?:&|#|$)/.exec(window.location.search);
    try {
      if (q) {
        if (q[1] === '1') window.localStorage.setItem(PREVIEW_KEY, '1');
        else window.localStorage.removeItem(PREVIEW_KEY);
      }
      return window.localStorage.getItem(PREVIEW_KEY) === '1';
    } catch (e) {
      return !!(q && q[1] === '1');
    }
  }

  function findAid() {
    var m = /\/aid\/(\d+)(?:[\/.]|$)/i.exec(window.location.pathname) ||
            /[?&]aid=(\d+)(?:&|$)/i.exec(window.location.search);
    if (m) return m[1];
    if (window.Co && window.Co.ArticleId) return String(window.Co.ArticleId);
    return null;
  }

  /* Only ever load from this loader's own folder. */
  var me = document.currentScript && document.currentScript.src;
  if (!me) {
    var all = document.getElementsByTagName('script');
    for (var i = all.length - 1; i >= 0; i--) {
      if (all[i].src.indexOf('/' + SITE + '/footer.js') > -1) { me = all[i].src; break; }
    }
  }
  if (!me) return;
  var base = me.split('?')[0].replace(/[^\/]+$/, '');
  var safeName = /^[a-z0-9][a-z0-9-]*\.js$/;

  function load(file, onFail) {
    if (!safeName.test(file)) return;
    var s = document.createElement('script');
    s.src = base + file + '?v=' + V;
    s.onerror = function () {
      if (onFail) onFail();
      if (window.console) console.error('[footer-code/' + SITE + '] could not load ' + file);
    };
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---- site-wide files ---- */
  var isHome = document.body && /(^|\s)home(\s|$)/.test(document.body.className);
  var on = LIVE || previewOn();
  if (on && !isResponse) {
    EVERY.forEach(function (p) {
      /* hold the old homepage rows hidden until the new homepage is built;
         layout.js takes over this same style (id cam-cover) and removes it */
      if (p.homeCover && isHome && !document.getElementById('cam-cover')) {
        var st = document.createElement('style');
        st.id = 'cam-cover';
        st.appendChild(document.createTextNode('html body.home .hp-table{visibility:hidden}'));
        (document.head || document.documentElement).appendChild(st);
        setTimeout(uncoverHome, 6000);
      }
      load(p.file, uncoverHome);
    });
    if (window.console) console.log('[footer-code/' + SITE + '] ' + V + (LIVE ? ' live' : ' preview') + ' -> ' +
      EVERY.map(function (p) { return p.file; }).join(', '));
  }
  function uncoverHome() {
    var el = document.getElementById('cam-cover');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  /* ---- single-page projects ---- */
  var aid = findAid();
  var page = aid && Object.prototype.hasOwnProperty.call(PAGES, aid) ? PAGES[aid] : null;
  if (!page) return;
  if (isResponse && !page.onResponse) return;

  var coverId = page.coverId || 'fc-cover';
  if (page.cover && !isResponse && !document.getElementById(coverId)) {
    var c = document.createElement('div');
    c.id = coverId;
    c.setAttribute('style', 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147481000;background:' + page.cover);
    (document.body || document.documentElement).appendChild(c);
    setTimeout(uncover, 8000);
  }
  function uncover() {
    var el = document.getElementById(coverId);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }
  load(page.file, uncover);
  if (window.console) console.log('[footer-code/' + SITE + '] ' + V + ' aid ' + aid + ' -> ' + page.file);
})();
