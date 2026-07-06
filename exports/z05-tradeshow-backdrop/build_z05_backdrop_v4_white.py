from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdf_canvas

import build_z05_backdrop as base


OUT = Path(__file__).resolve().parent / "V4-white"
OUT.mkdir(parents=True, exist_ok=True)
LIGHT_HERO = OUT / "z05-z06-light-studio-hero.png"

INK = (28, 36, 40)
MUTED = (92, 105, 108)
ICE = (75, 188, 212)
SILVER = (206, 213, 212)
GOLD = (191, 145, 70)


def make_white_bg() -> Image.Image:
    img = Image.new("RGB", (base.SMALL_W, base.SMALL_H))
    px = img.load()
    for y in range(base.SMALL_H):
        t = y / (base.SMALL_H - 1)
        for x in range(base.SMALL_W):
            u = x / (base.SMALL_W - 1)
            ice = max(0, 1 - math.hypot((u - 0.24) / 0.72, (t - 0.48) / 0.58))
            warm = max(0, 1 - math.hypot((u - 0.86) / 0.55, (t - 0.22) / 0.42))
            floor = max(0, 1 - abs(t - 0.66) / 0.20)
            vignette = math.hypot((u - 0.5) / 0.98, (t - 0.50) / 1.12)
            r = 242 - int(ice * 18) + int(warm * 10) - int(floor * 8)
            g = 246 - int(ice * 5) + int(warm * 4) - int(floor * 8)
            b = 247 + int(ice * 8) - int(warm * 8) - int(floor * 5)
            dim = 1 - max(0, vignette - 0.70) * 0.08
            px[x, y] = tuple(max(0, min(255, int(c * dim))) for c in (r, g, b))

    img = img.resize((base.W, base.H), Image.Resampling.BICUBIC)
    overlay = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rectangle((0, 0, base.W, base.H), outline=(255, 255, 255, 0))
    d.polygon([(0, 1960), (base.W, 1440), (base.W, 1880), (0, 2460)], fill=(180, 224, 232, 54))
    d.polygon([(0, 5010), (base.W, 4620), (base.W, 5100), (0, 5510)], fill=(210, 217, 218, 68))
    d.line((350, 1260, base.W - 350, 860), fill=(180, 202, 204, 62), width=6)
    d.line((390, 5840, base.W - 390, 5840), fill=(160, 186, 190, 104), width=4)
    overlay = overlay.filter(ImageFilter.GaussianBlur(16))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def add_product_cut(canvas: Image.Image):
    crop = Image.open(LIGHT_HERO).convert("RGB")
    crop = ImageEnhance.Color(crop).enhance(1.08)
    crop = ImageEnhance.Contrast(crop).enhance(1.04)
    crop = ImageEnhance.Brightness(crop).enhance(1.04)
    crop = ImageEnhance.Sharpness(crop).enhance(1.08)

    target_w = 4620
    target_h = int(crop.height * target_w / crop.width)
    crop = crop.resize((target_w, target_h), Image.Resampling.LANCZOS)
    x = (base.W - target_w) // 2
    y = 2550

    shadow = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((620, 3710, base.W - 560, 5300), fill=(24, 32, 36, 26))
    sd.ellipse((1080, 3880, base.W - 900, 5180), fill=(65, 185, 210, 22))
    shadow = shadow.filter(ImageFilter.GaussianBlur(170))
    canvas.alpha_composite(shadow)

    photo = crop.convert("RGBA")
    mask = Image.new("L", photo.size, 255)
    px = mask.load()
    for yy in range(photo.height):
        top = min(1, yy / 360)
        bottom = min(1, (photo.height - yy) / 320)
        for xx in range(photo.width):
            edge_x = min(1, xx / 380, (photo.width - xx) / 380)
            px[xx, yy] = int(255 * min(top, bottom, edge_x))
    mask = mask.filter(ImageFilter.GaussianBlur(10))
    photo.putalpha(mask)
    canvas.alpha_composite(photo, (x, y))

    shine = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    sh = ImageDraw.Draw(shine)
    sh.line((620, 3050, base.W - 540, 2440), fill=(255, 255, 255, 68), width=10)
    sh.line((900, 3210, base.W - 430, 2840), fill=(95, 195, 214, 34), width=5)
    shine = shine.filter(ImageFilter.GaussianBlur(7))
    canvas.alpha_composite(shine)


def add_old_generation_tile(canvas: Image.Image):
    portrait = Image.open(base.PORTRAIT_ASSET).convert("RGB")
    portrait = base.fit_cover(portrait, (1160, 1460)).convert("RGBA")
    portrait = ImageEnhance.Color(portrait).enhance(0.35)
    portrait = ImageEnhance.Brightness(portrait).enhance(1.12)
    portrait = ImageEnhance.Contrast(portrait).enhance(0.95)
    mask = Image.new("L", portrait.size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, portrait.width, portrait.height), radius=42, fill=72)
    mask = mask.filter(ImageFilter.GaussianBlur(18))
    portrait.putalpha(mask)
    canvas.alpha_composite(portrait, (3860, 1020))


def text_size(draw, text, font):
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0], box[3] - box[1]


def chip(draw, x, y, label, color):
    f = base.font(base.FONT_BOLD, 46)
    tw, _ = text_size(draw, label, f)
    draw.rounded_rectangle((x, y, x + tw + 74, y + 86), radius=43, fill=(255, 255, 255, 184), outline=color + (210,), width=3)
    draw.text((x + 37, y + 20), label, font=f, fill=color + (245,))
    return x + tw + 106


