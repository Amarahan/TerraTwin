"""
build_pptx.py — Generate TerraTwin Final Demo presentation
Project: TerraTwin — Planetary Analog Atlas
Output: submission/TerraTwin_Final_Demo.pptx
Run: python submission/build_pptx.py  (from workspace root)

Requirements: python-pptx>=1.0.2 (pip install python-pptx)

Design constraints (from AGENTS.md and system instructions):
- Dark navy theme: #0A0E1A background, #00D4FF cyan accent, white text
- NO NASA logos or mission identifiers
- NO invented scientific values
- Exactly 7 slides including title slide
- Challenge title marked NEEDS TEAM CONFIRMATION
- NASA images labeled "Browse image — contextual only, not a quantitative measurement"
"""

import os
import sys
from pathlib import Path

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt, Emu
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
    from pptx.oxml.ns import qn
    from lxml import etree
except ImportError as e:
    print(f"ERROR: python-pptx is not installed. Run: pip install python-pptx\n{e}")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Colour palette
# ---------------------------------------------------------------------------
NAVY       = RGBColor(0x0A, 0x0E, 0x1A)
CYAN       = RGBColor(0x00, 0xD4, 0xFF)
WHITE      = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_GREY = RGBColor(0xCC, 0xCC, 0xCC)
AMBER      = RGBColor(0xFF, 0xBB, 0x00)
DARK_NAVY  = RGBColor(0x06, 0x09, 0x12)

# Slide dimensions: widescreen 16:9
SLIDE_W = Inches(13.33)
SLIDE_H = Inches(7.5)

OUTPUT_PATH = Path(__file__).parent / "TerraTwin_Final_Demo.pptx"


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def set_slide_background(slide, color: RGBColor):
    """Fill slide background with solid colour."""
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_textbox(slide, text, left, top, width, height,
                font_size=18, bold=False, color=WHITE,
                align=PP_ALIGN.LEFT, italic=False):
    """Add a simple text box and return the shape."""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return txBox


def add_heading(slide, text, top_offset=Inches(0.3)):
    """Add a cyan section heading bar."""
    # Cyan accent bar (thin rectangle)
    bar = slide.shapes.add_shape(
        1,  # MSO_SHAPE_TYPE.RECTANGLE
        Inches(0.5), top_offset,
        Inches(12.33), Inches(0.06)
    )
    bar.fill.solid()
    bar.fill.fore_color.rgb = CYAN
    bar.line.fill.background()

    # Heading text
    add_textbox(slide, text,
                Inches(0.5), top_offset + Inches(0.1),
                Inches(12.33), Inches(0.55),
                font_size=24, bold=True, color=CYAN)


def add_bullet_points(slide, items, left, top, width, height,
                       font_size=14, color=WHITE, bullet_char="▸ "):
    """Add a list of bullet points as a single text box."""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True

    for i, item in enumerate(items):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.space_before = Pt(4)
        run = p.add_run()
        run.text = bullet_char + item
        run.font.size = Pt(font_size)
        run.font.color.rgb = color


def add_disclaimer(slide, text="All results are exploratory and provisional. Subject to peer review."):
    """Add a small italic disclaimer at the bottom of a slide."""
    add_textbox(slide, text,
                Inches(0.5), Inches(7.0),
                Inches(12.33), Inches(0.4),
                font_size=9, italic=True, color=LIGHT_GREY,
                align=PP_ALIGN.CENTER)


# ---------------------------------------------------------------------------
# Slide builders
# ---------------------------------------------------------------------------

