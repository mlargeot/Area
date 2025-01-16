#!/bin/bash

output=$(eas build:list --platform android --status finished --non-interactive)

apk_urls=$(echo "$output" | grep -o 'https://expo.dev/artifacts/eas/[^ ]*\.apk')

last_apk_url=$(echo "$apk_urls" | tail -n 1)

echo "Last APK URL: $last_apk_url"

# create public folder if doesnt exist
mkdir -p public

#return success even if curl fails
curl -o public/client.apk $last_apk_url || true