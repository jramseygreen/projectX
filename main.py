import time

from bot import Bot
from webapp.python.front_end import FrontEnd


bot = Bot("qqzzy", "test")

# this is the proper stuff, bot class above is nonsense
front_end = FrontEnd(bot)
front_end.start()

while True:
    time.sleep(60)