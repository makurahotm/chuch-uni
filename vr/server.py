import http.server
import socketserver
import webbrowser
import os
from threading import Timer

PORT = 9008  # 端口号
DIRECTORY = os.path.dirname(os.path.abspath(__file__))  # 使用当前脚本所在目录

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def open_browser():
    # 直接打开index.html页面
    webbrowser.open(f'http://localhost:{PORT}/index.html')

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"VR全景服务器启动在端口 {PORT}")
        print(f"正在打开 http://localhost:{PORT}/index.html")
        print(f"当前工作目录: {DIRECTORY}")
        # 延迟1秒后自动打开浏览器
        Timer(1, open_browser).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n正在关闭服务器...")
            httpd.shutdown()

if __name__ == "__main__":
    start_server()