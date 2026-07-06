from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdf_canvas

import build_z05_backdrop as base


OUT = Path(__file__).resolve().parent / "V3-ice"
OUT.mkdir(parents=True, exist_ok=True)

ICE = (196, 232, 240)
SILVER = (226, 229, 224)
PLATINUM = (182, 190, 190)
INK = (5, 9, 12)


def make_bg_ice() -> Image.Image:
    img = Image.new("RGB", (base.SMALL_W, base.SMALL_H))
    px = img.load()
    for y in range(base.SMALL_H):
        t = y / (base.SMALL_H - 1)
        for x in range(base.SMALL_W):
            u = x / (base.SMALL_W - 1)
            top_frost = max(0, 1 - math.hypot((u - 0.58) / 0.92, (t - 0.22) / 0.46))
            center_ice = max(0, 1 - math.hypot((u - 0.48) / 0.68, (t - 0.53) / 0.38))
            right_warm = max(0, 1 - math.hypot((u - 0.86) / 0.48, (t - 0.28) / 0.40))
            left_shadow = max(0, 1 - math.hypot((u - 0.05) / 0.55, (t - 0.45) / 0.70))
            vignette = math.hypot((u - 0.52) / 0.86, (t - 0.52) / 0.95)

            r = 8 + int(top_frost * 34 + center_ice * 24 + right_warm * 42 - left_shadow * 4)
            g = 13 + int(top_frost * 46 + center_ice * 48 + right_warm * 34 + left_shadow * 8)
            b = 18 + int(top_frost * 56 + center_ice * 62 + right_warm * 10 + left_shadow * 16)
            dim = max(0.64, 1 - vignette * 0.22)
            px[x, y] = (max(0, min(255, int(r * dim))), max(0, min(255, int(g * dim))), max(0, min(255, int(b * dim))))

    img = img.resize((base.W, base.H), Image.Resampling.BICUBIC)
    overlay = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.polygon([(0, 2500), (base.W, 1880), (base.W, 2310), (0, 3040)], fill=(228, 241, 242, 40))
    d.polygon([(0, 3100), (base.W, 2600), (base.W, 3120), (0, 3740)], fill=(80, 180, 205, 28))
    d.line((260, 1180, base.W - 300, 920), fill=(215, 231, 231, 34), width=7)
    d.line((420, 5790, base.W - 420, 5790), fill=(198, 232, 240, 78), width=5)
    overlay = overlay.filter(ImageFilter.GaussianBlur(18))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def draw_soft_word(canvas: Image.Image):
    layer = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = base.font(base.FONT_BOLD, 310)
    d.text((220, 2660), "ICE", font=f, fill=(205, 232, 236, 24))
    d.text((220, 2990), "CRYSTAL", font=f, fill=(205, 232, 236, 18))
    layer = layer.filter(ImageFilter.GaussianBlur(0.4))
    canvas.alpha_composite(layer)


def add_product_stage(canvas: Image.Image):
    hero = Image.open(base.MAIN_PHOTO).convert("RGB")
    hero = ImageEnhance.Color(hero).enhance(1.28)
    hero = ImageEnhance.Contrast(hero).enhance(1.08)
    hero = ImageEnhance.Brightness(hero).enhance(1.13)
    hero = ImageEnhance.Sharpness(hero).enhance(1.12)

    scaled_w = int(base.W * 1.04)
    scaled_h = int(hero.height * scaled_w / hero.width)
    hero = hero.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    x = int((base.W - scaled_w) / 2)
    y = 2140

    glow = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((710, 2850, base.W - 590, 5230), fill=(118, 218, 232, 48))
    gd.ellipse((2070, 2820, base.W - 380, 4920), fill=(238, 226, 198, 36))
    gd.rectangle((0, 4380, base.W, 5550), fill=(0, 0, 0, 34))
    glow = glow.filter(ImageFilter.GaussianBlur(180))
    canvas.alpha_composite(glow)

    layer = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    photo = hero.convert("RGBA")
    mask = Image.new("L", photo.size, 255)
    px = mask.load()
    for yy in range(photo.height):
        top = min(1, yy / 620)
        bottom = min(1, (photo.height - yy) / 540)
        v = int(255 * min(top, bottom))
        for xx in range(photo.width):
            px[xx, yy] = v
    photo.putalpha(mask)
    layer.alpha_composite(photo, (x, y))
    canvas.alpha_composite(layer)


def add_heritage_ghost(canvas: Image.Image):
    portrait = Image.open(base.PORTRAIT_ASSET).convert("RGB")
    portrait = base.fit_cover(portrait, (1600, 2150)).convert("RGBA")
    portrait = ImageEnhance.Color(portrait).enhance(0.50)
    portrait = ImageEnhance.Contrast(portrait).enhance(1.08)
    mask = Image.new("L", portrait.size, 0)
    px = mask.load()
    for y in range(portrait.height):
        vertical = min(1, y / 360, (portrait.height - y) / 520)
        for x in range(portrait.width):
            side = min(1, x / 280, (portrait.width - x) / 300)
            px[x, y] = int(90 * vertical * side)
    mask = mask.filter(ImageFilter.GaussianBlur(18))
    portrait.putalpha(mask)
    canvas.alpha_composite(portrait, (3520, 760))


