"""
Lightweight in-memory vector store using TF-IDF (scikit-learn).
No heavy ML models, no PyTorch — fits in Render free tier (512MB).
"""
import numpy as np
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rank_bm25 import BM25Okapi
from typing import List, Dict, Any, Tuple
import threading

DATA_PATH = Path(__file__).parent.parent / "data" / "visa_policies.json"


class VectorStore:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._initialized = False
        return cls._instance

    def initialize(self, policies: List[Dict]):
        if self._initialized:
            return
        print("🔧 Building TF-IDF index (lightweight, no downloads)...")
        self.policies = policies
        self.corpus_texts = [self._policy_to_text(p) for p in policies]

        # TF-IDF vectorizer — lightweight replacement for sentence-transformers
        self.tfidf = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            max_features=10000,
        )
        self.tfidf_matrix = self.tfidf.fit_transform(self.corpus_texts)

        # BM25 for keyword search
        tokenized = [t.lower().split() for t in self.corpus_texts]
        self.bm25 = BM25Okapi(tokenized)
        self._initialized = True
        print(f"✅ Vector store ready with {len(policies)} policies")

    def _policy_to_text(self, p: Dict) -> str:
        parts = [
            p.get("country", ""),
            p.get("visa_type", ""),
            p.get("category", ""),
            p.get("eligibility_text", ""),
            " ".join(p.get("rejection_risk_factors", [])),
            " ".join(p.get("tags", [])),
            " ".join(p.get("target_profile", [])),
        ]
        req = p.get("requirements", {})
        if req.get("education"):
            parts.append(req["education"])
        return " ".join(filter(None, parts))

    def hybrid_search(
        self, query: str, top_k: int = 5, country_filter: str = None
    ) -> List[Tuple[Dict, float]]:
        if not self._initialized:
            raise RuntimeError("VectorStore not initialized")

        policies = self.policies
        corpus_texts = self.corpus_texts
        tfidf_matrix = self.tfidf_matrix

        if country_filter:
            indices = [i for i, p in enumerate(self.policies)
                      if p.get("country", "").lower() == country_filter.lower()
                      or p.get("country_code", "").lower() == country_filter.lower()]
            if indices:
                policies = [self.policies[i] for i in indices]
                corpus_texts = [self.corpus_texts[i] for i in indices]
                tfidf_matrix = self.tfidf_matrix[indices]

        # TF-IDF cosine similarity (replaces dense neural embeddings)
        q_vec = self.tfidf.transform([query])
        dense_scores = cosine_similarity(q_vec, tfidf_matrix)[0]

        # BM25 keyword search
        tokenized = [t.lower().split() for t in corpus_texts]
        bm25_local = BM25Okapi(tokenized)
        bm25_scores_raw = bm25_local.get_scores(query.lower().split())
        # Normalize BM25 scores to [0, 1]
        max_bm25 = bm25_scores_raw.max() if bm25_scores_raw.max() > 0 else 1
        bm25_scores = bm25_scores_raw / max_bm25

        # Hybrid fusion
        alpha = 0.5  # equal weight — TF-IDF + BM25 complement each other well
        combined = alpha * dense_scores + (1 - alpha) * bm25_scores

        ranked_indices = np.argsort(combined)[::-1][:top_k]
        results = [(policies[i], float(combined[i])) for i in ranked_indices]
        return results

    def get_policy_by_id(self, policy_id: str) -> Any:
        for p in self.policies:
            if p.get("id") == policy_id:
                return p
        return None

    def get_all_countries(self) -> List[str]:
        seen = set()
        countries = []
        for p in self.policies:
            c = p.get("country")
            if c and c not in seen:
                seen.add(c)
                countries.append(c)
        return sorted(countries)

    def get_policies_by_country(self, country: str) -> List[Dict]:
        return [p for p in self.policies
                if p.get("country", "").lower() == country.lower()
                or p.get("country_code", "").lower() == country.lower()]


vector_store = VectorStore()