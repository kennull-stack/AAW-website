from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdf_canvas


ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent

MAIN_PHOTO = Path(r"C:\Users\wkwlb\Downloads\ChatGPT Image Jul 6, 2026, 05_39_55 PM.png")
ASSET_DIR = ROOT / "aaw-theme" / "assets"
AAW_LOGO = ASSET_DIR / "z02-aaw-logo.png"
Z05_MARK = ASSET_DIR / "z05-logo-mark.png"
PORTRAIT_ASSET = ASSET_DIR / "z05-auag-luxury-portrait-hero.png"
DETAIL_ASSET = ASSET_DIR / "z05-auag-twincore-switch-closeup.jpg"

W, H = 5400, 7200
SMALL_W, SMALL_H = 540, 720
PHYSICAL_W_MM, PHYSICAL_H_MM = 1800, 2400
LOWER_BLANK_Y = int(H * 0.75)

WHITE = (238, 240, 236)
SOFT = (182, 190, 188)
GOLD = (201, 151, 70)
BLUE = (33, 178, 203)
RED = (190, 68, 52)
BLACK = (3, 5, 7)


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(fr"C:\Windows\Fonts\{name}", size)


FONT_LIGHT = r"segoeuil.ttf"
FONT_REG = r"segoeui.ttf"
FONT_BOLD = r"segoeuib.ttf"


def make_bg() -> Image.Image:
    img = Image.new("RGB", (SMALL_W, SMALL_H))
    px = img.load()
    for y in range(SMALL_H):
        t = y / (SMALL_H - 1)
        for x in range(SMALL_W):
            u = x / (SMALL_W - 1)
            base = [
                int(5 + 2 * (1 - t)),
                int(7 + 7 * (1 - abs(t - 0.45))),
                int(9 + 10 * (1 - abs(t - 0.35))),
            ]
            gold_glow = max(0, 1 - math.hypot((u - 0.78) / 0.9, (t - 0.25) / 0.5))
            blue_glow = max(0, 1 - math.hypot((u - 0.15) / 0.7, (t - 0.55) / 0.6))
            edge_vignette = math.hypot((u - 0.5) / 0.78, (t - 0.52) / 0.86)
            base[0] += int(gold_glow * 45 + blue_glow * 2)
            base[1] += int(gold_glow * 29 + blue_glow * 24)
            base[2] += int(gold_glow * 6 + blue_glow * 34)
            dim = max(0.45, 1 - edge_vignette * 0.33)
            px[x, y] = tuple(max(0, min(255, int(c * dim))) for c in base)
    img = img.resize((W, H), Image.Resampling.BICUBIC)
    return ImageEnhance.Contrast(img).enhance(1.08)


def alpha_gradient(size, top=0, bottom=255, curve=1.0):
    w, h = size
    mask = Image.new("L", size)
    p = mask.load()
    for y in range(h):
        t = (y / max(1, h - 1)) ** curve
        v = int(top + (bottom - top) * t)
        for x in range(w):
            p[x, y] = v
    return mask


def fit_cover(im: Image.Image, size):
    w, h = size
    scale = max(w / im.width, h / im.height)
    nw, nh = int(im.width * scale + 0.5), int(im.height * scale + 0.5)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - w) // 2
    top = (nh - h) // 2
    return im.crop((left, top, left + w, top + h))


def tint_logo(path: Path, color, target_w: int) -> Image.Image:
    src = Image.open(path).convert("RGBA")
    scale = target_w / src.width
    target_h = int(src.height * scale)
    smoothing_scale = 4
    src = src.resize((target_w * smoothing_scale, target_h * smoothing_scale), Image.Resampling.LANCZOS)
    alpha = src.getchannel("A")
    # Preserve antialiasing but make dark transparent artwork readable on the dark backdrop.
    if alpha.getextrema()[1] < 10:
        gray = ImageOps.invert(src.convert("L"))
        alpha = gray.point(lambda v: 255 if v > 12 else 0)
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.05 * smoothing_scale))
    alpha = ImageEnhance.Contrast(alpha).enhance(2.15)
    alpha = alpha.resize((target_w, target_h), Image.Resampling.LANCZOS)
    out = Image.new("RGBA", (target_w, target_h), color + (0,))
    out.putalpha(alpha)
    return out


