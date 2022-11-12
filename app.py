import os
import threading

def init():
  # install nodejs
  os.system("wget https://nodejs.org/dist/v16.17.0/node-v16.17.0-linux-x64.tar.xz -O nodejs.tar.xz")
  os.system("tar -xf nodejs.tar.xz")
  os.system("mv ./node-v16.17.0-linux-x64 ./nodejs")
  os.environ["PATH"] += ":" + os.getcwd() + "/nodejs/bin/"

  # run file
  os.system("npm i")
  os.system("node index.js")

threading.Thread(target=init, args=()).start()