import crypto from "crypto";
import util from "util";

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

const keyGenPromisified = util.promisify(crypto.generateKeyPair);
class KeyGen {
  private encoding: BufferEncoding;

  constructor() {
    this.encoding = "base64url";
  }
  async generateKeyPair(): Promise<KeyPair> {
    const { privateKey, publicKey } = await keyGenPromisified("rsa", {
      // todo: this is not the most secure modulus length
      modulusLength: 1024,
      publicKeyEncoding: {
        type: "spki",
        format: "der",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "der",
      },
    });

    return {
      privateKey: privateKey.toString(this.encoding),
      publicKey: publicKey.toString(this.encoding),
    };
  }

  getFileName(privateKey: string) {
    const fileName = crypto
      .createPublicKey({
        key: privateKey,
        format: "der",
        type: "pkcs1",
        encoding: this.encoding,
      })
      .export({
        type: "spki",
        format: "der",
      })
      .toString(this.encoding);

    return fileName;
  }
}

export default new KeyGen();
