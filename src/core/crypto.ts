import { randomBytes, createHash, publicEncrypt, constants, createCipheriv, createDecipheriv } from "crypto";


export class ComBankCypto {
  rss: string;
  sipherKey: string;
  publicKey: string;

  constructor(challenge: string, publicKey: string) {
    this.rss = this.generateRSS(64);
    this.sipherKey = this.generateSipherKey(this.rss, challenge);
    this.publicKey = publicKey;
  }

  encryptedRSS() {
    let pk =
      "-----BEGIN PUBLIC KEY-----\n" +
      this.publicKey +
      "\n" +
      "-----END PUBLIC KEY-----";
    let c = publicEncrypt({
      key: pk,
      padding: constants.RSA_PKCS1_PADDING
    }, Buffer.from(this.rss, 'utf-8'));

    return c.toString("base64");

  }
  encryptPayload(data: any, sipherKey?: string){
    if (!sipherKey){
      sipherKey = this.sipherKey;
    }
    let payload = JSON.stringify(data);
    let cipher = createCipheriv("aes-256-cbc", Buffer.from(sipherKey, 'hex'), randomBytes(16))
    let encrypted = cipher.update(payload, 'utf-8', 'base64');
    encrypted += cipher.final('base64')
    return encrypted
  }

  decryptPayload(ivBase64: string, payload: string, sipherKey?: string ){
    if(!sipherKey){
      sipherKey = this.sipherKey;
    }

    let decipher = createDecipheriv("aes-256-cbc", sipherKey, Buffer.from(ivBase64, "base64"));
    let decrypted = decipher.update(Buffer.from(payload, "base64"), undefined, 'utf-8' )

    decrypted += decipher.final('utf-8')
    return decrypted;
  }
  private generateRSS(b: number): string {
    const bytes = randomBytes(b);
    return this.convertBytesToString(bytes);
  }

  private generateSipherKey(a: string, b: string): string {
    var c = createHash("sha256")
      .update(a + b)
      .digest("hex");
    return c;
  }

  private convertBytesToString(bytes: Buffer): string {
    let result = "";
    for (let i = 0; i < bytes.length; i++) {
      result += String.fromCharCode(bytes[i]);
    }
    return result;
  }


}


