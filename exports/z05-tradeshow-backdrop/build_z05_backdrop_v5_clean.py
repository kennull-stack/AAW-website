from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdf_canvas

import build_z05_backdrop as base


OUT = Path(__file__).resolve().parent / "V5-clean"
OUT.mkdir(parents=True, exist_ok=True)

LIGHT_HERO = Path(__file__).resolve().parent / "V4-white" / "z05-z06-light-studio-hero.png"

INK = (22, 31, 36)
MUTED = (88, 104, 110)
ICE = (28, 171, 203)
SILVER = (168, 181, 184)
GOLD = (179, 132, 58)


def make_gallery_bg() -> Image.Image:
    small = Image.new("RGB", (base.SMALL_W, base.SMALL_H))
    px = small.load()
    for y in range(base.SMALL_H):
        t = y / (base.SMALL_H - 1)
        for x in range(base.SMALL_W):
            u = x / (base.SMALL_W - 1)
            ice_glow = max(0, 1 - math.hypot((u - 0.34) / 0.76, (t - 0.46) / 0.62))
            warm_glow = max(0, 1 - math.hypot((u - 0.88) / 0.50, (t - 0.16) / 0.36))
            floor = max(0, 1 - abs(t - 0.67) / 0.23)
            shade = max(0, math.hypot((u - 0.5) / 1.05, (t - 0.45) / 1.18) - 0.66)
            r = 246 - int(ice_glow * 18) + int(warm_glow * 8) - int(floor * 10) - int(shade * 10)
            g = 249 - int(ice_glow * 7) + int(warm_glow * 5) - int(floor * 8) - int(shade * 8)
            b = 250 + int(ice_glow * 8) - int(warm_glow * 5) - int(floor * 4) - int(shade * 5)
            px[x, y] = tuple(max(0, min(255, c)) for c in (r, g, b))

    bg = small.resize((base.W, base.H), Image.Resampling.BICUBIC).convert("RGBA")
    layer = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rectangle((0, base.LOWER_BLANK_Y, base.W, base.H), fill=(238, 243, 244, 236))
    d.line((360, 1025, base.W - 360, 1025), fill=(198, 216, 220, 82), width=4)
    d.line((360, 4680, base.W - 360, 4680), fill=(184, 202, 206, 72), width=3)
    layer = layer.filter(ImageFilter.GaussianBlur(2))
    return Image.alpha_composite(bg, layer).convert("RGB")


def feathered_photo(photo: Image.Image) -> Image.Image:
    photo = photo.convert("RGBA")
    mask = Image.new("L", photo.size, 255)
    px = mask.load()
    for y in range(photo.height):
        top = min(1, y / 360)
        bottom = min(1, (photo.height - y) / 410)
        for x in range(photo.width):
            side = min(1, x / 520, (photo.width - x) / 520)
            px[x, y] = int(255 * min(top, bottom, side))
    mask = mask.filter(ImageFilter.GaussianBlur(14))
    photo.putalpha(mask)
    return photo


def add_hero(canvas: Image.Image):
    hero = Image.open(LIGHT_HERO).convert("RGB")
    hero = ImageEnhance.Color(hero).enhance(1.06)
    hero = ImageEnhance.Contrast(hero).enhance(1.03)
    hero = ImageEnhance.Brightness(hero).enhance(1.03)
    hero = ImageEnhance.Sharpness(hero).enhance(1.10)

    target_w = 5520
    target_h = int(hero.height * target_w / hero.width)
    hero = hero.resize((target_w, target_h), Image.Resampling.LANCZOS)
    x = (base.W - target_w) // 2
    y = 1320

    shadow = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((690, 2920, base.W - 610, 4700), fill=(23, 38, 43, 28))
    sd.ellipse((840, 3040, base.W - 720, 4520), fill=(45, 177, 205, 22))
    shadow = shadow.filter(ImageFilter.GaussianBlur(190))
    canvas.alpha_composite(shadow)

    canvas.alpha_composite(feathered_photo(hero), (x, y))