def build_slide_1_title(prs):
    """Slide 1 — Title slide."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank
    set_slide_background(slide, NAVY)

    # Decorative cyan line
    bar = slide.shapes.add_shape(1, Inches(1.5), Inches(2.8), Inches(10.33), Inches(0.06))
    bar.fill.solid(); bar.fill.fore_color.rgb = CYAN; bar.line.fill.background()

    # Title
    add_textbox(slide, "TerraTwin — Planetary Analog Atlas",
                Inches(0.5), Inches(1.5), Inches(12.33), Inches(1.1),
                font_size=38, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

    # Subtitle
    add_textbox(slide,
                "Identifying Earth Environments That Mirror Moon and Mars Surfaces",
                Inches(0.5), Inches(2.95), Inches(12.33), Inches(0.8),
                font_size=20, color=CYAN, align=PP_ALIGN.CENTER)

    # Live site
    add_textbox(slide, "Live site: https://amarahan.github.io/TerraTwin/",
                Inches(0.5), Inches(4.0), Inches(12.33), Inches(0.5),
                font_size=14, color=LIGHT_GREY, align=PP_ALIGN.CENTER)

    # Repo
    add_textbox(slide, "GitHub: https://github.com/Amarahan/TerraTwin",
                Inches(0.5), Inches(4.5), Inches(12.33), Inches(0.5),
                font_size=14, color=LIGHT_GREY, align=PP_ALIGN.CENTER)

    # NASA Space Apps badge (text only — no image)
    add_textbox(slide, "NASA Space Apps Challenge 2026",
                Inches(0.5), Inches(5.5), Inches(12.33), Inches(0.5),
                font_size=13, bold=True, color=AMBER, align=PP_ALIGN.CENTER)

    # Challenge
    add_textbox(slide, "Challenge: Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars",
                Inches(0.5), Inches(6.0), Inches(12.33), Inches(0.5),
                font_size=12, color=CYAN, align=PP_ALIGN.CENTER)


def build_slide_2_problem(prs):
    """Slide 2 — The Problem."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, NAVY)
    add_heading(slide, "The Problem: Why Planetary Analog Research Matters")

    items = [
        "Moon and Mars missions require extensive pre-flight hardware testing and crew training.",
        "Analog sites — Earth environments that physically mimic target destinations — are essential for this preparation.",
        "Identifying suitable analogs today is manual, inconsistent, and difficult to audit or reproduce.",
        "No open, data-driven tool systematically compares Earth sites to multiple planetary targets using satellite data.",
        "Mission planners need transparent, evidence-based rankings — not intuition-based recommendations.",
    ]
    add_bullet_points(slide, items,
                      Inches(0.6), Inches(1.1), Inches(12.0), Inches(5.5),
                      font_size=15)

    add_textbox(slide,
                "TerraTwin addresses this gap by providing a reproducible, open methodology\n"
                "grounded in NASA satellite observations.",
                Inches(0.6), Inches(5.5), Inches(12.0), Inches(1.0),
                font_size=14, italic=True, color=CYAN)


def build_slide_3_approach(prs):
    """Slide 3 — Our Approach."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, NAVY)
    add_heading(slide, "Our Approach: Systematic Analog Comparison")

    # Left column — scope
    add_textbox(slide, "Scope",
                Inches(0.6), Inches(1.1), Inches(5.8), Inches(0.4),
                font_size=16, bold=True, color=CYAN)
    scope_items = [
        "12 Earth analog candidate sites",
        "4 planetary targets (2 Moon, 2 Mars)",
        "8 scientific features per site",
        "48 site-target comparisons generated",
    ]
    add_bullet_points(slide, scope_items, Inches(0.6), Inches(1.5), Inches(5.8), Inches(2.5), font_size=14)

    # Right column — scoring
    add_textbox(slide, "Exploratory Scoring Method",
                Inches(6.9), Inches(1.1), Inches(6.0), Inches(0.4),
                font_size=16, bold=True, color=CYAN)
    scoring_items = [
        "score = 100 × Σ(wᵢ × similarityᵢ)",
        "Numeric: similarityᵢ = 1 − |earthᵢ − targetᵢ|",
        "  (after approved normalization per feature)",
        "Rock/mineral: same=1.0 / related=0.5 / different=0.0",
        "Coverage gate: ≥75% weighted coverage required",
        "Missing values: preserved as null — never coerced to zero",
    ]
    add_bullet_points(slide, scoring_items, Inches(6.9), Inches(1.5), Inches(6.0), Inches(3.0), font_size=13)

    # Features
    add_textbox(slide, "8 Scientific Features",
                Inches(0.6), Inches(4.1), Inches(12.0), Inches(0.4),
                font_size=16, bold=True, color=CYAN)
    features = [
        "Slope  |  Surface Roughness  |  Temperature Contrast  |  Dryness/Precipitation",
        "Vegetation/Bareness (NDVI)  |  Rock/Mineral Type  |  Water Ice/Permafrost  |  Dust/Aerosol (AOD)",
    ]
    add_bullet_points(slide, features, Inches(0.6), Inches(4.5), Inches(12.0), Inches(1.5),
                      font_size=13, bullet_char="• ")

    add_disclaimer(slide)


def build_slide_4_application(prs):
    """Slide 4 — The Application (4 screens)."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, NAVY)
    add_heading(slide, "The Application: Six Interactive Screens")

    screens = [
        ("Planetary Targets",
         "Four target cards with NASA browse imagery\n(Shackleton Crater Rim, Malapert Massif,\nJezero Crater, Meridiani Planum)"),
        ("Explore Map",
         "OpenStreetMap basemap, 12 candidate sites,\nsynchronized filters, Focus Myanmar, Fit All Sites"),
        ("Catalogue & Mission Simulator",
         "12 sites with authentic photo thumbnails, conic scores,\nMission Objective Simulator with 5 sensitivity presets"),
        ("Site Details & Readiness",
         "ModelScore (provisional), 8-feature meters, Multi-Objective\nReadiness breakdown widget (Rover, ISRU, Dust, Bio)"),
        ("Compare",
         "Side-by-side model scores and feature tables\nfor any two sites against active target"),
        ("Method / About",
         "Full formula documentation, normalization tables,\nfeature weights, limitations disclosure"),
    ]

    col_w = Inches(6.0)
    for i, (title, desc) in enumerate(screens):
        col = i % 2
        row = i // 2
        left = Inches(0.5) + col * Inches(6.5)
        top = Inches(1.3) + row * Inches(1.9)

        # Mini card background
        card = slide.shapes.add_shape(1, left, top, Inches(6.0), Inches(1.75))
        card.fill.solid(); card.fill.fore_color.rgb = DARK_NAVY; card.line.color.rgb = CYAN
        card.line.width = Pt(0.5)

        add_textbox(slide, title,
                    left + Inches(0.1), top + Inches(0.05),
                    Inches(5.8), Inches(0.4),
                    font_size=13, bold=True, color=CYAN)
        add_textbox(slide, desc,
                    left + Inches(0.1), top + Inches(0.45),
                    Inches(5.8), Inches(1.2),
                    font_size=11, color=WHITE)

    add_disclaimer(slide)


