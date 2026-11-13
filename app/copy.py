"""One checked-in source for authored interface copy shared with Next.js."""
import json
from .config import ROOT

with (ROOT / "frontend" / "src" / "lib" / "site-copy.json").open(encoding="utf-8") as source:
    COPY = json.load(source)
