import cv2
import sys
print sys.argv
cv2.imwrite("img.jpg", sys.argv[2])
