from pathlib import Path

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image as RLImage,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "AAW_Authorized_Distributor_Certificate_SPB_NASTECH_2026-2028.pdf"
TMP = ROOT / "tmp" / "pdfs" / "aaw_certificate_nastech"
LOGO = ROOT / "tmp" / "pdfs" / "original_certificate" / "aaw_logo_crop.png"
LOGO_TRANSPARENT = TMP / "aaw-logo-transparent.png"
SIGNATURE_SRC = ROOT / "kevin-wang-signature-gold-preview.png"
SIGNATURE_TRANSPARENT = TMP / "kevin-wang-signature-transparent.png"
FONT_DIR = Path("C:/Windows/Fonts")

# ── Professional business font stack ──────────────────────────────────
DISPLAY = "Bodoni"                    # elegant display serif
DISPLAY_BOLD = "Bodoni-Bold"          # authoritative titles
SERIF = "TimesNewRoman"               # business body standard
SERIF_BOLD = "TimesNewRoman-Bold"
SERIF_ITALIC = "TimesNewRoman-Italic"
SANS = "Arial"                        # clean label contrast
SANS_BOLD = "Arial-Bold"


def register_fonts() -> None:
    font_files = {
        DISPLAY: FONT_DIR / "BOD_R.TTF",
        DISPLAY_BOLD: FONT_DIR / "BOD_B.TTF",
        SERIF: FONT_DIR / "times.ttf",
        SERIF_BOLD: FONT_DIR / "timesbd.ttf",
        SERIF_ITALIC: FONT_DIR / "timesi.ttf",
        SANS: FONT_DIR / "arial.ttf",
        SANS_BOLD: FONT_DIR / "arialbd.ttf",
    }
    for name, path in font_files.items():
        if path.exists():
            pdfmetrics.registerFont(TTFont(name, str(path)))
    pdfmetrics.registerFontFamily(
        SERIF, normal=SERIF, bold=SERIF_BOLD, italic=SERIF_ITALIC,
    )


def make_signature_transparent() -> None:
    TMP.mkdir(parents=True, exist_ok=True)
    im = Image.open(SIGNATURE_SRC).convert("RGBA")
    pixels = []
    source_pixels = im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata()
    for r, g, b, a in source_pixels:
        if r < 38 and g < 38 and b < 38:
            pixels.append((255, 255, 255, 0))
        else:
            pixels.append((r, g, b, a))
    im.putdata(pixels)
    im.save(SIGNATURE_TRANSPARENT)


def make_logo_transparent() -> None:
    TMP.mkdir(parents=True, exist_ok=True)
    im = Image.open(LOGO).convert("RGBA")
    pixels = []
    source_pixels = im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata()
    for r, g, b, a in source_pixels:
        if r > 244 and g > 244 and b > 244:
            pixels.append((255, 255, 255, 0))
        else:
            pixels.append((r, g, b, a))
    im.putdata(pixels)
    im.save(LOGO_TRANSPARENT)


def fit_image(path: Path, max_w: float, max_h: float) -> RLImage:
    im = Image.open(path)
    w, h = im.size
    scale = min(max_w / w, max_h / h)
    return RLImage(str(path), width=w * scale, height=h * scale)


