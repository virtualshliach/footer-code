/* Footer loader - SITE-DOMAIN (ORGANIZATION NAME)
   The ONLY line in this site's ChabadOne footer that points here:
     <script src="https://virtualshliach.github.io/footer-code/SITE/footer.js"></script>
   This file decides, per page, which project file (if any) to load from this folder.
   To add a project: add an entry to PAGES. To retire one: delete its entry.
   Bump V whenever any project file in this folder changes (forces fresh copies). */
(function () {
  'use strict';
  var SITE = 'SITE';
  var V = 'YYYY-MM-DDa';

  /* page id (aid) -> project. file: name in this folder.
     cover: background color to hold the page while the project loads (optional).
     onResponse: also load on the form's thank-you (response) page (optional). */
  var PAGES = {
    /* '1234567': { file: 'project-name.js', cover: '#ffffff' } */
  };

  /* domain roots that should load a project without an aid in the URL */
  var HOSTS = {
    /* 'example.org': '1234567' */
  };

  var href = window.location.href;
  var isResponse = href.indexOf('ArticleCcoResponse') > -1;

  function findAid() {
    var m = /\/aid\/(\d+)(?:[\/.]|$)/i.exec(window.location.pathname) ||
            /[?&]aid=(\d+)(?:&|$)/i.exec(window.location.search);
    if (m) return m[1];
    var host = (window.location.hostname || '').toLowerCase().replace(/^www\./, '');
    var path = window.location.pathname;
    if (HOSTS[host] && (path === '/' || path === '')) return HOSTS[host];
    if (window.Co && window.Co.ArticleId) return String(window.Co.ArticleId);
    return null;
  }

  var aid = findAid();
  var page = aid && Object.prototype.hasOwnProperty.call(PAGES, aid) ? PAGES[aid] : null;
  if (!page) return;
  if (isResponse && !page.onResponse) return;
  if (!/^[a-z0-9][a-z0-9-]*\.js$/.test(page.file)) return;

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

  var s = document.createElement('script');
  s.src = base + page.file + '?v=' + V;
  s.onerror = function () {
    uncover();
    if (window.console) console.error('[footer-code/' + SITE + '] could not load ' + page.file);
  };
  (document.head || document.documentElement).appendChild(s);
  if (window.console) console.log('[footer-code/' + SITE + '] ' + V + ' aid ' + aid + ' -> ' + page.file);
})();
