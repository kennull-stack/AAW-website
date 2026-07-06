from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
paths = [
    ROOT / "aaw-theme" / "assets" / "z02-aaw-logo.png",
    ROOT / "aaw-theme" / "assets" / "z02-logo-lockup.png",
    ROOT / "aaw-theme" / "assets" / "z05-auag-logo-lockup.png",
    ROOT / "aaw-theme" / "assets" / "z05-logo-mark.png",
]

sheet = Image.new("RGB", (1200, 820), (5, 7, 9))
draw = ImageDraw.Draw(sheet)
y = 30
for path in paths:
    im = Image.open(path).convert("RGBA")
    scale = min(900 / im.width, 130 / im.height)
    im = im.resize((int(im.width * scale), int(im.height * scale)), Image.Resampling.LANCZOS)
    bg = Image.new("RGBA", im.size, (5, 7, 9, 255))
    bg.alpha_composite(im)
    sheet.paste(bg.convert("RGB"), (30, y))
    draw.text((30, y + im.height + 8), path.name, fill=(240, 240, 230))
    y += 195

sheet.save(Path(__file__).with_name("logo-source-contact-sheet.jpg"), quality=95)