def render_top_lockup(color=(236, 230, 215)) -> Image.Image:
    lockup = Image.new("RGBA", (1350, 245), (0, 0, 0, 0))

    aaw = tint_logo(AAW_LOGO, color, 670)
    lockup.alpha_composite(aaw, (0, 28))

    z05 = tint_logo(Z05_MARK, color, 500)
    lockup.alpha_composite(z05, (745, 28))
    return lockup


def paste_with_mask(base, layer, xy, opacity=255, blur=0):
    if blur:
        layer = layer.filter(ImageFilter.GaussianBlur(blur))
    if opacity < 255:
        a = layer.getchannel("A").point(lambda v: int(v * opacity / 255))
        layer = layer.copy()
        layer.putalpha(a)
    base.alpha_composite(layer, xy)


def draw_text(draw, xy, text, fnt, fill, spacing=0):
    draw.text(xy, text, font=fnt, fill=fill, spacing=spacing)


def text_size(draw, text, fnt):
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def draw_rule(draw, x, y, w, color, alpha=180):
    draw.rounded_rectangle((x, y, x + w, y + 8), radius=4, fill=color + (alpha,))


def draw_feature(draw, x, y, num, title, body, accent):
    draw.text((x, y), num, font=font(FONT_BOLD, 62), fill=accent + (235,))
    draw.text((x, y + 92), title, font=font(FONT_BOLD, 66), fill=WHITE + (245,))
    draw.text((x, y + 184), body, font=font(FONT_REG, 42), fill=SOFT + (225,))


def add_main_photo(canvas: Image.Image):
    hero = Image.open(MAIN_PHOTO).convert("RGB")
    hero = ImageEnhance.Color(hero).enhance(1.16)
    hero = ImageEnhance.Contrast(hero).enhance(1.13)
    hero = ImageEnhance.Sharpness(hero).enhance(1.12)

    scaled_w = int(W * 1.16)
    scaled_h = int(hero.height * scaled_w / hero.width)
    hero = hero.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    x = int((W - scaled_w) / 2)
    y = 1680

    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    photo = hero.convert("RGBA")
    mask = Image.new("L", photo.size, 255)
    mask_px = mask.load()
    for yy in range(photo.height):
        top_fade = min(1, yy / 760)
        bottom_fade = min(1, (photo.height - yy) / 560)
        edge = min(top_fade, bottom_fade)
        v = int(255 * max(0, min(1, edge)))
        for xx in range(photo.width):
            mask_px[xx, yy] = v
    photo.putalpha(mask)
    layer.alpha_composite(photo, (x, y))

    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vignette)
    vd.rectangle((0, 0, W, y + 690), fill=(0, 0, 0, 0))
    vd.rectangle((0, y + 680, W, LOWER_BLANK_Y), fill=(0, 0, 0, 24))
    vignette = vignette.filter(ImageFilter.GaussianBlur(90))
    canvas.alpha_composite(layer)
    canvas.alpha_composite(vignette)


