/* ==========================================================================
   CHABAD OF ALLEN-MCKINNEY - CHANUKAH 2026 (one-page app)
   Page: Chanukah Events, aid 7559974. Loaded by chabadam/footer.js.

   Replaces the page body with one page that keeps everything on the site:
     hero (live menorah + countdown / tonight's candle) -> events (RSVP,
     tickets, add to calendar, map) -> how to light (night picker, menorah
     that lights in the right order, blessings, tonight's time for Allen) ->
     recipes (servings scaler, checklists, print) -> the Chanukah story ->
     dreidel game -> eCards (design, share by link / WhatsApp / email,
     download as image; a shared link opens the card on this page) -> sponsor.
   Registration and tickets still go to Eventbrite / the ticket site.
   ========================================================================== */
(function () {
  'use strict';
  var VERSION = '1.0.0';
  var AID = '7559974';

  /* ---- guard: this page only, once ---- */
  var here = /\/aid\/(\d+)/.exec(location.pathname);
  var aid = here ? here[1] : (window.Co && window.Co.ArticleId ? String(window.Co.ArticleId) : '');
  if (aid !== AID || window.HC2026) return;
  window.HC2026 = VERSION;

  /* ======================================================================
     CONTENT  (edit here)
     ====================================================================== */
  var PLACE = { name: 'Allen, TX', lat: 33.1032, lng: -96.6706, utc: -6 };   /* CST in December */
  var NIGHT1 = { y: 2026, m: 12, d: 4 };     /* first candle: Friday night, Dec 4 */
  var SPONSOR_URL = 'https://www.chabadam.org/chanukahsponsorship';
  var CONTACT_URL = '/templates/articlecco_cdo/aid/7298465/jewish/Contact-Us.htm';

  var EVENTS = [
    {
      title: 'Light Up Allen', sub: 'Grand menorah lighting', night: 5,
      date: [2026, 12, 8], dow: 'Tuesday', time: '5:00 PM', start: '170000', end: '183000',
      place: 'Watters Creek', city: 'Allen, TX', map: 'Watters Creek, Allen, TX',
      img: 'https://chabadam.org/media/images/1391/uqWd13916014.jpg',
      cta: 'RSVP', href: 'https://www.eventbrite.com/e/2003755791512',
      blurb: 'Join the whole community at Watters Creek for the lighting of the grand menorah, with music, latkes, donuts and gelt for the kids.'
    },
    {
      title: 'Chanukah Festival', sub: 'Downtown McKinney', night: 6,
      date: [2026, 12, 9], dow: 'Wednesday', time: '5:00 PM', start: '170000', end: '183000',
      place: 'Glen Mitchell Park', city: 'McKinney, TX', map: 'Glen Mitchell Park, McKinney, TX',
      img: 'https://01.myjewishpage.com/media/images/1391/xEDK13911737.jpg',
      cta: 'RSVP', href: 'https://www.eventbrite.com/e/2003755777470',
      blurb: 'A festival of lights in historic Downtown McKinney: menorah lighting, Chanukah treats and activities for all ages.'
    },
    {
      title: 'Chanukah at the Allen Americans', sub: 'Menorah lighting at the hockey game', night: 0,
      date: [2026, 12, 12], dow: 'Saturday', time: '7:00 PM', start: '190000', end: '213000',
      place: 'Credit Union of Texas Event Center', city: 'Allen, TX', map: 'Credit Union of Texas Event Center, Allen, TX',
      img: 'https://01.myjewishpage.com/media/images/1391/tSTZ13911738.jpg',
      cta: 'Buy tickets', href: 'https://www.gofevo.com/event/ChabadAllen.',
      blurb: 'Cheer on the Allen Americans and celebrate Chanukah together, with a menorah lighting at the game.'
    }
  ];

  var BLESSINGS = [
    {
      when: 'Every night',
      he: 'בָּרוּךְ אַתָּה אֲ-דֹנָ-י אֱ-לֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו, וְצִוָּנוּ לְהַדְלִיק נֵר חֲנֻכָּה.',
      tr: 'Baruch atah A-donai E-loheinu melech ha-olam, asher kideshanu bemitzvotav, vetzivanu lehadlik ner Chanukah.',
      en: 'Blessed are You, L-rd our G-d, King of the universe, who has sanctified us with His commandments, and commanded us to kindle the Chanukah light.'
    },
    {
      when: 'Every night',
      he: 'בָּרוּךְ אַתָּה אֲ-דֹנָ-י אֱ-לֹהֵינוּ מֶלֶךְ הָעוֹלָם, שֶׁעָשָׂה נִסִּים לַאֲבוֹתֵינוּ, בַּיָּמִים הָהֵם בִּזְּמַן הַזֶּה.',
      tr: 'Baruch atah A-donai E-loheinu melech ha-olam, she-asah nissim la-avoteinu, bayamim hahem bizman hazeh.',
      en: 'Blessed are You, L-rd our G-d, King of the universe, who performed miracles for our forefathers in those days, at this time.'
    },
    {
      when: 'First night only', first: true,
      he: 'בָּרוּךְ אַתָּה אֲ-דֹנָ-י אֱ-לֹהֵינוּ מֶלֶךְ הָעוֹלָם, שֶׁהֶחֱיָנוּ וְקִיְּמָנוּ וְהִגִּיעָנוּ לִזְמַן הַזֶּה.',
      tr: 'Baruch atah A-donai E-loheinu melech ha-olam, shehecheyanu vekiyemanu vehigianu lizman hazeh.',
      en: 'Blessed are You, L-rd our G-d, King of the universe, who has granted us life, sustained us, and enabled us to reach this occasion.'
    }
  ];

  /* amounts are numbers so the servings control can scale them */
  var RECIPES = [
    {
      id: 'latkes', title: 'Classic Potato Latkes', tag: 'The Chanukah classic', time: '45 min', serves: 6,
      color: '#C98A3E',
      blurb: 'Crisp, lacy edges and a tender middle. Fried in oil to remember the miracle of the oil.',
      ing: [[2, 'lb', 'russet potatoes, peeled'], [1, '', 'medium onion'], [2, '', 'large eggs'], [0.333, 'cup', 'flour or matzah meal'],
        [1, 'tsp', 'salt'], [0.25, 'tsp', 'black pepper'], [0.5, 'tsp', 'baking powder'], [0, '', 'Oil for frying']],
      steps: ['Grate the potatoes and onion on the large holes of a box grater (or with a food processor).',
        'Wrap in a clean towel and squeeze out as much liquid as you can. Let the liquid settle for a minute, pour it off, and add the white starch at the bottom back to the potatoes.',
        'Mix in the eggs, flour, salt, pepper and baking powder.',
        'Heat about 1/4 inch of oil in a large skillet over medium-high heat until a shred of potato sizzles right away.',
        'Drop heaping spoonfuls into the oil and flatten gently. Fry 3 to 4 minutes per side, until deep golden.',
        'Drain on paper towels and sprinkle with a little salt. Serve hot with applesauce or sour cream.']
    },
    {
      id: 'sufganiyot', title: 'Sufganiyot', tag: 'Jelly donuts', time: '2 hr 30 min', serves: 16,
      color: '#B5475A',
      blurb: 'Pillowy jelly-filled donuts dusted with powdered sugar, the sweet side of Chanukah.',
      ing: [[3.5, 'cups', 'all-purpose flour'], [0.25, 'cup', 'sugar'], [2.25, 'tsp', 'instant yeast'], [0.5, 'tsp', 'salt'],
        [1, 'cup', 'warm milk or water'], [2, '', 'large eggs'], [3, 'tbsp', 'soft butter or margarine'],
        [1, 'cup', 'strawberry jam'], [0, '', 'Oil for frying'], [0, '', 'Powdered sugar for dusting']],
      steps: ['Mix the flour, sugar, yeast and salt. Add the warm milk, eggs and butter and knead 8 to 10 minutes, until smooth and soft.',
        'Cover and let rise in a warm place until doubled, about 1 hour.',
        'Roll out 1/2 inch thick and cut 2 1/2-inch rounds. Place on a floured tray, cover, and let rise 30 minutes.',
        'Heat 2 inches of oil to 350°F. Fry a few at a time, 1 to 2 minutes per side, until golden. Drain on paper towels.',
        'When cool enough to handle, poke a hole in the side and pipe in about 1 tablespoon of jam.',
        'Dust generously with powdered sugar and serve the same day.']
    },
    {
      id: 'sweet-latkes', title: 'Sweet Potato Latkes', tag: 'A colorful twist', time: '35 min', serves: 4,
      color: '#D9773A',
      blurb: 'Sweet potato and a hint of cinnamon, crisp outside and creamy inside.',
      ing: [[1.5, 'lb', 'sweet potatoes, peeled'], [0.5, '', 'small onion'], [2, '', 'large eggs'], [0.25, 'cup', 'flour'],
        [0.5, 'tsp', 'cinnamon'], [0.75, 'tsp', 'salt'], [0, '', 'Oil for frying']],
      steps: ['Grate the sweet potatoes and onion and squeeze out the extra moisture.',
        'Stir in the eggs, flour, cinnamon and salt.',
        'Fry spoonfuls in 1/4 inch of hot oil, 3 minutes per side, until browned. These brown faster than potato latkes, so keep the heat at medium.',
        'Drain and serve warm, plain or with a spoon of yogurt and a drizzle of honey.']
    },
    {
      id: 'cheese', title: 'Ricotta Pancakes', tag: 'A dairy tradition', time: '25 min', serves: 4,
      color: '#8A6D3F',
      blurb: 'Many eat dairy on Chanukah to remember the heroism of Judith. These are light, lemony and quick.',
      ing: [[1, 'cup', 'ricotta cheese'], [2, '', 'large eggs'], [0.5, 'cup', 'flour'], [2, 'tbsp', 'sugar'],
        [1, 'tsp', 'baking powder'], [1, 'tsp', 'lemon zest'], [1, 'pinch', 'salt'], [0, '', 'Butter or oil for the pan']],
      steps: ['Whisk the ricotta and eggs until smooth.',
        'Stir in the flour, sugar, baking powder, lemon zest and salt just until combined.',
        'Heat a little butter or oil in a skillet over medium heat. Cook 1/4-cup scoops 2 to 3 minutes per side, until golden and set.',
        'Serve with berries, jam or a dusting of powdered sugar.']
    }
  ];

  var STORY = [
    { t: 'A decree against faith', p: 'More than two thousand years ago the Land of Israel was ruled by the Seleucid Greeks. King Antiochus set out to make the Jewish people give up the Torah: studying it, keeping Shabbat and other mitzvot were forbidden, and the Holy Temple in Jerusalem was filled with idols.' },
    { t: 'A few stood up', p: 'In the village of Modi’in, an elderly priest named Matityahu refused to bow to the idols. With his five sons, led by Judah the Maccabee, he gathered a small band of the faithful. Against one of the mightiest armies of the age, the few defeated the many.' },
    { t: 'Back to the Temple', p: 'The Maccabees returned to Jerusalem, cleared the Temple and rededicated it. The very word Chanukah means “dedication.”' },
    { t: 'One small jar', p: 'They wanted to light the Temple’s golden menorah, but found only one small jar of pure olive oil still sealed by the High Priest, enough for a single day.' },
    { t: 'Eight days of light', p: 'They lit it anyway, and the oil burned for eight days, until new pure oil could be prepared. The following year the Sages made these eight days a festival of praise and thanks.' },
    { t: 'Light it in the window', p: 'That is why we light the menorah every night of Chanukah, adding one more light each night, and place it where it can be seen from outside, to share the miracle with the world. A little light pushes away a lot of darkness.' }
  ];

  var DREIDEL = [
    { l: 'נ', n: 'Nun', w: 'Nes', r: 'Nothing happens. Next player!', s: 'Nothing happens', k: 'none' },
    { l: 'ג', n: 'Gimmel', w: 'Gadol', r: 'Gimmel! You take the whole pot.', s: 'Take the whole pot', k: 'all' },
    { l: 'ה', n: 'Hei', w: 'Hayah', r: 'Hei: you take half the pot.', s: 'Take half the pot', k: 'half' },
    { l: 'ש', n: 'Shin', w: 'Sham', r: 'Shin: put one piece in the pot.', s: 'Put one in the pot', k: 'put' }
  ];

  var CARD_THEMES = [
    { id: 'night', name: 'Midnight' },
    { id: 'gold', name: 'Gold' },
    { id: 'sky', name: 'Blue sky' }
  ];
  var CARD_MESSAGES = [
    'Wishing you a Chanukah filled with light, warmth and miracles.',
    'May the lights of Chanukah brighten your home and your heart.',
    'Happy Chanukah! Eight nights of joy to you and your family.',
    'A little light pushes away a lot of darkness. Chanukah Sameach!'
  ];

  /* ======================================================================
     HELPERS
     ====================================================================== */
  var AMP = String.fromCharCode(38);
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, AMP + 'amp;').replace(/</g, AMP + 'lt;')
      .replace(/>/g, AMP + 'gt;').replace(/"/g, AMP + 'quot;');
  }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOWS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* Allen-time "now" (the page is for Allen, whatever the visitor's clock zone) */
  function nowAllen() {
    var n = new Date();
    return new Date(n.getTime() + n.getTimezoneOffset() * 60000 + PLACE.utc * 3600000);
  }
  function dateOfNight(k) { return new Date(NIGHT1.y, NIGHT1.m - 1, NIGHT1.d + k - 1); }

  /* Sunset (minutes after local midnight), "Almanac for Computers" method;
     good to about a minute, which is why the page says "about". */
  function sunsetMinutes(dt) {
    var rad = Math.PI / 180, lat = PLACE.lat, lng = PLACE.lng;
    var start = new Date(dt.getFullYear(), 0, 0);
    var N = Math.round((new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()) - start) / 86400000);
    var lngHour = lng / 15, t = N + ((18 - lngHour) / 24);
    var M = 0.9856 * t - 3.289;
    var L = M + 1.916 * Math.sin(M * rad) + 0.020 * Math.sin(2 * M * rad) + 282.634;
    L = (L % 360 + 360) % 360;
    var RA = Math.atan(0.91764 * Math.tan(L * rad)) / rad;
    RA = (RA % 360 + 360) % 360;
    RA += Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90;
    RA /= 15;
    var sinDec = 0.39782 * Math.sin(L * rad), cosDec = Math.cos(Math.asin(sinDec));
    var cosH = (Math.cos(90.833 * rad) - sinDec * Math.sin(lat * rad)) / (cosDec * Math.cos(lat * rad));
    var H = Math.acos(cosH) / rad / 15;
    var T = H + RA - 0.06571 * t - 6.622;
    var UT = ((T - lngHour) % 24 + 24) % 24;
    var local = ((UT + PLACE.utc) % 24 + 24) % 24;
    return Math.round(local * 60);
  }
  function clock(min) {
    var h = Math.floor(min / 60), m = min % 60, ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (!h) h = 12;
    return h + ':' + pad(m) + ' ' + ap;
  }
  /* when to light on night k */
  function lightingNote(k) {
    var d = dateOfNight(k), dow = d.getDay(), ss = sunsetMinutes(d);
    if (dow === 5) return { short: 'Before Shabbat candles', long: 'It’s Friday: light the menorah first, then Shabbat candles (about ' + clock(ss - 18) + ' in Allen). Use candles big enough to burn until 30 minutes after nightfall.' };
    if (dow === 6) return { short: 'After Shabbat ends', long: 'It’s Saturday night: wait until Shabbat is over, make Havdalah, then light the menorah.' };
    return { short: 'After sunset, about ' + clock(ss), long: 'Light after sunset (about ' + clock(ss) + ' in Allen). The candles should burn for at least 30 minutes after nightfall.' };
  }
  /* which night is it in Allen right now? 0 before, 1-8 during, 9 after */
  function currentNight() {
    var n = nowAllen(), mins = n.getHours() * 60 + n.getMinutes();
    for (var k = 8; k >= 1; k--) {
      var d = dateOfNight(k);
      var lightFrom = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0);
      lightFrom.setMinutes(sunsetMinutes(d) - 60);    /* "tonight" from late afternoon */
      if (n >= lightFrom) return { night: k, tonight: mins >= sunsetMinutes(d) - 60 && sameDay(n, d) };
    }
    return { night: 0 };
  }
  function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

  function frac(x) {
    if (!x) return '';
    var whole = Math.floor(x + 1e-9), rest = x - whole, best = '', diff = 1;
    [[0, ''], [0.125, '1/8'], [0.25, '1/4'], [0.333, '1/3'], [0.5, '1/2'], [0.667, '2/3'], [0.75, '3/4'], [1, '']].forEach(function (f) {
      if (Math.abs(rest - f[0]) < diff) { diff = Math.abs(rest - f[0]); best = f; }
    });
    if (best[0] === 1) { whole += 1; best = [0, '']; }
    if (diff > 0.07) return (Math.round(x * 100) / 100).toString();
    return (whole ? whole + (best[1] ? ' ' : '') : '') + best[1];
  }

  /* card payload <-> URL-safe text (works with Hebrew / emoji) */
  function encodeCard(o) {
    var s = JSON.stringify({ t: o.t || '', m: o.m || '', f: o.f || '', d: o.d || 'night' });
    var b = btoa(unescape(encodeURIComponent(s)));
    return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodeCard(str) {
    try {
      var b = str.replace(/-/g, '+').replace(/_/g, '/');
      while (b.length % 4) b += '=';
      var o = JSON.parse(decodeURIComponent(escape(atob(b))));
      return { t: String(o.t || '').slice(0, 60), m: String(o.m || '').slice(0, 280), f: String(o.f || '').slice(0, 60),
        d: /^(night|gold|sky)$/.test(o.d) ? o.d : 'night' };
    } catch (e) { return null; }
  }
  window.HC2026_card = { encode: encodeCard, decode: decodeCard };   /* for tests */

  /* ======================================================================
     MENORAH (Chabad style: straight diagonal branches)
     ====================================================================== */
  var SLOT_X = [30, 70, 110, 150, 230, 270, 310, 350];   /* 8 lights, left to right */
  function menorahSVG(id) {
    var arms = '', cups = '', candles = '';
    for (var i = 0; i < 8; i++) {
      var x = SLOT_X[i];
      arms += '<line x1="190" y1="190" x2="' + x + '" y2="70" class="hc-arm"/>';
      cups += '<rect x="' + (x - 9) + '" y="62" width="18" height="8" rx="2" class="hc-cup"/>';
      candles += '<g class="hc-cand" data-slot="' + i + '"><rect x="' + (x - 5) + '" y="22" width="10" height="40" rx="2" class="hc-wax"/>' +
        '<g class="hc-flame" transform="translate(' + x + ',18)"><ellipse rx="10" ry="16" class="hc-glow"/><path d="M0,-12 C6,-4 6,4 0,8 C-6,4 -6,-4 0,-12Z" class="hc-fire"/></g></g>';
    }
    var sham = '<g class="hc-cand hc-sham" data-slot="s"><rect x="185" y="-6" width="10" height="40" rx="2" class="hc-wax"/>' +
      '<g class="hc-flame" transform="translate(190,-10)"><ellipse rx="10" ry="16" class="hc-glow"/><path d="M0,-12 C6,-4 6,4 0,8 C-6,4 -6,-4 0,-12Z" class="hc-fire"/></g></g>';
    return '<svg class="hc-menorah" id="' + id + '" viewBox="0 -34 380 280" role="img" aria-label="Menorah">' +
      '<defs><radialGradient id="' + id + '-g"><stop offset="0" stop-color="#FFE7A3" stop-opacity=".95"/><stop offset="1" stop-color="#FFB547" stop-opacity="0"/></radialGradient></defs>' +
      arms + '<line x1="190" y1="34" x2="190" y2="226" class="hc-stem"/>' +
      '<rect x="181" y="26" width="18" height="8" rx="2" class="hc-cup"/>' + cups +
      '<path d="M150 236 Q190 214 230 236 Z" class="hc-base"/><rect x="140" y="234" width="100" height="8" rx="4" class="hc-base"/>' +
      candles + sham + '</svg>';
  }
  /* show night n: candles in the n right-most places; lit = how many are lit (newest first) */
  function setMenorah(svg, n, lit, shamLit) {
    if (!svg) return;
    $$('.hc-cand', svg).forEach(function (g) {
      var s = g.getAttribute('data-slot');
      if (s === 's') { g.setAttribute('class', 'hc-cand hc-sham' + (shamLit ? ' is-lit' : '')); return; }
      var i = +s, has = i >= 8 - n;
      var order = i - (8 - n);                 /* 0 = newest (left-most) candle, lit first */
      g.setAttribute('class', 'hc-cand' + (has ? ' has' : '') + (has && order < lit ? ' is-lit' : ''));
      g.style.setProperty('--d', (order * 0.35) + 's');
    });
  }

  /* ======================================================================
     STYLES
     ====================================================================== */
  var NAVY = '#14345E', NIGHTC = '#0B1A33', GOLD = '#AB8C57', GOLDL = '#D6BD8E', CREAM = '#F7F5F0';
  var SERIF = "Newsreader,Georgia,'Times New Roman',serif";
  var SANS = "'Instrument Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif";
  var HEB = "'Frank Ruhl Libre','David Libre','Times New Roman',serif";
  var CSS = [
    /* host page: hide the old body, keep site header/footer */
    'html body.hc-on #content #BodyContainer{display:none}',
    'html body.hc-on #hc *{box-sizing:border-box}',
    '#hc{font-family:' + SANS + ';color:#1E2B3C;background:' + CREAM + ';font-size:16px;line-height:1.6;text-align:left;-webkit-font-smoothing:antialiased}',
    '#hc h1,#hc h2,#hc h3,#hc h4,#hc p,#hc ul,#hc ol,#hc figure{margin:0;padding:0;border:0;background:none;text-transform:none;letter-spacing:normal}',
    '#hc a{text-decoration:none}',
    '#hc button{font-family:' + SANS + ';cursor:pointer;border:0;background:none;padding:0;margin:0;color:inherit;line-height:1.2;text-transform:none;box-shadow:none;border-radius:0;height:auto;width:auto;min-width:0}',
    '#hc img{max-width:100%;border:0;height:auto;margin:0;padding:0}',
    '#hc .hc-in{max-width:1180px;margin:0 auto;padding:0 40px}',
    '#hc .hc-sec{padding:96px 0;position:relative}',
    '#hc .hc-eyebrow{display:block;font-size:12px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:' + GOLD + ';margin:0 0 14px}',
    '#hc .hc-h2{font-family:' + SERIF + ';font-weight:300;font-size:50px;line-height:1.05;letter-spacing:-.02em;color:' + NAVY + ';margin:0 0 16px}',
    '#hc .hc-lede{font-size:18px;color:#5B6878;max-width:640px;margin:0 0 44px}',
    '#hc .hc-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;height:50px;padding:0 26px;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;transition:transform .2s ease,background-color .2s ease,color .2s ease,box-shadow .2s ease}',
    '#hc .hc-btn:hover{transform:translateY(-1px)}',
    '#hc .hc-btn-gold{background:linear-gradient(135deg,#E9C77E,#C79A4B);color:' + NIGHTC + ';box-shadow:0 10px 30px rgba(201,154,75,.35)}',
    '#hc .hc-btn-navy{background:' + NAVY + ';color:#fff}',
    '#hc .hc-btn-navy:hover{background:' + NIGHTC + '}',
    '#hc .hc-btn-line{border:1px solid rgba(20,52,94,.25);color:' + NAVY + ';background:#fff}',
    '#hc .hc-btn-line:hover{border-color:' + NAVY + '}',
    '#hc .hc-btn-ghost{border:1px solid rgba(255,255,255,.35);color:#fff}',
    '#hc .hc-btn-ghost:hover{background:rgba(255,255,255,.1)}',
    '#hc .hc-btn svg{flex:0 0 auto}',

    /* hero */
    '#hc .hc-hero{position:relative;overflow:hidden;color:#fff;background:radial-gradient(120% 90% at 50% 0%,#1D3F70 0%,' + NIGHTC + ' 58%,#060F20 100%);padding:150px 0 0}',
    '#hc .hc-stars{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(1.5px 1.5px at 12% 22%,rgba(255,255,255,.8),transparent),radial-gradient(1px 1px at 28% 60%,rgba(255,255,255,.6),transparent),radial-gradient(1.2px 1.2px at 46% 18%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 63% 42%,rgba(255,255,255,.5),transparent),radial-gradient(1.6px 1.6px at 78% 14%,rgba(255,255,255,.8),transparent),radial-gradient(1px 1px at 90% 58%,rgba(255,255,255,.55),transparent),radial-gradient(1.2px 1.2px at 6% 70%,rgba(255,255,255,.5),transparent),radial-gradient(1px 1px at 54% 76%,rgba(255,255,255,.4),transparent);opacity:.9}',
    '#hc .hc-hgrid{position:relative;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:40px;align-items:end}',
    '#hc .hc-hcopy{padding-bottom:110px}',
    '#hc .hc-hero .hc-eyebrow{color:' + GOLDL + '}',
    '#hc .hc-h1{font-family:' + SERIF + ';font-weight:300;font-size:84px;line-height:.98;letter-spacing:-.03em;color:#fff;margin:0 0 22px}',
    '#hc .hc-h1 em{font-style:italic;color:' + GOLDL + '}',
    '#hc .hc-hlede{font-size:19px;line-height:1.6;color:rgba(255,255,255,.8);max-width:520px;margin:0 0 30px}',
    '#hc .hc-count{display:flex;gap:12px;margin:0 0 34px}',
    '#hc .hc-count div{min-width:78px;padding:14px 10px;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);text-align:center;backdrop-filter:blur(6px)}',
    '#hc .hc-count b{display:block;font-family:' + SERIF + ';font-weight:400;font-size:34px;line-height:1;color:#fff}',
    '#hc .hc-count span{display:block;margin-top:6px;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.6)}',
    '#hc .hc-tonight{display:inline-flex;align-items:center;gap:12px;padding:10px 18px 10px 12px;border-radius:999px;background:rgba(233,199,126,.12);border:1px solid rgba(233,199,126,.35);color:#F3DDA8;font-size:15px;margin:0 0 30px}',
    '#hc .hc-tonight i{display:inline-block;width:10px;height:10px;border-radius:50%;background:#FFC75A;box-shadow:0 0 12px #FFC75A}',
    '#hc .hc-hbtns{display:flex;flex-wrap:wrap;gap:12px}',
    '#hc .hc-hart{position:relative;align-self:end}',
    '#hc .hc-hart .hc-menorah{display:block;width:100%;max-width:560px;margin:0 auto -6px;filter:drop-shadow(0 30px 60px rgba(0,0,0,.45))}',
    '#hc .hc-hart:before{content:"";position:absolute;left:10%;right:10%;top:0;height:60%;background:radial-gradient(closest-side,rgba(255,190,90,.28),transparent);pointer-events:none}',

    /* menorah drawing */
    '#hc .hc-arm{stroke:url(#hcGold);stroke:#D9B46A;stroke-width:6;stroke-linecap:round}',
    '#hc .hc-stem{stroke:#D9B46A;stroke-width:9;stroke-linecap:round}',
    '#hc .hc-cup,#hc .hc-base{fill:#D9B46A}',
    '#hc .hc-light .hc-arm,#hc .hc-light .hc-stem{stroke:#B48A45}',
    '#hc .hc-light .hc-cup,#hc .hc-light .hc-base{fill:#B48A45}',
    '#hc .hc-cand{opacity:0;transition:opacity .4s ease}',
    '#hc .hc-cand.has,#hc .hc-cand.hc-sham{opacity:1}',
    '#hc .hc-wax{fill:#F4F1EA;stroke:rgba(0,0,0,.08);stroke-width:1}',
    '#hc .hc-sham .hc-wax{fill:#FFF8E6}',
    '#hc .hc-flame{opacity:0;transition:opacity .5s ease}',
    '#hc .hc-cand.is-lit .hc-flame{opacity:1;transition-delay:var(--d,0s)}',
    '#hc .hc-glow{fill:#FFC75A;opacity:.35;filter:blur(4px)}',
    '#hc .hc-fire{fill:#FFD36E;stroke:#FF9A2E;stroke-width:1.2}',
    '#hc .hc-cand.is-lit .hc-fire{animation:hcFlick 1.6s ease-in-out infinite;transform-origin:0 8px}',

    /* sticky section nav */
    '#hc .hc-nav{position:sticky;top:0;z-index:50;background:rgba(247,245,240,.92);backdrop-filter:blur(10px);border-bottom:1px solid rgba(20,52,94,.1)}',
    '#hc .hc-nav .hc-in{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-top:12px;padding-bottom:12px}',
    '#hc .hc-nav .hc-in::-webkit-scrollbar{display:none}',
    '#hc .hc-nav a{flex:0 0 auto;display:inline-flex;align-items:center;height:40px;padding:0 18px;border-radius:999px;font-size:13.5px;font-weight:600;color:' + NAVY + ';white-space:nowrap;transition:background-color .2s ease,color .2s ease}',
    '#hc .hc-nav a:hover{background:rgba(20,52,94,.07)}',
    '#hc .hc-nav a.is-on{background:' + NAVY + ';color:#fff}',

    /* events */
    '#hc .hc-evgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}',
    '#hc .hc-ev{display:flex;flex-direction:column;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 1px 0 rgba(20,52,94,.06),0 22px 50px rgba(20,52,94,.08);transition:transform .25s ease,box-shadow .25s ease}',
    '#hc .hc-ev:hover{transform:translateY(-4px);box-shadow:0 1px 0 rgba(20,52,94,.06),0 30px 60px rgba(20,52,94,.14)}',
    '#hc .hc-evimg{position:relative;display:block;aspect-ratio:4/5;background:' + NIGHTC + ' center/cover no-repeat}',
    '#hc .hc-evdate{position:absolute;left:18px;top:18px;width:68px;padding:10px 0 9px;border-radius:14px;background:rgba(255,255,255,.95);text-align:center;color:' + NAVY + ';box-shadow:0 8px 20px rgba(0,0,0,.18)}',
    '#hc .hc-evdate small{display:block;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:' + GOLD + '}',
    '#hc .hc-evdate b{display:block;font-family:' + SERIF + ';font-size:32px;font-weight:400;line-height:1}',
    '#hc .hc-evnight{position:absolute;right:18px;top:18px;padding:7px 12px;border-radius:999px;background:rgba(11,26,51,.78);color:#F3DDA8;font-size:11.5px;font-weight:600;letter-spacing:.08em}',
    '#hc .hc-evbody{display:flex;flex-direction:column;flex:1;padding:24px 24px 26px}',
    '#hc .hc-evbody h3{font-family:' + SERIF + ';font-weight:400;font-size:27px;line-height:1.12;color:' + NAVY + ';margin:0 0 4px}',
    '#hc .hc-evsub{font-size:14px;font-weight:600;color:' + GOLD + ';margin:0 0 12px}',
    '#hc .hc-evbody p{font-size:15px;color:#5B6878;margin:0 0 18px}',
    '#hc .hc-evmeta{display:grid;gap:8px;margin:auto 0 20px;font-size:14.5px;color:#1E2B3C}',
    '#hc .hc-evmeta div{display:flex;gap:10px;align-items:flex-start}',
    '#hc .hc-evmeta svg{flex:0 0 18px;margin-top:2px;color:' + GOLD + '}',
    '#hc .hc-evmeta a{color:' + NAVY + ';text-decoration:underline;text-underline-offset:3px}',
    '#hc .hc-evbtns{display:grid;grid-template-columns:1fr;gap:10px}',
    '#hc .hc-evbtns .hc-btn{width:100%}',
    '#hc .hc-evcal{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '#hc .hc-evcal a{display:flex;align-items:center;justify-content:center;gap:8px;height:42px;border-radius:999px;background:' + CREAM + ';color:' + NAVY + ';font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}',
    '#hc .hc-evcal a:hover{background:#EFE8DA}',

    /* sponsor strip */
    '#hc .hc-sponsor{margin-top:56px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:28px;align-items:center;padding:30px 34px;border-radius:22px;background:linear-gradient(120deg,' + NAVY + ',' + NIGHTC + ');color:#fff}',
    '#hc .hc-sponsor h3{font-family:' + SERIF + ';font-weight:300;font-size:30px;line-height:1.1;color:#fff;margin:0 0 6px}',
    '#hc .hc-sponsor p{color:rgba(255,255,255,.75);font-size:15.5px}',
    '#hc .hc-sponsor .hc-sicon{width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(233,199,126,.14);color:#F3DDA8}',

    /* how to light */
    '#hc .hc-light{background:#fff}',
    '#hc .hc-lgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:56px;align-items:start}',
    '#hc .hc-nights{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;margin:0 0 26px}',
    '#hc .hc-nights button{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0;border-radius:14px;border:1px solid rgba(20,52,94,.14);background:#fff;color:' + NAVY + ';transition:all .2s ease}',
    '#hc .hc-nights button b{font-family:' + SERIF + ';font-size:22px;font-weight:400;line-height:1}',
    '#hc .hc-nights button small{font-size:10.5px;letter-spacing:.06em;color:#5B6878}',
    '#hc .hc-nights button:hover{border-color:' + NAVY + '}',
    '#hc .hc-nights button.is-on{background:' + NAVY + ';border-color:' + NAVY + ';color:#fff}',
    '#hc .hc-nights button.is-on small{color:' + GOLDL + '}',
    '#hc .hc-nights button.is-today:after{content:"Tonight";font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:' + GOLD + ';margin-top:2px}',
    '#hc .hc-nights button.is-on.is-today:after{color:#F3DDA8}',
    '#hc .hc-stage{position:sticky;top:90px;padding:26px 26px 22px;border-radius:24px;background:radial-gradient(110% 100% at 50% 0%,#1D3F70,' + NIGHTC + ');color:#fff;text-align:center}',
    '#hc .hc-stage .hc-menorah{width:100%;max-width:440px;display:block;margin:0 auto 10px}',
    '#hc .hc-stage h3{font-family:' + SERIF + ';font-weight:300;font-size:30px;color:#fff;margin:0 0 4px}',
    '#hc .hc-stage p{color:rgba(255,255,255,.72);font-size:15px;margin:0 0 18px}',
    '#hc .hc-stage .hc-btns{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}',
    '#hc .hc-when{display:flex;gap:14px;align-items:flex-start;padding:18px 20px;border-radius:16px;background:' + CREAM + ';margin:0 0 26px}',
    '#hc .hc-when svg{flex:0 0 22px;color:' + GOLD + ';margin-top:2px}',
    '#hc .hc-when b{display:block;color:' + NAVY + ';font-size:16px;margin:0 0 2px}',
    '#hc .hc-when span{font-size:15px;color:#5B6878}',
    '#hc .hc-steps{list-style:none;counter-reset:s;margin:0 0 34px}',
    '#hc .hc-steps li{counter-increment:s;position:relative;padding:0 0 18px 50px;font-size:16px;color:#1E2B3C}',
    '#hc .hc-steps li:before{content:counter(s);position:absolute;left:0;top:-2px;width:34px;height:34px;border-radius:50%;background:rgba(171,140,87,.14);color:' + GOLD + ';font-weight:700;display:flex;align-items:center;justify-content:center;font-size:14px}',
    '#hc .hc-steps li.is-now{color:' + NAVY + ';font-weight:600}',
    '#hc .hc-steps li.is-now:before{background:' + GOLD + ';color:#fff}',
    '#hc .hc-bless{border-top:1px solid rgba(20,52,94,.1)}',
    '#hc .hc-bl{padding:22px 0;border-bottom:1px solid rgba(20,52,94,.1)}',
    '#hc .hc-bl.is-off{display:none}',
    '#hc .hc-bl small{display:block;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:' + GOLD + ';margin:0 0 10px}',
    '#hc .hc-he{font-family:' + HEB + ';font-size:25px;line-height:1.7;color:' + NAVY + ';direction:rtl;text-align:right;margin:0 0 10px;letter-spacing:0;word-spacing:normal}',
    '#hc .hc-tr{font-size:16px;font-style:italic;color:#1E2B3C;margin:0 0 6px}',
    '#hc .hc-en{font-size:14.5px;color:#5B6878}',
    '#hc .hc-tabs{display:inline-flex;padding:4px;border-radius:999px;background:' + CREAM + ';margin:0 0 6px}',
    '#hc .hc-tabs button{height:34px;padding:0 16px;border-radius:999px;font-size:12.5px;font-weight:600;color:' + NAVY + '}',
    '#hc .hc-tabs button.is-on{background:#fff;box-shadow:0 2px 8px rgba(20,52,94,.12)}',
    '#hc .hc-bless.no-tr .hc-tr,#hc .hc-bless.no-en .hc-en,#hc .hc-bless.no-he .hc-he{display:none}',

    /* recipes */
    '#hc .hc-rgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}',
    '#hc .hc-rc{position:relative;display:flex;flex-direction:column;text-align:left;border-radius:22px;overflow:hidden;background:#fff;box-shadow:0 18px 40px rgba(20,52,94,.08);transition:transform .25s ease}',
    '#hc .hc-rc:hover{transform:translateY(-4px)}',
    '#hc .hc-rart{position:relative;height:150px;display:flex;align-items:center;justify-content:center;color:#fff}',
    '#hc .hc-rart svg{width:74px;height:74px;opacity:.95}',
    '#hc .hc-rc .hc-rtxt{padding:20px 20px 22px}',
    '#hc .hc-rc small{display:block;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:' + GOLD + ';margin:0 0 6px}',
    '#hc .hc-rc h3{font-family:' + SERIF + ';font-weight:400;font-size:24px;line-height:1.15;color:' + NAVY + ';margin:0 0 8px}',
    '#hc .hc-rc p{font-size:14.5px;color:#5B6878;margin:0 0 14px}',
    '#hc .hc-rc .hc-rmeta{font-size:12.5px;font-weight:600;color:' + NAVY + '}',

    /* dialog (recipes, received card) */
    '#hc-dlg{position:fixed;inset:0;z-index:2147480000;display:flex;align-items:flex-end;justify-content:center;background:rgba(6,15,32,.55);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .25s ease}',
    '#hc-dlg.is-open{opacity:1;pointer-events:auto}',
    '#hc-dlg .hc-dbox{position:relative;width:100%;max-width:780px;max-height:92vh;overflow:auto;background:#fff;border-radius:26px 26px 0 0;padding:34px 40px 40px;transform:translateY(30px);transition:transform .3s ease;font-family:' + SANS + ';color:#1E2B3C;font-size:16px;line-height:1.6}',
    '#hc-dlg.is-open .hc-dbox{transform:none}',
    '@media (min-width:768px){#hc-dlg{align-items:center}#hc-dlg .hc-dbox{border-radius:26px}}',
    '#hc-dlg .hc-x{position:absolute;right:18px;top:18px;width:42px;height:42px;border-radius:50%;background:' + CREAM + ';color:' + NAVY + ';display:flex;align-items:center;justify-content:center;border:0;cursor:pointer}',
    '#hc-dlg h3{font-family:' + SERIF + ';font-weight:300;font-size:38px;line-height:1.1;color:' + NAVY + ';margin:0 0 8px}',
    '#hc-dlg .hc-dsub{color:#5B6878;margin:0 0 22px}',
    '#hc-dlg .hc-scale{display:flex;align-items:center;gap:12px;margin:0 0 20px;font-weight:600;color:' + NAVY + '}',
    '#hc-dlg .hc-scale button{width:38px;height:38px;border-radius:50%;border:1px solid rgba(20,52,94,.2);background:#fff;color:' + NAVY + ';font-size:20px;line-height:1;cursor:pointer}',
    '#hc-dlg .hc-scale output{min-width:30px;text-align:center;font-family:' + SERIF + ';font-size:24px}',
    '#hc-dlg .hc-dcols{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:36px}',
    '#hc-dlg h4{font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:' + GOLD + ';margin:0 0 12px}',
    '#hc-dlg .hc-ing{list-style:none;margin:0;padding:0}',
    '#hc-dlg .hc-ing label{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid rgba(20,52,94,.08);cursor:pointer;font-size:15.5px}',
    '#hc-dlg .hc-ing input{margin-top:5px;accent-color:' + NAVY + '}',
    '#hc-dlg .hc-ing input:checked+span{text-decoration:line-through;color:#9AA3AE}',
    '#hc-dlg .hc-ing b{color:' + NAVY + '}',
    '#hc-dlg ol{margin:0;padding:0 0 0 20px}',
    '#hc-dlg ol li{margin:0 0 12px;padding-left:4px;font-size:15.5px}',
    '#hc-dlg .hc-dbtns{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}',

    /* story */
    '#hc .hc-story{background:' + NIGHTC + ';color:#fff;overflow:hidden}',
    '#hc .hc-story .hc-h2{color:#fff}',
    '#hc .hc-story .hc-lede{color:rgba(255,255,255,.7)}',
    '#hc .hc-chap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;counter-reset:c}',
    '#hc .hc-chap article{counter-increment:c;position:relative;padding:26px 22px;border-radius:20px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09)}',
    '#hc .hc-chap article:before{content:counter(c);display:block;font-family:' + SERIF + ';font-size:44px;line-height:1;color:' + GOLDL + ';margin:0 0 14px;opacity:.85}',
    '#hc .hc-chap h3{font-family:' + SERIF + ';font-weight:400;font-size:21px;line-height:1.2;color:#fff;margin:0 0 10px}',
    '#hc .hc-chap p{font-size:14.5px;line-height:1.65;color:rgba(255,255,255,.72)}',
    '#hc .hc-quote{margin:48px auto 0;max-width:760px;text-align:center;font-family:' + SERIF + ';font-style:italic;font-weight:300;font-size:30px;line-height:1.3;color:#F3DDA8}',

    /* dreidel */
    '#hc .hc-dgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:56px;align-items:center}',
    '#hc .hc-dbox2{position:relative;padding:34px;border-radius:26px;background:#fff;box-shadow:0 22px 50px rgba(20,52,94,.08);text-align:center}',
    '#hc .hc-dreidel{width:170px;height:170px;margin:6px auto 18px;perspective:600px}',
    '#hc .hc-dtop{width:100%;height:100%;border-radius:26px;background:linear-gradient(145deg,#2A5591,' + NAVY + ');display:flex;align-items:center;justify-content:center;font-family:' + HEB + ';font-size:96px;color:#F3DDA8;box-shadow:inset 0 -10px 20px rgba(0,0,0,.25),0 18px 30px rgba(20,52,94,.25);transition:transform 1.6s cubic-bezier(.2,.8,.2,1)}',
    '#hc .hc-dres{min-height:52px;font-size:17px;color:' + NAVY + ';margin:0 0 16px}',
    '#hc .hc-dres b{display:block;font-family:' + SERIF + ';font-size:24px;font-weight:400}',
    '#hc .hc-score{display:flex;justify-content:center;gap:12px;margin:0 0 20px}',
    '#hc .hc-score div{min-width:110px;padding:10px 14px;border-radius:14px;background:' + CREAM + '}',
    '#hc .hc-score b{display:block;font-family:' + SERIF + ';font-size:28px;font-weight:400;color:' + NAVY + ';line-height:1.1}',
    '#hc .hc-score span{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:' + GOLD + '}',
    '#hc .hc-letters{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:26px 0 0}',
    '#hc .hc-letters div{padding:16px 10px;border-radius:16px;background:#fff;text-align:center;box-shadow:0 8px 20px rgba(20,52,94,.06)}',
    '#hc .hc-letters b{display:block;font-family:' + HEB + ';font-size:40px;color:' + NAVY + ';line-height:1.1}',
    '#hc .hc-letters span{display:block;font-size:13px;font-weight:600;color:' + NAVY + '}',
    '#hc .hc-letters small{display:block;font-size:12.5px;color:#5B6878}',

    /* ecards */
    '#hc .hc-cards{background:#fff}',
    '#hc .hc-cgrid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:56px;align-items:start}',
    '#hc .hc-field{display:block;margin:0 0 16px}',
    '#hc .hc-field span{display:block;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:' + NAVY + ';margin:0 0 8px}',
    '#hc .hc-field input,#hc .hc-field textarea,#hc .hc-field select{display:block;width:100%;height:auto;min-height:0;padding:13px 16px;border:1px solid rgba(20,52,94,.18);border-radius:14px;background:#fff;font-family:' + SANS + ';font-size:16px;color:#1E2B3C;box-shadow:none;margin:0;line-height:1.4;outline:none}',
    '#hc .hc-field textarea{min-height:110px;resize:vertical}',
    '#hc .hc-cform .hc-field.is-hidden{display:none}',
    '#hc .hc-field input:focus,#hc .hc-field textarea:focus,#hc .hc-field select:focus{border-color:' + NAVY + ';box-shadow:0 0 0 3px rgba(20,52,94,.1)}',
    '#hc .hc-themes{display:flex;gap:10px;margin:0 0 18px}',
    '#hc .hc-themes button{flex:1;height:54px;border-radius:14px;border:2px solid transparent;font-size:12.5px;font-weight:600;color:#fff}',
    '#hc .hc-themes button.is-on{border-color:' + GOLD + ';box-shadow:0 0 0 3px rgba(171,140,87,.2)}',
    '#hc .hc-themes [data-d=night]{background:linear-gradient(135deg,#1D3F70,' + NIGHTC + ')}',
    '#hc .hc-themes [data-d=gold]{background:linear-gradient(135deg,#F3DDA8,#C79A4B);color:' + NIGHTC + '}',
    '#hc .hc-themes [data-d=sky]{background:linear-gradient(135deg,#9CC7F0,#3D78C2)}',
    '#hc .hc-share{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}',
    '#hc .hc-note{font-size:13.5px;color:#5B6878;margin-top:12px;min-height:20px}',
    '.hc-card{position:relative;aspect-ratio:5/4;border-radius:24px;overflow:hidden;padding:38px 40px;display:flex;flex-direction:column;justify-content:flex-end;box-shadow:0 30px 60px rgba(11,26,51,.25)}',
    '.hc-card .hc-menorah{position:absolute;left:50%;top:7%;width:46%;transform:translateX(-50%)}',
    '.hc-card .hc-ct{position:relative;font-family:' + SANS + ';font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;margin:0 0 8px}',
    '.hc-card .hc-cm{position:relative;font-family:' + SERIF + ';font-weight:300;font-size:27px;line-height:1.25;margin:0 0 12px;white-space:pre-wrap;word-wrap:break-word}',
    '.hc-card .hc-cf{position:relative;font-family:' + SERIF + ';font-style:italic;font-size:18px}',
    '.hc-card .hc-cb{position:absolute;right:28px;top:24px;font-family:' + SERIF + ';font-style:italic;font-size:22px;opacity:.9}',
    '.hc-card.d-night{background:radial-gradient(120% 90% at 50% 0%,#1D3F70,' + NIGHTC + ' 70%);color:#fff}',
    '.hc-card.d-night .hc-ct,.hc-card.d-night .hc-cb{color:' + GOLDL + '}',
    '.hc-card.d-gold{background:linear-gradient(160deg,#FFF8E8,#F1DDB0);color:' + NIGHTC + '}',
    '.hc-card.d-gold .hc-ct,.hc-card.d-gold .hc-cb{color:#8A6D3F}',
    '.hc-card.d-sky{background:linear-gradient(170deg,#D9ECFF,#7FB2E8);color:' + NIGHTC + '}',
    '.hc-card.d-sky .hc-ct,.hc-card.d-sky .hc-cb{color:' + NAVY + '}',
    '.hc-card.d-gold .hc-arm,.hc-card.d-gold .hc-stem,.hc-card.d-sky .hc-arm,.hc-card.d-sky .hc-stem{stroke:#B48A45}',
    '.hc-card.d-gold .hc-cup,.hc-card.d-gold .hc-base,.hc-card.d-sky .hc-cup,.hc-card.d-sky .hc-base{fill:#B48A45}',
    '.hc-card .hc-cand{opacity:1}.hc-card .hc-flame{opacity:1}',
    '.hc-card .hc-wax{fill:#F4F1EA}.hc-card .hc-glow{fill:#FFC75A;opacity:.35}.hc-card .hc-fire{fill:#FFD36E;stroke:#FF9A2E;stroke-width:1.2}',
    '.hc-card .hc-arm{stroke:#D9B46A;stroke-width:6;stroke-linecap:round}.hc-card .hc-stem{stroke:#D9B46A;stroke-width:9;stroke-linecap:round}.hc-card .hc-cup,.hc-card .hc-base{fill:#D9B46A}',

    /* final strip */
    '#hc .hc-end{background:radial-gradient(120% 120% at 50% 100%,#1D3F70,' + NIGHTC + ' 70%);color:#fff;text-align:center;padding:90px 0}',
    '#hc .hc-end h2{font-family:' + SERIF + ';font-weight:300;font-size:56px;line-height:1.05;color:#fff;margin:0 0 14px}',
    '#hc .hc-end h2 em{color:' + GOLDL + '}',
    '#hc .hc-end p{color:rgba(255,255,255,.75);font-size:18px;margin:0 auto 28px;max-width:560px}',
    '#hc .hc-end .hc-hbtns{justify-content:center}',

    /* reveal on scroll */
    '#hc .hc-rv{opacity:0;transform:translateY(18px);transition:opacity .7s ease,transform .7s ease}',
    '#hc .hc-rv.is-in{opacity:1;transform:none}',

    /* responsive */
    '@media (max-width:1100px){',
    '#hc .hc-h1{font-size:68px}',
    '#hc .hc-rgrid{grid-template-columns:repeat(2,minmax(0,1fr))}',
    '#hc .hc-chap{grid-template-columns:repeat(2,minmax(0,1fr))}',
    '}',
    '@media (max-width:900px){',
    '#hc .hc-hgrid,#hc .hc-lgrid,#hc .hc-dgrid,#hc .hc-cgrid{grid-template-columns:1fr}',
    '#hc .hc-hcopy{padding-bottom:10px}',
    '#hc .hc-hart .hc-menorah{max-width:420px}',
    '#hc .hc-evgrid{grid-template-columns:1fr;max-width:520px;margin:0 auto}',
    '#hc .hc-stage{position:relative;top:0;order:-1}',
    '#hc .hc-sponsor{grid-template-columns:1fr;text-align:left}',
    '#hc-dlg .hc-dcols{grid-template-columns:1fr;gap:20px}',
    '}',
    '@media (max-width:767px){',
    '#hc .hc-in{padding:0 20px}',
    '#hc .hc-sec{padding:60px 0}',
    '#hc .hc-hero{padding-top:110px}',
    '#hc .hc-h1{font-size:48px}',
    '#hc .hc-hlede{font-size:17px}',
    '#hc .hc-h2{font-size:36px}',
    '#hc .hc-lede{font-size:16px;margin-bottom:28px}',
    '#hc .hc-count div{min-width:0;flex:1;padding:12px 4px}',
    '#hc .hc-count b{font-size:26px}',
    '#hc .hc-nights{grid-template-columns:repeat(4,minmax(0,1fr))}',
    '#hc .hc-rgrid{grid-template-columns:1fr}',
    '#hc .hc-chap{grid-template-columns:1fr}',
    '#hc .hc-quote{font-size:23px}',
    '#hc .hc-he{font-size:22px}',
    '#hc .hc-letters{grid-template-columns:repeat(2,minmax(0,1fr))}',
    '#hc .hc-end h2{font-size:40px}',
    '#hc-dlg .hc-dbox{padding:28px 22px 30px}',
    '#hc-dlg h3{font-size:30px}',
    '.hc-card{padding:24px 24px;border-radius:18px}',
    '.hc-card .hc-cm{font-size:20px}',
    '.hc-card .hc-cb{display:none}',
    '.hc-card .hc-menorah{width:40%;top:6%}',
    '}'
  ];
  var CSS_RAW = [
    '@keyframes hcFlick{0%,100%{transform:scale(1,1) rotate(-1deg)}30%{transform:scale(.94,1.06) rotate(2deg)}60%{transform:scale(1.04,.95) rotate(-2deg)}}',
    '@media print{html body.hc-on #header,html body.hc-on #footer,html body.hc-on .cam-footer,html body.hc-on #hc{display:none}#hc-dlg{position:static;background:none}#hc-dlg .hc-dbox{max-height:none;box-shadow:none}#hc-dlg .hc-x,#hc-dlg .hc-dbtns,#hc-dlg .hc-scale button{display:none}}'
  ];
  /* every declaration !important, so the theme can't override the page */
  function important(css) {
    return css.replace(/([^{};]+:[^{};]+?)\s*(;|\})/g, function (m, decl, end) {
      if (/!important\s*$/.test(decl) || /^\s*(from|to|\d+%)/.test(decl)) return m;
      return decl + ' !important' + end;
    });
  }
  function scope(rule) {
    /* raise #hc rules above the theme's id-based rules */
    return rule.replace(/(^|,|\})\s*#hc(?=[\s.{:#\[])/g, '$1html body #hc').replace(/(^|,|\})\s*#hc-dlg/g, '$1html body #hc-dlg')
      .replace(/(^|,|\})\s*\.hc-card/g, '$1html body .hc-card');
  }
  function addStyles() {
    var s = el('style'); s.id = 'hc-style';
    s.appendChild(document.createTextNode(important(CSS.map(scope).join('\n')) + '\n' + CSS_RAW.join('\n')));
    document.head.appendChild(s);
    var f = el('link'); f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500' + AMP +
      'family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400' + AMP +
      'family=Instrument+Sans:wght@400;500;600;700' + AMP + 'display=swap';
    document.head.appendChild(f);
  }

  /* ======================================================================
     ICONS
     ====================================================================== */
  function ico(name, size) {
    var s = size || 18, p = {
      cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
      pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      arrow: '<path d="M4 12h15M14 6l6 6-6 6"/>',
      x: '<path d="M6 6l12 12M18 6L6 18"/>',
      heart: '<path d="M12 20s-7-4.4-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.6-9.3 9-9.3 9z"/>',
      link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
      wa: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z"/><path d="M9 9.5c.3 2 2.3 4.2 4.6 4.8l1-1.1 1.8.8c-.2 1-1 1.7-2 1.7C10.8 15.7 8 13 8 9.6c0-1 .7-1.8 1.7-2l.8 1.8z"/>',
      dl: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
      print: '<path d="M7 9V3h10v6M7 17H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-3"/><rect x="7" y="14" width="10" height="7"/>',
      flame: '<path d="M12 3c3 4 6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 10 8 8.5 9 6c.8 2 2 3 3 3.5 0-2.5-.5-4.5 0-6.5z"/>',
      pan: '<ellipse cx="12" cy="17" rx="8" ry="2.6"/><ellipse cx="12" cy="13" rx="7" ry="2.4"/><ellipse cx="12" cy="9.2" rx="6" ry="2.2"/><path d="M10 5.5c.6-1 1.4-1 2 0s1.4 1 2 0"/>',
      donut: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M6 8l1 1M17 7l-1 1M8 17l1-1M16 16.5l.5.5"/>',
      cake: '<path d="M4 20h16v-7H4z"/><path d="M4 15c2 1.5 4 1.5 6 0s4-1.5 6 0 2.6 1.3 4 0M12 13V9"/><path d="M12 4c1 1.2 1 2.4 0 3.2-1-.8-1-2 0-3.2z"/>'
    }[name] || '';
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  /* ======================================================================
     CALENDAR LINKS
     ====================================================================== */
  function ymd(a) { return a[0] + pad(a[1]) + pad(a[2]); }
  function googleCal(e) {
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' + AMP + 'text=' + encodeURIComponent(e.title) +
      AMP + 'dates=' + ymd(e.date) + 'T' + e.start + '/' + ymd(e.date) + 'T' + e.end + AMP + 'ctz=America/Chicago' +
      AMP + 'location=' + encodeURIComponent(e.place + ', ' + e.city) + AMP + 'details=' + encodeURIComponent(e.sub + '. ' + e.href);
  }
  function appleCal(e) {
    var nl = String.fromCharCode(13, 10);
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Chabad of Allen-McKinney//Chanukah 2026//EN', 'BEGIN:VEVENT',
      'UID:' + ymd(e.date) + '-' + e.title.replace(/[^A-Za-z0-9]/g, '') + '@chabadam.org',
      'DTSTAMP:' + ymd(e.date) + 'T000000', 'DTSTART;TZID=America/Chicago:' + ymd(e.date) + 'T' + e.start,
      'DTEND;TZID=America/Chicago:' + ymd(e.date) + 'T' + e.end, 'SUMMARY:' + e.title,
      'LOCATION:' + (e.place + ' ' + e.city).replace(/[,;]/g, ' '), 'DESCRIPTION:' + (e.sub + ' ' + e.href).replace(/[,;]/g, ' '),
      'URL:' + e.href, 'END:VEVENT', 'END:VCALENDAR'].join(nl);
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  }
  function mapLink(e) { return 'https://www.google.com/maps/search/?api=1' + AMP + 'query=' + encodeURIComponent(e.map); }

  /* ======================================================================
     BUILD
     ====================================================================== */
  function section(id, cls, inner) { return '<section class="hc-sec ' + (cls || '') + '" id="' + id + '">' + inner + '</section>'; }

  function heroHTML() {
    return '<header class="hc-hero"><div class="hc-stars"></div><div class="hc-in hc-hgrid">' +
      '<div class="hc-hcopy">' +
      '<span class="hc-eyebrow">Chabad of Allen' + String.fromCharCode(8209) + 'McKinney · Chanukah 5787</span>' +
      '<h1 class="hc-h1">Eight nights of <em>light</em></h1>' +
      '<p class="hc-hlede">Celebrate with us across Allen and McKinney, and bring Chanukah home: light the menorah step by step, cook the classics, play dreidel and send a card, all right here.</p>' +
      '<div class="hc-hstate"></div>' +
      '<div class="hc-hbtns"><a class="hc-btn hc-btn-gold" href="#hc-events">See the events ' + ico('arrow', 16) + '</a>' +
      '<a class="hc-btn hc-btn-ghost" href="#hc-light">How to light</a></div></div>' +
      '<div class="hc-hart">' + menorahSVG('hcHeroM') + '</div></div></header>';
  }

  function navHTML() {
    var items = [['hc-events', 'Events'], ['hc-light', 'Light the Menorah'], ['hc-recipes', 'Recipes'], ['hc-story', 'The Story'],
      ['hc-dreidel', 'Dreidel'], ['hc-cards', 'Send a Card'], ['hc-sponsor', 'Sponsor']];
    return '<nav class="hc-nav" aria-label="Chanukah sections"><div class="hc-in">' +
      items.map(function (i) { return '<a href="#' + i[0] + '" data-t="' + i[0] + '">' + i[1] + '</a>'; }).join('') + '</div></nav>';
  }

  function eventsHTML() {
    var cards = EVENTS.map(function (e) {
      var d = new Date(e.date[0], e.date[1] - 1, e.date[2]);
      return '<article class="hc-ev hc-rv">' +
        '<a class="hc-evimg" href="' + esc(e.href) + '" target="_blank" rel="noopener" style="background-image:url(\'' + esc(e.img) + '\')" aria-label="' + esc(e.title) + '">' +
        '<span class="hc-evdate"><small>' + MONTHS[d.getMonth()].slice(0, 3) + '</small><b>' + d.getDate() + '</b></span>' +
        (e.night ? '<span class="hc-evnight">Night ' + e.night + ' of Chanukah</span>' : '') + '</a>' +
        '<div class="hc-evbody"><h3>' + esc(e.title) + '</h3><div class="hc-evsub">' + esc(e.sub) + '</div>' +
        '<p>' + esc(e.blurb) + '</p>' +
        '<div class="hc-evmeta"><div>' + ico('clock') + '<span>' + e.dow + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ' · ' + e.time + '</span></div>' +
        '<div>' + ico('pin') + '<span><a href="' + esc(mapLink(e)) + '" target="_blank" rel="noopener">' + esc(e.place) + '</a>, ' + esc(e.city) + '</span></div></div>' +
        '<div class="hc-evbtns"><a class="hc-btn hc-btn-navy" href="' + esc(e.href) + '" target="_blank" rel="noopener">' + esc(e.cta) + ' ' + ico('arrow', 16) + '</a>' +
        '<div class="hc-evcal"><a href="' + esc(googleCal(e)) + '" target="_blank" rel="noopener">' + ico('cal', 15) + ' Google</a>' +
        '<a href="' + esc(appleCal(e)) + '" download="' + esc(e.title.replace(/[^A-Za-z0-9 ]/g, '')) + '.ics">' + ico('cal', 15) + ' Apple</a></div></div>' +
        '</div></article>';
    }).join('');
    return section('hc-events', '', '<div class="hc-in"><span class="hc-eyebrow">Celebrate together</span>' +
      '<h2 class="hc-h2">Chanukah events</h2><p class="hc-lede">Three community celebrations of the Festival of Lights. Chanukah begins Friday night, December 4.</p>' +
      '<div class="hc-evgrid">' + cards + '</div>' +
      '<div class="hc-sponsor hc-rv" id="hc-sponsor"><div class="hc-sicon">' + ico('heart', 28) + '</div>' +
      '<div><h3>Sponsor a night of Chanukah</h3><p>Help light up Allen and McKinney. Your sponsorship brings the menorah, latkes, donuts and gelt to hundreds of families.</p></div>' +
      '<a class="hc-btn hc-btn-gold" href="' + esc(SPONSOR_URL) + '" target="_blank" rel="noopener">Become a sponsor ' + ico('arrow', 16) + '</a></div></div>');
  }

  function lightHTML() {
    var nights = '';
    for (var k = 1; k <= 8; k++) {
      var d = dateOfNight(k);
      nights += '<button type="button" data-n="' + k + '"><b>' + k + '</b><small>' + DOWS[d.getDay()].slice(0, 3) + ' ' + d.getDate() + '</small></button>';
    }
    var bless = BLESSINGS.map(function (b, i) {
      return '<div class="hc-bl' + (b.first ? ' hc-first' : '') + '"><small>' + (i + 1) + ' · ' + b.when + '</small>' +
        '<p class="hc-he" lang="he" dir="rtl">' + b.he + '</p><p class="hc-tr">' + esc(b.tr) + '</p><p class="hc-en">' + esc(b.en) + '</p></div>';
    }).join('');
    return section('hc-light', 'hc-light', '<div class="hc-in"><span class="hc-eyebrow">Step by step</span>' +
      '<h2 class="hc-h2">Light the menorah</h2><p class="hc-lede">Pick a night to see where the candles go, the order to light them, the blessings and when to light in Allen.</p>' +
      '<div class="hc-lgrid"><div>' +
      '<div class="hc-nights" role="tablist">' + nights + '</div>' +
      '<div class="hc-when">' + ico('clock', 22) + '<div><b class="hc-whenh"></b><span class="hc-whent"></span></div></div>' +
      '<ol class="hc-steps"></ol>' +
      '<span class="hc-eyebrow">The blessings</span>' +
      '<div class="hc-tabs" role="group" aria-label="Show"><button type="button" class="is-on" data-v="all">All</button><button type="button" data-v="he">Hebrew</button><button type="button" data-v="tr">Transliteration</button><button type="button" data-v="en">English</button></div>' +
      '<div class="hc-bless">' + bless + '</div></div>' +
      '<div class="hc-stage">' + menorahSVG('hcGuideM') +
      '<h3 class="hc-stitle"></h3><p class="hc-ssub"></p>' +
      '<div class="hc-btns"><button type="button" class="hc-btn hc-btn-gold hc-play">' + ico('flame', 16) + ' Light it</button>' +
      '<button type="button" class="hc-btn hc-btn-ghost hc-reset">Reset</button></div></div></div></div>');
  }

  function recipeArt(r) {
    var i = { latkes: 'pan', sufganiyot: 'donut', 'sweet-latkes': 'pan', cheese: 'cake' }[r.id] || 'pan';
    return '<div class="hc-rart" style="background:radial-gradient(120% 120% at 30% 20%,' + r.color + ',' + NIGHTC + ')">' + ico(i, 74) + '</div>';
  }
  function recipesHTML() {
    return section('hc-recipes', '', '<div class="hc-in"><span class="hc-eyebrow">In the kitchen</span>' +
      '<h2 class="hc-h2">Chanukah recipes</h2><p class="hc-lede">Foods fried in oil remember the miracle of the oil. Open a recipe to scale it for your crowd, check off ingredients and print.</p>' +
      '<div class="hc-rgrid">' + RECIPES.map(function (r) {
        return '<button type="button" class="hc-rc hc-rv" data-r="' + r.id + '">' + recipeArt(r) +
          '<div class="hc-rtxt"><small>' + esc(r.tag) + '</small><h3>' + esc(r.title) + '</h3><p>' + esc(r.blurb) + '</p>' +
          '<span class="hc-rmeta">' + esc(r.time) + ' · serves ' + r.serves + '</span></div></button>';
      }).join('') + '</div></div>');
  }

  function storyHTML() {
    return section('hc-story', 'hc-story', '<div class="hc-in"><span class="hc-eyebrow">The Chanukah story</span>' +
      '<h2 class="hc-h2">A little light, a great miracle</h2><p class="hc-lede">The story behind the eight nights, in six short chapters.</p>' +
      '<div class="hc-chap">' + STORY.map(function (s) {
        return '<article class="hc-rv"><h3>' + esc(s.t) + '</h3><p>' + esc(s.p) + '</p></article>';
      }).join('') + '</div>' +
      '<p class="hc-quote hc-rv">“A little light pushes away a lot of darkness.”</p></div>');
  }

  function dreidelHTML() {
    return section('hc-dreidel', '', '<div class="hc-in hc-dgrid"><div>' +
      '<span class="hc-eyebrow">For kids of all ages</span><h2 class="hc-h2">Spin the dreidel</h2>' +
      '<p class="hc-lede">Each side of the dreidel has a Hebrew letter. Together they stand for <em>Nes Gadol Hayah Sham</em>: “a great miracle happened there.” Everyone starts with ten pieces of gelt and puts one in the pot. Take turns spinning!</p>' +
      '<div class="hc-letters">' + DREIDEL.map(function (d) {
        return '<div><b lang="he">' + d.l + '</b><span>' + d.n + '</span><small>' + esc(d.s) + '</small></div>';
      }).join('') + '</div></div>' +
      '<div class="hc-dbox2 hc-rv"><div class="hc-score"><div><b class="hc-me">10</b><span>Your gelt</span></div><div><b class="hc-pot">2</b><span>The pot</span></div></div>' +
      '<div class="hc-dreidel"><div class="hc-dtop" lang="he">' + DREIDEL[0].l + '</div></div>' +
      '<p class="hc-dres" aria-live="polite">Tap spin to play.</p>' +
      '<div class="hc-hbtns" style="justify-content:center"><button type="button" class="hc-btn hc-btn-navy hc-spin">Spin</button>' +
      '<button type="button" class="hc-btn hc-btn-line hc-new">New game</button></div></div></div>');
  }

  function cardsHTML() {
    return section('hc-cards', 'hc-cards', '<div class="hc-in"><span class="hc-eyebrow">Spread the light</span>' +
      '<h2 class="hc-h2">Send a Chanukah card</h2><p class="hc-lede">Pick a design and write a note. Send it by WhatsApp or email, or copy the link: it opens your card right here on our site.</p>' +
      '<div class="hc-cgrid"><form class="hc-cform" onsubmit="return false">' +
      '<div class="hc-themes">' + CARD_THEMES.map(function (t, i) {
        return '<button type="button" data-d="' + t.id + '"' + (i ? '' : ' class="is-on"') + '>' + t.name + '</button>';
      }).join('') + '</div>' +
      '<label class="hc-field"><span>To</span><input type="text" maxlength="60" name="t" placeholder="Their name"></label>' +
      '<label class="hc-field"><span>Message</span><select name="pick">' + CARD_MESSAGES.map(function (m, i) {
        return '<option value="' + i + '">' + esc(m) + '</option>';
      }).join('') + '<option value="own">Write my own...</option></select></label>' +
      '<label class="hc-field hc-own is-hidden"><span>Your message</span><textarea name="m" maxlength="280"></textarea></label>' +
      '<label class="hc-field"><span>From</span><input type="text" maxlength="60" name="f" placeholder="Your name"></label>' +
      '<div class="hc-share"><button type="button" class="hc-btn hc-btn-navy" data-s="wa">' + ico('wa', 17) + ' WhatsApp</button>' +
      '<button type="button" class="hc-btn hc-btn-line" data-s="mail">' + ico('mail', 17) + ' Email</button>' +
      '<button type="button" class="hc-btn hc-btn-line" data-s="copy">' + ico('link', 17) + ' Copy link</button>' +
      '<button type="button" class="hc-btn hc-btn-line" data-s="dl">' + ico('dl', 17) + ' Save image</button></div>' +
      '<p class="hc-note" aria-live="polite"></p></form>' +
      '<div class="hc-cprev"></div></div></div>');
  }

  function endHTML() {
    return '<section class="hc-end"><div class="hc-in"><h2>Chanukah <em>Sameach!</em></h2>' +
      '<p>From our family to yours, may the lights of Chanukah fill your home with warmth and joy.</p>' +
      '<div class="hc-hbtns"><a class="hc-btn hc-btn-gold" href="#hc-events">Join an event</a>' +
      '<a class="hc-btn hc-btn-ghost" href="' + esc(CONTACT_URL) + '">Contact us</a></div></div></section>';
  }

  function cardHTML(o) {
    var to = o.t ? 'Dear ' + o.t : 'Happy Chanukah';
    return '<div class="hc-card d-' + esc(o.d) + '">' + menorahSVG('hcCard' + Math.floor(Math.random() * 1e6)) +
      '<span class="hc-cb">Chanukah Sameach</span>' +
      '<div class="hc-ct">' + esc(to) + '</div><div class="hc-cm">' + esc(o.m) + '</div>' +
      (o.f ? '<div class="hc-cf">— ' + esc(o.f) + '</div>' : '') + '</div>';
  }

  /* ======================================================================
     BEHAVIOUR
     ====================================================================== */
  var app, dlg;

  function heroState() {
    var box = $('.hc-hstate', app), svg = $('#hcHeroM', app);
    var cur = currentNight();
    if (cur.night >= 1 && cur.night <= 8) {
      setMenorah(svg, cur.night, cur.night, true);
      box.innerHTML = '<div class="hc-tonight"><i></i>' + (cur.tonight ? 'Tonight: light ' : 'Today: night ') +
        (cur.tonight ? cur.night + ' candle' + (cur.night > 1 ? 's' : '') + ' · ' + lightingNote(cur.night).short : cur.night + ' of Chanukah') + '</div>';
      return;
    }
    setMenorah(svg, 8, 8, true);
    if (cur.night === 0) {
      var target = dateOfNight(1); target.setMinutes(sunsetMinutes(target) - 18);
      var tick = function () {
        var ms = target - nowAllen();
        if (ms < 0) { heroState(); return; }
        var d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
        box.innerHTML = '<div class="hc-count" aria-label="Countdown to the first candle"><div><b>' + d + '</b><span>Days</span></div><div><b>' + h + '</b><span>Hours</span></div><div><b>' + m + '</b><span>Min</span></div><div><b>' + s + '</b><span>Sec</span></div></div>';
      };
      tick(); setInterval(tick, 1000);
    } else {
      box.innerHTML = '<div class="hc-tonight"><i></i>Chanukah 5787 has ended. See you next year!</div>';
    }
  }

  /* ---- menorah guide ---- */
  var guide = { n: 1, timer: null };
  function stepsFor(n) {
    var s = ['Place the menorah by a window or the doorway, where it can be seen from outside.',
      'Put ' + n + ' candle' + (n > 1 ? 's' : '') + ' in the menorah, starting from the right' + (n > 1 ? ' and moving left (the newest candle goes on the left)' : '') + '. Add the shamash, the helper candle, in its raised place.',
      'Light the shamash and hold it as you say the blessings' + (n === 1 ? ' (three blessings tonight)' : '') + '.',
      n > 1 ? 'Light the candles from left to right: the newest candle first.' : 'Light the candle.',
      'Return the shamash to its place, and enjoy the lights. Sing, spin a dreidel, tell the story!'];
    return s;
  }
  function setNight(n, play) {
    guide.n = n;
    clearTimeout(guide.timer);
    $$('.hc-nights button', app).forEach(function (b) { b.classList.toggle('is-on', +b.getAttribute('data-n') === n); });
    var d = dateOfNight(n), note = lightingNote(n);
    $('.hc-whenh', app).textContent = 'Night ' + n + ': ' + DOWS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
    $('.hc-whent', app).textContent = note.long;
    $('.hc-steps', app).innerHTML = stepsFor(n).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    $('.hc-stitle', app).textContent = 'Night ' + n;
    $('.hc-ssub', app).textContent = n + ' candle' + (n > 1 ? 's' : '') + ' + the shamash';
    $$('.hc-first', app).forEach(function (b) { b.classList.toggle('is-off', n !== 1); });
    setMenorah($('#hcGuideM', app), n, 0, false);
    if (play) playLight();
  }
  function playLight() {
    var svg = $('#hcGuideM', app), n = guide.n, k = 0, steps = $$('.hc-steps li', app);
    clearTimeout(guide.timer);
    setMenorah(svg, n, 0, false);
    steps.forEach(function (li) { li.classList.remove('is-now'); });
    if (steps[2]) steps[2].classList.add('is-now');
    guide.timer = setTimeout(function next() {
      if (k === 0) { setMenorah(svg, n, 0, true); }
      else { setMenorah(svg, n, k, true); }
      if (k === 1 && steps[3]) { steps[2].classList.remove('is-now'); steps[3].classList.add('is-now'); }
      k++;
      if (k <= n) guide.timer = setTimeout(next, REDUCED ? 50 : 700);
      else if (steps[3]) guide.timer = setTimeout(function () { steps[3].classList.remove('is-now'); if (steps[4]) steps[4].classList.add('is-now'); }, 900);
    }, REDUCED ? 50 : 500);
  }
  function wireGuide() {
    $$('.hc-nights button', app).forEach(function (b) {
      b.addEventListener('click', function () { setNight(+b.getAttribute('data-n'), true); });
    });
    $('.hc-play', app).addEventListener('click', playLight);
    $('.hc-reset', app).addEventListener('click', function () { setNight(guide.n, false); });
    $$('.hc-tabs button', app).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-v'), box = $('.hc-bless', app);
        $$('.hc-tabs button', app).forEach(function (x) { x.classList.toggle('is-on', x === b); });
        box.className = 'hc-bless' + (v === 'all' ? '' : ['he', 'tr', 'en'].filter(function (k) { return k !== v; }).map(function (k) { return ' no-' + k; }).join(''));
      });
    });
    var cur = currentNight();
    var start = cur.night >= 1 && cur.night <= 8 ? cur.night : 1;
    var tb = $('.hc-nights button[data-n="' + start + '"]', app);
    if (cur.night >= 1 && cur.night <= 8 && tb) tb.classList.add('is-today');
    setNight(start, false);
  }

  /* ---- dialog ---- */
  function openDialog(html) {
    if (!dlg) {
      dlg = el('div'); dlg.id = 'hc-dlg'; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true');
      dlg.innerHTML = '<div class="hc-dbox"><button type="button" class="hc-x" aria-label="Close">' + ico('x', 20) + '</button><div class="hc-dcont"></div></div>';
      document.body.appendChild(dlg);
      dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('.hc-x')) closeDialog(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDialog(); });
    }
    $('.hc-dcont', dlg).innerHTML = html;
    dlg.offsetWidth;
    dlg.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    var x = $('.hc-x', dlg); if (x && x.focus) x.focus();
    return dlg;
  }
  function closeDialog() {
    if (!dlg) return;
    dlg.classList.remove('is-open');
    document.documentElement.style.overflow = '';
  }

  /* ---- recipes ---- */
  function openRecipe(id) {
    var r = RECIPES.filter(function (x) { return x.id === id; })[0];
    if (!r) return;
    var serves = r.serves;
    function ingList(mult) {
      return r.ing.map(function (i, k) {
        var amt = i[0] ? frac(i[0] * mult) : '';
        return '<li><label><input type="checkbox"><span>' + (amt ? '<b>' + amt + (i[1] ? ' ' + i[1] : '') + '</b> ' : '') + esc(i[2]) + '</span></label></li>';
      }).join('');
    }
    var d = openDialog('<span class="hc-eyebrow" style="display:block;font-size:12px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:' + GOLD + ';margin:0 0 10px">' + esc(r.tag) + '</span>' +
      '<h3>' + esc(r.title) + '</h3><p class="hc-dsub">' + esc(r.blurb) + ' · ' + esc(r.time) + '</p>' +
      '<div class="hc-scale">Serves <button type="button" data-k="-" aria-label="Fewer">−</button><output>' + serves + '</output><button type="button" data-k="+" aria-label="More">+</button></div>' +
      '<div class="hc-dcols"><div><h4>Ingredients</h4><ul class="hc-ing">' + ingList(1) + '</ul></div>' +
      '<div><h4>Directions</h4><ol>' + r.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></div></div>' +
      '<div class="hc-dbtns"><button type="button" class="hc-btn hc-btn-navy hc-print">' + ico('print', 16) + ' Print recipe</button></div>');
    $$('.hc-scale button', d).forEach(function (b) {
      b.addEventListener('click', function () {
        var step = r.serves >= 12 ? 4 : 1;
        serves = Math.max(step, serves + (b.getAttribute('data-k') === '+' ? step : -step));
        $('.hc-scale output', d).textContent = serves;
        $('.hc-ing', d).innerHTML = ingList(serves / r.serves);
      });
    });
    $('.hc-print', d).addEventListener('click', function () { window.print(); });
  }

  /* ---- dreidel ---- */
  function wireDreidel() {
    var me = 10, pot = 2, spinning = false, turns = 0;
    var top = $('.hc-dtop', app), res = $('.hc-dres', app);
    function show() { $('.hc-me', app).textContent = me; $('.hc-pot', app).textContent = pot; }
    $('.hc-spin', app).addEventListener('click', function () {
      if (spinning) return;
      if (me <= 0) { res.innerHTML = '<b>Out of gelt!</b>Start a new game.'; return; }
      spinning = true;
      if (pot === 0) { me -= 1; pot += 2; }          /* everyone antes again when the pot is empty */
      var pick = DREIDEL[Math.floor(Math.random() * 4)];
      turns += 1;
      top.style.transform = 'rotateY(' + (turns * 1440 + Math.floor(Math.random() * 40) - 20) + 'deg)';
      res.textContent = 'Spinning...';
      setTimeout(function () {
        top.textContent = pick.l;
        if (pick.k === 'all') { me += pot; pot = 0; }
        else if (pick.k === 'half') { var h = Math.ceil(pot / 2); me += h; pot -= h; }
        else if (pick.k === 'put') { me -= 1; pot += 1; }
        res.innerHTML = '<b>' + pick.n + ' · ' + pick.w + '</b>' + esc(pick.r);
        show(); spinning = false;
      }, REDUCED ? 100 : 1600);
    });
    $('.hc-new', app).addEventListener('click', function () { me = 10; pot = 2; show(); res.textContent = 'New game! Tap spin to play.'; });
  }

  /* ---- ecards ---- */
  var cardState = { t: '', m: CARD_MESSAGES[0], f: '', d: 'night' };
  function cardLink(o) {
    return location.protocol + '//' + location.host + location.pathname + '#card=' + encodeCard(o);
  }
  function drawCardPNG(o, cb) {
    var W = 1200, H = 960, c = document.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, W, H);
    var dark = o.d === 'night';
    if (o.d === 'night') { g.addColorStop(0, '#1D3F70'); g.addColorStop(1, NIGHTC); }
    else if (o.d === 'gold') { g.addColorStop(0, '#FFF8E8'); g.addColorStop(1, '#F1DDB0'); }
    else { g.addColorStop(0, '#D9ECFF'); g.addColorStop(1, '#7FB2E8'); }
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    /* menorah */
    var gold = dark ? '#D9B46A' : '#B48A45', ox = 340, oy = 70, sc = 1.38;
    x.save(); x.translate(ox, oy); x.scale(sc, sc);
    x.strokeStyle = gold; x.lineCap = 'round'; x.lineWidth = 6;
    SLOT_X.forEach(function (sx) { x.beginPath(); x.moveTo(190, 190); x.lineTo(sx, 70); x.stroke(); });
    x.lineWidth = 9; x.beginPath(); x.moveTo(190, 34); x.lineTo(190, 226); x.stroke();
    x.fillStyle = gold; x.fillRect(140, 234, 100, 8);
    SLOT_X.concat([190]).forEach(function (sx) {
      var top = sx === 190 ? -6 : 22;
      x.fillStyle = gold; x.fillRect(sx - 9, sx === 190 ? 26 : 62, 18, 8);
      x.fillStyle = '#F4F1EA'; x.fillRect(sx - 5, top, 10, 40);
      var fy = top - 6, rg = x.createRadialGradient(sx, fy, 1, sx, fy, 22);
      rg.addColorStop(0, 'rgba(255,215,120,.9)'); rg.addColorStop(1, 'rgba(255,180,70,0)');
      x.fillStyle = rg; x.beginPath(); x.arc(sx, fy, 22, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#FFD36E'; x.beginPath(); x.ellipse(sx, fy, 6, 11, 0, 0, Math.PI * 2); x.fill();
    });
    x.restore();
    var ink = dark ? '#FFFFFF' : NIGHTC, accent = dark ? GOLDL : '#8A6D3F';
    x.fillStyle = accent; x.font = 'italic 300 40px Newsreader, Georgia, serif'; x.textAlign = 'right';
    x.fillText('Chanukah Sameach', W - 60, 80);
    x.textAlign = 'left';
    var y = H - 70, lines = [], words = String(o.m).split(/\s+/), line = '';
    x.font = '300 52px Newsreader, Georgia, serif';
    words.forEach(function (w) { var t = line ? line + ' ' + w : w; if (x.measureText(t).width > W - 140) { lines.push(line); line = w; } else line = t; });
    if (line) lines.push(line);
    if (o.f) { x.fillStyle = ink; x.font = 'italic 36px Newsreader, Georgia, serif'; x.fillText('— ' + o.f, 70, y); y -= 70; }
    x.fillStyle = ink; x.font = '300 52px Newsreader, Georgia, serif';
    for (var i = lines.length - 1; i >= 0; i--) { x.fillText(lines[i], 70, y); y -= 64; }
    x.fillStyle = accent; x.font = '700 24px "Instrument Sans", Arial, sans-serif';
    x.fillText((o.t ? 'DEAR ' + o.t : 'HAPPY CHANUKAH').toUpperCase(), 70, y - 6);
    x.fillStyle = dark ? 'rgba(255,255,255,.5)' : 'rgba(11,26,51,.45)'; x.font = '500 20px "Instrument Sans", Arial, sans-serif';
    x.textAlign = 'right'; x.fillText('chabadAM.org', W - 60, H - 40);
    if (c.toBlob) c.toBlob(cb, 'image/png'); else cb(null);
  }
  function litCard(root) { $$('.hc-card .hc-menorah', root).forEach(function (svg) { setMenorah(svg, 8, 8, true); }); }
  function wireCards() {
    var form = $('.hc-cform', app), prev = $('.hc-cprev', app), note = $('.hc-note', app);
    function render() { prev.innerHTML = cardHTML(cardState); litCard(prev); }
    function read() {
      cardState.t = form.t.value.trim(); cardState.f = form.f.value.trim();
      var pick = form.pick.value;
      $('.hc-own', app).classList.toggle('is-hidden', pick !== 'own');
      cardState.m = pick === 'own' ? (form.m.value.trim() || ' ') : CARD_MESSAGES[+pick];
      render();
    }
    ['input', 'change'].forEach(function (ev) { form.addEventListener(ev, read); });
    $$('.hc-themes button', app).forEach(function (b) {
      b.addEventListener('click', function () {
        cardState.d = b.getAttribute('data-d');
        $$('.hc-themes button', app).forEach(function (x) { x.classList.toggle('is-on', x === b); });
        render();
      });
    });
    function say(t) { note.textContent = t; clearTimeout(say.t); say.t = setTimeout(function () { note.textContent = ''; }, 4000); }
    $$('.hc-share button', app).forEach(function (b) {
      b.addEventListener('click', function () {
        var s = b.getAttribute('data-s'), link = cardLink(cardState);
        var text = (cardState.t ? cardState.t + ', ' : '') + 'I sent you a Chanukah card! ' + link;
        if (s === 'wa') window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
        else if (s === 'mail') location.href = 'mailto:?subject=' + encodeURIComponent('A Chanukah card for you') + AMP + 'body=' + encodeURIComponent(text);
        else if (s === 'copy') {
          var done = function () { say('Link copied. Paste it anywhere to send your card.'); };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, function () { window.prompt('Copy this link:', link); });
          else window.prompt('Copy this link:', link);
        } else if (s === 'dl') {
          drawCardPNG(cardState, function (blob) {
            if (!blob) { say('Your browser cannot save the image. Try the link instead.'); return; }
            var a = el('a'); a.href = URL.createObjectURL(blob); a.download = 'chanukah-card.png';
            document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
            say('Card saved as an image.');
          });
        }
      });
    });
    render();
  }
  function receivedCard() {
    var m = /#card=([A-Za-z0-9_-]+)/.exec(location.hash);
    if (!m) return;
    var o = decodeCard(m[1]);
    if (!o) return;
    var d = openDialog('<span style="display:block;font-size:12px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:' + GOLD + ';margin:0 0 10px">You’ve got a Chanukah card</span>' +
      '<div style="margin:6px 0 24px">' + cardHTML(o) + '</div>' +
      '<div class="hc-dbtns"><a class="hc-btn hc-btn-navy" href="#hc-cards">Send one back</a>' +
      '<a class="hc-btn hc-btn-line" href="#hc-events">See Chanukah events</a></div>');
    litCard(d);
    $$('.hc-dbtns a', d).forEach(function (a) { a.addEventListener('click', closeDialog); });
  }

  /* ---- nav, scroll spy, reveal ---- */
  function wireNav() {
    var links = $$('.hc-nav a', app);
    var offset = function () {
      var h = document.getElementById('header'), nav = $('.hc-nav', app);
      var fixed = h && /fixed|sticky/.test(getComputedStyle(h).position) ? h.getBoundingClientRect().height : 0;
      return fixed + (nav ? nav.offsetHeight : 0) + 8;
    };
    function go(id) {
      var t = document.getElementById(id); if (!t) return;
      window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - offset() + 1, behavior: REDUCED ? 'auto' : 'smooth' });
    }
    app.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#hc-"]');
      if (!a) return;
      e.preventDefault(); go(a.getAttribute('href').slice(1));
    });
    if (dlg) dlg.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#hc-"]');
      if (a) { e.preventDefault(); closeDialog(); go(a.getAttribute('href').slice(1)); }
    });
    function spy() {
      var y = window.pageYOffset + offset() + 40, on = null;
      links.forEach(function (a) { var s = document.getElementById(a.getAttribute('data-t')); if (s && s.getBoundingClientRect().top + window.pageYOffset <= y) on = a; });
      links.forEach(function (a) { a.classList.toggle('is-on', a === on); });
      if (on && on.scrollIntoView && on.parentNode.scrollWidth > on.parentNode.clientWidth) {
        var p = on.parentNode, l = on.offsetLeft - p.clientWidth / 2 + on.offsetWidth / 2;
        p.scrollLeft = l;
      }
    }
    window.addEventListener('scroll', spy, { passive: true }); spy();
    /* sit the section nav under the site header when that header is fixed */
    function navTop() {
      var h = document.getElementById('header'), nav = $('.hc-nav', app);
      var fixed = h && /fixed|sticky/.test(getComputedStyle(h).position) ? h.getBoundingClientRect().height : 0;
      if (nav) nav.style.setProperty('top', fixed + 'px', 'important');
    }
    window.addEventListener('scroll', navTop, { passive: true }); window.addEventListener('resize', navTop); navTop();
    var rv = $$('.hc-rv', app);
    if (!('IntersectionObserver' in window) || REDUCED) { rv.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (e) { io.observe(e); });
  }

  function mount() {
    if ($('#hc')) return;
    var host = document.getElementById('content') || document.body;
    var body = document.getElementById('BodyContainer');
    addStyles();
    app = el('div'); app.id = 'hc';
    app.innerHTML = heroHTML() + navHTML() + eventsHTML() + lightHTML() + recipesHTML() + storyHTML() + dreidelHTML() + cardsHTML() + endHTML();
    if (body && body.parentNode) body.parentNode.insertBefore(app, body); else host.insertBefore(app, host.firstChild);
    document.body.className += ' hc-on';
    heroState();
    wireGuide();
    $$('.hc-rc', app).forEach(function (b) { b.addEventListener('click', function () { openRecipe(b.getAttribute('data-r')); }); });
    wireDreidel();
    wireCards();
    receivedCard();
    wireNav();
    var cover = document.getElementById('fc-cover');
    if (cover && cover.parentNode) cover.parentNode.removeChild(cover);
    if (window.console) console.log('Chanukah 2026 page v' + VERSION + ': running');
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }
  ready(function () {
    try { mount(); }
    catch (e) {
      var c = document.getElementById('fc-cover'); if (c && c.parentNode) c.parentNode.removeChild(c);
      document.body.className = document.body.className.replace(/\s*hc-on/, '');
      var a = document.getElementById('hc'); if (a && a.parentNode) a.parentNode.removeChild(a);
      if (window.console) console.error('Chanukah 2026 page failed, showing the original page:', e);
    }
  });
})();
