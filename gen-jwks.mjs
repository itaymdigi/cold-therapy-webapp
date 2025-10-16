import { importPKCS8, exportJWK } from 'jose';
import fs from 'fs';

const privateKeyPem = fs.readFileSync('temp-key.txt', 'utf8');

// Import the private key
const privateKey = await importPKCS8(privateKeyPem, 'RS256');

// Export as JWK
const jwk = await exportJWK(privateKey);

// Create JWKS with public key only
const publicJwk = {
  kty: jwk.kty,
  n: jwk.n,
  e: jwk.e,
  alg: 'RS256',
  use: 'sig',
  kid: 'default'
};

const jwks = {
  keys: [publicJwk]
};

console.log(JSON.stringify(jwks));
