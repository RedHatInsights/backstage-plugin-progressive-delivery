#!/usr/bin/env sh

fsha=$(sha256sum frontend/backstage-plugin-progressive-delivery-backstage-plugin-progressive-delivery-frontend-v0.1.0.tgz | awk '{print $1}' | xxd -r -p | base64)
bsha=$(sha256sum backend/backstage-plugin-progressive-delivery-backstage-plugin-progressive-delivery-backend-v0.1.0.tgz | awk '{print $1}' | xxd -r -p | base64)

echo "Frontend: sha256-${fsha}"
echo "Backend:  sha256-${bsha}"