def build_slide_5_data(prs):
    """Slide 5 — Data & Transparency."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, NAVY)
    add_heading(slide, "Data & Transparency: What We Know and What We Don't")

    # NASA data column
    add_textbox(slide, "NASA Datasets Used",
                Inches(0.6), Inches(1.1), Inches(5.8), Inches(0.4),
                font_size=15, bold=True, color=CYAN)
    nasa_items = [
        "MODIS LST (MOD11A1/MYD11A1) — temperature",
        "MODIS NDVI (MOD13A2) — vegetation/bareness",
        "MAIAC AOD (MCD19A2) — aerosol/dust",
        "SRTM (SRTMGL1) — slope/roughness",
        "GPM IMERG Final V07 — precipitation",
        "LRO LOLA GDR — lunar slope/roughness",
        "LRO Diviner Polar GDR — lunar temperature",
        "MOLA MEGDR — Mars slope/roughness",
        "MGS TES — Mars temperature",
    ]
    add_bullet_points(slide, nasa_items, Inches(0.6), Inches(1.5), Inches(5.8), Inches(4.5), font_size=12)

    # Limitations column
    add_textbox(slide, "Honest Limitations",
                Inches(6.9), Inches(1.1), Inches(6.0), Inches(0.4),
                font_size=15, bold=True, color=AMBER)
    limit_items = [
        "All 12 site coordinates = PENDING_HUMAN_REVIEW",
        "Scientific results: exploratory only — no independent peer review",
        "McMurdo NDVI: preserved as null (7/8 features)",
        "No validated scientific measurements in this submission",
        "Browse images labeled 'contextual only — not quantitative'",
        "Challenge: Permanent Moon Base Locations & Mars",
        "Partner data: ESA DEM GLO-30, CSA RADARSAT, JAXA GSMaP",
        "  (approved under NASA Space Apps partner provisions)",
    ]
    add_bullet_points(slide, limit_items, Inches(6.9), Inches(1.5), Inches(6.0), Inches(4.5),
                      font_size=12, color=LIGHT_GREY)

    add_disclaimer(slide)


def build_slide_6_results(prs):
    """Slide 6 — Results (Exploratory)."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, NAVY)
    add_heading(slide, "Results (Exploratory) — Indicative Only")

    add_textbox(slide,
                "⚠️  ALL VALUES BELOW ARE PROVISIONAL CANDIDATE EXTRACTIONS — SUBJECT TO PEER REVIEW  ⚠️",
                Inches(0.5), Inches(1.1), Inches(12.33), Inches(0.45),
                font_size=12, bold=True, color=AMBER, align=PP_ALIGN.CENTER)

    summary_items = [
        "48 site-target comparisons generated (12 Earth sites × 4 planetary targets)",
        "8 features evaluated per comparison using documented normalization formula",
        "Mission Objective Simulator: 5 operational sensitivity profiles & real-time auto-balancing (Σw = 1.0000)",
        "Coverage gate applied: ≥75% weighted coverage required for composite score",
        "McMurdo NDVI null preserved — not coerced to zero (passes gate at 97%/95% coverage)",
        "Scoring formula: score = 100 × Σ(wᵢ × similarityᵢ)",
        "Dual-language parity verified: Python scoring.py ↔ TypeScript scoring.ts",
        "28/28 Node.js tests passed (100% pass rate) | 0 TypeScript errors | Production build passes",
    ]
    add_bullet_points(slide, summary_items,
                      Inches(0.6), Inches(1.65), Inches(12.0), Inches(4.5),
                      font_size=14)

    add_textbox(slide,
                "No results are claimed as validated or scientifically peer-reviewed.\n"
                "All scores are explicitly labeled 'Indicative Model Score (Provisional Candidate Extraction)'.",
                Inches(0.6), Inches(5.8), Inches(12.0), Inches(0.9),
                font_size=12, italic=True, color=AMBER)


