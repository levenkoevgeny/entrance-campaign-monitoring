#!/bin/sh
ROOT_DIR=/usr/share/nginx/html
# Replace env vars in files served by NGINX
for file in $ROOT_DIR/index.html $ROOT_DIR/assets/*.js*;
do
  sed -i 's|VITE_APP_BACKEND_PROTOCOL|'${VITE_APP_BACKEND_PROTOCOL}'|g' $file
  sed -i 's|VITE_APP_BACKEND_HOST|'${VITE_APP_BACKEND_HOST}'|g' $file
  sed -i 's|VITE_APP_BACKEND_PORT|'${VITE_APP_BACKEND_PORT}'|g' $file

done
exec "$@"