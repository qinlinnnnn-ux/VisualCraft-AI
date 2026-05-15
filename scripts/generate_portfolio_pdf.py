from __future__ import annotations

import math
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "portfolio_output"
OUT.mkdir(exist_ok=True)
SCREENSHOT_DIR = ROOT / "portfolio_screenshots"

W, H = 1920, 1080
SAFE_X = 96
BG = (7, 7, 10)
PANEL = (28, 29, 36)
PANEL_2 = (39, 40, 50)
TEXT = (248, 250, 252)
MUTED = (154, 166, 188)
LINE = (65, 69, 82)
CYAN = (37, 244, 238)
PINK = (254, 44, 85)
PURPLE = (139, 92, 246)
GREEN = (34, 197, 94)
AMBER = (245, 158, 11)

FONT_REG = "C:/Windows/Fonts/NotoSansSC-Regular.ttf"
FONT_BOLD = "C:/Windows/Fonts/msyhbd.ttc"
FONT_HEI = "C:/Windows/Fonts/simhei.ttf"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT_REG
    if not Path(path).exists():
        path = FONT_HEI
    return ImageFont.truetype(path, size)


F = {
    "hero": font(76, True),
    "h1": font(54, True),
    "h2": font(34, True),
    "h3": font(25, True),
    "body": font(23),
    "small": font(18),
    "tiny": font(15),
    "mono": font(20, True),
}


def lerp(a: int, b: int, t: float) -> int:
    return int(a + (b - a) * t)


def gradient(size: tuple[int, int], c1: tuple[int, int, int], c2: tuple[int, int, int], vertical: bool = False) -> Image.Image:
    img = Image.new("RGB", size, c1)
    px = img.load()
    w, h = size
    span = h if vertical else w
    for y in range(h):
        for x in range(w):
            t = (y if vertical else x) / max(1, span - 1)
            px[x, y] = tuple(lerp(c1[i], c2[i], t) for i in range(3))
    return img


def rounded(draw: ImageDraw.ImageDraw, xy, r=24, fill=PANEL, outline=LINE, width=1):
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)


def text_size(draw: ImageDraw.ImageDraw, text: str, ft: ImageFont.FreeTypeFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=ft)
    return box[2] - box[0], box[3] - box[1]


def wrap_text(draw: ImageDraw.ImageDraw, text: str, ft: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    lines: list[str] = []
    for raw in text.split("\n"):
        current = ""
        for ch in raw:
            test = current + ch
            if text_size(draw, test, ft)[0] <= max_w or not current:
                current = test
            else:
                lines.append(current)
                current = ch
        if current:
            lines.append(current)
    return lines


def draw_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    ft: ImageFont.FreeTypeFont,
    fill=TEXT,
    max_w: int | None = None,
    line_gap: int = 8,
) -> int:
    x, y = xy
    lines = wrap_text(draw, text, ft, max_w) if max_w else text.split("\n")
    for line in lines:
        draw.text((x, y), line, font=ft, fill=fill)
        y += text_size(draw, line, ft)[1] + line_gap
    return y


def centered_text(draw: ImageDraw.ImageDraw, box, text: str, ft: ImageFont.FreeTypeFont, fill=TEXT):
    x1, y1, x2, y2 = box
    tw, th = text_size(draw, text, ft)
    draw.text((x1 + (x2 - x1 - tw) / 2, y1 + (y2 - y1 - th) / 2 - 2), text, font=ft, fill=fill)


def pill(draw, x, y, label, fill=(37, 39, 49), color=MUTED, pad_x=16, pad_y=8):
    tw, th = text_size(draw, label, F["small"])
    rounded(draw, (x, y, x + tw + pad_x * 2, y + th + pad_y * 2), r=22, fill=fill, outline=(76, 79, 94))
    draw.text((x + pad_x, y + pad_y - 1), label, font=F["small"], fill=color)
    return x + tw + pad_x * 2 + 10


