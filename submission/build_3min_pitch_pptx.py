"""
Build 6-slide high-impact 3-minute pitch deck for TerraTwin in python-pptx.
Optimized for 180 seconds live stage presentation.
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

NAVY = RGBColor(10, 14, 26)       # #0A0E1A
CYAN = RGBColor(0, 212, 255)      # #00D4FF
WHITE = RGBColor(255, 255, 255)
LIGHT_GREY = RGBColor(180, 195, 210)
AMBER = RGBColor(255, 179, 0)
DARK_CARD = RGBColor(18, 26, 45)

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    def set_bg(slide):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = NAVY

    def add_card(slide, left, top, width, height, bg_color=DARK_CARD):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = CYAN
        shape.line.width = Pt(1)
        return shape

    # SLIDE 1: Hook & Challenge (0:00 - 0:25)
    s1 = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s1)
    
    # Category tag
    tb = s1.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.333), Inches(0.5))
    p = tb.text_frame.paragraphs[0]
    p.text = "NASA SPACE APPS CHALLENGE 2026 | YANGON LOCAL"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = CYAN

    # Big Title
    tb = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.333), Inches(1.5))
    p = tb.text_frame.paragraphs[0]
    p.text = "TerraTwin: Planetary Analog Atlas"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = WHITE

    # Challenge Subtitle
    tb = s1.shapes.add_textbox(Inches(1.0), Inches(3.3), Inches(11.333), Inches(0.8))
    p = tb.text_frame.paragraphs[0]
    p.text = "Challenge: Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars"
    p.font.size = Pt(16)
    p.font.color.rgb = AMBER

    # 3 Fast Punchy Pillars
    card_w = Inches(3.5)
    card_h = Inches(2.2)
    cards_data = [
        ("THE RISK", "A single hardware failure on lunar regolith or Martian dust costs hundreds of millions."),
        ("THE NEED", "Artemis & Mars missions need quantitative Earth proving grounds, not guesswork."),
        ("THE SOLUTION", "Open-access satellite data fusion matching 12 Earth sites to 4 planetary outposts.")
    ]
    for i, (title, desc) in enumerate(cards_data):
        x = Inches(1.0) + i * Inches(3.9)
        add_card(s1, x, Inches(4.3), card_w, card_h)
        tb = s1.shapes.add_textbox(x + Inches(0.2), Inches(4.5), card_w - Inches(0.4), card_h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = CYAN
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(13)
        p2.font.color.rgb = LIGHT_GREY

    # SLIDE 2: The Core Problem (0:25 - 0:55)
    s2 = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s2)

    tb = s2.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.333), Inches(0.8))
    p = tb.text_frame.paragraphs[0]
    p.text = "The $10B Problem: The Analog Selection Blindspot"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = WHITE

    p2_data = [
        ("1. Superficial 'Looks Like' Intuition", "Analog sites are historically picked because someone thought a desert 'looked like Mars'. Visual resemblance ignores thermal swings, radar roughness, and mineralogy."),
        ("2. Data Silos Between Earth & Space", "Planetary orbital datasets (LOLA, Diviner, MGS TES) have never been unified with Earth remote sensing (MODIS, SRTM, GPM) into an automated scoring model."),
        ("3. High Stakes for Artemis Base Camps", "Testing spacesuits, drilling rigs, and rovers in the wrong analog leads to catastrophic seal abrasions, mobility stalls, and battery freeze failures.")
    ]
    for i, (heading, text) in enumerate(p2_data):
        y = Inches(1.8) + i * Inches(1.7)
        add_card(s2, Inches(1.0), y, Inches(11.333), Inches(1.4))
        tb = s2.shapes.add_textbox(Inches(1.3), y + Inches(0.15), Inches(10.7), Inches(1.1))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = heading
        p1.font.size = Pt(18)
        p1.font.bold = True
        p1.font.color.rgb = CYAN
        p2 = tf.add_paragraph()
        p2.text = text
        p2.font.size = Pt(13)
        p2.font.color.rgb = LIGHT_GREY

    # SLIDE 3: 8-Feature Scientific Matrix (0:55 - 1:30)
    s3 = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s3)

    tb = s3.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.333), Inches(0.8))
    p = tb.text_frame.paragraphs[0]
    p.text = "The Engine: 8-Feature Multi-Parametric Fusion"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = WHITE

    features = [
        ("1. Slope", "SRTMGL1 (Earth) vs. LOLA (Moon) vs. MOLA (Mars)"),
        ("2. Roughness", "1 km elevation standard dev & C-band SAR backscatter"),
        ("3. Temp Contrast", "Diurnal LST swings: MODIS vs. LRO Diviner vs. MGS TES"),
        ("4. Dryness", "GPM IMERG vs. Hyper-arid baseline (0 mm/yr)"),
        ("5. Bareness", "MODIS NDVI vs. Barren regolith baseline (0.00)"),
        ("6. Rock / Mineral", "Categorical lithology matrix (Basaltic, Volcanic, Regolith)"),
        ("7. Cryosphere", "Permafrost & ground ice vs. Polar cold traps"),
        ("8. Dust / Aerosol", "MODIS MAIAC AOD vs. Martian atmospheric dust opacity")
    ]
    for i, (name, source) in enumerate(features):
        col = i % 2
        row = i // 2
        x = Inches(1.0) + col * Inches(5.8)
        y = Inches(1.8) + row * Inches(1.25)
        add_card(s3, x, y, Inches(5.5), Inches(1.1))
        tb = s3.shapes.add_textbox(x + Inches(0.2), y + Inches(0.1), Inches(5.1), Inches(0.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = name
        p1.font.size = Pt(15)
        p1.font.bold = True
        p1.font.color.rgb = CYAN
        p2 = tf.add_paragraph()
        p2.text = source
        p2.font.size = Pt(12)
        p2.font.color.rgb = LIGHT_GREY

    # SLIDE 4: Live Platform & Comparisons (1:30 - 2:05)
    s4 = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s4)

    tb = s4.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.333), Inches(0.8))
    p = tb.text_frame.paragraphs[0]
    p.text = "Live Platform: 12 Earth Sites × 4 Planetary Targets"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = WHITE

    # Left: Targets
    add_card(s4, Inches(1.0), Inches(1.8), Inches(5.5), Inches(4.8))
    tb = s4.shapes.add_textbox(Inches(1.3), Inches(2.0), Inches(4.9), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "4 Planetary Targets"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = CYAN

    targets_desc = [
        ("Permanent Moon Base:", "Shackleton Crater Rim & Malapert Massif (Artemis landing candidates)"),
        ("Mars Exploration:", "Jezero Crater (Perseverance delta) & Meridiani Planum (Opportunity hematite)"),
        ("Key Finding:", "Svalbard & McMurdo lead for Moon polar base conditions; Atacama leads for Mars dry-rock.")
    ]
    for heading, detail in targets_desc:
        p1 = tf.add_paragraph()
        p1.text = heading
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = AMBER
        p2 = tf.add_paragraph()
        p2.text = detail
        p2.font.size = Pt(12)
        p2.font.color.rgb = LIGHT_GREY

    # Right: Live App Features
    add_card(s4, Inches(6.8), Inches(1.8), Inches(5.5), Inches(4.8))
    tb = s4.shapes.add_textbox(Inches(7.1), Inches(2.0), Inches(4.9), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Live Working Features"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = CYAN

    features_desc = [
        ("Interactive Leaflet Map:", "Universal OpenStreetMap tiles, 12 provisional candidate markers, Focus Myanmar tool."),
        ("Catalogue Rankings:", "Dynamic conic-gradient similarity badges, lithology filters, direct site inspection."),
        ("Side-by-Side Compare:", "Compare any two Earth analogs against any Moon/Mars target simultaneously."),
        ("Live Deployment:", "Hosted on GitHub Pages: amarahan.github.io/TerraTwin")
    ]
    for heading, detail in features_desc:
        p1 = tf.add_paragraph()
        p1.text = heading
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = WHITE
        p2 = tf.add_paragraph()
        p2.text = detail
        p2.font.size = Pt(12)
        p2.font.color.rgb = LIGHT_GREY

    # SLIDE 5: Radical Scientific Honesty (2:05 - 2:35)
    s5 = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s5)

    tb = s5.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.333), Inches(0.8))
    p = tb.text_frame.paragraphs[0]
    p.text = "Zero Hallucination: Radical Scientific Honesty"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = WHITE

    honesty_points = [
        ("Nulls Are Preserved (The McMurdo Case)", "Polar darkness prevents satellite NDVI readings at McMurdo Dry Valleys. We NEVER coerce missing data to 0. TerraTwin preserves null, evaluates 7/8 features, and enforces a strict 75% weighted coverage gate (McMurdo achieves 97% Moon, 95% Mars)."),
        ("Full Cell-by-Cell Traceability", "Every score links back to raw NASA PDS product IDs, sensor bands, and original workbook cell coordinates. Zero black-box AI guessing."),
        ("Rigorous Validation Engine", "Dual Python & TypeScript scoring engines verified by 37 automated tests with 0 decimal divergence. Deliberate control sites score <25%, proving the model works.")
    ]
    for i, (title, text) in enumerate(honesty_points):
        y = Inches(1.8) + i * Inches(1.7)
        add_card(s5, Inches(1.0), y, Inches(11.333), Inches(1.4))
        tb = s5.shapes.add_textbox(Inches(1.3), y + Inches(0.15), Inches(10.7), Inches(1.1))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(17)
        p1.font.bold = True
        p1.font.color.rgb = CYAN
        p2 = tf.add_paragraph()
        p2.text = text
        p2.font.size = Pt(13)
        p2.font.color.rgb = LIGHT_GREY

    # SLIDE 6: Mission Impact & Call to Action (2:35 - 3:00)
    s6 = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s6)

    tb = s6.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.333), Inches(0.8))
    p = tb.text_frame.paragraphs[0]
    p.text = "De-Risking the Artemis Generation"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = WHITE

    # Left: Impact
    add_card(s6, Inches(1.0), Inches(1.8), Inches(5.5), Inches(4.8))
    tb = s6.shapes.add_textbox(Inches(1.3), Inches(2.0), Inches(4.9), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "What Mission Planners Gain"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = CYAN

    impacts = [
        ("Objective Testing:", "Choose proving grounds mathematically based on specific hardware risks (rover traction vs. solar dust)."),
        ("Cost Efficiency:", "Test in accessible terrestrial analogs before spending millions on orbital deployments."),
        ("Global Inclusivity:", "Identify candidates beyond traditional Western sites, including Southeast Asia and Myanmar.")
    ]
    for heading, detail in impacts:
        p1 = tf.add_paragraph()
        p1.text = heading
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = AMBER
        p2 = tf.add_paragraph()
        p2.text = detail
        p2.font.size = Pt(12)
        p2.font.color.rgb = LIGHT_GREY

    # Right: Live Links
    add_card(s6, Inches(6.8), Inches(1.8), Inches(5.5), Inches(4.8))
    tb = s6.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(4.9), Inches(4.0))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Explore TerraTwin Today"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = CYAN

    links = [
        ("Live Web Application:", "https://amarahan.github.io/TerraTwin/"),
        ("Public Source Code:", "https://github.com/Amarahan/TerraTwin"),
        ("Test Verification:", "37 Python Tests Passed | 25 Node Tests Passed"),
        ("Final Message:", "Analog research is humanity's rehearsal before deep space. TerraTwin makes it measurable.")
    ]
    for heading, detail in links:
        p1 = tf.add_paragraph()
        p1.text = heading
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = WHITE
        p2 = tf.add_paragraph()
        p2.text = detail
        p2.font.size = Pt(12)
        p2.font.color.rgb = LIGHT_GREY

    out_path = "submission/TerraTwin_3Min_Pitch.pptx"
    prs.save(out_path)
    print(f"[OK] Generated: {out_path}")

if __name__ == "__main__":
    create_deck()
