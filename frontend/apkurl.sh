#!/bin/bash

output=$(eas build:list --platform android --status finished --non-interactive)

apk_urls=$(echo "$output" | grep -o 'https://expo.dev/artifacts/eas/[^ ]*\.apk')

first_apk_url=$(echo "$apk_urls" | head -n 1)

echo "Last APK URL: $first_apk_url"

# create public folder if doesnt exist
mkdir -p public

# download the apk
wget $first_apk_url

# move the apk to public folder
filename=$(basename -- "$first_apk_url")

mv $filename public/client.apk || true