import os
import pymupdf
from pypdf import PdfReader


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from a PDF.

    Uses PyMuPDF first because it is fast and preserves
    page-level text reasonably well. Falls back to pypdf.
    """

    if not os.path.isfile(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    extracted_pages = []

    try:
        document = pymupdf.open(pdf_path)

        for page_number, page in enumerate(document, start=1):
            text = page.get_text("text").strip()

            if text:
                extracted_pages.append(
                    f"--- Page {page_number} ---\n{text}"
                )

        document.close()

        if extracted_pages:
            return "\n\n".join(extracted_pages)

    except Exception as e:
        print(f"PyMuPDF extraction failed: {e}")

    try:
        reader = PdfReader(pdf_path)

        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text()

            if text and text.strip():
                extracted_pages.append(
                    f"--- Page {page_number} ---\n{text.strip()}"
                )

        if extracted_pages:
            return "\n\n".join(extracted_pages)

    except Exception as e:
        raise RuntimeError(
            f"PDF extraction failed: {e}"
        )

    return (
        "Error: The PDF was opened successfully, "
        "but no text could be extracted. "
        "This may be a scanned/image-only PDF."
    )


def extract_text_from_image(image_path: str) -> str:
    return (
        "Image OCR is temporarily disabled. "
        "Image processing will be enabled in a later phase."
    )


def extract_text_from_document(file_path: str) -> str:
    """
    Extract text from supported documents.
    """

    if not os.path.isfile(file_path):
        raise FileNotFoundError(
            f"File not found: {file_path}"
        )

    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        return extract_text_from_pdf(file_path)

    if extension in [".png", ".jpg", ".jpeg", ".tiff", ".bmp"]:
        return extract_text_from_image(file_path)

    if extension == ".txt":
        with open(
            file_path,
            "r",
            encoding="utf-8",
            errors="ignore"
        ) as f:
            return f.read()

    raise ValueError(
        "Unsupported file type. "
        "Currently supported: PDF and TXT."
    )
