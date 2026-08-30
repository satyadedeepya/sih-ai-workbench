import os

import easyocr
import pymupdf


# Load the OCR model once when this module is imported.
# gpu=False keeps the implementation compatible with CPU-only machines.
_reader = easyocr.Reader(["en"], gpu=False)


def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from an image using local EasyOCR.

    Args:
        image_path: Path to the image file.

    Returns:
        Extracted text as a single string.
    """
    if not os.path.isfile(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")

    try:
        result = _reader.readtext(image_path, detail=0)
        return " ".join(result).strip()

    except Exception as e:
        raise RuntimeError(
            f"OCR failed for '{image_path}': {e}"
        ) from e


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from a PDF.

    For normal PDFs, embedded text is extracted directly.
    For scanned PDFs, pages are rendered as images and OCR is applied.

    Args:
        pdf_path: Path to the PDF file.

    Returns:
        Extracted text from the complete PDF.
    """
    if not os.path.isfile(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    try:
        document = pymupdf.open(pdf_path)
        extracted_pages = []

        for page_number, page in enumerate(document):
            text = page.get_text().strip()

            # If the page contains normal embedded text,
            # use it directly.
            if text:
                extracted_pages.append(text)
                continue

            # Otherwise, treat the page as a scanned document.
            pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2, 2))
            image_bytes = pixmap.tobytes("png")

            result = _reader.readtext(image_bytes, detail=0)
            ocr_text = " ".join(result).strip()

            if ocr_text:
                extracted_pages.append(ocr_text)

        document.close()

        return "\n\n".join(extracted_pages).strip()

    except Exception as e:
        raise RuntimeError(
            f"PDF extraction failed for '{pdf_path}': {e}"
        ) from e


def extract_text_from_document(file_path: str) -> str:
    """
    Extract text from a supported document.

    Supported formats:
        - PNG
        - JPG/JPEG
        - PDF
        - TXT
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    extension = os.path.splitext(file_path)[1].lower()

    if extension in {".png", ".jpg", ".jpeg"}:
        return extract_text_from_image(file_path)

    if extension == ".pdf":
        return extract_text_from_pdf(file_path)

    if extension == ".txt":
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read().strip()

    raise ValueError(
        f"Unsupported file type: {extension}. "
        "Supported types: .png, .jpg, .jpeg, .pdf, .txt"
    )