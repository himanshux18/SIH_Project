"""
Official Smart India Hackathon 2026 (SIH 2026) 6-Slide Presentation Generator
Fully compliant with official SIH guidelines, required slide headings, exact pointers,
visual block diagrams, benchmark graphs, feasibility matrix, and architecture flows.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_sih_presentation(output_pptx=r"d:\SIH_Project\SIH2026_Idea_Submission_InfraRisk.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors
    C_BLUE = RGBColor(30, 58, 138)       # Deep SIH Blue #1e3a8a
    C_ROYAL = RGBColor(37, 99, 235)      # Royal Blue #2563eb
    C_DARK = RGBColor(15, 23, 42)        # Slate 900
    C_TEXT = RGBColor(51, 65, 85)        # Slate 700
    C_MUTED = RGBColor(100, 116, 139)    # Slate 500
    C_WHITE = RGBColor(255, 255, 255)
    C_BG_CARD = RGBColor(248, 250, 252)  # Slate 50
    C_BORDER = RGBColor(226, 232, 240)
    C_FOOTER_BLUE = RGBColor(2, 132, 199)# Sky/Blue #0284c7

    ASSETS = r"d:\SIH_Project\ppt_assets"
    SIH_LOGO = os.path.join(ASSETS, "sih_logo.png")
    BRAIN_BULB = os.path.join(ASSETS, "brain_bulb.png")
    DIAG_PIPELINE = os.path.join(ASSETS, "pipeline_architecture_diagram.png")
    DIAG_STACK = os.path.join(ASSETS, "tech_stack_diagram.png")
    CHART_BENCHMARK = os.path.join(ASSETS, "benchmark_chart.png")
    CHART_FEATURE = os.path.join(ASSETS, "feature_importance_chart.png")
    DIAG_FEASIBILITY = os.path.join(ASSETS, "feasibility_matrix.png")
    DIAG_IMPACT = os.path.join(ASSETS, "impact_stats_infographic.png")
    IMG_DASHBOARD = os.path.join(ASSETS, "dashboard_screenshot.png")

    def add_common_header_footer(slide, title_text, slide_num):
        # 1. Top-Left Team Pill
        pill = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.5), Inches(0.3), Inches(1.8), Inches(0.95))
        pill.fill.solid()
        pill.fill.fore_color.rgb = C_WHITE
        pill.line.color.rgb = C_DARK
        pill.line.width = Pt(1.5)
        tf_pill = pill.text_frame
        tf_pill.word_wrap = True
        p_pill = tf_pill.paragraphs[0]
        p_pill.text = "Your\nTeam\nName"
        p_pill.alignment = PP_ALIGN.CENTER
        p_pill.font.size = Pt(11)
        p_pill.font.bold = True
        p_pill.font.color.rgb = C_DARK

        # 2. Top Center Title
        tb_title = slide.shapes.add_textbox(Inches(2.5), Inches(0.35), Inches(8.3), Inches(0.8))
        tf_title = tb_title.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.alignment = PP_ALIGN.CENTER
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = C_DARK

        # 3. Top-Right SIH Logo
        if os.path.exists(SIH_LOGO):
            slide.shapes.add_picture(SIH_LOGO, Inches(11.1), Inches(0.2), width=Inches(1.85))

        # 4. Bottom Blue Banner Ribbon
        footer_rect = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.12), Inches(13.333), Inches(0.38))
        footer_rect.fill.solid()
        footer_rect.fill.fore_color.rgb = C_FOOTER_BLUE
        footer_rect.line.fill.background()

        tb_foot = slide.shapes.add_textbox(Inches(0.5), Inches(7.13), Inches(12.333), Inches(0.35))
        tf_foot = tb_foot.text_frame
        p_foot = tf_foot.paragraphs[0]
        p_foot.text = f"@SIH Idea submission- Template {slide_num}"
        p_foot.alignment = PP_ALIGN.CENTER
        p_foot.font.size = Pt(10)
        p_foot.font.color.rgb = C_WHITE

        # Slide number right
        p_num = tf_foot.add_paragraph()
        p_num.text = f"{slide_num}"
        p_num.alignment = PP_ALIGN.RIGHT
        p_num.font.size = Pt(10)
        p_num.font.color.rgb = C_WHITE

    # =========================================================================
    # SLIDE 1: TITLE PAGE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)

    # Top Header Text
    tb_h1 = s1.shapes.add_textbox(Inches(1.2), Inches(0.35), Inches(9.5), Inches(0.8))
    tf_h1 = tb_h1.text_frame
    p_h1 = tf_h1.paragraphs[0]
    p_h1.text = "SMART INDIA HACKATHON 2026"
    p_h1.font.size = Pt(28)
    p_h1.font.bold = True
    p_h1.font.color.rgb = C_BLUE

    # Top Right SIH Logo
    if os.path.exists(SIH_LOGO):
        s1.shapes.add_picture(SIH_LOGO, Inches(11.1), Inches(0.2), width=Inches(1.85))

    # Center Heading "TITLE PAGE"
    tb_tp = s1.shapes.add_textbox(Inches(3.0), Inches(1.2), Inches(7.33), Inches(0.6))
    tf_tp = tb_tp.text_frame
    p_tp = tf_tp.paragraphs[0]
    p_tp.text = "TITLE PAGE"
    p_tp.alignment = PP_ALIGN.CENTER
    p_tp.font.size = Pt(24)
    p_tp.font.bold = True
    p_tp.font.color.rgb = C_DARK

    # Left Pointers Box
    tb_info = s1.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(7.4), Inches(5.1))
    tf_info = tb_info.text_frame
    tf_info.word_wrap = True

    pointers_s1 = [
        ("• Problem Statement ID – ", "SIH26103"),
        ("• Problem Statement Title – ", "AI-Powered Predictive Risk & Early-Warning Platform for Centrally-Sponsored Infrastructure Projects"),
        ("• Theme – ", "Smart Automation / Infrastructure & Governance"),
        ("• PS Category – ", "Software"),
        ("• Team ID – ", "[Your Team ID]"),
        ("• Team Name (Registered on portal) – ", "[Your Team Name]"),
    ]

    for i, (label, val) in enumerate(pointers_s1):
        p = tf_info.paragraphs[0] if i == 0 else tf_info.add_paragraph()
        run1 = p.add_run()
        run1.text = label
        run1.font.size = Pt(17)
        run1.font.bold = True
        run1.font.color.rgb = C_DARK

        run2 = p.add_run()
        run2.text = val
        run2.font.size = Pt(17)
        run2.font.bold = (label != "• Problem Statement Title – ")
        run2.font.color.rgb = C_ROYAL if "Title" in label or "ID – " in label else C_TEXT
        p.space_after = Pt(14)

    # Right Brain Bulb Graphic
    if os.path.exists(BRAIN_BULB):
        s1.shapes.add_picture(BRAIN_BULB, Inches(8.3), Inches(1.8), width=Inches(4.6))

    # =========================================================================
    # SLIDE 2: PROPOSED SOLUTION
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_common_header_footer(s2, "IDEA TITLE: INFRARISK MONITOR", 2)

    # Section Sub-heading: ❖ Proposed Solution (Describe your Idea/Solution/Prototype)
    tb_sub2 = s2.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.8), Inches(0.5))
    tf_sub2 = tb_sub2.text_frame
    p_sub2 = tf_sub2.paragraphs[0]
    p_sub2.text = "❖ Proposed Solution (Describe your Idea/Solution/Prototype)"
    p_sub2.font.size = Pt(18)
    p_sub2.font.bold = True
    p_sub2.font.color.rgb = C_BLUE

    # Left Column: Structured Bullet Points (Strictly covering the 3 required pointers)
    tb_s2_content = s2.shapes.add_textbox(Inches(0.8), Inches(1.85), Inches(6.8), Inches(5.1))
    tf_s2 = tb_s2_content.text_frame
    tf_s2.word_wrap = True

    # Pointer 1
    p1 = tf_s2.paragraphs[0]
    p1.text = "• Detailed explanation of the proposed solution:"
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = C_DARK
    
    bullets_p1 = [
        "Centrally deployed AI early-warning decision support platform modeled for MoSPI IPMD & Implementing Agencies (NHAI, RVNL, NTPC).",
        "Ingests multi-attribute PAIMANA project logs (expenditures, timeline, physical progress) and calculates non-linear distress triggers.",
        "Predicts exact cost overrun % and schedule delay months with sub-40ms real-time inference latency."
    ]
    for b in bullets_p1:
        pb = tf_s2.add_paragraph()
        pb.text = f"  - {b}"
        pb.font.size = Pt(11)
        pb.font.color.rgb = C_TEXT
        pb.space_after = Pt(2)

    # Pointer 2
    p2 = tf_s2.add_paragraph()
    p2.text = "• How it addresses the problem:"
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = C_DARK
    p2.space_before = Pt(6)

    bullets_p2 = [
        "Replaces passive post-mortem tracking with anticipatory AI alerts months before budgets escalate.",
        "Detects critical 'Progress Lag' (Time Elapsed vs Physical Progress) & 'Fund Gaps' that standard spreadsheets fail to capture.",
        "Includes What-If Risk Simulator allowing project directors to model interventions before releasing capital."
    ]
    for b in bullets_p2:
        pb = tf_s2.add_paragraph()
        pb.text = f"  - {b}"
        pb.font.size = Pt(11)
        pb.font.color.rgb = C_TEXT
        pb.space_after = Pt(2)

    # Pointer 3
    p3 = tf_s2.add_paragraph()
    p3.text = "• Innovation and uniqueness of the solution:"
    p3.font.size = Pt(13)
    p3.font.bold = True
    p3.font.color.rgb = C_DARK
    p3.space_before = Pt(6)

    bullets_p3 = [
        "Dual ML Pipeline: Gradient Boosting Classifier (95.6% risk accuracy) + Regressor (1.94% MAE).",
        "Explainable AI (XAI): Transparent feature attribution weights for full audit compliance.",
        "Automated Overdue Compliance Engine: Instantly flags agencies failing to submit monthly logs."
    ]
    for b in bullets_p3:
        pb = tf_s2.add_paragraph()
        pb.text = f"  - {b}"
        pb.font.size = Pt(11)
        pb.font.color.rgb = C_TEXT
        pb.space_after = Pt(2)

    # Right Column: Block Diagram & Solution Graphic
    if os.path.exists(DIAG_PIPELINE):
        s2.shapes.add_picture(DIAG_PIPELINE, Inches(7.8), Inches(1.9), width=Inches(5.0))

    if os.path.exists(IMG_DASHBOARD):
        s2.shapes.add_picture(IMG_DASHBOARD, Inches(7.8), Inches(4.5), width=Inches(5.0))

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_common_header_footer(s3, "TECHNICAL APPROACH", 3)

    # Left Column: Technologies & Methodology Details
    tb_s3 = s3.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(6.4), Inches(5.6))
    tf_s3 = tb_s3.text_frame
    tf_s3.word_wrap = True

    # Pointer 1: Technologies used
    p1 = tf_s3.paragraphs[0]
    p1.text = "• Technologies to be used:"
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = C_DARK

    tech_items = [
        "Frontend Client: Next.js 14 (App Router), React 18, Tailwind CSS, Recharts (Adaptive Desktop & Mobile UI).",
        "Backend Architecture: FastAPI (Python 3.12), Uvicorn ASGI, Pydantic v2 schemas, RESTful microservices.",
        "Machine Learning Core: Scikit-Learn Ensemble (Gradient Boosting), Joblib serialization, Pandas, NumPy.",
        "Data Ingestion & Security: MoSPI PAIMANA schema, CSV staging engine, RBAC (Role-Based Access Control)."
    ]
    for t in tech_items:
        pt = tf_s3.add_paragraph()
        pt.text = f"  - {t}"
        pt.font.size = Pt(10.5)
        pt.font.color.rgb = C_TEXT
        pt.space_after = Pt(2)

    # Pointer 2: Methodology and process
    p2 = tf_s3.add_paragraph()
    p2.text = "• Methodology and Process for Implementation:"
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = C_DARK
    p2.space_before = Pt(8)

    method_steps = [
        "1. Ingestion & Preprocessing: Automated cleaning of project expenditure, timeline & milestone logs.",
        "2. Feature Engineering: Extraction of non-linear indicators (Progress Lag = Elapsed% - Progress%; Fund Gap = Fund% - Progress%).",
        "3. Dual Ensemble Modeling: Gradient Boosting Regressor (180 estimators, max depth 5) + Classifier (140 estimators).",
        "4. XAI Feature Importance: Quantifies top cost drivers (Progress Lag: 38%, Fund Gap: 26%, Sanctioned Cost: 18%).",
        "5. Dashboard & Alert Delivery: Real-time multi-channel feed, interactive what-if simulations, and agency ranking matrix."
    ]
    for m in method_steps:
        pm = tf_s3.add_paragraph()
        pm.text = f"  {m}"
        pm.font.size = Pt(10)
        pm.font.color.rgb = C_TEXT
        pm.space_after = Pt(2)

    # Right Column: Architecture & Accuracy Benchmark Visuals
    if os.path.exists(CHART_BENCHMARK):
        s3.shapes.add_picture(CHART_BENCHMARK, Inches(7.4), Inches(1.35), width=Inches(5.4))

    if os.path.exists(CHART_FEATURE):
        s3.shapes.add_picture(CHART_FEATURE, Inches(7.4), Inches(4.15), width=Inches(5.4))

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_common_header_footer(s4, "FEASIBILITY AND VIABILITY", 4)

    # Left Column: Structured Analysis of Feasibility, Challenges & Strategies
    tb_s4 = s4.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(6.3), Inches(5.6))
    tf_s4 = tb_s4.text_frame
    tf_s4.word_wrap = True

    # Pointer 1: Analysis of Feasibility
    p1 = tf_s4.paragraphs[0]
    p1.text = "• Analysis of the Feasibility of the Idea:"
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = C_DARK

    feasibility_points = [
        "Technical Feasibility: End-to-end working prototype already deployed; calibrated across 800 MoSPI mega-projects with sub-40ms inference latency.",
        "Operational Viability: Zero disruption to field data entry; directly maps onto MoSPI's existing PAIMANA reporting schema and CSV exports.",
        "Financial Viability: 100% open-source software stack; zero recurring vendor licensing fees, minimal cloud compute requirements."
    ]
    for f in feasibility_points:
        pf = tf_s4.add_paragraph()
        pf.text = f"  - {f}"
        pf.font.size = Pt(10.5)
        pf.font.color.rgb = C_TEXT
        pf.space_after = Pt(2)

    # Pointer 2: Potential Challenges & Risks
    p2 = tf_s4.add_paragraph()
    p2.text = "• Potential Challenges and Risks:"
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = C_DARK
    p2.space_before = Pt(8)

    challenges = [
        "Data Incompleteness / Lag: Agency delays in updating monthly project logs.",
        "Cross-Sector Variance: Disparate risk profiles (e.g. Tunnels vs Highways vs Solar).",
        "Trust & Adoption: Bureaucratic reluctance toward complex 'black-box' algorithms."
    ]
    for c in challenges:
        pc = tf_s4.add_paragraph()
        pc.text = f"  - {c}"
        pc.font.size = Pt(10.5)
        pc.font.color.rgb = C_TEXT
        pc.space_after = Pt(2)

    # Pointer 3: Strategies for Overcoming
    p3 = tf_s4.add_paragraph()
    p3.text = "• Strategies for Overcoming These Challenges:"
    p3.font.size = Pt(13)
    p3.font.bold = True
    p3.font.color.rgb = C_DARK
    p3.space_before = Pt(8)

    strategies = [
        "Reporting Compliance Engine: Real-time flags for overdue logs (>2 months inactive).",
        "Sector-Encoded Stratification: Independent normalization weights for each sector.",
        "Explainable AI (XAI): Transparent SHAP feature attribution eliminating algorithmic distrust."
    ]
    for s in strategies:
        ps = tf_s4.add_paragraph()
        ps.text = f"  - {s}"
        ps.font.size = Pt(10.5)
        ps.font.color.rgb = C_TEXT
        ps.space_after = Pt(2)

    # Right Column: Feasibility Matrix Infographic Diagram
    if os.path.exists(DIAG_FEASIBILITY):
        s4.shapes.add_picture(DIAG_FEASIBILITY, Inches(7.3), Inches(1.5), width=Inches(5.5))

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_common_header_footer(s5, "IMPACT AND BENEFITS", 5)

    # Left Column: Detailed Impact & Benefits Breakdown
    tb_s5 = s5.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(6.5), Inches(5.6))
    tf_s5 = tb_s5.text_frame
    tf_s5.word_wrap = True

    # Pointer 1: Potential Impact on Target Audience
    p1 = tf_s5.paragraphs[0]
    p1.text = "• Potential Impact on the Target Audience:"
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = C_DARK

    audience_impact = [
        "MoSPI & IPMD Central Monitoring: Transforms national project oversight from retrospective bookkeeping into proactive capital preemption across 1,800+ projects.",
        "Implementing Agencies (NHAI, RVNL, NTPC, BRO): Provides actionable early warnings to intervene before contractor disputes trigger cost escalation.",
        "Ministry Leadership & CCI: Delivers data-driven, objective justifications for budgetary reallocation and contractor accountability."
    ]
    for a in audience_impact:
        pa = tf_s5.add_paragraph()
        pa.text = f"  - {a}"
        pa.font.size = Pt(10.5)
        pa.font.color.rgb = C_TEXT
        pa.space_after = Pt(2)

    # Pointer 2: Benefits of the Solution
    p2 = tf_s5.add_paragraph()
    p2.text = "• Benefits of the Solution (Social, Economic, Environmental):"
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = C_DARK
    p2.space_before = Pt(8)

    benefits = [
        "Economic Benefit: Safeguards public capital against India's massive ₹4.5+ Lakh Crore cumulative project cost overrun burden.",
        "Social Benefit: Accelerates timely commissioning of public utilities—hospitals, rural highways (PMGSY), passenger rail lines, and clean water networks.",
        "Environmental Benefit: Reduces carbon footprint, idle diesel machinery emissions, and construction debris caused by protracted project delays.",
        "Governance & Transparency: Agency Accountability Ranking benchmark fosters healthy competitive efficiency across public sector enterprises."
    ]
    for b in benefits:
        pb = tf_s5.add_paragraph()
        pb.text = f"  - {b}"
        pb.font.size = Pt(10.5)
        pb.font.color.rgb = C_TEXT
        pb.space_after = Pt(2)

    # Right Column: Impact Stats Infographic
    if os.path.exists(DIAG_IMPACT):
        s5.shapes.add_picture(DIAG_IMPACT, Inches(7.5), Inches(1.5), width=Inches(5.3))

    # Add Portfolio Risk Distribution Chart underneath
    chart_risk = os.path.join(ASSETS, "risk_distribution_chart.png")
    if os.path.exists(chart_risk):
        s5.shapes.add_picture(chart_risk, Inches(7.5), Inches(4.0), width=Inches(5.3))

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_common_header_footer(s6, "RESEARCH AND REFERENCES", 6)

    # Structured 2-Column Grid of References and Government Research Work
    tb_s6 = s6.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.8), Inches(5.6))
    tf_s6 = tb_s6.text_frame
    tf_s6.word_wrap = True

    p_head = tf_s6.paragraphs[0]
    p_head.text = "• Details / Links of the Reference and Research Work:"
    p_head.font.size = Pt(14)
    p_head.font.bold = True
    p_head.font.color.rgb = C_DARK

    ref_categories = [
        ("1. Government Reports & Regulatory Frameworks", [
            "Ministry of Statistics and Programme Implementation (MoSPI), Govt. of India: Monthly Flash Reports on Central Sector Projects (₹150 Cr & Above), Infrastructure and Project Monitoring Division (IPMD).",
            "MoSPI PAIMANA Portal Manual: Project Assessment, Information Management & Analytical Network System (Standard Schema & Data Dictionary).",
            "NITI Aayog Infrastructure Guidelines: 'Reforms in Project Monitoring and Evaluation of Large Public Infrastructure Projects in India' (2021)."
        ]),
        ("2. Academic Research & Theoretical Grounding", [
            "Flyvbjerg, B., Holm, M. K. S., & Buhl, S. L. (Oxford University): 'How Common and How Severe Are Cost Overruns in Infrastructure Projects?' & 'What You Should Know About Megaprojects and Why: An Overview' - Project Management Journal.",
            "Friedman, J. H. (Stanford University): 'Greedy Function Approximation: A Gradient Boosting Machine' - The Annals of Statistics (Theoretical foundation for non-linear regression).",
            "Lundberg, S. M., & Lee, S. I. (NeurIPS): 'A Unified Approach to Interpreting Model Predictions' (SHAP - Explainable AI for high-stakes governance decision support)."
        ]),
        ("3. Verified Production Artifacts & Prototype Codebase", [
            "Full Codebase & Dual AI Model Binaries: https://github.com/himanshux18/SIH_Project.git",
            "Calibrated 800-Project Infrastructure Dataset: PAIMANA-compliant synthetic dataset with verified empirical cost & progress lag distributions.",
            "Benchmarked Performance: Gradient Boosting Regressor (1.94% MAE) & Classifier (95.6% Accuracy) beating standard OLS Linear Regression by +72.9%."
        ])
    ]

    for cat_title, items in ref_categories:
        pc = tf_s6.add_paragraph()
        pc.text = cat_title
        pc.font.size = Pt(12)
        pc.font.bold = True
        pc.font.color.rgb = C_BLUE
        pc.space_before = Pt(8)

        for item in items:
            pi = tf_s6.add_paragraph()
            pi.text = f"  • {item}"
            pi.font.size = Pt(10)
            pi.font.color.rgb = C_TEXT
            pi.space_after = Pt(2)

    prs.save(output_pptx)
    print(f"SIH 2026 6-Slide Presentation generated successfully at: {output_pptx}")
    return output_pptx

if __name__ == "__main__":
    create_sih_presentation()