def add_supporting_assets(canvas: Image.Image):
    portrait = Image.open(PORTRAIT_ASSET).convert("RGB")
    portrait = fit_cover(portrait, (2180, 2850)).convert("RGBA")
    portrait = ImageEnhance.Contrast(portrait).enhance(1.05)
    gray = ImageOps.grayscale(portrait).convert("RGBA")
    warm = Image.new("RGBA", gray.size, (188, 141, 66, 0))
    warm.putalpha(gray.getchannel("A"))
    portrait = Image.blend(gray, portrait, 0.24)
    mask = Image.new("L", portrait.size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((-160, -80, portrait.width + 220, portrait.height + 220), radius=28, fill=82)
    side_fade = alpha_gradient(portrait.size, top=70, bottom=0, curve=1.8)
    mask = ImageChops_multiply(mask, side_fade)
    portrait.putalpha(mask)
    canvas.alpha_composite(portrait, (3270, 520))

    detail = Image.open(DETAIL_ASSET).convert("RGB")
    detail = fit_cover(detail, (1680, 1050)).filter(ImageFilter.GaussianBlur(1.4)).convert("RGBA")
    detail_alpha = Image.new("L", detail.size, 40)
    detail_alpha = detail_alpha.filter(ImageFilter.GaussianBlur(34))
    detail.putalpha(detail_alpha)
    canvas.alpha_composite(detail, (-220, 1520))


def add_iteration_ghost(canvas: Image.Image):
    portrait = Image.open(PORTRAIT_ASSET).convert("RGB")
    portrait = fit_cover(portrait, (1860, 2440)).convert("RGBA")
    portrait = ImageEnhance.Contrast(portrait).enhance(1.04)
    portrait = ImageEnhance.Color(portrait).enhance(0.55)

    mask = Image.new("L", portrait.size, 0)
    px = mask.load()
    for y in range(portrait.height):
        v = y / max(1, portrait.height - 1)
        vertical = min(1, y / 420, (portrait.height - y) / 620)
        product_lift = 0.55 + 0.45 * max(0, min(1, (v - 0.48) / 0.34))
        for x in range(portrait.width):
            u = x / max(1, portrait.width - 1)
            side = min(1, x / 360, (portrait.width - x) / 260)
            left_fade = 0.55 + 0.45 * u
            px[x, y] = int(118 * vertical * side * left_fade * product_lift)
    mask = mask.filter(ImageFilter.GaussianBlur(18))
    portrait.putalpha(mask)
    canvas.alpha_composite(portrait, (3300, 560))


def ImageChops_multiply(a, b):
    return Image.blend(Image.new("L", a.size, 0), Image.composite(a, b, b), 1.0)


def add_noise(canvas: Image.Image):
    noise = Image.effect_noise((W, H), 8).convert("L")
    noise = noise.point(lambda v: max(0, min(255, int((v - 128) * 0.28 + 128))))
    overlay = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    overlay.putalpha(noise.point(lambda v: int(max(0, v - 128) * 0.18)))
    canvas.alpha_composite(overlay)


def draw_layout(canvas: Image.Image):
    draw = ImageDraw.Draw(canvas)

    # Safe-area guide is intentionally not drawn on the artwork. Keep core text inside 260px.
    safe = 300

    lockup = render_top_lockup((236, 230, 215))
    paste_with_mask(canvas, lockup, (safe, 360), opacity=235)

    draw.text((safe, 770), "AAW Z SERIES UNIVERSAL", font=font(FONT_REG, 76), fill=SOFT + (230,))
    draw.text((safe, 910), "Ice Crystal Titanium Faceplate", font=font(FONT_LIGHT, 128), fill=WHITE + (246,))
    draw_rule(draw, safe, 1134, 1220, GOLD, 205)
    draw.text((safe, 1214), "Those who listen will find the way.", font=font(FONT_REG, 78), fill=(220, 210, 188, 238))

    headline = "TWO LISTENING MOODS.\nONE COMPACT HYBRID."
    draw.multiline_text((safe, 1530), headline, font=font(FONT_BOLD, 142), fill=WHITE + (245,), spacing=24)

    body = "TwinCore shifts Z05 from weight and flow\nto focus and spark without changing gear."
    draw.multiline_text((safe, 1910), body, font=font(FONT_REG, 68), fill=SOFT + (230,), spacing=20)

    chip_y = 2140
    chips = [("10mm Dynamic + 4 BA", GOLD), ("TwinCore Switch", BLUE), ("3.5 / 4.4 / Type-C", WHITE)]
    x = safe
    for label, color in chips:
        tw, th = text_size(draw, label, font(FONT_BOLD, 48))
        draw.rounded_rectangle((x, chip_y, x + tw + 80, chip_y + 92), radius=46, outline=color + (180,), width=3)
        draw.text((x + 40, chip_y + 21), label, font=font(FONT_BOLD, 48), fill=color + (235,))
        x += tw + 116

    callout_x, callout_y = 3330, 4460
    callout_w, callout_h = 1580, 300
    draw.rounded_rectangle(
        (callout_x, callout_y, callout_x + callout_w, callout_y + callout_h),
        radius=18,
        fill=(3, 7, 9, 118),
        outline=(218, 226, 223, 92),
        width=2,
    )
    draw.text((callout_x + 70, callout_y + 48), "ALSO FEATURING", font=font(FONT_BOLD, 42), fill=(201, 151, 70, 225))
    draw.text((callout_x + 70, callout_y + 116), "Z06 Snow Titanium Edition", font=font(FONT_BOLD, 68), fill=WHITE + (242,))
    draw.text((callout_x + 70, callout_y + 216), "TwinCore switch function", font=font(FONT_REG, 50), fill=(188, 198, 194, 224))

    footer_y = LOWER_BLANK_Y - 360
    draw.text((safe, footer_y), "ADVANCED ACOUSTICWERKES", font=font(FONT_BOLD, 78), fill=(226, 231, 228, 232))
    draw.text((safe, footer_y + 130), "AAW.ME  |  Z05 Ice Crystal Titanium  |  Z06 Snow Titanium", font=font(FONT_REG, 62), fill=(188, 198, 194, 224))
    draw.text((safe, footer_y + 235), "aaw.me", font=font(FONT_REG, 48), fill=(145, 158, 155, 210))

    # The lower quarter sits behind the table at the booth, so keep it calm and non-critical.
    draw.rectangle((0, LOWER_BLANK_Y, W, H), fill=(2, 5, 7, 238))
    footer_grad = Image.new("RGBA", (W, H - LOWER_BLANK_Y), (0, 0, 0, 0))
    fp = footer_grad.load()
    for yy in range(footer_grad.height):
        t = yy / max(1, footer_grad.height - 1)
        for xx in range(W):
            fp[xx, yy] = (4, 8, 10, int(26 + 32 * t))
    canvas.alpha_composite(footer_grad, (0, LOWER_BLANK_Y))
    draw.line((safe, LOWER_BLANK_Y + 120, W - safe, LOWER_BLANK_Y + 120), fill=(201, 151, 70, 120), width=3)


def save_pdf(png_path: Path, pdf_path: Path):
    page_w = PHYSICAL_W_MM * mm
    page_h = PHYSICAL_H_MM * mm
    c = pdf_canvas.Canvas(str(pdf_path), pagesize=(page_w, page_h))
    c.drawImage(str(png_path), 0, 0, width=page_w, height=page_h)
    c.showPage()
    c.save()


def main():
    canvas = make_bg().convert("RGBA")
    add_supporting_assets(canvas)
    add_main_photo(canvas)
    add_iteration_ghost(canvas)
    add_noise(canvas)
    draw_layout(canvas)

    out_png = OUT / "z05-tradeshow-backdrop-1800x2400mm-draft.png"
    out_pdf = OUT / "z05-tradeshow-backdrop-1800x2400mm-draft.pdf"
    preview = OUT / "z05-tradeshow-backdrop-preview.jpg"

    rgb = canvas.convert("RGB")
    rgb.save(out_png, dpi=(76.2, 76.2), quality=95)
    rgb.resize((2700, 3600), Image.Resampling.LANCZOS).save(preview, quality=95)
    save_pdf(out_png, out_pdf)
    print(out_png)
    print(out_pdf)
    print(preview)


if __name__ == "__main__":
    main()
