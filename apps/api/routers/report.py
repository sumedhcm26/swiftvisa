from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.schemas import ReportRequest
from io import BytesIO
import json
from datetime import datetime

router = APIRouter()


def generate_pdf(profile: dict, analysis: dict) -> BytesIO:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.colors import HexColor, white, black
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    from reportlab.lib.units import mm
    from reportlab.lib.enums import TA_CENTER, TA_LEFT

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=20*mm, bottomMargin=20*mm,
                            leftMargin=20*mm, rightMargin=20*mm)

    DARK = HexColor("#0f172a")
    PRIMARY = HexColor("#6366f1")
    SUCCESS = HexColor("#10b981")
    DANGER = HexColor("#ef4444")
    WARN = HexColor("#f59e0b")
    MUTED = HexColor("#64748b")
    LIGHT = HexColor("#f8fafc")
    BORDER = HexColor("#e2e8f0")

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("h1", parent=styles["Normal"], fontSize=24, fontName="Helvetica-Bold",
                         textColor=DARK, spaceAfter=4)
    h2 = ParagraphStyle("h2", parent=styles["Normal"], fontSize=14, fontName="Helvetica-Bold",
                         textColor=DARK, spaceBefore=12, spaceAfter=6)
    body = ParagraphStyle("body", parent=styles["Normal"], fontSize=10, textColor=DARK,
                          leading=16, spaceAfter=4)
    muted = ParagraphStyle("muted", parent=styles["Normal"], fontSize=9, textColor=MUTED, spaceAfter=2)
    centered = ParagraphStyle("centered", parent=h1, alignment=TA_CENTER)

    story = []

    # Header
    story.append(Spacer(1, 5*mm))
    story.append(Paragraph("SwiftVisa", centered))
    story.append(Paragraph("AI Immigration Eligibility Report", ParagraphStyle(
        "sub", parent=styles["Normal"], fontSize=12, textColor=MUTED, alignment=TA_CENTER, spaceAfter=2)))
    story.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", ParagraphStyle(
        "date", parent=styles["Normal"], fontSize=9, textColor=MUTED, alignment=TA_CENTER, spaceAfter=8)))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER))
    story.append(Spacer(1, 4*mm))

    # Profile summary
    story.append(Paragraph("Your Profile", h2))
    profile_data = [
        ["Nationality", profile.get("nationality", "")],
        ["Target Country", profile.get("target_country", "")],
        ["Education", f"{profile.get('education_level', '').title()} in {profile.get('field_of_study', '')}"],
        ["Experience", f"{profile.get('work_experience_years', 0)} years"],
        ["Goal", profile.get("goal", "").title()],
        ["English", profile.get("english_proficiency", "").title()],
    ]
    t = Table(profile_data, colWidths=[50*mm, 120*mm])
    t.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("TEXTCOLOR", (0, 0), (0, -1), MUTED),
        ("TEXTCOLOR", (1, 0), (1, -1), DARK),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [LIGHT, white]),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(t)
    story.append(Spacer(1, 4*mm))

    # Top result
    top = analysis.get("top_visa", {})
    if top:
        story.append(Paragraph("Primary Recommendation", h2))
        eligible = top.get("eligible", False)
        confidence = top.get("confidence", 0)
        conf_pct = int(confidence * 100)
        conf_color = SUCCESS if conf_pct >= 70 else (WARN if conf_pct >= 40 else DANGER)

        header_data = [
            [Paragraph(f"<b>{top.get('country', '')} — {top.get('visa_type', '')}</b>", body),
             Paragraph(f"<b>Confidence: {conf_pct}%</b>", ParagraphStyle(
                 "conf", parent=body, textColor=conf_color, alignment=TA_CENTER)),
             Paragraph(f"<b>{'✓ Eligible' if eligible else '✗ Not Eligible'}</b>", ParagraphStyle(
                 "elig", parent=body, textColor=SUCCESS if eligible else DANGER, alignment=TA_CENTER))],
        ]
        ht = Table(header_data, colWidths=[90*mm, 40*mm, 40*mm])
        ht.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
            ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(ht)
        story.append(Spacer(1, 3*mm))

        story.append(Paragraph("Summary", ParagraphStyle("sh2", parent=h2, fontSize=11, spaceBefore=6)))
        story.append(Paragraph(top.get("eligibility_summary", ""), body))

        # Details table
        details = [
            ["Processing Time", f"{top.get('processing_months', 'N/A')} months"],
            ["Estimated Cost", f"~USD {top.get('cost_usd', 'N/A'):,}" if top.get('cost_usd') else "N/A"],
            ["Rejection Risk", top.get("rejection_probability", "N/A")],
        ]
        dt = Table(details, colWidths=[50*mm, 120*mm])
        dt.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("TEXTCOLOR", (0, 0), (0, -1), MUTED),
            ("ROWBACKGROUNDS", (0, 0), (-1, -1), [LIGHT, white]),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(dt)
        story.append(Spacer(1, 3*mm))

        # Requirements met
        matched = top.get("matched_requirements", [])
        if matched:
            story.append(Paragraph("Requirements Met", ParagraphStyle("sh2", parent=h2, fontSize=11, spaceBefore=6)))
            for r in matched:
                story.append(Paragraph(f"✓  {r}", ParagraphStyle(
                    "ok", parent=body, textColor=SUCCESS, leftIndent=10)))

        gaps = top.get("gaps", [])
        if gaps:
            story.append(Paragraph("Gaps / Concerns", ParagraphStyle("sh2", parent=h2, fontSize=11, spaceBefore=6)))
            for g in gaps:
                story.append(Paragraph(f"✗  {g}", ParagraphStyle(
                    "gap", parent=body, textColor=DANGER, leftIndent=10)))

        next_steps = top.get("next_steps", [])
        if next_steps:
            story.append(Paragraph("Action Plan", h2))
            for i, step in enumerate(next_steps, 1):
                story.append(Paragraph(f"{i}.  {step}", body))

        risk_flags = top.get("risk_flags", [])
        if risk_flags:
            story.append(Paragraph("Risk Flags", h2))
            for r in risk_flags:
                story.append(Paragraph(f"⚠  {r}", ParagraphStyle(
                    "risk", parent=body, textColor=WARN, leftIndent=10)))

    # Other options
    others = analysis.get("other_options", [])
    if others:
        story.append(Paragraph("Alternative Options", h2))
        for o in others:
            score = int(o.get("fit_score", 0) * 100)
            story.append(Paragraph(
                f"<b>{o.get('country', '')} — {o.get('visa_type', '')}</b> (fit: {score}%)",
                ParagraphStyle("alt", parent=body, spaceBefore=4)))
            story.append(Paragraph(o.get("one_line", ""), muted))

    # Footer
    story.append(Spacer(1, 8*mm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER))
    story.append(Paragraph(
        "This report is AI-generated and for informational purposes only. "
        "Always consult a registered immigration lawyer for legal advice.",
        ParagraphStyle("disc", parent=styles["Normal"], fontSize=8, textColor=MUTED,
                       alignment=TA_CENTER, spaceBefore=4)))

    doc.build(story)
    buffer.seek(0)
    return buffer


@router.post("")
async def generate_report(request: ReportRequest):
    try:
        pdf_buffer = generate_pdf(request.profile.model_dump(), request.analysis_result)
        filename = f"swiftvisa_report_{request.profile.nationality}_{request.profile.target_country}.pdf"
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))