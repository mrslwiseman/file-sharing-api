import crypto from 'crypto'

interface KeyPair {
    publicKey: string;
    privateKey: string;
}

class KeyGen {
    private encoding: BufferEncoding;
    private _derivePublicKey: typeof crypto.createPublicKey
    private _generateKeyPair: typeof crypto.generateKeyPair

    constructor(cryptoDep: typeof crypto) {
        this.encoding = "base64url";
        const x = cryptoDep.generateKeyPair
        this._generateKeyPair = cryptoDep.generateKeyPair;
        this._derivePublicKey = cryptoDep.createPublicKey;
    }

    async generateKeyPair(): Promise<KeyPair> {
        const { privateKey, publicKey } = await new Promise<any>((resolve, reject) => this._generateKeyPair("rsa", {
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
        }, (err, puKey, prKey) => {
            if (err) reject(err);
            resolve({ publicKey: puKey, privateKey: prKey })
        }))

        return {
            privateKey: privateKey.toString(this.encoding),
            publicKey: publicKey.toString(this.encoding),
        };
    }

    getFileName(privateKey: string) {
        try {

            const fileName = this
                ._derivePublicKey({
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
        } catch (err) {
            // todo: handle
            return
        }

    }
}

export default KeyGen;
