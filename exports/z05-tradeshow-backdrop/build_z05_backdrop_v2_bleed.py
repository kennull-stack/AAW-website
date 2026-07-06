from pathlib import Path

from PIL import Image, ImageFilter
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdf_canvas


Image.MAX_IMAGE_PIXELS = None

OUT = Path(__file__).resolve().parent / "V2-vibrant"
SOURCE = OUT / "z05-tradeshow-backdrop-V2-vibrant-1800x2400mm.png"

TRIM_W_MM = 1800
TRIM_H_MM = 2400
BLEED_MM = 80
FINAL_W_MM = TRIM_W_MM + BLEED_MM * 2
FINAL_H_MM = TRIM_H_MM + BLEED_MM * 2

DPI_BASE = 76.2
PX_PER_MM = DPI_BASE / 25.4
BLEED_PX = int(round(BLEED_MM * PX_PER_MM))


def fit_cover(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    w, h = size
    scale = max(w / im.width, h / im.height)
    nw, nh = int(im.width * scale + 0.5), int(im.height * scale + 0.5)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - w) // 2
    top = (nh - h) // 2
    return im.crop((left, top, left + w, top + h))


def add_bleed(trim: Image.Image) -> Image.Image:
    final_size = (trim.width + BLEED_PX * 2, trim.height + BLEED_PX * 2)
    bleed_bg = fit_cover(trim, final_size)
    bleed_bg = bleed_bg.filter(ImageFilter.GaussianBlur(44))
    bleed_bg.paste(trim, (BLEED_PX, BLEED_PX))
    return bleed_bg


def save_pdf(png_path: Path, pdf_path: Path):
    c = pdf_canvas.Canvas(str(pdf_path), pagesize=(FINAL_W_MM * mm, FINAL_H_MM * mm))
    c.drawImage(str(png_path), 0, 0, width=FINAL_W_MM * mm, height=FINAL_H_MM * mm)
    c.showPage()
    c.save()


def main():
    trim = Image.open(SOURCE).convert("RGB")
    bleed = add_bleed(trim)

    out_base = OUT / "z05-tradeshow-backdrop-V2-vibrant-1960x2560mm-8cm-bleed.png"
    out_2x = OUT / "z05-tradeshow-backdrop-V2-vibrant-1960x2560mm-8cm-bleed-2x.png"
    out_pdf = OUT / "z05-tradeshow-backdrop-V2-vibrant-1960x2560mm-8cm-bleed.pdf"
    preview = OUT / "z05-tradeshow-backdrop-V2-vibrant-8cm-bleed-preview.jpg"

    bleed.save(out_base, dpi=(DPI_BASE, DPI_BASE), quality=95)
    bleed.resize((2940, 3840), Image.Resampling.LANCZOS).save(preview, quality=95)

    up = bleed.resize((bleed.width * 2, bleed.height * 2), Image.Resampling.LANCZOS)
    up = up.filter(ImageFilter.UnsharpMask(radius=1.1, percent=70, threshold=3))
    up.save(out_2x, dpi=(DPI_BASE * 2, DPI_BASE * 2), compress_level=6)
    save_pdf(out_2x, out_pdf)

    print(out_pdf)
    print(out_2x)
    print(preview)


if __name__ == "__main__":
    main()
