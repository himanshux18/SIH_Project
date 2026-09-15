import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# -------------------------------------------------------------
# 1. PPTX GENERATOR (12 Professional Widescreen Slides)
# -------------------------------------------------------------

def build_presentation(output_path="d:\\SIH_Project\\InfraRisk_Monitor_Presentation.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors
    C_NAVY = RGBColor(15, 23, 42)      # #0f172a
    C_BLUE = RGBColor(37, 99, 235)     # #2563eb
    C_LIGHT_BG = RGBColor(248, 250, 252) # #f8fafc
    C_WHITE = RGBColor(255, 255, 255)
    C_GRAY_TEXT = RGBColor(100, 116, 139)
    C_DARK_TEXT = RGBColor(30, 41, 59)
    C_BORDER = RGBColor(226, 232, 240)
    C_RED = RGBColor(220, 38, 38)
    C_GREEN = RGBColor(22, 163, 74)
    C_AMBER = RGBColor(217, 119, 6)

    def set_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, title, category="INFRARISK MONITOR"):
        # Category label
        tb_cat = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.7), Inches(0.35))
        tf_cat = tb_cat.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = C_BLUE

        # Title
        tb_t = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.6))
        tf_t = tb_t.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = C_NAVY

    def add_card(slide, left, top, width, height, bg_color=C_WHITE, border_color=C_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
        return card

    # ==================== SLIDE 1: TITLE SLIDE ====================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1, C_NAVY)

    tb1 = s1.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(11.0), Inches(3.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p1 = tf1.paragraphs[0]
    p1.text = "InfraRisk Monitor"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = C_WHITE

    p2 = tf1.add_paragraph()
    p2.text = "AI-Powered Early-Warning & Capital Overrun Intelligence Platform"
    p2.font.size = Pt(22)
    p2.font.color.rgb = RGBColor(147, 197, 253) # light blue
    p2.space_before = Pt(10)

    p3 = tf1.add_paragraph()
    p3.text = "Smart India Hackathon | Predictive Governance for Centrally-Sponsored Infrastructure"
    p3.font.size = Pt(14)
    p3.font.color.rgb = RGBColor(203, 213, 225)
    p3.space_before = Pt(24)

    p4 = tf1.add_paragraph()
    p4.text = "Dual-ML Pipeline • Real-Time What-if Simulation • PAIMANA & CAG Calibrated • Dynamic Rules Engine"
    p4.font.size = Pt(12)
    p4.font.color.rgb = RGBColor(148, 163, 184)
    p4.space_before = Pt(12)

    # ==================== SLIDE 2: THE PROBLEM & MOTIVATION ====================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2, C_LIGHT_BG)
    add_header(s2, "Executive Context: The Infrastructure Overrun Challenge")

    # Card 1: The Problem
    add_card(s2, 0.8, 1.5, 3.6, 5.2)
    tb = s2.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(3.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "The Ground Reality"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_RED

    bullets_p1 = [
        "40%+ of central infrastructure projects face severe time or cost overruns.",
        "Average cost escalation exceeds 20% of original budget estimates.",
        "Milestone delays cascade into multi-year economic bottlenecks.",
        "Manual reporting creates a 60–90 day information blackout.",
        "Traditional audits only detect failures retrospectively after money is spent."
    ]
    for b in bullets_p1:
        p = tf.add_paragraph()
        p.text = f"• {b}"
        p.font.size = Pt(12)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(8)

    # Card 2: The Core Root Cause
    add_card(s2, 4.8, 1.5, 3.6, 5.2)
    tb = s2.shapes.add_textbox(Inches(5.0), Inches(1.7), Inches(3.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "The Leading Indicator"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    bullets_p2 = [
        "Physical Progress Lag is the single greatest predictor of cost escalation.",
        "When elapsed duration significantly outpaces ground progress, contractors accelerate claims.",
        "Disparity between fund utilization and physical assets built flags financial leakage.",
        "Statutory land acquisition delays trigger exponential contractor idling compensation."
    ]
    for b in bullets_p2:
        p = tf.add_paragraph()
        p.text = f"• {b}"
        p.font.size = Pt(12)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(8)

    # Card 3: Our Solution
    add_card(s2, 8.8, 1.5, 3.7, 5.2)
    tb = s2.shapes.add_textbox(Inches(9.0), Inches(1.7), Inches(3.3), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "The InfraRisk Solution"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_GREEN

    bullets_p3 = [
        "Predictive AI early warnings 6–12 months ahead of project commissioning.",
        "Dual Machine Learning models trained on calibrated PAIMANA audit data.",
        "Live What-if Simulator testing policy and funding intervention scenarios.",
        "Transparent Explainable AI (XAI) feature importance drivers.",
        "Automated PDF audit reports & dynamic rule-based alerting."
    ]
    for b in bullets_p3:
        p = tf.add_paragraph()
        p.text = f"• {b}"
        p.font.size = Pt(12)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(8)

    # ==================== SLIDE 3: SYSTEM ARCHITECTURE & TECH STACK ====================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3, C_LIGHT_BG)
    add_header(s3, "High-Performance Full-Stack Architecture")

    # 4 horizontal architecture layers
    layers = [
        ("1. Presentation Layer (Next.js 14 & React 18)", [
            "Next.js App Router with TypeScript & Tailwind CSS.",
            "Recharts visualization engine: Step charts, multi-axis time-series, and horizontal bar charts.",
            "Print-optimized CSS for executive PDF audit report generation.",
            "RoleContext managing instant Admin / Viewer security mode switching."
        ], C_BLUE),
        ("2. Application & API Layer (FastAPI & Python 3.12)", [
            "High-throughput asynchronous ASGI microservice via Uvicorn.",
            "Strict Pydantic v2 schemas for request validation and data contracts.",
            "FastAPI CORS middleware supporting secure client-server synchronization.",
            "Dedicated REST routers: /projects, /alerts, /upload, /comparison, /chat."
        ], C_NAVY),
        ("3. Machine Learning & Analytics Engine (scikit-learn)", [
            "Gradient Boosting Classifier for High / Medium / Low risk classification (87.5% accuracy).",
            "Gradient Boosting Regressor for cost overrun % forecasting (MAE: 4.60%).",
            "Explainable AI feature weight extractor ranking ground risk contributors.",
            "Real-time simulation engine generating instant prediction responses."
        ], C_AMBER),
        ("4. Data Store & Governance Layer (PAIMANA Calibrated)", [
            "800 national infrastructure packages across 5 sectors (Roads, Rail, Power, Urban, Irrigation).",
            "Automatic ratio-to-percentage scaling and data quality compliance auditor.",
            "Sequential budget revision audit log tracking statutory escalation reasons."
        ], C_GREEN),
    ]

    top_pos = 1.5
    for title, points, color in layers:
        add_card(s3, 0.8, top_pos, 11.7, 1.25)
        tb = s3.shapes.add_textbox(Inches(1.0), Inches(top_pos + 0.1), Inches(11.3), Inches(1.1))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color

        p_desc = tf.add_paragraph()
        p_desc.text = "   •   ".join(points)
        p_desc.font.size = Pt(10.5)
        p_desc.font.color.rgb = C_DARK_TEXT
        p_desc.space_before = Pt(3)

        top_pos += 1.35

    # ==================== SLIDE 4: ML BENCHMARKS & BASELINE COMPARISON ====================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4, C_LIGHT_BG)
    add_header(s4, "Machine Learning Engine: Proven 28.6% Baseline Improvement")

    # Stat Card 1
    add_card(s4, 0.8, 1.5, 3.6, 2.3)
    tb = s4.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(3.2), Inches(1.9))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "Risk Classification Accuracy"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_GRAY_TEXT
    p2 = tf.add_paragraph()
    p2.text = "87.5%"
    p2.font.size = Pt(36)
    p2.font.bold = True
    p2.font.color.rgb = C_BLUE
    p3 = tf.add_paragraph()
    p3.text = "Gradient Boosting Classifier (100 estimators, max_depth=4)"
    p3.font.size = Pt(10)
    p3.font.color.rgb = C_DARK_TEXT

    # Stat Card 2
    add_card(s4, 4.8, 1.5, 3.6, 2.3)
    tb = s4.shapes.add_textbox(Inches(5.0), Inches(1.7), Inches(3.2), Inches(1.9))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "AI Regressor Error (MAE)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_GRAY_TEXT
    p2 = tf.add_paragraph()
    p2.text = "4.60%"
    p2.font.size = Pt(36)
    p2.font.bold = True
    p2.font.color.rgb = C_GREEN
    p3 = tf.add_paragraph()
    p3.text = "Mean Absolute Error on unseen test set"
    p3.font.size = Pt(10)
    p3.font.color.rgb = C_DARK_TEXT

    # Stat Card 3
    add_card(s4, 8.8, 1.5, 3.7, 2.3)
    tb = s4.shapes.add_textbox(Inches(9.0), Inches(1.7), Inches(3.3), Inches(1.9))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "Improvement Over Baseline"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_GRAY_TEXT
    p2 = tf.add_paragraph()
    p2.text = "+28.6%"
    p2.font.size = Pt(36)
    p2.font.bold = True
    p2.font.color.rgb = C_AMBER
    p3 = tf.add_paragraph()
    p3.text = "Outperforms standard Statistical Moving Average"
    p3.font.size = Pt(10)
    p3.font.color.rgb = C_DARK_TEXT

    # Comparison Table Card
    add_card(s4, 0.8, 4.1, 11.7, 2.8)
    tb = s4.shapes.add_textbox(Inches(1.1), Inches(4.3), Inches(11.1), Inches(2.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Rigorous Statistical Benchmark Evaluation"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    rows = [
        ("Gradient Boosting (Our AI Engine)", "4.60%", "87.5%", "Captures non-linear interaction between lag and fund gaps", "Best Performance"),
        ("Linear Regression (Statistical Baseline 1)", "4.79%", "N/A", "Fails to capture sudden compounding acceleration in delayed stages", "Moderate"),
        ("Historical Moving Average (Baseline 2)", "6.44%", "N/A", "Purely static average, unresponsive to early physical lags", "Weak Baseline")
    ]
    for model, mae, acc, desc, badge in rows:
        p = tf.add_paragraph()
        p.text = f"•  {model}  |  MAE: {mae}  |  Accuracy: {acc}  |  {desc}"
        p.font.size = Pt(11.5)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(8)

    # ==================== SLIDE 5: SMART TIMELINE & GANTT VIEW ====================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5, C_LIGHT_BG)
    add_header(s5, "Smart Timeline & Schedule Slip Overlay")

    add_card(s5, 0.8, 1.5, 11.7, 5.4)
    tb = s5.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(11.1), Inches(4.9))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Beyond Traditional Static Gantt Charts"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    p_sub = tf.add_paragraph()
    p_sub.text = "Traditional Gantt charts only display pre-planned milestones. InfraRisk Monitor introduces an AI-projected delivery horizon comparing planned completion against actual ground velocity."
    p_sub.font.size = Pt(12)
    p_sub.font.color.rgb = C_GRAY_TEXT
    p_sub.space_before = Pt(4)

    timeline_points = [
        "Sanctioned Start Date: Canonical milestone when project work is officially notified and sanctioned.",
        "Today's Progress Marker: Dynamically plots elapsed duration percentage and compares with physical asset completion.",
        "Target Commissioning Date: The original contractual completion date agreed in the tender document.",
        "AI-Predicted Delivery Horizon: Evaluates current physical construction pace to compute actual commissioning date.",
        "CRITICAL FEATURE — Highlighted Schedule Slip Overlay: A prominent, pulsing red overlay bar visually representing the exact gap (+X months) between target commissioning and AI-projected delivery."
    ]
    for pt in timeline_points:
        p = tf.add_paragraph()
        p.text = f"•  {pt}"
        p.font.size = Pt(13)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(14)

    # ==================== SLIDE 6: REVISED ALLOCATION & MONTHLY TREND ====================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6, C_LIGHT_BG)
    add_header(s6, "Revised Budget Tracking & Monthly Progress Comparison")

    # Left: Revised Allocation
    add_card(s6, 0.8, 1.5, 5.6, 5.4)
    tb = s6.shapes.add_textbox(Inches(1.1), Inches(1.7), Inches(5.0), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Revised Capital Allocation (Money Tracking)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    alloc_points = [
        "Complete budget audit history: Original Sanctioned Cost vs. Latest Approved Budget vs. Escalation %.",
        "Interactive Step-Area Trajectory: Visualizes capital step-ups across sequential revision milestones.",
        "Audit Log of Statutory Causes: Every revision records detailed reasons such as:",
        "   - Scope expansion & flyover interchange additions",
        "   - Statutory land acquisition compensation awards",
        "   - Material index inflation (cement & structural steel)",
        "   - Geological realignment in tunneling stretches"
    ]
    for pt in alloc_points:
        p = tf.add_paragraph()
        p.text = f"• {pt}"
        p.font.size = Pt(12)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(8)

    # Right: Monthly Trend
    add_card(s6, 6.9, 1.5, 5.6, 5.4)
    tb = s6.shapes.add_textbox(Inches(7.2), Inches(1.7), Inches(5.0), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Monthly Progress & Financial Snapshots"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    month_points = [
        "Historical Time-Series: Simulates 8–12 monthly progression milestones per infrastructure package.",
        "Dual-Axis Recharts Engine: Plots Physical Progress %, Fund Utilization %, and Approved Budget (₹ Cr) concurrently.",
        "Ground Divergence Detection: Instantly reveals when fund drawdown accelerates while physical milestones stagnate.",
        "Forensic Audit Ready: Allows project steering committees to identify the exact month when a project deviated from schedule."
    ]
    for pt in month_points:
        p = tf.add_paragraph()
        p.text = f"• {pt}"
        p.font.size = Pt(12)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(8)

    # ==================== SLIDE 7: WHAT-IF RISK SIMULATOR ====================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7, C_LIGHT_BG)
    add_header(s7, "Interactive What-If Risk Simulator")

    add_card(s7, 0.8, 1.5, 11.7, 5.4)
    tb = s7.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(11.1), Inches(4.9))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Real-Time Scenario Testing for Policy & Project Managers"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    p_sub = tf.add_paragraph()
    p_sub.text = "Instead of static dashboards, decision-makers can adjust operational parameters on any project and watch the ML model re-predict risk in real time."
    p_sub.font.size = Pt(12)
    p_sub.font.color.rgb = C_GRAY_TEXT
    p_sub.space_before = Pt(4)

    sim_features = [
        "Interactive Sliders: Instant control over Physical Progress % (0–100%), Fund Utilization % (0–150%), and Elapsed Duration % (10–140%).",
        "Instant Model Inference: Live client-side debounced calls to the backend /api/projects/simulate endpoint.",
        "Dynamic Delta Tracking: Shows the exact reduction or increase in predicted overrun (e.g., 'Δ Overrun: -12.4% vs baseline').",
        "Explainable AI Weights: Real-time bar chart showing how risk driver weights shift as ground progress catches up.",
        "Actionable Recommendations: Automated advice engines suggest whether contractor mobilization or fund pauses are needed."
    ]
    for sf in sim_features:
        p = tf.add_paragraph()
        p.text = f"•  {sf}"
        p.font.size = Pt(13)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(14)

    # ==================== SLIDE 8: DYNAMIC EARLY-WARNING RULES ENGINE ====================
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8, C_LIGHT_BG)
    add_header(s8, "Configurable Early-Warning Rules Engine")

    add_card(s8, 0.8, 1.5, 11.7, 5.4)
    tb = s8.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(11.1), Inches(4.9))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Dynamic Governance: Eliminating Hardcoded Alert Thresholds"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    rules_pts = [
        "Dynamic Evaluation: Alerts are not hardcoded static lists. All 800 projects are dynamically evaluated in real-time against active threshold rules.",
        "Rule 1 — Severe Physical Progress Lag: Flags packages where elapsed duration exceeds physical completion by > 20%.",
        "Rule 2 — Critical Budget Overrun Escalation: Flags projects with cumulative cost overrun exceeding 25% of sanctioned budget.",
        "Rule 3 — Expenditure Ahead of Physical Assets: Flags projects where fund utilization outpaces physical construction by > 15%.",
        "Rule 4 — Extended Timeline Slippage: Flags packages where schedule delay exceeds 8 months beyond planned delivery.",
        "Admin 'Manage Rules' Panel: Authorized administrators can toggle individual rules on/off and edit numerical thresholds with instant live alerts re-evaluation."
    ]
    for rp in rules_pts:
        p = tf.add_paragraph()
        p.text = f"•  {rp}"
        p.font.size = Pt(12.5)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(12)

    # ==================== SLIDE 9: AGENCY ACCOUNTABILITY LEADERBOARD ====================
    s9 = prs.slides.add_slide(blank_layout)
    set_bg(s9, C_LIGHT_BG)
    add_header(s9, "Agency Accountability Leaderboard & Benchmarking")

    add_card(s9, 0.8, 1.5, 11.7, 5.4)
    tb = s9.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(11.1), Inches(4.9))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Ranking Implementing Agencies by Execution Discipline"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    leader_pts = [
        "Cross-Agency Benchmarking: Compares NHAI, Indian Railways, NTPC, Municipal Corporations, State PWD, and CPWD.",
        "Comprehensive Evaluation Metrics: Evaluates average cost overrun %, average schedule delay (months), and high-risk package proportion.",
        "Accountability Grading Scale: Automatically assigns performance grades from Grade A (Low Overrun) to Grade D (Critical Overruns).",
        "Visual Recharts Comparison: Interactive bar chart displaying cost overrun spread across national agencies.",
        "Public & Ministerial Transparency: Empowers central oversight committees to incentivize top-performing agencies and audit underperforming bodies."
    ]
    for lp in leader_pts:
        p = tf.add_paragraph()
        p.text = f"•  {lp}"
        p.font.size = Pt(13)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(14)

    # ==================== SLIDE 10: INGESTION, COMPLIANCE & ROLE ACCESS ====================
    s10 = prs.slides.add_slide(blank_layout)
    set_bg(s10, C_LIGHT_BG)
    add_header(s10, "Data Ingestion, Compliance & Role-Based Access")

    # Left: CSV Upload
    add_card(s10, 0.8, 1.5, 5.6, 5.4)
    tb = s10.shapes.add_textbox(Inches(1.1), Inches(1.7), Inches(5.0), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Functional CSV Ingestion & Staging"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    csv_pts = [
        "Drag & Drop File Upload: Ingests raw tabular project datasets seamlessly.",
        "Automated Normalization: Translates ratio values (0–2) to standard percentages (0–100%).",
        "Pre-Commit Staging Dashboard: Displays rows processed, risk distribution counts, and top at-risk projects before committing.",
        "One-Click Database Merge: 'Add these projects to dashboard' button persists records into central database."
    ]
    for pt in csv_pts:
        p = tf.add_paragraph()
        p.text = f"• {pt}"
        p.font.size = Pt(12)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(10)

    # Right: Compliance & Roles
    add_card(s10, 6.9, 1.5, 5.6, 5.4)
    tb = s10.shapes.add_textbox(Inches(7.2), Inches(1.7), Inches(5.0), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Compliance Scoring & Role Access"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    comp_pts = [
        "Data Freshness Audit: Tracks last_updated_date for each project.",
        "Reporting Overdue Badge: Flags packages with > 60 days of inactivity on Dashboard and Project Explorer.",
        "Client-Side Role Security: Top-navbar toggle between Admin and Viewer modes.",
        "Viewer Mode Restriction: Read-only access to monitoring views, with editing and CSV ingestion locked for non-admins."
    ]
    for pt in comp_pts:
        p = tf.add_paragraph()
        p.text = f"• {pt}"
        p.font.size = Pt(12)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(10)

    # ==================== SLIDE 11: INTELLIGENT AI ASSISTANT & RAG ====================
    s11 = prs.slides.add_slide(blank_layout)
    set_bg(s11, C_LIGHT_BG)
    add_header(s11, "Conversational AI Assistant & Natural Language RAG")

    add_card(s11, 0.8, 1.5, 11.7, 5.4)
    tb = s11.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(11.1), Inches(4.9))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Natural Language Infrastructure Intelligence"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    ai_pts = [
        "Open-Ended Conversational Querying: Users can ask arbitrary, free-form analytical questions rather than choosing static pre-set options.",
        "Head-to-Head Agency Comparisons: 'Compare NHAI vs Indian Railways' produces instant comparative markdown tables.",
        "Portfolio Extreme Discovery: 'Which project has the highest delay?' or 'Most expensive project in Power' extracts exact project records.",
        "Financial & Compliance Summaries: Inquires about total portfolio budget in ₹ Crores, overdue reporting counts, and sector trends.",
        "Hybrid Architecture: Deep in-memory Pandas analytical query engine with zero offline dependency + plug-and-play Google Gemini LLM grounding."
    ]
    for pt in ai_pts:
        p = tf.add_paragraph()
        p.text = f"•  {pt}"
        p.font.size = Pt(13)
        p.font.color.rgb = C_DARK_TEXT
        p.space_before = Pt(14)

    # ==================== SLIDE 12: IMPACT & FUTURE ROADMAP ====================
    s12 = prs.slides.add_slide(blank_layout)
    set_bg(s12, C_NAVY)

    tb = s12.shapes.add_textbox(Inches(1.2), Inches(1.0), Inches(11.0), Inches(5.5))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Strategic National Impact & Future Roadmap"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    impacts = [
        "Capital Conservation: Early intervention on just 5% of at-risk mega projects saves thousands of crores for the national exchequer.",
        "Predictive Rather Than Autopsy: Shifting governance from historical post-mortem audits to proactive real-time mitigation.",
        "Inter-Agency Synergy: Transparent accountability benchmarking eliminates inter-departmental finger-pointing."
    ]
    for imp in impacts:
        p = tf.add_paragraph()
        p.text = f"✓  {imp}"
        p.font.size = Pt(14)
        p.font.color.rgb = RGBColor(147, 197, 253)
        p.space_before = Pt(14)

    p_road = tf.add_paragraph()
    p_road.text = "Future Horizons (V2 Roadmap):"
    p_road.font.size = Pt(16)
    p_road.font.bold = True
    p_road.font.color.rgb = RGBColor(253, 224, 71) # yellow
    p_road.space_before = Pt(22)

    roadmap_items = [
        "Satellite Earth Observation: Integrating Sentinel-2 satellite imagery to verify physical construction progress from orbit.",
        "Monsoon & Weather Impact AI: Integrating live weather APIs to forecast monsoon-driven construction halts.",
        "Direct MoSPI / PFMS API Integration: Automatic live sync with Public Financial Management System portals."
    ]
    for rm in roadmap_items:
        p = tf.add_paragraph()
        p.text = f"   • {rm}"
        p.font.size = Pt(12.5)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_before = Pt(6)

    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")
    return output_path

