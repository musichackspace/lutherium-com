# Lutherium.com

Market-research site for **Lutherium** — a proposed world-connected place to stay, work
and create, dedicated to music, the creative professions and *facture instrumentale*
(instrument making), at La Ferme des Luthiers, La Couture-Boussey (Eure).

**The model sells a stay, not a desk.** Accommodation and catering are the product, not
extras, which brings the site under France's ERP regime (*établissement recevant du
public*, types O and N). Everything on the page is priced **per person per night, full
board included** — that is the unit offsite buyers compare. The old co-working
memberships have been removed rather than left in place: keeping a price we no longer
believe in would have corrupted the willingness-to-pay the survey is there to measure.

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

**This is the single largest leak in the study.** Expect to lose roughly half of
completed questionnaires to the mailto fallback, disproportionately on mobile. Create a
Formspree form (or anything that accepts a JSON POST), paste the URL, and nothing else
in the file needs to change.

Three things soften the loss until then:

- **Draft persistence.** Every keystroke is saved to `localStorage` under
  `lutherium-draft` and restored on the next visit, so a half-finished questionnaire
  survives a bounce. Cleared on successful POST. Nothing leaves the browser.
- **Copy fallback.** If the mail client does not open, a *copy my answers* button
  appears under the form.
- **Stable answer codes.** Every `<option>` carries a `value` equal to its `data-i18n`
  key (`i1`, `np3`, `w2`…), so a French and an English respondent choosing the same
  answer produce the same string. The readable French labels travel alongside, under
  `libelles` in the JSON and in the email body. **Do not remove those `value`
  attributes** — without them the answers arrive as localised free text and the study
  has to be recoded by hand.

Direct enquiries bypass the survey entirely: the four cards in `#contact` are `mailto:`
links with pre-filled subjects and body templates, one per audience (team stay, residency,
support/patronage, institutions and press). The stay and residency templates now ask for
number of nights, room preference and dietary/accessibility needs.

## Section order

`#vision` · **seed question** · why · `#lieu` (incl. access) · **`#sejour`** ·
`#patrimoine` · `#offre` · `#modele` · `#engagements` · founder · `#contact` · `#etude`.

## Balancing the dossier against the survey

The page has two audiences with opposite needs: a handful of institutional readers who
want the full dossier, and the hundreds of survey respondents who will not scroll
through it. Three mechanisms keep both served:

1. **The seed question** (`section.seed`, right after `#vision`). The survey's interest
   question, asked high up as four buttons. Clicking one selects it in `#interet` and
   scrolls to `#etude` — starting a form is the hard step, so it is removed.
2. **Folds.** `<details class="fold">` collapses the restoration programme, the revenue
   streams, the four commitments and the founder's background. The content stays in the
   page — indexable, printable — without lengthening the public scroll.
3. **Sticky CTA** (`#stickycta`), mobile only, shown once the hero has scrolled past and
   hidden again once `#etude` is on screen.

## The survey

Six numbered steps; `profil`, `zone`, `interet` and **`prixNuit`** are required. That
last one is the number the go/no-go in `BUSINESS.md` §7 turns on, which is why it is
mandatory. Section 3 (*Le séjour*) is the ERP core: nights, room type, price per night
full board, weekday/weekend, season, dietary and accessibility needs. The team section
asks for nights separately from headcount — that pair sizes the bed capacity decision,
the main capex call of phase 2.

Note `#lieu` is the place section; the survey's location field is `#zone` (it used to
be a second `#lieu`, a duplicate ID that broke both the nav anchor and the label).

## Two things the copy is deliberately doing

1. **Services, not space.** Every format in `#offre` is described as a hosted service —
   welcome, facilitation, programme, technical support, catering, accommodation — never as
   letting premises. The ERP shift *reinforces* this: accommodation plus catering is
   about as far from *activité civile* as an activity can get. `#sejour` card 04 and the
   ERP paragraph in `#modele` state the obligations openly — for institutional readers
   that reads as costed realism, not as a liability. Zoned tax regimes and the district's business-property aid exclude
   *activité civile*, i.e. property letting; the public site is a written record of how the
   activity is described. Keep it that way when editing prices or features.
2. **`facture instrumentale`, not `lutherie`.** That is the term used in the tax code, in
   the EPV and Maître d'Art labels and in the CIMA craft-trades tax credit. "La Ferme des
   Luthiers" stays as the historic name of the place.

## The one thing still missing

There is no photograph of a bedroom or of a laid table anywhere in `images/`. For a site
that now sells the stay, that is the largest remaining gap — `#sejour` currently falls
back on the exterior of the Bergerie. Nothing else on this list would lift conversion as
much as one good photograph of a bed and one of people eating together.

Relatedly, `#sejour` deliberately states **no bed count**. The number is not decided, and
sizing it is precisely what the survey is for. Do not add a figure there before the
results are in.

## Photo credits

Photographs are from the existing lafermedesluthiers.com project
(`~/Docs/Perso/ferme des luthiers website`), converted from PNG to JPEG and capped at
1800px (13 MB → 5.6 MB).