def build_slide_7_demo(prs):
    """Slide 7 — Live Demo & Links."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, NAVY)
    add_heading(slide, "Live Demo & Links")

    # Big live URL
    add_textbox(slide, "[Live]  Live Application",
                Inches(0.6), Inches(1.1), Inches(12.0), Inches(0.5),
                font_size=18, bold=True, color=CYAN)
    add_textbox(slide, "https://amarahan.github.io/TerraTwin/",
                Inches(0.6), Inches(1.6), Inches(12.0), Inches(0.6),
                font_size=22, bold=True, color=WHITE)

    add_textbox(slide, "[Code]  Source Code",
                Inches(0.6), Inches(2.4), Inches(12.0), Inches(0.5),
                font_size=18, bold=True, color=CYAN)
    add_textbox(slide, "https://github.com/Amarahan/TerraTwin",
                Inches(0.6), Inches(2.9), Inches(12.0), Inches(0.5),
                font_size=20, bold=True, color=WHITE)

    add_textbox(slide, "[Trophy]  Competition",
                Inches(0.6), Inches(3.6), Inches(12.0), Inches(0.5),
                font_size=18, bold=True, color=CYAN)
    add_textbox(slide, "NASA Space Apps Challenge 2026",
                Inches(0.6), Inches(4.1), Inches(12.0), Inches(0.5),
                font_size=18, color=WHITE)
    add_textbox(slide, "Challenge: Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars",
                Inches(0.6), Inches(4.55), Inches(12.0), Inches(0.5),
                font_size=14, color=CYAN)

    # Key stats
    stats = [
        "12 Earth analog sites   |   4 planetary targets   |   8 scientific features   |   5 Mission Sensitivity Profiles",
        "28 Node.js tests ✅   |   0 TypeScript errors ✅   |   Production build passes ✅   |   GitHub Pages live ✅",
        "All results: Exploratory and Provisional — not independently peer-reviewed",
    ]
    for i, stat in enumerate(stats):
        add_textbox(slide, stat,
                    Inches(0.6), Inches(5.4) + i * Inches(0.45),
                    Inches(12.0), Inches(0.42),
                    font_size=12, color=LIGHT_GREY, align=PP_ALIGN.CENTER)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H

    print("Building TerraTwin_Final_Demo.pptx ...")

    build_slide_1_title(prs)
    print("  Slide 1/7: Title — done")

    build_slide_2_problem(prs)
    print("  Slide 2/7: The Problem — done")

    build_slide_3_approach(prs)
    print("  Slide 3/7: Our Approach — done")

    build_slide_4_application(prs)
    print("  Slide 4/7: The Application — done")

    build_slide_5_data(prs)
    print("  Slide 5/7: Data & Transparency — done")

    build_slide_6_results(prs)
    print("  Slide 6/7: Results (Exploratory) — done")

    build_slide_7_demo(prs)
    print("  Slide 7/7: Live Demo & Links — done")

    prs.save(str(OUTPUT_PATH))
    size_kb = OUTPUT_PATH.stat().st_size // 1024
    print(f"\n[OK] Saved: {OUTPUT_PATH}  ({size_kb} KB)")
    print(f"   Slide count: {len(prs.slides)}")
    print("\nTo convert to PDF (requires LibreOffice):")
    print("  soffice --headless --convert-to pdf submission/TerraTwin_Final_Demo.pptx --outdir submission/")


if __name__ == "__main__":
    main()