def add_bg(img: Image.Image):
    base = Image.new("RGB", (W, H), BG)
    g1 = gradient((720, 720), (4, 80, 82), BG)
    g2 = gradient((760, 760), (80, 14, 34), BG)
    base.paste(g1, (-160, -120))
    base.paste(g2, (W - 620, -140))
    img.paste(base)


def add_header(draw: ImageDraw.ImageDraw, page: int, section: str):
    draw.text((SAFE_X, 48), "ViralCraft AI", font=F["h3"], fill=TEXT)
    draw.text((SAFE_X, 84), "AI 浜у搧缁忕悊瀹炰範浣滃搧闆?路 AIGC Short-video Product", font=F["small"], fill=MUTED)
    draw.text((W - 188, 62), f"0{page}/05", font=F["small"], fill=MUTED)
    draw.line((SAFE_X, 124, W - SAFE_X, 124), fill=(42, 45, 56), width=1)
    draw.text((W - 420, 84), section, font=F["tiny"], fill=(150, 210, 218))


def draw_logo(draw, x, y, size=64):
    grad = gradient((size, size), CYAN, PINK)
    mask = Image.new("L", (size, size), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, size, size), radius=14, fill=255)
    page = draw._image
    page.paste(grad, (x, y), mask)
    draw.text((x + 15, y + 18), "VC", font=font(21, True), fill=(5, 7, 10))


def phone_mock(draw, x, y, scale=1.0):
    w, h = int(250 * scale), int(470 * scale)
    rounded(draw, (x, y, x + w, y + h), r=int(32 * scale), fill=(5, 5, 8), outline=(72, 75, 88), width=2)
    inner = (x + int(10 * scale), y + int(10 * scale), x + w - int(10 * scale), y + h - int(10 * scale))
    rounded(draw, inner, r=int(24 * scale), fill=(50, 22, 89), outline=(30, 30, 38))
    page = draw._image
    scene = gradient((inner[2] - inner[0], inner[3] - inner[1]), PINK, PURPLE, vertical=True)
    mask = Image.new("L", scene.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, scene.size[0], scene.size[1]), radius=int(22 * scale), fill=255)
    page.paste(scene, (inner[0], inner[1]), mask)
    draw.text((x + int(68 * scale), y + int(28 * scale)), "Following   For You   Live", font=font(int(11 * scale), True), fill=(245, 245, 248))
    cx, cy = x + w // 2, y + int(132 * scale)
    draw.ellipse((cx - int(43 * scale), cy - int(43 * scale), cx + int(43 * scale), cy + int(43 * scale)), fill=(128, 69, 125), outline=(178, 130, 178))
    draw.text((cx - int(21 * scale), cy - int(22 * scale)), "AI", font=font(int(32 * scale), True), fill=TEXT)
    for i, txt in enumerate(["Most people get AI fitness", "coach wrong in the first 3s.", "Here is the structure."]):
        yy = y + int((260 + i * 36) * scale)
        rounded(draw, (x + int(28 * scale), yy, x + w - int(28 * scale), yy + int(30 * scale)), r=8, fill=(74, 20, 72), outline=None)
        draw.text((x + int(36 * scale), yy + int(5 * scale)), txt, font=font(int(12 * scale), True), fill=TEXT)
    draw.text((x + int(30 * scale), y + int(390 * scale)), "@viralcraft", font=font(int(14 * scale), True), fill=TEXT)
    draw.text((x + int(30 * scale), y + int(413 * scale)), "Steal this structure for your next video.", font=font(int(11 * scale)), fill=(205, 188, 216))
    draw.rounded_rectangle((x + int(30 * scale), y + int(444 * scale), x + int(82 * scale), y + int(448 * scale)), 2, fill=CYAN)


