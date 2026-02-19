
import frida
import time
import sys
import fnmatch



test = 'com?' # com.~~

target="com.chvi.pool" # com

device = frida.get_usb_device()

time.sleep(5)

pid = device.spawn([target]) # Spawn
time.sleep(5) #Without it Java.perform silently fails
session = device.attach(pid) # Attach
script = session.create_script(open("dynamic_dex_loading.js").read())
script.load()

print('PID: %d'%pid)
device.resume(pid)

sys.stdin.read()

input()

matching = [process for process in device.enumerate_processes() if fnmatch.fnmatchcase(process.name.lower(), target)]

for i in matching:
    device.kill(i.pid)
