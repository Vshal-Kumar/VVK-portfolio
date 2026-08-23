"""
WSGI entrypoint for VVK Portfolio Backend.
Can be used by Gunicorn, uWSGI, Render, Railway, or local WSGI runners.
"""

from app import app

if __name__ == "__main__":
    app.run()