def ui_surface(draw, x, y, w, h, title, mode="market"):
    rounded(draw, (x, y, x + w, y + h), r=20, fill=(18, 19, 25), outline=(58, 62, 74), width=2)
    draw.rounded_rectangle((x + 22, y + 22, x + w - 22, y + 66), 10, fill=(13, 14, 19), outline=(54, 58, 70))
    draw.text((x + 42, y + 35), "Search hooks, niches, creators", font=F["small"], fill=(105, 112, 128))
    draw.text((x + 28, y + 92), title, font=F["h2"], fill=TEXT)
    if mode == "market":
        cats = ["All", "Storytime", "Product Review", "Education", "Beauty"]
        cx = x + 28
        for c in cats:
            cx = pill(draw, cx, y + 150, c, fill=CYAN if c == "All" else (31, 33, 42), color=(2, 8, 9) if c == "All" else MUTED)
        card_w = (w - 80) // 3
        colors = [(PINK, PURPLE), (CYAN, (37, 99, 235)), (PURPLE, (210, 147, 255))]
        titles = ["3-Second Curiosity Hook", "UGC Review Loop", "AI Avatar Explainer"]
        for i in range(3):
            xx = x + 28 + i * (card_w + 12)
            yy = y + 210
            rounded(draw, (xx, yy, xx + card_w, yy + 230), r=14, fill=PANEL, outline=(63, 67, 80))
            page = draw._image
            g = gradient((card_w, 78), colors[i][0], colors[i][1])
            mask = Image.new("L", (card_w, 78), 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, card_w, 90), radius=14, fill=255)
            page.paste(g, (xx, yy), mask)
            draw.text((xx + 16, yy + 96), titles[i], font=F["small"], fill=TEXT)
            draw.text((xx + 16, yy + 126), "Viral logic: hook 鈫?tension 鈫?payoff", font=F["tiny"], fill=MUTED)
            draw.text((xx + card_w - 46, yy + 28), str([96, 91, 94][i]), font=F["small"], fill=TEXT)
    elif mode == "studio":
        rows = [("Template", "3-Second Curiosity Hook"), ("Topic", "AI fitness coach")]
        yy = y + 152
        for label, val in rows:
            draw.text((x + 32, yy), label, font=F["tiny"], fill=MUTED)
            rounded(draw, (x + 32, yy + 26, x + w - 32, yy + 72), r=10, fill=PANEL_2, outline=(65, 69, 82))
            draw.text((x + 48, yy + 38), val, font=F["small"], fill=TEXT)
            yy += 88
        draw.rounded_rectangle((x + 32, y + h - 74, x + w - 32, y + h - 28), 10, fill=PINK)
        draw.text((x + w // 2 - 98, y + h - 62), "Generate Viral Draft", font=F["small"], fill=(6, 8, 11))
    elif mode == "earn":
        vals = [("$63,160", "Total earnings"), ("63,380", "Downloads"), ("7.8%", "Conversion")]
        xx = x + 32
        for val, lab in vals:
            draw.text((xx, y + 150), val, font=F["h2"], fill=TEXT)
            draw.text((xx, y + 194), lab, font=F["tiny"], fill=MUTED)
            xx += 210
        chart_x = x + 56
        chart_base = y + h - 32
        max_h = min(68, h - 286)
        for i, ratio in enumerate([0.42, 0.62, 0.55, 0.76, 0.9, 0.84, 1.0]):
            bh = int(max_h * ratio)
            bx = chart_x + i * 72
            page = draw._image
            g = gradient((48, bh), CYAN, PINK, vertical=True)
            page.paste(g, (bx, chart_base - bh))
        draw.text((x + 36, y + h - 122), "Top template: AI Avatar Explainer", font=F["small"], fill=TEXT)


def flow_arrow(draw, x1, y1, x2, y2, color=CYAN):
    draw.line((x1, y1, x2, y2), fill=color, width=3)
    ang = math.atan2(y2 - y1, x2 - x1)
    for a in (ang + 2.55, ang - 2.55):
        draw.line((x2, y2, x2 + 16 * math.cos(a), y2 + 16 * math.sin(a)), fill=color, width=3)


def product_thumb(draw, x: int, y: int, w: int, h: int, label: str, mode: str):
    rounded(draw, (x, y, x + w, y + h), r=18, fill=(18, 19, 25), outline=(58, 62, 74), width=2)
    draw.text((x + 18, y + 16), label, font=F["small"], fill=TEXT)
    draw.rounded_rectangle((x + 18, y + 52, x + w - 18, y + 84), 8, fill=(12, 13, 18), outline=(50, 54, 66))
    draw.text((x + 32, y + 59), "Search hooks, niches, creators", font=F["tiny"], fill=(112, 119, 137))
    if mode == "discover":
        colors = [(PINK, PURPLE), (CYAN, (37, 99, 235)), (PURPLE, (211, 150, 255))]
        card_w = (w - 64) // 3
        for i, (c1, c2) in enumerate(colors):
            xx = x + 18 + i * (card_w + 14)
            yy = y + 112
            rounded(draw, (xx, yy, xx + card_w, yy + 100), r=10, fill=PANEL, outline=(65, 69, 82))
            scene = gradient((card_w, 38), c1, c2)
            mask = Image.new("L", (card_w, 38), 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, card_w, 44), radius=10, fill=255)
            draw._image.paste(scene, (xx, yy), mask)
            draw.text((xx + 10, yy + 52), ["Curiosity Hook", "UGC Review", "AI Explainer"][i], font=F["tiny"], fill=TEXT)
    elif mode == "detail":
        steps = ["Hook", "Setup", "Tension", "Payoff", "CTA"]
        yy = y + 96
        for i, step in enumerate(steps):
            rounded(draw, (x + 24, yy, x + w - 24, yy + 24), r=8, fill=PANEL_2, outline=(62, 66, 78))
            draw.text((x + 40, yy + 4), f"{i + 1}. {step}", font=F["tiny"], fill=TEXT)
            yy += 28
    elif mode == "studio":
        for i, (lab, val) in enumerate([("Template", "3-Second Curiosity Hook"), ("Topic", "AI fitness coach")]):
            yy = y + 104 + i * 52
            draw.text((x + 24, yy), lab, font=F["tiny"], fill=MUTED)
            rounded(draw, (x + 24, yy + 20, x + w - 140, yy + 50), r=8, fill=PANEL_2, outline=(62, 66, 78))
            draw.text((x + 36, yy + 26), val, font=F["tiny"], fill=TEXT)
        phone_mock(draw, x + w - 122, y + 92, 0.36)
        draw.rounded_rectangle((x + 24, y + h - 46, x + w - 144, y + h - 18), 8, fill=PINK)
    elif mode == "upload":
        fields = ["Title", "Category", "Creator", "Price"]
        for i, f in enumerate(fields):
            xx = x + 24 + (i % 2) * ((w - 66) // 2 + 18)
            yy = y + 104 + (i // 2) * 54
            draw.text((xx, yy), f, font=F["tiny"], fill=MUTED)
            rounded(draw, (xx, yy + 20, xx + (w - 66) // 2, yy + 50), r=8, fill=PANEL_2, outline=(62, 66, 78))
        rounded(draw, (x + 24, y + 212, x + w - 24, y + h - 22), r=10, fill=(28, 40, 45), outline=(70, 94, 102))
        draw.text((x + w // 2 - 80, y + 224), "Cover / logic blocks", font=F["tiny"], fill=MUTED)
    elif mode == "earnings":
        vals = [("$63K", "Earnings"), ("63K", "Downloads"), ("7.8%", "CVR")]
        for i, (val, lab) in enumerate(vals):
            xx = x + 30 + i * 138
            draw.text((xx, y + 108), val, font=F["h3"], fill=TEXT)
            draw.text((xx, y + 140), lab, font=F["tiny"], fill=MUTED)
        base = y + h - 26
        for i, ratio in enumerate([0.42, 0.62, 0.55, 0.76, 0.9, 0.84, 1.0]):
            bh = int(98 * ratio)
            bx = x + 58 + i * 54
            draw._image.paste(gradient((32, bh), CYAN, PINK, vertical=True), (bx, base - bh))


def screenshot_files() -> list[Path]:
    names = [
        "01_discover.png",
        "02_studio.png",
        "03_upload.png",
        "04_earnings.png",
        "05_studio_alt.png",
    ]
    paths = [SCREENSHOT_DIR / name for name in names]
    return paths if all(path.exists() for path in paths) else []


def screenshot_card(draw, x: int, y: int, w: int, h: int, label: str, path: Path):
    rounded(draw, (x, y, x + w, y + h), r=18, fill=(18, 19, 25), outline=(58, 62, 74), width=2)
    draw.text((x + 16, y + 14), label, font=F["small"], fill=TEXT)
    img = Image.open(path).convert("RGB")
    frame = (x + 14, y + 50, x + w - 14, y + h - 14)
    fw, fh = frame[2] - frame[0], frame[3] - frame[1]
    fitted = ImageOps.contain(img, (fw, fh), method=Image.Resampling.LANCZOS)
    px = frame[0] + (fw - fitted.width) // 2
    py = frame[1] + (fh - fitted.height) // 2
    mask = Image.new("L", fitted.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, fitted.width, fitted.height), radius=10, fill=255)
    draw._image.paste(fitted, (px, py), mask)


def slide_1() -> Image.Image:
    img = Image.new("RGB", (W, H))
    add_bg(img)
    d = ImageDraw.Draw(img)
    add_header(d, 1, "CASE OVERVIEW")
    draw_logo(d, SAFE_X, 176, 72)
    draw_text(d, (SAFE_X, 276), "ViralCraft AI", F["hero"], max_w=760)
    draw_text(d, (SAFE_X, 372), "AI 鐖嗘瑙嗛妯℃澘甯傚満\n涓庡垱浣滃伐浣滃彴", F["h1"], max_w=820)
    draw_text(
        d,
        (SAFE_X, 500),
        "闈㈠悜鏂版墜鍒涗綔鑰呫€丄I 鏁板瓧浜鸿繍钀ヨ€呬笌鍒涗綔鑰呮ā鏉夸緵缁欒€咃紝鎶婃垚鐔熷垱浣滆€呯殑鐖嗘缁忛獙缁撴瀯鍖栦负鍙鐢ㄣ€佸彲璐拱銆佸彲鐢?AI 鎵ц鐨勮棰戞ā鏉裤€?,
        F["body"],
        fill=MUTED,
        max_w=740,
    )
    x = SAFE_X
    for tag in ["AIGC Product Strategy", "PRD", "Front-end MVP", "Creator Economy"]:
        x = pill(d, x, 654, tag, fill=(33, 36, 47), color=TEXT)
    draw_text(d, (SAFE_X, 748), "Product insight", F["tiny"], fill=(154, 226, 230))
    draw_text(d, (SAFE_X, 780), "From Generate Content\nto Generate Viral Structure.", F["h2"], max_w=650)
    ui_surface(d, 990, 170, 720, 520, "Viral logic marketplace", "market")
    phone_mock(d, 1495, 515, 0.82)
    draw_text(d, (SAFE_X, 994), "瀹氫綅锛欰I 浜у搧缁忕悊瀹炰範浣滃搧闆?/ 鍘熷瀷涓庢暟鎹潎涓烘ā鎷燂紝鐢ㄤ簬灞曠ず浜у搧鎬濊矾涓庝氦浜掕璁¤兘鍔?, F["tiny"], fill=MUTED)
    return img


def slide_2() -> Image.Image:
    img = Image.new("RGB", (W, H))
    add_bg(img)
    d = ImageDraw.Draw(img)
    add_header(d, 2, "PROBLEM & USERS")
    draw_text(d, (SAFE_X, 172), "闂涓嶆槸涓嶄細鐢熸垚锛孿n鑰屾槸涓嶄細缁勭粐浼犳挱缁撴瀯銆?, F["h1"], max_w=720)
    draw_text(
        d,
        (SAFE_X, 330),
        "AIGC 闄嶄綆浜嗗唴瀹圭敓浜ф垚鏈紝浣嗘柊鎵嬫洿缂哄皯鍐呭缁撴瀯鍒ゆ柇鍔涳細寮€澶村浣曟姄浜恒€佸浣曞埗閫犲ソ濂囩己鍙ｃ€佷綍鏃剁粰鍑鸿瘉鏄庝笌 CTA銆?,
        F["body"],
        fill=MUTED,
        max_w=730,
    )
    users = [
        ("鏂版墜鍒涗綔鑰?, "涓嶇煡閬撳浣曞啓 hook锛涜妭濂忓钩閾猴紱闇€瑕佷綆鎴愭湰璇曢敊銆?, PINK),
        ("AI 鏁板瓧浜鸿繍钀ヨ€?, "闇€瑕佺ǔ瀹氫汉璁俱€佽妭濂忋€佷簰鍔ㄧ粨鏋勪笌鍐呭鐢熶骇 SOP銆?, CYAN),
        ("妯℃澘渚涚粰鑰?, "鏈夌垎娆剧粡楠岋紝浣嗚绋嬪お閲嶏紱甯屾湜鐢ㄨ交閲忔ā鏉胯妯″寲鍙樼幇銆?, PURPLE),
    ]
    y = 520
    for title, desc, color in users:
        d.ellipse((SAFE_X, y + 4, SAFE_X + 22, y + 26), fill=color)
        draw_text(d, (SAFE_X + 44, y), title, F["h3"])
        draw_text(d, (SAFE_X + 44, y + 38), desc, F["small"], fill=MUTED, max_w=680)
        y += 132
    rounded(d, (980, 180, 1748, 858), r=26, fill=(18, 19, 25), outline=(58, 62, 74))
    draw_text(d, (1036, 238), "Opportunity map", F["h2"])
    stages = [
        ("杈撳叆涓婚", "Topic"),
        ("鍖归厤妯℃澘", "Template"),
        ("鐢熸垚缁撴瀯", "Hook / Script"),
        ("鍙戝竷鍙嶉", "Data"),
        ("鍒涗綔鑰呮敹鐩?, "Revenue"),
    ]
    yy = 340
    last = None
    for cn, en in stages:
        box = (1072, yy, 1388, yy + 64)
        rounded(d, box, r=16, fill=PANEL_2, outline=(72, 75, 90))
        centered_text(d, (box[0], box[1] + 3, box[2], box[1] + 40), cn, F["h3"], fill=TEXT)
        centered_text(d, (box[0], box[1] + 37, box[2], box[3] - 3), en, F["tiny"], fill=MUTED)
        if last:
            flow_arrow(d, 1230, last + 64, 1230, yy - 6, color=(96, 235, 231))
        last = yy
        yy += 88
    draw_text(d, (1446, 382), "鏍稿績鍒ゆ柇", F["h3"], fill=CYAN)
    draw_text(d, (1446, 428), "鎶婂垱浣滆€呯粡楠屼粠鈥滃彛澶寸粡楠屸€濊浆鎴?AI 鍙墽琛岀殑缁撴瀯鍖栨ā鏉匡紝鏄骇鍝佸樊寮傜偣銆?, F["body"], fill=TEXT, max_w=240)
    return img


def slide_3() -> Image.Image:
    img = Image.new("RGB", (W, H))
    add_bg(img)
    d = ImageDraw.Draw(img)
    add_header(d, 3, "PRODUCT INTERFACE SYSTEM")
    draw_text(d, (SAFE_X, 164), "5 涓牳蹇冧骇鍝佺晫闈細\n浠庢ā鏉挎秷璐瑰埌鍒涗綔鑰呭彉鐜般€?, F["h1"], max_w=760)
    draw_text(
        d,
        (SAFE_X, 316),
        "杩欓〉绯荤粺灞曠ず瀹屾暣 MVP 淇℃伅鏋舵瀯锛氱敤鎴峰彂鐜版ā鏉裤€佺悊瑙ｆā鏉块€昏緫銆佽繘鍏?AI 鍒涗綔銆佸垱浣滆€呬笂浼犳ā鏉匡紝骞跺湪鏀剁泭闈㈡澘閲岀湅鍒板晢涓氶棴鐜€?,
        F["body"],
        fill=MUTED,
        max_w=940,
    )
    shot_paths = screenshot_files()
    if shot_paths:
        labels = [
            "01 Discover / Marketplace",
            "02 AI Studio",
            "03 Upload Template",
            "04 Earnings Dashboard",
            "05 Template Detail / Library",
        ]
        positions = [(82, 438), (688, 438), (1294, 438), (386, 750), (992, 750)]
        for label, path, (x, y) in zip(labels, shot_paths, positions):
            screenshot_card(d, x, y, 544, 272, label, path)
    else:
        thumbs = [
            ("01 Discover / Marketplace", "discover"),
            ("02 Template Detail", "detail"),
            ("03 AI Studio", "studio"),
            ("04 Upload Template", "upload"),
            ("05 Earnings Dashboard", "earnings"),
        ]
        positions = [(96, 470), (686, 470), (1276, 470), (390, 770), (980, 770)]
        for (label, mode), (x, y) in zip(thumbs, positions):
            product_thumb(d, x, y, 548, 250, label, mode)
    return img


def slide_4() -> Image.Image:
    img = Image.new("RGB", (W, H))
    add_bg(img)
    d = ImageDraw.Draw(img)
    add_header(d, 4, "AI CREATION WORKSPACE")
    draw_text(d, (SAFE_X, 168), "AI Studio锛歕n妯℃澘绾︽潫涓嬬殑鐢熸垚宸ヤ綔娴?, F["h1"], max_w=760)
    draw_text(d, (SAFE_X, 342), "涓嶆槸璁?AI 鑷敱鍙戞尌锛岃€屾槸璁?AI 鍦ㄧ粡杩囬獙璇佺殑鐖嗘缁撴瀯涓伐浣溿€?, F["body"], fill=MUTED, max_w=700)
    ui_surface(d, SAFE_X, 438, 820, 420, "AI creation form", "studio")
    phone_mock(d, 1035, 178, 1.12)
    rounded(d, (1352, 210, 1776, 748), r=22, fill=(18, 19, 25), outline=(58, 62, 74))
    draw_text(d, (1390, 252), "Generated output", F["h3"], fill=(165, 214, 222))
    outputs = [
        ("Title", "I tested this AI fitness coach framework so you don't have to"),
        ("Script", "Scene 1 bold claim 鈫?Scene 2 common mistake 鈫?Scene 3 template logic 鈫?Scene 4 CTA"),
        ("Shot list", "0.0s hook punch-in 路 1.2s proof visual 路 6.8s payoff frame"),
        ("Hashtags", "#AICreator #ViralTemplate #ShortVideo"),
    ]
    yy = 310
    for lab, val in outputs:
        draw_text(d, (1390, yy), lab, F["tiny"], fill=CYAN)
        yy = draw_text(d, (1390, yy + 22), val, F["small"], fill=TEXT, max_w=334, line_gap=5) + 12
    steps = ["Topic", "Template", "Hook", "Script", "Shot list", "Caption", "CTA", "Preview"]
    x = SAFE_X
    y = 930
    for i, s in enumerate(steps):
        x = pill(d, x, y, s, fill=(31, 34, 44), color=TEXT)
        if i < len(steps) - 1:
            draw_text(d, (x - 2, y + 8), "鈫?, F["small"], fill=CYAN)
            x += 30
    return img


def slide_5() -> Image.Image:
    img = Image.new("RGB", (W, H))
    add_bg(img)
    d = ImageDraw.Draw(img)
    add_header(d, 5, "BUSINESS LOOP & PM VALUE")
    draw_text(d, (SAFE_X, 166), "Creator Economy锛歕n鎶婃柟娉曡鍙樻垚鍙氦鏄撹祫浜с€?, F["h1"], max_w=760)
    draw_text(d, (SAFE_X, 330), "骞冲彴褰㈡垚鍙岃竟闂幆锛氭柊鎵嬩笌 AI 鏁板瓧浜烘秷璐规ā鏉匡紝澶撮儴鍒涗綔鑰呬笂浼犳ā鏉胯幏寰椾笅杞戒笌鍒嗘垚锛屾暟鎹〃鐜板弽鍝烘ā鏉挎帓搴忋€?, F["body"], fill=MUTED, max_w=720)
    ui_surface(d, SAFE_X, 500, 760, 340, "Creator earnings dashboard", "earn")
    rounded(d, (920, 210, 1770, 790), r=28, fill=(18, 19, 25), outline=(58, 62, 74))
    draw_text(d, (970, 260), "浜у搧闂幆", F["h2"])
    loop = [
        ("妯℃澘渚涚粰", "鍒涗綔鑰呬笂浼?),
        ("妯℃澘娑堣垂", "鐢ㄦ埛閫夋嫨"),
        ("AI 鐢熶骇", "鐢熸垚鑽夌"),
        ("鏁版嵁鍙嶉", "鍙戝竷楠岃瘉"),
        ("鏀剁泭澧為暱", "鎺掕鍒嗘垚"),
    ]
    start_x, yy = 970, 430
    box_w, gap = 122, 34
    centers = []
    for i, (title, sub) in enumerate(loop):
        x = start_x + i * (box_w + gap)
        rounded(d, (x, yy, x + box_w, yy + 96), r=16, fill=PANEL_2, outline=(74, 78, 94))
        tw, _ = text_size(d, title, F["small"])
        d.text((x + box_w // 2 - tw // 2, yy + 22), title, font=F["small"], fill=TEXT)
        tw, _ = text_size(d, sub, F["tiny"])
        d.text((x + box_w // 2 - tw // 2, yy + 58), sub, font=F["tiny"], fill=MUTED)
        centers.append((x + box_w, yy + 48))
        if i < len(loop) - 1:
            flow_arrow(d, x + box_w + 8, yy + 48, x + box_w + gap - 8, yy + 48, color=(96, 235, 231))
    draw_text(d, (970, 610), "鍟嗕笟妯″紡", F["h3"], fill=CYAN)
    draw_text(d, (970, 652), "妯℃澘鎸夋浠樿垂 / 鍒涗綔鑰呮ā鏉垮寘璁㈤槄 / 骞冲彴浜ゆ槗鎶芥垚 / 妯℃澘鍔犳潈鎺ㄨ崘", F["body"], max_w=720, fill=TEXT)
    draw_text(d, (988, 920), "鎴戝湪杩欎釜椤圭洰涓睍绀虹殑瀹炰範鑳藉姏", F["h3"], fill=CYAN)
    draw_text(
        d,
        (988, 960),
        "鐢ㄦ埛娲炲療 路 MVP 鑼冨洿瀹氫箟 路 PRD 鎷嗚В 路 AI 鐢熸垚閾捐矾璁捐 路 鍘熷瀷浜や簰 路 鍟嗕笟闂幆涓庢寚鏍囨剰璇?,
        F["body"],
        max_w=760,
    )
    return img


def main():
    slides = [slide_1(), slide_2(), slide_3(), slide_4(), slide_5()]
    png_paths = []
    for i, slide in enumerate(slides, 1):
        path = OUT / f"ViralCraft_AI_Portfolio_Page_{i}.png"
        slide.save(path, "PNG")
        png_paths.append(path)
    pdf_path = ROOT / "ViralCraft_AI_Product_Portfolio_Internship.pdf"
    slides[0].save(pdf_path, "PDF", save_all=True, append_images=slides[1:], resolution=144.0)
    print(pdf_path)
    for path in png_paths:
        print(path)


if __name__ == "__main__":
    main()


