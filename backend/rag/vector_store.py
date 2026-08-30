import json
import os
from typing import Any

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAG_DATA_DIR = os.path.join(BASE_DIR, "rag_data")

INDEX_PATH = os.path.join(RAG_DATA_DIR, "documents.index")
METADATA_PATH = os.path.join(RAG_DATA_DIR, "metadata.json")

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
EMBEDDING_DIMENSION = _model.get_embedding_dimension()


def _load_index():
    """Load the local FAISS index and metadata."""
    os.makedirs(RAG_DATA_DIR, exist_ok=True)

    if os.path.exists(INDEX_PATH) and os.path.exists(METADATA_PATH):
        index = faiss.read_index(INDEX_PATH)

        with open(METADATA_PATH, "r", encoding="utf-8") as file:
            metadata = json.load(file)

        return index, metadata

    # Normalized embeddings + inner product = cosine similarity.
    index = faiss.IndexFlatIP(EMBEDDING_DIMENSION)

    return index, []


def _save_index(index, metadata):
    """Persist the FAISS index and metadata locally."""
    os.makedirs(RAG_DATA_DIR, exist_ok=True)

    faiss.write_index(index, INDEX_PATH)

    with open(METADATA_PATH, "w", encoding="utf-8") as file:
        json.dump(metadata, file, indent=2, ensure_ascii=False)


def _chunk_text(
    text: str,
    chunk_size: int = 500,
    overlap: int = 50,
) -> list[str]:
    """Split text into overlapping chunks without breaking words unnecessarily."""
    text = " ".join(text.split())

    if not text:
        return []

    words = text.split()
    chunks = []
    current_words = []
    current_length = 0

    for word in words:
        additional_length = len(word) + (1 if current_words else 0)

        if current_words and current_length + additional_length > chunk_size:
            chunks.append(" ".join(current_words))

            overlap_words = []
            overlap_length = 0

            for previous_word in reversed(current_words):
                word_length = len(previous_word) + (
                    1 if overlap_words else 0
                )

                if overlap_length + word_length > overlap:
                    break

                overlap_words.insert(0, previous_word)
                overlap_length += word_length

            current_words = overlap_words
            current_length = overlap_length

        current_words.append(word)
        current_length += additional_length

    if current_words:
        chunks.append(" ".join(current_words))

    return chunks


def ingest_document(text: str, source_metadata: str) -> int:
    """
    Chunk a document, create local embeddings, and store them in FAISS.

    Returns:
        Number of new chunks added.
    """
    if not text or not text.strip():
        raise ValueError("Cannot ingest empty document text.")

    if not source_metadata or not source_metadata.strip():
        raise ValueError("Source metadata cannot be empty.")

    chunks = _chunk_text(text)

    if not chunks:
        return 0

    index, metadata = _load_index()

    existing_chunks = {
        (item["source"], item["text"])
        for item in metadata
    }

    new_chunks = [
        chunk
        for chunk in chunks
        if (source_metadata, chunk) not in existing_chunks
    ]

    if not new_chunks:
        return 0

    embeddings = _model.encode(
        new_chunks,
        convert_to_numpy=True,
        normalize_embeddings=True,
    ).astype("float32")

    index.add(embeddings)

    for chunk in new_chunks:
        metadata.append(
            {
                "text": chunk,
                "source": source_metadata,
            }
        )

    _save_index(index, metadata)

    return len(new_chunks)


def search(query: str, top_k: int = 3) -> list[dict[str, Any]]:
    """
    Search the local FAISS index using semantic similarity.

    Returns:
        Matching chunks sorted from most to least similar.
    """
    if not query or not query.strip():
        return []

    if top_k <= 0:
        return []

    index, metadata = _load_index()

    if index.ntotal == 0:
        return []

    query_embedding = _model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True,
    ).astype("float32")

    k = min(top_k, index.ntotal)

    scores, indices = index.search(query_embedding, k)

    results = []

    for score, index_position in zip(scores[0], indices[0]):
        if index_position < 0 or index_position >= len(metadata):
            continue

        item = metadata[index_position].copy()
        item["score"] = float(score)

        results.append(item)

    return results


def clear_store():
    """Delete the local FAISS index and metadata."""
    if os.path.exists(INDEX_PATH):
        os.remove(INDEX_PATH)

    if os.path.exists(METADATA_PATH):
        os.remove(METADATA_PATH)