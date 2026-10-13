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

The form POSTs JSON to `https://api.leclosdesclefs.com/` (`FORM_ENDPOINT` in `index.html`).
That is a Cloudflare Worker in `contact-worker/` which sends the enquiry by **Mailgun SMTP
(EU, sending domain `mail.musichackspace.org`)** — the same credentials as the
`certified-courses` and `chordline-ventures` Heroku apps — to `jb@musichackspace.org`, with
Reply-To set to the visitor, so replying to the email answers them.

The Worker accepts only the site's origins, validates name and email, caps field lengths
and drops submissions that fill the hidden `site_web` honeypot. If sending fails, the
visitor sees the email address to write to directly.

Deploy / update — **run from inside `contact-worker/`**, where `wrangler.toml` gives the
Worker name and the Cloudflare account (the login has two accounts):

```sh
cd contact-worker
npm install
wrangler login                         # once
heroku config:get MAILGUN_SMTP_USER -a chordline-ventures | tr -d '\n' | wrangler secret put MAILGUN_SMTP_USER
heroku config:get MAILGUN_SMTP_PASSWORD -a chordline-ventures | tr -d '\n' | wrangler secret put MAILGUN_SMTP_PASSWORD
wrangler deploy                        # also creates api.leclosdesclefs.com
```

After a Mailgun password reset, update `certified-courses` and `chordline-ventures` on
Heroku first, then re-run the `MAILGUN_SMTP_PASSWORD` line above.

Recipient, sender and allowed origins are plain `[vars]` in `contact-worker/wrangler.toml`.
Never put the SMTP credentials in that file: this repository is public.

Option values in the form are French labels (`Mariage`, `50 à 100`…) and do not change
with the display language, so every enquiry arrives readable.

The *Demander une date* / *Demander un devis* buttons carry `data-type` and pre-select the
event type in the form; *Demander les disponibilités* (`data-rooms`) pre-selects
« Oui » for on-site bedrooms. GA4 events: `cta_click`, `enquiry_submit` (only with consent).

## Section order

hero · `#mariages` · `#seminaires` · `#chambres` · `#lieu` · `#histoire` · `#acces` · `#contact`

## What the copy deliberately does not say

The only figure given for accommodation is **ten bedrooms on site** — no room types,
rates or per-room capacity. No event capacity, price, curfew or caterer policy appears
anywhere either — none has been decided for the site yet. Add them only once they are confirmed; they are the next most useful
additions, together with photos of real weddings.
