"""Bound request bodies before Starlette parses multipart files into temporary storage."""
from tempfile import SpooledTemporaryFile

from starlette.responses import JSONResponse, PlainTextResponse

FORM_BODY_LIMIT = 64 * 1024
UPLOAD_BODY_LIMIT = 9 * 1024 * 1024  # 8 MiB image plus multipart fields and headers


def body_limit(path: str) -> int:
    if path.startswith(("/api/admin/content", "/api/admin/media", "/admin/new", "/admin/edit/")):
        return UPLOAD_BODY_LIMIT
    return FORM_BODY_LIMIT


class RequestBodyLimit:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or scope.get("method") not in {"POST", "PUT", "PATCH"}:
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        limit = body_limit(path)
        response = (JSONResponse({"detail": "Request body exceeds the allowed size"}, status_code=413)
                    if path.startswith("/api/") else
                    PlainTextResponse("Request body exceeds the allowed size", status_code=413))
        headers = {key.lower(): value for key, value in scope.get("headers", [])}
        try:
            declared = int(headers.get(b"content-length", b"0"))
        except ValueError:
            declared = 0
        if declared > limit:
            await response(scope, receive, send)
            return

        with SpooledTemporaryFile(max_size=1024 * 1024) as buffered:
            received = 0
            while True:
                message = await receive()
                if message["type"] == "http.disconnect":
                    return
                if message["type"] != "http.request":
                    continue
                chunk = message.get("body", b"")
                received += len(chunk)
                if received > limit:
                    await response(scope, receive, send)
                    return
                buffered.write(chunk)
                if not message.get("more_body", False):
                    break

            buffered.seek(0)

            async def replay_receive():
                chunk = buffered.read(64 * 1024)
                return {"type": "http.request", "body": chunk,
                        "more_body": buffered.tell() < received}

            await self.app(scope, replay_receive, send)
