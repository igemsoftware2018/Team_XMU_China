import time
import picamera
import datetime
now = datetime.datetime.now()
with picamera.PiCamera() as camera:
    camera.resolution = (400, 400)
    camera.start_preview()
    time.sleep(2)
    camera.capture('/home/pi/socket/image/image1.jpg')
