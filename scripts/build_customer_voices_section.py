import csv
import html
import re
from pathlib import Path


BASE = Path(r"D:/OneDrive/Codex/AAW-Website")
SOURCE = BASE / "exports/aaw-monitor-reviews/mapped-to-aaw/aaw-monitor-reviews-unmapped-legacy.csv"
SECTION = BASE / "aaw-theme/sections/aaw-customer-voices.liquid"

MODEL_PATTERNS = [
    r"\bGenuine\s+Advanced\s+M5'?s?\b",
    r"\bAdvanced\s+M5'?s?\b",
    r"\bAAW\s*Q\s*(?:In[- ]Canal\s+Monitors?)?\b",
    r"\bA2H\s*Pro\s*V2\b",
    r"\bA2H\s*Pro\b",
    r"\bA2H\b",
    r"\bA1D\b",
    r"\bACH\s*Ceramic\b",
    r"\bACH\b",
    r"\bAcho\s*ceramic\b",
    r"\bKingfisher\b",
    r"\bNebula\s*One\b",
    r"\bNebula\s*Two\b",
    r"\bNebula\s*2\b",
    r"\bW300AR\b",
    r"\bW350s?\b",
    r"\bW100\b",
    r"\bM5-?1D\b",
    r"\bM5-?5D\b",
    r"\bM5'?s?\b",
    r"\bM40\b",
    r"\bMeister\s*W100\b",
]

DEALER_PATTERNS = [
    r"\bNull[-\s]+Audio'?s?\b",
]

POSITIVE_TERMS = [
    "sound",
    "bass",
    "clear",
    "clarity",
    "fit",
    "comfortable",
    "comfort",
    "build",
    "quality",
    "detail",
    "stage",
    "isolation",
    "balanced",
    "natural",
    "monitor",
    "custom",
    "iem",
    "vocal",
    "treble",
    "resolution",
    "separation",
    "performance",
    "price",
    "value",
    "excellent",
    "amazing",
    "perfect",
    "great",
]

NEGATIVE_TERMS = [
    "not worth",
    "never arrived",
    "poor",
    "bad fit",
    "problem",
    "complaint",
    "lousy",
]

DATE_REFERENCE_PATTERN = re.compile(
    r"\b(?:19|20)\d{2}\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\b|\b\d+\s+years?\b|\byear\s+ago\b",
    re.IGNORECASE,
)


def normalize_text(value):
    return re.sub(r"\s+", " ", value or "").strip()


