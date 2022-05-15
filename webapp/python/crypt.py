import base64

from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5


# pass in the public key of the client to communicate with
class Crypt:
    def __init__(self, foreign_public_key: str = ""):
        # 1024 means the keysize will be 1024 bits
        key_pair = RSA.generate(1024)
        self.__public_key = key_pair.publickey().exportKey().decode()
        self.__private_key = key_pair.exportKey().decode()
        self.__foreign_public_key = foreign_public_key

    def get_public_key(self) -> str:
        return self.__public_key

    def set_foreign_public_key(self, key: str):
        self.__foreign_public_key = key

    def decrypt(self, message: str) -> str:
        priv_key = RSA.importKey(self.__private_key.encode())
        cipher = PKCS1_v1_5.new(priv_key)
        return cipher.decrypt(base64.b64decode(message.encode()), "dummy text").decode()

    def encrypt(self, message) -> str:
        pub_key = RSA.importKey(self.__foreign_public_key.encode())
        cipher = PKCS1_v1_5.new(pub_key)
        return base64.b64encode(cipher.encrypt(message.encode())).decode()