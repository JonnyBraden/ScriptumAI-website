#!/usr/bin/env python3
"""One-off: generate crawlable favicons, a logo and a default social image.
Run from the repo root:  pip install pillow && python3 scripts/make_brand_assets.py
Writes: favicon.ico, favicon.svg, apple-touch-icon.png,
        assets/brand/scriptum-logo-512.png, assets/brand/og-default.png
Colours match the existing inline favicon (#0F1420 navy, #C86D4C accent)."""
import os
from PIL import Image, ImageDraw, ImageFont

NAVY, ACCENT, PAPER = (15, 20, 32), (200, 109, 76), (251, 250, 247)
os.makedirs("assets/brand", exist_ok=True)

SVG = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
       '<rect width="32" height="32" rx="8" fill="#0F1420"/>'
       '<rect x="11" y="11" width="10" height="10" rx="2" fill="#C86D4C"/></svg>\n')
open("favicon.svg", "w").write(SVG)


def mark(size):
    s = size / 32.0
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(8 * s), fill=NAVY)
    d.rounded_rectangle([int(11 * s), int(11 * s), int(21 * s) - 1, int(21 * s) - 1], radius=max(1, int(2 * s)), fill=ACCENT)
    return im


mark(48).save("favicon.ico", sizes=[(48, 48), (32, 32), (16, 16)])
mark(180).convert("RGB").save("apple-touch-icon.png")
mark(512).save("assets/brand/scriptum-logo-512.png")


def font(size, bold=False):
    for p in (["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"] if bold else []) + \
             ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/dejavu/DejaVuSans.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default(size=size)


og = Image.new("RGB", (1200, 630), PAPER)
d = ImageDraw.Draw(og)
og.paste(mark(120), (80, 80), mark(120))
d.text((230, 108), "Scriptum AI", fill=NAVY, font=font(60, True))
d.text((80, 290), "AI contract drafting in Microsoft Word", fill=NAVY, font=font(48, True))
d.text((80, 370), "for transactional lawyers at mid-sized firms", fill=NAVY, font=font(40))
d.text((80, 430), "5 to 500 fee earners  ·  UK, Ireland, USA, Canada", fill=ACCENT, font=font(36))
d.rectangle([0, 600, 1200, 630], fill=NAVY)
d.text((80, 520), "tryscriptum.ai", fill=NAVY, font=font(34))
og.save("assets/brand/og-default.png", optimize=True)
print("brand assets written")