def text_size(draw, text, font):
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0], box[3] - box[1]


def draw_chip(draw, x, y, label, color):
    f = base.font(base.FONT_BOLD, 46)
    tw, _ = text_size(draw, label, f)
    draw.rounded_rectangle((x, y, x + tw + 74, y + 84), radius=42, fill=(7, 14, 18, 132), outline=color + (180,), width=3)
    draw.text((x + 37, y + 19), label, font=f, fill=color + (235,))
    return x + tw + 106


def draw_layout_v3(canvas: Image.Image):
    draw = ImageDraw.Draw(canvas)
    safe = 300

    lockup = base.render_top_lockup(SILVER)
    base.paste_with_mask(canvas, lockup, (safe, 330), opacity=244)

    right_x = 3120
    draw.text((right_x, 680), "AAW Z SERIES UNIVERSAL", font=base.font(base.FONT_REG, 68), fill=PLATINUM + (226,))
    draw.text((right_x, 800), "Ice Crystal", font=base.font(base.FONT_LIGHT, 170), fill=SILVER + (248,))
    draw.text((right_x, 1010), "Titanium Faceplate", font=base.font(base.FONT_LIGHT, 112), fill=(205, 224, 224, 238))
    draw.rounded_rectangle((right_x, 1196, right_x + 1120, 1204), radius=4, fill=ICE + (190,))
    draw.text((right_x, 1275), "Two listening moods in one compact hybrid.", font=base.font(base.FONT_REG, 58), fill=(216, 222, 220, 228))

    chip_y = 1470
    x = right_x
    x = draw_chip(draw, x, chip_y, "TwinCore Switch", base.BLUE)
    x = draw_chip(draw, x, chip_y, "10mm Dynamic + 4 BA", base.GOLD)

    draw.text((safe, 1570), "Z05", font=base.font(base.FONT_BOLD, 180), fill=(235, 238, 232, 242))
    draw.text((safe, 1780), "Those who listen\nwill find the way.", font=base.font(base.FONT_REG, 72), fill=(196, 206, 204, 224), spacing=16)

    card_x, card_y = 3260, 4570
    draw.rounded_rectangle((card_x, card_y, card_x + 1550, card_y + 285), radius=16, fill=(3, 7, 9, 128), outline=(218, 226, 223, 92), width=2)
    draw.text((card_x + 64, card_y + 42), "ALSO FEATURING", font=base.font(base.FONT_BOLD, 40), fill=base.GOLD + (225,))
    draw.text((card_x + 64, card_y + 108), "Z06 Snow Titanium Edition", font=base.font(base.FONT_BOLD, 66), fill=base.WHITE + (242,))
    draw.text((card_x + 64, card_y + 205), "TwinCore switch function", font=base.font(base.FONT_REG, 48), fill=(188, 198, 194, 224))

    footer_y = base.LOWER_BLANK_Y - 365
    draw.text((safe, footer_y), "ADVANCED ACOUSTICWERKES", font=base.font(base.FONT_BOLD, 78), fill=(232, 236, 232, 232))
    draw.text((safe, footer_y + 130), "AAW.ME  |  Z05 Ice Crystal Titanium  |  Z06 Snow Titanium", font=base.font(base.FONT_REG, 62), fill=(196, 208, 206, 225))
    draw.text((safe, footer_y + 235), "aaw.me", font=base.font(base.FONT_REG, 48), fill=(150, 166, 164, 212))

    draw.rectangle((0, base.LOWER_BLANK_Y, base.W, base.H), fill=(2, 7, 10, 242))
    lower = Image.new("RGBA", (base.W, base.H - base.LOWER_BLANK_Y), (0, 0, 0, 0))
    lp = lower.load()
    for y in range(lower.height):
        t = y / max(1, lower.height - 1)
        for x in range(base.W):
            lp[x, y] = (3, 12, 15, int(24 + 40 * t))
    canvas.alpha_composite(lower, (0, base.LOWER_BLANK_Y))
    draw.line((safe, base.LOWER_BLANK_Y + 120, base.W - safe, base.LOWER_BLANK_Y + 120), fill=(198, 232, 240, 105), width=3)


def save_pdf(png_path: Path, pdf_path: Path):
    c = pdf_canvas.Canvas(str(pdf_path), pagesize=(base.PHYSICAL_W_MM * mm, base.PHYSICAL_H_MM * mm))
    c.drawImage(str(png_path), 0, 0, width=base.PHYSICAL_W_MM * mm, height=base.PHYSICAL_H_MM * mm)
    c.showPage()
    c.save()


def main():
    canvas = make_bg_ice().convert("RGBA")
    draw_soft_word(canvas)
    add_heritage_ghost(canvas)
    add_product_stage(canvas)
    base.add_noise(canvas)
    draw_layout_v3(canvas)

    rgb = canvas.convert("RGB")
    out_base = OUT / "z05-tradeshow-backdrop-V3-ice-1800x2400mm.png"
    out_2x = OUT / "z05-tradeshow-backdrop-V3-ice-1800x2400mm-2x.png"
    out_pdf = OUT / "z05-tradeshow-backdrop-V3-ice-1800x2400mm.pdf"
    preview = OUT / "z05-tradeshow-backdrop-V3-ice-preview.jpg"

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
