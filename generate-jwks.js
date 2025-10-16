import crypto from 'crypto';
import fs from 'fs';

// Read the private key
const privateKey = fs.readFileSync('temp-key.txt', 'utf8');

// Generate key pair to get the public key
const { publicKey } = crypto.createPublicKey({
  key: privateKey,
  format: 'pem'
});

// Export public key in JWK format
const jwk = publicKey.export({ format: 'jwk' });

// Create JWKS (JSON Web Key Set)
const jwks = {
  keys: [
    {
      ...jwk,
      use: 'sig',
      alg: 'RS256',
      kid: 'default'
    }
  ]
};

console.log(JSON.stringify(jwks));
