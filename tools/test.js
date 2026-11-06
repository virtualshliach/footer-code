/* Loader + project tests. Serves this repo as if it were GitHub Pages and loads each
   page through the real footer line, so the loader, its page map and the project
   files are tested together.
   Setup once:  cd tools && npm install
   Run:         node tools/test.js */
'use strict';
var fs = require('fs'), path = require('path');
var jsdom = require('jsdom');
var JSDOM = jsdom.JSDOM;
var ROOT = path.join(__dirname, '..');
var PAGES_BASE = 'https://virtualshliach.github.io/footer-code/';

var pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; console.log('  ok   ' + m); } else { fail++; console.log('  FAIL ' + m); } }
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

/* Serve repo files for the Pages URL; record every script URL requested. */
function makeLoader(requests) {
  class RepoLoader extends jsdom.ResourceLoader {
    fetch(url, opts) {
      requests.push(url);
      if (url.indexOf(PAGES_BASE) === 0) {
        var rel = decodeURIComponent(url.slice(PAGES_BASE.length).split('?')[0]);
        var file = path.join(ROOT, rel);
        if (file.indexOf(ROOT) === 0 && fs.existsSync(file) && fs.statSync(file).isFile()) {
          return Promise.resolve(fs.readFileSync(file));
        }
        return Promise.reject(new Error('404 ' + url));
      }
      /* Third-party loads (fonts, map iframe) answer empty so tests stay offline. */
      return Promise.resolve(Buffer.from(''));
    }
  }
  return new RepoLoader();
}

var SHELL = '<!doctype html><html><head><title>t</title></head><body class="cco_templateless_page">' +
  '<div class="cco_templateless_template"><a href="//www.JewishRiverside.com">Back</a></div>' +
  '<div class="cco_templatelates_content"><div id="chabad_body_page"><div id="navigation">nav</div>' +
  '<div id="co_content_container">native</div></div></div><div id="BodyContainer">Powered by</div>';

function load(site, url, opts) {
  opts = opts || {};
  var errors = [], logs = [], requests = [];
  var html = (opts.shell || SHELL) + (opts.coScript || '') +
    (opts.footer || '<script src="' + PAGES_BASE + site + '/footer.js"></script>') + '</body></html>';
  var dom = new JSDOM(html, {
    url: url, runScripts: 'dangerously', resources: makeLoader(requests), pretendToBeVisual: true,
    beforeParse: function (w) {
      w.console.error = function () { errors.push([].join.call(arguments, ' ')); };
      w.console.warn = function () { logs.push('warn ' + [].join.call(arguments, ' ')); };
      w.console.log = function () { logs.push([].join.call(arguments, ' ')); };
      w.addEventListener('error', function (e) { errors.push(e.message); });
      w.fetch = function () { return Promise.reject(new Error('offline in tests')); };
    }
  });
  return wait(opts.wait || 600).then(function () {
    return { w: dom.window, d: dom.window.document, errors: errors, logs: logs, requests: requests };
  });
}
function projectRequests(r) {
  return r.requests.filter(function (u) { return u.indexOf(PAGES_BASE) === 0 && !/\/footer\.js$/.test(u); });
}

var CAM_HOME = fs.readFileSync(path.join(__dirname, 'fixtures', 'chabadam-home.html'), 'utf8');
var CAM_INNER = '<!doctype html><html><head><title>t</title></head><body class="lang_en dir_ltr cco_body sites-article">' +
  '<div id="header"><div class="wrapper header-wrapper"><div class="clearfix branding-search"><div id="header_branding">' +
  '<div class="float_left site-logo-wrapper"><a href="/"><img src="x.png"></a></div><a class="site_title" href="/">Chabad of Allen-McKinney</a>' +
  '</div></div></div></div><div id="content">Article</div>' +
  '<div id="footer"><div class="footer3">Chabad of Allen-McKinney \u2022 214.785.1830 \u2022 rabbi@chabadAM.org</div></div>';