# ── Clean, minimal frame ──────────────────────────────────────────────
def draw_frame(canvas, doc):
    width, height = A4
    canvas.saveState()

    gold = colors.HexColor("#B8893D")
    dark = colors.HexColor("#1E1E1E")
    paper = colors.HexColor("#FFFDF8")
    rule = colors.HexColor("#D7C196")
    subtle_bg = colors.HexColor("#FAF7F0")

    margin = 16 * mm

    # Paper fill
    canvas.setFillColor(paper)
    canvas.rect(0, 0, width, height, stroke=0, fill=1)

    # Header area – subtle background band
    canvas.setFillColor(subtle_bg)
    canvas.rect(margin, height - 38 * mm, width - 2 * margin, 22 * mm, stroke=0, fill=1)

    # Outer border – dark, business-like
    canvas.setStrokeColor(dark)
    canvas.setLineWidth(1.5)
    canvas.rect(margin, margin, width - 2 * margin, height - 2 * margin, stroke=1, fill=0)

    # Inner accent line – subtle gold
    canvas.setStrokeColor(gold)
    canvas.setLineWidth(0.5)
    canvas.rect(margin + 5 * mm, margin + 5 * mm, width - 2 * margin - 10 * mm, height - 2 * margin - 10 * mm, stroke=1, fill=0)

    # Header rule
    canvas.setStrokeColor(rule)
    canvas.setLineWidth(0.5)
    canvas.line(margin + 8 * mm, height - 38 * mm, width - margin - 8 * mm, height - 38 * mm)

    # Footer rule
    canvas.line(margin + 8 * mm, margin + 20 * mm, width - margin - 8 * mm, margin + 20 * mm)

    # Watermark logo – very faint, centered
    if hasattr(canvas, "setFillAlpha"):
        canvas.setFillAlpha(0.035)
        logo_w = 120 * mm
        logo_h = 32 * mm
        canvas.drawImage(
            str(LOGO_TRANSPARENT),
            (width - logo_w) / 2,
            height * 0.42,
            logo_w,
            logo_h,
            mask="auto",
        )
        canvas.setFillAlpha(1)

    # Header line: issuer left, brand right
    canvas.setFillColor(colors.HexColor("#444444"))
    canvas.setFont(SANS, 7.5)
    canvas.drawString(margin + 10 * mm, height - 28.5 * mm, "NASTECH (UEN: 53208987A)")
    canvas.setFont(SANS_BOLD, 7.5)
    canvas.drawRightString(width - margin - 10 * mm, height - 28.5 * mm, "AAW / Advanced AcousticWerkes")

    # Footer line
    canvas.setFont(SANS, 6.5)
    canvas.setFillColor(colors.HexColor("#999999"))
    canvas.drawCentredString(width / 2, margin + 9 * mm, "This certificate is issued for verification of authorized distributor status only.")

    canvas.restoreState()


# ── Helpers ───────────────────────────────────────────────────────────
def p(text, style):
    return Paragraph(text, style)