def text_width(draw: ImageDraw.ImageDraw, text: str, fnt) -> int:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0]


def draw_small_caps(draw, xy, text, color):
    draw.text(xy, text, font=base.font(base.FONT_BOLD, 58), fill=color + (238,))


def draw_layout(canvas: Image.Image):
    draw = ImageDraw.Draw(canvas)
    safe = 330

    lockup = base.render_top_lockup(INK)
    base.paste_with_mask(canvas, lockup, (safe, 315), opacity=242)

    draw.text((safe, 890), "Z05", font=base.font(base.FONT_BOLD, 270), fill=INK + (246,))
    draw.text((safe, 1195), "Ice Crystal Titanium Faceplate", font=base.font(base.FONT_LIGHT, 122), fill=INK + (238,))
    draw_small_caps(draw, (safe, 1385), "TWINCORE SWITCH  |  10MM DYNAMIC + 4BA", ICE)

    z06_x, z06_y = 3235, 4075
    draw.text((z06_x, z06_y), "ALSO FEATURING", font=base.font(base.FONT_BOLD, 42), fill=GOLD + (224,))
    draw.text((z06_x, z06_y + 66), "Z06 Snow Titanium Edition", font=base.font(base.FONT_BOLD, 66), fill=INK + (238,))
    draw.text((z06_x, z06_y + 160), "TwinCore switch function", font=base.font(base.FONT_REG, 50), fill=MUTED + (220,))

    caption_y = 4255
    draw.text((safe, caption_y), "A cleaner evolution from AuAg to Ice Crystal.", font=base.font(base.FONT_REG, 70), fill=MUTED + (220,))
    draw.line((safe, caption_y + 126, safe + 1160, caption_y + 126), fill=ICE + (150,), width=6)

    contact_y = 4855
    draw.text((safe, contact_y), "ADVANCED ACOUSTICWERKES", font=base.font(base.FONT_BOLD, 78), fill=INK + (235,))
    draw.text((safe, contact_y + 128), "AAW.ME  |  Z05 Ice Crystal Titanium  |  Z06 Snow Titanium", font=base.font(base.FONT_REG, 60), fill=MUTED + (224,))
    draw.text((safe, contact_y + 232), "aaw.me", font=base.font(base.FONT_REG, 50), fill=SILVER + (216,))

    lower = Image.new("RGBA", (base.W, base.H - base.LOWER_BLANK_Y), (238, 243, 244, 242))
    canvas.alpha_composite(lower, (0, base.LOWER_BLANK_Y))
    draw.line((safe, base.LOWER_BLANK_Y + 115, base.W - safe, base.LOWER_BLANK_Y + 115), fill=(176, 197, 202, 116), width=3)


def save_pdf(png_path: Path, pdf_path: Path):
    c = pdf_canvas.Canvas(str(pdf_path), pagesize=(base.PHYSICAL_W_MM * mm, base.PHYSICAL_H_MM * mm))
    c.drawImage(str(png_path), 0, 0, width=base.PHYSICAL_W_MM * mm, height=base.PHYSICAL_H_MM * mm)
    c.showPage()
    c.save()


def main():
    canvas = make_gallery_bg().convert("RGBA")
    add_hero(canvas)
    base.add_noise(canvas)
    draw_layout(canvas)

    rgb = canvas.convert("RGB")
    out_base = OUT / "z05-tradeshow-backdrop-V5-clean-1800x2400mm.png"
    out_2x = OUT / "z05-tradeshow-backdrop-V5-clean-1800x2400mm-2x.png"
    out_pdf = OUT / "z05-tradeshow-backdrop-V5-clean-1800x2400mm.pdf"
    preview = OUT / "z05-tradeshow-backdrop-V5-clean-preview.jpg"

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
