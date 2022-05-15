from http.server import SimpleHTTPRequestHandler
import socketserver
import os
from threading import Thread


class WebServer:
    def __init__(self, host: str = "localhost", port: int = "8080", path: str = "webapp"):
        self.__port = port
        self.__host = host
        self.__path = path
        self.__handler = SimpleHTTPRequestHandler

    def run_forever(self):
        old_dir = os.curdir
        os.chdir(self.__path)
        x = Thread(target=self.__start)
        x.setDaemon(True)
        x.start()
        os.chdir(old_dir)

    def __start(self):
        with socketserver.TCPServer((self.__host, self.__port), self.__handler) as httpd:
            print("Server started at ", self.__host, ":" + str(self.__port))
            httpd.serve_forever()