# -------------------------------------------------------------
# 2. PDF DOCUMENTATION GENERATOR (ReportLab)
# -------------------------------------------------------------

def build_pdf_documentation(output_path="d:\\SIH_Project\\InfraRisk_Monitor_Complete_Documentation.pdf"):
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
    )
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.pdfgen import canvas

    class NumberedCanvas(canvas.Canvas):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self._saved_page_states = []

        def showPage(self):
            self._saved_page_states.append(dict(self.__dict__))
            self._startPage()

        def save(self):
            num_pages = len(self._saved_page_states)
            for state in self._saved_page_states:
                self.__dict__.update(state)
                self.draw_page_decorations(num_pages)
                super().showPage()
            super().save()

        def draw_page_decorations(self, page_count):
            self.saveState()
            self.setFont("Helvetica", 9)
            self.setFillColor(colors.HexColor("#64748b"))
            # Header (pages > 1)
            if self._pageNumber > 1:
                self.drawString(54, 750, "InfraRisk Monitor — Complete Technical & Functional Documentation")
                self.setStrokeColor(colors.HexColor("#e2e8f0"))
                self.setLineWidth(0.5)
                self.line(54, 742, 558, 742)
            # Footer
            self.line(54, 45, 558, 45)
            self.drawString(54, 32, "Smart India Hackathon | Problem SIH26103")
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(558, 32, page_text)
            self.restoreState()

    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=30,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=6
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#2563eb"),
        spaceAfter=15
    )
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#334155"),
        leftIndent=15,
        spaceAfter=3
    )

    story = []

    # Title Banner
    story.append(Paragraph("InfraRisk Monitor", title_style))
    story.append(Paragraph("Comprehensive Project Documentation & Technical Architecture Specification", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2563eb"), spaceAfter=14))

    # Executive Overview
    story.append(Paragraph("1. Executive Summary & Problem Context", h1_style))
    story.append(Paragraph(
        "Centrally-sponsored mega infrastructure projects across India (Roads & Highways, Railways, Power, Urban Infrastructure, and Irrigation) "
        "consistently suffer from severe schedule slippages and cumulative cost escalations. According to CAG and Ministry of Statistics and Programme "
        "Implementation (MoSPI / PAIMANA) audits, over 40% of major projects exceed sanctioned budgets, primarily due to latent physical construction "
        "delays that remain undetected during initial execution stages.",
        body_style
    ))
    story.append(Paragraph(
        "<b>InfraRisk Monitor</b> is an AI-powered predictive governance platform designed to bridge this critical information gap. By evaluating non-linear "
        "interactions between physical construction progress, fund drawdowns, time elapsed, and historical sector patterns, InfraRisk Monitor flags impending "
        "cost and milestone overruns 6 to 12 months in advance.",
        body_style
    ))

    # Architecture & Technology Stack
    story.append(Spacer(1, 8))
    story.append(Paragraph("2. System Architecture & Technical Specifications", h1_style))
    story.append(Paragraph(
        "The system is built on a modern, decoupled client-server architecture engineered for high throughput, strict type safety, and real-time interactive analytics.",
        body_style
    ))

    tech_table_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Technology</b>", body_style), Paragraph("<b>Role / Key Capabilities</b>", body_style)],
        [Paragraph("Frontend Framework", body_style), Paragraph("Next.js 14 (App Router)", body_style), Paragraph("Server and Client React components, optimized production builds", body_style)],
        [Paragraph("UI & Styling", body_style), Paragraph("Tailwind CSS + Lucide", body_style), Paragraph("Clean sans-serif design system, responsive grids, color risk badges", body_style)],
        [Paragraph("Data Visualizations", body_style), Paragraph("Recharts", body_style), Paragraph("Step-charts, dual-axis progression plots, and horizontal bar charts", body_style)],
        [Paragraph("Backend Framework", body_style), Paragraph("FastAPI (Python 3.12)", body_style), Paragraph("Asynchronous REST microservice with Pydantic v2 schemas", body_style)],
        [Paragraph("Machine Learning", body_style), Paragraph("scikit-learn 1.4.2", body_style), Paragraph("Gradient Boosting Classifier (87.5% acc) & Regressor (MAE 4.60%)", body_style)],
        [Paragraph("Data Processing", body_style), Paragraph("Pandas 2.2.2 & NumPy", body_style), Paragraph("In-memory dataset filtering, CSV staging, and dynamic aggregation", body_style)],
        [Paragraph("Conversational AI", body_style), Paragraph("Hybrid RAG Query Engine", body_style), Paragraph("In-memory semantic NLP parser + Google Gemini LLM API connector", body_style)]
    ]
    t_tech = Table(tech_table_data, colWidths=[110, 130, 260])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
    ]))
    story.append(t_tech)

    # Machine Learning Pipeline
    story.append(Spacer(1, 10))
    story.append(Paragraph("3. Machine Learning Methodology & Benchmarks", h1_style))
    story.append(Paragraph(
        "InfraRisk Monitor incorporates a dual-model machine learning architecture calibrated against 800 synthetic infrastructure packages generated with seed 42, "
        "accurately calibrated to historical PAIMANA project distributions.",
        body_style
    ))
    story.append(Paragraph("<b>Model Evaluation Benchmark:</b>", h2_style))

    ml_table_data = [
        [Paragraph("<b>Model Name</b>", body_style), Paragraph("<b>Model Type</b>", body_style), Paragraph("<b>Error (MAE)</b>", body_style), Paragraph("<b>Accuracy</b>", body_style), Paragraph("<b>Performance vs Baseline</b>", body_style)],
        [Paragraph("Gradient Boosting Regressor", body_style), Paragraph("AI Ensemble (100 trees)", body_style), Paragraph("<b>4.60%</b>", body_style), Paragraph("—", body_style), Paragraph("<b>+28.6% Improvement</b>", body_style)],
        [Paragraph("Gradient Boosting Classifier", body_style), Paragraph("AI Risk Categorizer", body_style), Paragraph("—", body_style), Paragraph("<b>87.5%</b>", body_style), Paragraph("High / Medium / Low", body_style)],
        [Paragraph("Linear Regression", body_style), Paragraph("Parametric Baseline", body_style), Paragraph("4.79%", body_style), Paragraph("—", body_style), Paragraph("Underfits late acceleration", body_style)],
        [Paragraph("Statistical Moving Average", body_style), Paragraph("Historical Mean", body_style), Paragraph("6.44%", body_style), Paragraph("—", body_style), Paragraph("Unresponsive to early lags", body_style)]
    ]
    t_ml = Table(ml_table_data, colWidths=[120, 95, 75, 60, 150])
    t_ml.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
    ]))
    story.append(t_ml)

    story.append(PageBreak())

    # Complete Features Description (All 10 Features)
    story.append(Paragraph("4. Feature-by-Feature Technical Specifications", h1_style))
    story.append(Paragraph("Detailed technical specifications and user-facing workflows for all 10 platform modules:", body_style))

    features = [
        ("Feature 1: Functional CSV Ingestion & Pre-Commit Staging", [
            "File Parsing & Header Mapping: Automatically maps varying CSV column aliases ('cost', 'agency', 'elapsed_time') to canonical database schemas.",
            "Ratio-to-Percentage Normalization: Converts ratios (0–2 scale) to standard percentages (0–100%).",
            "Pre-Commit Analytics Preview: Computes progress lag, risk distribution counts (High, Medium, Low), and average cost overrun before saving.",
            "Top At-Risk Project Table: Visual preview of the most vulnerable rows in the uploaded file.",
            "One-Click Database Ingestion: 'Add these projects to dashboard' merges parsed records into the central persistent database."
        ]),
        ("Feature 2: Revised Capital Allocation & Money Tracking", [
            "Hierarchical Financial Structure: Stores original_sanctioned_cost alongside an array of sequential revisions {date, revised_cost, reason}.",
            "Escalation Metrics: Displays original sanctioned cost, latest approved budget, and cumulative percentage escalation.",
            "Trajectory Step-Chart: Recharts AreaChart visualizes capital step-ups over the project lifecycle.",
            "Revision Audit History: Logs official statutory justifications (e.g. land acquisition compensation, material price indexation, scope changes)."
        ]),
        ("Feature 3: Monthly Progress & Budget Comparison View", [
            "Milestone Progression Time-Series: Simulates 8 to 12 monthly snapshots per project {month, revised_cost, physical_progress_pct, fund_utilization_pct}.",
            "Dual-Axis Comparative Chart: Simultaneously plots physical progress % and fund utilization % against approved budget (₹ Cr).",
            "Disparity Diagnostics: Visually exposes early phases where capital disbursements outpace ground asset formation."
        ]),
        ("Feature 4: Smart Timeline & Gantt View with Schedule Slip Overlay", [
            "Milestone Tracking: Displays Sanctioned Start Date, Today's Date Marker, Target Commissioning Date, and AI-Predicted Completion.",
            "Prominent Red Schedule Slip Overlay: Highlights the exact temporal gap (+X months) between contractual delivery and AI pace projections.",
            "Visual Schedule Slip Alerts: Provides an immediate visual indicator of delays, far surpassing static Gantt charts."
        ]),
        ("Feature 5: Configurable Early-Warning Rules Engine", [
            "Elimination of Hardcoded Rules: Projects are dynamically evaluated in real-time against active threshold rules in /api/alerts/.",
            "Active Core Rules: Severe Progress Lag (> 20%), Budget Overrun (> 25%), Expenditure Disparity (> 15%), and Timeline Slippage (> 8 mo).",
            "Admin 'Manage Rules' Panel: Authorized administrators can toggle rules on/off and fine-tune numerical thresholds dynamically."
        ]),
        ("Feature 6: Role-Based Access Control (Admin vs Viewer)", [
            "Client-Side State Security: Persistent RoleContext (Admin | Viewer) stored in localStorage.",
            "Top-Navbar Toggle Pill: One-click interactive switcher to demonstrate access rights to jury members.",
            "Viewer Protection: Non-admins see read-only notifications on /admin and cannot modify rule thresholds."
        ]),
        ("Feature 7: Automatic Project Audit Report Generator (PDF)", [
            "One-Click Printable Summary: Project Detail includes a 'Generate Project Report (PDF)' button.",
            "Print-Optimized Layout: Clean executive report formatting hiding navigation bars and optimizing diagnostic cards for physical/digital PDF print."
        ]),
        ("Feature 8: What-If Risk Simulator", [
            "Interactive Sensitivity Testing: Allows policy-makers to adjust Physical Progress %, Fund Utilization %, and Time Elapsed % via real-time sliders.",
            "Live ML Model Evaluation: Instant asynchronous calls to /api/projects/simulate re-evaluating risk labels and cost overruns.",
            "Delta & Risk Driver Tracking: Shows exact overrun reduction/increase against baseline alongside explainable AI feature weights."
        ]),
        ("Feature 9: Agency Accountability Leaderboard", [
            "Cross-Agency Benchmarking: Ranks NHAI, Indian Railways, NTPC, Municipal Corporations, State PWD, and CPWD.",
            "Accountability Grading: Automatic assignment of performance grades from Grade A (Low Overrun) to Grade D (Critical Overruns).",
            "Visual Overrun Comparison: Recharts bar chart ranking agencies by average cost overrun % and schedule delay."
        ]),
        ("Feature 10: Data Quality & Reporting Compliance Score", [
            "Data Freshness Tracking: Tracks last_updated_date and flags projects inactive for > 60 days.",
            "Dashboard Compliance Stat Card: Summary card displaying 'X projects with overdue reporting'.",
            "Project Explorer Filtering: Dropdown filter for 'Overdue Reporting' with prominent amber warning badges."
        ])
    ]

    for fname, points in features:
        story.append(Paragraph(fname, h2_style))
        for p in points:
            story.append(Paragraph(f"• {p}", bullet_style))
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # Conversational AI Assistant & Future Roadmap
    story.append(Paragraph("5. AI Assistant & Conversational Intelligence", h1_style))
    story.append(Paragraph(
        "InfraRisk Monitor features an advanced Natural Language Processing assistant accessible via the dedicated /chat page and a global floating widget on every screen.",
        body_style
    ))
    story.append(Paragraph("<b>Capabilities:</b>", h2_style))
    ai_bullets = [
        "Agency Performance Benchmarking: 'Which agency is performing the best?' calculates real-time averages and builds ranked tables.",
        "Head-to-Head Comparisons: 'Compare NHAI vs Indian Railways' computes comparative metric matrices across both agencies.",
        "Outlier Discovery: Inquiries regarding highest delay, highest cost overrun, or largest budget pull exact project records.",
        "Project Diagnostics: Asking about any ID (e.g. 'PRJ0015') returns full risk drivers and ground progress lag.",
        "Financial Aggregation: Queries regarding total portfolio sanctioned budget (₹ Crores) and sector distributions.",
        "Hybrid Architecture: Deep in-memory Pandas analytical query engine + Google Gemini LLM API connector."
    ]
    for b in ai_bullets:
        story.append(Paragraph(f"• {b}", bullet_style))

    story.append(Spacer(1, 10))
    story.append(Paragraph("6. Strategic National Impact & V2 Roadmap", h1_style))
    impact_bullets = [
        "Capital Conservation: Early intervention on just 5% of at-risk mega projects saves thousands of crores for the national exchequer.",
        "Predictive Rather than Autopsy: Shifts governance from historical post-mortem audits to proactive real-time mitigation.",
        "Inter-Agency Synergy: Transparent accountability benchmarking eliminates inter-departmental finger-pointing.",
        "V2 Roadmap — Satellite Earth Observation: Verification of ground physical milestones using Sentinel-2 orbital imagery.",
        "V2 Roadmap — Weather & Monsoon AI: Live rain forecast APIs predicting monsoon-driven construction halts.",
        "V2 Roadmap — PFMS / MoSPI Integration: Real-time API integration with the Public Financial Management System."
    ]
    for b in impact_bullets:
        story.append(Paragraph(f"✓ {b}", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF documentation saved successfully to: {output_path}")
    return output_path

if __name__ == "__main__":
    print("Generating PPTX and PDF documents...")
    pptx_path = build_presentation()
    pdf_path = build_pdf_documentation()
    print("All documents generated successfully!")
