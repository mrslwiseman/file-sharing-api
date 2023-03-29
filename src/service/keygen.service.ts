import crypto from 'crypto'

interface KeyPair {
    publicKey: string;
    privateKey: string;
}

class KeyGen {
    constructor() { };
    generateKeyPair(): KeyPair {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 1024,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        }
        )
        return { privateKey, publicKey }
    }

    getFileName(privateKey: string) {
        const publicKey = crypto.createPublicKey(privateKey)

        return publicKey;
    }
}

export default KeyGen;