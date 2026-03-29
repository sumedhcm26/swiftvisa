import json
from pathlib import Path
from services.vector_store import vector_store

DATA_PATH = Path(__file__).parent.parent / "data" / "visa_policies.json"


class PolicyLoader:
    def load_and_index(self):
        with open(DATA_PATH, "r") as f:
            policies = json.load(f)
        vector_store.initialize(policies)
        return policies