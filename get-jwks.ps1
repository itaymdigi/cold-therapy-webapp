$key = npx convex env get JWT_PRIVATE_KEY --prod
$key | Out-File -FilePath "raw-key.pem" -Encoding utf8 -NoNewline
node gen-proper-jwks.mjs > jwks.json
Get-Content jwks.json -Raw | npx convex env set JWKS --prod
Get-Content jwks.json -Raw | npx convex env set JWKS
