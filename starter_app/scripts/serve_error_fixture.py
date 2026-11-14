"""QA-only production preview: first atlas request fails, second is malformed, third succeeds.
Run after npm run build. No project data is modified. Not included in the browser bundle.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'dist'
class Fixture(SimpleHTTPRequestHandler):
    attempts = 0
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def do_GET(self):
        if self.path.split('?')[0] == '/data/atlas.json':
            Fixture.attempts += 1
            if Fixture.attempts == 1:
                self.send_error(503, 'Intentional QA fixture')
                return
            if Fixture.attempts == 2:
                self.send_response(200)
                self.send_header('Content-Type','application/json')
                self.end_headers()
                self.wfile.write(b'{"schema_version":"invalid-qa-fixture"}')
                return
        super().do_GET()

if __name__ == '__main__':
    print('QA error fixture: http://127.0.0.1:8444 (production dist; no source mutations)', flush=True)
    ThreadingHTTPServer(('127.0.0.1',8444),Fixture).serve_forever()
