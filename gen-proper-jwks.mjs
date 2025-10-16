import crypto from 'crypto';
import fs from 'fs';

// Read the private key from environment
const privateKeyPem = fs.readFileSync('raw-key.pem', 'utf8');

// Create a key object from the PEM
const privateKey = crypto.createPrivateKey(privateKeyPem);

// Export the public key
const publicKey = crypto.createPublicKey(privateKey);

// Export as JWK
const jwk = publicKey.export({ format: 'jwk' });

// Create JWKS
const jwks = {
  keys: [
    {
      ...jwk,
      alg: 'RS256',
      use: 'sig',
      kid: 'default'
    }
  ]
};

console.log(JSON.stringify(jwks));