var SITES = {
  chabadam: async function () {
    var HOME = 'https://www.chabadam.org/';
    console.log('chabadam: site redesign is live for every visitor');
    var off = await load('chabadam', HOME, { shell: CAM_HOME, wait: 1500 });
    ok(projectRequests(off).length === 1 && /chabadam\/layout\.js\?v=/.test(projectRequests(off)[0]), 'plain visit: layout.js loaded');
    ok(/(^|\s)cam-home(\s|$)/.test(off.d.body.className) && !off.errors.length, 'plain visit: homepage rebuilt');
    ok(off.logs.some(function (l) { return /\[footer-code\/chabadam\].* live -> layout\.js/.test(l); }), 'loader says live');
    var wa = off.d.querySelector('.cam-footer .cam-social a[href*="wa.me"]');
    ok(wa && wa.getAttribute('href') === 'https://wa.me/14693684152', 'footer WhatsApp goes to 469-368-4152');

    console.log('chabadam: through the cache-proof footer line (footer-line.html)');
    var LINE = fs.readFileSync(path.join(ROOT, 'chabadam', 'footer-line.html'), 'utf8');
    var fl = await load('chabadam', HOME, { shell: CAM_HOME, footer: LINE, wait: 1500 });
    ok(fl.requests.some(function (u) { return /chabadam\/footer\.js\?t=\d+$/.test(u); }), 'line asks for a fresh loader (minute stamp)');
    ok(projectRequests(fl).some(function (u) { return /chabadam\/layout\.js\?v=/.test(u); }), 'loader then fetched layout.js');
    ok(/(^|\s)cam-home(\s|$)/.test(fl.d.body.className) && !fl.errors.length, 'homepage rebuilt through the line');
    ok(!fl.d.getElementById('cam-cover'), 'cover removed after build');
    var flInner = await load('chabadam', 'https://www.chabadam.org/templates/articlecco_cdo/aid/6780908/jewish/Services.htm', { shell: CAM_INNER, footer: LINE, wait: 900 });
    ok(flInner.d.querySelector('.cam-footer') && !flInner.d.getElementById('cam-cover') && !flInner.errors.length, 'inner page through the line: no cover, footer rebuilt');

    console.log('chabadam: preview homepage (?preview=1)');
    var r = await load('chabadam', HOME + '?preview=1', { shell: CAM_HOME, wait: 1500 });
    ok(projectRequests(r).length === 1 && /chabadam\/layout\.js\?v=/.test(projectRequests(r)[0]), 'loader fetched layout.js with version stamp');
    ok(/(^|\s)cam-home(\s|$)/.test(r.d.body.className), 'homepage rebuilt');
    ok(!r.d.getElementById('cam-cover'), 'homepage cover removed after build');
    ok(r.errors.length === 0, 'no console errors ' + (r.errors.length ? JSON.stringify(r.errors) : ''));
    ok(r.logs.some(function (l) { return /\[footer-code\/chabadam\].* live -> layout\.js/.test(l); }), 'loader log line');
    ok(r.logs.some(function (l) { return /CAM layout v[\d.]+: running on homepage/.test(l); }), 'layout log line');
    ['cam-hero', 'cam-prog', 'cam-about', 'cam-info', 'cam-mail'].forEach(function (c) {
      ok(r.d.querySelector('.cam-home .' + c), 'section .' + c);
    });
    ok(r.d.querySelectorAll('.cam-plist li').length === 6, 'six programs listed');
    ok(r.d.querySelector('.cam-pcap p') && /Evenings of learning/.test(r.d.querySelector('.cam-pcap p').textContent), 'program subtitle shown under the picture');
    var wl = [].slice.call(r.d.querySelectorAll('.cam-plist a')).filter(function (x) { return /women/i.test(x.textContent); })[0];
    ok(wl && wl.getAttribute('href') === '/templates/articlecco_cdo/aid/7247052/jewish/Jewish-Womens-Circle.htm', 'program links set by name (women -> JWC page)');
    ok(r.d.querySelector('img.cam-logo') && /^data:image\/png/.test(r.d.querySelector('img.cam-logo').getAttribute('src')), 'logo in header');
    ok(r.d.querySelector('.cam-footer'), 'footer rebuilt');
    ok(!r.d.querySelector('.cam-band') && !r.d.querySelector('.cam-photos'), 'old band and photo grid replaced');
    ok(r.d.querySelectorAll('.cam-about .cam-apic').length >= 2 && r.d.querySelector('.cam-about .cam-apic.is-on'), 'about slideshow uses the Latest Photos (' + r.d.querySelectorAll('.cam-about .cam-apic').length + ')');
    ok(/Newman/.test(r.d.querySelector('.cam-about .cam-asign').textContent), 'about signature');
    ok(r.d.querySelector('.cam-events') && r.d.querySelector('.cam-events').hidden, 'events section waits hidden when the events page cannot load');

    console.log('chabadam: preview inner page');
    var inner = await load('chabadam', 'https://www.chabadam.org/templates/articlecco_cdo/aid/6780908/jewish/Services.htm?preview=1', { shell: CAM_INNER, wait: 900 });
    ok(projectRequests(inner).length === 1 && !inner.errors.length, 'layout.js loads on inner pages');
    ok(inner.logs.some(function (l) { return /running on inner page/.test(l); }), 'inner page log line');
    ok(inner.d.querySelector('.cam-footer') && !inner.d.querySelector('.cam-home'), 'inner page: header and footer only');

    var gone = await load('chabadam', HOME + '?preview=0', { shell: CAM_HOME, wait: 300 });
    ok(projectRequests(gone).length === 1, '?preview=0: still loads once live');
    var resp = await load('chabadam', 'https://www.chabadam.org/templates/ArticleCcoResponse/aid/7494889/jewish/x.htm?preview=1', { shell: CAM_INNER, wait: 300 });
    ok(projectRequests(resp).length === 0, 'form thank-you pages left alone');

    console.log('chabadam: Chanukah page (aid 7559974), preview only');
    var HC_URL = 'https://www.chabadam.org/templates/articlecco_cdo/aid/7559974/jewish/Chanukah-Events.htm';
    var HC_SHELL = CAM_INNER.replace('<div id="content">Article</div>',
      '<div id="content"><div id="BodyContainer" class="wrapper"><h1>Chanukah Events</h1><div class="co_body">old page</div></div></div>');
    await load('chabadam', HOME + '?preview=0', { shell: CAM_HOME, wait: 200 });
    var hcOff = await load('chabadam', HC_URL, { shell: HC_SHELL, wait: 900 });
    ok(!projectRequests(hcOff).some(function (u) { return /chanukah-2026/.test(u); }) && !hcOff.d.getElementById('hc') && !hcOff.d.getElementById('fc-cover'),
      'plain visitors: old Chanukah page untouched, no cover');
    var hc = await load('chabadam', HC_URL + '?preview=1', { shell: HC_SHELL, wait: 1500 });
    ok(projectRequests(hc).some(function (u) { return /chabadam\/chanukah-2026\.js\?v=/.test(u); }), '?preview=1: chanukah-2026.js loaded');
    ok(hc.d.getElementById('hc') && /hc-on/.test(hc.d.body.className), 'new page mounted');
    ok(!hc.d.getElementById('fc-cover'), 'cover removed after mount');
    ok(hc.errors.length === 0, 'no console errors ' + (hc.errors.length ? JSON.stringify(hc.errors) : ''));
    ok(hc.d.querySelector('.cam-footer'), 'site header/footer redesign still runs');
    ['hc-events', 'hc-light', 'hc-recipes', 'hc-story', 'hc-dreidel', 'hc-cards', 'hc-sponsor'].forEach(function (id) {
      ok(hc.d.getElementById(id), 'section #' + id);
    });
    ok(hc.d.querySelectorAll('.hc-ev').length === 3, 'three events');
    ok(hc.d.querySelector('.hc-ev a[href="https://www.eventbrite.com/e/2003755791512"]'), 'Light Up Allen RSVP link');
    ok(!/\.hc-evimg\{[^}]*background:/.test(hc.d.getElementById('hc-style').textContent), 'flyer box style does not reset the flyer picture');
    ok(hc.d.querySelectorAll('.hc-nights button').length === 8, 'eight nights in the guide');
    var b3 = hc.d.querySelector('.hc-nights button[data-n="3"]'); b3.click();
    ok(hc.d.querySelectorAll('#hcGuideM .hc-cand.has').length === 3, 'night 3: three candles placed');
    var placed = [].slice.call(hc.d.querySelectorAll('#hcGuideM .hc-cand.has')).map(function (g) { return +g.getAttribute('data-slot'); });
    ok(placed.join() === '5,6,7', 'candles placed from the right');
    ok(hc.d.querySelector('.hc-first').classList.contains('is-off'), 'Shehecheyanu hidden after the first night');
    hc.d.querySelector('.hc-rc[data-r="latkes"]').click();
    var dl = hc.d.getElementById('hc-dlg');
    ok(dl && /2 lb/.test(dl.textContent), 'latke recipe opens on the page');
    dl.querySelector('.hc-scale button[data-k="+"]').click(); dl.querySelector('.hc-scale button[data-k="+"]').click();
    ok(/2 2\/3 lb/.test(dl.textContent) && dl.querySelector('.hc-scale output').textContent === '8', 'recipe scales to 8 servings');
    var C = hc.w.HC2026_card;
    var round = C.decode(C.encode({ t: 'Sarah', m: 'Chag sameach חג שמח', f: 'Eli', d: 'gold' }));
    ok(round && round.t === 'Sarah' && /חג/.test(round.m) && round.d === 'gold', 'card link encodes and decodes (with Hebrew)');
    ok(C.decode('not-a-card') === null && C.decode(C.encode({ d: 'evil' })).d === 'night', 'bad card links are rejected or cleaned');
    var got = await load('chabadam', HC_URL + '?preview=1#card=' + C.encode({ t: 'Sarah', m: 'Hi', f: 'Eli', d: 'sky' }), { shell: HC_SHELL, wait: 1500 });
    ok(got.d.querySelector('#hc-dlg.is-open .hc-card.d-sky'), 'a shared card link opens the card');
    var rw = await load('chabadam', 'https://www.chabadam.org/templates/articlecco_cdo/aid/7559974/jewish/Chanukah-Events.htm/preview/1', { shell: HC_SHELL, wait: 1500 });
    ok(rw.d.getElementById('hc') && !rw.errors.length, 'preview also works when ChabadOne rewrites it to /preview/1');
    await load('chabadam', HOME + '?preview=0', { shell: CAM_HOME, wait: 200 });
  },
  riverside: async function () {
    var DRAFT = '7553387';
    console.log('riverside: draft Chanukah page');
    var r = await load('riverside', 'https://www.jewishriverside.com/templates/articlecco_cdo/aid/' + DRAFT + '/jewish/Draft.htm');
    ok(projectRequests(r).length === 1 && /riverside\/chanukah-2026\.js\?v=/.test(projectRequests(r)[0]), 'loader fetched chanukah-2026.js with version stamp');
    ok(r.d.getElementById('cf26'), 'template rendered');
    ok(!r.d.getElementById('cf26-cover'), 'cover removed after render');
    ok(r.errors.length === 0, 'no console errors ' + (r.errors.length ? JSON.stringify(r.errors) : ''));
    ok(r.logs.some(function (l) { return /\[footer-code\/riverside\].*aid 7553387 -> chanukah-2026\.js/.test(l); }), 'loader log line');
    ok(r.logs.some(function (l) { return /footer payload executing/.test(l); }), 'project log line');
    ['cf-top', 'cf-event', 'cf-sponsors', 'cf-about', 'cf-news', 'cf-guide', 'cf-share'].forEach(function (id) {
      ok(r.d.getElementById(id), 'section #' + id);
    });
    ok(r.d.querySelectorAll('#cf-guide .cf-gc').length === 3, 'guide falls back to fixed links when import fails');

    var r2 = await load('riverside', 'https://www.jewishriverside.com/article.asp?aid=' + DRAFT);
    ok(r2.d.getElementById('cf26'), 'article.asp?aid= form renders');

    var r3 = await load('riverside', 'https://www.jewishriverside.com/', { coScript: '<script>window.Co={ArticleId:\'' + DRAFT + '\'}</script>' });
    ok(r3.d.getElementById('cf26'), 'Co.ArticleId fallback renders');

    console.log('riverside: Sukkot page (past event, stays on)');
    var SUK = 'https://www.jewishriverside.com/templates/articlecco_cdo/aid/7457011/jewish/Sukkot.htm';
    /* the Sukkot overlay skins the native form, so give it the form's fields */
    var FORM = '<form><input id="input_2" type="submit"><input id="input_59"><input id="input_60">' +
      '<input id="first_62"><input id="last_62"><input id="input_72"><input id="input_73_full"></form>';
    var sk = await load('riverside', SUK, { coScript: FORM, wait: 900 });
    ok(projectRequests(sk).length === 1 && /riverside\/sukkot-5787\.js\?v=/.test(projectRequests(sk)[0]), 'loader fetched sukkot-5787.js');
    ok(sk.d.getElementById('hh26'), 'Sukkot overlay rendered');
    /* Sukkot keeps its cover under the full-screen overlay by design (same as when it was inline). */
    ok(sk.errors.length === 0, 'no console errors on Sukkot page ' + (sk.errors.length ? JSON.stringify(sk.errors) : ''));
    ok(sk.d.querySelectorAll('#hh26 .hh-tile').length >= 6, 'Sukkot tiles present (' + sk.d.querySelectorAll('#hh26 .hh-tile').length + ')');
    var skr = await load('riverside', 'https://www.jewishriverside.com/templates/ArticleCcoResponse/aid/7457011/jewish/Sukkot.htm', { wait: 300 });
    ok(projectRequests(skr).length === 1 && !skr.errors.length, 'Sukkot code also loads on its thank-you page');

    console.log('riverside: pages that must load nothing');
    var quiet = [
      ['https://www.jewishriverside.com/', 'site home'],
      ['https://www.jewishriverside.com/templates/section_cdo/aid/4949424/jewish/Chanukah-Festival-2026.htm', 'live festival page (not yet switched)'],
      ['https://www.jewishriverside.com/article.asp?aid=4194665', 'donate page'],
      ['https://www.jewishriverside.com/article.asp?aid=75533870', 'look-alike aid'],
      ['https://www.jewishriverside.com/templates/ArticleCcoResponse/aid/' + DRAFT, 'response page'],
      ['https://chanukahfestival.org/', 'brand domain (off during draft)']
    ];
    for (var i = 0; i < quiet.length; i++) {
      var q = await load('riverside', quiet[i][0], { wait: 250 });
      ok(projectRequests(q).length === 0 && !q.d.getElementById('cf26') && !q.d.getElementById('cf26-cover') && !q.errors.length,
        quiet[i][1] + ': nothing loaded');
    }
  }
};

(async function () {
  var only = process.argv[2];
  for (var site in SITES) {
    if (only && only !== site) continue;
    await SITES[site]();
  }
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
