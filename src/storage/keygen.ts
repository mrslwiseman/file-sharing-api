import crypto from 'crypto'

interface KeyPair {
    publicKey: string;
    privateKey: string;
}

class KeyGen {
    constructor() { };
    generateKeyPair(): KeyPair {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 512,
            publicKeyEncoding: {
                type: 'spki',
                format: 'der'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'der'
            }
        }
        )
        return { privateKey: Buffer.from(privateKey).toString('hex'), publicKey: Buffer.from(publicKey).toString('hex') }
    }

    getFileName(privateKey: string) {
        return crypto.createPublicKey(privateKey);
    }
}

export default KeyGen;