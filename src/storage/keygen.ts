import crypto from 'crypto'

interface KeyPair {
    publicKey: string;
    privateKey: string;
}

class KeyGen {
    generateKeyPair(): KeyPair {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 512,
            publicKeyEncoding: {
                type: 'spki',
                format: 'der'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'der',
            }
        }
        )

        return { privateKey: privateKey.toString('hex'), publicKey: publicKey.toString('hex') }
    }

    getFileName(privateKey: string) {
        const fileName =
            crypto.createPublicKey({
                key: privateKey,
                format: 'der',
                type: 'pkcs1',
                encoding: 'hex'
            }).export({
                type: 'spki',
                format: 'der'
            }).toString('hex')

        return fileName;
    }
}

export default KeyGen;