def draw_layout_white(canvas: Image.Image):
    draw = ImageDraw.Draw(canvas)
    safe = 300

    lockup = base.render_top_lockup(INK)
    base.paste_with_mask(canvas, lockup, (safe, 310), opacity=242)

    draw.text((safe, 1000), "ICE CRYSTAL TITANIUM", font=base.font(base.FONT_BOLD, 76), fill=ICE + (240,))
    draw.text((safe, 1115), "Faceplate Edition", font=base.font(base.FONT_LIGHT, 155), fill=INK + (246,))
    draw.text((safe, 1335), "A brighter Z Series booth wall with a clean gallery tone.", font=base.font(base.FONT_REG, 60), fill=MUTED + (230,))

    x = safe
    x = chip(draw, x, 1515, "TwinCore Switch", ICE)
    x = chip(draw, x, 1515, "10mm Dynamic + 4 BA", GOLD)
    chip(draw, x, 1515, "3.5 / 4.4 / Type-C", MUTED)

    draw.text((3710, 810), "FROM AuAg", font=base.font(base.FONT_BOLD, 54), fill=(134, 146, 148, 188))
    draw.text((3710, 890), "to Ice Crystal", font=base.font(base.FONT_REG, 54), fill=(134, 146, 148, 188))

    draw.text((safe, 2240), "Z05", font=base.font(base.FONT_BOLD, 250), fill=(20, 29, 34, 238))
    draw.text((safe, 2520), "Those who listen\nwill find the way.", font=base.font(base.FONT_REG, 78), fill=(72, 86, 90, 220), spacing=18)

    card_x, card_y = 3330, 4550
    draw.rounded_rectangle((card_x, card_y, card_x + 1550, card_y + 285), radius=18, fill=(255, 255, 255, 204), outline=(96, 116, 120, 118), width=2)
    draw.text((card_x + 64, card_y + 42), "ALSO FEATURING", font=base.font(base.FONT_BOLD, 40), fill=GOLD + (240,))
    draw.text((card_x + 64, card_y + 108), "Z06 Snow Titanium Edition", font=base.font(base.FONT_BOLD, 66), fill=INK + (246,))
    draw.text((card_x + 64, card_y + 205), "TwinCore switch function", font=base.font(base.FONT_REG, 48), fill=MUTED + (228,))

    footer_y = base.LOWER_BLANK_Y - 350
    draw.text((safe, footer_y), "ADVANCED ACOUSTICWERKES", font=base.font(base.FONT_BOLD, 78), fill=INK + (232,))
    draw.text((safe, footer_y + 128), "AAW.ME  |  Z05 Ice Crystal Titanium  |  Z06 Snow Titanium", font=base.font(base.FONT_REG, 62), fill=(76, 92, 96, 225))
    draw.text((safe, footer_y + 232), "aaw.me", font=base.font(base.FONT_REG, 48), fill=(118, 132, 134, 212))

    draw.rectangle((0, base.LOWER_BLANK_Y, base.W, base.H), fill=(238, 242, 242, 246))
    lower = Image.new("RGBA", (base.W, base.H - base.LOWER_BLANK_Y), (0, 0, 0, 0))
    lp = lower.load()
    for y in range(lower.height):
        t = y / max(1, lower.height - 1)
        for x in range(base.W):
            lp[x, y] = (230, 237, 238, int(28 + 36 * t))
    canvas.alpha_composite(lower, (0, base.LOWER_BLANK_Y))
    draw.line((safe, base.LOWER_BLANK_Y + 120, base.W - safe, base.LOWER_BLANK_Y + 120), fill=(120, 152, 158, 140), width=3)


def save_pdf(png_path: Path, pdf_path: Path):
    c = pdf_canvas.Canvas(str(pdf_path), pagesize=(base.PHYSICAL_W_MM * mm, base.PHYSICAL_H_MM * mm))
    c.drawImage(str(png_path), 0, 0, width=base.PHYSICAL_W_MM * mm, height=base.PHYSICAL_H_MM * mm)
    c.showPage()
    c.save()


def main():
    canvas = make_white_bg().convert("RGBA")
    add_old_generation_tile(canvas)
    add_product_cut(canvas)
    base.add_noise(canvas)
    draw_layout_white(canvas)

    rgb = canvas.convert("RGB")
    out_base = OUT / "z05-tradeshow-backdrop-V4-white-1800x2400mm.png"
    out_2x = OUT / "z05-tradeshow-backdrop-V4-white-1800x2400mm-2x.png"
    out_pdf = OUT / "z05-tradeshow-backdrop-V4-white-1800x2400mm.pdf"
    preview = OUT / "z05-tradeshow-backdrop-V4-white-preview.jpg"

    rgb.save(out_base, dpi=(76.2, 76.2), quality=95)
    rgb.resize((2700, 3600), Image.Resampling.LANCZOS).save(preview, quality=95)
    up = rgb.resize((base.W * 2, base.H * 2), Image.Resampling.LANCZOS)
    up = up.filter(ImageFilter.UnsharpMask(radius=1.1, percent=70, threshold=3))
    up.save(out_2x, dpi=(152.4, 152.4), compress_level=6)
    save_pdf(out_2x, out_pdf)

    print(out_pdf)
    print(out_2x)
    print(preview)


if __name__ == "__main__":
    main()
