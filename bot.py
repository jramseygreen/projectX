from threading import Thread
from webapp.python.controller import Controller


class Bot:
    def __init__(self, username: str, password: str, host: str = "irc.ppy.sh", port: int = "6667",
                  front_end: bool = True):
        self.__username = username
        self.__password = password
        self.__host = host
        self.__port = port
        self.__controller = None

    # setters / getters
    def get_username(self) -> str:
        return self.__username

    def get_password(self) -> str:
        return self.__password

    def set_authentication(self, status: bool):
        self.__authentication = status