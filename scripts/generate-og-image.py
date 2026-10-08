"""Generate the static 1200x630 SHIFT social preview image."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "og-image.png"
SIZE = (1200, 630)
PAPER = "#faf9f6"
INK = "#121316"
MUTED = "#696b64"
LINE = "#e2dfd6"
ACCENT = "#c24723"
PANEL = "#17181a"


def font(filename, size):
    return ImageFont.truetype(Path("C:/Windows/Fonts") / filename, size)


image = Image.new("RGB", SIZE, PAPER)
draw = ImageDraw.Draw(image)

# Quiet grid detail from the site's hero background.
for x in range(0, SIZE[0], 40):
    draw.line((x, 0, x, SIZE[1]), fill=LINE, width=1)
for y in range(0, SIZE[1], 40):
    draw.line((0, y, SIZE[0], y), fill=LINE, width=1)

# Dark poster panel echoes the interactive hero poster on the website.
draw.rectangle((770, 0, 1199, 629), fill=PANEL)
draw.rectangle((770, 0, 1199, 629), outline="#303133", width=2)
for inset, color, width in ((34, "#313234", 2), (74, "#242527", 1)):
    draw.ellipse((770 + inset, 160 + inset, 1199 - inset, 592 - inset), outline=color, width=width)
draw.ellipse((920, 238, 1070, 388), fill="#252628", outline="#3a3b3d", width=2)
draw.ellipse((970, 288, 1020, 338), fill=ACCENT)

# Left hand page title and share copy.
draw.text((72, 54), "WES × UENR STUDENT CHRISTIAN COUNCIL", font=font("consola.ttf", 15), fill=MUTED)
draw.text((72, 94), "SHIFT", font=font("segoeuib.ttf", 116), fill=INK, stroke_width=1)
draw.text((453, 151), "1.0", font=font("georgiai.ttf", 32), fill=ACCENT)
draw.rectangle((74, 254, 154, 260), fill=ACCENT)
draw.text((72, 284), "Beyond the Degree", font=font("georgiai.ttf", 40), fill=INK)
draw.text((74, 345), "Building your career,", font=font("georgiai.ttf", 31), fill=ACCENT)
draw.text((74, 389), "purpose & legacy.", font=font("georgiai.ttf", 31), fill=ACCENT)
draw.text((74, 459), "FAITH. CAREER. PURPOSE. FUTURE.", font=font("consola.ttf", 15), fill=MUTED)
draw.line((74, 514, 704, 514), fill=LINE, width=2)
draw.text((74, 537), "NOVEMBER 28, 2026", font=font("consolab.ttf", 15), fill=INK)
draw.text((463, 537), "UENR · GHANA", font=font("consolab.ttf", 15), fill=INK)

# Right panel poster information.
draw.text((812, 44), "A DAY FOR WHAT COMES NEXT", font=font("consola.ttf", 13), fill="#c9c8c2")
draw.text((1090, 44), "01/01", font=font("consola.ttf", 13), fill="#c9c8c2")
draw.text((812, 421), "FAITH", font=font("segoeuib.ttf", 44), fill=PAPER)
draw.text((812, 466), "× CAREER", font=font("segoeuib.ttf", 39), fill="#e36a43")
draw.text((812, 510), "× PURPOSE", font=font("segoeuib.ttf", 39), fill=PAPER)
draw.line((812, 573, 1158, 573), fill="#454648", width=1)
draw.text((812, 589), "SHIFT 1.0  ·  UENR  ·  GHANA", font=font("consola.ttf", 12), fill="#b4b3ae")

image.save(OUTPUT, format="PNG", optimize=True)
print(f"Wrote {OUTPUT} ({SIZE[0]}x{SIZE[1]})")
