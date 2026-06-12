# Gunicorn configuration file
# https://docs.gunicorn.org/en/stable/configure.html

bind = "0.0.0.0:8000"
workers = 3
timeout = 120
accesslog = "-"
errorlog = "-"
loglevel = "info"
