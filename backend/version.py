import sys
import os
# from dotenv import load_dotenv

# load_dotenv()

print(sys.version_info)
import pip #needed to use the pip functions
from pip._internal.operations.freeze import freeze
for requirement in freeze(local_only=True):
    print(requirement)

# print(os.environ)