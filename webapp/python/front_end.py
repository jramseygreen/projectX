from __future__ import annotations

import os
import typing
from websocket_server import WebsocketServer

from webapp.python.controller import Controller
from webapp.python.webserver import WebServer
# typing
if typing.TYPE_CHECKING:
    from bot import Bot


class FrontEnd:
    def __init__(self, bot: Bot, host: str = "localhost", webserver_port: int = 8080, webserver_path: str = "webapp",
                 websocket_port: int = 8081, username: str = "", password: str = ""):
        self.__bot = bot
        self.__host = host
        self.__webserver_port = webserver_port
        self.__webserver_path = webserver_path
        self.__websocket_port = websocket_port
        self.__username = username
        self.__password = password
        self.__controller = None

    def start(self):
        # create web server
        web_server = WebServer(host=self.__host, port=self.__webserver_port, path=self.__webserver_path)
        web_server.run_forever()

        # create websocket server
        websocket_server = WebsocketServer(host=self.__host, port=self.__websocket_port)
        websocket_server.run_forever(threaded=True)

        # set up controller
        self.__controller = Controller(bot=self.__bot, websocket_server=websocket_server,
                                       username=self.__username, password=self.__password)

    def get_controller(self) -> Controller:
        return self.__controller

    # sets the credentials for logging into the front end
    # blank strings == no authentication
    def set_username(self, username: str):
        self.__username = username

    def set_password(self, password: str):
        self.__password = password
