import http.server
import socketserver
import webbrowser
from threading import Timer

PORT = 9001
DIRECTORY = "."

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def open_browser():
    webbrowser.open(f'http://localhost:{PORT}')

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"服务器启动在端口 {PORT}")
        print(f"请访问 http://localhost:{PORT}")
        # 延迟1秒后自动打开浏览器
        Timer(1, open_browser).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n正在关闭服务器...")
            httpd.shutdown()

if __name__ == "__main__":
    start_server()