from __future__ import annotations

import json
import typing


# typing
from webapp.python.crypt import Crypt

if typing.TYPE_CHECKING:
    from websocket_server import WebsocketServer
    from bot import Bot


class Controller:
    def __init__(self, bot: Bot, websocket_server: WebsocketServer, username: str = "", password: str = ""):
        self.__bot = bot
        self.__server = websocket_server
        self.__username = username
        self.__password = password
        self.__clients = {}
        self.__crypt = Crypt()
        websocket_server.set_fn_message_received(self.__on_message)
        websocket_server.set_fn_new_client(self.__on_new_client)
        websocket_server.set_fn_client_left(self.__on_client_left)

    def __on_message(self, client: dict, server: WebsocketServer, message: str):
        # decrypt
        if self.__has_public_key(client):
            message = self.__crypt.decrypt(message)
            print(message)

        # get command and payload
        message = json.loads(message)
        command = message["command"].lower()
        payload = message["payload"]

        # process middleware
        middleware = getattr(self, f"_on_{command}", None)
        if middleware and not middleware(client, payload):
            return

        # process callback
        if self.__is_authenticated(client):
            callback = getattr(self.__bot, f"on_{command}", None)
            if callback:
                callback(payload)
        else:
            self.__send_authenticate(client)

    # websocket events
    def __on_new_client(self, client: dict, server: WebsocketServer):
        self.__clients[client["id"]] = {
            "client": client,
            "authenticated": False,
            "public_key": ""
        }
        if not (self.__username or self.__password):
            self.__authenticate(client)

    def __on_client_left(self, client: dict, server: WebsocketServer):
        if self.__is_authenticated(client):
            del self.__clients[client["id"]]

    # private methods
    def __is_authenticated(self, client: dict) -> bool:
        return self.__clients[client["id"]]["authenticated"]

    def __authenticate(self, client: dict):
        self.__clients[client["id"]]["authenticated"] = True

    def __has_public_key(self, client: dict) -> bool:
        if self.__clients[client["id"]]["public_key"]:
            return True
        return False

    def __get_public_key(self, client: dict) -> str:
        return self.__clients[client["id"]]["public_key"]

    def __set_public_key(self, client: dict, key: str):
        self.__clients[client["id"]]["public_key"] = key

    def __send_authenticate(self, client: dict):
        message = {
            "command": "authenticate",
            "payload": {
                "status": not self.__is_authenticated(client),
            }
        }
        self.send_message(client, json.dumps(message))

    # middleware methods
    def _on_login(self, client: dict, payload: dict) -> bool:
        if not (self.__username and self.__password) or (payload["username"], payload["password"]) == (self.__username, self.__password):
            self.__authenticate(client)
            print("here")

        self.__send_authenticate(client)
        return False

    def _on_public_key(self, client: dict, payload: dict) -> bool:
        self.send_message(client, json.dumps({
            "command": "public_key",
            "payload": {
                "public_key": self.__crypt.get_public_key()
            }
        }))
        self.__set_public_key(client, payload["public_key"])
        return False

    # public methods
    def send_message(self, client: dict, message: str):
        if self.__has_public_key(client):
            self.__crypt.set_foreign_public_key(self.__get_public_key(client))
            message = self.__crypt.encrypt(message)
        self.__server.send_message(client, message)

    def send_message_to_all(self, message: str):
        self.__server.send_message_to_all(message)
