"""Development-only, labelled sample content. Never publish as evidence of real projects."""
from app.config import get_settings
from app.db import SessionLocal
from app.content import ContentPayload
from app.models import ContentItem, ContentRevision, utcnow
from sqlalchemy import select

SAMPLES = [
    ("topic", "how-http-works", "How HTTP Actually Works", "Networking", "The invisible request–response cycle behind every webpage you open.", "## A browser and a server\n\nAn HTTP client sends a request for a resource. The server responds with a status code, headers, and potentially a response body.\n\nThis demonstration entry can be replaced with your published visual explainer.", "Request | A browser asks the server for a resource.\nProcess | The server handles the request.\nResponse | The server sends a status and optional data.", "HTTP, Browser, Web"),
    ("topic", "how-dns-works", "How DNS Finds Websites", "Networking", "From a familiar domain name to the IP address your device needs.", "## The internet's directory\n\nDNS maps names to records such as IP addresses. Recursive resolvers can consult authoritative servers when caches do not contain an answer.", "Lookup | Your device checks the available DNS caches.\nResolve | The recursive resolver locates relevant records.\nConnect | The browser connects to the selected server.", "DNS, Internet, Networking"),
    ("topic", "bubble-sort-visualized", "Bubble Sort, Visualized", "Algorithms", "Watch comparisons and swaps turn an unsorted array into an ordered sequence.", "## Compare. Swap. Repeat.\n\nBubble Sort compares adjacent values and swaps those that are out of ascending order. Each complete pass puts one more largest element in its final position.\n\nAverage and worst-case time complexity: **O(n²)**.", "Compare | Inspect two adjacent numbers.\nSwap | Exchange them when the left number is larger.\nRepeat | Continue passes until sorted.", "Sorting, DSA, Algorithms"),
    ("topic", "how-ai-generates-text", "How AI Generates Text", "Artificial Intelligence", "A beginner-friendly journey through training, tokens, attention, and generation.", "## Behind an AI response\n\nA text-generating model learns patterns during training. At inference time, it processes tokens and context, estimates possible next tokens, and repeats selection to create a response. It can still generate inaccuracies.", "Tokenize | Text becomes smaller model tokens.\nProcess | The network uses context and attention.\nPredict | A continuation token is selected.\nRepeat | Tokens accumulate into a response.", "AI, LLM, Tokens"),
    ("project", "city-explorer", "City Explorer", "Web Application", "A travel-discovery platform connecting places, guides, planning and shared experiences.", "## Project outline\n\nExample project listing based on previous development discussions: React interface and FastAPI services, geographic browsing, searchable listings, and collaborative planning.\n\n**Before publication:** replace this illustrative content with a verified case study, screenshots and the actual repository/demo links.", "Discover | Explore places and listings.\nPlan | Organize places and group activities.\nReview | Share and evaluate experiences.", "React, FastAPI, Travel"),
    ("project", "workflo", "WorkFlo", "Productivity Tool", "A task-management experiment focused on clearer workflows and team visibility.", "## Project outline\n\nExample project listing: React-based task boards, drag-and-drop workflows, task statuses, filtering and progress visibility.\n\n**Before publication:** replace with verified implementation details, images, and a real demo/repository link.", "Organize | Group work in structured boards.\nTrack | Follow tasks through status changes.\nImprove | Review progress with visual summaries.", "React, Tasks, Dashboards"),
    ("project", "prismed-lms", "PrismED", "Learning Platform", "A learning-management application with structured educational content.", "## Project outline\n\nIllustrative portfolio listing for a MERN-based learning-management platform. Add a verified description and repository links before making this page public.", "Learn | Browse learning materials.\nProgress | Follow modules and activities.\nManage | Organize educational content.", "MERN, Education, LMS"),
]

def main():
    if get_settings().environment != "development":
        raise SystemExit("Demo seeding is restricted to TC_ENV=development")
    with SessionLocal() as db:
        for kind, slug, title, category, summary, body, steps, tags in SAMPLES:
            if db.scalar(select(ContentItem.id).where(ContentItem.kind == kind, ContentItem.slug == slug)):
                continue
            item = ContentItem(kind=kind, slug=slug, created_at=utcnow(), updated_at=utcnow())
            db.add(item)
            db.flush()
            rev = ContentRevision(item_id=item.id, revision_number=1, title=title, summary=summary, body=body, steps=steps, category=category, tags=tags, sample=True, featured=True)
            db.add(rev)
            db.flush()
            item.published_revision_id = rev.id
        db.commit()
    print("Development sample content created. Every entry is labeled SAMPLE and hidden in production.")

if __name__ == "__main__":
    main()
