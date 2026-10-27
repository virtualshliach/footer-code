/* ==========================================================================
   CHABAD OF ALLEN-MCKINNEY - SITE LAYOUT (Yorkville-style redesign)
   chabadam.org (ChabadOne, sites6 default theme). Loaded on every page by
   chabadam/footer.js.

   Homepage : the theme's rows are read for their content, then replaced by
              a new page in the chabadyv.com layout:
                hero (from the ChabadOne homepage slideshow) ->
                programs list + picture (from the homepage Programs box,
                  subtitle shown under the picture) ->
                upcoming events (read from the Upcoming Events page) ->
                get-involved band -> Instagram -> photo mosaic ->
                Shabbat & Holidays / Daily Thought -> mailing-list card.
              Live widgets (Instagram, photos, Shabbat times, daily thought,
              mailing-list form) are MOVED, not copied, so they keep working.
              Any row this script does not recognise is moved to the end,
              restyled, so nothing the office adds later is ever lost.
   Every page: header (logo | centred menu | Donate), footer, page titles.
   ========================================================================== */
(function () {
  "use strict";
  var VERSION = "2.3.0";
  if (window.CAM_LAYOUT) return;
  window.CAM_LAYOUT = VERSION;

  /* ---- palette -------------------------------------------------------- */
  var C = {
    navy: "#14345E",
    navyDeep: "#0F2849",
    ink: "#1E2B3C",
    muted: "#5B6878",
    gold: "#AB8C57",
    goldDeep: "#8A6D3F",
    goldLight: "#D6BD8E",
    cream: "#F7F5F0",
    hair: "rgba(20,52,94,.14)",
    foot: "#0F2849"
  };
  var SERIF = "Newsreader,Georgia,'Times New Roman',serif";
  var SANS = "'Instrument Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif";
  var FONTS_URL = "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400" +
    "AMPfamily=Instrument+Sans:wght@400;500;600AMPdisplay=swap";
  FONTS_URL = FONTS_URL.replace(/AMP/g, String.fromCharCode(38));

  var HERO_MS = 6500;     /* hero auto-advance */
  var PROG_MS = 4500;     /* programs image stage auto-advance */
  var COVER_MAX_MS = 4000; /* failsafe: old homepage is never hidden longer */

  var IS_HOME = /(^|\s)home(\s|$)/.test(document.body.className);
  var REDUCED = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  var BULLET = String.fromCharCode(8226);
  /* the white-and-gold logo (transparent PNG), used in the header and footer */
  var LOGO = "data:image/png;base64,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";

  /* ======================================================================
     small helpers
     ====================================================================== */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function txt(n) { return n ? (n.textContent || "").replace(/\s+/g, " ").trim() : ""; }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(new RegExp(String.fromCharCode(38), "g"), String.fromCharCode(38) + "amp;")
      .replace(/</g, String.fromCharCode(38) + "lt;").replace(/>/g, String.fromCharCode(38) + "gt;")
      .replace(/"/g, String.fromCharCode(38) + "quot;");
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function attr(n, a) { return n ? (n.getAttribute(a) || "") : ""; }
  /* image URL from a ChabadOne image: a spacer.gif with the real photo set
     as an inline background, or a normal img */
  function imgUrl(img) {
    if (!img) return "";
    var s = attr(img, "style");
    var m = s.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
    if (m) return m[1];
    var src = img.getAttribute("src") || "";
    if (src && !/spacer\.gif/i.test(src)) return img.src;
    var cs = window.getComputedStyle(img).backgroundImage || "";
    m = cs.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
    return m ? m[1] : "";
  }
  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function arrowSvg(dir) {
    var d = dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6";
    return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="' + d +
      '" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function longArrow() {
    return '<svg class="cam-arr" viewBox="0 0 28 12" width="28" height="12" aria-hidden="true"><path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
  }

  /* ======================================================================
     CSS - tokens: $S every page, $H homepage, {name} palette / fonts.
     Every declaration gets !important (important()), so the theme loses.
     Keyframes live in CSS_RAW, outside that pass (!important is invalid
     inside @keyframes).
     ====================================================================== */
  var CSS_HEADER = [
    "$S #header_container{display:none}",
    /* logo on its own: the old round logo and the text title are hidden */
    "$S.cam-has-logo #header_branding .site_title{display:none}",
    "$S.cam-has-logo #header_branding .site-logo-wrapper img:not(.cam-logo){display:none}",
    "$S #header_branding .site-logo-wrapper{float:none;margin:0;padding:0}",
    "$S #header_branding .site-logo-wrapper a{display:block;line-height:0}",
    "$S #header_branding img.cam-logo{display:block;width:auto;height:90px;max-width:none;border:0;border-radius:0;background:none;box-shadow:none;transition:height .3s ease}",
    "$S #header.cam-solid #header_branding img.cam-logo{height:60px}",
    "$S #header{color:#fff;background-color:{navy};transition:background-color .3s ease,box-shadow .3s ease}",
    "$H #header:not(.cam-solid){color:#fff;background-color:transparent;box-shadow:none}",
    "$S #header.cam-solid{background-color:{navy};color:#fff;box-shadow:0 8px 24px rgba(15,40,73,.18)}",

    "@media (min-width:1025px){",
    /* wordmark | centred menu | Donate */
    "$S #header .header-wrapper{grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:'b c d';align-items:center;column-gap:24px}",
    "$S #header .header-wrapper > .branding-search{grid-area:b}",
    "$S #header .header-wrapper > .site-nav-wrapper{grid-area:c;justify-self:center;width:auto}",
    "$S #header .header-wrapper > .cam-donate{grid-area:d;justify-self:end;display:inline-flex}",
    "$S #header table.main_menu_container{width:auto;margin:0 auto}",
    "$S #header #tabContentMain > td.co_menu_item{width:auto;white-space:nowrap;padding-left:13px;padding-right:13px}",
    "$S #header #tabContentMain > td.co_menu_item_divider{width:0;padding:0}",
    "$S #header #tabContentMain > td.co_menu_item.donate_link{display:none}",
    "$S #tabContentMain .co_menu_item span.parent a.parent{font-family:{sans};font-weight:500;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;color:#fff}",
    "$S #header #tabContentMain .co_menu_item span.parent a.parent:hover{color:{goldLight}}",
    "$H #header:not(.cam-solid) #tabContentMain .co_menu_item span.parent a.parent{color:#fff}",
    "$S #tabContentMain .co_submenu_container{background-color:#fff;border:0;border-top:2px solid {gold};box-shadow:0 14px 34px rgba(10,52,89,.12)}",
    "$S #tabContentMain .co_submenu_container .co_column a.item,$S #tabContentMain .co_submenu_container .co_column a.item span{font-family:{sans};font-size:14px;font-weight:400;letter-spacing:0;text-transform:none;color:{ink};background:transparent}",
    "$S #tabContentMain .co_submenu_container .co_column a.item:hover,$S #tabContentMain .co_submenu_container .co_column a.item:hover span{color:{navy};background-color:{cream}}",
    "}",
    "$S #header .cam-donate{display:none;align-items:center;font-family:{sans};font-weight:600;font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;text-decoration:none;color:#fff;border:1px solid {gold};border-radius:2px;padding:12px 24px;line-height:1;background:transparent;transition:background-color .2s ease,color .2s ease}",
    "$S #header .cam-donate:hover{background-color:{gold};color:#fff}",
    "$H #header:not(.cam-solid) .cam-donate{color:#fff;border-color:rgba(255,255,255,.75)}",
    "$H #header:not(.cam-solid) .cam-donate:hover{background-color:#fff;color:{navy}}",

    "@media (max-width:1024px){",
    "$S #header_branding img.cam-logo{height:44px}",
    "$S #header.cam-solid #header_branding img.cam-logo{height:40px}",
    "$S .cs-mobile-menu-open{color:inherit}",
    "$S .site-nav-wrapper a{font-family:{sans}}",
    "$S .site-nav-wrapper{background-color:{navy}}",
    "$S .site-nav-wrapper .co_menu_item.donate_link a.parent{color:#fff;border:1px solid {gold};border-radius:2px;font-family:{sans};font-weight:600;letter-spacing:.14em;text-transform:uppercase;font-size:12px}",
    "}"
  ];

  var CSS_INNER = [
    "$S .article-header__title{font-family:{serif};font-weight:300;letter-spacing:-.015em;text-transform:none}",
    "$S .article-header__subtitle{font-family:{sans};font-weight:400;letter-spacing:.14em;text-transform:uppercase;font-size:12px}"
  ];

  /* ---- footer (every page) -------------------------------------------- */
  var CSS_FOOTER = [
    "$S #footer{background-color:{foot};padding:0;font-family:{sans}}",
    "$S #footer.cam-has-footer > *:not(.cam-footer){display:none}",
    "$S .cam-footer{color:rgba(255,255,255,.72);font-family:{sans};font-size:14px;line-height:1.7;text-align:left}",
    "$S .cam-footer .cam-in{max-width:1180px;margin:0 auto;padding:72px 40px 34px}",
    "$S .cam-footer .cam-fcols{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:48px}",
    "$S .cam-footer .cam-fbrand{display:flex;align-items:center;gap:16px}",
    "$S .cam-footer .cam-fbrand img{display:block;width:auto;height:96px;max-width:100%;border:0;border-radius:0;background:none}",
    "$S .cam-footer .cam-fname{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}",
    "$S .cam-footer .cam-flabel{display:block;font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:{goldLight};margin:0 0 14px}",
    "$S .cam-footer a{color:#fff;text-decoration:none}",
    "$S .cam-footer a:hover{color:{goldLight}}",
    "$S .cam-footer .cam-fline{display:block}",
    "$S .cam-footer .cam-social{display:flex;gap:10px}",
    "$S .cam-footer .cam-social a{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border:1px solid rgba(255,255,255,.28);border-radius:50%;font-size:15px;color:#fff}",
    "$S .cam-footer .cam-social a:hover{background-color:{gold};border-color:{gold};color:#fff}",
    "$S .cam-footer .cam-legal{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-top:56px;padding-top:22px;border-top:1px solid rgba(255,255,255,.14);font-size:12px;color:rgba(255,255,255,.55)}",
    "$S .cam-footer .cam-legal a{color:rgba(255,255,255,.75)}",
    "@media (max-width:767px){",
    "$S .cam-footer .cam-in{padding:56px 22px 28px}",
    "$S .cam-footer .cam-fcols{grid-template-columns:1fr;gap:34px}",
    "$S .cam-footer .cam-fbrand img{height:80px}",
    "}"
  ];

  /* ---- homepage: shell + shared type ------------------------------------ */
  var CSS_HOME = [
    "$H{overflow-x:hidden}",
    "$H .hp-table{display:none}",
    "$H .cam-home{position:relative;font-family:{sans};color:{ink};font-size:16px;line-height:1.65;background:#fff;text-align:left}",
    "$H .cam-home *{box-sizing:border-box}",
    "$H .cam-home h2,$H .cam-home h3,$H .cam-home p{margin:0;padding:0;border:0;background:none;text-shadow:none}",
    "$H .cam-sec{padding:112px 0}",
    "$H .cam-in{max-width:1180px;margin:0 auto;padding:0 40px}",
    "$H .cam-eyebrow{display:block;font-family:{sans};font-size:11.5px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:{goldDeep};margin:0 0 16px}",
    "$H .cam-h2{font-family:{serif};font-weight:300;font-size:52px;line-height:1.05;letter-spacing:-.02em;color:{navy};text-transform:none}",
    "$H .cam-h2 em{font-style:italic;font-weight:300}",
    "$H .cam-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:56px}",
    "$H .cam-link{display:inline-flex;align-items:center;gap:12px;font-family:{sans};font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:{navy};text-decoration:none;border:0;background:none}",
    "$H .cam-link:hover{color:{goldDeep}}",
    "$H .cam-link .cam-arr{transition:transform .25s ease}",
    "$H .cam-link:hover .cam-arr{transform:translateX(4px)}",
    "$H .cam-btn{display:inline-flex;align-items:center;gap:12px;font-family:{sans};font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;padding:16px 30px;border:1px solid {gold};border-radius:2px;color:{navy};background:transparent;line-height:1;transition:background-color .2s ease,color .2s ease,border-color .2s ease}",
    "$H .cam-btn:hover{background-color:{gold};color:#fff}",
    "$H .cam-home a:focus-visible,$H .cam-home button:focus-visible{outline:2px solid {gold};outline-offset:3px}",
    "@media (max-width:767px){",
    "$H .cam-sec{padding:76px 0}",
    "$H .cam-in{padding:0 22px}",
    "$H .cam-h2{font-size:38px}",
    "$H .cam-head{display:block;margin-bottom:36px}",
    "$H .cam-head .cam-link{margin-top:18px}",
    "}"
  ];

  /* ---- hero ------------------------------------------------------------ */
  var CSS_HERO = [
    "$H .cam-hero{position:relative;height:88vh;min-height:600px;max-height:900px;overflow:hidden;background-color:{navyDeep};color:#fff}",
    "$H .cam-hero .cam-slide{position:absolute;top:0;right:0;bottom:0;left:0;opacity:0;transition:opacity 1.2s ease;background-size:cover;background-position:center;background-repeat:no-repeat}",
    "$H .cam-hero .cam-slide.is-on{opacity:1}",
    "$H .cam-hero .cam-shade{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none;background-image:linear-gradient(90deg,rgba(5,20,38,.78) 0%,rgba(5,20,38,.45) 45%,rgba(5,20,38,.12) 100%),linear-gradient(180deg,rgba(5,20,38,.55) 0%,rgba(5,20,38,0) 28%,rgba(5,20,38,0) 60%,rgba(5,20,38,.6) 100%)}",
    "$H .cam-hero .cam-hcopy{position:absolute;left:0;right:0;bottom:120px}",
    "$H .cam-hero .cam-hcopy .cam-in{max-width:1180px}",
    "$H .cam-hero .cam-htext{max-width:680px}",
    "$H .cam-hero .cam-eyebrow{color:{goldLight}}",
    "$H .cam-hero .cam-htitle{font-family:{serif};font-weight:300;font-size:68px;line-height:1.02;letter-spacing:-.02em;color:#fff;margin:0 0 22px;text-transform:none}",
    "$H .cam-hero .cam-hlede{font-size:18px;line-height:1.6;color:rgba(255,255,255,.86);margin:0 0 34px;max-width:560px}",
    "$H .cam-hero .cam-btn{color:#fff;border-color:rgba(255,255,255,.8)}",
    "$H .cam-hero .cam-btn:hover{background-color:#fff;color:{navy};border-color:#fff}",
    "$H .cam-hero .cam-hctl{position:absolute;left:0;right:0;bottom:44px}",
    "$H .cam-hero .cam-hctl .cam-in{display:flex;align-items:center;gap:22px}",
    "$H .cam-hero .cam-count{font-family:{sans};font-size:12px;font-weight:600;letter-spacing:.2em;color:rgba(255,255,255,.85);font-variant-numeric:tabular-nums;min-width:64px}",
    "$H .cam-hero .cam-bar{position:relative;flex:0 1 220px;height:1px;background-color:rgba(255,255,255,.3);overflow:hidden}",
    "$H .cam-hero .cam-bar i{position:absolute;left:0;top:0;bottom:0;width:0;background-color:{goldLight}}",
    "$H .cam-hero .cam-bar i.is-run{animation:camBar linear forwards}",
    "$H .cam-hero .cam-arrows{display:flex;gap:8px;margin-left:auto}",
    "$H .cam-hero .cam-arrows button{display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;cursor:pointer;padding:0}",
    "$H .cam-hero .cam-arrows button:hover{background-color:#fff;color:{navy}}",
    "$H .cam-hero .cam-slide.is-on.is-zoom{animation:camZoom 9s ease-out both}",
    "@media (max-width:767px){",
    "$H .cam-hero{height:86vh;min-height:540px}",
    "$H .cam-hero .cam-hcopy{bottom:110px}",
    "$H .cam-hero .cam-htitle{font-size:42px}",
    "$H .cam-hero .cam-hlede{font-size:16px;margin-bottom:26px}",
    "$H .cam-hero .cam-hctl{bottom:30px}",
    "$H .cam-hero .cam-bar{flex-basis:120px}",
    "}"
  ];

  /* ---- programs index + image stage ------------------------------------ */
  var CSS_PROGRAMS = [
    "$H .cam-prog .cam-pgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:72px;align-items:start}",
    "$H .cam-prog .cam-plist{list-style:none;margin:0;padding:0;border-top:1px solid {hair}}",
    "$H .cam-prog .cam-plist li{margin:0;padding:0;list-style:none;border-bottom:1px solid {hair};background:none}",
    "$H .cam-prog .cam-plist li:before{display:none}",
    "$H .cam-prog .cam-plist a{display:flex;align-items:center;gap:20px;padding:24px 4px;text-decoration:none;color:{navy}}",
    "$H .cam-prog .cam-plist .cam-pthumb{display:none;width:72px;height:72px;border-radius:4px;background-size:cover;background-position:center;flex:0 0 72px;box-shadow:0 4px 12px rgba(20,52,94,.12)}",
    "$H .cam-prog .cam-plist .cam-ptitle{flex:1;font-family:{serif};font-weight:300;font-size:30px;line-height:1.15;letter-spacing:-.01em;color:{navy};transition:transform .3s ease,color .3s ease}",
    "$H .cam-prog .cam-plist .cam-arr{color:{gold};opacity:0;transform:translateX(-8px);transition:opacity .25s ease,transform .25s ease}",
    "$H .cam-prog .cam-plist li.is-on .cam-ptitle,$H .cam-prog .cam-plist a:hover .cam-ptitle{transform:translateX(8px);color:{goldDeep}}",
    "$H .cam-prog .cam-plist li.is-on .cam-arr,$H .cam-prog .cam-plist a:hover .cam-arr{opacity:1;transform:none}",
    "$H .cam-prog .cam-pside{position:sticky;top:120px}",
    "$H .cam-prog .cam-stage{position:relative;aspect-ratio:4/3;max-width:100%;overflow:hidden;border-radius:2px;background-color:{cream};box-shadow:0 24px 50px rgba(20,52,94,.12)}",
    "$H .cam-prog .cam-pcap{padding:26px 4px 0}",
    "$H .cam-prog .cam-pcap b{display:block;font-family:{serif};font-weight:400;font-size:26px;line-height:1.2;color:{navy};margin:0 0 8px}",
    "$H .cam-prog .cam-pcap p{margin:0 0 18px;font-size:16px;line-height:1.65;color:{muted};max-width:520px}",
    "$H .cam-prog .cam-stage div{position:absolute;top:0;right:0;bottom:0;left:0;background-size:cover;background-position:center;opacity:0;transform:scale(1.04);transition:opacity .8s ease,transform 1.6s ease}",
    "$H .cam-prog .cam-stage div.is-on{opacity:1;transform:none}",
    "@media (max-width:900px){",
    "$H .cam-prog .cam-pgrid{grid-template-columns:1fr;gap:0}",
    "$H .cam-prog .cam-pside{display:none}",
    "$H .cam-prog .cam-plist .cam-pthumb{display:block}",
    "$H .cam-prog .cam-plist .cam-ptitle{font-size:22px}",
    "$H .cam-prog .cam-plist .cam-arr{opacity:1;transform:none}",
    "$H .cam-prog .cam-plist a{padding:14px 0;gap:18px}",
    "$H .cam-prog .cam-plist li.is-on .cam-ptitle{transform:none;color:{navy}}",
    "}"
  ];

  /* ---- get-involved band (the theme's banner promos) -------------------- */
  var CSS_BAND = [
    "$H .cam-band{background-color:{navy};color:#fff}",
    "$H .cam-band .cam-bgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:0}",
    "$H .cam-band .cam-bitem{display:flex;flex-direction:column;align-items:flex-start;gap:18px;padding:12px 56px;border-left:1px solid rgba(255,255,255,.16)}",
    "$H .cam-band .cam-bitem:first-child{padding-left:0;border-left:0}",
    "$H .cam-band .cam-bicon{width:76px;height:76px;border-radius:50%;object-fit:cover;background:#fff;border:2px solid rgba(255,255,255,.85)}",
    "$H .cam-band .cam-btitle{font-family:{serif};font-weight:300;font-size:42px;line-height:1.08;letter-spacing:-.015em;color:#fff;margin:0}",
    "$H .cam-band .cam-btitle a{font-family:{serif};font-weight:300;color:#fff;text-decoration:none}",
    "$H .cam-band .cam-bsub{font-size:16px;color:rgba(255,255,255,.75);margin:0;max-width:420px}",
    "$H .cam-band .cam-btn{color:#fff;border-color:{gold};margin-top:8px}",
    "$H .cam-band .cam-btn:hover{background-color:{gold};color:#fff}",
    "@media (max-width:767px){",
    "$H .cam-band .cam-bitem{padding:34px 0;border-left:0;border-top:1px solid rgba(255,255,255,.16)}",
    "$H .cam-band .cam-bitem:first-child{padding-top:0;border-top:0}",
    "$H .cam-band .cam-btitle{font-size:34px}",
    "}"
  ];

  /* ---- Instagram + photos + quick links + learning --------------------- */
  var CSS_MID = [
    /* Instagram embed (moved native widget) */
    "$H .cam-insta .sites-wrapper > .widget_header{display:none}",
    "$H .cam-insta .sites-wrapper{background:none;padding:0;margin:0;height:auto}",
    "$H .cam-insta .cam-handle{font-family:{serif};font-style:italic;font-size:20px;color:{goldDeep};text-decoration:none}",

    /* photo mosaic (moved native latest-photos widget) */
    "$H .cam-photos{background-color:{cream}}",
    "$H .cam-photos .latest_photos{height:auto;background:none;padding:0;margin:0}",
    "$H .cam-photos .latest_photos > .wrapper > .widget_header{display:none}",
    "$H .cam-photos .latest_photos .widget_content{height:auto;padding:0;margin:0}",
    "$H .cam-photos .latest_photos ul{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none;width:auto;height:auto}",
    "$H .cam-photos .latest_photos li{display:block;position:relative;margin:0;padding:0;width:auto;height:auto;aspect-ratio:1/1;overflow:hidden;border-radius:2px;float:none;list-style:none}",
    "$H .cam-photos .latest_photos li:first-child{grid-column:span 2;grid-row:span 2}",
    "$H .cam-photos .latest_photos li:nth-child(n+10){display:none}",
    "$H .cam-photos .latest_photos li a{display:block;width:100%;height:100%}",
    "$H .cam-photos .latest_photos li img{display:block;width:100%;height:100%;max-width:none;background-size:cover;background-position:center;transition:transform .8s ease}",
    "$H .cam-photos .latest_photos li:hover img{transform:scale(1.04)}",
    "$H .cam-photos .latest_photos .readMore,$H .cam-photos .latest_photos .see_more{display:none}",
    "@media (max-width:767px){",
    "$H .cam-photos .latest_photos ul{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}",
    "$H .cam-photos .latest_photos li:nth-child(n+8){display:none}",
    "}",

    /* quick links */
    "$H .cam-quick{padding:0}",
    "$H .cam-quick .cam-qgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid {hair};border-bottom:1px solid {hair}}",
    "$H .cam-quick a{display:flex;align-items:center;gap:18px;padding:34px 28px;text-decoration:none;color:{navy};border-left:1px solid {hair};transition:background-color .25s ease}",
    "$H .cam-quick a:first-child{border-left:0}",
    "$H .cam-quick a:hover{background-color:{cream}}",
    "$H .cam-quick img{width:44px;height:44px;flex:0 0 44px;filter:brightness(0) saturate(100%) invert(14%) sepia(52%) saturate(2390%) hue-rotate(195deg) brightness(92%) contrast(97%)}",
    "$H .cam-quick span{flex:1;font-family:{sans};font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase}",
    "$H .cam-quick .cam-arr{color:{gold}}",
    "@media (max-width:900px){",
    "$H .cam-quick .cam-qgrid{grid-template-columns:repeat(2,minmax(0,1fr))}",
    "$H .cam-quick a:nth-child(3){border-left:0}",
    "$H .cam-quick a:nth-child(n+3){border-top:1px solid {hair}}",
    "$H .cam-quick a{padding:26px 18px;gap:12px}",
    "$H .cam-quick img{width:34px;height:34px;flex-basis:34px}",
    "$H .cam-quick .cam-arr{display:none}",
    "}",

    /* learning feature */
    "$H .cam-learn .cam-lgrid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:64px;align-items:center}",
    "$H .cam-learn .cam-limg{display:block;aspect-ratio:16/11;max-width:100%;border-radius:2px;background-size:cover;background-position:center;background-color:{cream}}",
    "$H .cam-learn .cam-ltitle{font-family:{serif};font-weight:300;font-size:44px;line-height:1.08;letter-spacing:-.015em;color:{navy};margin:0 0 18px}",
    "$H .cam-learn .cam-ltitle a{font-family:{serif};font-weight:300;color:{navy};text-decoration:none}",
    "$H .cam-learn .cam-ltext{font-size:17px;color:{muted};margin:0 0 30px;max-width:460px}",
    "$H .cam-learn .cam-lmore{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px;margin-top:64px;padding-top:36px;border-top:1px solid {hair}}",
    "$H .cam-learn .cam-lmore a{font-family:{sans};text-decoration:none;color:{navy}}",
    "$H .cam-learn .cam-lmore b{display:block;font-family:{serif};font-weight:400;font-size:22px;line-height:1.2;margin:0 0 6px}",
    "$H .cam-learn .cam-lmore span{font-size:14px;color:{muted}}",
    "@media (max-width:900px){",
    "$H .cam-learn .cam-lgrid{grid-template-columns:1fr;gap:32px}",
    "$H .cam-learn .cam-ltitle{font-size:34px}",
    "}"
  ];

  /* ---- three info columns + mailing card + leftovers -------------------- */
  var CSS_INFO = [
    "$H .cam-info{background-color:{cream};padding-bottom:180px}",
    "$H .cam-info .cam-igrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0}",
    "$H .cam-info .cam-icol{padding:0 40px;border-left:1px solid {hair};min-width:0}",
    "$H .cam-info .cam-icol:first-child{padding-left:0;border-left:0}",
    "$H .cam-info .cam-icol:last-child{padding-right:0}",
    "$H .cam-info .widget-4{width:auto;height:auto;float:none;margin:0;padding:0;background:none;border:0}",
    "$H .cam-info .widget-4 > .wrapper{padding:0;margin:0;background:none;border:0;height:auto}",
    "$H .cam-info .widget_header{margin:0 0 22px;padding:0;border:0;background:none;text-align:left}",
    "$H .cam-info .widget_header h5{font-family:{sans};font-weight:600;font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:{goldDeep};text-align:left;margin:0;padding:0;border:0;background:none}",
    "$H .cam-info .widget_header h5:after{content:'';display:block;width:28px;height:1px;margin:14px 0 0;background-color:{gold}}",
    "$H .cam-info .widget_content{font-family:{sans};font-size:15px;line-height:1.7;color:{ink};text-align:left;height:auto;padding:0}",
    "$H .cam-info .widget_content *{text-align:left}",
    "$H .cam-info .section_heading{font-family:{serif};font-weight:400;font-size:24px;letter-spacing:0;text-transform:none;color:{navy};margin:0}",
    "$H .cam-info .section_subheading{font-family:{sans};font-weight:400;font-size:13px;color:{muted};margin:0}",
    "$H .cam-info .candlelighting_heading,$H .cam-info .medium_left_margin,$H .cam-info .large_left_margin{margin-left:0}",
    "$H .cam-info small,$H .cam-info .when_to_light{display:block;float:none;font-family:{sans};font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:{muted}}",
    "$H .cam-info .float_left,$H .cam-info .float_right{float:none}",
    "$H .cam-info .candlelighting .float_left img,$H .cam-info .candlelighting .button_container{display:none}",
    "$H .cam-info .times_wrapper{height:auto;overflow:visible}",
    "$H .cam-info .bold.large{font-family:{serif};font-weight:400;font-size:28px;color:{navy}}",
    "$H .cam-info a{color:{navy};text-decoration:none}",
    "$H .cam-info .daily_thought .widget_content a{font-family:{serif};font-size:22px;line-height:1.25}",
    "$H .cam-info .daily_thought .widget_content{font-size:15px;color:{muted}}",
    "@media (max-width:900px){",
    "$H .cam-info .cam-igrid{grid-template-columns:1fr}",
    "$H .cam-info .cam-icol{padding:36px 0 0;margin-top:36px;border-left:0;border-top:1px solid {hair}}",
    "$H .cam-info .cam-icol:first-child{margin-top:0;padding-top:0;border-top:0}",
    "}",

    /* mailing-list card: overlaps the cream band above */
    "$H .cam-mail{position:relative;margin-top:-120px;padding:0 0 112px}",
    "$H .cam-mail .cam-card{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:48px;align-items:center;background-color:{navy};color:#fff;padding:64px;border-radius:2px;box-shadow:0 30px 60px rgba(10,52,89,.18)}",
    "$H .cam-mail .cam-h2{color:#fff;font-size:44px}",
    "$H .cam-mail .cam-eyebrow{color:{goldLight}}",
    "$H .cam-mail .subscribe,$H .cam-mail .subscribe > .wrapper{width:auto;height:auto;margin:0;padding:0;background:none;border:0;float:none}",
    "$H .cam-mail .subscribe .widget_header{display:none}",
    "$H .cam-mail .subscribe .widget_content{padding:0;height:auto}",
    "$H .cam-mail .subscribe fieldset{display:grid;grid-template-columns:1fr 1fr;gap:10px;border:0;margin:0;padding:0}",
    "$H .cam-mail .subscribe label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}",
    "$H .cam-mail .subscribe input.co_global_input{width:100%;height:52px;margin:0;border:1px solid transparent;border-radius:2px;background-color:#fff;color:{ink};font-family:{sans};font-size:15px;padding:0 18px;box-shadow:none}",
    "$H .cam-mail .subscribe input.co_global_input::placeholder{color:{muted};opacity:1}",
    "$H .cam-mail .subscribe input[type=email]{grid-column:1 / span 2}",
    "$H .cam-mail .subscribe input[type=submit]{grid-column:1 / span 2;width:100%;height:52px;margin:0;border:0;border-radius:2px;background-color:{gold};color:#fff;font-family:{sans};font-weight:600;font-size:12px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;box-shadow:none}",
    "$H .cam-mail .subscribe input[type=submit]:hover{background-color:#fff;color:{navy}}",
    "$H .cam-mail .subscribe #response,$H .cam-mail .subscribe .response{color:#fff}",
    "@media (max-width:900px){",
    "$H .cam-mail{margin-top:-90px;padding-bottom:76px}",
    "$H .cam-mail .cam-card{grid-template-columns:1fr;gap:28px;padding:40px 24px}",
    "$H .cam-mail .cam-h2{font-size:34px}",
    "$H .cam-mail .subscribe fieldset{grid-template-columns:1fr}",
    "$H .cam-mail .subscribe input[type=email],$H .cam-mail .subscribe input[type=submit]{grid-column:auto}",
    "}",

    /* rows the script does not know: shown as-is in a plain band */
    "$H .cam-more .hp-row{display:block;background:none;padding:0;margin:0 0 48px;height:auto}",
    "$H .cam-more .widget_header h5,$H .cam-more .header-title{font-family:{serif};font-weight:300;font-size:40px;letter-spacing:-.015em;text-transform:none;color:{navy}}"
  ];

  /* while the new homepage is being built, keep the old rows out of sight */
  var CSS_COVER = "html body.home .hp-table{visibility:hidden}";

  var CSS_RAW = [
    "@keyframes camZoom{from{transform:scale(1.08)}to{transform:scale(1)}}",
    "@keyframes camBar{from{width:0}to{width:100%}}"
  ].join("\n");

  /* ======================================================================
     CSS plumbing
     ====================================================================== */
  function fill(lines) {
    var css = lines.join("\n");
    css = css.replace(/\$S/g, "html body.cam").replace(/\$H/g, "html body.cam-home");
    css = css.replace(/\{serif\}/g, SERIF).replace(/\{sans\}/g, SANS);
    return css.replace(/\{(\w+)\}/g, function (m, k) { return C[k] || m; });
  }
  function important(css) {
    return css.replace(/([^{};]+:[^{};]+?)\s*(;|\})/g, function (m, decl, end) {
      if (/!important\s*$/.test(decl)) return decl + end;
      return decl + " !important" + end;
    });
  }
  function addStyle(id, css) {
    var old = document.getElementById(id);
    if (old) old.parentNode.removeChild(old);
    var s = document.createElement("style");
    s.id = id;
    s.type = "text/css";
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
    return s;
  }
  function addFonts() {
    if (document.getElementById("cam-fonts")) return;
    var l = document.createElement("link");
    l.id = "cam-fonts";
    l.rel = "stylesheet";
    l.href = FONTS_URL;
    document.head.appendChild(l);
  }
  function removeCover() {
    var c = document.getElementById("cam-cover");
    if (c) c.parentNode.removeChild(c);
  }

  /* ======================================================================
     READ: pull the content out of the theme's homepage rows
     ====================================================================== */
  function readSlides(scope) {
    var out = [];
    $$(".slide_wrapper", scope).forEach(function (s, i) {
      var img = $("img", s), a = $("a", s);
      var capSel = attr(s, "caption");
      var cap = null;
      try { cap = capSel ? $(capSel, scope) : null; } catch (e) { cap = null; }
      if (!cap) cap = $$(".captionList li", scope)[i] || null;
      var title = "", text = "", btn = "", btnHref = "";
      if (cap) {
        var big = $("big", cap);
        title = txt(big);
        var span = $("span", cap);
        if (span) {
          var clone = span.cloneNode(true);
          var b2 = $("big", clone);
          if (b2) b2.parentNode.removeChild(b2);
          text = txt(clone);
        }
        var rm = $("a.readMore", cap);
        if (rm) { btn = txt(rm); btnHref = attr(rm, "href"); }
      }
      var url = imgUrl(img);
      if (url) out.push({ img: url, href: attr(a, "href") || btnHref, title: title, text: text, btn: btn, btnHref: btnHref || attr(a, "href") });
    });
    return out;
  }

  function readHome(table) {
    var d = { rows: [] };
    var rows = $$(".hp-row", table);
    rows.forEach(function (row) {
      var used = false;
      var head = txt($(".widget_header h5", row)) || txt($(".header-title", row));
      if (/(^|\s)hp-row-first(\s|$)/.test(row.className) && $(".promo_slider", row)) {
        d.hero = readSlides(row); used = true;
      } else if ($(".sneak-peek-container", row)) {
        d.programs = {
          title: txt($(".sneak-peek-container .header-title", row)) || "Programs",
          items: $$(".sneak_peek", row).map(function (w) {
            var a = $("h6 a", w) || $("a", w);
            return { title: txt(a), href: attr(a, "href"), img: imgUrl($(".thumbnail img", w)), desc: progDesc(w) };
          }).filter(function (x) { return x.title; })
        };
        used = true;
      } else if ($(".banner-updates", row)) {
        d.band = d.band || [];
        $$(".banner-updates .item", row).forEach(function (it) {
          var t = $(".title a", it);
          d.band.push({
            icon: imgUrl($(".icon img", it)), title: txt(t), href: attr(t, "href"),
            sub: txt($(".subtitle", it)) || txt($(".synopsis", it)),
            btn: txt($("a.readMore", it)) || "Learn more"
          });
        });
        used = true;
      } else if ($(".icon-updates", row)) {
        d.quick = {
          title: head,
          items: $$(".icon-updates .item", row).map(function (it) {
            var a = $(".title a", it);
            return { icon: imgUrl($(".icon img", it)), title: txt(a), href: attr(a, "href") };
          })
        };
        used = true;
      } else if ($(".promo_slider", row)) {
        d.learn = { title: txt($(".header-title", row)) || head, items: readSlides(row) };
        used = true;
      } else if (/instagram/i.test(head) && $(".sites-wrapper", row)) {
        d.insta = { title: head, node: $(".sites-wrapper", row) };
        used = true;
      } else if ($(".latest_photos", row)) {
        d.photos = { title: head || "Latest Photos", node: $(".latest_photos", row) };
        used = true;
      } else if ($(".candlelighting", row) || $(".daily_thought", row) || $(".upcoming_events", row)) {
        d.info = $$(".widget-4", row).filter(function (w) { return !w.parentNode.closest || !w.parentNode.closest(".widget-4"); });
        used = true;
      } else if ($(".subscribe", row)) {
        d.mail = { title: head || "Join our mailing list", node: $(".subscribe", row) };
        used = true;
      }
      if (!used && txt(row).length + $$("img,iframe", row).length > 0) d.rows.push(row);
    });
    return d;
  }

  /* ======================================================================
     BUILD: the new homepage
     ====================================================================== */
  function buildHero(slides) {
    var sec = el("section", "cam-hero");
    sec.setAttribute("aria-label", "Featured");
    var html = "";
    slides.forEach(function (s, i) {
      html += '<div class="cam-slide' + (i === 0 ? " is-on" : "") + '" style="background-image:url(' + "'" + esc(s.img) + "'" + ')"></div>';
    });
    html += '<div class="cam-shade"></div>' +
      '<div class="cam-hcopy"><div class="cam-in"><div class="cam-htext">' +
      '<span class="cam-eyebrow">Chabad of Allen' + String.fromCharCode(8209) + 'McKinney</span>' +
      '<h2 class="cam-htitle"></h2><p class="cam-hlede"></p>' +
      '<a class="cam-btn" href="#"></a></div></div></div>' +
      '<div class="cam-hctl"><div class="cam-in">' +
      '<span class="cam-count" aria-live="polite"></span>' +
      '<span class="cam-bar"><i></i></span>' +
      '<span class="cam-arrows"><button type="button" class="cam-prev" aria-label="Previous slide">' + arrowSvg("left") +
      '</button><button type="button" class="cam-next" aria-label="Next slide">' + arrowSvg("right") + "</button></span>" +
      "</div></div>";
    sec.innerHTML = html;

    var slideEls = $$(".cam-slide", sec);
    var tEl = $(".cam-htitle", sec), lEl = $(".cam-hlede", sec), bEl = $(".cam-btn", sec);
    var cEl = $(".cam-count", sec), barI = $(".cam-bar i", sec);
    var idx = 0, timer = null, paused = false;
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function niceTitle(t) {
      /* captions typed in capitals read as shouting in a light serif */
      if (t && t === t.toUpperCase() && /[A-Z]{3}/.test(t)) {
        var small = /^(of|and|the|in|on|at|for|to|a|an)$/;
        return t.toLowerCase().split(/(\s+|-)/).map(function (w, k) {
          if (!w || /^\s+$/.test(w) || w === "-") return w;
          if (k > 0 && small.test(w)) return w;
          w = w.charAt(0).toUpperCase() + w.slice(1);
          return w.replace(/^Mc([a-z])/, function (m, c) { return "Mc" + c.toUpperCase(); });
        }).join("");
      }
      return t;
    }
    function show(i) {
      idx = (i + slides.length) % slides.length;
      slideEls.forEach(function (n, k) {
        n.className = "cam-slide" + (k === idx ? " is-on" + (REDUCED ? "" : " is-zoom") : "");
      });
      var s = slides[idx];
      tEl.textContent = niceTitle(s.title);
      lEl.textContent = s.text || "";
      lEl.style.display = s.text ? "" : "none";
      if (s.btnHref || s.href) {
        bEl.innerHTML = esc(s.btn || "Learn more") + " " + longArrow();
        bEl.setAttribute("href", s.btnHref || s.href);
        bEl.style.display = "";
      } else {
        bEl.style.display = "none";
      }
      cEl.textContent = pad(idx + 1) + " / " + pad(slides.length);
      restartBar();
    }
    function restartBar() {
      if (!barI) return;
      barI.className = "";
      barI.style.animationDuration = HERO_MS + "ms";
      void barI.offsetWidth;
      if (!REDUCED && !paused && slides.length > 1) barI.className = "is-run";
    }
    function schedule() {
      clearTimeout(timer);
      if (REDUCED || paused || slides.length < 2) return;
      timer = setTimeout(function () { show(idx + 1); schedule(); }, HERO_MS);
    }
    $(".cam-prev", sec).addEventListener("click", function () { show(idx - 1); schedule(); });
    $(".cam-next", sec).addEventListener("click", function () { show(idx + 1); schedule(); });
    sec.addEventListener("mouseenter", function () { paused = true; clearTimeout(timer); if (barI) barI.className = ""; });
    sec.addEventListener("mouseleave", function () { paused = false; restartBar(); schedule(); });
    if (slides.length < 2) $(".cam-hctl", sec).style.display = "none";
    show(0);
    schedule();
    return sec;
  }

  /* a program's subtitle (ChabadOne's subtitle field): any text the item
     holds besides its title and its picture */
  function progDesc(w) {
    var box = $(".widget_content", w) || w;
    var known = $(".subtitle, .sub_title, .synopsis, .description, .item-subtitle", box);
    if (known) return txt(known);
    var c = box.cloneNode(true);
    $$("h1, h2, h3, h4, h5, h6, a.thumbnail, img, script, style", c).forEach(function (n) {
      if (n.parentNode) n.parentNode.removeChild(n);
    });
    return txt(c);
  }

  function buildPrograms(p) {
    var sec = el("section", "cam-sec cam-prog");
    var list = "", stage = "";
    p.items.forEach(function (it, i) {
      list += '<li data-i="' + i + '"><a href="' + esc(it.href) + '">' +
        '<span class="cam-pthumb" style="background-image:url(' + "'" + esc(it.img) + "'" + ')"></span>' +
        '<span class="cam-ptitle">' + esc(it.title) + "</span>" + longArrow() + "</a></li>";
      stage += '<div data-i="' + i + '" style="background-image:url(' + "'" + esc(it.img) + "'" + ')"></div>';
    });
    sec.innerHTML = '<div class="cam-in"><div class="cam-head"><div>' +
      '<span class="cam-eyebrow">What we offer</span><h2 class="cam-h2">' + esc(p.title) + "</h2></div></div>" +
      '<div class="cam-pgrid"><ul class="cam-plist">' + list + "</ul>" +
      '<div class="cam-pside"><div class="cam-stage" aria-hidden="true">' + stage + "</div>" +
      '<div class="cam-pcap"><b></b><p></p><a class="cam-link" href="#">Learn more ' + longArrow() + "</a></div></div></div></div>";
    var lis = $$(".cam-plist li", sec), pics = $$(".cam-stage div", sec);
    var capT = $(".cam-pcap b", sec), capP = $(".cam-pcap p", sec), capA = $(".cam-pcap a", sec);
    var cur = -1, timer = null, hold = false;
    function set(i) {
      cur = i;
      lis.forEach(function (n, k) { n.className = k === i ? "is-on" : ""; });
      pics.forEach(function (n, k) { n.className = k === i ? "is-on" : ""; });
      var it = p.items[i] || {};
      capT.textContent = it.title || "";
      capP.textContent = it.desc || "";
      capP.style.display = it.desc ? "" : "none";
      capA.setAttribute("href", it.href || "#");
    }
    function auto() {
      clearInterval(timer);
      if (REDUCED || pics.length < 2) return;
      timer = setInterval(function () { if (!hold) set((cur + 1) % pics.length); }, PROG_MS);
    }
    lis.forEach(function (n, k) {
      n.addEventListener("mouseenter", function () { hold = true; set(k); });
      n.addEventListener("focusin", function () { hold = true; set(k); });
      n.addEventListener("mouseleave", function () { hold = false; });
    });
    if (p.items.length) set(0);
    auto();
    return sec;
  }

  function buildBand(items) {
    var sec = el("section", "cam-sec cam-band");
    var html = "";
    items.forEach(function (b) {
      html += '<div class="cam-bitem">' +
        (b.icon ? '<img class="cam-bicon" src="' + esc(b.icon) + '" alt="">' : "") +
        '<h3 class="cam-btitle"><a href="' + esc(b.href) + '">' + esc(b.title) + "</a></h3>" +
        (b.sub ? '<p class="cam-bsub">' + esc(b.sub) + "</p>" : "") +
        '<a class="cam-btn" href="' + esc(b.href) + '">' + esc(b.btn) + " " + longArrow() + "</a></div>";
    });
    sec.innerHTML = '<div class="cam-in"><div class="cam-bgrid">' + html + "</div></div>";
    return sec;
  }

  function buildInsta(d, handleUrl) {
    var sec = el("section", "cam-sec cam-insta");
    var handle = "";
    var m = (handleUrl || "").match(/instagram\.com\/([^\/?#]+)/i);
    if (m) handle = "@" + m[1];
    sec.innerHTML = '<div class="cam-in"><div class="cam-head"><div>' +
      '<span class="cam-eyebrow">Community</span><h2 class="cam-h2">' + esc(d.title) + "</h2></div>" +
      (handle ? '<a class="cam-link" href="' + esc(handleUrl) + '" target="_blank" rel="noopener">' + esc(handle) + " " + longArrow() + "</a>" : "") +
      '</div><div class="cam-embed"></div></div>';
    $(".cam-embed", sec).appendChild(d.node);
    return sec;
  }

  function buildPhotos(d) {
    var sec = el("section", "cam-sec cam-photos");
    sec.innerHTML = '<div class="cam-in"><div class="cam-head"><div>' +
      '<span class="cam-eyebrow">Gallery</span><h2 class="cam-h2">' + esc(d.title) + "</h2></div></div>" +
      '<div class="cam-pwrap"></div></div>';
    $(".cam-pwrap", sec).appendChild(d.node);
    return sec;
  }

  function buildQuick(q) {
    var sec = el("section", "cam-quick");
    var html = "";
    q.items.forEach(function (it) {
      html += '<a href="' + esc(it.href) + '">' + (it.icon ? '<img src="' + esc(it.icon) + '" alt="">' : "") +
        "<span>" + esc(it.title) + "</span>" + longArrow() + "</a>";
    });
    sec.innerHTML = '<div class="cam-in"><div class="cam-qgrid" role="navigation" aria-label="' + esc(q.title || "Quick links") + '">' + html + "</div></div>";
    return sec;
  }

  function buildLearn(l) {
    if (!l.items.length) return null;
    var sec = el("section", "cam-sec cam-learn");
    var f = l.items[0];
    var more = "";
    l.items.slice(1, 4).forEach(function (it) {
      more += '<a href="' + esc(it.btnHref || it.href) + '"><b>' + esc(it.title) + "</b><span>" + esc(it.text) + "</span></a>";
    });
    sec.innerHTML = '<div class="cam-in"><div class="cam-lgrid">' +
      '<a class="cam-limg" href="' + esc(f.btnHref || f.href) + '" style="background-image:url(' + "'" + esc(f.img) + "'" + ')" aria-label="' + esc(f.title) + '"></a>' +
      '<div><span class="cam-eyebrow">' + esc(l.title || "Learning") + "</span>" +
      '<h3 class="cam-ltitle"><a href="' + esc(f.btnHref || f.href) + '">' + esc(f.title) + "</a></h3>" +
      (f.text ? '<p class="cam-ltext">' + esc(f.text) + "</p>" : "") +
      '<a class="cam-link" href="' + esc(f.btnHref || f.href) + '">' + esc(f.btn || "Read more") + " " + longArrow() + "</a></div></div>" +
      (more ? '<div class="cam-lmore">' + more + "</div>" : "") + "</div>";
    return sec;
  }

  function buildInfo(nodes) {
    var sec = el("section", "cam-sec cam-info");
    sec.innerHTML = '<div class="cam-in"><div class="cam-igrid"></div></div>';
    var grid = $(".cam-igrid", sec);
    nodes.forEach(function (n) {
      var col = el("div", "cam-icol");
      col.appendChild(n);
      grid.appendChild(col);
    });
    return sec;
  }

  function buildMail(d) {
    var sec = el("section", "cam-mail");
    sec.innerHTML = '<div class="cam-in"><div class="cam-card"><div>' +
      '<span class="cam-eyebrow">Stay in touch</span><h2 class="cam-h2">' + esc(d.title) + "</h2></div>" +
      '<div class="cam-form"></div></div></div>';
    $(".cam-form", sec).appendChild(d.node);
    return sec;
  }

  function buildMore(rows) {
    var sec = el("section", "cam-sec cam-more");
    sec.innerHTML = '<div class="cam-in"></div>';
    var box = $(".cam-in", sec);
    rows.forEach(function (r) { box.appendChild(r); });
    return sec;
  }

  /* ---- upcoming events: read the site's own Upcoming Events page --------
     Each event there is a card with a flyer, a date line, a title, a short
     description and an RSVP link. The cards are found by their RSVP /
     Register links, so the page can be edited normally. They are shown as
     a row of large cards right after Programs. If nothing is found, the
     section stays hidden and the native widget stays where it was. */
  var EVENTS_URL = "/templates/articlecco_cdo/aid/7248664/jewish/Upcoming-Events.htm";
  var EVENTS_MAX = 12;
  var EVENTS_TZ = "America/Chicago";
  var WHEN_RE = /(Sun|Mon|Tue|Wed|Thu|Fri|Sat)[a-z]*\.?,?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2})/i;
  var TIME_RE = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i;
  var RSVP_RE = /^\s*(rsvp|register|sign up|reserve)/i;
  var MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

  var CSS_EVENTS = [
    "$H .cam-events{background-color:{cream}}",
    "$H .cam-events[hidden]{display:none}",
    "$H .cam-events .cam-head{align-items:center}",
    "$H .cam-events .cam-earrows{display:flex;gap:8px}",
    "$H .cam-events .cam-earrows button{display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:2px;border:1px solid {hair};background:#fff;color:{navy};cursor:pointer;padding:0;transition:background-color .2s ease,color .2s ease,opacity .2s ease}",
    "$H .cam-events .cam-earrows button:hover{background-color:{navy};color:#fff}",
    "$H .cam-events .cam-earrows button[disabled]{opacity:.35;cursor:default;background:#fff;color:{navy}}",
    "$H .cam-events .cam-etrack{display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 48px) / 3);gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:0 0 4px}",
    "$H .cam-events .cam-etrack::-webkit-scrollbar{display:none}",
    "$H .cam-events .cam-ecard{display:flex;flex-direction:column;scroll-snap-align:start;background:#fff;border:1px solid {hair};border-radius:2px;overflow:hidden;min-width:0}",
    "$H .cam-events .cam-eimg{position:relative;display:block;aspect-ratio:1/1;background-color:{navy};background-size:cover;background-position:center}",
    "$H .cam-events .cam-edate{position:absolute;left:0;top:18px;background-color:{navy};color:#fff;font-family:{sans};font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:9px 16px;line-height:1}",
    "$H .cam-events .cam-ebody{display:flex;flex-direction:column;flex:1;padding:26px 24px 24px}",
    "$H .cam-events .cam-etitle{font-family:{serif};font-weight:400;font-size:26px;line-height:1.15;letter-spacing:-.01em;color:{navy};margin:0 0 10px}",
    "$H .cam-events .cam-etitle a{font-family:{serif};font-weight:400;color:inherit;text-decoration:none}",
    "$H .cam-events .cam-edesc{font-size:15px;line-height:1.6;color:{muted};margin:0 0 18px}",
    "$H .cam-events .cam-erows{margin:auto 0 22px;border-top:1px solid {hair}}",
    "$H .cam-events .cam-erow{display:grid;grid-template-columns:72px minmax(0,1fr);gap:12px;padding:12px 0;border-bottom:1px solid {hair};font-size:14px;color:{ink}}",
    "$H .cam-events .cam-erow b{font-weight:600;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:{muted};padding-top:3px}",
    "$H .cam-events .cam-ersvp{display:flex;align-items:center;justify-content:center;height:48px;border:1px solid {navy};border-radius:2px;font-family:{sans};font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:{navy};text-decoration:none;transition:background-color .2s ease,color .2s ease}",
    "$H .cam-events .cam-ersvp:hover{background-color:{navy};color:#fff}",
    "$H .cam-events .cam-ecal{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}",
    "$H .cam-events .cam-ecal a{display:flex;align-items:center;justify-content:center;gap:8px;height:42px;background-color:{cream};border-radius:2px;font-family:{sans};font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:{navy};text-decoration:none;transition:background-color .2s ease}",
    "$H .cam-events .cam-ecal a:hover{background-color:{goldLight}}",
    "$H .cam-events .cam-ebar{position:relative;height:2px;margin-top:28px;background-color:{hair}}",
    "$H .cam-events .cam-ebar i{position:absolute;top:0;bottom:0;left:0;width:33%;background-color:{gold};transition:left .3s ease,width .3s ease}",
    "$H .cam-events .cam-eall{margin-top:30px}",
    "$H .cam-info .cam-igrid.cam-i2{grid-template-columns:repeat(2,minmax(0,1fr))}",
    "@media (max-width:1024px){",
    "$H .cam-events .cam-etrack{grid-auto-columns:calc((100% - 24px) / 2)}",
    "}",
    "@media (max-width:767px){",
    "$H .cam-events .cam-etrack{grid-auto-columns:86%;gap:14px}",
    "$H .cam-events .cam-earrows{display:none}",
    "$H .cam-events .cam-etitle{font-size:23px}",
    "$H .cam-info .cam-igrid.cam-i2{grid-template-columns:1fr}",
    "}"
  ];

  function calIcon() {
    return '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  /* "Sunday, November 1" + "6:00 PM" -> a Date (local wall time) */
  function eventStart(m, timeText) {
    var mon = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase());
    var day = parseInt(m[3], 10);
    var now = new Date();
    var year = now.getFullYear();
    if (new Date(year, mon, day) < new Date(now.getFullYear(), now.getMonth() - 2, 1)) year += 1;
    var t = (timeText || "").match(TIME_RE);
    var h = 0, min = 0, timed = false;
    if (t) {
      timed = true;
      h = parseInt(t[1], 10) % 12 + (/pm/i.test(t[3]) ? 12 : 0);
      min = t[2] ? parseInt(t[2], 10) : 0;
    }
    return { y: year, mo: mon + 1, d: day, h: h, mi: min, timed: timed };
  }
  function stamp(s, addH) {
    var dt = new Date(s.y, s.mo - 1, s.d, s.h + (addH || 0), s.mi);
    if (!s.timed) return dt.getFullYear() + pad2(dt.getMonth() + 1) + pad2(dt.getDate());
    return dt.getFullYear() + pad2(dt.getMonth() + 1) + pad2(dt.getDate()) + "T" + pad2(dt.getHours()) + pad2(dt.getMinutes()) + "00";
  }
  function googleLink(e) {
    var end = e.start.timed ? stamp(e.start, 1) : stamp({ y: e.start.y, mo: e.start.mo, d: e.start.d + 1, h: 0, mi: 0, timed: false });
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      String.fromCharCode(38) + "text=" + encodeURIComponent(e.title) +
      String.fromCharCode(38) + "dates=" + stamp(e.start) + "/" + end +
      String.fromCharCode(38) + "ctz=" + encodeURIComponent(EVENTS_TZ) +
      String.fromCharCode(38) + "details=" + encodeURIComponent((e.desc ? e.desc + " " : "") + e.rsvp);
  }
  function appleLink(e) {
    var nl = String.fromCharCode(13, 10);
    var end = e.start.timed ? stamp(e.start, 1) : stamp({ y: e.start.y, mo: e.start.mo, d: e.start.d + 1, h: 0, mi: 0, timed: false });
    var dtKind = e.start.timed ? ";TZID=" + EVENTS_TZ + ":" : ";VALUE=DATE:";
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Chabad of Allen-McKinney//Events//EN", "BEGIN:VEVENT",
      "UID:" + stamp(e.start) + "-" + e.title.replace(/[^A-Za-z0-9]/g, "") + "@chabadam.org",
      "DTSTAMP:" + stamp(e.start) + (e.start.timed ? "" : "T000000"),
      "DTSTART" + dtKind + stamp(e.start), "DTEND" + dtKind + end,
      "SUMMARY:" + e.title.replace(/[,;]/g, " "), "DESCRIPTION:" + ((e.desc ? e.desc + " " : "") + e.rsvp).replace(/[,;]/g, " "),
      "URL:" + e.rsvp, "END:VEVENT", "END:VCALENDAR"].join(nl);
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
  }

  function readEvents(doc) {
    var out = [], seen = [];
    $$("a", doc).forEach(function (a) {
      if (out.length >= EVENTS_MAX) return;
      if (!RSVP_RE.test(txt(a))) return;
      if (a.closest && a.closest("#header, #footer, .site-nav-wrapper, nav")) return;
      var card = a.parentNode, i;
      for (i = 0; i < 7 && card && card !== doc.body; i++) {
        if (card.querySelector("img") && WHEN_RE.test(txt(card))) break;
        card = card.parentNode;
      }
      if (!card || card === doc.body || i === 7 || seen.indexOf(card) > -1) return;
      /* climbed past the card into the list: more than one RSVP inside */
      if ($$("a", card).filter(function (x) { return RSVP_RE.test(txt(x)); }).length > 1) return;
      seen.push(card);
      var img = card.querySelector("img");
      var h = card.querySelector("h1, h2, h3, h4, h5, h6") || card.querySelector("strong, b");
      var title = txt(h) || attr(img, "alt").replace(/\s*flyer\s*$/i, "");
      /* the smallest element whose text holds the date line */
      var when = "";
      $$("*", card).forEach(function (n) {
        var t = txt(n);
        if (WHEN_RE.test(t) && t.length < 90 && (!when || t.length < when.length)) when = t;
      });
      if (!when) when = txt(card);
      var m = when.match(WHEN_RE);
      if (!m || !title) return;
      var rest = when.slice(when.indexOf(m[0]) + m[0].length);
      var tm = rest.match(/\d{1,2}(?::\d{2})?\s*(am|pm)(\s*[-\u2013]\s*\d{1,2}(?::\d{2})?\s*(am|pm))?/i);
      var desc = txt(card.querySelector(".event-description")) || txt(card.querySelector("p"));
      var cat = txt(card.querySelector(".category"));
      var src = img ? (img.getAttribute("data-src") || img.getAttribute("src") || "") : "";
      if (/spacer\.gif/i.test(src)) src = imgUrl(img);
      var href = a.getAttribute("href") || EVENTS_URL;
      var e = {
        title: title,
        badge: m[1].slice(0, 3) + ", " + m[2].slice(0, 3) + " " + m[3],
        time: tm ? tm[0].toUpperCase() : "",
        who: cat,
        desc: desc,
        rsvp: new URL(href, location.href).href,
        img: src ? new URL(src, location.href).href : ""
      };
      e.start = eventStart(m, e.time);
      out.push(e);
    });
    return out;
  }

  function renderEvents(sec, list) {
    var cards = list.map(function (e) {
      var rows = (e.time ? '<div class="cam-erow"><b>Time</b><span>' + esc(e.time) + "</span></div>" : "") +
        (e.who ? '<div class="cam-erow"><b>For</b><span>' + esc(e.who) + "</span></div>" : "");
      return '<article class="cam-ecard">' +
        '<a class="cam-eimg" href="' + esc(e.rsvp) + '"' + (e.img ? ' style="background-image:url(' + esc(e.img) + ')"' : "") + ' aria-label="' + esc(e.title) + '">' +
        '<span class="cam-edate">' + esc(e.badge) + "</span></a>" +
        '<div class="cam-ebody"><h3 class="cam-etitle"><a href="' + esc(e.rsvp) + '">' + esc(e.title) + "</a></h3>" +
        (e.desc ? '<p class="cam-edesc">' + esc(e.desc) + "</p>" : "") +
        '<div class="cam-erows">' + rows + "</div>" +
        '<a class="cam-ersvp" href="' + esc(e.rsvp) + '">Details ' + String.fromCharCode(38) + "amp; RSVP</a>" +
        '<div class="cam-ecal"><a href="' + esc(googleLink(e)) + '" target="_blank" rel="noopener">' + calIcon() + " Google</a>" +
        '<a href="' + esc(appleLink(e)) + '" download="' + esc(e.title.replace(/[^A-Za-z0-9 ]/g, "").trim() || "event") + '.ics">' + calIcon() + " Apple</a></div>" +
        "</div></article>";
    }).join("");
    sec.innerHTML = '<div class="cam-in"><div class="cam-head"><div><span class="cam-eyebrow">Join us</span>' +
      '<h2 class="cam-h2">Upcoming Events</h2></div>' +
      '<div class="cam-earrows"><button type="button" class="cam-eprev" aria-label="Previous events">' + arrowSvg("left") + "</button>" +
      '<button type="button" class="cam-enext" aria-label="More events">' + arrowSvg("right") + "</button></div></div>" +
      '<div class="cam-etrack">' + cards + "</div>" +
      '<div class="cam-ebar"><i></i></div>' +
      '<a class="cam-link cam-eall" href="' + esc(EVENTS_URL) + '">All events ' + longArrow() + "</a></div>";
    var track = $(".cam-etrack", sec), bar = $(".cam-ebar i", sec);
    var prev = $(".cam-eprev", sec), next = $(".cam-enext", sec);
    function step() { var c = $(".cam-ecard", track); return c ? c.getBoundingClientRect().width + 24 : 300; }
    function sync() {
      var max = track.scrollWidth - track.clientWidth;
      var vis = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
      bar.style.width = Math.max(vis * 100, 8) + "%";
      bar.style.left = (max > 0 ? (track.scrollLeft / max) * (100 - vis * 100) : 0) + "%";
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      $(".cam-ebar", sec).style.display = max > 2 ? "" : "none";
    }
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  }

  function loadEvents(home) {
    var sec = $(".cam-events", home);
    if (!sec || !window.fetch || !window.DOMParser) return;
    fetch(EVENTS_URL, { credentials: "same-origin" }).then(function (r) {
      return r.ok ? r.text() : "";
    }).then(function (html) {
      if (!html) return;
      var list = readEvents(new DOMParser().parseFromString(html, "text/html"));
      if (!list.length) return;
      renderEvents(sec, list);
      sec.hidden = false;
      /* the events now have their own section: drop the small widget */
      var w = $(".cam-info .upcoming_events", home);
      var col = w && w.closest ? w.closest(".cam-icol") : null;
      if (col) {
        var grid = col.parentNode;
        grid.removeChild(col);
        if ($$(".cam-icol", grid).length === 2) grid.className += " cam-i2";
      }
    }).catch(function (e) { if (window.console) console.warn("CAM events:", e); });
  }

  /* keep the new page flush with the window edges whatever the theme's
     wrapper width is */
  function bleed(node) {
    function fit() {
      node.style.marginLeft = "0px";
      node.style.width = "auto";
      var r = node.getBoundingClientRect();
      var w = document.documentElement.clientWidth;
      node.style.marginLeft = (-r.left) + "px";
      node.style.width = w + "px";
    }
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("load", fit);
  }

  function buildHome() {
    var table = $(".hp-table");
    if (!table) return false;
    var d = readHome(table);
    if (!d.hero || !d.hero.length) return false; /* not the layout we know: leave the page alone */
    /* the account link, not a post: footer icons first, then any link
       whose path is a profile name (not /p/, /reel/ ...) */
    var socialIg = "";
    $$(".cs-f-social-icons a").concat($$("a")).some(function (a) {
      var h = attr(a, "href");
      if (/instagram\.com\/(?!(p|reel|reels|explore|stories|tv)\/)[A-Za-z0-9_.]+\/?(\?.*)?$/i.test(h)) { socialIg = h; return true; }
      return false;
    });

    var home = el("div", "cam-home");
    home.appendChild(buildHero(d.hero));
    if (d.programs && d.programs.items.length) home.appendChild(buildPrograms(d.programs));
    /* filled from the Upcoming Events page once it loads (loadEvents) */
    var ev = el("section", "cam-sec cam-events");
    ev.hidden = true;
    home.appendChild(ev);
    if (d.band && d.band.length) home.appendChild(buildBand(d.band));
    if (d.insta) home.appendChild(buildInsta(d.insta, socialIg));
    if (d.photos) home.appendChild(buildPhotos(d.photos));
    /* quick links and the learning feature are left off the homepage (v2.1.0) */
    if (d.rows.length) home.appendChild(buildMore(d.rows));
    if (d.info && d.info.length) home.appendChild(buildInfo(d.info));
    if (d.mail) home.appendChild(buildMail(d.mail));

    table.parentNode.insertBefore(home, table);
    bleed(home);
    return true;
  }

  /* ======================================================================
     every page: header Donate button, footer, solid header on scroll
     ====================================================================== */
  function buildLogo() {
    var wrap = $("#header_branding .site-logo-wrapper");
    if (!wrap || $("img.cam-logo", wrap)) return;
    var a = $("a", wrap);
    if (!a) {
      a = el("a");
      a.setAttribute("href", "/");
      wrap.appendChild(a);
    }
    var img = el("img", "cam-logo");
    img.setAttribute("src", LOGO);
    img.setAttribute("alt", txt($("#header_branding .site_title")) || "Chabad of Allen-McKinney");
    a.appendChild(img);
    document.body.className += " cam-has-logo";
  }

  function buildHeader() {
    var hw = $("#header .header-wrapper");
    if (!hw || $(".cam-donate", hw)) return;
    var src = $("#tabContentMain .co_menu_item.donate_link a.parent") || $("#tabContentMain .donate_link a");
    if (!src) return;
    var a = el("a", "cam-donate", esc(txt(src) || "Donate"));
    a.setAttribute("href", attr(src, "href"));
    hw.appendChild(a);
  }

  function buildFooter() {
    var f = $("#footer");
    if (!f || $(".cam-footer", f)) return;
    var line = txt($(".footer3", f));
    var parts = line.split(BULLET).map(function (s) { return s.trim(); }).filter(Boolean);
    var name = parts[0] || txt($("#header_branding .site_title")) || document.title;
    var phone = "", email = "", ein = "";
    parts.slice(1).forEach(function (p) {
      if (/@/.test(p)) email = p;
      else if (/^EIN/i.test(p)) ein = p;
      else if (/\d{3}.*\d{4}/.test(p)) phone = p;
    });
    var logo = { src: LOGO };
    var social = $$(".cs-f-social-icons a", f).map(function (a) {
      return '<a href="' + esc(attr(a, "href")) + '" class="' + esc(a.className.replace(/\w+_homepage/g, "").trim()) + '" title="' + esc(attr(a, "title")) + '" aria-label="' + esc(attr(a, "title")) + '" target="_blank" rel="noopener"></a>';
    }).join("");
    var privacy = $("a.privacy-link", f);
    var year = new Date().getFullYear();
    var html = '<div class="cam-in"><div class="cam-fcols">' +
      '<div class="cam-fbrand">' + (logo ? '<img src="' + esc(logo.src) + '" alt="">' : "") +
      '<span class="cam-fname">' + esc(name) + "</span></div>" +
      "<div><span class=\"cam-flabel\">Contact</span>" +
      (phone ? '<a class="cam-fline" href="tel:' + esc(phone.replace(/[^\d+]/g, "")) + '">' + esc(phone) + "</a>" : "") +
      (email ? '<a class="cam-fline" href="mailto:' + esc(email) + '">' + esc(email) + "</a>" : "") +
      "</div>" +
      (social ? '<div><span class="cam-flabel">Follow</span><div class="cam-social">' + social + "</div></div>" : "<div></div>") +
      "</div>" +
      '<div class="cam-legal"><span>' + String.fromCharCode(169) + " " + year + " " + esc(name) + (ein ? " " + String.fromCharCode(183) + " " + esc(ein) : "") + "</span>" +
      '<span>Powered by <a href="https://www.chabad.org/" target="_blank" rel="noopener">Chabad.org</a>' +
      (privacy ? " " + String.fromCharCode(183) + ' <a href="' + esc(attr(privacy, "href")) + '" target="_blank" rel="noopener">Privacy Policy</a>' : "") +
      "</span></div></div>";
    var box = el("div", "cam-footer", html);
    f.insertBefore(box, f.firstChild);
    f.className += " cam-has-footer";
  }

  function watchScroll() {
    var hdr = document.getElementById("header");
    if (!hdr) return;
    var solid = null;
    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var want = IS_HOME ? y > 40 : true;
      if (want === solid) return;
      solid = want;
      if (want) { if (!/\bcam-solid\b/.test(hdr.className)) hdr.className += " cam-solid"; }
      else hdr.className = hdr.className.replace(/\s*\bcam-solid\b/g, "");
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ======================================================================
     run
     ====================================================================== */
  if (IS_HOME) addStyle("cam-cover", CSS_COVER);
  var coverTimer = setTimeout(removeCover, COVER_MAX_MS);

  function run() {
    try {
      addFonts();
      var blocks = [CSS_HEADER, CSS_INNER, CSS_FOOTER];
      if (IS_HOME) blocks = blocks.concat([CSS_HOME, CSS_HERO, CSS_PROGRAMS, CSS_EVENTS, CSS_BAND, CSS_MID, CSS_INFO]);
      var css = [];
      for (var i = 0; i < blocks.length; i++) css.push(fill(blocks[i]));
      addStyle("cam-style", important(css.join("\n")) + "\n" + CSS_RAW);
      document.body.className += " cam";
      try { buildLogo(); } catch (e0) { if (window.console) console.warn("CAM logo:", e0); }
      try { buildHeader(); } catch (e1) { if (window.console) console.warn("CAM header:", e1); }
      try { buildFooter(); } catch (e2) { if (window.console) console.warn("CAM footer:", e2); }
      if (IS_HOME) {
        var built = false;
        try { built = buildHome(); } catch (e3) { if (window.console) console.warn("CAM home:", e3); }
        if (built) {
          document.body.className += " cam-home";
          try { loadEvents(document); } catch (e4) { if (window.console) console.warn("CAM events:", e4); }
        }
      }
      watchScroll();
      if (window.console) console.log("CAM layout v" + VERSION + ": running on " + (IS_HOME ? "homepage" : "inner page"));
    } catch (e) {
      if (window.console) console.warn("CAM layout failed:", e);
    }
    clearTimeout(coverTimer);
    removeCover();
  }

  onReady(run);
})();
