import sys
import os
from dotenv import load_dotenv

load_dotenv()

if sys.version_info<(2,6,0):
  sys.stderr.write("You need python 2.6 or later to run this script\n")
  exit(1)
else:
  print(sys.version_info)


print(os.environ)