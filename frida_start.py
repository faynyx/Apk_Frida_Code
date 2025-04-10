import frida
import time
import sys
import fnmatch



test = 'com?' # com.~~

target=ori # com

device = frida.get_usb_device()

pid = device.spawn([target]) # Spawn
time.sleep(1) #Without it Java.perform silently fails
session = device.attach(pid) # Attach
script = session.create_script(open("test.js").read())
script.load()

print('PID: %d'%pid)
device.resume(pid)

sys.stdin.read()

#input()

matching = [process for process in device.enumerate_processes() if fnmatch.fnmatchcase(process.name.lower(), target)]

for i in matching:
    device.kill(i.pid)
