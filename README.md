# leclosdesclefs.com

Website for **Le Clos des Clefs**, a wedding and seminar venue at La Couture-Boussey
(Eure, Normandy), an hour from Paris. Formerly known as La Ferme des Luthiers. The estate
has belonged to the Lot family, makers of transverse flutes, for more than 300 years.

Weddings come first, seminars second. The page exists to get couples and companies to
send an enquiry.

Built with ClaudeNav. Edit `index.html` (or ask Claude), then Publish to update the live site.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site — markup, styles, translations and the enquiry form, no dependencies |
| `BUSINESS.md` | Internal notes from the earlier Lutherium project (creative campus). Not used by the site |
| `images/` | Photos from lafermedesluthiers.com, max 1800px, with 900/1800px WebP variants |

## Domains

`leclosdesclefs.com` is served by GitHub Pages (`CNAME`). `lutherium.com`,
`leclosdescles.com`, `closdesclefs.com` and `closdescles.com` (and their `www.`) 301 to it
through a Cloudflare Bulk Redirect list that preserves path and query string.

## Languages

French is the source of truth: it lives directly in the HTML. English is a translation
layer in the `EN` dictionary near the bottom of `index.html`, keyed by `data-i18n`.

**To change French text**, edit the HTML element.
**To change English text**, edit the matching key in `EN`.
**To add a new translatable string**, give the element a `data-i18n="someKey"` and add
`someKey` to `EN`.

Language is chosen by `?lang=fr|en`, then the visitor's saved choice, then their browser,
defaulting to French.

## Where enquiries go

At the top of the `<script>` block in `index.html`:

```js
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "jb@musichackspace.org";
```

- **Left empty (current setting)** — submitting opens the visitor's email client with the
  enquiry pre-filled, addressed to `CONTACT_EMAIL`. A *copy my enquiry* button appears in
  case the mail client does not open. Expect to lose a share of enquiries this way,
  especially on mobile.
- **Set to a URL** — the enquiry is POSTed as JSON. Any form backend that accepts JSON
  works; [Formspree](https://formspree.io) (`https://formspree.io/f/xxxxxxx`) is the quickest.

Option values in the form are French labels (`Mariage`, `50 à 100`…) and do not change
with the display language, so every enquiry arrives readable.

The *Demander une date* / *Demander un devis* buttons carry `data-type` and pre-select the
event type in the form. GA4 events: `cta_click`, `enquiry_submit` (only with consent).

## Section order

hero · `#mariages` · `#seminaires` · `#lieu` · `#histoire` · `#acces` · `#contact`

## What the copy deliberately does not say

No capacity, price, curfew or caterer policy appears anywhere — none has been decided
for the site yet. Add them only once they are confirmed; they are the next most useful
additions, together with photos of real weddings.
