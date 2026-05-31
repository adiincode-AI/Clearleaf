import fitz


def extract_pdf_text(path):

    text = ""

    doc = fitz.open(path)

    for page in doc:
        text += page.get_text()

    doc.close()

    return text