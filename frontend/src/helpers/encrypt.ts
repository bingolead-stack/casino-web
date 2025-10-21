// Checking the crypto module
import crypto from "crypto";
const algorithm = "aes-256-cbc"; //Using AES encryption
const key = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? "", "hex");
const iv = Buffer.from(process.env.NEXT_PUBLIC_IV ?? "", "hex");

// Encrypting text
export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

// Decrypting text
export function decrypt(text: string) {
  const encryptedText = Buffer.from(text, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
