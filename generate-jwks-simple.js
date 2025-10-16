// Simple JWKS generation - just create an empty JWKS for now
// Convex Auth should handle the actual key management

const jwks = {
  keys: []
};

console.log(JSON.stringify(jwks));
