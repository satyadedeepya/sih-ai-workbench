import os

from vision.ocr import extract_text_from_document
from rag.vector_store import ingest_document


BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

ORGANIZATION_DOCS_DIR = os.path.join(
    BASE_DIR,
    "organization_docs",
)


def main():

    if not os.path.isdir(
        ORGANIZATION_DOCS_DIR
    ):
        print(
            "Organization documents directory not found:"
        )
        print(
            ORGANIZATION_DOCS_DIR
        )
        return

    files = [
        filename
        for filename in os.listdir(
            ORGANIZATION_DOCS_DIR
        )
        if filename.lower().endswith(".pdf")
    ]

    if not files:

        print(
            "No organization PDFs found."
        )

        return

    print(
        f"Found {len(files)} organization PDF(s)."
    )

    for filename in files:

        filepath = os.path.join(
            ORGANIZATION_DOCS_DIR,
            filename,
        )

        print()
        print(
            f"Ingesting: {filename}"
        )

        try:

            text = extract_text_from_document(
                filepath
            )

            if (
                not text
                or not text.strip()
                or text.startswith("Error:")
            ):

                print(
                    f"Could not extract text from "
                    f"{filename}"
                )

                continue

            chunks = ingest_document(
                text,
                filename,
            )

            print(
                f"Added {chunks} new chunks "
                f"from {filename}"
            )

        except Exception as e:

            print(
                f"Failed to ingest "
                f"{filename}: {e}"
            )

    print()
    print(
        "Organization document ingestion complete."
    )


if __name__ == "__main__":
    main()