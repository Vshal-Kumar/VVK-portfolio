# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# PythonAnywhere WSGI configuration file for VVK Portfolio Backend
#
# INSTRUCTIONS:
# 1. Open the "Web" tab on PythonAnywhere.
# 2. Click the link to your WSGI configuration file:
#    /var/www/<your-pythonanywhere-username>_pythonanywhere_com_wsgi.py
# 3. Replace its contents with this template, updating '<your-username>' with your PythonAnywhere username.
# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

import sys
import os
from dotenv import load_dotenv

# Path to the backend directory on PythonAnywhere
# Replace <your-username> with your actual PythonAnywhere account username
username = '<your-username>'
project_home = f'/home/{username}/VVK-portfolio/backend'

if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Load environment variables from backend/.env if present
env_path = os.path.join(project_home, '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

# Import the Flask application instance
from app import app as application  # PythonAnywhere expects 'application'
