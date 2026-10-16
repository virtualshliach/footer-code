# footer-code

Hosted footer code for Yudell's ChabadOne client sites. Served by GitHub Pages at
`https://virtualshliach.github.io/footer-code/`. Every push to `main` goes live for
real visitors within ~10 minutes (Pages caches for 10 min). Treat `main` as production.

## Layout

- One folder per client site (`riverside/`, ...). Nothing is shared between sites.
- `<site>/footer.js` is the loader. It is the ONLY URL pasted into that site's
  ChabadOne footer, once, and must never be renamed or moved.
- `<site>/<project>.js` are project files, loaded by the loader only on the page ids
  listed in its `PAGES` map.
- `<site>/archive/` holds retired code for reference. Never loaded.
- `_template/footer.js` is the starting loader for a new site.
- `tools/` holds tests; `tools/node_modules` is git-ignored.

## Rules

- Each project file still guards itself on its own aid (defense in depth). Keep the
  aid in the project's CFG and the loader's `PAGES` key in sync.
- Bump `V` in `<site>/footer.js` whenever any file in that site's folder changes,
  in the same commit, so browsers fetch the new project file.
- Loaders load only `^[a-z0-9-]+\.js$` files from their own folder. Never add code that
  loads a URL taken from the page, query string, or any external source.
- No secrets in this repo, ever: no Stripe secret keys, Authorize.Net transaction keys,
  passwords or API tokens. The repo and the served code are public. Publishable keys
  and Apps Script web-app URLs are fine.
- Hosted files do NOT go through the ChabadOne footer box, so the old footer-box
  packaging rules (base64 wrap, ASCII only, no `&`, no `--`, 128KB cap) do not apply.
  The ChabadOne page-behavior rules still apply (never `display:none` a native form,
  reCAPTCHA must stay rendered, Prototype.js not jQuery, AJAX submits, etc.).
- Drafts target a draft page id. Move to the live id only when Yudell says go live.
- Run `node tools/test.js` before every push; push only when Yudell asks.

## Sites

| Folder | Site | Footer line |
|---|---|---|
| riverside | jewishriverside.com | `<script src="https://virtualshliach.github.io/footer-code/riverside/footer.js"></script>` |
