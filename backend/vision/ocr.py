/**
 * PERSON 5: RAG, OCR & VISION SPECIALIST
 * 
 * TODOs for ocr.py:
 * 1. Implement OCR to extract text from images and scanned PDFs.
 * 2. You can use EasyOCR or Tesseract. EasyOCR is often better for general text but heavier.
 * 3. Return the extracted text so it can be ingested into the Vector Store or sent to the LLM.
 */

# import easyocr

def extract_text_from_image(image_path: str) -> str:
    """
    Runs OCR on an image and returns the text.
    """
    # reader = easyocr.Reader(['en'])
    # result = reader.readtext(image_path, detail=0)
    # return " ".join(result)
    return "Dummy extracted text from OCR: [Confidential Inspection Report Findings...]"
