# Lutherium.com

Market-research site for **Lutherium** — a proposed world-connected campus for work and
creation, dedicated to music, the creative professions and *facture instrumentale*
(instrument making), at La Ferme des Luthiers, La Couture-Boussey (Eure).

It has two jobs: measure demand (the survey), and be the public face the people who decide
whether this happens will read — team offsite buyers, prospective residents, patrons, and
the public bodies instructing funding applications.

Built with ClaudeNav. Edit `index.html` (or ask Claude), then Publish to update the live site.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site — markup, styles, translations and the survey, no dependencies |
| `BUSINESS.md` | Internal business skeleton: segments, pricing hypotheses, phases, risks, go/no-go criteria |
| `images/` | Photos from lafermedesluthiers.com, resized to max 1800px JPEG |

## Languages

French is the source of truth: it lives directly in the HTML. English is a translation
layer in the `EN` dictionary near the bottom of `index.html`, keyed by `data-i18n`.

**To change French text**, edit the HTML element.
**To change English text**, edit the matching key in `EN`.
**To add a new translatable string**, give the element a `data-i18n="someKey"` and add
`someKey` to `EN`.

Language is chosen by `?lang=fr|en`, then the visitor's saved choice, then their browser,
defaulting to French.

## Where survey answers go

At the top of the `<script>` block in `index.html`:

```js
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "jb@musichackspace.org";
```

- **Left empty (current setting)** — submitting opens the visitor's email client with
  their answers pre-filled, addressed to `CONTACT_EMAIL`. No server needed, but it costs
  the visitor an extra click and loses some responses.
- **Set to a URL** — answers are POSTed as JSON. Any form backend that accepts JSON works;
  [Formspree](https://formspree.io) (`https://formspree.io/f/xxxxxxx`) is the quickest.

**Switching to a real endpoint before promoting the site is strongly recommended — the
mailto fallback will undercount responses. The questionnaire is now longer (team size,
offsite budget, forms of support), so a lost response costs more than it used to.

Direct enquiries bypass the survey entirely: the four cards in `#contact` are `mailto:`
links with pre-filled subjects and body templates, one per audience (offsite, residency,
support/patronage, institutions and press).

## Section order

`#vision` · `#lieu` (incl. access: train, car, last mile) · `#patrimoine` · `#offre` ·
`#modele` · `#engagements` (social-enterprise commitments) · founder · `#contact` · `#etude`.

## Two things the copy is deliberately doing

1. **Services, not space.** Every format in `#offre` is described as a hosted service —
   welcome, facilitation, programme, technical support, catering, accommodation — never as
   letting premises. Zoned tax regimes and the district's business-property aid exclude
   *activité civile*, i.e. property letting; the public site is a written record of how the
   activity is described. Keep it that way when editing prices or features.
2. **`facture instrumentale`, not `lutherie`.** That is the term used in the tax code, in
   the EPV and Maître d'Art labels and in the CIMA craft-trades tax credit. "La Ferme des
   Luthiers" stays as the historic name of the place.

## Photo credits

Photographs are from the existing lafermedesluthiers.com project
(`~/Docs/Perso/ferme des luthiers website`), converted from PNG to JPEG and capped at
1800px (13 MB → 5.6 MB).
