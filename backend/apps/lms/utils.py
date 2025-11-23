from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
import io

def generate_certificate_pdf(student_name, course_name, date_str, verification_code):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Draw border
    c.setStrokeColorRGB(0.2, 0.2, 0.8)
    c.setLineWidth(5)
    c.rect(0.5*inch, 0.5*inch, width-1*inch, height-1*inch)

    # Title
    c.setFont("Helvetica-Bold", 30)
    c.drawCentredString(width/2, height-2*inch, "Certificate of Completion")

    # Body
    c.setFont("Helvetica", 18)
    c.drawCentredString(width/2, height-3.5*inch, "This is to certify that")
    
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width/2, height-4.5*inch, student_name)

    c.setFont("Helvetica", 18)
    c.drawCentredString(width/2, height-5.5*inch, "has successfully completed the course")

    c.setFont("Helvetica-Bold", 22)
    c.drawCentredString(width/2, height-6.5*inch, course_name)

    # Date and Verification
    c.setFont("Helvetica", 12)
    c.drawString(1*inch, 2*inch, f"Date: {date_str}")
    c.drawString(1*inch, 1.5*inch, f"Verification Code: {verification_code}")

    c.showPage()
    c.save()

    buffer.seek(0)
    return buffer
