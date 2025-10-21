//Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; // Using AES encryption
const key = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? '', 'hex');
const iv = Buffer.from(process.env.NEXT_PUBLIC_IV ?? '', 'hex');

const frontendKey = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? '', 'hex');
const frontendIv = Buffer.from(process.env.NEXT_PUBLIC_IV ?? '', 'hex');

// Encrypting text
export function encrypt(text: string) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

// Decrypting text
export function decrypt(text: string) {
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}


// Encrypting text
export function frontendEncrypt(text: string) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(frontendKey), frontendIv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

// Decrypting text
export function frontendDecrypt(text: string) {
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, frontendKey, frontendIv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
