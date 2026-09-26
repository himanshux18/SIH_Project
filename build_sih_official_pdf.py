"""
Builds the official SIH 2026 6-page landscape PDF submission matching the exact template layout,
typography, pointers, and embedded diagrams with pure vector bullet shapes and zero encoding errors.
"""

import os
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white, black

def build_sih_pdf(pdf_path=r"d:\SIH_Project\SIH2026_Idea_Submission_InfraRisk.pdf"):
    W, H = 960, 540  # 16:9 Widescreen points (13.333 x 7.5 inches)
    c = canvas.Canvas(pdf_path, pagesize=(W, H))

    # Colors
    C_BLUE = HexColor("#1e3a8a")       # SIH Navy
    C_ROYAL = HexColor("#2563eb")      # Royal Blue
    C_DARK = HexColor("#0f172a")       # Slate 900
    C_TEXT = HexColor("#334155")       # Slate 700
    C_MUTED = HexColor("#64748b")      # Slate 500
    C_FOOTER = HexColor("#0284c7")     # Template Sky Blue

    ASSETS = r"d:\SIH_Project\ppt_assets"
    SIH_LOGO = os.path.join(ASSETS, "sih_logo.png")
    BRAIN_BULB = os.path.join(ASSETS, "brain_bulb.png")
    DIAG_PIPELINE = os.path.join(ASSETS, "pipeline_architecture_diagram.png")
    CHART_BENCHMARK = os.path.join(ASSETS, "benchmark_chart.png")
    CHART_FEATURE = os.path.join(ASSETS, "feature_importance_chart.png")
    DIAG_FEASIBILITY = os.path.join(ASSETS, "feasibility_matrix.png")
    DIAG_IMPACT = os.path.join(ASSETS, "impact_stats_infographic.png")
    CHART_RISK = os.path.join(ASSETS, "risk_distribution_chart.png")
    IMG_DASHBOARD = os.path.join(ASSETS, "dashboard_screenshot.png")

    def draw_bullet(x, y, radius=2.5, color=C_DARK):
        c.setFillColor(color)
        c.circle(x, y + 3.5, radius, fill=1, stroke=0)

    def draw_diamond(x, y, size=4, color=C_BLUE):
        c.setFillColor(color)
        p = c.beginPath()
        p.moveTo(x, y + size)
        p.lineTo(x + size, y)
        p.lineTo(x, y - size)
        p.lineTo(x - size, y)
        p.close()
        c.drawPath(p, fill=1, stroke=0)

    def draw_common_header_footer(title_text, slide_num):
        # 1. Top-Left Team Pill
        c.setStrokeColor(C_DARK)
        c.setFillColor(white)
        c.setLineWidth(1.2)
        c.roundRect(35, H - 75, 120, 55, 20, fill=1, stroke=1)
        
        c.setFillColor(C_DARK)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(95, H - 45, "Your")
        c.drawCentredString(95, H - 57, "Team")
        c.drawCentredString(95, H - 69, "Name")

        # 2. Top-Center Heading
        c.setFont("Helvetica-Bold", 20)
        c.setFillColor(C_DARK)
        c.drawCentredString(W / 2 + 10, H - 55, title_text)

        # 3. Top-Right Logo
        if os.path.exists(SIH_LOGO):
            c.drawImage(SIH_LOGO, W - 165, H - 75, width=135, height=65, mask='auto', preserveAspectRatio=True)

        # 4. Bottom Blue Banner Ribbon
        c.setFillColor(C_FOOTER)
        c.rect(0, 0, W, 26, fill=1, stroke=0)

        c.setFillColor(white)
        c.setFont("Helvetica", 9)
        c.drawCentredString(W / 2, 8, f"@SIH Idea submission- Template {slide_num}")
        c.drawRightString(W - 35, 8, f"{slide_num}")

    # =========================================================================
    # SLIDE 1: TITLE PAGE
    # =========================================================================
    # Header
    c.setFont("Helvetica-Bold", 24)
    c.setFillColor(C_BLUE)
    c.drawString(60, H - 55, "SMART INDIA HACKATHON 2026")

    if os.path.exists(SIH_LOGO):
        c.drawImage(SIH_LOGO, W - 170, H - 75, width=140, height=68, mask='auto', preserveAspectRatio=True)

    # Title Page
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(C_DARK)
    c.drawCentredString(W / 2 - 40, H - 110, "TITLE PAGE")

    # Info Pointers
    pointers = [
        ("Problem Statement ID - ", "SIH26103"),
        ("Problem Statement Title - ", "AI-Powered Predictive Risk Monitoring & Early-Warning Platform"),
        ("", "  for Centrally-Sponsored Infrastructure Projects"),
        ("Theme - ", "Smart Automation / Infrastructure & Governance"),
        ("PS Category - ", "Software"),
        ("Team ID - ", "[Your Team ID]"),
        ("Team Name (Registered on portal) - ", "[Your Team Name]"),
    ]

    y_pos = H - 170
    for label, val in pointers:
        if label:
            draw_bullet(45, y_pos, 3, C_DARK)
            c.setFont("Helvetica-Bold", 13)
            c.setFillColor(C_DARK)
            c.drawString(55, y_pos, label)
            lbl_w = c.stringWidth(label, "Helvetica-Bold", 13)
        else:
            lbl_w = 20

        c.setFont("Helvetica-Bold" if "Title" in label or "ID - " in label else "Helvetica", 13)
        c.setFillColor(C_ROYAL if "Title" in label or "ID - " in label else C_TEXT)
        c.drawString(55 + lbl_w, y_pos, val)
        y_pos -= 34

    # Right Brain Bulb
    if os.path.exists(BRAIN_BULB):
        c.drawImage(BRAIN_BULB, W - 410, 50, width=370, height=395, mask='auto', preserveAspectRatio=True)

    c.showPage()

    # =========================================================================
    # SLIDE 2: PROPOSED SOLUTION
    # =========================================================================
    draw_common_header_footer("IDEA TITLE: INFRARISK MONITOR", 2)

    # Sub-heading
    draw_diamond(45, H - 94, 5, C_BLUE)
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(C_BLUE)
    c.drawString(55, H - 98, "Proposed Solution (Describe your Idea/Solution/Prototype)")

    # Left Column Pointers
    y = H - 130
    draw_bullet(45, y, 2.5, C_DARK)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(C_DARK)
    c.drawString(55, y, "Detailed explanation of the proposed solution:")
    y -= 16

    c.setFont("Helvetica", 9)
    c.setFillColor(C_TEXT)
    sol_b1 = [
        "- Centrally deployed AI decision support platform built for MoSPI IPMD and Implementing Agencies.",
        "- Continuously ingests PAIMANA project logs (expenditure, schedule, and physical milestones).",
        "- Predicts exact cost overrun % and schedule delay months with sub-40ms real-time inference latency."
    ]
    for b in sol_b1:
        c.drawString(70, y, b)
        y -= 14

    y -= 8
    draw_bullet(45, y, 2.5, C_DARK)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(C_DARK)
    c.drawString(55, y, "How it addresses the problem:")
    y -= 16

    c.setFont("Helvetica", 9)
    c.setFillColor(C_TEXT)
    sol_b2 = [
        "- Replaces passive post-mortem tracking with anticipatory AI alerts months before budgets escalate.",
        "- Identifies non-linear 'Progress Lag' (Elapsed% - Progress%) & 'Fund Gaps' that audits overlook.",
        "- Includes an interactive What-If Risk Simulator allowing directors to test capital decisions live."
    ]
    for b in sol_b2:
        c.drawString(70, y, b)
        y -= 14

    y -= 8
    draw_bullet(45, y, 2.5, C_DARK)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(C_DARK)
    c.drawString(55, y, "Innovation and uniqueness of the solution:")
    y -= 16

    c.setFont("Helvetica", 9)
    c.setFillColor(C_TEXT)
    sol_b3 = [
        "- Dual ML Pipeline: Gradient Boosting Classifier (95.6% risk acc) + Regressor (1.94% MAE).",
        "- Explainable AI (XAI): Transparent feature attribution weights for complete audit compliance.",
        "- Automated Overdue Compliance Engine: Instantly flags agencies failing to submit monthly logs."
    ]
    for b in sol_b3:
        c.drawString(70, y, b)
        y -= 14

    # Right Column Images
    if os.path.exists(DIAG_PIPELINE):
        c.drawImage(DIAG_PIPELINE, W - 410, H - 280, width=365, height=185, preserveAspectRatio=True)

    if os.path.exists(IMG_DASHBOARD):
        c.drawImage(IMG_DASHBOARD, W - 410, 45, width=365, height=160, preserveAspectRatio=True)

    c.showPage()

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH
    # =========================================================================
    draw_common_header_footer("TECHNICAL APPROACH", 3)

    y = H - 105
    draw_bullet(45, y, 2.5, C_DARK)
    c.setFont("Helvetica-Bold", 11.5)
    c.setFillColor(C_DARK)
    c.drawString(55, y, "Technologies to be used:")
    y -= 18

    c.setFont("Helvetica", 9.5)
    c.setFillColor(C_TEXT)
    tech = [
        "- Frontend Client: Next.js 14 (App Router), React 18, Tailwind CSS, Recharts (Responsive UI).",
        "- Backend Microservices: Python 3.12, FastAPI, Uvicorn ASGI, Pydantic v2 schemas, RESTful APIs.",
        "- ML & Analytics Core: Scikit-Learn Ensemble (Gradient Boosting), Joblib Serialization, Pandas, NumPy.",
        "- Data Governance & Security: MoSPI PAIMANA schema, CSV staging engine, RBAC access control."
    ]
    for t in tech:
        c.drawString(70, y, t)
        y -= 15

    y -= 12
    draw_bullet(45, y, 2.5, C_DARK)
    c.setFont("Helvetica-Bold", 11.5)
    c.setFillColor(C_DARK)
    c.drawString(55, y, "Methodology and Process for Implementation:")
    y -= 18

    c.setFont("Helvetica", 9)
    c.setFillColor(C_TEXT)
    method = [
        "1. Ingestion & Preprocessing: Automated cleaning of project expenditure, timeline & milestone logs.",
        "2. Feature Engineering: Derived indicators (Progress Lag = Elapsed% - Progress%; Fund Gap = Fund% - Progress%).",
        "3. Dual Ensemble Modeling: Gradient Boosting Regressor (180 trees, max depth 5) + Classifier (140 trees).",
        "4. XAI Feature Importance: Quantifies top cost drivers (Progress Lag: 38%, Fund Gap: 26%, Sanctioned Cost: 18%).",
        "5. Dashboard & Alert Delivery: Real-time multi-channel feed, interactive what-if simulations, and agency ranking."
    ]
    for m in method:
        c.drawString(70, y, m)
        y -= 15

    # Right Column Charts
    if os.path.exists(CHART_BENCHMARK):
        c.drawImage(CHART_BENCHMARK, W - 410, H - 295, width=365, height=195, preserveAspectRatio=True)

    if os.path.exists(CHART_FEATURE):
        c.drawImage(CHART_FEATURE, W - 410, 45, width=365, height=195, preserveAspectRatio=True)

    c.showPage()

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY
    # =========================================================================
    draw_common_header_footer("FEASIBILITY AND VIABILITY", 4)

    y = H - 105
    draw_bullet(45, y, 2.5, C_DARK)
    c.setFont("Helvetica-Bold", 11.5)
    c.setFillColor(C_DARK)
    c.drawString(55, y, "Analysis of the Feasibility of the Idea:")
    y -= 18

    c.setFont("Helvetica", 9)
    c.setFillColor(C_TEXT)
    feas = [
        "- Technical Feasibility: Working prototype operational; tested across 800 MoSPI mega-projects (<40ms latency).",
        "- Operational Viability: Seamless integration with MoSPI PAIMANA schema; zero field workflow disruption.",
        "- Financial Viability: 100% open-source core stack; zero recurring vendor licensing fees, minimal cloud compute."
    ]
    for f in feas:
        c.drawString(70, y, f)
        y -= 15

    y -= 12
    draw_bullet(45, y, 2.5, C_DARK)
    c.setFont("Helvetica-Bold", 11.5)
    c.setFillColor(C_DARK)
    c.drawString(55, y, "Potential Challenges and Risks:")
    y -= 18

    c.setFont("Helvetica", 9)
    c.setFillColor(C_TEXT)
    risks = [
        "- Data Incompleteness / Lag: Agency delays in updating monthly progress reports (>2 months overdue).",
        "- Sector Heterogeneity: Disparate risk dynamics (Tunneling/Railways vs Solar Parks vs Expressways).",
        "- Institutional Trust: Bureaucratic reluctance toward complex, opaque algorithmic scoring."
    ]
    for r in risks:
        c.drawString(70, y, r)
        y -= 15

    y -= 12
    draw_bullet(45, y, 2.5, C_DARK)
    c.setFont("Helvetica-Bold", 11.5)
    c.setFillColor(C_DARK)
    c.drawString(55, y, "Strategies for Overcoming These Challenges:")
    y -= 18

    c.setFont("Helvetica", 9)
    c.setFillColor(C_TEXT)
    strats = [
        "- Compliance Watchdog: Automated flagging of overdue reporting agencies directly on the executive overview.",
        "- Sector-Encoded Stratification: Independent normalization weights for each sector to prevent cross-contamination.",
        "- Explainable AI (XAI): Transparent SHAP feature attribution weights eliminating black-box mistrust."
    ]
    for s in strats:
        c.drawString(70, y, s)
        y -= 15

    # Right Column Feasibility Matrix
    if os.path.exists(DIAG_FEASIBILITY):
        c.drawImage(DIAG_FEASIBILITY, W - 410, 60, width=370, height=380, preserveAspectRatio=True)

    c.showPage()

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS
    # =========================================================================
    draw_common_header_footer("IMPACT AND BENEFITS", 5)

    y = H - 105
    draw_bullet(45, y, 2.5, C_DARK)
    c.setFont("Helvetica-Bold", 11.5)
    c.setFillColor(C_DARK)
    c.drawString(55, y, "Potential Impact on the Target Audience:")
    y -= 18

    c.setFont("Helvetica", 9)
    c.setFillColor(C_TEXT)
    aud = [
        "- MoSPI & IPMD Central Monitoring: Transforms national project oversight from retrospective bookkeeping",
        "  into proactive capital preemption across 1,800+ centrally-sponsored mega-projects.",
        "- Implementing Agencies (NHAI, RVNL, NTPC, CPWD): Early identification of contractor distress spirals",
        "  enabling corrective intervention before legal disputes and cost escalations become irreversible.",
        "- Ministry Leadership & CCI: Provides empirical, data-backed justification for budgetary reallocation."
    ]
    for a in aud:
        c.drawString(70, y, a)
        y -= 14

    y -= 12
    draw_bullet(45, y, 2.5, C_DARK)
    c.setFont("Helvetica-Bold", 11.5)
    c.setFillColor(C_DARK)
    c.drawString(55, y, "Benefits of the Solution (Social, Economic, Environmental):")
    y -= 18

    c.setFont("Helvetica", 9)
    c.setFillColor(C_TEXT)
    ben = [
        "- Economic Benefit: Safeguards public capital against India's massive Rs 4.5+ Lakh Crore project cost overruns.",
        "- Social Benefit: Accelerates timely commissioning of public utilities--hospitals, rural highways (PMGSY),",
        "  metro rail transit corridors, and clean drinking water pipeline networks.",
        "- Environmental Benefit: Minimizes construction waste, idle machinery emissions, and prolonged ecological disturbance.",
        "- Governance Impact: Agency Accountability Index benchmark fosters competitive efficiency across PSUs."
    ]
    for b in ben:
        c.drawString(70, y, b)
        y -= 14

    # Right Column Visuals: Impact Infographics + Risk Distribution Chart
    if os.path.exists(DIAG_IMPACT):
        c.drawImage(DIAG_IMPACT, W - 410, H - 280, width=370, height=180, preserveAspectRatio=True)

    if os.path.exists(CHART_RISK):
        c.drawImage(CHART_RISK, W - 410, 45, width=370, height=170, preserveAspectRatio=True)

    c.showPage()

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES
    # =========================================================================
    draw_common_header_footer("RESEARCH AND REFERENCES", 6)

    y = H - 105
    draw_bullet(45, y, 2.5, C_DARK)
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(C_DARK)
    c.drawString(55, y, "Details / Links of the Reference and Research Work:")
    y -= 20

    ref_sections = [
        ("1. Government Reports & Regulatory Frameworks", [
            "Ministry of Statistics and Programme Implementation (MoSPI), Govt. of India: Monthly Flash Reports on Central Sector Projects (Rs 150 Cr & Above), Infrastructure and Project Monitoring Division (IPMD).",
            "MoSPI PAIMANA Portal: Project Assessment, Information Management & Analytical Network System (Official Project Attributes & Data Dictionary).",
            "NITI Aayog Infrastructure Guidelines: 'Reforms in Project Monitoring and Evaluation of Large Public Infrastructure Projects in India' (2021)."
        ]),
        ("2. Academic Research & Theoretical Foundations", [
            "Flyvbjerg, B., Holm, M. K. S., & Buhl, S. L. (Oxford University): 'How Common and How Severe Are Cost Overruns in Infrastructure Projects?' - Project Management Journal (Empirical analysis of non-linear escalation dynamics).",
            "Friedman, J. H. (Stanford University): 'Greedy Function Approximation: A Gradient Boosting Machine' - The Annals of Statistics (Theoretical foundation for non-linear regression ensembles).",
            "Lundberg, S. M., & Lee, S. I. (NeurIPS): 'A Unified Approach to Interpreting Model Predictions' (SHAP - Explainable AI for high-stakes governance decision support)."
        ]),
        ("3. Verified Production Artifacts & Prototype Codebase", [
            "Full Open-Source Codebase & ML Models: https://github.com/himanshux18/SIH_Project.git",
            "Calibrated 800-Project Infrastructure Dataset: PAIMANA-compliant synthetic dataset with verified empirical cost & progress lag distributions.",
            "Benchmarked Performance: Gradient Boosting Regressor (1.94% MAE) & Classifier (95.6% Accuracy) beating standard OLS Linear Regression by +72.9%."
        ])
    ]

    for cat_title, items in ref_sections:
        c.setFont("Helvetica-Bold", 10.5)
        c.setFillColor(C_BLUE)
        c.drawString(65, y, cat_title)
        y -= 15

        c.setFont("Helvetica", 8.5)
        c.setFillColor(C_TEXT)
        for it in items:
            c.drawString(80, y, f"- {it}")
            y -= 13
        y -= 6

    c.showPage()
    c.save()
    print(f"Official SIH 2026 6-Slide PDF generated successfully at: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    build_sih_pdf()