# ── Build ─────────────────────────────────────────────────────────────
def build_pdf() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    register_fonts()
    make_logo_transparent()
    make_signature_transparent()

    styles = getSampleStyleSheet()

    # Colour tokens
    ink = colors.HexColor("#1A1A1A")          # near-black body
    gold = colors.HexColor("#B8893D")          # brand gold accent
    dark_gold = colors.HexColor("#8F6426")     # deeper gold for headings
    table_bg = colors.HexColor("#F9F6EF")      # warm off-white for tables
    label_bg = colors.HexColor("#F0EBE0")      # label column tint

    body = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontName=SERIF,
        fontSize=10,
        leading=14,
        textColor=ink,
        alignment=TA_LEFT,
        spaceAfter=4,
    )
    small = ParagraphStyle(
        "Small",
        parent=body,
        fontName=SERIF,
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#2B2B2B"),
        spaceAfter=0,
    )
    center_small = ParagraphStyle(
        "CenterSmall",
        parent=small,
        alignment=TA_CENTER,
    )
    title = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontName=DISPLAY_BOLD,
        fontSize=24,
        leading=28,
        alignment=TA_CENTER,
        textColor=ink,
        spaceAfter=0,
    )
    subtitle = ParagraphStyle(
        "Subtitle",
        parent=body,
        fontName=SERIF_ITALIC,
        fontSize=9.5,
        leading=13,
        alignment=TA_CENTER,
        textColor=dark_gold,
        spaceAfter=2,
    )
    recipient = ParagraphStyle(
        "Recipient",
        parent=styles["Heading1"],
        fontName=DISPLAY_BOLD,
        fontSize=22,
        leading=26,
        alignment=TA_CENTER,
        textColor=ink,
        spaceAfter=2,
    )
    section = ParagraphStyle(
        "Section",
        parent=body,
        fontName=SANS_BOLD,
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#5A5A5A"),
        spaceBefore=2,
        spaceAfter=4,
        textTransform="uppercase",
    )
    term = ParagraphStyle(
        "Term",
        parent=small,
        leftIndent=12,
        firstLineIndent=-12,
        leading=11,
        spaceAfter=2.5,
    )
    label_style = ParagraphStyle(
        "LabelStyle",
        parent=small,
        fontName=SANS_BOLD,
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#666666"),
    )
    value_style = ParagraphStyle(
        "ValueStyle",
        parent=small,
        fontName=SERIF,
        fontSize=8.5,
        leading=10,
        textColor=ink,
    )

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        rightMargin=28 * mm,
        leftMargin=28 * mm,
        topMargin=36 * mm,
        bottomMargin=24 * mm,
        title="AAW Authorized Distributor Certificate - Sound Proof Brothers",
        author="NASTECH",
        subject="Authorized distributorship certificate for AAW CIEM and UIEM products in Thailand",
    )

    story = []

    # ── Logo ────────────────────────────────────────────────────────
    story.append(fit_image(LOGO_TRANSPARENT, 80 * mm, 20 * mm))
    story[-1].hAlign = "CENTER"
    story.append(Spacer(1, 6))

    # ── Title block ─────────────────────────────────────────────────
    story.append(p("CERTIFICATE OF AUTHORIZED DISTRIBUTORSHIP", title))
    story.append(Spacer(1, 2))
    story.append(p("Written authorization for AAW CIEM and UIEM products in Thailand", subtitle))
    story.append(Spacer(1, 6))
    story.append(p("Sound Proof Brothers", recipient))
    story.append(Spacer(1, 4))

    # ── Body ────────────────────────────────────────────────────────
    story.append(
        p(
            "NASTECH (UEN: 53208987A), the company under which the AAW / Advanced "
            "AcousticWerkes brand is operated, hereby certifies and appoints "
            "<b>Sound Proof Brothers</b> as an authorized distributor of AAW CIEM "
            "and UIEM products within the territory and validity period stated below.",
            body,
        )
    )

    # ── Fact table (clean, minimal) ─────────────────────────────────
    def fact_row(label, value):
        return [Paragraph(label, label_style), Paragraph(value, value_style)]

    fact_data = [
        fact_row("ISSUER", "NASTECH (UEN: 53208987A)"),
        fact_row("BRAND", "AAW / Advanced AcousticWerkes"),
        fact_row("PRODUCT SCOPE", "AAW CIEM and UIEM products"),
        fact_row("TERRITORY", "Thailand"),
        fact_row("AUTHORIZATION", "Authorized distributor"),
        fact_row("VALIDITY PERIOD", "1 June 2026 to 31 May 2028 (inclusive)"),
        fact_row("CERTIFICATE ID", "AAW-SPB-TH-2026"),
    ]
    fact_table = Table(
        fact_data,
        colWidths=[36 * mm, 116 * mm],
    )
    fact_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), table_bg),
                ("BACKGROUND", (0, 0), (0, -1), label_bg),
                ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#C7A56D")),
                ("LINEBELOW", (0, 0), (-1, -2), 0.3, colors.HexColor("#E5DAC8")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.append(Spacer(1, 6))
    story.append(fact_table)
    story.append(Spacer(1, 8))

    # ── Certificate Notes ───────────────────────────────────────────
    story.append(p("Certificate Notes", section))
    terms = [
        "1.  This certificate confirms the above distributor authorization for the stated territory, product scope, and validity period.",
        "2.  This certificate is not transferable and is valid only when presented as issued by NASTECH.",
        "3.  This certificate does not replace any separate commercial, warranty, pricing, or service terms agreed between the parties.",
    ]
    for item in terms:
        story.append(p(item, term))

    story.append(Spacer(1, 10))

    # ── Signature block ─────────────────────────────────────────────
    story.append(p("Authorized Signature", section))

    sig = fit_image(SIGNATURE_TRANSPARENT, 42 * mm, 15 * mm)
    sig.hAlign = "LEFT"

    left_block_data = [
        [sig],
        [Paragraph("For and on behalf of <b>NASTECH</b>", small)],
        [Paragraph("<b>Kevin Wang</b>", small)],
        [Paragraph("Authorized Signatory", small)],
        [Paragraph("Date: 1 June 2026", small)],
    ]
    left_block = Table(left_block_data, colWidths=[76 * mm])
    left_block.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )

    right_block_data = [
        [Paragraph("<b>Certificate Verification</b>", small)],
        [Paragraph("Certificate ID: AAW-SPB-TH-2026", small)],
        [Paragraph("Issued by: NASTECH (UEN: 53208987A)", small)],
        [Paragraph("Valid through: 31 May 2028", small)],
    ]
    right_block = Table(right_block_data, colWidths=[76 * mm])
    right_block.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )

    sig_table = Table(
        [[left_block, right_block]],
        colWidths=[82 * mm, 82 * mm],
    )
    sig_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), table_bg),
                ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#C7A56D")),
                ("LINEBETWEENCOLUMNS", (0, 0), (-1, -1), 0.3, colors.HexColor("#E5DAC8")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(sig_table)

    doc.build(story, onFirstPage=draw_frame, onLaterPages=draw_frame)


if __name__ == "__main__":
    build_pdf()
    print(OUT)
