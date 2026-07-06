from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdf_canvas

import build_z05_backdrop as base


OUT = Path(__file__).resolve().parent / "V2-vibrant"
OUT.mkdir(parents=True, exist_ok=True)


def make_bg_vibrant() -> Image.Image:
    img = Image.new("RGB", (base.SMALL_W, base.SMALL_H))
    px = img.load()
    for y in range(base.SMALL_H):
        t = y / (base.SMALL_H - 1)
        for x in range(base.SMALL_W):
            u = x / (base.SMALL_W - 1)
            base_tone = [
                int(7 + 7 * (1 - t)),
                int(10 + 14 * (1 - abs(t - 0.42))),
                int(14 + 22 * (1 - abs(t - 0.38))),
            ]
            cyan_stage = max(0, 1 - math.hypot((u - 0.30) / 0.56, (t - 0.58) / 0.42))
            silver_lift = max(0, 1 - math.hypot((u - 0.62) / 0.70, (t - 0.43) / 0.34))
            warm_gold = max(0, 1 - math.hypot((u - 0.83) / 0.52, (t - 0.22) / 0.35))
            diagonal = max(0, 1 - abs((t - 0.50) - (u - 0.50) * 0.30) / 0.18)
            edge_vignette = math.hypot((u - 0.5) / 0.86, (t - 0.52) / 0.92)

            base_tone[0] += int(silver_lift * 22 + warm_gold * 56 + diagonal * 8)
            base_tone[1] += int(cyan_stage * 42 + silver_lift * 34 + warm_gold * 34 + diagonal * 12)
            base_tone[2] += int(cyan_stage * 56 + silver_lift * 42 + warm_gold * 10 + diagonal * 18)

            dim = max(0.56, 1 - edge_vignette * 0.25)
            px[x, y] = tuple(max(0, min(255, int(c * dim))) for c in base_tone)

    img = img.resize((base.W, base.H), Image.Resampling.BICUBIC)
    img = ImageEnhance.Contrast(img).enhance(1.10)

    overlay = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.polygon(
        [(-400, 2780), (base.W + 400, 2320), (base.W + 400, 2700), (-400, 3180)],
        fill=(180, 224, 232, 38),
    )
    draw.polygon(
        [(base.W * 0.58, 550), (base.W + 200, 260), (base.W + 200, 2420), (base.W * 0.64, 2640)],
        fill=(218, 178, 102, 30),
    )
    draw.line((280, 5890, base.W - 280, 5890), fill=(64, 200, 222, 60), width=5)
    overlay = overlay.filter(ImageFilter.GaussianBlur(24))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def add_supporting_assets_vibrant(canvas: Image.Image):
    base.add_supporting_assets(canvas)

    portrait = Image.open(base.PORTRAIT_ASSET).convert("RGB")
    portrait = base.fit_cover(portrait, (1980, 2520)).convert("RGBA")
    portrait = ImageEnhance.Color(portrait).enhance(0.74)
    portrait = ImageEnhance.Contrast(portrait).enhance(1.12)
    mask = Image.new("L", portrait.size, 0)
    px = mask.load()
    for y in range(portrait.height):
        vertical = min(1, y / 360, (portrait.height - y) / 520)
        for x in range(portrait.width):
            side = min(1, x / 300, (portrait.width - x) / 300)
            px[x, y] = int(72 * vertical * side)
    mask = mask.filter(ImageFilter.GaussianBlur(22))
    portrait.putalpha(mask)
    canvas.alpha_composite(portrait, (3210, 500))


def add_main_photo_vibrant(canvas: Image.Image):
    hero = Image.open(base.MAIN_PHOTO).convert("RGB")
    hero = ImageEnhance.Color(hero).enhance(1.32)
    hero = ImageEnhance.Contrast(hero).enhance(1.18)
    hero = ImageEnhance.Brightness(hero).enhance(1.08)
    hero = ImageEnhance.Sharpness(hero).enhance(1.18)

    scaled_w = int(base.W * 1.18)
    scaled_h = int(hero.height * scaled_w / hero.width)
    hero = hero.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    x = int((base.W - scaled_w) / 2)
    y = 1220

    glow = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rounded_rectangle((760, 2600, base.W - 560, 4500), radius=140, fill=(44, 197, 220, 36))
    gd.rounded_rectangle((2150, 2540, base.W - 460, 4300), radius=160, fill=(230, 201, 150, 30))
    glow = glow.filter(ImageFilter.GaussianBlur(170))
    canvas.alpha_composite(glow)

    layer = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    photo = hero.convert("RGBA")
    mask = Image.new("L", photo.size, 255)
    mask_px = mask.load()
    for yy in range(photo.height):
        top_fade = min(1, yy / 700)
        bottom_fade = min(1, (photo.height - yy) / 520)
        v = int(255 * max(0, min(1, min(top_fade, bottom_fade))))
        for xx in range(photo.width):
            mask_px[xx, yy] = v
    photo.putalpha(mask)
    layer.alpha_composite(photo, (x, y))
    canvas.alpha_composite(layer)

    vignette = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vignette)
    vd.rectangle((0, y + 720, base.W, base.LOWER_BLANK_Y), fill=(0, 0, 0, 10))
    vignette = vignette.filter(ImageFilter.GaussianBlur(90))
    canvas.alpha_composite(vignette)


def add_vibrant_finish(canvas: Image.Image):
    layer = Image.new("RGBA", (base.W, base.H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.line((320, 2440, base.W - 560, 1980), fill=(190, 232, 240, 36), width=10)
    draw.line((base.W - 1420, 430, base.W - 380, 2540), fill=(226, 182, 94, 32), width=8)
    draw.line((280, 5890, base.W - 280, 5890), fill=(230, 196, 126, 70), width=4)
    layer = layer.filter(ImageFilter.GaussianBlur(2))
    canvas.alpha_composite(layer)


def save_pdf(png_path: Path, pdf_path: Path):
    c = pdf_canvas.Canvas(str(pdf_path), pagesize=(base.PHYSICAL_W_MM * mm, base.PHYSICAL_H_MM * mm))
    c.drawImage(str(png_path), 0, 0, width=base.PHYSICAL_W_MM * mm, height=base.PHYSICAL_H_MM * mm)
    c.showPage()
    c.save()


def main():
    canvas = make_bg_vibrant().convert("RGBA")
    add_supporting_assets_vibrant(canvas)
    add_main_photo_vibrant(canvas)
    base.add_iteration_ghost(canvas)
    add_vibrant_finish(canvas)
    base.add_noise(canvas)
    base.draw_layout(canvas)

    rgb = canvas.convert("RGB")
    out_base = OUT / "z05-tradeshow-backdrop-V2-vibrant-1800x2400mm.png"
    out_2x = OUT / "z05-tradeshow-backdrop-V2-vibrant-1800x2400mm-2x.png"
    out_pdf = OUT / "z05-tradeshow-backdrop-V2-vibrant-1800x2400mm.pdf"
    preview = OUT / "z05-tradeshow-backdrop-V2-vibrant-preview.jpg"

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
