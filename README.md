# footer-code

Custom code for ChabadOne client sites, hosted on GitHub Pages so each site's footer
holds a single line instead of pasted code.

## How it works

Each site has its own folder. The site's ChabadOne footer contains one line that
points at that folder's `footer.js`:

```html
<script src="https://virtualshliach.github.io/footer-code/SITE/footer.js"></script>
```

`footer.js` checks which page the visitor is on and loads only that page's project
file. Pages with no project download nothing else.

## Sites

| Folder | Site | Projects |
|---|---|---|
| `riverside/` | jewishriverside.com | `chanukah-2026.js` (draft, page 7553387), `sukkot-5787.js` (page 7457011) |

## Adding a site

1. Copy `_template/` to a new folder named for the site.
2. Set `SITE` in its `footer.js`.
3. Paste the footer line (with the new folder name) into that site's ChabadOne footer.

## Safety

- Two-factor sign-in stays on for this GitHub account.
- No secret keys or passwords in this repository; everything here is public.
- Every change is a commit, so any change can be rolled back.
