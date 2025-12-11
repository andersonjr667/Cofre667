const crypto = require('crypto');

// AES-256-GCM helper
// Expects DATA_ENCRYPTION_KEY env var to be base64-encoded 32 bytes

const KEY_ENV = process.env.DATA_ENCRYPTION_KEY;

function isEncryptionEnabled() {
  return !!KEY_ENV;
}

function getKey() {
  if (!KEY_ENV) {
    throw new Error('DATA_ENCRYPTION_KEY is not set');
  }
  const key = Buffer.from(KEY_ENV, 'base64');
  if (key.length !== 32) {
    throw new Error('DATA_ENCRYPTION_KEY must be base64 of 32 bytes (256 bits)');
  }
  return key;
}

function encrypt(plaintext) {
  const key = getKey();
  const iv = crypto.randomBytes(12); // recommended for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // store: iv (12) | tag (16) | ciphertext
  const out = Buffer.concat([iv, tag, ciphertext]);
  return out.toString('base64');
}

function decrypt(b64) {
  const key = getKey();
  const buf = Buffer.from(b64, 'base64');
  if (buf.length < 12 + 16) throw new Error('Encrypted data too short');
  const iv = buf.slice(0, 12);
  const tag = buf.slice(12, 28);
  const ciphertext = buf.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = {
  encrypt,
  decrypt,
  isEncryptionEnabled
};