def strip_exact_models(text):
    cleaned = text
    for pattern in DEALER_PATTERNS:
        cleaned = re.sub(pattern, "the dealer", cleaned, flags=re.IGNORECASE)
    for pattern in MODEL_PATTERNS:
        cleaned = re.sub(pattern, "AAW monitors", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bAAW monitors\s+AAW monitors\b", "AAW monitors", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bthe AAW monitors\b", "AAW monitors", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bAAW monitors is\b", "AAW monitors are", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bAAW monitors-?Pro\b", "AAW monitors", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bthe dealer\s+products\b", "the dealer's products", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def excerpt(text, limit=320):
    text = strip_exact_models(normalize_text(text))
    if len(text) <= limit:
        return text
    sentence_end = max(text.rfind(".", 0, limit), text.rfind("!", 0, limit), text.rfind("?", 0, limit))
    if sentence_end >= 80:
        return text[:sentence_end + 1]
    cut = text[:limit].rsplit(" ", 1)[0].rstrip(" ,;:")
    return f"{cut}."


def score(row):
    body = normalize_text(row["body"])
    title = normalize_text(row["title"])
    low = f"{title} {body}".lower()
    value = len(body) / 60
    value += int(row["rating"]) * 9
    value += sum(term in low for term in POSITIVE_TERMS) * 4
    value -= sum(term in low for term in NEGATIVE_TERMS) * 12
    if len(body) < 55:
        value -= 12
    if len(body) > 650:
        value -= 10
    if "service" in low and "sound" not in low and "fit" not in low:
        value -= 10
    return value


def author_name(name):
    name = normalize_text(name)
    if not name or name.lower() == "customer":
        return "AAW owner"
    parts = name.split()
    if len(parts) == 1:
        return html.escape(parts[0])
    return html.escape(f"{parts[0]} {parts[-1][0]}.")


def has_named_author(row):
    name = normalize_text(row["reviewer_name"])
    return bool(name) and name.lower() != "customer"


def has_date_reference(row):
    return bool(DATE_REFERENCE_PATTERN.search(f"{row.get('title', '')} {row.get('body', '')}"))


def load_reviews():
    with SOURCE.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = []
        for row in csv.DictReader(handle):
            body = normalize_text(row["body"])
            if row["rating"] not in {"4", "5"}:
                continue
            if len(body) < 25:
                continue
            low = f"{row['title']} {body}".lower()
            if any(term in low for term in ["not worth", "never arrived", "poor product"]):
                continue
            rows.append(row)
    rows.sort(key=score, reverse=True)
    named = [row for row in rows if has_named_author(row)]
    anonymous = [row for row in rows if not has_named_author(row)]
    named_without_dates = [row for row in named if not has_date_reference(row)]
    named_with_dates = [row for row in named if has_date_reference(row)]
    featured = next(
        (row for row in named_without_dates if len(normalize_text(row["body"])) >= 180),
        named_without_dates[0],
    )
    ordered = [featured] + [row for row in named_without_dates if row is not featured] + named_with_dates + anonymous
    return ordered[:100]


def card_markup(row, featured=False):
    quote = excerpt(row["body"])
    if not quote:
        quote = excerpt(row["title"])
    classes = "aaw-voice-card is-featured" if featured else "aaw-voice-card"
    return f'''      <article class="{classes}">
        <div class="aaw-voice-card__meta"><b>{html.escape(row["rating"])} / 5</b></div>
        <blockquote>{html.escape(quote)}</blockquote>
        <footer>{author_name(row["reviewer_name"])}</footer>
      </article>'''


def build_section(cards):
    rendered_cards = []
    for index, row in enumerate(cards):
        if index == 8:
            rendered_cards.append("      {% if section.settings.layout_mode == 'page' %}")
        rendered_cards.append(card_markup(row, featured=(index == 0)))
    rendered_cards.append("      {% endif %}")
    cards_markup = "\n\n".join(rendered_cards)
    return f"""{{{{ 'aaw-customer-voices.css' | asset_url | stylesheet_tag }}}}

<section class=\"aaw-voices aaw-voices--{{{{ section.settings.layout_mode }}}}\" aria-labelledby=\"aaw-voices-title-{{{{ section.id }}}}\">
  <div class=\"aaw-voices__wrap\">
    <div class=\"aaw-voices__head\">
      <div>
        <p class=\"aaw-voices__kicker\">{{{{ section.settings.eyebrow }}}}</p>
        <h2 id=\"aaw-voices-title-{{{{ section.id }}}}\">{{{{ section.settings.heading }}}}</h2>
      </div>
      <div class=\"aaw-voices__intro\">
        <p>{{{{ section.settings.intro }}}}</p>
        {{% if section.settings.layout_mode == 'home' %}}
          <a class=\"aaw-voices__link\" href=\"{{{{ section.settings.page_link }}}}\">Read more customer voices</a>
        {{% endif %}}
      </div>
    </div>

    {{% if section.settings.layout_mode == 'page' %}}
      <div class=\"aaw-voices__hero\">
        <figure>
          <img src=\"{{{{ 'aaw-ins-gallery-custom-2025.webp' | asset_url }}}}\" alt=\"AAW custom in-ear monitor shell craft and finishing\" width=\"900\" height=\"900\" loading=\"eager\">
        </figure>
        <div>
          <span>Customer voices</span>
          <h3>Real owner impressions from AAW listeners around the world.</h3>
          <p>Collected through AAW dealers via Judge.me, these comments focus on fit, sound, comfort, and everyday listening.</p>
        </div>
      </div>
    {{% endif %}}

    <div class=\"aaw-voices__grid\">
{cards_markup}
    </div>
  </div>
</section>

{{% schema %}}
{{
  \"name\": \"AAW customer voices\",
  \"tag\": \"section\",
  \"class\": \"aaw-customer-voices-section\",
  \"settings\": [
    {{
      \"type\": \"select\",
      \"id\": \"layout_mode\",
      \"label\": \"Layout\",
      \"default\": \"home\",
      \"options\": [
        {{ \"value\": \"home\", \"label\": \"Homepage compact\" }},
        {{ \"value\": \"page\", \"label\": \"Full page\" }}
      ]
    }},
    {{
      \"type\": \"text\",
      \"id\": \"eyebrow\",
      \"label\": \"Eyebrow\",
      \"default\": \"Customer voices\"
    }},
    {{
      \"type\": \"text\",
      \"id\": \"heading\",
      \"label\": \"Heading\",
      \"default\": \"What listeners remember after the first listen.\"
    }},
    {{
      \"type\": \"textarea\",
      \"id\": \"intro\",
      \"label\": \"Intro\",
      \"default\": \"Customer impressions collected through AAW dealers via Judge.me, selected for sound, fit, and long-term listening notes.\"
    }},
    {{
      \"type\": \"url\",
      \"id\": \"page_link\",
      \"label\": \"Full testimonial page link\"
    }}
  ],
  \"presets\": [
    {{
      \"name\": \"AAW customer voices\"
    }}
  ]
}}
{{% endschema %}}
"""


def main():
    cards = load_reviews()
    if len(cards) < 100:
        raise SystemExit(f"Only selected {len(cards)} reviews")
    SECTION.write_text(build_section(cards), encoding="utf-8")
    print(f"Wrote {len(cards)} customer voice cards to {SECTION}")


if __name__ == "__main__":
    main()
