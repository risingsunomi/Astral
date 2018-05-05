#!/bin/bash
set -e
LOGFILE=/var/log/gunicorn/astral.log
LOGDIR=$(dirname $LOGFILE)
NUM_WORKERS=5
TIMEOUT=1200
# user/group to run as
USER=lhx
GROUP=lhx
cd /home/lhx/Projects/astral
test -d $LOGDIR || mkdir -p $LOGDIR
exec /usr/local/bin/gunicorn astral.wsgi --bind 0.0.0.0:8000 -w $NUM_WORKERS \
--user=$USER --group=$GROUP --log-level=debug --timeout $TIMEOUT \
--log-file=$LOGFILE 2>>$LOGFILE
